import type { AreaId } from '../data/areas';
import type {
  Afirmativa,
  Beneficio,
  Jornada,
  Modalidade,
  PeriodoSalario,
  Plataforma,
  TipoContrato,
  TomDescricao,
  UF,
} from '../data/catalogos';
import type { ExtraFieldValue } from '../data/areas/types';

export type { AreaId };
export type {
  Afirmativa,
  Beneficio,
  Jornada,
  Modalidade,
  PeriodoSalario,
  Plataforma,
  TipoContrato,
  TomDescricao,
  UF,
} from '../data/catalogos';
export type { ExtraFieldValue };

export interface FaixaSalarial {
  min?: number;
  max?: number;
  periodo: PeriodoSalario;
  /** Falso publica "a combinar" em vez dos valores. */
  divulgar: boolean;
}

/**
 * Payload da vaga. Só `area`, `cargo` e `senioridade` são obrigatórios —
 * o resto o modelo deduz a partir do cargo e do nível, para que um recrutador
 * consiga publicar uma vaga usável preenchendo três campos.
 */
export interface JobFormData {
  // --- Identificação (obrigatórios) ---
  area: AreaId;
  /** Nome da área digitado pelo recrutador quando `area === 'outra'`. */
  areaLivre?: string;
  cargo: string;
  /** Id de um `seniorityLevel` da área escolhida — validado contra o registry. */
  senioridade: string;

  // --- Empresa ---
  empresa?: string;
  /** Uma linha sobre a empresa; sem isso a seção "Sobre a empresa" é omitida. */
  sobreEmpresa?: string;

  // --- Condições ---
  modalidade: Modalidade;
  /** Obrigatórios quando a modalidade não é remota. */
  cidade?: string;
  uf?: UF;
  contrato?: TipoContrato;
  jornada?: Jornada;
  salario?: FaixaSalarial;
  beneficios?: Beneficio[];
  /** Benefícios fora do catálogo padrão, em texto livre. */
  beneficiosExtras?: string;
  afirmativa?: Afirmativa[];

  // --- Conteúdo (opcionais: o modelo deduz o que faltar) ---
  responsabilidades?: string;
  requisitos?: string;
  diferenciais?: string;

  // --- Campos exclusivos da área, definidos por `AreaConfig.extraFields` ---
  extras?: Record<string, ExtraFieldValue>;

  // --- Estilo ---
  tom: TomDescricao;
  /** Onde a vaga vai ser publicada; ajusta só a formatação da saída. */
  plataforma?: Plataforma;
  /** Linguagem neutra de gênero. Padrão ligado. */
  linguagemNeutra?: boolean;
}

// Corpo aceito pelo POST /api/gerar-vaga; `anterior` é a descrição
// gerada antes, usada para pedir uma variação de verdade na regeneração.
export type GerarVagaBody = JobFormData & { anterior?: string };