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

// Corpo aceito pelo POST /api/gerar-vaga; `anterior` é a descrição
// gerada antes, usada para pedir uma variação de verdade na regeneração.
export type GerarVagaBody = JobFormData & { anterior?: string };
