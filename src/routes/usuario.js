const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const {
validacionCrearUsuario,
validacionParametroId
} = require('../middlewares/validaciones');
const router = express.Router();
// POST /api/usuarios - Crear usuario
router.post('/', validacionCrearUsuario, UsuarioController.crear);
// GET /api/usuarios - Listar usuarios
router.get('/', UsuarioController.listar);
// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', validacionParametroId, UsuarioController.obtener);
module.exports = router;