import { Router, Request, Response } from 'express';
import Groq, { NotFoundError, RateLimitError } from 'groq-sdk';
import { buildPrompt, SYSTEM_PROMPT } from '../lib/buildPrompt';
import { gerarVagaSchema, primeiroErro } from '../lib/schema';
import { JobFormData } from '../types';

const router = Router();

// A Groq aposenta modelo sem aviso: llama-3.3-70b-versatile passou a responder
// 404 e derrubou a geração em produção. Deixar o id em variável de ambiente faz
// da próxima troca uma mudança de configuração, não um deploy de código.
const MODELO = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

function getClient(): Groq {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

function sseWrite(res: Response, evento: object) {
  res.write(`data: ${JSON.stringify(evento)}\n\n`);
}

router.post('/gerar-vaga', async (req: Request, res: Response) => {
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY não configurada.');
    res.status(500).json({ erro: 'Servidor sem configuração de IA. Contate o administrador.' });
    return;
  }

  const validacao = gerarVagaSchema.safeParse(req.body);
  if (!validacao.success) {
    res.status(400).json({ erro: primeiroErro(validacao.error) });
    return;
  }

  const { anterior, ...resto } = validacao.data;
  // Anotação proposital: quebra a compilação se o schema deixar de produzir
  // exatamente o payload que o construtor de prompt espera.
  const formData: JobFormData = resto;

  try {
    const client = getClient();
    const stream = await client.chat.completions.create({
      model: MODELO,
      // Modelo de raciocínio: no esforço baixo ele não gasta o orçamento de
      // tokens pensando, e a descrição sai completa dentro do limite.
      reasoning_effort: 'low',
      max_tokens: 2048,
      // Regeneração pede mais variação; primeira geração fica mais estável.
      temperature: anterior ? 1.1 : 0.8,
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPrompt(formData, anterior) },
      ],
    });

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    let finishReason: string | null = null;
    let enviouTexto = false;

    for await (const chunk of stream) {
      const escolha = chunk.choices[0];
      const delta = escolha?.delta?.content;
      if (delta) {
        enviouTexto = true;
        sseWrite(res, { delta });
      }
      finishReason = escolha?.finish_reason ?? finishReason;
    }

    if (!enviouTexto) {
      sseWrite(res, { erro: 'Resposta inesperada da IA.' });
    } else {
      sseWrite(res, { done: true, truncada: finishReason === 'length' });
    }
    res.end();
  } catch (error) {
    console.error('Groq API error:', error);
    // Groq free tier tem limite diário/por minuto compartilhado pela conta —
    // ao bater o teto, avisa o usuário em vez de devolver erro genérico.
    const limiteEstourado = error instanceof RateLimitError;
    // Modelo aposentado devolve 404: sem mensagem própria, o operador só vê
    // "falha ao gerar" e não descobre que basta trocar GROQ_MODEL.
    const modeloSumiu = error instanceof NotFoundError;
    if (modeloSumiu) {
      console.error(
        `Modelo "${MODELO}" indisponível na Groq. Ajuste a variável GROQ_MODEL.`,
      );
    }

    const mensagem = limiteEstourado
      ? 'Estamos com alta demanda no momento. Tente novamente em alguns minutos.'
      : modeloSumiu
        ? 'O modelo de IA configurado está indisponível. Avise o administrador.'
        : 'Falha ao gerar descrição. Tente novamente.';
    if (res.headersSent) {
      sseWrite(res, { erro: mensagem });
      res.end();
    } else {
      res.status(limiteEstourado ? 503 : modeloSumiu ? 503 : 500).json({ erro: mensagem });
    }
  }
});

export default router;