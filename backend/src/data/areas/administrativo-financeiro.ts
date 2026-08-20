import { AreaConfig } from './types';

export const administrativoFinanceiro: AreaConfig = {
  id: 'administrativo-financeiro',
  label: 'Administrativo e Financeiro',
  icon: '🧾',
  descricao: 'Contas a pagar e receber, fiscal, contábil, controladoria.',

  seniorityLevels: [
    {
      id: 'estagio',
      label: 'Estágio',
      yearsHint: 'cursando curso técnico ou superior',
      scopeHint: 'apoia a rotina acompanhado de perto',
    },
    {
      id: 'auxiliar',
      label: 'Auxiliar Administrativo / Financeiro',
      yearsHint: 'sem experiência ou até 1 ano',
      scopeHint: 'executa lançamentos e conferências sob supervisão direta',
    },
    {
      id: 'assistente',
      label: 'Assistente Administrativo / Financeiro',
      yearsHint: '1 a 3 anos',
      scopeHint: 'toca a rotina da área com autonomia parcial',
    },
    {
      id: 'analista',
      label: 'Analista',
      yearsHint: '3 a 5 anos',
      scopeHint: 'responde por processos, conciliações e fechamento',
    },
    {
      id: 'analista-senior',
      label: 'Analista Sênior',
      yearsHint: '5 anos ou mais',
      scopeHint: 'referência técnica da área e revisa o trabalho do time',
    },
    {
      id: 'coordenador',
      label: 'Coordenador(a)',
      yearsHint: '5 anos ou mais',
      scopeHint: 'conduz uma equipe e responde pelos controles da área',
    },
    {
      id: 'gerente',
      label: 'Gerente / Controller',
      yearsHint: '7 anos ou mais',
      scopeHint: 'responde por área, orçamento e resultado financeiro',
    },
  ],

  commonRoles: [
    'Auxiliar Administrativo',
    'Assistente Financeiro',
    'Analista Financeiro',
    'Analista de Contas a Pagar',
    'Analista de Contas a Receber',
    'Analista Fiscal',
    'Analista Contábil',
    'Analista de Departamento Pessoal',
    'Auxiliar de Faturamento',
    'Tesoureiro(a)',
    'Controller',
    'Coordenador(a) Financeiro',
  ],

  skillLabel: 'Sistemas e conhecimentos',
  skillPlaceholder: 'Ex: SAP, TOTVS Protheus, Excel avançado, SPED, conciliação bancária',

  extraFields: [
    {
      id: 'subarea',
      label: 'Subárea da vaga',
      tipo: 'select',
      ajuda: 'Quem faz fiscal não faz departamento pessoal. Dizer a subárea evita candidatura errada.',
      opcoes: [
        { id: 'financeiro', label: 'Financeiro (pagar, receber, tesouraria)' },
        { id: 'fiscal', label: 'Fiscal e tributário' },
        { id: 'contabil', label: 'Contábil' },
        { id: 'dp', label: 'Departamento pessoal' },
        { id: 'controladoria', label: 'Controladoria e planejamento' },
        { id: 'administrativo', label: 'Administrativo geral' },
      ],
    },
  ],

  promptGuidance:
    'Use o vocabulário administrativo e financeiro brasileiro: contas a pagar e a receber, conciliação ' +
    'bancária, fluxo de caixa, fechamento mensal, provisões, obrigações fiscais e acessórias, SPED, ' +
    'notas fiscais, ERP e controles internos. ' +
    'Diga com clareza qual subárea é a vaga (financeiro, fiscal, contábil, departamento pessoal, ' +
    'controladoria): cada uma exige conhecimento diferente e o anúncio genérico atrai a pessoa errada. ' +
    'Linguagem sóbria e precisa; esta é uma área que valoriza organização, prazo e conformidade. ' +
    'Descreva a rotina por ciclo (diário, semanal, fechamento de mês). ' +
    'Cite o nível de Excel realmente necessário em vez de escrever Excel avançado por hábito.',
};
