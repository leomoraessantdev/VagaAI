import { verificarConformidade } from '../lib/conformidade';

function alertar(texto: string) {
  return verificarConformidade([{ campo: 'Requisitos', valor: texto }]);
}

describe('verificarConformidade', () => {
  it('não acusa nada em texto limpo', () => {
    expect(alertar('React, TypeScript, 3 anos de experiência com APIs REST')).toEqual([]);
    expect(alertar('Disponibilidade para escala 6x1 e uso de EPIs')).toEqual([]);
  });

  it('ignora campo vazio ou ausente', () => {
    expect(verificarConformidade([{ campo: 'Requisitos', valor: undefined }])).toEqual([]);
    expect(alertar('')).toEqual([]);
  });

  it.each([
    ['idade máxima de 30 anos', /idade/i],
    ['faixa etária de 20 a 30', /idade/i],
    ['candidatos com até 35 anos', /idade/i],
    ['sexo masculino', /sexo|gênero/i],
    ['somente mulheres para a função', /sexo|gênero/i],
    ['preferencialmente solteiro', /estado civil/i],
    ['de preferência sem filhos', /filhos/i],
    ['exigimos teste de gravidez na admissão', /gravidez/i],
    ['boa aparência e proatividade', /aparência/i],
    ['preferência por evangélicos', /religião/i],
    ['candidatos de cor branca', /raça|afirmativa/i],
  ])('acusa "%s"', (texto, motivoEsperado) => {
    const alertas = alertar(texto);
    expect(alertas.length).toBeGreaterThan(0);
    expect(alertas.some((a) => motivoEsperado.test(a.motivo))).toBe(true);
  });

  it('não confunde tempo de experiência com limite de idade', () => {
    expect(alertar('até 5 anos de experiência em vendas')).toEqual([]);
    expect(alertar('de 2 a 4 anos de experiência')).toEqual([]);
  });

  it('não acusa vaga afirmativa escrita corretamente', () => {
    expect(alertar('Vaga afirmativa para pessoas negras e mulheres')).toEqual([]);
    expect(alertar('Prioridade para pessoas com deficiência (PCD)')).toEqual([]);
  });

  it('identifica o campo e recorta o trecho para o recrutador se localizar', () => {
    const alertas = verificarConformidade([
      { campo: 'Responsabilidades', valor: 'Atender clientes com boa aparência e simpatia' },
    ]);
    expect(alertas[0].campo).toBe('Responsabilidades');
    expect(alertas[0].trecho).toContain('boa aparência');
  });

  it('acumula alertas de campos diferentes', () => {
    const alertas = verificarConformidade([
      { campo: 'Requisitos', valor: 'sexo feminino' },
      { campo: 'Diferenciais', valor: 'boa aparência' },
    ]);
    expect(alertas).toHaveLength(2);
    expect(alertas.map((a) => a.campo)).toEqual(['Requisitos', 'Diferenciais']);
  });

  it('gera ids únicos para servir de key na lista', () => {
    const alertas = verificarConformidade([
      { campo: 'Requisitos', valor: 'idade máxima de 30 anos e boa aparência' },
    ]);
    expect(new Set(alertas.map((a) => a.id)).size).toBe(alertas.length);
  });
});