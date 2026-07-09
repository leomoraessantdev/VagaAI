import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { buildPrompt, SYSTEM_PROMPT } from '../lib/buildPrompt';
import { JobFormData, NivelVaga, Modalidade, TomDescricao } from '../types';

const router = Router();

function getClient(): Anthropic {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
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
  if (!validateBody(req.body)) {
    res.status(400).json({ erro: 'Campos obrigatórios ausentes ou inválidos.' });
    return;
  }

  const { seed, ...formData } = req.body as JobFormData & { seed?: string };

  try {
    const client = getClient();
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildPrompt(formData, seed) }],
    });

    const textBlock = message.content.find((c) => c.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      res.status(500).json({ erro: 'Resposta inesperada da IA.' });
      return;
    }

    res.json({ descricao: textBlock.text });
  } catch (error) {
    console.error('Anthropic API error:', error);
    res.status(500).json({ erro: 'Falha ao gerar descrição. Tente novamente.' });
  }
});

export default router;
