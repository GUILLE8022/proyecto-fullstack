# 🏍️ Tienda de Motos - FullStack

Una aplicación completa de ecommerce para la venta de motocicletas, construida con tecnologías modernas.

## 🚀 Tecnologías

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** para autenticación
- **bcrypt** para encriptación de contraseñas
- **CORS** para manejo de orígenes cruzados

### Frontend
- **React 19** con **Vite**
- **React Router DOM** para navegación
- **Axios** para peticiones HTTP
- Diseño moderno con CSS variables

## 📋 Características

- ✅ Autenticación completa (Registro/Login)
- ✅ CRUD de motocicletas
- ✅ Sistema de ventas con control de stock
- ✅ Dashboard de usuario
- ✅ Historial de compras
- ✅ Interfaz moderna y responsive
- ✅ Manejo de errores y loading states

## 🗄️ Base de Datos

### Colecciones

#### Usuario
```javascript
{
  nombre: String,
  email: String (único),
  password: String (encriptado),
  rol: String (default: "user")
}
```

#### Moto
```javascript
{
  marca: String,
  modelo: String,
  precio: Number,
  cilindraje: Number,
  stock: Number (default: 10),
  imagen: String
}
```

#### Venta
```javascript
{
  usuario: ObjectId (ref: Usuario),
  moto: ObjectId (ref: Moto),
  cantidad: Number (default: 1),
  fecha: Date (default: Date.now)
}
```

### Relaciones
- Usuario → Ventas (1:N)
- Moto → Ventas (1:N)

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v16+)
- MongoDB (local o Atlas)
- npm o yarn

### Backend

1. **Instalar dependencias:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno:**
   Crear archivo `.env` en la carpeta `backend/`:
   ```env
   MONGO_URI=mongodb://localhost:27017/tienda-motos
   JWT_SECRET=tu_clave_secreta_super_segura
   ```

3. **Ejecutar seed de datos:**
   ```bash
   # Insertar motos
   node src/seed/seedMotos.js

   # Insertar usuarios de prueba
   node src/seed/seedUsuarios.js
   ```

4. **Iniciar servidor:**
   ```bash
   npm run dev
   ```
   El servidor correrá en `http://localhost:3000`

### Frontend

1. **Instalar dependencias:**
   ```bash
   cd frontend
   npm install
   ```

2. **Iniciar aplicación:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Motos
- `GET /api/motos` - Obtener todas las motos
- `GET /api/motos/:id` - Obtener moto por ID
- `POST /api/motos` - Crear moto (requiere auth)
- `PUT /api/motos/:id` - Actualizar moto (requiere auth)
- `DELETE /api/motos/:id` - Eliminar moto (requiere auth)

### Ventas
- `POST /api/ventas` - Crear venta (requiere auth)
- `GET /api/ventas` - Obtener ventas del usuario (requiere auth)

## 🎨 Diseño

- **Tema oscuro** con colores elegantes (negro, gris, azul)
- **Interfaz moderna** tipo SaaS
- **Responsive** para móviles y desktop
- **Animaciones suaves** y transiciones
- **Estados de carga** y mensajes de error visibles

## 🚀 Despliegue

### Backend (Railway/Render)
1. Subir código a GitHub
2. Conectar repositorio a Railway/Render
3. Configurar variables de entorno
4. Desplegar

### Frontend (Vercel/Netlify)
1. Build de producción: `npm run build`
2. Subir carpeta `dist/` a Vercel/Netlify
3. Configurar dominio

## 📊 Funcionalidades

### Para Usuarios
- **Registro/Login** seguro con JWT
- **Explorar motos** disponibles
- **Comprar motos** con control de stock
- **Ver historial** de compras
- **Interfaz intuitiva** y moderna

### Para Administradores
- **Crear/Editar/Eliminar** motos
- **Gestionar stock** automáticamente
- **Ver todas las ventas** del sistema

## 🔧 Scripts Disponibles

### Backend
- `npm run dev` - Inicia servidor en modo desarrollo

### Frontend
- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Vista previa de producción

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto

Miguel Beltran - [GitHub](https://github.com/Beltran18)

---

⭐ Si te gusta el proyecto, ¡dale una estrella!

## ⚙️ Configuración

Crear archivo `.env` en la carpeta `backend`:

```env
MONGO_URI=mongodb://localhost:27017/motostore
JWT_SECRET=tu_secreto_jwt_aqui
```

## 📊 Uso

1. **Registro**: Crear una cuenta nueva
2. **Login**: Iniciar sesión con credenciales
3. **Explorar Motos**: Ver catálogo de motocicletas
4. **Comprar**: Realizar compras de motos
5. **Ver Compras**: Revisar historial de compras

## 🗂️ Estructura del Proyecto

```
proyecto-fullstack/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── seed/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── App.jsx
└── README.md
```

## 🔐 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Motos
- `GET /api/motos` - Obtener todas las motos
- `GET /api/motos/:id` - Obtener moto por ID
- `POST /api/motos` - Crear nueva moto (requiere auth)
- `PUT /api/motos/:id` - Actualizar moto (requiere auth)
- `DELETE /api/motos/:id` - Eliminar moto (requiere auth)

### Ventas
- `POST /api/ventas` - Crear venta (requiere auth)
- `GET /api/ventas` - Obtener ventas del usuario (requiere auth)

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Miguel Beltran** - [GitHub](https://github.com/Beltran18)