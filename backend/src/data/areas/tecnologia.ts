import { AreaConfig } from './types';

export const tecnologia: AreaConfig = {
  id: 'tecnologia',
  label: 'Tecnologia da Informação',
  icon: '💻',
  descricao: 'Desenvolvimento, dados, infraestrutura, QA e suporte.',

  // Ids `estagio|junior|pleno|senior` preservados da versão anterior do app
  // para não invalidar o histórico já salvo no navegador.
  seniorityLevels: [
    {
      id: 'estagio',
      label: 'Estágio',
      yearsHint: 'cursando graduação ou curso técnico',
      scopeHint: 'aprende executando tarefas acompanhadas de perto',
    },
    {
      id: 'junior',
      label: 'Júnior',
      yearsHint: 'até 2 anos',
      scopeHint: 'executa tarefas bem definidas com apoio próximo',
    },
    {
      id: 'pleno',
      label: 'Pleno',
      yearsHint: '2 a 5 anos',
      scopeHint: 'executa com autonomia, não lidera pessoas',
    },
    {
      id: 'senior',
      label: 'Sênior',
      yearsHint: '5 anos ou mais',
      scopeHint: 'resolve problemas ambíguos e influencia decisões técnicas',
    },
    {
      id: 'especialista',
      label: 'Especialista',
      yearsHint: '7 anos ou mais',
      scopeHint: 'referência técnica profunda em um domínio, sem gestão de pessoas',
    },
    {
      id: 'tech-lead',
      label: 'Tech Lead',
      yearsHint: '5 anos ou mais',
      scopeHint: 'conduz tecnicamente um time e responde pela entrega',
    },
    {
      id: 'gestor',
      label: 'Gestor / Engineering Manager',
      yearsHint: '5 anos ou mais, com experiência em liderança',
      scopeHint: 'responde por pessoas, carreira e resultado do time',
    },
  ],

  commonRoles: [
    'Desenvolvedor(a) Front-end',
    'Desenvolvedor(a) Back-end',
    'Desenvolvedor(a) Full Stack',
    'Desenvolvedor(a) Mobile',
    'Analista de Sistemas',
    'Analista de Dados',
    'Engenheiro(a) de Dados',
    'Cientista de Dados',
    'Analista de Infraestrutura',
    'Engenheiro(a) de DevOps / SRE',
    'Analista de Qualidade (QA)',
    'Analista de Suporte Técnico',
    'Analista de Segurança da Informação',
    'Administrador(a) de Banco de Dados',
    'Product Owner',
    'Scrum Master',
  ],

  skillLabel: 'Stack / tecnologias',
  skillPlaceholder: 'Ex: React, TypeScript, Node.js, PostgreSQL, Docker, AWS',

  promptGuidance:
    'Use o vocabulário da área de tecnologia: stack, arquitetura, versionamento, code review, ' +
    'testes automatizados, CI/CD, metodologias ágeis (Scrum, Kanban) e trabalho conjunto com produto e design. ' +
    'Descreva as responsabilidades como entrega de software — implementar, manter, revisar, documentar, ' +
    'participar de decisões técnicas —, não como objetivos abstratos. ' +
    'Separe com clareza tecnologias obrigatórias das desejáveis: listar dez tecnologias como obrigatórias ' +
    'afasta pessoas qualificadas e é o erro mais comum em vagas de tecnologia. ' +
    'Não exija diploma de Ciência da Computação ou curso superior como requisito obrigatório a menos que ' +
    'o recrutador tenha informado isso explicitamente. ' +
    'Evite jargão de vaga inflada (ninja, rockstar, unicórnio, "sangue nos olhos") e promessas vagas de ' +
    '"desafios de escala" ou "cultura de inovação" sem conteúdo concreto.',
};
