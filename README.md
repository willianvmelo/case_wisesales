# Wise Sales - Mini E-commerce

Projeto full stack desenvolvido para teste técnico.

## Stack

Backend:
- FastAPI
- PostgreSQL
- psycopg2
- Alembic
- Pytest

Frontend:
- React + Vite
- Context API
- Axios
- Tailwind
- Vitest

## Funcionalidades

- Listagem de produtos
- Filtro por categoria
- Carrinho (add, update, remove)
- Aplicação de cupons (percentual e fixo)
- Validação de estoque
- Cálculo de subtotal, desconto e total

## Como rodar (Docker)

```bash
docker compose up --build
```

Frontend: http://localhost:3000  
Backend: http://localhost:8000  
Docs: http://localhost:8000/docs

## Testes

### Executando localmente

#### Backend
```bash
cd backend
pytest
ruff check .
```

#### Frontend
```bash
cd frontend
npm run test
npm run lint
```

---

### Executando via Docker

#### Backend

```bash
docker compose exec api pytest
docker compose exec api ruff check .
```

---

### Observação

Os testes do frontend devem ser executados localmente, pois o container final utiliza Nginx apenas para servir a aplicação.

Certifique-se de que os containers estão rodando:

```bash
docker compose up -d
```

## Estrutura

```
backend/
frontend/
docker-compose.yml
seed.sql
```

## Observações

- Backend é fonte da verdade para cálculos
- Projeto estruturado em camadas
- Frontend usa estado global com Context

## Melhorias futuras

- autenticação
- persistência de carrinho por usuário
- testes E2E
