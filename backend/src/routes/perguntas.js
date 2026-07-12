const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

// GET /api/perguntas
// Retorna as perguntas com opções, agrupadas por categoria.
// IMPORTANTE: nunca inclui o campo "correta" - isso é decidido só no back-end.
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         p.id            AS pergunta_id,
         p.texto         AS pergunta_texto,
         p.ordem,
         c.nome          AS categoria,
         o.id            AS opcao_id,
         o.texto         AS opcao_texto
       FROM perguntas p
       JOIN categorias c ON c.id = p.categoria_id
       JOIN opcoes o ON o.pergunta_id = p.id
       WHERE p.ativa = TRUE
       ORDER BY p.ordem ASC, o.id ASC`
    );

    const porPergunta = new Map();
    for (const row of rows) {
      if (!porPergunta.has(row.pergunta_id)) {
        porPergunta.set(row.pergunta_id, {
          id: row.pergunta_id,
          texto: row.pergunta_texto,
          categoria: row.categoria,
          ordem: row.ordem,
          opcoes: [],
        });
      }
      // Embaralha a ordem de exibição das opções a cada request (mais difícil decorar)
      porPergunta.get(row.pergunta_id).opcoes.push({ id: row.opcao_id, texto: row.opcao_texto });
    }

    const perguntas = Array.from(porPergunta.values()).map((p) => ({
      ...p,
      opcoes: p.opcoes.sort(() => Math.random() - 0.5),
    }));

    res.json({ perguntas });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
