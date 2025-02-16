# MoonTech Backend

MoonTech Backend es una API REST desarrollada con **Node.js y Express**, conectada a **MongoDB**, con autenticación mediante **JWT**, registro de eventos con **WebSockets** y manejo de logs de usuario.

## 📁 Estructura del Proyecto

```
MOONTECH_BACKEND/
│── node_modules/        # Dependencias del proyecto
│── src/                # Código fuente
│   ├── config/         # Configuración del proyecto
│   │   ├── db.js       # Configuración de la conexión con MongoDB
│   ├── controllers/    # Lógica de negocio
│   │   ├── auth.controller.js  # Controlador de autenticación
│   │   ├── log.controller.js   # Controlador de logs
│   │   ├── user.controller.js  # Controlador de usuarios
│   ├── middleware/     # Middlewares personalizados
│   │   ├── auth.middleware.js  # Middleware de autenticación JWT
│   ├── models/         # Modelos de la base de datos
│   │   ├── Log.js      # Modelo de logs de usuario
│   │   ├── User.js     # Modelo de usuarios
│   ├── routes/         # Definición de rutas
│   │   ├── auth.routes.js  # Rutas de autenticación
│   │   ├── logs.routes.js  # Rutas de logs
│   │   ├── user.routes.js  # Rutas de usuarios
│   ├── server.js       # Archivo principal del servidor
│── .env                # Variables de entorno (no se sube a GitHub)
│── package.json        # Dependencias y configuración del proyecto
│── package-lock.json   # Bloqueo de versiones de dependencias
```

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/juanormaechea97/MoonTech_Back.git
cd moontech-backend
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar variables de entorno (.env)
Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:
```env
PORT=5001
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/moontech
JWT_SECRET=supersecreto
```

### 4️⃣ Iniciar el servidor
```bash
npm start
```

El servidor se ejecutará en: `http://localhost:5001`

---

## 📌 Funcionalidades

### 🔐 Autenticación de Usuarios (JWT)
- **Inicio de sesión** con email y contraseña.
- **Generación de token JWT** para sesiones seguras.
- **Middleware de protección** para rutas autenticadas.
- **Cierre de sesión** con invalidación de token en frontend.

### 👥 Gestión de Usuarios
- Crear usuarios (incluye encriptación de contraseña con bcrypt).
- Listar todos los usuarios.
- Obtener un usuario por ID.
- Actualizar información del usuario.
- Desactivar / Activar un usuario.
- Eliminar usuarios (excepto admin).

✅ **Creación automática del usuario admin** (si la base de datos está vacía):
- **Email:** `admin@example.com`
- **Contraseña:** `admin123`

### 📝 Logs de Actividad
- Registro de **inicios y cierres de sesión**.
- Registro de **acciones CRUD** sobre los usuarios.
- Guardado de **IP y User-Agent** en los logs.
- **Listado de logs** con detalles de cada acción.

### 🔴 WebSockets (Tiempo Real)
- Notificación de **usuarios conectados y desconectados**.
- Emisión de eventos en tiempo real a clientes conectados.

---

## 📌 Endpoints de la API

### 🔐 **Auth (Autenticación)**
| Método | Endpoint           | Descripción |
|--------|--------------------|-------------|
| POST   | `/api/auth/login`  | Iniciar sesión |
| POST   | `/api/auth/logout` | Cerrar sesión |

### 👥 **Usuarios**
| Método | Endpoint            | Descripción |
|--------|---------------------|-------------|
| GET    | `/api/users`        | Obtener todos los usuarios |
| GET    | `/api/users/:id`    | Obtener un usuario por ID |
| POST   | `/api/users`        | Crear un nuevo usuario |
| PUT    | `/api/users/:id`    | Actualizar usuario |
| DELETE | `/api/users/:id`    | Eliminar usuario |

### 📝 **Logs**
| Método | Endpoint          | Descripción |
|--------|------------------|-------------|
| GET    | `/api/logs`      | Obtener todos los logs |

---


