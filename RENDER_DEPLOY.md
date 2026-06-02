# Render — Deploy del backend (MotoStore)

Frontend en **Vercel** + Backend en **Render** + MongoDB **Atlas**.

---

## ¿Se necesita CORS con Render?

**Sí.** CORS no depende de Railway ni Render — depende de que el **frontend y el backend estén en dominios distintos**.

| Componente | Dónde vive | Ejemplo de URL |
|------------|------------|----------------|
| Frontend | Vercel | `https://proyecto-fullstack-pied.vercel.app` |
| Backend | Render | `https://motostore-api.onrender.com` |

El navegador trata eso como **dos sitios diferentes**. Por seguridad, bloquea peticiones entre dominios a menos que el backend diga explícitamente: *"permito peticiones desde Vercel"*.

Eso es lo que hace `backend/src/config/cors.js`:
- Responde al preflight (`OPTIONS`) del navegador
- Envía el header `Access-Control-Allow-Origin`
- Ya acepta `*.vercel.app` automáticamente

**Render no configura CORS por ti.** Tu código Express ya lo tiene listo; solo asegúrate de que el backend esté corriendo y que `FRONTEND_URL` apunte a Vercel.

> **Postman/curl no usa CORS** — solo el navegador. Por eso a veces la API “funciona” en Postman pero falla en la web.

---

## Paso 1 — Subir código a GitHub

```powershell
cd "C:\Users\migue\OneDrive - Secretaría de Educación de Envigado\Escritorio\proyecto-fulstack"
git add .
git commit -m "feat: config Render para deploy del backend"
git push origin main
```

---

## Paso 2 — MongoDB Atlas (acceso desde Render)

1. [cloud.mongodb.com](https://cloud.mongodb.com) → tu cluster
2. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
3. Copia tu **Connection String** (`MONGO_URI`)

---

## Paso 3 — Crear servicio en Render

1. [render.com](https://render.com) → **Sign Up** (con GitHub)
2. **New +** → **Web Service**
3. Conecta el repo: `GUILLE8022/proyecto-fullstack`
4. Configura:

| Campo | Valor |
|-------|-------|
| **Name** | `motostore-api` (o el que quieras) |
| **Region** | Oregon (US West) o el más cercano |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free (para pruebas) |

---

## Paso 4 — Variables de entorno

En **Environment** → **Add Environment Variable**:

| Variable | Valor |
|----------|-------|
| `MONGO_URI` | Tu URI de Atlas (copia de `backend/.env`) |
| `JWT_SECRET` | Tu clave secreta (copia de `backend/.env`) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://proyecto-fullstack-pied.vercel.app` |

> Render asigna `PORT` automáticamente — no lo configures.

---

## Paso 5 — Deploy

Clic en **Create Web Service**. Render hará build y deploy.

En **Logs** deberías ver:
```
npm install
...
🚀 Servidor en puerto ...
✅ MongoDB conectado
```

Tu URL será algo como:
```
https://motostore-api.onrender.com
```

---

## Paso 6 — Verificar backend

Abre en el navegador:
```
https://TU-SERVICIO.onrender.com/api/health
```

Respuesta correcta:
```json
{"success":true,"message":"Backend funcionando","data":{"status":"ok"}}
```

Prueba CORS (opcional, en consola del navegador en tu sitio Vercel):
```javascript
fetch('https://TU-SERVICIO.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

---

## Paso 7 — Actualizar Vercel

**Vercel → tu proyecto → Settings → Environment Variables**

```
VITE_API_URL=https://TU-SERVICIO.onrender.com/api
```

Importante: debe terminar en **`/api`**.

**Deployments → Redeploy** el frontend.

---

## Paso 8 — Seed de datos (opcional)

Desde tu PC, con el mismo `MONGO_URI` de Atlas:

```powershell
cd backend
npm run seed
```

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@motostore.com | admin123 |
| User | juanp@gmail.com | juan321 |

---

## Plan Free de Render

- El servicio **se duerme** tras ~15 min sin tráfico
- La **primera petición** puede tardar 30–60 s (cold start)
- Las **imágenes subidas** se pierden al reiniciar (disco efímero) — en producción real usarías S3/Cloudinary

---

## Si algo falla

| Síntoma | Solución |
|---------|----------|
| Build failed | Root Directory = `backend` |
| `Faltan variables de entorno` | Agrega `MONGO_URI` y `JWT_SECRET` |
| Error MongoDB | Atlas → Network Access → `0.0.0.0/0` |
| CORS en Vercel | Primero verifica `/api/health`; si responde OK, redeploy Vercel con `VITE_API_URL` correcta |
| 502 / timeout | Plan free: espera el cold start o haz ping a `/api/health` |

---

## Alternativa: Blueprint

Render → **New +** → **Blueprint** → selecciona el repo.

Render leerá `render.yaml` de la raíz. Luego agrega `MONGO_URI` y `JWT_SECRET` manualmente en el dashboard.
