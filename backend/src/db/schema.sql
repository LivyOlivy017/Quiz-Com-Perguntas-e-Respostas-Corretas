-- ============================================
-- O Quiz da Livinha — Schema do PostgreSQL
-- ============================================
-- Rode este arquivo uma vez no seu banco (Neon, Supabase, etc)
-- antes de subir o back-end.

-- Extensão para gerar UUIDs (a maioria dos provedores já vem com ela)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) Categorias das perguntas (infância, gostos, sobre mim, etc)
CREATE TABLE IF NOT EXISTS categorias (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(50) NOT NULL UNIQUE
);

-- 2) Perguntas
CREATE TABLE IF NOT EXISTS perguntas (
    id            SERIAL PRIMARY KEY,
    categoria_id  INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    texto         TEXT NOT NULL,
    ordem         INTEGER NOT NULL,
    ativa         BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3) Opções de resposta de cada pergunta (múltipla escolha)
--    "correta" nunca é exposta para o front-end antes do envio da resposta.
CREATE TABLE IF NOT EXISTS opcoes (
    id            SERIAL PRIMARY KEY,
    pergunta_id   INTEGER NOT NULL REFERENCES perguntas(id) ON DELETE CASCADE,
    texto         VARCHAR(120) NOT NULL,
    correta       BOOLEAN NOT NULL DEFAULT FALSE
);

-- 4) Tentativas (cada vez que alguém joga o quiz completo)
CREATE TABLE IF NOT EXISTS tentativas (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_participante  VARCHAR(80) NOT NULL,
    pontuacao_pct      NUMERIC(5,2) NOT NULL, -- 0.00 a 100.00
    total_perguntas    INTEGER NOT NULL,
    total_acertos      INTEGER NOT NULL,
    criado_em          TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_hash            VARCHAR(64) -- hash do IP, nunca o IP puro (privacidade)
);

-- 5) Respostas individuais de cada tentativa (auditoria / histórico)
CREATE TABLE IF NOT EXISTS respostas (
    id            SERIAL PRIMARY KEY,
    tentativa_id  UUID NOT NULL REFERENCES tentativas(id) ON DELETE CASCADE,
    pergunta_id   INTEGER NOT NULL REFERENCES perguntas(id),
    opcao_id      INTEGER NOT NULL REFERENCES opcoes(id),
    correta       BOOLEAN NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_perguntas_categoria ON perguntas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_opcoes_pergunta ON opcoes(pergunta_id);
CREATE INDEX IF NOT EXISTS idx_respostas_tentativa ON respostas(tentativa_id);
