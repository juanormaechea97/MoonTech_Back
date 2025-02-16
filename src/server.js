const express = require('express');
const http = require('http'); // Necesario para WebSockets
const { Server } = require('socket.io'); // Importar socket.io
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt'); // ✅ Para encriptar la contraseña del admin
const connectDB = require('./config/db');
const User = require('./models/User'); // ✅ Importamos el modelo User

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// ✅ Crear usuario admin si la base de datos está vacía
const createAdminUser = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('⚠️ No hay usuarios en la base de datos. Creando admin...');
            const hashedPassword = await bcrypt.hash('admin123', 10); // ✅ Contraseña encriptada
            const adminUser = new User({
                name: 'Admin',
                lastname: 'User',
                email: 'admin@example.com',
                password: hashedPassword,
                rol: 'admin',
                active: true
            });

            await adminUser.save();
            console.log('✅ Usuario admin creado: admin@example.com / admin123');
        } else {
            console.log('✅ La base de datos ya tiene usuarios. No se creó el admin.');
        }
    } catch (error) {
        console.error('❌ Error al verificar o crear el usuario admin:', error);
    }
};

// Llamamos a la función para crear admin antes de iniciar el servidor
createAdminUser();

const app = express();
const server = http.createServer(app); // Crear servidor HTTP para WebSockets
const io = new Server(server, {
    cors: { origin: '*' } // Permitir conexiones desde cualquier origen
});

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Middleware para pasar `io` a las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rutas (se colocan después del middleware para que tengan acceso a `req.io`)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/logs', require('./routes/logs.routes'));

// WebSockets: Manejo de eventos en tiempo real
io.on('connection', (socket) => {
    console.log(`🟢 Usuario conectado: ${socket.id}`);

    // Evento cuando un usuario inicia sesión
    socket.on('login', (user) => {
        console.log(`✅ Usuario ${user.name} inició sesión`);
        io.emit('userLogged', user); // Emitir evento global
    });

    // Evento cuando un usuario se desconecta
    socket.on('disconnect', () => {
        console.log(`🔴 Usuario desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
