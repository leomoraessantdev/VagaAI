import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JobFormData } from '../types';

const mockFetch = vi.fn();

const formData: JobFormData = {
  cargo: 'Dev',
  area: 'Tech',
  nivel: 'pleno',
  modalidade: 'remoto',
  responsabilidades: 'Codar',
  requisitos: 'React',
  diferenciais: '',
  beneficios: '',
  tom: 'moderno',
};

function sseResponse(eventos: object[]): Response {
  const body = eventos.map((e) => `data: ${JSON.stringify(e)}\n\n`).join('');
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
  });
}

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});

afterEach(() => vi.unstubAllGlobals());

describe('gerarDescricao', () => {
  it('posts form data and concatenates streamed deltas', async () => {
    mockFetch.mockResolvedValueOnce(
      sseResponse([{ delta: 'Descrição ' }, { delta: 'gerada.' }, { done: true, truncada: false }]),
    );
    const { gerarDescricao } = await import('../lib/api');
    const result = await gerarDescricao(formData);

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/gerar-vaga');
    expect(JSON.parse(init.body)).toEqual(formData);

    expect(result.texto).toBe('Descrição gerada.');
    expect(result.truncada).toBe(false);
  });

  it('reports progressive text through onChunk', async () => {
    mockFetch.mockResolvedValueOnce(
      sseResponse([{ delta: 'Olá ' }, { delta: 'mundo' }, { done: true, truncada: false }]),
    );
    const { gerarDescricao } = await import('../lib/api');
    const parciais: string[] = [];
    await gerarDescricao(formData, (p) => parciais.push(p));
    expect(parciais).toEqual(['Olá ', 'Olá mundo']);
  });

  it('flags truncada when done event says so', async () => {
    mockFetch.mockResolvedValueOnce(
      sseResponse([{ delta: 'Texto' }, { done: true, truncada: true }]),
    );
    const { gerarDescricao } = await import('../lib/api');
    const result = await gerarDescricao(formData);
    expect(result.truncada).toBe(true);
  });

  it('throws error message from non-ok JSON response', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ erro: 'Chave inválida.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const { gerarDescricao } = await import('../lib/api');
    await expect(gerarDescricao(formData)).rejects.toThrow('Chave inválida.');
  });

  it('throws erro received as SSE event mid-stream', async () => {
    mockFetch.mockResolvedValueOnce(
      sseResponse([{ delta: 'Começo' }, { erro: 'Falha ao gerar descrição. Tente novamente.' }]),
    );
    const { gerarDescricao } = await import('../lib/api');
    await expect(gerarDescricao(formData)).rejects.toThrow('Falha ao gerar descrição');
  });

  it('supports plain JSON response as fallback', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ descricao: 'Descrição sem streaming.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const { gerarDescricao } = await import('../lib/api');
    const result = await gerarDescricao(formData);
    expect(result.texto).toBe('Descrição sem streaming.');
  });

  it('throws fallback message on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new TypeError('Network error'));
    const { gerarDescricao } = await import('../lib/api');
    await expect(gerarDescricao(formData)).rejects.toThrow('Erro ao conectar com o servidor.');
  });

  it('sends anterior when provided', async () => {
    mockFetch.mockResolvedValueOnce(
      sseResponse([{ delta: 'Nova versão' }, { done: true, truncada: false }]),
    );
    const { gerarDescricao } = await import('../lib/api');
    await gerarDescricao({ ...formData, anterior: 'Versão antiga' });
    const [, init] = mockFetch.mock.calls[0];
    expect(JSON.parse(init.body).anterior).toBe('Versão antiga');
  });
});
