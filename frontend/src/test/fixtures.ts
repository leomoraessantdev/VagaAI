import { Registry } from '../types';

/** Registry mínimo, no formato exato que `GET /api/areas` devolve. */
export const registryFake: Registry = {
  areas: [
    {
      id: 'tecnologia',
      label: 'Tecnologia da Informação',
      icon: '💻',
      descricao: 'Desenvolvimento, dados, infraestrutura, QA e suporte.',
      seniorityLevels: [
        { id: 'junior', label: 'Júnior', yearsHint: 'até 2 anos' },
        { id: 'pleno', label: 'Pleno', yearsHint: '2 a 5 anos', scopeHint: 'executa com autonomia' },
        { id: 'tech-lead', label: 'Tech Lead' },
      ],
      commonRoles: ['Desenvolvedor(a) Front-end', 'Analista de Dados', 'Analista de Suporte Técnico'],
      skillLabel: 'Stack / tecnologias',
      skillPlaceholder: 'Ex: React, TypeScript, Node.js',
    },
    {
      id: 'logistica-operacoes',
      label: 'Logística e Operações',
      icon: '📦',
      descricao: 'Armazém, expedição, estoque, transporte e produção.',
      seniorityLevels: [
        { id: 'auxiliar', label: 'Auxiliar', yearsHint: 'até 1 ano' },
        { id: 'encarregado', label: 'Encarregado' },
      ],
      commonRoles: ['Auxiliar de Almoxarifado', 'Conferente de Mercadorias'],
      skillLabel: 'Sistemas, equipamentos e certificações',
      skillPlaceholder: 'Ex: WMS, empilhadeira retrátil',
      extraFields: [
        {
          id: 'cnh',
          label: 'CNH exigida',
          tipo: 'select',
          opcoes: [
            { id: 'nao-exige', label: 'Não exige CNH' },
            { id: 'd', label: 'Categoria D (transporte de passageiros)' },
          ],
        },
        {
          id: 'nrs',
          label: 'Normas regulamentadoras exigidas',
          tipo: 'multi',
          opcoes: [
            { id: 'nr-11', label: 'NR-11 — transporte e movimentação de materiais' },
            { id: 'nr-35', label: 'NR-35 — trabalho em altura' },
          ],
        },
      ],
    },
    {
      id: 'outra',
      label: 'Outra área',
      icon: '✳️',
      descricao: 'Qualquer função fora das áreas acima.',
      seniorityLevels: [
        { id: 'auxiliar', label: 'Auxiliar' },
        { id: 'analista', label: 'Analista' },
      ],
      commonRoles: [],
      skillLabel: 'Conhecimentos, ferramentas e certificações',
      skillPlaceholder: 'Ex: Excel avançado, inglês intermediário',
    },
  ],
  catalogos: {
    modalidades: [
      { id: 'presencial', label: 'Presencial' },
      { id: 'hibrido', label: 'Híbrido' },
      { id: 'remoto', label: 'Remoto' },
    ],
    contratos: [
      { id: 'clt', label: 'CLT' },
      { id: 'pj', label: 'PJ' },
    ],
    jornadas: [
      { id: 'integral', label: 'Integral' },
      { id: 'escala-6x1', label: 'Escala 6x1' },
    ],
    beneficios: [
      { id: 'vale-transporte', label: 'Vale-transporte' },
      { id: 'vale-refeicao', label: 'Vale-refeição (VR)' },
      { id: 'plano-saude', label: 'Plano de saúde' },
    ],
    afirmativas: [
      { id: 'pcd', label: 'Pessoas com deficiência (PCD)' },
      { id: 'mulheres', label: 'Mulheres' },
    ],
    tons: [
      { id: 'formal', label: 'Formal corporativo' },
      { id: 'moderno', label: 'Neutro profissional' },
      { id: 'descontraido', label: 'Descontraído' },
    ],
    periodosSalario: [
      { id: 'mes', label: 'por mês' },
      { id: 'hora', label: 'por hora' },
    ],
    plataformas: [
      { id: 'generico', label: 'Uso geral' },
      { id: 'linkedin', label: 'LinkedIn' },
      { id: 'gupy', label: 'Gupy' },
    ],
    ufs: ['PE', 'RJ', 'SP'],
  },
  limites: {
    cargo: 120,
    areaLivre: 60,
    empresa: 120,
    sobreEmpresa: 240,
    cidade: 80,
    responsabilidades: 3000,
    requisitos: 3000,
    diferenciais: 2000,
    beneficiosExtras: 500,
    anterior: 20000,
  },
};