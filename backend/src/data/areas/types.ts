/**
 * Contrato do registry de áreas.
 *
 * Adicionar uma área nova = criar um arquivo aqui exportando um `AreaConfig` e
 * registrá-lo em `index.ts`. Nenhum componente de UI, schema de validação ou
 * trecho de prompt precisa ser alterado — a UI consome o registry por
 * `GET /api/areas` e o prompt é composto a partir dele.
 */

export interface SeniorityLevel {
  /** Id estável: vai para o payload e para o histórico salvo no navegador. */
  id: string;
  label: string;
  /** Faixa de experiência típica no mercado BR. Ex.: "2 a 5 anos". */
  yearsHint?: string;
  /** Escopo esperado. Ex.: "executa com autonomia, não lidera pessoas". */
  scopeHint?: string;
}

export interface ExtraFieldOption {
  id: string;
  label: string;
}

interface ExtraFieldBase {
  id: string;
  label: string;
  /** Texto de apoio exibido abaixo do campo. */
  ajuda?: string;
  /** Rótulo usado no prompt quando difere do label da UI. */
  promptLabel?: string;
}

/**
 * União discriminada: cada `tipo` carrega só o que faz sentido para ele, e o
 * schema zod é derivado daqui sem `any` nem cast.
 */
export type ExtraField =
  | (ExtraFieldBase & { tipo: 'texto'; placeholder?: string; maxLength?: number })
  | (ExtraFieldBase & { tipo: 'select'; opcoes: ExtraFieldOption[] })
  | (ExtraFieldBase & { tipo: 'multi'; opcoes: ExtraFieldOption[] })
  | (ExtraFieldBase & { tipo: 'boolean' });

export type ExtraFieldValue = string | string[] | boolean;

/** Limite de caracteres de um `extraField` do tipo texto quando não declarado. */
export const EXTRA_TEXTO_MAX_PADRAO = 200;

export interface AreaConfig {
  id: string;
  label: string;
  /** Emoji do card de seleção de área. */
  icon: string;
  /** Uma linha explicando o que cai nesta área, exibida no card. */
  descricao: string;
  /** Escala de senioridade real da área — nunca a de TI reaproveitada. */
  seniorityLevels: SeniorityLevel[];
  /** Sugestões para o combobox de cargo; nunca travam a digitação livre. */
  commonRoles: string[];
  /** Rótulo do campo de requisitos/ferramentas nesta área. */
  skillLabel: string;
  skillPlaceholder: string;
  extraFields?: ExtraField[];
  /** Vocabulário e ênfases da área, injetados no prompt. Não vai para o browser. */
  promptGuidance: string;
}

/** Recorte do `AreaConfig` que a UI recebe — sem `promptGuidance`. */
export type AreaPublica = Omit<AreaConfig, 'promptGuidance'>;