# 🥟 Bolivian Market — E-commerce de Comida Boliviana

[![CI](https://github.com/tu-usuario/bolivian-market/actions/workflows/test.yml/badge.svg)](https://github.com/tu-usuario/bolivian-market/actions/workflows/test.yml)
[![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker)](https://www.docker.com)
![React](https://img.shields.io/badge/React_19-20232A?logo=react)
![Express](https://img.shields.io/badge/Express-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql)

Aplicación web full-stack tipo SaaS para un e-commerce de comida tradicional boliviana. Bilingüe (ES/EN), modo oscuro, panel administrador, pagos con Stripe y autenticación JWT.

---

## 🚀 Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router 7 |
| **Backend** | Node.js, Express, Sequelize ORM |
| **Base de datos** | PostgreSQL 16 |
| **Autenticación** | JWT + bcryptjs |
| **Pagos** | Stripe |
| **Testing** | Vitest, Testing Library, Supertest |
| **Contenedores** | Docker + docker-compose |
| **CI/CD** | GitHub Actions |

## ✨ Features

- Catálogo de productos con categorías, filtros y búsqueda
- Carrito de compras con persistencia (localStorage + API)
- Stripe Checkout / QR / Pago contra entrega
- Panel administrador (productos, pedidos, clientes, dashboard, códigos de invitación)
- Roles: superadmin, admin, cliente
- Bilingüe ES/EN con detección automática del navegador
- Modo oscuro con persistencia
- Diseño responsive
- 46 tests automatizados

## 🐳 Docker (recomendado)

```bash
docker compose up -d
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost |
| Backend  | http://localhost:5000/api |
| Base de datos | PostgreSQL en `localhost:5432` |

## 💻 Desarrollo local

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # editar credenciales
npm run dev            # http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## 🧪 Tests

```bash
# Frontend (43 tests)
cd frontend && npm test

# Backend (3 tests, requiere PostgreSQL)
cd backend && npm test
```

## 📁 Estructura

```
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── context/        # Auth, Cart, DarkMode, Language
│   │   ├── services/       # API services
│   │   ├── locales/        # ES/EN traducciones
│   │   └── __tests__/      # 10 archivos, 43 tests
│   └── Dockerfile
├── backend/           # Express + Sequelize
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── __tests__/      # 1 archivo (health), 3 tests
│   └── Dockerfile
├── database/          # Schema SQL
├── .github/workflows/ # CI/CD pipeline
└── docker-compose.yml
```
