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
  seed?: string;
}
