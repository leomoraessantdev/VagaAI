import { AreaConfig } from './types';

export const atendimentoCs: AreaConfig = {
  id: 'atendimento-cs',
  label: 'Atendimento e Customer Success',
  icon: '🎧',
  descricao: 'SAC, suporte, call center, ouvidoria e sucesso do cliente.',

  seniorityLevels: [
    {
      id: 'estagio',
      label: 'Estágio',
      yearsHint: 'cursando curso técnico ou superior',
      scopeHint: 'apoia o atendimento acompanhado de perto',
    },
    {
      id: 'aprendiz',
      label: 'Jovem Aprendiz',
      yearsHint: 'sem experiência; faixa etária definida pelo programa de aprendizagem',
      scopeHint: 'aprende a rotina sob contrato de aprendizagem',
    },
    {
      id: 'atendente',
      label: 'Atendente / Operador(a)',
      yearsHint: 'sem experiência ou até 1 ano',
      scopeHint: 'atende pelo roteiro e escala definidos, com supervisão próxima',
    },
    {
      id: 'analista',
      label: 'Analista de Atendimento / CS',
      yearsHint: '1 a 3 anos',
      scopeHint: 'resolve casos com autonomia e acompanha a carteira de clientes',
    },
    {
      id: 'especialista',
      label: 'Analista Sênior / Especialista',
      yearsHint: '3 anos ou mais',
      scopeHint: 'trata casos críticos, treina o time e melhora processos de atendimento',
    },
    {
      id: 'supervisor',
      label: 'Supervisor(a)',
      yearsHint: '4 anos ou mais',
      scopeHint: 'responde por equipe, escala e indicadores do turno',
    },
    {
      id: 'coordenador',
      label: 'Coordenador(a)',
      yearsHint: '6 anos ou mais',
      scopeHint: 'responde por várias equipes, metas e experiência do cliente',
    },
  ],

  commonRoles: [
    'Atendente de SAC',
    'Operador(a) de Telemarketing',
    'Agente de Chat',
    'Analista de Suporte ao Cliente',
    'Analista de Customer Success',
    'Customer Success Manager',
    'Analista de Ouvidoria',
    'Recepcionista',
    'Supervisor(a) de Atendimento',
    'Coordenador(a) de Customer Success',
  ],

  skillLabel: 'Ferramentas e canais de atendimento',
  skillPlaceholder: 'Ex: Zendesk, Freshdesk, Salesforce Service Cloud, WhatsApp Business, telefonia',

  extraFields: [
    {
      id: 'canais',
      label: 'Canais de atendimento',
      tipo: 'multi',
      opcoes: [
        { id: 'telefone', label: 'Telefone' },
        { id: 'chat', label: 'Chat' },
        { id: 'email', label: 'E-mail' },
        { id: 'whatsapp', label: 'WhatsApp' },
        { id: 'redes-sociais', label: 'Redes sociais' },
        { id: 'presencial', label: 'Presencial' },
      ],
    },
    {
      id: 'tipoOperacao',
      label: 'Tipo de operação',
      tipo: 'select',
      ajuda: 'Receptivo, ativo e sucesso do cliente exigem perfis bem diferentes.',
      opcoes: [
        { id: 'receptivo', label: 'Receptivo (o cliente procura a empresa)' },
        { id: 'ativo', label: 'Ativo (a empresa procura o cliente)' },
        { id: 'misto', label: 'Receptivo e ativo' },
        { id: 'cs', label: 'Customer Success (carteira e retenção)' },
      ],
    },
  ],

  promptGuidance:
    'Use o vocabulário de atendimento e sucesso do cliente: jornada do cliente, SLA, tempo médio de ' +
    'atendimento, resolução no primeiro contato, escalonamento, base de conhecimento, NPS, CSAT, ' +
    'retenção, churn e onboarding de clientes. ' +
    'Diga quais canais a pessoa vai atender e se a operação é receptiva, ativa ou de carteira: são ' +
    'rotinas muito diferentes e a pessoa precisa saber antes de se candidatar. ' +
    'Se houver meta de volume, script obrigatório ou monitoria de qualidade, diga isso com honestidade ' +
    'em vez de descrever a vaga como consultiva. ' +
    'Tom acolhedor, porém concreto: descreva a rotina real do turno, não só a vontade de encantar ' +
    'clientes. ' +
    'Não use vocabulário de tecnologia para vaga de call center nem prometa plano de carreira acelerado.',
};
