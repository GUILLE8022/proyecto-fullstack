# Backend — MotoStore API

API REST para autenticación, gestión de motos con imágenes, marketplace y historial de ventas inmutable.

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- multer (subida de imágenes)
- csv-parser (seed desde CSV)
- express-validator
- CORS configurable

## Estructura

```
backend/
├── server.js
├── uploads/motos/          # Imágenes subidas (servidas en /uploads)
├── src/
│   ├── config/             # cors.js, upload.js
│   ├── controllers/
│   ├── data/               # usuarios.csv, motos.csv
│   ├── middlewares/        # auth, roles, ownership, errors
│   ├── models/
│   ├── routes/
│   ├── seed/               # seed completo e incremental
│   ├── utils/
│   └── validators/
└── .env.example
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGO_URI` | Conexión MongoDB | `mongodb+srv://...` |
| `JWT_SECRET` | Secreto para firmar tokens | `mi_secreto_seguro` |
| `PORT` | Puerto del servidor | `3000` |
| `FRONTEND_URL` | Origen permitido CORS | `https://mi-app.vercel.app` |
| `NODE_ENV` | Entorno | `production` |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor |
| `npm start` | Producción |
| `npm run seed` | **Resetea** BD e importa CSV completo |
| `npm run seed:incremental` | **Agrega** solo datos nuevos del CSV |
| `npm run seed:full` | Igual que `npm run seed` |

---

## Seed — importar datos

### Archivos CSV (`src/data/`)

**usuarios.csv**

```csv
nombre,email,password
Juan Perez,juanp@gmail.com,juan321
```

**motos.csv**

```csv
marca,modelo,precio,cilindraje,stock,imagen,segmento
Yamaha,R15,8500000,155,1,https://ejemplo.com/moto.jpg,Deportiva
```

**Columnas opcionales en motos.csv:**

| Columna | Descripción |
|---------|-------------|
| `email_propietario` | Asigna moto a usuario existente por email |
| `en_venta` | `true` / `false` |
| `descripcion` | Texto libre |

### Modo completo vs incremental

| | `npm run seed` | `npm run seed:incremental` |
|--|----------------|----------------------------|
| Borra datos | ✅ Sí | ❌ No |
| Usuarios duplicados | Reimporta todo | Omite emails existentes |
| Motos duplicadas | Reimporta todo | Omite misma marca+modelo+precio+propietario |
| Ventas ejemplo | Crea 5 | No crea ventas |
| Admin | Siempre crea | Solo si no existe |

### Ejemplo — agregar un usuario y una moto

1. Agrega filas a los CSV
2. Ejecuta:

```bash
npm run seed:incremental
```

---

## Formato de respuesta

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {}
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
| PATCH | `/api/auth/usuarios/:id/toggle` | Sí | admin | Activar/desactivar |

## Endpoints — Motos

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| GET | `/api/motos/marketplace/listado` | Sí | user | Motos en venta de otros |
| GET | `/api/motos/mis-motos/listado` | Sí | user | Motos del usuario |
| GET | `/api/motos/:id` | No | — | Detalle de moto |
| POST | `/api/motos` | Sí | user | Crear moto |
| PUT | `/api/motos/:id` | Sí | owner/admin | Actualizar moto |
| PATCH | `/api/motos/:id/en-venta` | Sí | owner | Alternar publicación en marketplace |
| POST | `/api/motos/:id/marcar-vendida` | Sí | owner | Registrar venta directa |
| DELETE | `/api/motos/:id` | Sí | owner/admin | Eliminar moto |
| GET | `/api/motos/admin/todas` | Sí | admin | Todas las motos |
| DELETE | `/api/motos/admin/:id` | Sí | admin | Moderar publicación |

## Endpoints — Upload

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/upload/imagen` | Sí | Subir foto (`multipart/form-data`, campo `imagen`) |

Las imágenes se sirven en: `GET /uploads/motos/:filename`

## Endpoints — Ventas (inmutables)

| Método | Ruta | Auth | Rol | Descripción |
|--------|------|------|-----|-------------|
| POST | `/api/ventas` | Sí | user | Comprar en marketplace |
| GET | `/api/ventas/historial/completo` | Sí | user | Compras + ventas + totales |
| GET | `/api/ventas/mis-compras/listado` | Sí | user | Solo compras |
| GET | `/api/ventas/mis-ventas/listado` | Sí | user | Solo ventas |
| GET | `/api/ventas/estadisticas/usuario` | Sí | user | Métricas dashboard |
| GET | `/api/ventas/admin/todas` | Sí | admin | Historial global |

> Las ventas **no** tienen PUT ni DELETE.

## Modelos

### Usuario
`nombre`, `email`, `password`, `rol` (`user` | `admin`), `activo`

### Moto
`marca`, `modelo`, `precio`, `cilindraje`, `imagen`, `segmento`, `propietario`, `enVenta`, `disponible`

### Venta
`comprador`, `compradorNombre`, `vendedor`, `moto`, `precioTotal`, `tipo` (`marketplace` | `directa`), `estado`, `nota`

## Flujo del sistema

1. Usuario publica moto con imagen → puede marcar **en venta**
2. Otros usuarios la ven en **marketplace** y compran → venta registrada
3. O el vendedor usa **marcar como vendida** → venta directa en historial
4. La moto pasa a `disponible: false` y sale del marketplace

## Deploy en Render (recomendado)

1. Root: `backend`
2. Build: `npm install`
3. Start: `npm start`
4. Variables: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`
5. Health check: `GET /api/health`

### Limitación de imágenes en Render (plan gratis)

Las fotos subidas se guardan en disco local. Si el servicio reinicia, pueden perderse. Para producción real considera Cloudinary o AWS S3.

---

## Credenciales seed

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@motostore.com` | `admin123` |
| User | `juanp@gmail.com` | `juan321` |
