import request from 'supertest';
import type { Express } from 'express';

// Impede o app.listen ao importar o app (mesmo caminho do deploy serverless).
process.env.VERCEL = '1';

let app: Express;

beforeAll(() => {
  // require (não import) para garantir que process.env.VERCEL já esteja setado.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app = require('../src/index').default;
});

describe('app', () => {
  it('responds ok on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('sends CORS headers for allowed origin', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'http://localhost:5173');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('omits CORS headers for disallowed origin without erroring', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'https://site-malicioso.example');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
