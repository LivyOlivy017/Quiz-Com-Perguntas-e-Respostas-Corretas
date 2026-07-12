const crypto = require('crypto');

// Nunca guardamos o IP puro no banco - só um hash (com salt secreto do .env).
// Isso permite, por exemplo, notar tentativas repetidas sem expor dado pessoal.
function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT || 'troque-este-salt-no-env';
  return crypto.createHash('sha256').update(`${salt}:${ip || 'desconhecido'}`).digest('hex');
}

module.exports = { hashIp };
