import { JobFormData } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? '';
// Generosos de propósito: streaming mantém a conexão aberta durante toda a geração.
const TIMEOUT_MS = 90_000;

interface EventoSSE {
  delta?: string;
  done?: boolean;
  truncada?: boolean;
  erro?: string;
}

export interface GeracaoResultado {
  texto: string;
  truncada: boolean;
}

function parseEvento(bloco: string): EventoSSE | null {
  const linha = bloco.split('\n').find((l) => l.startsWith('data:'));
  if (!linha) return null;
  try {
    return JSON.parse(linha.slice(5)) as EventoSSE;
  } catch {
    return null;
  }
}

async function lerStream(
  body: ReadableStream<Uint8Array>,
  onChunk?: (parcial: string) => void,
): Promise<GeracaoResultado> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let texto = '';
  let truncada = false;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const evento = parseEvento(buffer.slice(0, idx));
      buffer = buffer.slice(idx + 2);
      if (!evento) continue;
      if (evento.erro) throw new Error(evento.erro);
      if (evento.delta) {
        texto += evento.delta;
        onChunk?.(texto);
      }
      if (evento.done) truncada = Boolean(evento.truncada);
    }
  }

  if (!texto) throw new Error('Resposta inesperada do servidor.');
  return { texto, truncada };
}

export async function gerarDescricao(
  data: JobFormData & { anterior?: string },
  onChunk?: (parcial: string) => void,
): Promise<GeracaoResultado> {
  let res: Response;
  try {
    res = await fetch(`${BASE}/api/gerar-vaga`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const timeout = err instanceof DOMException && err.name === 'TimeoutError';
    throw new Error(
      timeout
        ? 'Tempo esgotado ao gerar a descrição. Tente novamente.'
        : 'Erro ao conectar com o servidor.',
    );
  }

  if (!res.ok) {
    let mensagem = 'Erro ao conectar com o servidor.';
    try {
      const corpo = (await res.json()) as { erro?: string };
      if (corpo.erro) mensagem = corpo.erro;
    } catch {
      // corpo não-JSON (ex.: página HTML de erro do proxy) — mantém mensagem genérica
    }
    throw new Error(mensagem);
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('text/event-stream')) {
    // Proxy com buffer pode entregar JSON de uma vez — aceita como fallback.
    const corpo = (await res.json()) as { descricao?: string };
    if (typeof corpo.descricao === 'string') {
      return { texto: corpo.descricao, truncada: false };
    }
    throw new Error('Resposta inesperada do servidor.');
  }

  if (!res.body) throw new Error('Resposta inesperada do servidor.');
  return lerStream(res.body, onChunk);
}
