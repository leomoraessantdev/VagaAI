import { AreaConfig, AreaPublica, ExtraField, SeniorityLevel } from './types';
import { tecnologia } from './tecnologia';
import { comercialVendas } from './comercial-vendas';
import { marketing } from './marketing';
import { administrativoFinanceiro } from './administrativo-financeiro';
import { recursosHumanos } from './recursos-humanos';
import { logisticaOperacoes } from './logistica-operacoes';
import { saude } from './saude';
import { educacao } from './educacao';
import { juridico } from './juridico';
import { atendimentoCs } from './atendimento-cs';
import { outra } from './outra';

/**
 * Registry de áreas. A ordem de declaração é a ordem exibida na UI —
 * `outra` fica sempre por último.
 */
export const AREAS = {
  tecnologia,
  'comercial-vendas': comercialVendas,
  marketing,
  'administrativo-financeiro': administrativoFinanceiro,
  'recursos-humanos': recursosHumanos,
  'logistica-operacoes': logisticaOperacoes,
  saude,
  educacao,
  juridico,
  'atendimento-cs': atendimentoCs,
  outra,
} satisfies Record<string, AreaConfig>;

export type AreaId = keyof typeof AREAS;

/** Tupla não-vazia: é o formato que `z.enum` exige. */
export const AREA_IDS = Object.keys(AREAS) as [AreaId, ...AreaId[]];

/** Id da área usada quando o recrutador informa a área em texto livre. */
export const AREA_LIVRE_ID: AreaId = 'outra';

export function isAreaId(valor: unknown): valor is AreaId {
  return typeof valor === 'string' && valor in AREAS;
}

export function getArea(id: AreaId): AreaConfig {
  return AREAS[id];
}

export function getSeniority(area: AreaConfig, id: string): SeniorityLevel | undefined {
  return area.seniorityLevels.find((n) => n.id === id);
}

export function getExtraField(area: AreaConfig, id: string): ExtraField | undefined {
  return area.extraFields?.find((f) => f.id === id);
}

/**
 * Registry sem `promptGuidance` — é o que sai em `GET /api/areas`.
 * As instruções de prompt ficam no servidor: não têm utilidade no browser
 * e são a parte que mais muda entre versões.
 */
export function listAreasPublicas(): AreaPublica[] {
  return AREA_IDS.map((id) => {
    const { promptGuidance: _ignorado, ...publica } = AREAS[id];
    return publica;
  });
}

export type { AreaConfig, AreaPublica, ExtraField, ExtraFieldValue, SeniorityLevel } from './types';