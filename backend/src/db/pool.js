// Pool de conexão com o PostgreSQL.
// Usa SSL (necessário na maioria dos provedores como Neon/Supabase/Render).
// NUNCA colocar credenciais direto no código - sempre via variáveis de ambiente.

const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não definida. Configure o arquivo .env (veja .env.example).');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  // Nunca deixa o processo cair silenciosamente por erro de conexão ociosa
  console.error('Erro inesperado no pool do PostgreSQL:', err.message);
});

module.exports = pool;
