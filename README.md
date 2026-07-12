# O Quiz da Livinha 💌

Um site de quiz com 7 perguntas sobre a Livia — só quem realmente a conhece
consegue tirar uma nota alta. Feito pra mandar o link pra mãe dela.

## Estrutura do projeto

```
quiz-da-livinha/
├── frontend/   → React + Vite, hospedado no Vercel
└── backend/    → Node.js + Express, hospedado no Render (ou similar)
```

O banco de dados (PostgreSQL) fica em um provedor separado, como **Neon** ou
**Supabase** (ambos têm plano gratuito e já vêm com SSL configurado).

## Passo a passo do deploy (do zero)

### 1) Criar o banco de dados PostgreSQL

1. Crie uma conta gratuita em [neon.tech](https://neon.tech) (ou supabase.com).
2. Crie um novo projeto/banco e copie a **connection string** (algo como
   `postgresql://usuario:senha@host/banco?sslmode=require`).
3. Guarde essa string — ela vai virar a variável `DATABASE_URL`.

### 2) Popular o banco com as tabelas e as perguntas

Você pode rodar o SQL direto no editor SQL do Neon/Supabase, na ordem:

1. Cole e rode o conteúdo de `backend/src/db/schema.sql`
2. Cole e rode o conteúdo de `backend/src/db/seed.sql`

Ou, se preferir, rode localmente com Node (veja `backend/README.md`).

### 3) Subir o back-end (Render)

1. Suba a pasta `backend/` para um repositório no GitHub.
2. Em [render.com](https://render.com), crie um **Web Service** apontando
   pro repositório, com:
   - Build command: `npm install`
   - Start command: `npm start`
3. Configure as variáveis de ambiente (aba "Environment") copiando de
   `backend/.env.example`, com os valores reais:
   - `DATABASE_URL`
   - `ALLOWED_ORIGINS` (deixe em branco por enquanto, você volta aqui depois
     de ter a URL do Vercel)
   - `IP_HASH_SALT` (invente uma string aleatória grande)
   - `NODE_ENV=production`
4. Depois do deploy, copie a URL pública do backend (ex:
   `https://quiz-da-livinha-backend.onrender.com`).

### 4) Subir o front-end (Vercel)

1. Suba a pasta `frontend/` para um repositório no GitHub (pode ser o mesmo
   repositório, em pastas separadas, ou dois repositórios — os dois funcionam).
2. Em [vercel.com](https://vercel.com), importe o repositório e aponte o
   **Root Directory** para `frontend`.
3. Configure a variável de ambiente:
   - `VITE_API_URL` = a URL do back-end que você copiou no passo anterior
4. Faça o deploy. O Vercel vai te dar um link tipo
   `https://o-quiz-da-livinha.vercel.app`.

### 5) Fechar o círculo da segurança (CORS)

Volte no Render e edite a variável `ALLOWED_ORIGINS` do back-end para o link
exato do Vercel que você recebeu, ex:

```
ALLOWED_ORIGINS=https://o-quiz-da-livinha.vercel.app
```

Salve — o Render vai reiniciar o serviço automaticamente. Isso garante que
**só o seu site** pode chamar sua API.

### 6) Testar e mandar pra sua mãe

Abra o link do Vercel, jogue uma vez você mesma pra conferir, e depois é só
mandar o link. 💛

---

## Segurança incluída

- **Helmet** — cabeçalhos HTTP seguros (CSP, no-sniff, sem exposição de tecnologia).
- **CORS restrito** — só o domínio do seu Vercel pode chamar a API.
- **Rate limiting** — geral (100 req/15min) e mais rígido no envio de respostas
  (10 envios/10min), contra spam e força bruta.
- **Validação e sanitização de entrada** (express-validator) — nomes são
  limitados e escapados contra XSS; IDs são validados como inteiros.
- **Prepared statements** — todas as queries usam parâmetros (`$1, $2...`),
  nunca concatenação de string, o que elimina SQL injection.
- **Nota calculada no servidor** — o front-end nunca envia "acertei" ou a
  nota; o back-end recalcula tudo comparando com o banco.
- **IP com hash** — o back-end guarda um hash do IP (não o IP puro) só pra
  fins de limite de tentativas, nunca o dado bruto.
- **`noindex`** no HTML — o site não aparece em buscadores.
- **Payload limitado** (20kb) e proteção contra HTTP Parameter Pollution (hpp).

## Editando as perguntas

Quer trocar ou adicionar perguntas depois? Edite o arquivo
`backend/src/db/seed.sql`, rode de novo no banco (ou crie um novo arquivo
`seed2.sql` só com o `INSERT` novo) — não precisa mexer no código do
back-end nem do front-end, ele lê tudo direto do banco.
