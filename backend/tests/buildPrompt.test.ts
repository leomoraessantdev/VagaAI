import { buildPrompt, SYSTEM_PROMPT } from '../src/lib/buildPrompt';
import { JobFormData } from '../src/types';

const tiPleno: JobFormData = {
  area: 'tecnologia',
  cargo: 'Desenvolvedor Front-end',
  senioridade: 'pleno',
  modalidade: 'remoto',
  tom: 'moderno',
  responsabilidades: 'Desenvolver interfaces React',
  requisitos: 'React, TypeScript, 3 anos de experiência',
  diferenciais: 'Next.js, GraphQL',
  beneficios: ['vale-refeicao', 'plano-saude'],
};

const almoxarifado: JobFormData = {
  area: 'logistica-operacoes',
  cargo: 'Auxiliar de Almoxarifado',
  senioridade: 'auxiliar',
  modalidade: 'presencial',
  cidade: 'Guarulhos',
  uf: 'SP',
  contrato: 'clt',
  jornada: 'escala-6x1',
  tom: 'moderno',
};

describe('estrutura comum a todas as áreas', () => {
  const prompts = [buildPrompt(tiPleno), buildPrompt(almoxarifado)];

  it('lista as nove seções de saída, na ordem', () => {
    const secoes = [
      '1. O título da vaga',
      '2. Sobre a empresa',
      '3. Descrição da posição',
      '4. Responsabilidades',
      '5. Requisitos obrigatórios',
      '6. Diferenciais',
      '7. Benefícios',
      '8. Local e modalidade',
      '9. Como se candidatar',
    ];
    for (const prompt of prompts) {
      let cursor = -1;
      for (const secao of secoes) {
        const pos = prompt.indexOf(secao);
        expect(pos).toBeGreaterThan(cursor);
        cursor = pos;
      }
    }
  });

  it('carrega os blocos de briefing em qualquer área', () => {
    for (const prompt of prompts) {
      expect(prompt).toContain('DADOS DA VAGA');
      expect(prompt).toContain('CONTEÚDO DA VAGA');
      expect(prompt).toContain('ORIENTAÇÃO DA ÁREA');
      expect(prompt).toContain('FORMATO DA SAÍDA');
    }
  });

  it('proíbe usar a palavra "Título" como cabeçalho da vaga', () => {
    for (const prompt of prompts) {
      expect(prompt).toContain('Nunca escreva a palavra "Título" como cabeçalho');
    }
  });

  it('proíbe inventar informação sobre a empresa', () => {
    for (const prompt of prompts) {
      expect(prompt).toContain('OMITA a seção inteira');
      expect(prompt).toContain('nunca invente história, porte, setor ou valores da empresa');
    }
  });
});

describe('conformidade legal', () => {
  it('entra em toda vaga, de qualquer área', () => {
    for (const data of [tiPleno, almoxarifado]) {
      const prompt = buildPrompt(data);
      expect(prompt).toContain('Lei 9.029/95');
      expect(prompt).toContain('teste de gravidez');
      expect(prompt).toContain('idade mínima ou máxima');
    }
  });

  it('manda reescrever requisito discriminatório vindo do campo livre', () => {
    const prompt = buildPrompt({ ...tiPleno, requisitos: 'Até 30 anos, sexo masculino' });
    expect(prompt).toContain('reescreva-a de forma legal');
    expect(prompt).toContain('nunca a reproduza');
  });
});

describe('senioridade específica da área', () => {
  it('usa a escala de TI com anos e escopo', () => {
    const prompt = buildPrompt(tiPleno);
    expect(prompt).toContain('Pleno');
    expect(prompt).toContain('2 a 5 anos');
    expect(prompt).toContain('executa com autonomia, não lidera pessoas');
  });

  it('usa Tech Lead, que não existe fora de TI', () => {
    expect(buildPrompt({ ...tiPleno, senioridade: 'tech-lead' })).toContain('Tech Lead');
  });

  it('usa a escala de logística, não a de TI', () => {
    const prompt = buildPrompt({ ...almoxarifado, senioridade: 'encarregado' });
    expect(prompt).toContain('Encarregado');
    expect(prompt).toContain('responde pela execução de uma equipe no turno');
    expect(prompt).not.toContain('Tech Lead');
  });

  it('cai no próprio id quando o nível não existe na área', () => {
    expect(buildPrompt({ ...tiPleno, senioridade: 'inexistente' })).toContain('inexistente');
  });
});

describe('vocabulário por área', () => {
  it('fala de tecnologia numa vaga de tecnologia', () => {
    const prompt = buildPrompt(tiPleno);
    expect(prompt).toContain('code review');
    expect(prompt).toContain('CI/CD');
    expect(prompt).toContain('metodologias ágeis');
  });

  it('fala de operação numa vaga de logística', () => {
    const prompt = buildPrompt(almoxarifado);
    expect(prompt).toContain('expedição');
    expect(prompt).toContain('EPIs');
    expect(prompt).toContain('acuracidade de estoque');
  });

  it('não leva vocabulário de TI para o almoxarifado', () => {
    const prompt = buildPrompt(almoxarifado);
    expect(prompt).not.toContain('code review');
    expect(prompt).not.toContain('CI/CD');
    expect(prompt).toContain('apaixonada por tecnologia ou por desafios de escala');
  });

  it('não leva vocabulário de operação para a vaga de TI', () => {
    expect(buildPrompt(tiPleno)).not.toContain('acuracidade de estoque');
  });
});

describe('campos extras da área', () => {
  const comExtras: JobFormData = {
    ...almoxarifado,
    extras: { cnh: 'd', nrs: ['nr-33', 'nr-35'], adicional: 'periculosidade' },
  };

  it('traduz select, multi e rótulo de prompt', () => {
    const prompt = buildPrompt(comExtras);
    expect(prompt).toContain('ESPECÍFICO DE LOGÍSTICA E OPERAÇÕES');
    expect(prompt).toContain('Categoria D (transporte de passageiros)');
    expect(prompt).toContain('NR-33 — espaços confinados; NR-35 — trabalho em altura');
    expect(prompt).toContain('Adicional de periculosidade');
    // promptLabel sobrescreve o label da UI
    expect(prompt).toContain('NRs exigidas');
  });

  it('omite o bloco quando nenhum extra foi preenchido', () => {
    expect(buildPrompt(almoxarifado)).not.toContain('ESPECÍFICO DE');
  });

  it('ignora extra que não pertence à área em vez de quebrar', () => {
    const prompt = buildPrompt({ ...almoxarifado, extras: { registroProfissional: 'CRM' } });
    expect(prompt).not.toContain('ESPECÍFICO DE');
    expect(prompt).not.toContain('CRM');
  });

  it('ignora extras numa área que não declara extraFields', () => {
    expect(buildPrompt({ ...tiPleno, extras: { cnh: 'd' } })).not.toContain('ESPECÍFICO DE');
  });

  it('omite multi vazio', () => {
    const prompt = buildPrompt({ ...almoxarifado, extras: { nrs: [] } });
    expect(prompt).not.toContain('NRs exigidas');
  });
});

describe('conteúdo deduzido quando o recrutador não preenche', () => {
  it('pede dedução de responsabilidades e requisitos', () => {
    const prompt = buildPrompt({ ...tiPleno, responsabilidades: undefined, requisitos: undefined });
    expect(prompt).toContain('não informou as responsabilidades nem os requisitos');
    expect(prompt).toContain('não invente números, metas, ferramentas proprietárias');
  });

  it('pede dedução só do que faltou', () => {
    const prompt = buildPrompt({ ...tiPleno, requisitos: undefined });
    expect(prompt).toContain('não informou os requisitos');
    expect(prompt).not.toContain('não informou as responsabilidades nem');
  });

  it('não pede dedução quando tudo foi informado', () => {
    expect(buildPrompt(tiPleno)).not.toContain('O recrutador não informou');
  });

  it('usa o rótulo de skill da área no briefing', () => {
    expect(buildPrompt(tiPleno)).toContain('Stack / tecnologias / requisitos informados');
    expect(buildPrompt({ ...almoxarifado, requisitos: 'WMS' })).toContain(
      'Sistemas, equipamentos e certificações / requisitos informados',
    );
  });
});

describe('condições da vaga', () => {
  it('descreve vaga remota sem cobrar cidade', () => {
    expect(buildPrompt(tiPleno)).toContain('Remoto (sem exigência de presença no escritório)');
  });

  it('descreve cidade e UF em vaga presencial', () => {
    expect(buildPrompt(almoxarifado)).toContain('Presencial em Guarulhos / SP');
  });

  it('explica a escala por extenso', () => {
    expect(buildPrompt(almoxarifado)).toContain(
      'Escala 6x1 (seis dias de trabalho por um de folga)',
    );
  });

  it('traduz contrato e benefícios para os rótulos do mercado BR', () => {
    expect(buildPrompt(almoxarifado)).toContain('CLT');
    expect(buildPrompt(tiPleno)).toContain('Vale-refeição (VR); Plano de saúde');
  });

  it('manda escrever "A combinar" quando o salário não é divulgado', () => {
    const prompt = buildPrompt({
      ...tiPleno,
      salario: { min: 4000, max: 6000, periodo: 'mes', divulgar: false },
    });
    expect(prompt).toContain('A combinar');
    expect(prompt).not.toContain('4.000');
  });

  it('formata a faixa salarial divulgada em reais', () => {
    const prompt = buildPrompt({
      ...tiPleno,
      salario: { min: 4000, max: 6000, periodo: 'mes', divulgar: true },
    });
    expect(prompt).toContain('4.000');
    expect(prompt).toContain('6.000');
    expect(prompt).toContain('por mês');
  });

  it('proíbe falar de salário quando nenhuma faixa foi informada', () => {
    const prompt = buildPrompt(tiPleno);
    expect(prompt).not.toContain('- Faixa salarial');
    expect(prompt).toContain('não escreva nada sobre salário');
  });

  it('aceita faixa aberta só com o piso', () => {
    const prompt = buildPrompt({
      ...tiPleno,
      salario: { min: 4000, periodo: 'mes', divulgar: true },
    });
    expect(prompt).toContain('a partir de');
  });

  it('proíbe inventar benefícios quando nada foi informado', () => {
    const prompt = buildPrompt({ ...tiPleno, beneficios: undefined });
    expect(prompt).toContain('OMITA a seção Benefícios por completo');
    expect(prompt).toContain('não invente vale-transporte');
  });

  it('não repete a proibição quando há benefício informado', () => {
    expect(buildPrompt(tiPleno)).not.toContain('OMITA a seção Benefícios');
  });

  it('não repete a proibição quando só há faixa salarial', () => {
    const prompt = buildPrompt({
      ...tiPleno,
      beneficios: undefined,
      salario: { min: 4000, periodo: 'mes', divulgar: true },
    });
    expect(prompt).not.toContain('OMITA a seção Benefícios');
  });

  it('não repete a proibição quando só há benefício em texto livre', () => {
    const prompt = buildPrompt({
      ...tiPleno,
      beneficios: undefined,
      beneficiosExtras: 'auxílio home office',
    });
    expect(prompt).not.toContain('OMITA a seção Benefícios');
  });

  it('enquadra vaga afirmativa como prioridade, não como exclusão', () => {
    const prompt = buildPrompt({ ...tiPleno, afirmativa: ['pcd', 'mulheres'] });
    expect(prompt).toContain('Pessoas com deficiência (PCD); Mulheres');
    expect(prompt).toContain('nunca como exclusão de outras pessoas');
  });

  it('omite o bloco de condições opcionais quando só há modalidade', () => {
    const prompt = buildPrompt(tiPleno);
    expect(prompt).not.toContain('Tipo de contrato');
    expect(prompt).not.toContain('Faixa salarial');
  });
});

describe('estilo e linguagem', () => {
  it('descreve o tom escolhido', () => {
    expect(buildPrompt({ ...tiPleno, tom: 'formal' })).toContain('Formal corporativo');
    expect(buildPrompt({ ...tiPleno, tom: 'descontraido' })).toContain('Descontraído');
    expect(buildPrompt(tiPleno)).toContain('Neutro profissional');
  });

  it('pede linguagem neutra de gênero por padrão', () => {
    expect(buildPrompt(tiPleno)).toContain('linguagem neutra de gênero');
  });

  it('não pede linguagem neutra quando desligada', () => {
    expect(buildPrompt({ ...tiPleno, linguagemNeutra: false })).not.toContain(
      'linguagem neutra de gênero',
    );
  });
});

describe('empresa', () => {
  it('inclui nome e descrição da empresa quando informados', () => {
    const prompt = buildPrompt({
      ...tiPleno,
      empresa: 'TechNova',
      sobreEmpresa: 'Startup de logística com 80 pessoas.',
    });
    expect(prompt).toContain('TechNova');
    expect(prompt).toContain('Startup de logística com 80 pessoas.');
  });

  it('não cita empresa quando não foi informada', () => {
    expect(buildPrompt(tiPleno)).not.toContain('- Empresa:');
  });

  it('manda citar o nome mesmo quando não há descrição da empresa', () => {
    const prompt = buildPrompt({ ...tiPleno, empresa: 'TechNova' });
    expect(prompt).toContain('- Empresa: TechNova');
    expect(prompt).toContain('cite o nome de forma natural na descrição da posição');
  });
});

describe('outra área com nome livre', () => {
  const gastronomia: JobFormData = {
    area: 'outra',
    areaLivre: 'Gastronomia',
    cargo: 'Auxiliar de Cozinha',
    senioridade: 'auxiliar',
    modalidade: 'presencial',
    cidade: 'Recife',
    uf: 'PE',
    tom: 'moderno',
  };

  it('usa o nome digitado pelo recrutador, não o rótulo do registry', () => {
    const prompt = buildPrompt(gastronomia);
    expect(prompt).toContain('Área: Gastronomia');
    expect(prompt).not.toContain('Área: Outra área');
  });

  it('usa a escala genérica do mercado BR', () => {
    expect(buildPrompt({ ...gastronomia, senioridade: 'gerente' })).toContain('Gerente');
  });

  it('manda não inventar exigência legal da área desconhecida', () => {
    expect(buildPrompt(gastronomia)).toContain('não invente: use uma formulação genérica');
  });
});

describe('preset de plataforma', () => {
  it('não acrescenta nada no preset genérico ou sem plataforma', () => {
    expect(buildPrompt(tiPleno)).not.toContain('DESTINO DA PUBLICAÇÃO');
    expect(buildPrompt({ ...tiPleno, plataforma: 'generico' })).not.toContain('DESTINO DA PUBLICAÇÃO');
  });

  it('avisa que o LinkedIn não renderiza cabeçalho markdown', () => {
    const prompt = buildPrompt({ ...tiPleno, plataforma: 'linkedin' });
    expect(prompt).toContain('DESTINO DA PUBLICAÇÃO: LinkedIn');
    expect(prompt).toContain('não renderiza cabeçalhos markdown');
  });

  it('pede seções autocontidas para a Gupy, que tem campos separados', () => {
    const prompt = buildPrompt({ ...tiPleno, plataforma: 'gupy' });
    expect(prompt).toContain('DESTINO DA PUBLICAÇÃO: Gupy');
    expect(prompt).toContain('campos separados');
  });

  it('pede texto simples para o Indeed', () => {
    expect(buildPrompt({ ...tiPleno, plataforma: 'indeed' })).toContain('texto simples e objetivo');
  });

  it('não altera as seções da saída, só a formatação', () => {
    for (const plataforma of ['linkedin', 'gupy', 'indeed'] as const) {
      const prompt = buildPrompt({ ...tiPleno, plataforma });
      expect(prompt).toContain('4. Responsabilidades — 5 a 7 bullets');
      expect(prompt).toContain('9. Como se candidatar');
    }
  });
});

describe('regeneração', () => {
  it('pede uma versão diferente citando a anterior', () => {
    const prompt = buildPrompt(tiPleno, 'Texto da versão anterior da vaga.');
    expect(prompt).toContain('versão DIFERENTE');
    expect(prompt).toContain('Texto da versão anterior da vaga.');
  });

  it('trunca a descrição anterior em 1500 caracteres', () => {
    const prompt = buildPrompt(tiPleno, 'x'.repeat(5000));
    expect(prompt).toContain('x'.repeat(1500));
    expect(prompt).not.toContain('x'.repeat(1501));
  });

  it('não pede variação sem descrição anterior', () => {
    expect(buildPrompt(tiPleno)).not.toContain('versão DIFERENTE');
  });
});

describe('não regressão: Desenvolvedor Front-end Pleno', () => {
  const prompt = buildPrompt(tiPleno);

  it('mantém tudo que o recrutador escreveu', () => {
    expect(prompt).toContain('Desenvolvedor Front-end');
    expect(prompt).toContain('Desenvolver interfaces React');
    expect(prompt).toContain('React, TypeScript, 3 anos de experiência');
    expect(prompt).toContain('Next.js, GraphQL');
  });

  it('ganha estrutura, conformidade e calibragem de nível que antes não existiam', () => {
    expect(prompt).toContain('4. Responsabilidades — 5 a 7 bullets');
    expect(prompt).toContain('Lei 9.029/95');
    expect(prompt).toContain('2 a 5 anos');
  });
});

describe('SYSTEM_PROMPT', () => {
  it('não se compromete só com tecnologia', () => {
    expect(SYSTEM_PROMPT).toContain('todas as áreas');
    expect(SYSTEM_PROMPT).toContain('chão de fábrica');
  });

  it('proíbe inventar informação', () => {
    expect(SYSTEM_PROMPT).toContain('nunca inventa');
  });
});