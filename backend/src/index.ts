import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
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

app.listen(PORT, () => {
  console.log(`VagaAI backend rodando na porta ${PORT}`);
});

export default app;
