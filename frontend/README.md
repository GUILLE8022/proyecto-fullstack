# Frontend — MotoStore

SPA React con landing pública, rutas protegidas, marketplace y panel de administración.

## Tecnologías

- React 19 + Vite
- React Router DOM 7
- Zustand (persistencia de sesión)
- Axios (interceptors)
- react-hot-toast
- CSS modular por sección

## Estructura

```
frontend/src/
├── api/              # client.js + endpoints.js
├── components/       # Navbar, ProtectedRoute, ConfirmModal, etc.
├── layouts/          # MainLayout
├── pages/            # Landing, Login, Dashboard, etc.
├── routes/           # AppRoutes.jsx
├── store/            # authStore (Zustand)
├── styles/           # CSS por módulo
└── utils/            # apiHelpers
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base de la API (incluye `/api`) |

Ejemplo local: `http://localhost:3000/api`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo en :5173 |
| `npm run build` | Build producción → `dist/` |
| `npm run preview` | Preview del build |

## Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Landing (redirige si hay sesión) |
| `/login` | Invitado | Inicio de sesión |
| `/register` | Invitado | Registro |
| `/dashboard` | Auth | Resumen y accesos rápidos |
| `/marketplace` | Auth | Catálogo para comprar |
| `/mis-motos` | Auth | CRUD de motos propias |
| `/editar-moto/:id` | Auth | Edición con carga de datos |
| `/ventas` | Auth | Historial inmutable |
| `/admin` | Admin | Moderación global |
| `*` | Público | 404 personalizado |

## UX implementada

- Toasts de éxito/error (sin `alert()` ni `confirm()`)
- Modal de confirmación para compras y eliminaciones
- Skeleton loaders y empty states
- Validación inline en formularios
- Estados loading/disabled en botones

## Deploy

### Vercel

1. Framework: Vite
2. Root: `frontend`
3. Build: `npm run build`
4. Output: `dist`
5. Env: `VITE_API_URL`
6. `vercel.json` incluido para rewrites SPA

### Netlify

- Build command: `npm run build`
- Publish: `dist`
- `public/_redirects` incluido para SPA

## Flujo de usuario

1. Visita landing sin obligación de login
2. Se registra con contexto y beneficios explicados
3. Tras login → dashboard
4. Publica en Mis Motos → aparece en marketplace de otros
5. Compra en marketplace → historial actualizado automáticamente
