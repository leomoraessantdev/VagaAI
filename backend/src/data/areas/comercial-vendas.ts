import { AreaConfig } from './types';

export const comercialVendas: AreaConfig = {
  id: 'comercial-vendas',
  label: 'Comercial e Vendas',
  icon: '📈',
  descricao: 'Prospecção, vendas internas e externas, key account.',

  seniorityLevels: [
    {
      id: 'sdr',
      label: 'SDR / BDR',
      yearsHint: 'sem experiência ou até 2 anos',
      scopeHint: 'prospecta e qualifica leads; não conduz o fechamento',
    },
    {
      id: 'executivo-jr',
      label: 'Executivo(a) de Vendas Júnior',
      yearsHint: 'até 2 anos em vendas',
      scopeHint: 'conduz vendas de ticket menor com apoio próximo',
    },
    {
      id: 'executivo-pleno',
      label: 'Executivo(a) de Vendas Pleno',
      yearsHint: '2 a 5 anos',
      scopeHint: 'conduz o ciclo completo de venda com autonomia',
    },
    {
      id: 'key-account',
      label: 'Key Account / Executivo(a) Sênior',
      yearsHint: '5 anos ou mais',
      scopeHint: 'responde por carteira estratégica e negociações complexas',
    },
    {
      id: 'coordenador',
      label: 'Coordenador(a) Comercial',
      yearsHint: '5 anos ou mais, com experiência em liderança',
      scopeHint: 'conduz um time de vendas e responde pela meta do time',
    },
    {
      id: 'gerente',
      label: 'Gerente Comercial',
      yearsHint: '7 anos ou mais',
      scopeHint: 'responde por região ou unidade de negócio, meta e orçamento',
    },
  ],

  commonRoles: [
    'SDR (Sales Development Representative)',
    'BDR (Business Development Representative)',
    'Executivo(a) de Vendas',
    'Consultor(a) de Vendas',
    'Vendedor(a) Interno',
    'Vendedor(a) Externo',
    'Representante Comercial',
    'Analista Comercial',
    'Inside Sales',
    'Key Account Manager',
    'Coordenador(a) de Vendas',
    'Gerente Comercial',
  ],

  skillLabel: 'Ferramentas e CRM',
  skillPlaceholder: 'Ex: Salesforce, HubSpot, Pipedrive, RD Station, prospecção ativa, Excel',

  extraFields: [
    {
      id: 'remuneracao',
      label: 'Modelo de remuneração',
      tipo: 'select',
      opcoes: [
        { id: 'fixo', label: 'Somente salário fixo' },
        { id: 'fixo-variavel', label: 'Fixo mais variável por meta' },
        { id: 'comissao', label: 'Somente comissão' },
      ],
    },
    {
      id: 'tipoVenda',
      label: 'Tipo de venda',
      tipo: 'select',
      opcoes: [
        { id: 'b2b', label: 'B2B (para empresas)' },
        { id: 'b2c', label: 'B2C (para consumidor final)' },
        { id: 'ambos', label: 'B2B e B2C' },
      ],
    },
    {
      id: 'meta',
      label: 'Meta ou carteira',
      tipo: 'texto',
      placeholder: 'Ex: 300 mil por mês em novos contratos; carteira de 40 clientes ativos',
      maxLength: 200,
    },
  ],

  promptGuidance:
    'Use o vocabulário comercial brasileiro: ciclo de venda, prospecção ativa, funil, qualificação de ' +
    'leads, ticket médio, taxa de conversão, follow-up, negociação, fechamento, pós-venda e CRM. ' +
    'Descreva a rotina em termos de atividade comercial concreta: quantas reuniões, que tipo de cliente, ' +
    'venda interna ou externa, com ou sem viagem. ' +
    'Se o modelo de remuneração for somente comissão, diga isso com todas as letras na descrição, ' +
    'porque omitir esse ponto é a principal reclamação de quem se candidata a vaga comercial. ' +
    'Nunca prometa ganhos específicos nem ganhos ilimitados; fale do modelo, não de valores hipotéticos. ' +
    'Evite clichê de vaga comercial como perfil caçador ou não aceita não como resposta.',
};
