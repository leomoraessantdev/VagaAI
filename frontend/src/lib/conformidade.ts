/**
 * Detector de requisito potencialmente discriminatório nos campos livres.
 *
 * Aviso não bloqueante: o recrutador continua livre para gerar a vaga.
 * A Lei 9.029/95 e a CLT proíbem exigência de sexo, idade, cor, estado civil,
 * situação familiar, gravidez e religião como critério de admissão.
 *
 * As expressões são deliberadamente específicas — "mulheres" ou "pessoas negras"
 * sozinhos não disparam nada, porque vaga afirmativa é legal e desejável.
 */

export interface AlertaConformidade {
  id: string;
  campo: string;
  trecho: string;
  motivo: string;
}

interface Regra {
  id: string;
  teste: RegExp;
  motivo: string;
}

const REGRAS: Regra[] = [
  {
    id: 'idade-limite',
    teste: /\b(idade\s+(m[áa]xima|m[íi]nima)|faixa\s+et[áa]ria|anos\s+de\s+idade)\b/i,
    motivo: 'Limite de idade não pode ser critério de contratação.',
  },
  {
    id: 'idade-ate',
    teste: /\bat[ée]\s+\d{2}\s+anos\b(?!\s*de\s+experi)/i,
    motivo: 'Isso soa como limite de idade. Se você quis dizer tempo de experiência, escreva "anos de experiência".',
  },
  {
    id: 'sexo',
    teste: /\b(sexo\s+(masculino|feminino)|do\s+sexo\b|(apenas|somente|s[óo])\s+(homens|mulheres|rapazes|mo[çc]as))\b/i,
    motivo: 'Exigir sexo ou gênero é discriminação na contratação, salvo vaga afirmativa declarada como tal.',
  },
  {
    id: 'estado-civil',
    teste: /\b(estado\s+civil|solteir[oa]s?|casad[oa]s?|divorciad[oa]s?)\b/i,
    motivo: 'Estado civil não pode ser critério de contratação.',
  },
  {
    id: 'filhos',
    teste: /\b((sem|n[ãa]o\s+ter|que\s+n[ãa]o\s+tenha[m]?)\s+filhos|com\s+filhos)\b/i,
    motivo: 'Ter ou não ter filhos não pode ser critério de contratação.',
  },
  {
    id: 'gravidez',
    teste: /\b(teste\s+de\s+gravidez|n[ãa]o\s+estar\s+gr[áa]vida|pretende\s+(ter\s+filhos|engravidar)|planos?\s+de\s+(gravidez|engravidar)|atestado\s+de\s+esterilidade)\b/i,
    motivo: 'Exigir teste de gravidez ou perguntar sobre maternidade é vedado pela Lei 9.029/95.',
  },
  {
    id: 'aparencia',
    teste: /\b((boa|[óo]tima|excelente)\s+apar[êe]ncia|apar[êe]ncia\s+agrad[áa]vel|boa\s+apresenta[çc][ãa]o\s+pessoal)\b/i,
    motivo: 'Aparência não é critério objetivo. Descreva a competência que você realmente precisa.',
  },
  {
    id: 'religiao',
    teste: /\b(religi[ãa]o|religios[oa]|evang[ée]lic[oa]s?|cat[óo]lic[oa]s?|crist[ãa]os?)\b/i,
    motivo: 'Religião não pode ser critério de contratação.',
  },
  {
    id: 'raca',
    teste: /\b(ra[çc]a|cor\s+da\s+pele|cor\s+branca|etnia)\b/i,
    motivo: 'Cor ou raça só podem aparecer numa vaga afirmativa declarada — use o campo de vaga afirmativa.',
  },
];

/** Recorta o entorno do trecho que casou, para o recrutador se localizar. */
function recortar(texto: string, match: RegExpMatchArray): string {
  const inicio = Math.max(0, (match.index ?? 0) - 24);
  const fim = Math.min(texto.length, (match.index ?? 0) + match[0].length + 24);
  const prefixo = inicio > 0 ? '…' : '';
  const sufixo = fim < texto.length ? '…' : '';
  return `${prefixo}${texto.slice(inicio, fim).trim()}${sufixo}`;
}

export interface CampoVerificavel {
  campo: string;
  valor: string | undefined;
}

export function verificarConformidade(campos: CampoVerificavel[]): AlertaConformidade[] {
  const alertas: AlertaConformidade[] = [];

  for (const { campo, valor } of campos) {
    if (!valor) continue;
    for (const regra of REGRAS) {
      const match = valor.match(regra.teste);
      if (!match) continue;
      alertas.push({
        id: `${campo}:${regra.id}`,
        campo,
        trecho: recortar(valor, match),
        motivo: regra.motivo,
      });
    }
  }

  return alertas;
}