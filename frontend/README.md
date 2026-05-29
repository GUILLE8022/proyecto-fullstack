# Frontend — MotoStore

SPA React con landing pública, marketplace, subida de imágenes, gestión de ventas e historial inmutable.

## Tecnologías

- React 19 + Vite
- React Router DOM 7
- Zustand (persistencia de sesión)
- Axios (interceptors + normalización `/api`)
- react-hot-toast
- CSS modular por sección

## Estructura

```
frontend/src/
├── api/              # client.js, endpoints.js
├── components/       # Navbar, ImageUpload, ConfirmModal, etc.
├── layouts/          # MainLayout
├── pages/            # Landing, Login, Dashboard, MisMotos, etc.
├── routes/           # AppRoutes.jsx
├── store/            # authStore (Zustand)
├── styles/
└── utils/            # apiHelpers, imageUrl
```

## Variables de entorno

| Variable | Descripción | Ejemplo local | Ejemplo producción |
|----------|-------------|---------------|-------------------|
| `VITE_API_URL` | URL base API (**con `/api`**) | `http://localhost:3000/api` | `https://tu-api.onrender.com/api` |

Copia el ejemplo:

```bash
cp .env.example .env
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo en `http://localhost:5173` |
| `npm run build` | Build producción → `dist/` |
| `npm run preview` | Preview del build local |

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Landing |
| `/login` | Invitado | Inicio de sesión |
| `/register` | Invitado | Registro |
| `/dashboard` | Auth | Resumen y accesos rápidos |
| `/marketplace` | Auth | Comprar motos de otros |
| `/mis-motos` | Auth | CRUD, imágenes, en venta, marcar vendida |
| `/editar-moto/:id` | Auth | Editar con foto |
| `/ventas` | Auth | Historial compras/ventas |
| `/admin` | Admin | Moderación global |
| `*` | Público | 404 personalizado |

## Funcionalidades UX

- Landing pública sin obligar login
- Subir imagen o pegar URL
- Toggle **Poner en venta** / **Quitar de venta**
- **Marcar como vendida** con modal (email/nombre comprador opcional)
- Toasts (sin `alert()` / `confirm()`)
- Modales de confirmación
- Skeleton loaders y empty states
- Validación inline en formularios

## Imágenes

- **Subir archivo:** componente `ImageUpload` → `POST /api/upload/imagen`
- **URL externa:** pegar en el formulario
- **Imágenes locales del backend:** se resuelven con `resolveImageUrl()` → `http://api/uploads/motos/...`

En desarrollo, Vite hace proxy de `/api` y `/uploads` hacia `localhost:3000`.

---

## Deploy en Vercel (recomendado)

### Paso a paso

1. Sube el proyecto a **GitHub**
2. [vercel.com](https://vercel.com) → **Add New Project**
3. Importa el repositorio
4. Configuración:

| Campo | Valor |
|-------|-------|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

5. Environment Variables:

```
VITE_API_URL=https://TU-BACKEND.onrender.com/api
```

6. Deploy

7. Actualiza `FRONTEND_URL` en el backend con la URL de Vercel

### SPA — sin 404 al recargar

Ya incluido `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Deploy en Netlify (alternativa)

| Campo | Valor |
|-------|-------|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Env | `VITE_API_URL=https://TU-BACKEND.onrender.com/api` |

El archivo `public/_redirects` maneja el SPA:

```
/*    /index.html   200
```

---

## Flujo de usuario

1. Visita landing → explora sin login
2. Se registra o inicia sesión
3. **Mis motos** → agrega moto con foto → marca **en venta**
4. Otro usuario compra en **marketplace** → venta en historial
5. O el vendedor usa **Marcar como vendida** → venta directa registrada
6. **Historial** muestra compras, ventas y balance

## Credenciales de prueba (después del seed)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@motostore.com` | `admin123` |
| User | `juanp@gmail.com` | `juan321` |
