const express = require('express');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, getUsers);  // Ahora solo usuarios autenticados pueden ver la lista de usuarios
router.post('/', verifyToken, createUser);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

module.exports = router;
