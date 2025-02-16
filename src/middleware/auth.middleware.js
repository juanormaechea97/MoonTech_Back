const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado' });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        // ✅ Asignar correctamente el ID del usuario
        req.user = { id: verified.userId };

        console.log("✅ Usuario autenticado después de verifyToken:", req.user);

        next();
    } catch (error) {
        res.status(403).json({ message: 'Token inválido o expirado' });
    }
};
