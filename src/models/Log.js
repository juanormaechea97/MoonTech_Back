const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    login: { type: Boolean, required: true },
    ip: { type: String }, // ✅ Dirección IP del usuario
    userAgent: { type: String }, // ✅ Información del dispositivo
    action: { 
        type: String, 
        enum: ['login', 'logout', 'getUsers', 'createUser', 'updateUser', 'deleteUser'], 
        required: true 
    } // ✅ Se agregan más acciones posibles
});

module.exports = mongoose.model('Log', LogSchema, 'logs');
