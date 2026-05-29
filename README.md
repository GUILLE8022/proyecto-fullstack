# 🏍️ MotoStore — Monorepo Full Stack

Plataforma de compra y venta de motocicletas con autenticación JWT, roles (USER/ADMIN), marketplace, gestión de publicaciones con ownership y historial de ventas inmutable.

## 📁 Estructura del monorepo

```
proyecto-fulstack/
├── backend/          # API REST (Node.js + Express + MongoDB)
├── frontend/         # SPA React + Vite
├── README.md         # Este archivo
├── backend/README.md
└── frontend/README.md
```

## 🚀 Tecnologías

| Capa | Stack |
|------|-------|
| Frontend | React 19, Vite, React Router, Zustand, Axios, react-hot-toast |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs, express-validator |
| Base de datos | MongoDB |

## 🏗️ Arquitectura

```mermaid
flowchart LR
  subgraph Cliente
    Landing[Landing pública]
    App[App autenticada]
  end
  subgraph API
    Auth[/api/auth]
    Motos[/api/motos]
    Ventas[/api/ventas]
  end
  DB[(MongoDB)]
  Landing --> Auth
  App --> Auth
  App --> Motos
  App --> Ventas
  Auth --> DB
  Motos --> DB
  Ventas --> DB
```

## 🔐 Roles y permisos

| Acción | USER | ADMIN |
|--------|------|-------|
| Ver landing sin login | ✅ | ✅ |
| CRUD sus propias motos | ✅ | ✅ |
| Editar motos ajenas | ❌ | ✅ |
| Marketplace (comprar) | ✅ | ✅ |
| Ver historial propio | ✅ | ✅ |
| Ver todas las ventas | ❌ | ✅ |
| Moderar / eliminar motos | ❌ | ✅ |
| Gestionar usuarios | ❌ | ✅ |

## ⚙️ Variables de entorno

### Backend (`backend/.env`)

```env
MONGO_URI=mongodb://localhost:27017/motostore
JWT_SECRET=tu_secreto_seguro
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

## 🛠️ Instalación local

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend (otra terminal)
cd frontend
cp .env.example .env
npm install
npm run dev
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## 📡 Endpoints (resumen)

Documentación completa en tablas: [backend/README.md](./backend/README.md)

## 🌐 Deploy

### Backend (Render / Railway)

1. Conectar repositorio
2. Root: `backend`
3. Start: `npm start`
4. Variables: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL` (URL de Vercel/Netlify)

### Frontend (Vercel / Netlify)

1. Root: `frontend`
2. Build: `npm run build`
3. Output: `dist`
4. Variable: `VITE_API_URL=https://tu-api.com/api`
5. SPA: incluido `vercel.json` y `public/_redirects`

## 📄 Licencia

MIT — ver archivos del repositorio.

## 📞 Contacto

**Miguel Beltran** — [GitHub](https://github.com/Beltran18)
