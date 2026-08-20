import { AreaConfig } from './types';

export const juridico: AreaConfig = {
  id: 'juridico',
  label: 'Jurídico',
  icon: '⚖️',
  descricao: 'Contencioso, consultivo, contratos e compliance.',

  seniorityLevels: [
    {
      id: 'estagio',
      label: 'Estagiário(a) de Direito',
      yearsHint: 'cursando Direito, com estágio registrado na OAB',
      scopeHint: 'apoia peticionamento e pesquisa sob supervisão de advogado',
    },
    {
      id: 'assistente',
      label: 'Assistente Jurídico / Paralegal',
      yearsHint: '1 a 3 anos; não exige inscrição na OAB',
      scopeHint: 'controla prazos, protocolos e documentos, sem postular em juízo',
    },
    {
      id: 'advogado-jr',
      label: 'Advogado(a) Júnior',
      yearsHint: 'até 2 anos de inscrição na OAB',
      scopeHint: 'atua em rotina processual com revisão de um advogado mais experiente',
    },
    {
      id: 'advogado-pleno',
      label: 'Advogado(a) Pleno',
      yearsHint: '2 a 5 anos de OAB',
      scopeHint: 'conduz casos com autonomia e responde pela própria carteira',
    },
    {
      id: 'advogado-senior',
      label: 'Advogado(a) Sênior',
      yearsHint: '5 anos ou mais de OAB',
      scopeHint: 'atua em casos complexos e orienta tecnicamente o time',
    },
    {
      id: 'coordenador',
      label: 'Coordenador(a) Jurídico',
      yearsHint: '6 anos ou mais',
      scopeHint: 'conduz uma equipe e responde pela carteira da área',
    },
    {
      id: 'gerente',
      label: 'Gerente Jurídico',
      yearsHint: '8 anos ou mais',
      scopeHint: 'responde pelo departamento, orçamento e risco jurídico da empresa',
    },
  ],

  commonRoles: [
    'Advogado(a) Trabalhista',
    'Advogado(a) Cível',
    'Advogado(a) Tributarista',
    'Advogado(a) Societário',
    'Advogado(a) Previdenciário',
    'Advogado(a) de Compliance',
    'Analista de Contratos',
    'Assistente Jurídico',
    'Paralegal',
    'Estagiário(a) de Direito',
    'Coordenador(a) Jurídico',
  ],

  skillLabel: 'Áreas do direito e ferramentas',
  skillPlaceholder: 'Ex: contencioso trabalhista, contratos, LGPD, Projuris, peticionamento eletrônico',

  extraFields: [
    {
      id: 'oab',
      label: 'Inscrição na OAB',
      promptLabel: 'Exigência de inscrição na OAB',
      tipo: 'select',
      ajuda: 'Só exija OAB se a função envolver postular em juízo ou assinar peças.',
      opcoes: [
        { id: 'nao-exige', label: 'Não exige OAB' },
        { id: 'desejavel', label: 'OAB desejável' },
        { id: 'exige', label: 'Exige OAB ativa' },
      ],
    },
    {
      id: 'atuacao',
      label: 'Tipo de atuação',
      tipo: 'select',
      opcoes: [
        { id: 'contencioso', label: 'Contencioso (processos e audiências)' },
        { id: 'consultivo', label: 'Consultivo (pareceres e contratos)' },
        { id: 'ambos', label: 'Contencioso e consultivo' },
      ],
    },
    {
      id: 'ramo',
      label: 'Ramo do direito',
      tipo: 'texto',
      placeholder: 'Ex: trabalhista, cível, tributário, consumidor, societário',
      maxLength: 120,
    },
  ],

  promptGuidance:
    'Use o vocabulário jurídico brasileiro: contencioso e consultivo, peticionamento eletrônico, ' +
    'acompanhamento de prazos processuais, audiências, elaboração e revisão de contratos, pareceres, ' +
    'due diligence, compliance e LGPD. ' +
    'Se a vaga exigir inscrição ativa na OAB, diga isso com todas as letras nos requisitos obrigatórios; ' +
    'se não exigir, deixe claro que é vaga para assistente ou paralegal, porque confundir as duas coisas ' +
    'é o erro mais comum em anúncio jurídico. ' +
    'Diga o ramo do direito e se a atuação é contenciosa, consultiva ou as duas. ' +
    'Linguagem formal e precisa, sem juridiquês desnecessário. ' +
    'Nunca prometa resultado processual nem descreva metas de êxito em processos.',
};
