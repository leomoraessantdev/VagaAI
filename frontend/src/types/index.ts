export type NivelVaga = 'estagio' | 'junior' | 'pleno' | 'senior';
export type Modalidade = 'remoto' | 'hibrido' | 'presencial';
export type TomDescricao = 'formal' | 'moderno' | 'descontraido';

export interface JobFormData {
  cargo: string;
  area: string;
  nivel: NivelVaga;
  modalidade: Modalidade;
  responsabilidades: string;
  requisitos: string;
  diferenciais: string;
  beneficios: string;
  tom: TomDescricao;
}

export interface HistoryEntry {
  id: string;
  cargo: string;
  descricao: string;
  timestamp: number;
  // Ausente em entradas antigas salvas antes do form completo ser guardado;
  // sem ele não dá para regenerar a partir do histórico.
  form?: JobFormData;
}
