import { buildPrompt, SYSTEM_PROMPT } from '../src/lib/buildPrompt';
import { JobFormData } from '../src/types';

const base: JobFormData = {
  cargo: 'Desenvolvedor Frontend',
  area: 'Tecnologia',
  nivel: 'pleno',
  modalidade: 'remoto',
  responsabilidades: 'Desenvolver interfaces React',
  requisitos: 'React, TypeScript, 3 anos de experiência',
  diferenciais: 'Next.js, GraphQL',
  beneficios: 'Vale refeição, plano de saúde',
  tom: 'moderno',
};

describe('buildPrompt', () => {
  it('includes cargo', () => {
    expect(buildPrompt(base)).toContain('Desenvolvedor Frontend');
  });

  it('maps nivel to Portuguese', () => {
    expect(buildPrompt(base)).toContain('Pleno');
  });

  it('maps modalidade hibrido to Híbrido', () => {
    expect(buildPrompt({ ...base, modalidade: 'hibrido' })).toContain('Híbrido');
  });

  it('maps modalidade presencial', () => {
    expect(buildPrompt({ ...base, modalidade: 'presencial' })).toContain('Presencial');
  });

  it('includes responsabilidades', () => {
    expect(buildPrompt(base)).toContain('Desenvolver interfaces React');
  });

  it('includes diferenciais when provided', () => {
    expect(buildPrompt(base)).toContain('Next.js, GraphQL');
  });

  it('omits diferenciais section when empty string', () => {
    expect(buildPrompt({ ...base, diferenciais: '' })).not.toContain('Diferenciais');
  });

  it('maps tom formal', () => {
    expect(buildPrompt({ ...base, tom: 'formal' })).toContain('formal e profissional');
  });

  it('maps tom descontraido', () => {
    expect(buildPrompt({ ...base, tom: 'descontraido' })).toContain('descontraído');
  });

  it('adds regeneration instruction when seed provided', () => {
    expect(buildPrompt(base, 'abc')).toContain('versão DIFERENTE');
  });

  it('no regeneration instruction without seed', () => {
    expect(buildPrompt(base)).not.toContain('versão DIFERENTE');
  });
});

describe('SYSTEM_PROMPT', () => {
  it('is a non-empty string', () => {
    expect(typeof SYSTEM_PROMPT).toBe('string');
    expect(SYSTEM_PROMPT.length).toBeGreaterThan(0);
  });
});
