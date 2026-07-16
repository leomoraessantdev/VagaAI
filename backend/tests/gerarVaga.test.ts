import request from 'supertest';
import express from 'express';

const mockCreate = jest.fn();

jest.mock('groq-sdk', () => {
  const MockGroq = jest.fn().mockImplementation(() => ({
    chat: { completions: { create: mockCreate } },
  }));
  return {
    __esModule: true,
    default: MockGroq,
  };
});

process.env.GROQ_API_KEY = 'test-key';

import gerarVagaRouter from '../src/routes/gerarVaga';

const app = express();
app.use(express.json());
app.use('/api', gerarVagaRouter);

function streamDeChunks(textos: string[], finishReason = 'stop') {
  return {
    async *[Symbol.asyncIterator]() {
      for (let i = 0; i < textos.length; i++) {
        const ultimo = i === textos.length - 1;
        yield {
          choices: [
            { delta: { content: textos[i] }, finish_reason: ultimo ? finishReason : null },
          ],
        };
      }
    },
  };
}

function parseEventos(text: string): Array<Record<string, unknown>> {
  return text
    .split('\n\n')
    .filter((bloco) => bloco.startsWith('data: '))
    .map((bloco) => JSON.parse(bloco.slice(6)));
}

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

beforeEach(() => {
  mockCreate.mockReset();
  mockCreate.mockResolvedValue(
    streamDeChunks(['Descrição gerada ', 'pela IA para teste.']),
  );
});

describe('POST /api/gerar-vaga', () => {
  it('streams descricao as SSE on valid input', async () => {
    const res = await request(app).post('/api/gerar-vaga').send(validBody);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/event-stream');

    const eventos = parseEventos(res.text);
    const texto = eventos.map((e) => e.delta ?? '').join('');
    expect(texto).toBe('Descrição gerada pela IA para teste.');
    expect(eventos[eventos.length - 1]).toEqual({ done: true, truncada: false });
  });

  it('marks truncada when finish_reason is length', async () => {
    mockCreate.mockResolvedValue(streamDeChunks(['Descrição cortada'], 'length'));
    const res = await request(app).post('/api/gerar-vaga').send(validBody);
    const eventos = parseEventos(res.text);
    expect(eventos[eventos.length - 1]).toEqual({ done: true, truncada: true });
  });

  it('calls Groq with stream, max_tokens 2048 and anterior in prompt', async () => {
    await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, anterior: 'Versão anterior da descrição.' });

    const params = mockCreate.mock.calls[0][0];
    expect(params.stream).toBe(true);
    expect(params.max_tokens).toBe(2048);
    expect(params.messages[1].content).toContain('Versão anterior da descrição.');
  });

  it('uses higher temperature on regeneration than on first generation', async () => {
    await request(app).post('/api/gerar-vaga').send(validBody);
    await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, anterior: 'Versão anterior.' });

    const primeira = mockCreate.mock.calls[0][0].temperature;
    const regeneracao = mockCreate.mock.calls[1][0].temperature;
    expect(regeneracao).toBeGreaterThan(primeira);
  });

  it('returns 400 when cargo is missing', async () => {
    const { cargo: _, ...body } = validBody;
    const res = await request(app).post('/api/gerar-vaga').send(body);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('returns 400 when cargo is only whitespace', async () => {
    const res = await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, cargo: '   ' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when cargo exceeds max length', async () => {
    const res = await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, cargo: 'x'.repeat(121) });
    expect(res.status).toBe(400);
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

  it('returns 400 when diferenciais is not a string', async () => {
    const res = await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, diferenciais: { malicioso: true } });
    expect(res.status).toBe(400);
  });

  it('returns 400 when anterior is not a string', async () => {
    const res = await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, anterior: 42 });
    expect(res.status).toBe(400);
  });

  it('accepts empty diferenciais and beneficios', async () => {
    const res = await request(app)
      .post('/api/gerar-vaga')
      .send({ ...validBody, diferenciais: '', beneficios: '' });
    expect(res.status).toBe(200);
  });

  it('returns 500 JSON when Groq create rejects', async () => {
    mockCreate.mockRejectedValue(new Error('boom'));
    const res = await request(app).post('/api/gerar-vaga').send(validBody);
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('erro');
  });

  it('sends SSE erro event when stream fails mid-flight', async () => {
    mockCreate.mockResolvedValue({
      async *[Symbol.asyncIterator]() {
        yield { choices: [{ delta: { content: 'Começo...' }, finish_reason: null }] };
        throw new Error('stream quebrou');
      },
    });
    const res = await request(app).post('/api/gerar-vaga').send(validBody);
    expect(res.status).toBe(200);
    const eventos = parseEventos(res.text);
    expect(eventos.some((e) => typeof e.erro === 'string')).toBe(true);
  });

  it('sends erro when stream produces no text', async () => {
    mockCreate.mockResolvedValue(streamDeChunks([''], 'stop'));
    const res = await request(app).post('/api/gerar-vaga').send(validBody);
    const eventos = parseEventos(res.text);
    expect(eventos.some((e) => typeof e.erro === 'string')).toBe(true);
  });
});
