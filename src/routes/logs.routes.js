const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const { verifyToken } = require('../middleware/auth.middleware');// ✅ Asegurar que solo usuarios autenticados accedan

// ✅ Obtener todos los logs
router.get('/', verifyToken, async (req, res) => {
  try {
    const logs = await Log.find().populate('user', 'name lastname');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener logs', error });
  }
});

module.exports = router;
