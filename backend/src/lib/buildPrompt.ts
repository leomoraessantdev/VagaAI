import { JobFormData, NivelVaga, Modalidade, TomDescricao } from '../types';

const nivelMap: Record<NivelVaga, string> = {
  estagio: 'Estágio',
  junior: 'Júnior',
  pleno: 'Pleno',
  senior: 'Sênior',
};

const modalidadeMap: Record<Modalidade, string> = {
  remoto: 'Remoto',
  hibrido: 'Híbrido',
  presencial: 'Presencial',
};

const tomMap: Record<TomDescricao, string> = {
  formal: 'tom formal e profissional, linguagem corporativa',
  moderno: 'tom moderno e dinâmico, linguagem contemporânea e direta',
  descontraido: 'tom descontraído e acolhedor, linguagem próxima e humana',
};

export const SYSTEM_PROMPT =
  'Você é um especialista em recrutamento e employer branding com 10 anos de experiência no mercado brasileiro. ' +
  'Você escreve descrições de vagas que atraem candidatos qualificados, são claras e honestas. ' +
  'Suas descrições são sempre em português brasileiro, bem estruturadas e adequadas para publicação ' +
  'em plataformas profissionais como LinkedIn, Gupy e Indeed. ' +
  'Use formatação com títulos em negrito e listas quando apropriado.';

// Quanto da descrição anterior entra no prompt de regeneração —
// suficiente para o modelo evitar repetir estrutura sem estourar contexto.
const MAX_ANTERIOR = 1500;

export function buildPrompt(data: JobFormData, anterior?: string): string {
  const nivel = nivelMap[data.nivel];
  const modalidade = modalidadeMap[data.modalidade];
  const tom = tomMap[data.tom];

  let prompt =
    `Crie uma descrição de vaga de emprego profissional e atrativa em português brasileiro:\n\n` +
    `**Cargo:** ${data.cargo} — ${nivel}\n` +
    `**Área/Setor:** ${data.area}\n` +
    `**Modalidade:** ${modalidade}\n\n` +
    `**Principais Responsabilidades:**\n${data.responsabilidades}\n\n` +
    `**Requisitos Técnicos:**\n${data.requisitos}`;

  if (data.diferenciais) {
    prompt += `\n\n**Diferenciais Desejados:**\n${data.diferenciais}`;
  }

  if (data.beneficios) {
    prompt += `\n\n**Benefícios Oferecidos:**\n${data.beneficios}`;
  }

  prompt += `\n\nUtilize ${tom}. Seja específico e evite linguagem genérica.`;

  if (anterior) {
    prompt +=
      `\n\nIMPORTANTE: Crie uma versão DIFERENTE da descrição abaixo — varie a estrutura, ` +
      `a abertura e o vocabulário, mantendo as informações da vaga:\n---\n` +
      `${anterior.slice(0, MAX_ANTERIOR)}\n---`;
  }

  return prompt;
}
