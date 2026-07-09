import { Router, Request, Response } from 'express';
import Groq from 'groq-sdk';
import { buildPrompt, SYSTEM_PROMPT } from '../lib/buildPrompt';
import { JobFormData, NivelVaga, Modalidade, TomDescricao } from '../types';

const router = Router();

function getClient(): Groq {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

const NIVEIS: NivelVaga[] = ['estagio', 'junior', 'pleno', 'senior'];
const MODALIDADES: Modalidade[] = ['remoto', 'hibrido', 'presencial'];
const TONS: TomDescricao[] = ['formal', 'moderno', 'descontraido'];

function validateBody(body: unknown): body is JobFormData {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;

  for (const field of ['cargo', 'area', 'responsabilidades', 'requisitos']) {
    if (!b[field] || typeof b[field] !== 'string') return false;
  }

  if (!NIVEIS.includes(b.nivel as NivelVaga)) return false;
  if (!MODALIDADES.includes(b.modalidade as Modalidade)) return false;
  if (!TONS.includes(b.tom as TomDescricao)) return false;

  return true;
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

  const { seed, ...formData } = req.body as JobFormData & { seed?: string };

  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildPrompt(formData, seed) },
      ],
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) {
      res.status(500).json({ erro: 'Resposta inesperada da IA.' });
      return;
    }

    res.json({ descricao: text });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ erro: 'Falha ao gerar descrição. Tente novamente.' });
  }
});

export default router;
