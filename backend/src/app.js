require('dotenv').config();
const express = require('express');
const compression = require('compression');

const { applySecurityMiddleware } = require('./middleware/security');
const { generalLimiter, submitLimiter } = require('./middleware/rateLimiters');
const perguntasRouter = require('./routes/perguntas');
const tentativasRouter = require('./routes/tentativas');

const app = express();

applySecurityMiddleware(app);

app.use(compression());
app.use(express.json({ limit: '20kb' })); // corpo pequeno de propósito: evita payloads gigantes
app.use(generalLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/perguntas', perguntasRouter);
app.use('/api/tentativas', submitLimiter, tentativasRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Handler de erro central - nunca vaza stack trace pro cliente em produção
app.use((err, req, res, next) => {
  if (err.message === 'Origem não permitida pelo CORS.') {
    return res.status(403).json({ erro: 'Origem não permitida.' });
  }
  console.error(err);
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(500).json({ erro: 'Erro interno do servidor.', detalhes: isDev ? err.message : undefined });
});

module.exports = app;
