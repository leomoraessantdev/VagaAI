import request from 'supertest';
import express from 'express';

jest.mock('@anthropic-ai/sdk', () => {
  const mockCreate = jest.fn().mockResolvedValue({
    content: [{ type: 'text', text: 'Descrição gerada pela IA para teste.' }],
  });
  const MockAnthropic = jest.fn().mockImplementation(() => ({
    messages: { create: mockCreate },
  }));
  return {
    __esModule: true,
    default: MockAnthropic,
  };
});

import gerarVagaRouter from '../src/routes/gerarVaga';

const app = express();
app.use(express.json());
app.use('/api', gerarVagaRouter);

const validBody = {
  cargo: 'Desenvolvedor Backend',
  area: 'Tecnologia',
  nivel: 'senior',
  modalidade: 'remoto',
  responsabilidades: 'Desenvolver APIs REST em Node.js',
  requisitos: 'Node.js, TypeScript, 5 anos',
  diferenciais: 'Docker, Kubernetes',
  beneficios: 'Vale refeição, home office',
  tom: 'moderno',
};

describe('POST /api/gerar-vaga', () => {
  it('returns 200 with descricao on valid input', async () => {
    const res = await request(app).post('/api/gerar-vaga').send(validBody);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('descricao');
    expect(typeof res.body.descricao).toBe('string');
    expect(res.body.descricao.length).toBeGreaterThan(0);
  });

  it('returns 400 when cargo is missing', async () => {
    const { cargo: _, ...body } = validBody;
    const res = await request(app).post('/api/gerar-vaga').send(body);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('returns 400 when area is missing', async () => {
    const { area: _, ...body } = validBody;
    const res = await request(app).post('/api/gerar-vaga').send(body);
    expect(res.status).toBe(400);
  });

  it('returns 400 when nivel is invalid', async () => {
    const res = await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, nivel: 'gerente' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when modalidade is invalid', async () => {
    const res = await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, modalidade: 'online' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when tom is invalid', async () => {
    const res = await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, tom: 'bravo' });
    expect(res.status).toBe(400);
  });

  it('accepts optional seed parameter', async () => {
    const res = await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, seed: 'abc123' });
    expect(res.status).toBe(200);
  });
});
