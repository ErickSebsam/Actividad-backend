const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Usuario = require('./models/Usuario');
const { generarToken } = require('../utils/jwt');
class AuthController {
    static async registro(req, res, next) {
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({
                    error: true,

                    mensaje: 'Datos de registro inválidos',
                    errores: errores.array()
                });
            }
            const { nombre, email, password, rol } = req.body;
            const usuarioExistente = await Usuario.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({
                    error: true,
                    mensaje: 'El email ya está registrado'
                });
            }
            const passwordHash = await bcrypt.hash(password, 12);
            const nuevoUsuario = await Usuario.crear({
                nombre,
                email,
                password: passwordHash,
                rol: rol || 'comprador'
            });
            const token = generarToken(nuevoUsuario);
            res.status(201).json({
                error: false,
                mensaje: 'Usuario registrado exitosamente',
                usuario: nuevoUsuario,
                token
            });
        } catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    mensaje: 'Credenciales inválidas',
                    errores: errores.array()
                });
            }
            const { email, password } = req.body;
            const usuario = await Usuario.buscarPorEmail(email);
            if (!usuario) {
                return res.status(401).json({
                    error: true,
                    mensaje: 'Credenciales incorrectas'
                });

            }
            const passwordValida = await bcrypt.compare(password, usuario.password);
            if (!passwordValida) {
                return res.status(401).json({
                    error: true,
                    mensaje: 'Credenciales incorrectas'
                });
            }
            const usuarioLimpio = {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            };
            const token = generarToken(usuarioLimpio);
            res.json({
                error: false,
                mensaje: 'Inicio de sesión exitoso',
                usuario: usuarioLimpio,
                token
            });
        } catch (error) {
            next(error);
        }
    }
    static async perfil(req, res, next) {
        try {
            const usuario = await Usuario.buscarPorId(req.usuario.id);
            if (!usuario) {
                return res.status(404).json({
                    error: true,
                    mensaje: 'Usuario no encontrado'
                });
            }
            res.json({
                error: false,
                usuario
            });
        } catch (error) {
            next(error);
        }
    }

    static async cambiarPassword(req, res, next) {
        try {
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    mensaje: 'Datos inválidos',
                    errores: errores.array()
                });
            }

            const { currentPassword, newPassword } = req.body;
            const usuarioId = req.usuario.id; // Viene del middleware de autenticación

            // 1. Buscar usuario para obtener el hash actual y la versión del token
            const usuario = await Usuario.buscarPorId(usuarioId);
            if (!usuario) {
                return res.status(404).json({ error: true, mensaje: 'Usuario no encontrado' });
            }

            // 2. Verificar que la contraseña actual sea correcta
            const passwordValida = await bcrypt.compare(currentPassword, usuario.password);
            if (!passwordValida) {
                return res.status(401).json({ error: true, mensaje: 'La contraseña actual es incorrecta' });
            }

            // 3. Hashear la nueva contraseña e incrementar la versión del token
            const salt = await bcrypt.genSalt(12);
            const nuevoHash = await bcrypt.hash(newPassword, salt);

            // Nueva versión para invalidar tokens previos (requiere ALTER TABLE users ADD token_version INT DEFAULT 0)
            const nuevaVersion = (usuario.token_version || 0) + 1;

            // 4. Actualizar en la base de datos
            // Asumiendo que tu modelo Usuario tiene un método para actualizar campos
            await Usuario.actualizar(usuarioId, {
                password: nuevoHash,
                token_version: nuevaVersion
            });

            res.json({
                error: false,
                mensaje: 'Contraseña actualizada con éxito. Todas las sesiones anteriores han sido cerradas.'
            });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = AuthController;