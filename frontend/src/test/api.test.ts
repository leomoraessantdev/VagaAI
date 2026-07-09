import { vi, describe, it, expect, beforeEach } from 'vitest';
import { JobFormData } from '../types';

const mockPost = vi.fn();
vi.mock('axios', () => ({ default: { post: mockPost } }));

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

describe('gerarDescricao', () => {
  beforeEach(() => mockPost.mockClear());

  it('calls /api/gerar-vaga with form data and returns descricao', async () => {
    mockPost.mockResolvedValueOnce({ data: { descricao: 'Descrição gerada.' } });
    const { gerarDescricao } = await import('../lib/api');
    const result = await gerarDescricao(formData);
    expect(mockPost).toHaveBeenCalledWith('/api/gerar-vaga', formData);
    expect(result).toBe('Descrição gerada.');
  });

  it('throws error message from API response', async () => {
    mockPost.mockRejectedValueOnce({
      response: { data: { erro: 'Chave inválida.' } },
    });
    const { gerarDescricao } = await import('../lib/api');
    await expect(gerarDescricao(formData)).rejects.toThrow('Chave inválida.');
  });

  it('throws fallback message when no response body', async () => {
    mockPost.mockRejectedValueOnce(new Error('Network error'));
    const { gerarDescricao } = await import('../lib/api');
    await expect(gerarDescricao(formData)).rejects.toThrow('Erro ao conectar com o servidor.');
  });
});
