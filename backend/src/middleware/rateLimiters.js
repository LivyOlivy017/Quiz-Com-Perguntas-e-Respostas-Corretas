const rateLimit = require('express-rate-limit');

// Limite geral: protege toda a API de flood básico
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisições. Tente novamente mais tarde.' },
});

// Limite estrito só para o envio do quiz: evita spam/força-bruta de respostas
const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de envio. Espere um pouco antes de tentar de novo.' },
});

module.exports = { generalLimiter, submitLimiter };
