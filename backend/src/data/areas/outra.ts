import { AreaConfig } from './types';

/**
 * Template genérico: cobre qualquer área que ainda não tenha config própria.
 * O recrutador digita o nome da área em `areaLivre` e a escala de senioridade
 * usada é a nomenclatura mais comum do mercado brasileiro
 * (auxiliar -> assistente -> analista -> especialista -> coordenador -> gerente),
 * que atravessa praticamente todo anúncio de emprego CLT no país.
 */
export const outra: AreaConfig = {
  id: 'outra',
  label: 'Outra área',
  icon: '✳️',
  descricao: 'Qualquer função fora das áreas acima — você informa a área.',

  seniorityLevels: [
    {
      id: 'estagio',
      label: 'Estágio',
      yearsHint: 'cursando curso técnico ou superior',
      scopeHint: 'aprende executando tarefas acompanhadas de perto',
    },
    {
      id: 'aprendiz',
      label: 'Jovem Aprendiz',
      yearsHint: 'sem experiência; faixa etária definida pelo programa de aprendizagem',
      scopeHint: 'aprende a rotina sob contrato de aprendizagem',
    },
    {
      id: 'auxiliar',
      label: 'Auxiliar',
      yearsHint: 'sem experiência ou até 1 ano',
      scopeHint: 'executa tarefas simples sob supervisão direta',
    },
    {
      id: 'assistente',
      label: 'Assistente',
      yearsHint: '1 a 3 anos',
      scopeHint: 'toca a rotina da área com autonomia parcial',
    },
    {
      id: 'analista',
      label: 'Analista',
      yearsHint: '3 a 5 anos',
      scopeHint: 'responde por processos e entrega com autonomia',
    },
    {
      id: 'especialista',
      label: 'Especialista / Sênior',
      yearsHint: '5 anos ou mais',
      scopeHint: 'referência técnica da área, sem gestão de pessoas',
    },
    {
      id: 'coordenador',
      label: 'Coordenador',
      yearsHint: '5 anos ou mais',
      scopeHint: 'responde por uma equipe e pelos resultados da área',
    },
    {
      id: 'gerente',
      label: 'Gerente',
      yearsHint: '7 anos ou mais',
      scopeHint: 'responde por área, orçamento e times',
    },
  ],

  // Vazio de propósito: sem saber a área, qualquer sugestão de cargo seria chute.
  commonRoles: [],

  skillLabel: 'Conhecimentos, ferramentas e certificações',
  skillPlaceholder: 'Ex: Excel avançado, pacote Office, inglês intermediário, CNH categoria B',

  promptGuidance:
    'A área foi informada pelo recrutador em texto livre. Use o vocabulário próprio dessa área e o grau ' +
    'de formalidade que o mercado brasileiro usa nela: se for uma função operacional ou de chão de fábrica, ' +
    'escreva de forma direta e concreta; se for uma função corporativa, use linguagem profissional sóbria. ' +
    'Descreva as responsabilidades como tarefas observáveis do dia a dia, não como objetivos abstratos. ' +
    'Não importe vocabulário de tecnologia ou de startup para áreas que não são de tecnologia. ' +
    'Na dúvida sobre uma exigência específica da área — registro em conselho de classe, certificação ' +
    'obrigatória, curso legalmente exigido —, não invente: use uma formulação genérica ou omita o item.',
};