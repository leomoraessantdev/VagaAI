import { AreaConfig } from './types';

export const logisticaOperacoes: AreaConfig = {
  id: 'logistica-operacoes',
  label: 'Logística e Operações',
  icon: '📦',
  descricao: 'Armazém, expedição, estoque, transporte e produção.',

  seniorityLevels: [
    {
      id: 'aprendiz',
      label: 'Jovem Aprendiz',
      yearsHint: 'sem experiência; faixa etária definida pelo programa de aprendizagem',
      scopeHint: 'aprende a rotina acompanhado, sob contrato de aprendizagem',
    },
    {
      id: 'auxiliar',
      label: 'Auxiliar',
      yearsHint: 'sem experiência ou até 1 ano',
      scopeHint: 'executa tarefas operacionais sob supervisão direta',
    },
    {
      id: 'assistente',
      label: 'Assistente',
      yearsHint: '1 a 3 anos',
      scopeHint: 'toca a rotina com autonomia parcial e apoia os controles da área',
    },
    {
      id: 'analista',
      label: 'Analista',
      yearsHint: '3 anos ou mais',
      scopeHint: 'acompanha indicadores, propõe melhorias e responde por processos',
    },
    {
      id: 'encarregado',
      label: 'Encarregado',
      yearsHint: '3 anos ou mais na operação',
      scopeHint: 'distribui tarefas e responde pela execução de uma equipe no turno',
    },
    {
      id: 'supervisor',
      label: 'Supervisor',
      yearsHint: '4 anos ou mais',
      scopeHint: 'responde por equipe, escala e metas de um setor',
    },
    {
      id: 'coordenador',
      label: 'Coordenador',
      yearsHint: '6 anos ou mais',
      scopeHint: 'responde por várias equipes, orçamento e indicadores da operação',
    },
  ],

  commonRoles: [
    'Auxiliar de Logística',
    'Auxiliar de Almoxarifado',
    'Auxiliar de Produção',
    'Estoquista',
    'Separador(a) de Pedidos',
    'Conferente de Mercadorias',
    'Operador(a) de Empilhadeira',
    'Assistente de Expedição',
    'Motorista Entregador',
    'Analista de Logística',
    'Analista de Planejamento (PCP)',
    'Encarregado de Armazém',
    'Supervisor de Operações',
    'Coordenador de Logística',
  ],

  skillLabel: 'Sistemas, equipamentos e certificações',
  skillPlaceholder: 'Ex: WMS, SAP, coletor de dados, empilhadeira retrátil, Excel intermediário',

  extraFields: [
    {
      id: 'cnh',
      label: 'CNH exigida',
      tipo: 'select',
      opcoes: [
        { id: 'nao-exige', label: 'Não exige CNH' },
        { id: 'a', label: 'Categoria A (motocicleta)' },
        { id: 'b', label: 'Categoria B (automóvel)' },
        { id: 'ab', label: 'Categoria AB' },
        { id: 'c', label: 'Categoria C (caminhão)' },
        { id: 'd', label: 'Categoria D (transporte de passageiros)' },
        { id: 'e', label: 'Categoria E (carreta / articulado)' },
      ],
    },
    {
      id: 'nrs',
      label: 'Normas regulamentadoras exigidas',
      promptLabel: 'NRs exigidas',
      tipo: 'multi',
      ajuda: 'Marque apenas as NRs que a função realmente exige.',
      opcoes: [
        { id: 'nr-10', label: 'NR-10 — instalações e serviços em eletricidade' },
        { id: 'nr-11', label: 'NR-11 — transporte e movimentação de materiais' },
        { id: 'nr-12', label: 'NR-12 — segurança em máquinas e equipamentos' },
        { id: 'nr-20', label: 'NR-20 — inflamáveis e combustíveis' },
        { id: 'nr-33', label: 'NR-33 — espaços confinados' },
        { id: 'nr-35', label: 'NR-35 — trabalho em altura' },
      ],
    },
    {
      id: 'adicional',
      label: 'Insalubridade / periculosidade',
      tipo: 'select',
      opcoes: [
        { id: 'nenhum', label: 'Não se aplica' },
        { id: 'insalubridade', label: 'Adicional de insalubridade' },
        { id: 'periculosidade', label: 'Adicional de periculosidade' },
        { id: 'ambos', label: 'Insalubridade e periculosidade' },
      ],
    },
  ],

  promptGuidance:
    'Use o vocabulário de operação e logística: rotina operacional, recebimento, armazenagem, separação, ' +
    'conferência, expedição, inventário, movimentação de carga, escalas de turno, uso de EPIs e indicadores ' +
    'de produtividade (peças por hora, acuracidade de estoque, OTIF, índice de avarias). ' +
    'Escreva de forma direta e concreta: quem lê esta vaga quer saber o que vai fazer, em que turno, onde ' +
    'e com qual equipamento. Frases curtas, sem rodeio corporativo. ' +
    'Deixe explícitos exigência de EPI, esforço físico e trabalho em turnos sempre que o recrutador informar. ' +
    'Havendo NRs ou CNH exigidas, cite-as pelo nome nos requisitos obrigatórios. ' +
    'Não importe vocabulário de tecnologia, startup ou cultura de inovação para esta área: nunca escreva ' +
    'que a pessoa precisa ser apaixonada por tecnologia ou por desafios de escala.',
};
