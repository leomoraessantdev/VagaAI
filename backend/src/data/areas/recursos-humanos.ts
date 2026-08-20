import { AreaConfig } from './types';

export const recursosHumanos: AreaConfig = {
  id: 'recursos-humanos',
  label: 'Recursos Humanos',
  icon: '🧑‍💼',
  descricao: 'Recrutamento, departamento pessoal, T&D, business partner.',

  seniorityLevels: [
    {
      id: 'estagio',
      label: 'Estágio',
      yearsHint: 'cursando graduação',
      scopeHint: 'apoia a rotina acompanhado de perto',
    },
    {
      id: 'auxiliar',
      label: 'Auxiliar de RH / DP',
      yearsHint: 'sem experiência ou até 1 ano',
      scopeHint: 'organiza documentos e apoia processos sob supervisão',
    },
    {
      id: 'assistente',
      label: 'Assistente de RH',
      yearsHint: '1 a 3 anos',
      scopeHint: 'executa a rotina do subsistema com autonomia parcial',
    },
    {
      id: 'analista',
      label: 'Analista de RH',
      yearsHint: '3 a 5 anos',
      scopeHint: 'responde por um subsistema de RH ponta a ponta',
    },
    {
      id: 'analista-senior',
      label: 'Analista Sênior / Business Partner',
      yearsHint: '5 anos ou mais',
      scopeHint: 'atende áreas de negócio e influencia decisões de pessoas',
    },
    {
      id: 'coordenador',
      label: 'Coordenador(a) de RH',
      yearsHint: '5 anos ou mais',
      scopeHint: 'conduz equipe e responde por indicadores de pessoas',
    },
    {
      id: 'gerente',
      label: 'Gerente de RH',
      yearsHint: '7 anos ou mais',
      scopeHint: 'responde por estratégia de pessoas, orçamento e time',
    },
  ],

  commonRoles: [
    'Analista de Recrutamento e Seleção',
    'Analista de Departamento Pessoal',
    'Analista de Folha de Pagamento',
    'Analista de Treinamento e Desenvolvimento',
    'Analista de Cargos e Salários',
    'Business Partner de RH',
    'Assistente de RH',
    'Auxiliar de Departamento Pessoal',
    'Técnico(a) de Segurança do Trabalho',
    'Coordenador(a) de RH',
    'Gerente de RH',
  ],

  skillLabel: 'Sistemas e conhecimentos',
  skillPlaceholder: 'Ex: Gupy, TOTVS RM, eSocial, legislação trabalhista, entrevista por competências',

  extraFields: [
    {
      id: 'subsistema',
      label: 'Subsistema de RH',
      tipo: 'multi',
      ajuda: 'Quem faz recrutamento raramente faz folha. Marque só o que a vaga cobre de fato.',
      opcoes: [
        { id: 'recrutamento', label: 'Recrutamento e seleção' },
        { id: 'dp', label: 'Departamento pessoal e folha' },
        { id: 'treinamento', label: 'Treinamento e desenvolvimento' },
        { id: 'remuneracao', label: 'Cargos, salários e benefícios' },
        { id: 'bp', label: 'Business partner' },
        { id: 'clima', label: 'Clima, cultura e engajamento' },
        { id: 'sst', label: 'Saúde e segurança do trabalho' },
      ],
    },
  ],

  promptGuidance:
    'Use o vocabulário de RH brasileiro: subsistemas de RH, recrutamento e seleção, admissão e ' +
    'desligamento, folha de pagamento, eSocial, benefícios, clima organizacional, treinamento e ' +
    'desenvolvimento, cargos e salários, avaliação de desempenho e legislação trabalhista. ' +
    'Diga qual subsistema é a vaga: quem faz recrutamento não faz folha, e o anúncio genérico atrai ' +
    'a pessoa errada. ' +
    'Esta vaga é lida por profissionais de RH, que avaliam o anúncio profissionalmente: uma descrição ' +
    'mal escrita queima a marca empregadora mais aqui do que em qualquer outra área. ' +
    'Seja honesto sobre volume e escopo (quantas vagas em aberto, quantas pessoas na folha). ' +
    'Evite frases de efeito como ser o guardião da cultura sem entrega concreta por trás.',
};
