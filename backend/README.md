# Backend — MotoStore API

API REST para autenticación, gestión de motos y historial de ventas inmutable.

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- express-validator
- CORS configurable

## Estructura

```
backend/
├── server.js
├── src/
│   ├── config/         # CORS, etc.
│   ├── controllers/
│   ├── middlewares/    # auth, roles, ownership, errors
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── validators/
└── .env.example
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGO_URI` | Conexión MongoDB | `mongodb://localhost:27017/motostore` |
| `JWT_SECRET` | Secreto para firmar tokens | `mi_secreto_seguro` |
| `PORT` | Puerto del servidor | `3000` |
| `FRONTEND_URL` | Origen permitido CORS | `https://mi-app.vercel.app` |
| `NODE_ENV` | Entorno | `production` |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor |
| `npm start` | Producción |
| `npm run seed` | Importa `usuarios.csv` + `motos.csv` desde `src/data/` |

## Formato de respuesta

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {}
}
```

Errores:

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

## Autenticación

- Header: `Authorization: Bearer <token>`
- Token generado en login (7 días)
- Payload: `{ id, email, role }`

## Endpoints — Autenticación

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| POST | `/api/auth/register` | No | — | Registrar usuario |
| POST | `/api/auth/login` | No | — | Iniciar sesión |
| GET | `/api/auth/profile` | Sí | user/admin | Perfil actual |
| GET | `/api/auth/usuarios` | Sí | admin | Listar usuarios |
| PATCH | `/api/auth/usuarios/:id/toggle` | Sí | admin | Activar/desactivar usuario |

## Endpoints — Motos

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| GET | `/api/motos/marketplace/listado` | Sí | user | Motos disponibles de otros |
| GET | `/api/motos/mis-motos/listado` | Sí | user | Motos del usuario |
| GET | `/api/motos/:id` | No | — | Detalle de moto |
| POST | `/api/motos` | Sí | user | Crear moto |
| PUT | `/api/motos/:id` | Sí | owner/admin | Actualizar moto |
| PATCH | `/api/motos/:id/en-venta` | Sí | owner | Alternar “en venta” |
| POST | `/api/motos/:id/marcar-vendida` | Sí | owner | Registrar venta directa |
| DELETE | `/api/motos/:id` | Sí | owner/admin | Eliminar moto |
| POST | `/api/upload/imagen` | Sí | user | Subir foto (multipart) |
| GET | `/api/motos/admin/todas` | Sí | admin | Todas las motos |
| DELETE | `/api/motos/admin/:id` | Sí | admin | Moderar publicación |

## Endpoints — Ventas (inmutables)

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| POST | `/api/ventas` | Sí | user | Registrar compra |
| GET | `/api/ventas/historial/completo` | Sí | user | Compras + ventas + totales |
| GET | `/api/ventas/mis-compras/listado` | Sí | user | Solo compras |
| GET | `/api/ventas/mis-ventas/listado` | Sí | user | Solo ventas |
| GET | `/api/ventas/estadisticas/usuario` | Sí | user | Métricas dashboard |
| GET | `/api/ventas/admin/todas` | Sí | admin | Historial global |

> Las ventas **no** tienen endpoints PUT ni DELETE — representan historial permanente.

## Modelos y relaciones

### Usuario
- `nombre`, `email`, `password`, `rol` (`user` | `admin`), `activo`

### Moto
- `propietario` → Usuario
- `disponible` (false tras venta)

### Venta
- `comprador` → Usuario
- `vendedor` → Usuario
- `moto` → Moto
- `precioTotal`, `cantidad`, `estado`, `createdAt`

## Flujo del sistema

1. Usuario se registra → rol `user`
2. Publica motos en **Mis motos** (`propietario` = su id)
3. Otros usuarios ven el **marketplace** (motos disponibles, excluyendo las propias)
4. Al comprar → se crea venta inmutable y la moto pasa a `disponible: false`
5. Admin puede moderar motos y ver ventas/usuarios globales

## Seguridad

- Ownership validado en middleware (`verificarOwnershipMoto`)
- Admin bypass en edición/eliminación
- Nunca confiar en el frontend para permisos
- Contraseñas con bcrypt (10 rounds)

## Deploy (Render)

- Build: `npm install`
- Start: `npm start`
- Variables de entorno obligatorias en panel
- Health check: `GET /api/health`
