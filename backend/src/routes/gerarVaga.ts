import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';
import { buildPrompt, SYSTEM_PROMPT } from '../lib/buildPrompt';
import { GerarVagaBody, NivelVaga, Modalidade, TomDescricao } from '../types';

const router = Router();

function getClient(): Groq {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

const NIVEIS: NivelVaga[] = ['estagio', 'junior', 'pleno', 'senior'];
const MODALIDADES: Modalidade[] = ['remoto', 'hibrido', 'presencial'];
const TONS: TomDescricao[] = ['formal', 'moderno', 'descontraido'];

const MAX_CHARS = {
  cargo: 120,
  area: 120,
  responsabilidades: 3000,
  requisitos: 3000,
  diferenciais: 2000,
  beneficios: 2000,
} as const;

const CAMPOS_OBRIGATORIOS = ['cargo', 'area', 'responsabilidades', 'requisitos'] as const;
const CAMPOS_OPCIONAIS = ['diferenciais', 'beneficios'] as const;

function validateBody(body: unknown): body is GerarVagaBody {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;

  for (const field of CAMPOS_OBRIGATORIOS) {
    const v = b[field];
    if (typeof v !== 'string' || v.trim().length === 0 || v.length > MAX_CHARS[field]) {
      return false;
    }
  }

  for (const field of CAMPOS_OPCIONAIS) {
    const v = b[field];
    if (v === undefined || v === '') continue;
    if (typeof v !== 'string' || v.length > MAX_CHARS[field]) return false;
  }

  if (b.anterior !== undefined && typeof b.anterior !== 'string') return false;

  if (!NIVEIS.includes(b.nivel as NivelVaga)) return false;
  if (!MODALIDADES.includes(b.modalidade as Modalidade)) return false;
  if (!TONS.includes(b.tom as TomDescricao)) return false;

  return true;
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

  if (!validateBody(req.body)) {
    res.status(400).json({ erro: 'Campos obrigatórios ausentes ou inválidos.' });
    return;
  }

  const { anterior, ...formData } = req.body as GerarVagaBody;

  try {
    const client = getClient();
    const stream = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
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
    if (res.headersSent) {
      sseWrite(res, { erro: 'Falha ao gerar descrição. Tente novamente.' });
      res.end();
    } else {
      res.status(500).json({ erro: 'Falha ao gerar descrição. Tente novamente.' });
    }
  }
});

export default router;
