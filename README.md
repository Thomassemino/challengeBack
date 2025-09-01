# 🛠️ Backend - Notes Challenge

Este es el **backend** de la aplicación de notas desarrollada con **Nest.js + TypeORM + PostgreSQL**.  
Se encarga de exponer la API REST para la gestión de usuarios, notas y categorías.

---

## 🚀 Tecnologías principales
- **Node.js** + **Nest.js** (framework backend)
- **TypeORM** (ORM para PostgreSQL)
- **PostgreSQL** (base de datos relacional)
- **Docker / Docker Compose** (para levantar la base de datos en local)
- **Swagger** (documentación de la API)

---

## 📦 Requisitos previos
1. **Node.js** (v18+)
2. **npm** (v9+)
3. **Docker Desktop** o Docker CLI
   - Si usás Docker Desktop en Windows/Mac, **asegurate de abrir la app** antes de correr los comandos.
   - Si usás Linux con Docker CLI, asegurate de tener el servicio `docker` corriendo.

---

## ⚙️ Inicialización en local

1. Clonar el repositorio y entrar en la carpeta backend:
   ``` 
   cd backend
Copiar variables de entorno:
 cp .env.example .env

Levantar la base de datos con Docker:
 docker compose up -d

Esto va a crear un contenedor con PostgreSQL.

Podés ver los contenedores activos con: 
 docker ps

Podés ver los logs en tiempo real con: 
 docker logs -f notes_challenge_db

Instalar dependencias: 
 npm install

Compilar y correr migraciones:
npm run build
npm run migration:run

Iniciar el servidor:
npm run start:dev

📜 Endpoints principales
Swagger UI disponible en:
👉 http://localhost:3000/api/docs

Link de la API: 👉 http://localhost:3000/api