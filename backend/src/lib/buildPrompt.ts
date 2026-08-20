import {
  AFIRMATIVAS,
  BENEFICIOS,
  CONTRATOS,
  JORNADAS,
  MODALIDADES,
  PERIODOS_SALARIO,
  PLATAFORMAS,
  TONS,
  rotulo,
  rotuloDetalhado,
  rotulos,
} from '../data/catalogos';
import { AreaConfig, ExtraField, ExtraFieldValue, getArea, getExtraField, getSeniority } from '../data/areas';
import { FaixaSalarial, JobFormData } from '../types';

export const SYSTEM_PROMPT =
  'Você é um especialista em recrutamento e seleção com 15 anos de experiência no mercado brasileiro, ' +
  'acostumado a escrever vagas de todas as áreas — do chão de fábrica ao corporativo. ' +
  'Você escreve descrições claras, honestas e específicas, que uma pessoa candidata entende em trinta segundos. ' +
  'Escreve sempre em português brasileiro, com a nomenclatura real do mercado de trabalho do país ' +
  '(CLT, PJ, VT, VR, VA, PLR, escalas de turno, adicionais). ' +
  'Você nunca inventa informação que o recrutador não forneceu sobre a empresa, o salário ou os benefícios. ' +
  'Formata com títulos em negrito e listas, pronto para publicar no LinkedIn, na Gupy ou no Indeed.';

// Quanto da descrição anterior entra no prompt de regeneração —
// suficiente para o modelo evitar repetir estrutura sem estourar contexto.
const MAX_ANTERIOR = 1500;

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

/** Junta rótulo e valor numa linha do bloco de dados do prompt. */
function linha(rotuloCampo: string, valor: string | undefined | null): string | null {
  if (valor === undefined || valor === null) return null;
  const limpo = valor.trim();
  return limpo ? `- ${rotuloCampo}: ${limpo}` : null;
}

function bloco(titulo: string, linhas: (string | null)[]): string | null {
  const preenchidas = linhas.filter((l): l is string => l !== null);
  return preenchidas.length > 0 ? `${titulo}\n${preenchidas.join('\n')}` : null;
}

/** Nome da área como o recrutador a enxerga; respeita o campo livre de "Outra área". */
function nomeDaArea(data: JobFormData, area: AreaConfig): string {
  const livre = data.areaLivre?.trim();
  return livre ? livre : area.label;
}

function descreverSenioridade(data: JobFormData, area: AreaConfig): string {
  const nivel = getSeniority(area, data.senioridade);
  if (!nivel) return data.senioridade;
  const detalhes = [nivel.yearsHint, nivel.scopeHint].filter(Boolean).join('; ');
  return detalhes ? `${nivel.label} (${detalhes})` : nivel.label;
}

function descreverLocal(data: JobFormData): string {
  const modalidade = rotulo(MODALIDADES, data.modalidade);
  if (data.modalidade === 'remoto') return `${modalidade} (sem exigência de presença no escritório)`;
  const local = [data.cidade?.trim(), data.uf].filter(Boolean).join(' / ');
  return local ? `${modalidade} em ${local}` : modalidade;
}

function descreverSalario(salario: FaixaSalarial): string {
  if (!salario.divulgar) {
    return 'não divulgar valores — escreva "A combinar" na seção de benefícios';
  }
  const periodo = rotulo(PERIODOS_SALARIO, salario.periodo);
  const { min, max } = salario;
  if (min !== undefined && max !== undefined) return `${BRL.format(min)} a ${BRL.format(max)} ${periodo}`;
  if (min !== undefined) return `a partir de ${BRL.format(min)} ${periodo}`;
  if (max !== undefined) return `até ${BRL.format(max)} ${periodo}`;
  return 'não informada — escreva "A combinar"';
}

/** Converte o valor de um `extraField` no texto que entra no prompt. */
function descreverExtra(campo: ExtraField, valor: ExtraFieldValue): string | null {
  switch (campo.tipo) {
    case 'texto':
      return typeof valor === 'string' && valor.trim() ? valor.trim() : null;
    case 'select':
      return typeof valor === 'string' ? rotulo(campo.opcoes, valor) : null;
    case 'multi': {
      if (!Array.isArray(valor)) return null;
      const marcados = rotulos(campo.opcoes, valor);
      return marcados.length > 0 ? marcados.join('; ') : null;
    }
    case 'boolean':
      return valor === true ? 'sim' : null;
  }
}

function blocoIdentificacao(data: JobFormData, area: AreaConfig): string {
  return bloco('DADOS DA VAGA', [
    linha('Cargo', data.cargo),
    linha('Área', nomeDaArea(data, area)),
    linha('Nível', descreverSenioridade(data, area)),
    linha(
      'Empresa',
      data.empresa
        ? `${data.empresa} — cite este nome de forma natural na descrição da posição`
        : undefined,
    ),
    linha('Sobre a empresa', data.sobreEmpresa),
  ]) as string;
}

function blocoCondicoes(data: JobFormData): string | null {
  const beneficios = rotulos(BENEFICIOS, data.beneficios ?? []);
  const afirmativa = rotulos(AFIRMATIVAS, data.afirmativa ?? []);

  // Sem nada sobre remuneração, o modelo tende a preencher a seção de
  // benefícios com o pacote CLT padrão. A proibição precisa estar aqui, junto
  // do dado ausente: no bloco de formato ela era ignorada.
  const semRemuneracao =
    beneficios.length === 0 && !data.beneficiosExtras?.trim() && data.salario === undefined;
  return bloco('CONDIÇÕES', [
    linha('Local e modalidade', descreverLocal(data)),
    linha('Tipo de contrato', data.contrato ? rotulo(CONTRATOS, data.contrato) : null),
    linha('Jornada', data.jornada ? rotuloDetalhado(JORNADAS, data.jornada) : null),
    linha('Faixa salarial', data.salario ? descreverSalario(data.salario) : null),
    linha('Benefícios informados', beneficios.length > 0 ? beneficios.join('; ') : null),
    linha('Outros benefícios', data.beneficiosExtras),
    linha(
      'Remuneração e benefícios',
      semRemuneracao
        ? 'NADA foi informado sobre salário ou benefícios. OMITA a seção Benefícios por completo e ' +
          'não invente vale-transporte, vale-refeição, plano de saúde, PLR nem qualquer outra ' +
          'vantagem — inventar benefício gera reclamação trabalhista'
        : null,
    ),
    linha(
      'Vaga afirmativa',
      afirmativa.length > 0
        ? afirmativa.join('; ') +
            ' — a vaga é afirmativa para esse público. Diga isso na descrição da posição e no convite ' +
            'final, de forma acolhedora, como prioridade de contratação e nunca como exclusão de ' +
            'outras pessoas'
        : null,
    ),
  ]);
}

function blocoConteudo(data: JobFormData, area: AreaConfig): string {
  const linhas: (string | null)[] = [
    linha('Responsabilidades informadas', data.responsabilidades),
    linha(`${area.skillLabel} / requisitos informados`, data.requisitos),
    linha('Diferenciais informados', data.diferenciais),
  ];

  const faltando: string[] = [];
  if (!data.responsabilidades?.trim()) faltando.push('as responsabilidades');
  if (!data.requisitos?.trim()) faltando.push('os requisitos');

  if (faltando.length > 0) {
    linhas.push(
      `- O recrutador não informou ${faltando.join(' nem ')}. Deduza a partir do cargo, do nível e da ` +
        'área o que é praxe no mercado brasileiro para essa função. Seja específico o bastante para ser ' +
        'útil e genérico o bastante para ser verdadeiro; não invente números, metas, ferramentas ' +
        'proprietárias nem exigências legais.',
    );
  }

  return bloco('CONTEÚDO DA VAGA', linhas) as string;
}

function blocoExtras(data: JobFormData, area: AreaConfig): string | null {
  if (!data.extras || !area.extraFields) return null;
  const linhas = Object.entries(data.extras).map(([id, valor]) => {
    const campo = getExtraField(area, id);
    if (!campo) return null;
    return linha(campo.promptLabel ?? campo.label, descreverExtra(campo, valor));
  });
  return bloco(`ESPECÍFICO DE ${area.label.toUpperCase()}`, linhas);
}

function blocoEstilo(data: JobFormData): string {
  const linhas = [`- Tom: ${rotuloDetalhado(TONS, data.tom)}`];
  if (data.linguagemNeutra !== false) {
    linhas.push(
      '- Use linguagem neutra de gênero: prefira "profissional", "pessoa candidata" e formulações sem ' +
        'marcação de gênero; quando não houver alternativa natural, use a forma com "(a)" ' +
        '(por exemplo "Coordenador(a)"). Não use "x" nem "@" como marcador.',
    );
  }
  return `ESTILO\n${linhas.join('\n')}`;
}

const BLOCO_CONFORMIDADE =
  'CONFORMIDADE LEGAL (Lei 9.029/95 e CLT) — regras obrigatórias:\n' +
  '- Não gere nenhum requisito de idade mínima ou máxima, sexo, gênero, estado civil, ter ou não filhos, ' +
  'aparência física, "boa aparência", cor, raça, religião, orientação sexual, origem ou situação familiar.\n' +
  '- Nunca mencione teste de gravidez, atestado de esterilidade ou perguntas sobre planos de maternidade.\n' +
  '- Se algum texto fornecido pelo recrutador contiver exigência desse tipo, reescreva-a de forma legal ' +
  'ou omita-a; nunca a reproduza na descrição.\n' +
  '- Só descreva exigência física (esforço, peso, permanência em pé) se for requisito real da função, ' +
  'e escreva-a ligada à atividade concreta, nunca ao corpo da pessoa.';

const BLOCO_FORMATO =
  'FORMATO DA SAÍDA — use exatamente estas seções, nesta ordem, com o título em negrito:\n' +
  '1. O título da vaga, em negrito, na primeira linha: escreva o nome do cargo com o nível ' +
  '(por exemplo "**Analista de Logística Pleno**"). Nunca escreva a palavra "Título" como cabeçalho\n' +
  '2. Sobre a empresa — OMITA a seção inteira se nenhuma informação sobre a empresa foi fornecida; ' +
  'nunca invente história, porte, setor ou valores da empresa. Se só o nome da empresa foi informado, ' +
  'omita a seção mas cite o nome de forma natural na descrição da posição\n' +
  '3. Descrição da posição — 2 a 4 frases sobre o que a pessoa vai fazer e por que a posição existe; ' +
  'se a vaga for afirmativa, diga isso aqui de forma acolhedora\n' +
  '4. Responsabilidades — 5 a 7 bullets, cada um começando com verbo no infinitivo\n' +
  '5. Requisitos obrigatórios — só o que é de fato indispensável, no máximo 6 itens\n' +
  '6. Diferenciais — o que soma mas não elimina; omita a seção se não houver nada\n' +
  '7. Benefícios — liste os benefícios informados e a faixa salarial (ou "A combinar", quando o ' +
  'recrutador optou por não divulgar); omita a seção se nada disso foi informado. Se o briefing não ' +
  'trouxer faixa salarial nenhuma, não escreva nada sobre salário\n' +
  '8. Local e modalidade\n' +
  '9. Como se candidatar — uma linha convidando a pessoa a se candidatar pela própria plataforma; ' +
  'em vaga afirmativa, reforce aqui o convite ao público prioritário\n' +
  '\n' +
  'Não liste documentos de admissão (PIS/PASEP, carteira de trabalho, exames admissionais) como ' +
  'requisito da vaga: isso é papelada de contratação, não critério de seleção. ' +
  'Não escreva nada antes do título nem depois da última seção. Não use tabelas. ' +
  'Não repita os rótulos deste briefing na descrição final.';

const ABERTURA =
  'Escreva uma descrição de vaga completa, em português brasileiro, a partir do briefing abaixo. ' +
  'Use apenas as informações fornecidas e o que for praxe do mercado para o cargo; não invente fatos ' +
  'sobre a empresa, valores salariais ou benefícios que não foram informados.';

/**
 * Ajuste de formatação por plataforma. O corpo da descrição é o mesmo; muda
 * só como o texto precisa chegar para colar bem no destino.
 */
function blocoPlataforma(data: JobFormData): string | null {
  if (!data.plataforma || data.plataforma === 'generico') return null;
  const alvo = PLATAFORMAS.find((p) => p.id === data.plataforma);
  if (!alvo?.hint) return null;
  return `DESTINO DA PUBLICAÇÃO: ${alvo.label}\n- ${alvo.hint}.`;
}

function blocoRegeneracao(anterior: string | undefined): string | null {
  if (!anterior) return null;
  return (
    'IMPORTANTE: crie uma versão DIFERENTE da descrição abaixo — varie a estrutura, a abertura e o ' +
    `vocabulário, mantendo as informações da vaga:\n---\n${anterior.slice(0, MAX_ANTERIOR)}\n---`
  );
}

/**
 * Monta o prompt por composição:
 * base comum -> dados do formulário -> orientação da área -> conformidade -> formato de saída.
 *
 * A base carrega tudo que vale para qualquer área (estrutura, conformidade,
 * honestidade sobre o que não foi informado); a área só ajusta vocabulário e ênfase.
 */
export function buildPrompt(data: JobFormData, anterior?: string): string {
  const area = getArea(data.area);

  return [
    ABERTURA,
    blocoIdentificacao(data, area),
    blocoCondicoes(data),
    blocoConteudo(data, area),
    blocoExtras(data, area),
    `ORIENTAÇÃO DA ÁREA\n${area.promptGuidance}`,
    blocoEstilo(data),
    BLOCO_CONFORMIDADE,
    BLOCO_FORMATO,
    blocoPlataforma(data),
    blocoRegeneracao(anterior),
  ]
    .filter((parte): parte is string => parte !== null)
    .join('\n\n');
}