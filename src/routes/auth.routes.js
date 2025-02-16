const express = require('express');
const { login, logout } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', login);
router.post('/logout', verifyToken, logout); // ✅ Ruta protegida para hacer logout

module.exports = router;
