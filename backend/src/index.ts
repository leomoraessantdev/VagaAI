import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

// Atrás do proxy da Vercel/Render o IP real vem em X-Forwarded-For;
// sem isso o express-rate-limit rejeita as requisições.
app.set('trust proxy', 1);

app.use(cors({
  // Origem não permitida: responde sem headers CORS (navegador bloqueia)
  // em vez de derrubar a requisição com erro 500.
  origin: (origin, callback) => {
    callback(null, !origin || allowedOrigins.includes(origin));
  },
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '10kb' }));

app.use(
  '/api/gerar-vaga',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { erro: 'Muitas requisições. Tente novamente em 15 minutos.' },
  }),
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

import gerarVagaRouter from './routes/gerarVaga';
app.use('/api', gerarVagaRouter);

// Na Vercel o app roda como serverless function (ver api/index.ts);
// só abre porta em execução local/Render.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`VagaAI backend rodando na porta ${PORT}`);
  });
}

export default app;
