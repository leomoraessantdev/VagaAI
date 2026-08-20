import { AreaConfig } from './types';

export const educacao: AreaConfig = {
  id: 'educacao',
  label: 'Educação',
  icon: '🎓',
  descricao: 'Docência, coordenação pedagógica e gestão escolar.',

  seniorityLevels: [
    {
      id: 'estagio',
      label: 'Estágio',
      yearsHint: 'cursando licenciatura ou pedagogia',
      scopeHint: 'acompanha a rotina de sala sob supervisão do professor regente',
    },
    {
      id: 'auxiliar-classe',
      label: 'Auxiliar de Classe',
      yearsHint: 'sem experiência ou até 2 anos',
      scopeHint: 'apoia o professor regente na rotina e no cuidado com a turma',
    },
    {
      id: 'professor',
      label: 'Professor(a)',
      yearsHint: 'com licenciatura ou habilitação exigida pelo segmento',
      scopeHint: 'planeja, ministra e avalia as aulas da sua turma ou disciplina',
    },
    {
      id: 'professor-especialista',
      label: 'Professor(a) Especialista',
      yearsHint: 'com pós-graduação e experiência consolidada de sala',
      scopeHint: 'referência da disciplina e apoia a formação dos colegas',
    },
    {
      id: 'coordenador',
      label: 'Coordenador(a) Pedagógico',
      yearsHint: '5 anos ou mais de docência',
      scopeHint: 'acompanha o corpo docente, o currículo e o desempenho das turmas',
    },
    {
      id: 'gestor',
      label: 'Diretor(a) / Gestor(a) Escolar',
      yearsHint: '7 anos ou mais',
      scopeHint: 'responde pela unidade escolar, equipe e resultados',
    },
  ],

  commonRoles: [
    'Professor(a) de Educação Infantil',
    'Professor(a) dos Anos Iniciais',
    'Professor(a) de Português',
    'Professor(a) de Matemática',
    'Professor(a) de Inglês',
    'Professor(a) de Educação Física',
    'Auxiliar de Classe',
    'Monitor(a)',
    'Instrutor(a) de Curso Técnico',
    'Orientador(a) Educacional',
    'Coordenador(a) Pedagógico',
    'Diretor(a) Escolar',
  ],

  skillLabel: 'Formação, habilitação e competências',
  skillPlaceholder: 'Ex: licenciatura em Matemática, BNCC, educação inclusiva, plataformas de ensino',

  extraFields: [
    {
      id: 'nivelEnsino',
      label: 'Nível de ensino',
      tipo: 'multi',
      opcoes: [
        { id: 'infantil', label: 'Educação infantil' },
        { id: 'fundamental-1', label: 'Fundamental I (1º ao 5º ano)' },
        { id: 'fundamental-2', label: 'Fundamental II (6º ao 9º ano)' },
        { id: 'medio', label: 'Ensino médio' },
        { id: 'tecnico', label: 'Ensino técnico e profissionalizante' },
        { id: 'superior', label: 'Ensino superior' },
        { id: 'eja', label: 'EJA (educação de jovens e adultos)' },
        { id: 'idiomas', label: 'Cursos livres e idiomas' },
      ],
    },
    {
      id: 'titulacao',
      label: 'Habilitação ou titulação exigida',
      promptLabel: 'Habilitação exigida pelo MEC',
      tipo: 'select',
      ajuda: 'Cada segmento tem exigência legal própria de formação.',
      opcoes: [
        { id: 'nao-exige', label: 'Não exige habilitação específica' },
        { id: 'magisterio', label: 'Magistério / Normal (nível médio)' },
        { id: 'licenciatura', label: 'Licenciatura plena na área' },
        { id: 'pedagogia', label: 'Pedagogia' },
        { id: 'especializacao', label: 'Pós-graduação lato sensu' },
        { id: 'mestrado', label: 'Mestrado' },
        { id: 'doutorado', label: 'Doutorado' },
      ],
    },
    {
      id: 'disciplina',
      label: 'Disciplina ou componente curricular',
      tipo: 'texto',
      placeholder: 'Ex: Matemática, História, Robótica, Inglês',
      maxLength: 120,
    },
  ],

  promptGuidance:
    'Use o vocabulário pedagógico brasileiro: proposta pedagógica, BNCC, planejamento de aulas, plano ' +
    'de curso, avaliação da aprendizagem, gestão de sala, conselho de classe, relação com as famílias, ' +
    'educação inclusiva e adaptação curricular. ' +
    'Deixe explícitos o segmento, a disciplina, a carga horária em hora-aula e os turnos: é assim que ' +
    'a vaga docente é lida no Brasil, e sem isso a pessoa não sabe se consegue assumir. ' +
    'Se houver habilitação exigida, cite-a nos requisitos obrigatórios: em educação ela é condição legal. ' +
    'Não use vocabulário corporativo de escritório (entregas, squads, KPIs) numa vaga de sala de aula. ' +
    'Fale do trabalho com estudantes de forma concreta e respeitosa, sem romantizar a profissão.',
};
