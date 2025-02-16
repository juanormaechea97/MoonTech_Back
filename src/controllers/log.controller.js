const Log = require('../models/Log');

exports.createLog = async (userId, action, req) => {
    try {
        const log = new Log({
            user: userId,
            action: action, // 'login', 'logout', 'create', 'update', 'delete'
            login: action === 'login',
            ip: req.ip || 'Unknown', // Obtener la IP del usuario
            userAgent: req.headers['user-agent'] || 'Unknown' // Obtener el dispositivo
        });

        await log.save();
        console.log(`✅ Log guardado: ${action} para usuario ${userId}`);
    } catch (error) {
        console.error('❌ Error al guardar log:', error);
    }
};
