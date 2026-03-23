# Wise Sales - Mini E-commerce

##  Descrição do Projeto

Este projeto é uma aplicação full stack de e-commerce simplificado, desenvolvida como parte de um teste técnico.  
A aplicação permite a navegação de produtos, adição ao carrinho e aplicação de cupons de desconto, com validações de estoque e cálculo de valores.

O objetivo principal foi demonstrar boas práticas de arquitetura, organização de código, testes e uso de containers para execução simplificada.

---

##  Funcionalidades

- Listagem de produtos
- Filtro por categoria
- Carrinho de compras:
  - Adicionar item
  - Atualizar quantidade
  - Remover item
- Aplicação de cupons:
  - Percentual
  - Valor fixo
- Validação de estoque
- Cálculo de subtotal, desconto e total
- API documentada (Swagger)

---

## Tecnologias Utilizadas

### Backend
- **FastAPI** → alta performance, tipagem forte e documentação automática
- **PostgreSQL** → banco relacional robusto
- **psycopg2** → driver leve e eficiente
- **Alembic** → controle de migrações
- **Pytest** → testes automatizados

### Frontend
- **React + Vite** → desenvolvimento rápido e moderno
- **Context API** → gerenciamento de estado global
- **Axios** → comunicação com API
- **TailwindCSS** → estilização rápida e consistente
- **Vitest** → testes unitários

### Infraestrutura
- **Docker + Docker Compose** → padronização e facilidade de execução

---

## Como Executar o Projeto

### Pré-requisitos
- Docker
- Docker Compose

### Execução

```bash
docker compose up --build
```

### Acessos

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Docs da API: http://localhost:8000/docs

---

## Testes

### Backend (via Docker)

```bash
docker compose exec api pytest
docker compose exec api ruff check .
```

### Frontend (local)

```bash
cd frontend
npm install
npm run test
npm run lint
```

---

## Decisões Técnicas

- **Backend como fonte da verdade**  
  Toda a lógica de cálculo (subtotal, desconto e total) está centralizada no backend para garantir consistência.

- **Arquitetura em camadas (Controller → Service → Repository)**  
  Facilita manutenção, testes e evolução do sistema.

- **Uso de Docker**  
  Elimina dependências locais e reduz fricção para execução do projeto.

- **Tratamento flexível de CORS**  
  Implementado parsing para aceitar múltiplos formatos de configuração, evitando erros comuns em ambiente Docker.

- **Estado global no frontend com Context API**  
  Simples e suficiente para o escopo do projeto, evitando complexidade desnecessária.

---

## O que faria diferente com mais tempo

- Implementar autenticação (JWT)
- Persistência de carrinho por usuário
- Testes E2E (ex: Cypress ou Playwright)
- Melhorar UX/UI (loading states, feedbacks)
- Paginação e busca de produtos
- Observabilidade (logs estruturados e métricas)
- Deploy em ambiente cloud (ex: AWS, Vercel)

---

##  Estrutura do Projeto

```
backend/
frontend/
docker-compose.yml
seed.sql
```

---


