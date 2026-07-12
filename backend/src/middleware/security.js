const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');

// Lista de origens permitidas a partir do .env, separadas por vírgula.
// Ex: ALLOWED_ORIGINS=https://o-quiz-da-livinha.vercel.app
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Permite chamadas sem origin (ex: health checks, curl) apenas em dev
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origem não permitida pelo CORS.'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  maxAge: 600,
};

function applySecurityMiddleware(app) {
  // Helmet: cabeçalhos HTTP seguros (CSP, no-sniff, frameguard, HSTS, etc)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'same-site' },
    })
  );

  // Esconde qual tecnologia roda por trás (evita fingerprinting fácil)
  app.disable('x-powered-by');

  // CORS restrito só ao(s) domínio(s) do front-end
  app.use(cors(corsOptions));

  // Proteção contra HTTP Parameter Pollution
  app.use(hpp());

  // Força o Express a confiar no header X-Forwarded-For do provedor
  // (necessário para rate limit e hash de IP funcionarem corretamente atrás de proxy)
  app.set('trust proxy', 1);
}

module.exports = { applySecurityMiddleware, corsOptions };
