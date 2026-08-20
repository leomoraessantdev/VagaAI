import { z } from 'zod';
import { AREA_IDS, AREA_LIVRE_ID, getArea, getExtraField } from '../data/areas';
import { EXTRA_TEXTO_MAX_PADRAO } from '../data/areas/types';
import {
  AFIRMATIVA_IDS,
  BENEFICIO_IDS,
  CONTRATO_IDS,
  JORNADA_IDS,
  MODALIDADE_IDS,
  PERIODO_SALARIO_IDS,
  PLATAFORMA_IDS,
  TOM_IDS,
  UFS,
} from '../data/catalogos';

/** Limites de caracteres; servidos à UI em `GET /api/areas` para não duplicar. */
export const LIMITES = {
  cargo: 120,
  areaLivre: 60,
  empresa: 120,
  sobreEmpresa: 240,
  cidade: 80,
  responsabilidades: 3000,
  requisitos: 3000,
  diferenciais: 2000,
  beneficiosExtras: 500,
  // buildPrompt só aproveita os primeiros 1500 caracteres; aceitar 20000 era
  // desperdício e estourava o limite de corpo do express antes do zod rodar.
  anterior: 2000,
} as const;

/** Teto de sanidade da faixa salarial (R$ 1 milhão por mês). */
const SALARIO_MAX = 1_000_000;

/** Campo de texto opcional: string vazia da UI vira `undefined`. */
function textoOpcional(max: number) {
  return z
    .string()
    .max(max)
    .transform((v) => v.trim())
    .transform((v) => (v === '' ? undefined : v))
    .optional();
}

const salarioSchema = z.object({
  min: z.number().int().nonnegative().max(SALARIO_MAX).optional(),
  max: z.number().int().nonnegative().max(SALARIO_MAX).optional(),
  periodo: z.enum(PERIODO_SALARIO_IDS).default('mes'),
  divulgar: z.boolean().default(false),
});

const extraValorSchema = z.union([z.string(), z.array(z.string()), z.boolean()]);

const baseSchema = z.object({
  // Identificação
  area: z.enum(AREA_IDS, { message: 'Escolha uma área válida.' }),
  areaLivre: textoOpcional(LIMITES.areaLivre),
  cargo: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(2, 'Informe o cargo.').max(LIMITES.cargo)),
  senioridade: z.string().min(1, 'Escolha o nível da vaga.').max(40),

  // Empresa
  empresa: textoOpcional(LIMITES.empresa),
  sobreEmpresa: textoOpcional(LIMITES.sobreEmpresa),

  // Condições
  modalidade: z.enum(MODALIDADE_IDS, { message: 'Escolha a modalidade.' }),
  cidade: textoOpcional(LIMITES.cidade),
  uf: z.enum(UFS).optional(),
  contrato: z.enum(CONTRATO_IDS).optional(),
  jornada: z.enum(JORNADA_IDS).optional(),
  salario: salarioSchema.optional(),
  beneficios: z.array(z.enum(BENEFICIO_IDS)).max(BENEFICIO_IDS.length).optional(),
  beneficiosExtras: textoOpcional(LIMITES.beneficiosExtras),
  afirmativa: z.array(z.enum(AFIRMATIVA_IDS)).max(AFIRMATIVA_IDS.length).optional(),

  // Conteúdo (opcional: o modelo deduz o que faltar)
  responsabilidades: textoOpcional(LIMITES.responsabilidades),
  requisitos: textoOpcional(LIMITES.requisitos),
  diferenciais: textoOpcional(LIMITES.diferenciais),

  // Campos exclusivos da área
  extras: z.record(z.string(), extraValorSchema).optional(),

  // Estilo
  tom: z.enum(TOM_IDS, { message: 'Escolha o tom da descrição.' }),
  linguagemNeutra: z.boolean().optional(),
  plataforma: z.enum(PLATAFORMA_IDS).optional(),

  // Regeneração
  anterior: z.string().max(LIMITES.anterior).optional(),
});

/**
 * Regras que dependem da área escolhida. É aqui que o registry vira validação:
 * adicionar uma área nova não exige tocar neste arquivo.
 */
export const gerarVagaSchema = baseSchema.superRefine((data, ctx) => {
  const area = getArea(data.area);

  if (!area.seniorityLevels.some((nivel) => nivel.id === data.senioridade)) {
    ctx.addIssue({
      code: 'custom',
      path: ['senioridade'],
      message: `Nível inválido para a área ${area.label}.`,
    });
  }

  if (data.area === AREA_LIVRE_ID && !data.areaLivre) {
    ctx.addIssue({
      code: 'custom',
      path: ['areaLivre'],
      message: 'Informe o nome da área.',
    });
  }

  // Vaga não remota precisa dizer onde é — é a primeira coisa que a pessoa procura.
  if (data.modalidade !== 'remoto') {
    if (!data.cidade) {
      ctx.addIssue({ code: 'custom', path: ['cidade'], message: 'Informe a cidade da vaga.' });
    }
    if (!data.uf) {
      ctx.addIssue({ code: 'custom', path: ['uf'], message: 'Informe o estado (UF) da vaga.' });
    }
  }

  const salario = data.salario;
  if (salario?.min !== undefined && salario.max !== undefined && salario.min > salario.max) {
    ctx.addIssue({
      code: 'custom',
      path: ['salario', 'max'],
      message: 'O topo da faixa salarial não pode ser menor que a base.',
    });
  }

  for (const [id, valor] of Object.entries(data.extras ?? {})) {
    const campo = getExtraField(area, id);
    if (!campo) {
      ctx.addIssue({
        code: 'custom',
        path: ['extras', id],
        message: `O campo "${id}" não pertence à área ${area.label}.`,
      });
      continue;
    }

    const invalido = (message: string) =>
      ctx.addIssue({ code: 'custom', path: ['extras', id], message });

    switch (campo.tipo) {
      case 'texto': {
        const max = campo.maxLength ?? EXTRA_TEXTO_MAX_PADRAO;
        if (typeof valor !== 'string') invalido(`"${campo.label}" deve ser texto.`);
        else if (valor.length > max) invalido(`"${campo.label}" excede ${max} caracteres.`);
        break;
      }
      case 'select': {
        if (typeof valor !== 'string' || !campo.opcoes.some((o) => o.id === valor)) {
          invalido(`Opção inválida em "${campo.label}".`);
        }
        break;
      }
      case 'multi': {
        if (!Array.isArray(valor)) invalido(`"${campo.label}" deve ser uma lista.`);
        else if (!valor.every((v) => campo.opcoes.some((o) => o.id === v))) {
          invalido(`Opção inválida em "${campo.label}".`);
        }
        break;
      }
      case 'boolean': {
        if (typeof valor !== 'boolean') invalido(`"${campo.label}" deve ser sim ou não.`);
        break;
      }
    }
  }
});

export type GerarVagaInput = z.infer<typeof gerarVagaSchema>;

/** Primeira mensagem de erro do zod, já pronta para exibir ao recrutador. */
export function primeiroErro(erro: z.ZodError): string {
  return erro.issues[0]?.message ?? 'Dados da vaga inválidos.';
}