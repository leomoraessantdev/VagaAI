import { gerarVagaSchema, primeiroErro, LIMITES } from '../src/lib/schema';

const minimo = {
  area: 'tecnologia',
  cargo: 'Desenvolvedor Front-end',
  senioridade: 'pleno',
  modalidade: 'remoto',
  tom: 'moderno',
};

function erros(body: unknown): string[] {
  const r = gerarVagaSchema.safeParse(body);
  return r.success ? [] : r.error.issues.map((i) => i.path.join('.'));
}

describe('payload mínimo', () => {
  it('aceita área, cargo, senioridade, modalidade e tom', () => {
    const r = gerarVagaSchema.safeParse(minimo);
    expect(r.success).toBe(true);
  });

  it('não exige responsabilidades nem requisitos', () => {
    expect(erros(minimo)).not.toContain('responsabilidades');
    expect(erros(minimo)).not.toContain('requisitos');
  });

  it('rejeita cargo vazio ou só com espaços', () => {
    expect(erros({ ...minimo, cargo: '   ' })).toContain('cargo');
  });

  it('rejeita cargo acima do limite', () => {
    expect(erros({ ...minimo, cargo: 'x'.repeat(LIMITES.cargo + 1) })).toContain('cargo');
  });
});

describe('senioridade validada contra o registry da área', () => {
  it('aceita um nível que existe na área', () => {
    expect(gerarVagaSchema.safeParse({ ...minimo, senioridade: 'tech-lead' }).success).toBe(true);
  });

  it('rejeita nível de logística numa vaga de tecnologia', () => {
    expect(erros({ ...minimo, senioridade: 'encarregado' })).toContain('senioridade');
  });

  it('rejeita nível de tecnologia numa vaga de logística', () => {
    const body = {
      ...minimo,
      area: 'logistica-operacoes',
      senioridade: 'tech-lead',
      modalidade: 'presencial',
      cidade: 'Guarulhos',
      uf: 'SP',
    };
    expect(erros(body)).toContain('senioridade');
  });

  it('explica o erro citando a área', () => {
    const r = gerarVagaSchema.safeParse({ ...minimo, senioridade: 'encarregado' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(primeiroErro(r.error)).toContain('Tecnologia da Informação');
    }
  });
});

describe('área livre', () => {
  it('exige o nome da área quando a escolha é "outra"', () => {
    expect(erros({ ...minimo, area: 'outra', senioridade: 'analista' })).toContain('areaLivre');
  });

  it('aceita "outra" com o nome preenchido', () => {
    const body = { ...minimo, area: 'outra', senioridade: 'analista', areaLivre: 'Gastronomia' };
    expect(gerarVagaSchema.safeParse(body).success).toBe(true);
  });

  it('rejeita área fora do registry', () => {
    expect(erros({ ...minimo, area: 'astrologia' })).toContain('area');
  });
});

describe('local obrigatório fora do remoto', () => {
  it('exige cidade e UF em vaga presencial', () => {
    const e = erros({ ...minimo, area: 'logistica-operacoes', senioridade: 'auxiliar', modalidade: 'presencial' });
    expect(e).toContain('cidade');
    expect(e).toContain('uf');
  });

  it('exige cidade e UF em vaga híbrida', () => {
    expect(erros({ ...minimo, modalidade: 'hibrido' })).toContain('cidade');
  });

  it('não exige local em vaga remota', () => {
    expect(erros(minimo)).toHaveLength(0);
  });

  it('rejeita UF inexistente', () => {
    expect(erros({ ...minimo, modalidade: 'presencial', cidade: 'Recife', uf: 'XX' })).toContain('uf');
  });
});

describe('faixa salarial', () => {
  it('aceita faixa coerente', () => {
    const body = { ...minimo, salario: { min: 4000, max: 6000, periodo: 'mes', divulgar: true } };
    expect(gerarVagaSchema.safeParse(body).success).toBe(true);
  });

  it('rejeita topo menor que a base', () => {
    const body = { ...minimo, salario: { min: 6000, max: 4000, periodo: 'mes', divulgar: true } };
    expect(erros(body)).toContain('salario.max');
  });

  it('assume mês e não divulgar por padrão', () => {
    const r = gerarVagaSchema.safeParse({ ...minimo, salario: { min: 4000 } });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.salario).toEqual({ min: 4000, periodo: 'mes', divulgar: false });
    }
  });

  it('rejeita salário negativo', () => {
    expect(erros({ ...minimo, salario: { min: -1 } })).toContain('salario.min');
  });
});

describe('campos extras validados contra a área', () => {
  const logistica = {
    ...minimo,
    area: 'logistica-operacoes',
    senioridade: 'auxiliar',
    modalidade: 'presencial',
    cidade: 'Guarulhos',
    uf: 'SP',
  };

  it('aceita extras declarados pela área', () => {
    const body = { ...logistica, extras: { cnh: 'd', nrs: ['nr-33'], adicional: 'nenhum' } };
    expect(gerarVagaSchema.safeParse(body).success).toBe(true);
  });

  it('rejeita extra que não pertence à área', () => {
    expect(erros({ ...logistica, extras: { registroProfissional: 'CRM' } })).toContain(
      'extras.registroProfissional',
    );
  });

  it('rejeita opção inexistente num select', () => {
    expect(erros({ ...logistica, extras: { cnh: 'z' } })).toContain('extras.cnh');
  });

  it('rejeita opção inexistente num multi', () => {
    expect(erros({ ...logistica, extras: { nrs: ['nr-99'] } })).toContain('extras.nrs');
  });

  it('rejeita tipo errado num multi', () => {
    expect(erros({ ...logistica, extras: { nrs: 'nr-33' } })).toContain('extras.nrs');
  });

  it('rejeita extras numa área que não declara nenhum', () => {
    expect(erros({ ...minimo, extras: { cnh: 'd' } })).toContain('extras.cnh');
  });
});

describe('catálogos comuns', () => {
  it('rejeita benefício fora do catálogo', () => {
    expect(erros({ ...minimo, beneficios: ['massagem-semanal'] })).toContain('beneficios.0');
  });

  it('rejeita contrato, jornada, tom e afirmativa inválidos', () => {
    expect(erros({ ...minimo, contrato: 'estatutario' })).toContain('contrato');
    expect(erros({ ...minimo, jornada: 'escala-9x1' })).toContain('jornada');
    expect(erros({ ...minimo, tom: 'bravo' })).toContain('tom');
    expect(erros({ ...minimo, afirmativa: ['canhotos'] })).toContain('afirmativa.0');
  });

  it('aceita a lista de benefícios padrão do mercado BR', () => {
    const body = { ...minimo, beneficios: ['vale-transporte', 'vale-refeicao', 'plr', 'gympass'] };
    expect(gerarVagaSchema.safeParse(body).success).toBe(true);
  });
});

describe('plataforma de destino', () => {
  it('é opcional', () => {
    expect(gerarVagaSchema.safeParse(minimo).success).toBe(true);
  });

  it('aceita as plataformas do catálogo', () => {
    for (const plataforma of ['generico', 'linkedin', 'gupy', 'indeed']) {
      expect(gerarVagaSchema.safeParse({ ...minimo, plataforma }).success).toBe(true);
    }
  });

  it('rejeita plataforma fora do catálogo', () => {
    expect(erros({ ...minimo, plataforma: 'catho' })).toContain('plataforma');
  });
});

describe('limite de descrição anterior', () => {
  it('aceita até o limite declarado', () => {
    const r = gerarVagaSchema.safeParse({ ...minimo, anterior: 'x'.repeat(LIMITES.anterior) });
    expect(r.success).toBe(true);
  });

  it('rejeita acima do limite', () => {
    expect(erros({ ...minimo, anterior: 'x'.repeat(LIMITES.anterior + 1) })).toContain('anterior');
  });

  // Regressão: com anterior em 20000 o payload passava de 10 KB e o express
  // devolvia 413 antes do zod, quebrando o botão Regenerar.
  it('mantém o payload máximo abaixo do limite de corpo do express', () => {
    const somaDosCampos =
      LIMITES.cargo +
      LIMITES.areaLivre +
      LIMITES.empresa +
      LIMITES.sobreEmpresa +
      LIMITES.cidade +
      LIMITES.responsabilidades +
      LIMITES.requisitos +
      LIMITES.diferenciais +
      LIMITES.beneficiosExtras +
      LIMITES.anterior;
    expect(somaDosCampos).toBeLessThan(32 * 1024);
  });
});

describe('normalização de texto', () => {
  it('transforma string vazia em ausente', () => {
    const r = gerarVagaSchema.safeParse({ ...minimo, diferenciais: '', empresa: '' });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.diferenciais).toBeUndefined();
      expect(r.data.empresa).toBeUndefined();
    }
  });

  it('remove espaços nas pontas', () => {
    const r = gerarVagaSchema.safeParse({ ...minimo, empresa: '  TechNova  ' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.empresa).toBe('TechNova');
  });

  it('rejeita tipo errado em campo de texto', () => {
    expect(erros({ ...minimo, diferenciais: { malicioso: true } })).toContain('diferenciais');
    expect(erros({ ...minimo, anterior: 42 })).toContain('anterior');
  });
});