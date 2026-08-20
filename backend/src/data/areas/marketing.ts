import { AreaConfig } from './types';

export const marketing: AreaConfig = {
  id: 'marketing',
  label: 'Marketing',
  icon: '📣',
  descricao: 'Mídia paga, conteúdo, social, SEO, growth e branding.',

  seniorityLevels: [
    {
      id: 'estagio',
      label: 'Estágio',
      yearsHint: 'cursando graduação',
      scopeHint: 'apoia a execução acompanhado de perto',
    },
    {
      id: 'assistente',
      label: 'Assistente de Marketing',
      yearsHint: 'até 2 anos',
      scopeHint: 'executa tarefas definidas de campanha e conteúdo',
    },
    {
      id: 'analista',
      label: 'Analista de Marketing',
      yearsHint: '2 a 4 anos',
      scopeHint: 'toca campanhas e canais com autonomia',
    },
    {
      id: 'especialista',
      label: 'Especialista / Analista Sênior',
      yearsHint: '4 anos ou mais',
      scopeHint: 'referência de um canal ou disciplina e define a estratégia dele',
    },
    {
      id: 'coordenador',
      label: 'Coordenador(a) de Marketing',
      yearsHint: '5 anos ou mais',
      scopeHint: 'conduz time e calendário, responde por metas de canal',
    },
    {
      id: 'gerente',
      label: 'Gerente de Marketing',
      yearsHint: '7 anos ou mais',
      scopeHint: 'responde por estratégia, orçamento e time',
    },
  ],

  commonRoles: [
    'Analista de Marketing',
    'Analista de Mídia Paga',
    'Analista de SEO',
    'Analista de Marketing de Conteúdo',
    'Social Media',
    'Redator(a) / Copywriter',
    'Designer Gráfico',
    'Analista de CRM',
    'Analista de Growth',
    'Assistente de Marketing',
    'Coordenador(a) de Marketing',
    'Gerente de Marketing',
  ],

  skillLabel: 'Ferramentas e canais',
  skillPlaceholder: 'Ex: Google Ads, Meta Ads, GA4, RD Station, SEO, Figma, HubSpot',

  extraFields: [
    {
      id: 'foco',
      label: 'Foco da posição',
      tipo: 'select',
      opcoes: [
        { id: 'generalista', label: 'Generalista (toca vários canais)' },
        { id: 'performance', label: 'Performance e mídia paga' },
        { id: 'conteudo', label: 'Conteúdo e SEO' },
        { id: 'social', label: 'Social media e comunidade' },
        { id: 'produto', label: 'Product marketing' },
        { id: 'branding', label: 'Branding e comunicação' },
      ],
    },
  ],

  promptGuidance:
    'Use o vocabulário de marketing: funil, aquisição, retenção, campanha, mídia paga e orgânica, ' +
    'calendário editorial, automação, segmentação, teste A/B e indicadores como CAC, ROI, ROAS, CTR e ' +
    'taxa de conversão. ' +
    'Deixe explícito se a posição é generalista (toca vários canais) ou especialista de um canal só: ' +
    'essa é a dúvida número um de quem se candidata em marketing. ' +
    'Descreva entregas concretas — campanhas, peças, relatórios, calendário —, não adjetivos. ' +
    'Não empilhe design, tráfego pago, redação, social e análise de dados numa vaga única de nível ' +
    'júnior: isso sinaliza expectativa irreal e afasta quem é bom. ' +
    'Evite pedir pessoa criativa e apaixonada por marketing sem dizer o que ela vai fazer no dia a dia.',
};
