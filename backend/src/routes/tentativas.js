const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../db/pool');
const { hashIp } = require('../middleware/hashIp');

const router = express.Router();

const validarEnvio = [
  body('nome_participante')
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage('Nome deve ter entre 1 e 80 caracteres.')
    .escape(), // sanitiza contra XSS
  body('respostas')
    .isArray({ min: 1, max: 50 })
    .withMessage('Respostas devem ser uma lista.'),
  body('respostas.*.pergunta_id')
    .isInt({ min: 1 })
    .withMessage('pergunta_id inválido.')
    .toInt(),
  body('respostas.*.opcao_id')
    .isInt({ min: 1 })
    .withMessage('opcao_id inválido.')
    .toInt(),
];

// POST /api/tentativas
// Recebe { nome_participante, respostas: [{ pergunta_id, opcao_id }] }
// Calcula a nota NO SERVIDOR (nunca confia em nota vinda do cliente).
router.post('/', validarEnvio, async (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erro: 'Dados inválidos.', detalhes: erros.array() });
  }

  const { nome_participante, respostas } = req.body;

  // Remove duplicatas de pergunta_id (só considera a última resposta por pergunta)
  const respostasUnicas = Array.from(
    new Map(respostas.map((r) => [r.pergunta_id, r])).values()
  );

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Busca quais opções são realmente corretas para as perguntas enviadas
    const perguntaIds = respostasUnicas.map((r) => r.pergunta_id);
    const opcaoIds = respostasUnicas.map((r) => r.opcao_id);

    const { rows: opcoesReais } = await client.query(
      `SELECT id AS opcao_id, pergunta_id, correta
       FROM opcoes
       WHERE pergunta_id = ANY($1::int[]) AND id = ANY($2::int[])`,
      [perguntaIds, opcaoIds]
    );

    const mapaOpcoes = new Map(opcoesReais.map((o) => [`${o.pergunta_id}-${o.opcao_id}`, o.correta]));

    let acertos = 0;
    const respostasParaSalvar = [];

    for (const r of respostasUnicas) {
      const chave = `${r.pergunta_id}-${r.opcao_id}`;
      const correta = mapaOpcoes.get(chave);
      if (correta === undefined) {
        // opcao_id não pertence a essa pergunta -> requisição malformada/adulterada
        await client.query('ROLLBACK');
        return res.status(400).json({ erro: 'Combinação de pergunta/opção inválida.' });
      }
      if (correta) acertos += 1;
      respostasParaSalvar.push({ pergunta_id: r.pergunta_id, opcao_id: r.opcao_id, correta });
    }

    const total = respostasUnicas.length;
    const pontuacaoPct = total > 0 ? Number(((acertos / total) * 100).toFixed(2)) : 0;
    const ipHash = hashIp(req.ip);

    const { rows: tentativaRows } = await client.query(
      `INSERT INTO tentativas (nome_participante, pontuacao_pct, total_perguntas, total_acertos, ip_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, criado_em`,
      [nome_participante, pontuacaoPct, total, acertos, ipHash]
    );

    const tentativaId = tentativaRows[0].id;

    for (const r of respostasParaSalvar) {
      await client.query(
        `INSERT INTO respostas (tentativa_id, pergunta_id, opcao_id, correta)
         VALUES ($1, $2, $3, $4)`,
        [tentativaId, r.pergunta_id, r.opcao_id, r.correta]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      tentativa_id: tentativaId,
      pontuacao_pct: pontuacaoPct,
      total_acertos: acertos,
      total_perguntas: total,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
