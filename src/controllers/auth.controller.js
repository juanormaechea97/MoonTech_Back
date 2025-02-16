const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Log = require('../models/Log');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

        if (!user.active) return res.status(403).json({ message: 'Tu cuenta está desactivada' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        await Log.create({ 
            user: user._id, 
            login: true, 
            ip, 
            userAgent, 
            action: 'login' 
        });

        res.json({ token, user: { name: user.name, email: user.email,lastname:user.lastname,  active: user.active } });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};


// ✅ Nueva función para logout
exports.logout = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(400).json({ message: 'No se pudo cerrar sesión' });

        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];

        await Log.create({ 
            user: userId, 
            login: false, 
            ip, 
            userAgent, 
            action: 'logout' 
        });

        if (req.io) {
            req.io.emit('userLoggedOut', { userId });
        }

        res.json({ message: 'Logout exitoso' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};


