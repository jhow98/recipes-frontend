# 🍽️ Receitas App – Frontend Vue.js + TypeScript

Aplicação SPA em Vue 3 + TypeScript para consumo da API de receitas, com formulários de CRUD, autenticação JWT e geração de PDF.

---

## 📥 Como Clonar e Rodar Localmente

### Pré-requisitos
- Node.js ≥ 18
- npm ou yarn
- Docker & Docker Compose (opcional)

```bash
# clone o repositório
git clone https://github.com/jhow98/recipes-frontend
cd recipes-frontend

# instale dependências
npm install
# ou
# yarn install
```

### Rodar em modo dev
```bash
npm run serve
# ou
yarn serve
```
Acesse http://localhost:8080.

---

## 🐳 Docker

### Build e run
```bash
docker-compose up --build
```
- Frontend disponível em http://localhost:8080
- Usa variável de ambiente `VUE_APP_API_BASE_URL`

### .env
```dotenv
VUE_APP_API_BASE_URL=https://recipes-backend-zqco.onrender.com
```

---

## 🚨 Lint & Formatação

- **ESLint**: `npm run lint` e `npm run lint:fix` para corrigir automaticamente
- **Pre-commit hook** via Husky roda ESLint em `git add`

---

## 🧪 Testes

### Testes Unitários (Jest + Vue Test Utils)
```bash
npm run test:unit
```
Cobertura em `tests/unit` para composables, componentes e pages.

### Testes E2E (Cypress)
```bash
npm run cy:open    # abre UI do Cypress
npm run cy:run     # roda headless
```
Specs em `src/cypress/e2e`.

---

## 📚 Gitflow

- Branche principal: `develop`
- Features: `feature/nome-descricao`
- Hotfixes: `hotfix/nome-descricao`
- Pull Requests obrigatório para `develop`
- Referência para commits: Guia do commit amigão

---

## ⚙️ API

Configuração de baseURL em `src/services/api.ts`:
```ts
import axios from 'axios';

const baseURL =
  process.env.VUE_APP_API_BASE_URL ||
  window.location.origin;

export default axios.create({ baseURL });
```

---

## 🌐 Deploy

- Frontend hospedado em: https://recipes-frontend-dun.vercel.app

## ✅ Status

- ✅ UI de CRUD de receitas
- ✅ Autenticação JWT
- ✅ Testes unitários e E2E
- ✅ Docker + Docker Compose

---

## 🛠️ Possíveis melhorias

- Cobertura de testes e2e em casos específicos
- Testes de acessibilidade (axe)
- Internacionalização (i18n)
- Dark mode

---

> Desenvolvido por Jhonatan Camargo
