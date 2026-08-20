/**
 * Catálogos de opções comuns a todas as áreas.
 *
 * Os tipos são derivados dos próprios dados (`as const satisfies`), então a
 * lista é a única fonte de verdade: ela alimenta o schema zod, os rótulos do
 * prompt e as opções que a UI recebe em `GET /api/areas`.
 */

export interface Opcao {
  id: string;
  label: string;
  /** Explicação curta; vai para o prompt quando o label sozinho é ambíguo. */
  hint?: string;
}

export const MODALIDADES = [
  { id: 'presencial', label: 'Presencial' },
  { id: 'hibrido', label: 'Híbrido' },
  { id: 'remoto', label: 'Remoto' },
] as const satisfies readonly Opcao[];
export type Modalidade = (typeof MODALIDADES)[number]['id'];

export const CONTRATOS = [
  { id: 'clt', label: 'CLT' },
  { id: 'pj', label: 'PJ' },
  { id: 'estagio', label: 'Estágio' },
  { id: 'temporario', label: 'Temporário' },
  { id: 'aprendiz', label: 'Jovem Aprendiz' },
  { id: 'freelancer', label: 'Freelancer' },
] as const satisfies readonly Opcao[];
export type TipoContrato = (typeof CONTRATOS)[number]['id'];

export const JORNADAS = [
  { id: 'integral', label: 'Integral', hint: 'até 44 horas semanais' },
  { id: 'meio-periodo', label: 'Meio período', hint: 'até 30 horas semanais' },
  { id: 'escala-6x1', label: 'Escala 6x1', hint: 'seis dias de trabalho por um de folga' },
  { id: 'escala-12x36', label: 'Escala 12x36', hint: 'doze horas de trabalho por trinta e seis de descanso' },
  { id: 'turnos', label: 'Turnos / revezamento', hint: 'turnos alternados, incluindo noturno quando aplicável' },
] as const satisfies readonly Opcao[];
export type Jornada = (typeof JORNADAS)[number]['id'];

export const BENEFICIOS = [
  { id: 'vale-transporte', label: 'Vale-transporte' },
  { id: 'vale-refeicao', label: 'Vale-refeição (VR)' },
  { id: 'vale-alimentacao', label: 'Vale-alimentação (VA)' },
  { id: 'plano-saude', label: 'Plano de saúde' },
  { id: 'plano-odontologico', label: 'Plano odontológico' },
  { id: 'seguro-vida', label: 'Seguro de vida' },
  { id: 'plr', label: 'PLR / participação nos lucros' },
  { id: 'day-off', label: 'Day off no aniversário' },
  { id: 'auxilio-creche', label: 'Auxílio-creche' },
  { id: 'gympass', label: 'Gympass / Wellhub' },
] as const satisfies readonly Opcao[];
export type Beneficio = (typeof BENEFICIOS)[number]['id'];

export const AFIRMATIVAS = [
  { id: 'pcd', label: 'Pessoas com deficiência (PCD)' },
  { id: 'mulheres', label: 'Mulheres' },
  { id: 'pessoas-negras', label: 'Pessoas negras' },
  { id: '50-mais', label: 'Pessoas 50+' },
  { id: 'lgbtqia', label: 'Pessoas LGBTQIA+' },
] as const satisfies readonly Opcao[];
export type Afirmativa = (typeof AFIRMATIVAS)[number]['id'];

export const TONS = [
  {
    id: 'formal',
    label: 'Formal corporativo',
    hint: 'linguagem sóbria, terceira pessoa, sem gírias nem exclamações',
  },
  {
    id: 'moderno',
    label: 'Neutro profissional',
    hint: 'linguagem clara e direta, nem engessada nem informal demais',
  },
  {
    id: 'descontraido',
    label: 'Descontraído',
    hint: 'linguagem próxima e acolhedora, falando diretamente com a pessoa candidata, sem perder a clareza',
  },
] as const satisfies readonly Opcao[];
export type TomDescricao = (typeof TONS)[number]['id'];

export const PERIODOS_SALARIO = [
  { id: 'mes', label: 'por mês' },
  { id: 'hora', label: 'por hora' },
] as const satisfies readonly Opcao[];
export type PeriodoSalario = (typeof PERIODOS_SALARIO)[number]['id'];

export const PLATAFORMAS = [
  {
    id: 'generico',
    label: 'Uso geral',
    hint: 'formatação padrão, serve para qualquer site de vagas',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    hint: 'o LinkedIn não renderiza cabeçalhos markdown: use apenas negrito nos títulos de seção, bullets curtos e parágrafos espaçados',
  },
  {
    id: 'gupy',
    label: 'Gupy',
    hint: 'a Gupy tem campos separados: deixe cada seção autocontida e isolada por uma linha em branco, sem referência cruzada entre seções, para o recrutador colar cada bloco no campo correspondente',
  },
  {
    id: 'indeed',
    label: 'Indeed',
    hint: 'o Indeed exibe formatação de forma limitada: prefira texto simples e objetivo, bullets com hífen e pouco negrito',
  },
] as const satisfies readonly Opcao[];
export type Plataforma = (typeof PLATAFORMAS)[number]['id'];

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;
export type UF = (typeof UFS)[number];

/** Ids em formato de tupla não-vazia — é o que `z.enum` exige. */
function idsDe<T extends string>(lista: readonly { id: T }[]): [T, ...T[]] {
  return lista.map((o) => o.id) as [T, ...T[]];
}

export const MODALIDADE_IDS = idsDe(MODALIDADES);
export const CONTRATO_IDS = idsDe(CONTRATOS);
export const JORNADA_IDS = idsDe(JORNADAS);
export const BENEFICIO_IDS = idsDe(BENEFICIOS);
export const AFIRMATIVA_IDS = idsDe(AFIRMATIVAS);
export const TOM_IDS = idsDe(TONS);
export const PERIODO_SALARIO_IDS = idsDe(PERIODOS_SALARIO);
export const PLATAFORMA_IDS = idsDe(PLATAFORMAS);

/** Label de uma opção pelo id; devolve o próprio id se não encontrar. */
export function rotulo(lista: readonly Opcao[], id: string): string {
  return lista.find((o) => o.id === id)?.label ?? id;
}

/** Label acrescido do hint entre parênteses, quando houver. */
export function rotuloDetalhado(lista: readonly Opcao[], id: string): string {
  const opcao = lista.find((o) => o.id === id);
  if (!opcao) return id;
  return opcao.hint ? `${opcao.label} (${opcao.hint})` : opcao.label;
}

/** Lista de labels a partir de ids; ignora ids desconhecidos. */
export function rotulos(lista: readonly Opcao[], selecionados: readonly string[]): string[] {
  return selecionados
    .map((id) => lista.find((o) => o.id === id)?.label)
    .filter((label): label is string => label !== undefined);
}