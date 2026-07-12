# Back-end — O Quiz da Livinha

Node.js + Express + PostgreSQL.

## Rodando localmente

```bash
npm install
cp .env.example .env
# edite o .env com sua DATABASE_URL real

npm run seed   # cria as tabelas e insere as perguntas
npm run dev    # sobe o servidor em http://localhost:3001
```

## Rotas

| Método | Rota                | Descrição                                             |
|--------|----------------------|--------------------------------------------------------|
| GET    | `/api/health`         | Verifica se o serviço está no ar                       |
| GET    | `/api/perguntas`      | Lista as perguntas ativas com opções (sem a correta)    |
| POST   | `/api/tentativas`     | Envia respostas, calcula a nota e salva no banco        |

### Exemplo de POST `/api/tentativas`

```json
{
  "nome_participante": "Mãe da Livia",
  "respostas": [
    { "pergunta_id": 1, "opcao_id": 3 },
    { "pergunta_id": 2, "opcao_id": 7 }
  ]
}
```

## Tabelas (ver `src/db/schema.sql`)

- `categorias` — nome das categorias das perguntas
- `perguntas` — texto e categoria de cada pergunta
- `opcoes` — alternativas de cada pergunta, com a flag `correta`
- `tentativas` — cada jogada completa, com nome e nota final
- `respostas` — cada resposta individual de cada tentativa (auditoria)

## Deploy

Veja o passo a passo completo no `README.md` da raiz do projeto.
