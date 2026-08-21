/**
 * Espelho do que `GET /api/areas` devolve. O backend é a fonte de verdade:
 * adicionar uma área lá aparece aqui sem tocar em componente nenhum.
 *
 * `JobFormData` é escrito à mão porque front e back são deploys separados e
 * não compartilham build. Os campos abertos (`area`, `modalidade`, `tom`) são
 * `string` de propósito: os valores válidos chegam do registry em tempo de
 * execução, não em tempo de compilação.
 *
 * O que impede os dois lados de divergirem em silêncio é o bloco "contrato com
 * o formulário do frontend" em backend/tests/schema.test.ts. Campo obrigatório
 * novo no zod quebra aquele teste antes de quebrar aqui com 400.
 */

export interface Opcao {
  id: string;
  label: string;
  hint?: string;
}

export interface SeniorityLevel {
  id: string;
  label: string;
  yearsHint?: string;
  scopeHint?: string;
}

export interface ExtraFieldOption {
  id: string;
  label: string;
}

interface ExtraFieldBase {
  id: string;
  label: string;
  ajuda?: string;
}

export type ExtraField =
  | (ExtraFieldBase & { tipo: 'texto'; placeholder?: string; maxLength?: number })
  | (ExtraFieldBase & { tipo: 'select'; opcoes: ExtraFieldOption[] })
  | (ExtraFieldBase & { tipo: 'multi'; opcoes: ExtraFieldOption[] })
  | (ExtraFieldBase & { tipo: 'boolean' });

export type ExtraFieldValue = string | string[] | boolean;

export interface AreaPublica {
  id: string;
  label: string;
  icon: string;
  descricao: string;
  seniorityLevels: SeniorityLevel[];
  commonRoles: string[];
  skillLabel: string;
  skillPlaceholder: string;
  extraFields?: ExtraField[];
}

export interface Catalogos {
  modalidades: Opcao[];
  contratos: Opcao[];
  jornadas: Opcao[];
  beneficios: Opcao[];
  afirmativas: Opcao[];
  tons: Opcao[];
  periodosSalario: Opcao[];
  plataformas: Opcao[];
  ufs: string[];
}

export interface Limites {
  cargo: number;
  areaLivre: number;
  empresa: number;
  sobreEmpresa: number;
  cidade: number;
  responsabilidades: number;
  requisitos: number;
  diferenciais: number;
  beneficiosExtras: number;
  anterior: number;
}

export interface Registry {
  areas: AreaPublica[];
  catalogos: Catalogos;
  limites: Limites;
}

export interface FaixaSalarial {
  min?: number;
  max?: number;
  periodo: string;
  divulgar: boolean;
}

export interface JobFormData {
  area: string;
  areaLivre?: string;
  cargo: string;
  senioridade: string;

  empresa?: string;
  sobreEmpresa?: string;

  modalidade: string;
  cidade?: string;
  uf?: string;
  contrato?: string;
  jornada?: string;
  salario?: FaixaSalarial;
  beneficios?: string[];
  beneficiosExtras?: string;
  afirmativa?: string[];

  responsabilidades?: string;
  requisitos?: string;
  diferenciais?: string;

  extras?: Record<string, ExtraFieldValue>;

  tom: string;
  linguagemNeutra?: boolean;
  plataforma?: string;
}

export interface HistoryEntry {
  id: string;
  cargo: string;
  descricao: string;
  timestamp: number;
  /** Ausente em entradas salvas antes do formulário completo ser guardado. */
  form?: JobFormData;
}