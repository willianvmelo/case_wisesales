# Wise Sales API

API REST para o mini e-commerce do teste técnico da Wise Sales.

## Stack

- FastAPI
- PostgreSQL
- psycopg2
- Alembic
- Pytest
- Ruff

## Arquitetura

```
src/
├── config/         # settings e conexão com banco
├── core/           # exceções e handlers globais
├── repositories/   # acesso a dados com SQL puro
├── routes/         # endpoints da API
├── schemas/        # contratos de request/response
└── services/       # regras de negócio
```

## Funcionalidades implementadas

- Listagem de produtos
- Filtro por categoria
- Detalhe de produto
- Carrinho com adição, edição e remoção de itens
- Validação de estoque
- Aplicação e remoção de cupom
- Desconto percentual e fixo
- Total nunca negativo
- Migrações com Alembic
- Testes automatizados

## Como rodar localmente

### 1. Criar ambiente virtual
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Instalar dependências
```bash
pip install -r requirements.txt
```

### 3. Criar arquivo de ambiente
```bash
cp .env.example .env
```

### 4. Subir banco pela raiz do projeto
```bash
docker compose up -d db
```

### 5. Aplicar migrations
```bash
alembic upgrade head
```

### 6. Subir API
```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## Como rodar com Docker Compose

Na raiz do projeto:

```bash
docker compose up --build
```

A API ficará disponível em:

```
http://localhost:8000
```

Swagger:

```
http://localhost:8000/docs
```

## Testes

Com banco rodando e migrations aplicadas:

```bash
pytest
```

## Lint

```bash
ruff check .
```

## Endpoints principais

### Produtos
- `GET /products`
- `GET /products/{id}`

### Carrinho
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/{item_id}`
- `DELETE /cart/items/{item_id}`
- `POST /cart/coupon`
- `DELETE /cart/coupon`
