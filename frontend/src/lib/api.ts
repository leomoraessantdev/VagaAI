import axios from 'axios';
import { JobFormData, GerarVagaResponse } from '../types';

const BASE = import.meta.env.VITE_API_URL ?? '';

export async function gerarDescricao(data: JobFormData & { seed?: string }): Promise<string> {
  try {
    const res = await axios.post<GerarVagaResponse>(`${BASE}/api/gerar-vaga`, data);
    return res.data.descricao;
  } catch (err: unknown) {
    const axiosErr = err as { response?: { data?: { erro?: string } } };
    throw new Error(axiosErr.response?.data?.erro ?? 'Erro ao conectar com o servidor.');
  }
}
