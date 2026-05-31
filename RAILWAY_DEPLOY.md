# 🚂 Railway — Guía definitiva (sin error Railpack)

## ⚠️ Por qué fallaba

Railway usaba **Railpack** (detecta Node automático) y fallaba en monorepos.
**Solución:** `Dockerfile` en la raíz del repo + `railway.toml` con `builder = DOCKERFILE`.

---

## Paso 1 — Crear servicio en Railway

1. [railway.app](https://railway.app) → **New Project**
2. **Deploy from GitHub repo** → `GUILLE8022/proyecto-fullstack`
3. Si ya tienes un servicio fallido: **Settings → Danger → Delete Service** y crea uno nuevo (más limpio)

---

## Paso 2 — Configuración del servicio

### Settings → Source

| Campo | Valor |
|-------|-------|
| **Root Directory** | **VACÍO** (borra `backend` si lo pusiste) |
| **Branch** | `main` |

### Settings → Build

| Campo | Valor |
|-------|-------|
| **Builder** | **Dockerfile** |
| **Dockerfile Path** | `Dockerfile` |
| **Build Command** | **VACÍO** |
| **Watch Paths** | vacío |

### Settings → Deploy

| Campo | Valor |
|-------|-------|
| **Start Command** | **VACÍO** (Dockerfile ya lo define) |
| **Healthcheck Path** | `/api/health` |

---

## Paso 3 — Variables de entorno (OBLIGATORIO)

**Variables** → **Raw Editor** → pega esto (cambia los valores):

```env
MONGO_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/motostore?retryWrites=true&w=majority
JWT_SECRET=UnaClaveSecretaLargaYSegura2026
NODE_ENV=production
FRONTEND_URL=https://proyecto-fullstack-pied.vercel.app
```

> Copia `MONGO_URI` y `JWT_SECRET` de tu `backend/.env` local.

---

## Paso 4 — Dominio público

**Settings → Networking → Generate Domain**

Copia la URL, ejemplo:
```
https://proyecto-fullstack-production-xxxx.up.railway.app
```

---

## Paso 5 — Deploy

**Deployments → Redeploy**

En los logs debes ver:
```
Building Dockerfile...
FROM node:20-alpine
...
Successfully built
Deploy complete
```

**NO debe decir "Railpack"** — si dice Railpack, el Builder no está en Dockerfile.

---

## Paso 6 — Verificar

Abre en el navegador:
```
https://TU-URL.up.railway.app/api/health
```

Respuesta correcta:
```json
{"success":true,"message":"Backend funcionando","data":{"status":"ok"}}
```

---

## Paso 7 — Vercel

Variable de entorno:
```
VITE_API_URL=https://TU-URL.up.railway.app/api
```

Redeploy en Vercel.

---

## Si sigue fallando

| Síntoma | Solución |
|---------|----------|
| Logs dicen "Railpack" | Builder debe ser **Dockerfile**, no Railpack/Nixpacks |
| `MONGO_URI` en logs | Agrega variables en Railway |
| `Application not found` | Genera dominio nuevo en Networking |
| Build timeout | Reintenta Redeploy |

---

## Seed de datos

```powershell
cd backend
npm run seed
```

(con `MONGO_URI` de Atlas en tu `.env` local)

| Admin | admin@motostore.com / admin123 |
| User | juanp@gmail.com / juan321 |
