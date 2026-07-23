<p align="center">
  <img width="200" alt="logoaledev" src="./frontend/public/logoaledev26.png" />
</p>

<p align="center">
  <a href="https://food-app-by-ale.vercel.app">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-🌐_food--app--by--ale.vercel.app-00C853?style=for-the-badge" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/AlexandroCamacho1000/FoodAppByAle/actions/workflows/test.yml">
    <img src="https://img.shields.io/badge/CI-✅_passing-4CAF50?style=for-the-badge&logo=githubactions&logoColor=white" alt="CI" />
  </a>
  <img src="https://img.shields.io/badge/46_tests-✅-4CAF50?style=for-the-badge" alt="Tests" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Playwright-E2E-45ba4b?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Node-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white" alt="Sequelize" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway" />
</p>

---

# FoodApp — Bolivian Market

<p align="center">
  <img src="./frontend/public/screenshot.png" alt="FoodApp screenshot" width="90%" />
</p>

## 1. Overview
Aplicación web full-stack tipo SaaS para e-commerce de comida tradicional boliviana. Bilingüe (ES/EN), modo oscuro, panel administrador, pagos con Stripe y autenticación JWT. Incluye 46 tests automatizados con CI/CD vía GitHub Actions, containerización con Docker, y deploy en producción en Vercel + Railway.

🔗 **Live Demo:** [food-app-by-ale.vercel.app](https://food-app-by-ale.vercel.app)  
⚙️ **Backend API:** [foodappbyale-production.up.railway.app/api](https://foodappbyale-production.up.railway.app/api/health)  
🤖 **CI/CD:** [github.com/AlexandroCamacho1000/FoodAppByAle/actions](https://github.com/AlexandroCamacho1000/FoodAppByAle/actions)

## 2. Technologies Used
**Frontend:** React 19, JavaScript (ES6+), Vite, Tailwind CSS 4, React Router 7, Axios  
**Backend:** Node.js, Express.js, PostgreSQL 16, Sequelize, JWT, bcryptjs, Stripe  
**Testing:** Vitest, Testing Library, Supertest, Playwright  
**DevOps:** Docker & docker-compose, GitHub Actions (CI/CD), Vercel, Railway  
**Tools:** Git & GitHub, Visual Studio Code, npm

## 3. Installation Guide (Run Locally)

**Docker (recomendado — un solo comando):**
```bash
git clone https://github.com/AlexandroCamacho1000/FoodAppByAle.git
cd FoodAppByAle
docker compose up -d
```
App en `http://localhost` · API en `http://localhost:5000/api`

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env    # editar credenciales
npm run dev             # http://localhost:5000
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

**Tests:**
```bash
# Frontend (43 tests)
cd frontend && npm test

# Backend (3 tests, requiere PostgreSQL corriendo)
cd backend && npm test

# Todos los tests en CI (GitHub Actions)
# Se ejecutan automáticamente en cada push a main
```

---

<p align="center">
  <b>Desarrollado por</b><br />
  <a href="https://github.com/AlexandroCamacho1000">Alejandro Camacho</a>
</p>
