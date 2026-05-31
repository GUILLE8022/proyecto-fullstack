# Railway — Deploy sin Docker

## Configuración en Railway (importante)

### 1. Root Directory

**Settings → Source → Root Directory:**

```
backend
```

Sin esto Railway ve el monorepo (`frontend/` + `backend/`) y falla el build.

### 2. Builder

**Settings → Build → Builder:** **Nixpacks** (o Railpack — detección automática)

- **Build Command:** vacío
- **Start Command:** vacío (usa `npm start` del `package.json`)

### 3. Variables de entorno (obligatorio)

**Variables → Raw Editor:**

```env
MONGO_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster.mongodb.net/motostore?retryWrites=true&w=majority
JWT_SECRET=UnaClaveSecretaLargaYSegura2026
NODE_ENV=production
FRONTEND_URL=https://proyecto-fullstack-pied.vercel.app
```

Copia `MONGO_URI` y `JWT_SECRET` de tu `backend/.env` local.

### 4. Dominio

**Settings → Networking → Generate Domain**

### 5. Verificar

```
https://TU-URL.up.railway.app/api/health
```

Respuesta esperada:

```json
{"success":true,"message":"Backend funcionando","data":{"status":"ok"}}
```

### 6. Vercel

```
VITE_API_URL=https://TU-URL.up.railway.app/api
```

Redeploy en Vercel.

---

## Si falla el build

| Problema | Solución |
|----------|----------|
| Railpack / Nixpacks error | Root Directory = `backend` |
| Faltan variables | Agrega `MONGO_URI` y `JWT_SECRET` |
| `Application not found` | Genera dominio en Networking |
| Build Command custom | Bórralo, déjalo vacío |
