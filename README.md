# 🏍️ MotoStore — Monorepo Full Stack

Plataforma de compra y venta de motocicletas con landing pública, autenticación JWT, roles (USER/ADMIN), marketplace, subida de imágenes, historial de ventas inmutable y seed desde CSV.

## 📁 Estructura del monorepo

```
proyecto-fulstack/
├── backend/                 # API REST (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/          # CORS, upload (multer)
│   │   ├── controllers/
│   │   ├── data/            # usuarios.csv, motos.csv
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── utils/
│   │   └── validators/
│   ├── uploads/motos/       # Imágenes subidas por usuarios
│   └── server.js
├── frontend/                # SPA React + Vite
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── styles/
│   │   └── utils/
│   ├── vercel.json          # Rewrites SPA (Vercel)
│   └── public/_redirects    # Rewrites SPA (Netlify)
├── README.md
├── backend/README.md
└── frontend/README.md
```

## 🚀 Tecnologías

| Capa | Stack |
|------|-------|
| Frontend | React 19, Vite, React Router, Zustand, Axios, react-hot-toast |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs, multer, csv-parser |
| Base de datos | MongoDB (local o Atlas) |

## ✨ Funcionalidades principales

- **Landing pública** antes del login
- **Marketplace** — comprar motos de otros usuarios
- **Mis motos** — CRUD con ownership (solo tus publicaciones)
- **Imágenes** — subir foto o pegar URL
- **En venta** — publicar/retirar del marketplace
- **Marcar como vendida** — registrar venta directa en historial
- **Historial inmutable** — compras y ventas sin editar/eliminar
- **Panel admin** — moderar motos, usuarios y ventas globales
- **Seed CSV** — importar usuarios y motos masivamente

## 🔐 Roles y permisos

| Acción | USER | ADMIN |
|--------|------|-------|
| Ver landing sin login | ✅ | ✅ |
| Subir imágenes de motos | ✅ | ✅ |
| CRUD sus propias motos | ✅ | ✅ |
| Poner en venta / marcar vendida | ✅ | ✅ |
| Comprar en marketplace | ✅ | ✅ |
| Ver historial propio | ✅ | ✅ |
| Ver todas las ventas | ❌ | ✅ |
| Moderar motos / usuarios | ❌ | ✅ |

## ⚙️ Variables de entorno

### Backend (`backend/.env`)

```env
MONGO_URI=mongodb://localhost:27017/motostore
JWT_SECRET=tu_secreto_seguro_largo
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

> **Importante:** `VITE_API_URL` debe terminar en `/api`.

---

## 🛠️ Instalación local (paso a paso)

### 1. Clonar e instalar

```bash
# Backend
cd backend
cp .env.example .env
# Editar .env con tu MONGO_URI y JWT_SECRET
npm install

# Frontend (otra terminal)
cd frontend
cp .env.example .env
npm install
```

### 2. Importar datos de prueba (opcional)

```bash
cd backend

# Opción A — RESETEAR todo e importar desde CSV
npm run seed

# Opción B — AGREGAR solo lo nuevo (no borra datos existentes)
npm run seed:incremental
```

**Credenciales creadas por el seed:**

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@motostore.com` | `admin123` |
| User | `juanp@gmail.com` | `juan321` |

### 3. Iniciar servidores

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → http://localhost:3000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → http://localhost:5173
```

### 4. Verificar

- Abre `http://localhost:5173` → Landing
- Health check API: `http://localhost:3000/api/health`

---

## 📦 Seed — importar datos desde CSV

Los archivos están en `backend/src/data/`:

| Archivo | Columnas |
|---------|----------|
| `usuarios.csv` | `nombre`, `email`, `password` |
| `motos.csv` | `marca`, `modelo`, `precio`, `cilindraje`, `stock`, `imagen`, `segmento` |

**Columnas opcionales en `motos.csv`:**

| Columna | Descripción |
|---------|-------------|
| `email_propietario` | Asigna la moto a un usuario por email |
| `en_venta` | `true` / `false` — si aparece en marketplace |
| `descripcion` | Texto descriptivo |

### Comandos

| Comando | Qué hace |
|---------|----------|
| `npm run seed` | **Borra todo** e importa usuarios + motos + 5 ventas ejemplo |
| `npm run seed:incremental` | **Solo agrega** usuarios/motos nuevos (no borra) |
| `npm run seed:full` | Igual que `npm run seed` |

### Ejemplo — agregar datos sin perder los actuales

1. Edita `backend/src/data/usuarios.csv` o `motos.csv`
2. Ejecuta:

```bash
cd backend
npm run seed:incremental
```

---

## 🌐 Despliegue en producción (paso a paso)

### Recomendación de plataformas

| Componente | Plataforma recomendada | Alternativa |
|------------|------------------------|-------------|
| Base de datos | **MongoDB Atlas** (gratis) | — |
| Backend | **Render** (gratis) | Railway, Fly.io |
| Frontend | **Vercel** (gratis) | Netlify |

---

### Paso 1 — MongoDB Atlas

1. Crea cuenta en [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Crea un cluster gratuito (M0)
3. Database Access → crea usuario y contraseña
4. Network Access → agrega `0.0.0.0/0` (acceso desde cualquier IP)
5. Connect → copia la URI:

```
mongodb+srv://usuario:password@cluster.xxxxx.mongodb.net/motostore?retryWrites=true&w=majority
```

---

### Paso 2 — Backend en Render

1. Sube el repo a **GitHub**
2. Entra a [render.com](https://render.com) → **New Web Service**
3. Conecta tu repositorio
4. Configuración:

| Campo | Valor |
|-------|-------|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |

5. Variables de entorno:

| Variable | Valor |
|----------|-------|
| `MONGO_URI` | Tu URI de Atlas |
| `JWT_SECRET` | Una clave larga y aleatoria |
| `FRONTEND_URL` | `https://tu-app.vercel.app` (la pondrás después) |
| `NODE_ENV` | `production` |

6. Deploy → copia la URL del backend, ej: `https://motostore-api.onrender.com`

7. Verifica: `https://motostore-api.onrender.com/api/health`

> **Nota:** En plan gratuito de Render el servidor puede dormir; la primera petición tarda ~30 s.

8. *(Opcional)* Importar datos en producción:

```bash
# Localmente, apuntando MONGO_URI a Atlas
cd backend
npm run seed:incremental
```

---

### Paso 3 — Frontend en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Add New Project**
2. Importa el mismo repositorio de GitHub
3. Configuración:

| Campo | Valor |
|-------|-------|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. Variable de entorno:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://motostore-api.onrender.com/api` |

5. Deploy → obtienes `https://tu-app.vercel.app`

6. Vuelve a **Render** y actualiza `FRONTEND_URL` con la URL de Vercel → **Redeploy**

---

### Paso 4 — Frontend en Netlify (alternativa)

1. [netlify.com](https://netlify.com) → Add new site → Import from Git
2. Configuración:

| Campo | Valor |
|-------|-------|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `frontend/dist` |

3. Env: `VITE_API_URL=https://tu-api.onrender.com/api`
4. El archivo `public/_redirects` ya maneja el SPA (sin 404 al recargar)

---

### Paso 5 — Checklist post-deploy

- [ ] `GET /api/health` responde `{ success: true }`
- [ ] Login funciona desde la URL de producción
- [ ] Marketplace carga motos
- [ ] Subir imagen funciona (Render persiste archivos en disco; si reinicias el servicio pueden perderse — para producción real usa Cloudinary/S3)
- [ ] Recargar `/dashboard` o `/marketplace` no da 404

---

## 📡 API

Documentación completa con tablas de endpoints: [backend/README.md](./backend/README.md)

## 📄 Licencia

MIT

## 📞 Contacto

**Miguel Beltran** — [GitHub](https://github.com/Beltran18)
