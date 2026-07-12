// Script utilitário: roda schema.sql e seed.sql no banco configurado em DATABASE_URL.
// Uso: npm run seed
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function run() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

  const client = await pool.connect();
  try {
    console.log('Aplicando schema...');
    await client.query(schema);
    console.log('Aplicando seed...');
    await client.query(seed);
    console.log('Pronto! Banco populado com sucesso.');
  } catch (err) {
    console.error('Erro ao rodar schema/seed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
