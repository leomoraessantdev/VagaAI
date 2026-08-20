import { AreaConfig } from './types';

export const saude: AreaConfig = {
  id: 'saude',
  label: 'Saúde',
  icon: '🩺',
  descricao: 'Assistência, enfermagem, clínicas, hospitais e diagnóstico.',

  seniorityLevels: [
    {
      id: 'estagio',
      label: 'Estágio',
      yearsHint: 'cursando graduação na área',
      scopeHint: 'atua sob supervisão direta de profissional habilitado',
    },
    {
      id: 'tecnico',
      label: 'Técnico(a)',
      yearsHint: 'curso técnico concluído e registro ativo no conselho',
      scopeHint: 'executa procedimentos técnicos sob supervisão do profissional de nível superior',
    },
    {
      id: 'profissional-jr',
      label: 'Profissional Júnior',
      yearsHint: 'até 2 anos após a graduação',
      scopeHint: 'atende com autonomia em rotina padrão, com retaguarda',
    },
    {
      id: 'especialista',
      label: 'Especialista',
      yearsHint: 'com residência ou especialização concluída',
      scopeHint: 'atende casos de maior complexidade na sua especialidade',
    },
    {
      id: 'coordenador',
      label: 'Coordenador(a)',
      yearsHint: '5 anos ou mais de assistência',
      scopeHint: 'conduz equipe assistencial, escalas e protocolos do setor',
    },
    {
      id: 'gestor',
      label: 'Gestor(a)',
      yearsHint: '7 anos ou mais',
      scopeHint: 'responde por unidade, indicadores assistenciais e orçamento',
    },
  ],

  commonRoles: [
    'Técnico(a) de Enfermagem',
    'Enfermeiro(a)',
    'Auxiliar de Saúde Bucal',
    'Técnico(a) em Radiologia',
    'Fisioterapeuta',
    'Nutricionista',
    'Psicólogo(a)',
    'Farmacêutico(a)',
    'Biomédico(a)',
    'Fonoaudiólogo(a)',
    'Médico(a)',
    'Recepcionista de Clínica',
    'Coordenador(a) de Enfermagem',
  ],

  skillLabel: 'Formação, registro e competências',
  skillPlaceholder: 'Ex: COREN ativo, suporte básico de vida, prontuário eletrônico, urgência e emergência',

  extraFields: [
    {
      id: 'registro',
      label: 'Registro profissional exigido',
      promptLabel: 'Registro em conselho de classe exigido',
      tipo: 'select',
      ajuda: 'Registro ativo é requisito legal para o exercício da profissão.',
      opcoes: [
        { id: 'nao-exige', label: 'Não exige registro em conselho' },
        { id: 'coren', label: 'COREN (enfermagem)' },
        { id: 'crm', label: 'CRM (medicina)' },
        { id: 'crefito', label: 'CREFITO (fisioterapia e terapia ocupacional)' },
        { id: 'crn', label: 'CRN (nutrição)' },
        { id: 'crp', label: 'CRP (psicologia)' },
        { id: 'crf', label: 'CRF (farmácia)' },
        { id: 'cro', label: 'CRO (odontologia)' },
        { id: 'crbm', label: 'CRBM (biomedicina)' },
        { id: 'crfa', label: 'CRFa (fonoaudiologia)' },
      ],
    },
    {
      id: 'setor',
      label: 'Setor ou especialidade',
      tipo: 'texto',
      placeholder: 'Ex: UTI adulto, centro cirúrgico, pronto-socorro, ambulatório',
      maxLength: 120,
    },
    {
      id: 'plantao',
      label: 'Regime de plantão',
      tipo: 'select',
      opcoes: [
        { id: 'nao', label: 'Sem plantão' },
        { id: 'diurno', label: 'Plantão diurno' },
        { id: 'noturno', label: 'Plantão noturno' },
        { id: 'ambos', label: 'Plantão diurno e noturno (revezamento)' },
      ],
    },
  ],

  promptGuidance:
    'Use o vocabulário assistencial: protocolos institucionais, segurança do paciente, evolução e ' +
    'registro em prontuário, escalas e plantões, passagem de plantão, biossegurança, EPIs, ' +
    'humanização do cuidado e trabalho em equipe multiprofissional. ' +
    'Se houver registro em conselho de classe exigido, cite a sigla pelo nome nos requisitos ' +
    'obrigatórios e diga que precisa estar ativo: é condição legal para exercer a profissão. ' +
    'Deixe explícitos o setor, o regime de plantão e a escala, porque é o que define se a pessoa ' +
    'pode ou não assumir a vaga. ' +
    'Nunca prometa resultado clínico, nem descreva a função de forma que sugira atribuição fora do ' +
    'escopo legal da categoria profissional. ' +
    'Evite linguagem corporativa de escritório: esta vaga é lida por quem trabalha na assistência.',
};
