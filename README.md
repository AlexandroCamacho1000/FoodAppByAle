<div align="center">

  <img width="180" src="./frontend/public/logoaledev26.png" alt="FoodApp Logo" />

  # FoodApp — Bolivian Market

  A full-stack e-commerce platform for traditional Bolivian food.

  <a href="https://food-app-by-ale.vercel.app"><img alt="Live Demo" src="https://img.shields.io/badge/LIVE_DEMO-%F0%9F%8C%90_Vercel-00C853?style=for-the-badge"></a>

  ![CI](https://img.shields.io/github/actions/workflow/status/AlexandroCamacho1000/FoodAppByAle/test.yml?branch=main&label=CI&logo=github)
  ![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
  ![Node](https://img.shields.io/badge/Node_20-339933?logo=nodedotjs&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?logo=postgresql&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
  ![Playwright](https://img.shields.io/badge/E2E_Playwright-45ba4b?logo=playwright&logoColor=white)
  ![Tests](https://img.shields.io/badge/49_tests_passing-4CAF50)

  ---

  <img src="./frontend/public/screenshot.png" alt="FoodApp screenshot" width="90%" />

</div>

---

# English

## Overview

**FoodApp — Bolivian Market** is a production-ready, full-stack SaaS-style e-commerce application for traditional Bolivian food. It includes a bilingual interface (ES/EN), dark mode, a role-based admin panel, JWT authentication, Stripe payments, invite-based access and a fully automated CI/CD pipeline.

- **Live demo:** [food-app-by-ale.vercel.app](https://food-app-by-ale.vercel.app)
- **Backend API:** [foodappbyale-production.up.railway.app](https://foodappbyale-production.up.railway.app/api/health)
- **CI/CD:** [GitHub Actions](https://github.com/AlexandroCamacho1000/FoodAppByAle/actions)
- **Tests:** 49 automated (43 unit, 3 integration, 3 E2E)

## Features

- **Catalog** — 33 products across 7 categories with filtering, search and pagination
- **Cart & Checkout** — local cart persistence and Stripe payment integration
- **Authentication** — JWT-based auth with roles (user, admin, superadmin) and invite codes
- **Admin panel** — dashboard, product/order/customer management, analytics and settings
- **Bilingual** — Spanish/English with persistent language selection
- **Dark mode** — theme toggle with system preference detection
- **Responsive UI** — Tailwind CSS 4, mobile-first layout

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, React Router 7, Axios |
| Backend | Node.js 20, Express, PostgreSQL 16, Sequelize, JWT, bcryptjs, Stripe |
| Testing | Vitest, Testing Library, Supertest, Playwright |
| DevOps | Docker & docker-compose, GitHub Actions, Vercel, Railway |

## Architecture

```
┌─────────────┐   HTTPS   ┌──────────────┐   HTTPS   ┌──────────────────┐
│  Vercel     │ ────────▶ │  Railway     │ ────────▶ │  PostgreSQL 16   │
│  (React SPA)│           │  (Express)   │           │  (managed DB)    │
└─────────────┘           └──────────────┘           └──────────────────┘
```

## API Endpoints

- `GET /api/health` — service status and database health
- `GET /api/products` — list products (filter by `category`, `featured`, `active`)
- `GET /api/products/:id` — single product
- `GET /api/products/category/:category` — products by category
- `POST /api/auth/*` — register, login, profile
- `POST /api/cart/*` — cart operations
- `POST /api/orders/*` — order placement and history
- `POST /api/payments/*` — Stripe payment intents

## Project Structure

```
├── backend/                 # Express API + Sequelize
│   └── src/
│       ├── config/          # Database configuration
│       ├── controllers/     # Route handlers
│       ├── models/          # Sequelize models + seed data
│       ├── routes/          # API routes
│       └── server.js        # App entry point
├── frontend/                # React SPA (Vite)
│   ├── e2e/                 # Playwright E2E tests
│   └── src/
│       ├── components/      # UI components
│       ├── context/         # Global state (auth, cart, i18n, dark mode)
│       ├── pages/           # Route pages
│       ├── services/        # API clients
│       └── locales/         # ES/EN translations
├── .github/workflows/       # GitHub Actions CI
└── docker-compose.yml       # Local stack (frontend + backend + DB)
```

## Getting Started

### Docker (one command)

```bash
git clone https://github.com/AlexandroCamacho1000/FoodAppByAle.git
cd FoodAppByAle
docker compose up -d
```

App at `http://localhost` · API at `http://localhost:5000/api`

### Backend

```bash
cd backend
npm install
cp .env.example .env   # edit credentials
npm run dev            # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Testing

```bash
# Frontend — unit tests (43)
cd frontend && npm test

# Frontend — E2E tests (3, Playwright)
cd frontend && npm run test:e2e

# Backend — integration tests (3, requires PostgreSQL)
cd backend && npm test
```

All tests run automatically in CI on every push to `main`.

## Deployment

- **Frontend:** Vercel — SPA rewrites for client-side routing
- **Backend:** Railway — managed PostgreSQL, environment-based config
- **CI/CD:** GitHub Actions with 3 jobs (frontend unit, E2E, backend integration)

## Author

[Alejandro Camacho](https://github.com/AlexandroCamacho1000)

Licensed under the [MIT License](./LICENSE).

---

# Español

## Resumen

**FoodApp — Bolivian Market** es una aplicación full-stack tipo SaaS para e-commerce de comida tradicional boliviana. Incluye interfaz bilingüe (ES/EN), modo oscuro, panel administrador con roles, autenticación JWT, pagos con Stripe, acceso por código de invitación y un pipeline de CI/CD totalmente automatizado.

- **Demo en vivo:** [food-app-by-ale.vercel.app](https://food-app-by-ale.vercel.app)
- **API Backend:** [foodappbyale-production.up.railway.app](https://foodappbyale-production.up.railway.app/api/health)
- **CI/CD:** [GitHub Actions](https://github.com/AlexandroCamacho1000/FoodAppByAle/actions)
- **Tests:** 49 automatizados (43 unitarios, 3 de integración, 3 E2E)

## Características

- **Catálogo** — 33 productos en 7 categorías con filtros, búsqueda y paginación
- **Carrito y checkout** — carrito persistente en local y pagos con Stripe
- **Autenticación** — JWT con roles (usuario, admin, superadmin) y códigos de invitación
- **Panel admin** — dashboard, gestión de productos, pedidos, clientes, analytics y ajustes
- **Bilingüe** — español/inglés con preferencia persistente
- **Modo oscuro** — con detección de preferencia del sistema
- **UI responsive** — Tailwind CSS 4, mobile-first

## Stack Tecnológico

| Capa | Tecnologías |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, React Router 7, Axios |
| Backend | Node.js 20, Express, PostgreSQL 16, Sequelize, JWT, bcryptjs, Stripe |
| Testing | Vitest, Testing Library, Supertest, Playwright |
| DevOps | Docker y docker-compose, GitHub Actions, Vercel, Railway |

## Arquitectura

```
┌─────────────┐   HTTPS   ┌──────────────┐   HTTPS   ┌──────────────────┐
│  Vercel     │ ────────▶ │  Railway     │ ────────▶ │  PostgreSQL 16   │
│  (React SPA)│           │  (Express)   │           │  (DB gestionada) │
└─────────────┘           └──────────────┘           └──────────────────┘
```

## Endpoints de la API

- `GET /api/health` — estado del servicio y de la base de datos
- `GET /api/products` — lista de productos (filtros por `category`, `featured`, `active`)
- `GET /api/products/:id` — producto individual
- `GET /api/products/category/:category` — productos por categoría
- `POST /api/auth/*` — registro, login, perfil
- `POST /api/cart/*` — operaciones del carrito
- `POST /api/orders/*` — creación de pedidos e historial
- `POST /api/payments/*` — payment intents de Stripe

## Estructura del Proyecto

```
├── backend/                 # API Express + Sequelize
│   └── src/
│       ├── config/          # Configuración de base de datos
│       ├── controllers/     # Manejadores de rutas
│       ├── models/          # Modelos Sequelize + datos semilla
│       ├── routes/          # Rutas de la API
│       └── server.js        # Punto de entrada
├── frontend/                # SPA de React (Vite)
│   ├── e2e/                 # Tests E2E de Playwright
│   └── src/
│       ├── components/      # Componentes de UI
│       ├── context/         # Estado global (auth, carrito, i18n, dark mode)
│       ├── pages/           # Páginas por ruta
│       ├── services/        # Clientes de la API
│       └── locales/         # Traducciones ES/EN
├── .github/workflows/       # CI con GitHub Actions
└── docker-compose.yml       # Stack local (frontend + backend + DB)
```

## Guía de instalación

### Docker (un solo comando)

```bash
git clone https://github.com/AlexandroCamacho1000/FoodAppByAle.git
cd FoodAppByAle
docker compose up -d
```

App en `http://localhost` · API en `http://localhost:5000/api`

### Backend

```bash
cd backend
npm install
cp .env.example .env   # editar credenciales
npm run dev            # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Tests

```bash
# Frontend — tests unitarios (43)
cd frontend && npm test

# Frontend — tests E2E (3, Playwright)
cd frontend && npm run test:e2e

# Backend — tests de integración (3, requiere PostgreSQL)
cd backend && npm test
```

Todos los tests se ejecutan automáticamente en CI con cada push a `main`.

## Despliegue

- **Frontend:** Vercel — SPA rewrites para routing client-side
- **Backend:** Railway — PostgreSQL gestionado, configuración por variables de entorno
- **CI/CD:** GitHub Actions con 3 jobs (unitarios frontend, E2E, integración backend)

## Autor

[Alejandro Camacho](https://github.com/AlexandroCamacho1000)

Licenciado bajo la [Licencia MIT](./LICENSE).
