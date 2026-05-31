# 🚂 Deploy en Railway — Solución al error "Railpack process exited"

## Causa del error

Railway usa **Railpack** por defecto. En monorepos con varios `package.json` y configs
(`nixpacks.toml`, `railway.json`) el build suele fallar.

**Solución:** usar **Dockerfile** (incluido en este proyecto).

---

## Configuración en Railway (paso a paso)

### 1. Root Directory

**Settings → Source → Root Directory:**

```
backend
```

### 2. Builder

Railway detectará automáticamente el `Dockerfile` en `/backend`.

Si no lo detecta:
**Settings → Build → Builder:** selecciona **Dockerfile**

### 3. Variables de entorno (OBLIGATORIAS)

| Variable | Valor |
|----------|-------|
| `MONGO_URI` | URI de MongoDB Atlas |
| `JWT_SECRET` | Clave secreta larga |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://proyecto-fullstack-pied.vercel.app` |

> Railway asigna `PORT` automáticamente — no lo hardcodees.

### 4. Networking

**Settings → Networking → Generate Domain**

Copia la URL, ej: `https://xxxx.up.railway.app`

### 5. Verificar

Abre en el navegador:

```
https://TU-URL.up.railway.app/api/health
```

Debe responder:

```json
{"success":true,"message":"Backend funcionando"}
```

### 6. Vercel

```
VITE_API_URL=https://TU-URL.up.railway.app/api
```

Redeploy en Vercel.

---

## Si el deploy sigue fallando

1. **Deployments → View Logs** — busca la línea exacta del error
2. Confirma **Root Directory = `backend`**
3. Elimina Build Command custom (déjalo vacío — Docker lo maneja)
4. Elimina Start Command custom (Dockerfile ya tiene `CMD`)

---

## Subir cambios

```bash
git add backend/
git commit -m "fix: Dockerfile para Railway deploy"
git push origin main
```

Railway redeployará automáticamente.
