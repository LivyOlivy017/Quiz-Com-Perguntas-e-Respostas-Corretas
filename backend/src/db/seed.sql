-- ============================================
-- O Quiz da Livinha — Seed (dados reais)
-- ============================================
-- Rode depois do schema.sql. Pode editar os textos livremente.

INSERT INTO categorias (nome) VALUES
    ('Infância'),
    ('Gostos'),
    ('Sobre mim')
ON CONFLICT (nome) DO NOTHING;

-- Pergunta 1
WITH cat AS (SELECT id FROM categorias WHERE nome = 'Infância')
INSERT INTO perguntas (categoria_id, texto, ordem)
SELECT id, 'Qual era o nome do meu primeiro bichinho de estimação?', 1 FROM cat;

INSERT INTO opcoes (pergunta_id, texto, correta)
SELECT id, 'Bob', TRUE FROM perguntas WHERE ordem = 1
UNION ALL SELECT id, 'Rex', FALSE FROM perguntas WHERE ordem = 1
UNION ALL SELECT id, 'Thor', FALSE FROM perguntas WHERE ordem = 1
UNION ALL SELECT id, 'Max', FALSE FROM perguntas WHERE ordem = 1;

-- Pergunta 2
WITH cat AS (SELECT id FROM categorias WHERE nome = 'Infância')
INSERT INTO perguntas (categoria_id, texto, ordem)
SELECT id, 'Quem foi a primeira pessoa a me pegar no colo quando nasci (fora o médico)?', 2 FROM cat;

INSERT INTO opcoes (pergunta_id, texto, correta)
SELECT id, 'Tia Irene', TRUE FROM perguntas WHERE ordem = 2
UNION ALL SELECT id, 'Pai Elifas', FALSE FROM perguntas WHERE ordem = 2
UNION ALL SELECT id, 'Mãe Rosa', FALSE FROM perguntas WHERE ordem = 2
UNION ALL SELECT id, 'Tio Vicente', FALSE FROM perguntas WHERE ordem = 2;

-- Pergunta 3
WITH cat AS (SELECT id FROM categorias WHERE nome = 'Infância')
INSERT INTO perguntas (categoria_id, texto, ordem)
SELECT id, 'Qual foi meu apelido quando eu era criança?', 3 FROM cat;

INSERT INTO opcoes (pergunta_id, texto, correta)
SELECT id, 'Livinha', TRUE FROM perguntas WHERE ordem = 3
UNION ALL SELECT id, 'Lili', FALSE FROM perguntas WHERE ordem = 3
UNION ALL SELECT id, 'Florzinha', FALSE FROM perguntas WHERE ordem = 3
UNION ALL SELECT id, 'Docinho', FALSE FROM perguntas WHERE ordem = 3;

-- Pergunta 4
WITH cat AS (SELECT id FROM categorias WHERE nome = 'Infância')
INSERT INTO perguntas (categoria_id, texto, ordem)
SELECT id, 'Qual era minha comida favorita quando criança?', 4 FROM cat;

INSERT INTO opcoes (pergunta_id, texto, correta)
SELECT id, 'Macarrão', TRUE FROM perguntas WHERE ordem = 4
UNION ALL SELECT id, 'Sushi', FALSE FROM perguntas WHERE ordem = 4
UNION ALL SELECT id, 'Pizza', FALSE FROM perguntas WHERE ordem = 4
UNION ALL SELECT id, 'Lasanha', FALSE FROM perguntas WHERE ordem = 4;

-- Pergunta 5
WITH cat AS (SELECT id FROM categorias WHERE nome = 'Infância')
INSERT INTO perguntas (categoria_id, texto, ordem)
SELECT id, 'Quantos animais de estimação eu já tive?', 5 FROM cat;

INSERT INTO opcoes (pergunta_id, texto, correta)
SELECT id, '6', TRUE FROM perguntas WHERE ordem = 5
UNION ALL SELECT id, '3', FALSE FROM perguntas WHERE ordem = 5
UNION ALL SELECT id, '4', FALSE FROM perguntas WHERE ordem = 5
UNION ALL SELECT id, '7', FALSE FROM perguntas WHERE ordem = 5;

-- Pergunta 6
WITH cat AS (SELECT id FROM categorias WHERE nome = 'Gostos')
INSERT INTO perguntas (categoria_id, texto, ordem)
SELECT id, 'Qual é o meu doce favorito?', 6 FROM cat;

INSERT INTO opcoes (pergunta_id, texto, correta)
SELECT id, 'Suspiro', TRUE FROM perguntas WHERE ordem = 6
UNION ALL SELECT id, 'Pavê', FALSE FROM perguntas WHERE ordem = 6
UNION ALL SELECT id, 'Bolo', FALSE FROM perguntas WHERE ordem = 6
UNION ALL SELECT id, 'Brigadeiro', FALSE FROM perguntas WHERE ordem = 6;

-- Pergunta 7
WITH cat AS (SELECT id FROM categorias WHERE nome = 'Sobre mim')
INSERT INTO perguntas (categoria_id, texto, ordem)
SELECT id, 'Qual é o meu maior medo?', 7 FROM cat;

INSERT INTO opcoes (pergunta_id, texto, correta)
SELECT id, 'Medo de altura', TRUE FROM perguntas WHERE ordem = 7
UNION ALL SELECT id, 'Medo de cobra', FALSE FROM perguntas WHERE ordem = 7
UNION ALL SELECT id, 'Medo de faca', FALSE FROM perguntas WHERE ordem = 7
UNION ALL SELECT id, 'Medo do escuro', FALSE FROM perguntas WHERE ordem = 7;
