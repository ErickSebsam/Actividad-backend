const { body, param, query } = require('express-validator');
const validacionCrearUsuario = [
body('nombre')
.trim()
.isLength({ min: 2, max: 100 })
.withMessage('El nombre debe tener entre 2 y 100 caracteres')
.matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
.withMessage('El nombre solo puede contener letras y espacios'),
body('email')
.trim()
.isEmail()

.withMessage('Email inválido')
.normalizeEmail(),
body('password')
.isLength({ min: 8 })
.withMessage('La contraseña debe tener al menos 8 caracteres')
.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
.withMessage('La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
body('rol')
.optional()
.isIn(['comprador', 'vendedor', 'admin'])
.withMessage('Rol inválido')
];
const validacionParametroId = [
param('id')
.isInt({ min: 1 })
.withMessage('ID debe ser un número entero positivo')
];
module.exports = {
validacionCrearUsuario,
validacionParametroId
};
