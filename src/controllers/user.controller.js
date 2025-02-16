const User = require('../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const LogService = require('./log.controller');


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        console.log("🔹 Usuario autenticado:", req.user);

        // ✅ Asegurarse de que `req.user.id` existe antes de intentar guardar el log
        if (req.user?.id) {
            await LogService.createLog(req.user.id, 'getUsers', req);
        } else {
            console.warn('⚠️ No se guardó log porque el usuario no está autenticado.');
        }

        res.json(users);
    } catch (error) {
        console.error('❌ Error al obtener los usuarios:', error);
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};


exports.createUser = async (req, res) => {
    try {
        const { name, lastname, email, password, rol = 'user' } = req.body;

        // 🔹 Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'El email ya está registrado' });

        // 🔹 Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🔹 Crear el nuevo usuario con valores por defecto
        const newUser = new User({ 
            name, 
            lastname, 
            email, 
            password: hashedPassword, 
            rol,  // ✅ Si no se proporciona, se establece en 'user' automáticamente
            active: true // ✅ Se asegura de que el usuario esté activo por defecto
        });

        await newUser.save();

        // ✅ Registrar log de creación (ahora con `createUser`)
        await LogService.createLog(newUser._id, 'createUser', req);

        res.status(201).json({ message: 'Usuario creado correctamente', user: newUser });
    } catch (error) {
        console.error('❌ Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
};



exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, active } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID no válido' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        let updatedData = {};
        if (name !== undefined) updatedData.name = name;
        if (active !== undefined) updatedData.active = active;
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'El email ya está en uso' });
            }
            updatedData.email = email;
        }
        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true }).select('-password');

        // ✅ Registrar log de actualización
        await LogService.createLog(user._id, 'updateUser', req);

        res.json({ message: 'Usuario actualizado correctamente', user: updatedUser });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await User.findByIdAndDelete(id);

        // ✅ Registrar log de eliminación
        await LogService.createLog(id, 'deleteUser', req);

        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error });
    }

    
};
