import { describe, it, expect } from 'vitest';
import { descriptionToPlainText, descriptionToHtml } from '../lib/markdown';

const SAMPLE = [
  '**Sobre a Vaga**',
  'Texto com **negrito** no meio.',
  '',
  '## Requisitos',
  '- Item um',
  '- Item **dois**',
].join('\n');

describe('descriptionToPlainText', () => {
  it('strips markdown markers', () => {
    const out = descriptionToPlainText(SAMPLE);
    expect(out).not.toContain('**');
    expect(out).not.toContain('##');
  });

  it('keeps heading and paragraph text', () => {
    const out = descriptionToPlainText(SAMPLE);
    expect(out).toContain('Sobre a Vaga');
    expect(out).toContain('Texto com negrito no meio.');
    expect(out).toContain('Requisitos');
  });

  it('renders bullets with • marker', () => {
    const out = descriptionToPlainText(SAMPLE);
    expect(out).toContain('• Item um');
    expect(out).toContain('• Item dois');
  });
});

describe('descriptionToHtml', () => {
  it('renders headings, bold and list items', () => {
    const out = descriptionToHtml(SAMPLE);
    expect(out).toContain('<h3>Sobre a Vaga</h3>');
    expect(out).toContain('<strong>negrito</strong>');
    expect(out).toContain('<li>Item um</li>');
    expect(out).toContain('<li>Item <strong>dois</strong></li>');
  });

  it('escapes HTML in the source text', () => {
    const out = descriptionToHtml('Texto com <script>alert(1)</script> perigoso.');
    expect(out).not.toContain('<script>');
    expect(out).toContain('&lt;script&gt;');
  });
});
