const { executeQuery } = require('../config/database.js');
class Usuario {
static async crear(datosUsuario) {
const { nombre, email, password, rol = 'comprador' } = datosUsuario;
const query = `
INSERT INTO users (nombre, email, password, rol, fecha_registro)
VALUES (?, ?, ?, ?, NOW())
`;
try {
const resultado = await executeQuery(query, [nombre, email, password, rol]);
return {
id: resultado.insertId,

nombre,
email,
rol
};
} catch (error) {
if (error.code === 'ER_DUP_ENTRY') {
throw new Error('El email ya está registrado');
}
throw error;
}
}
static async buscarPorEmail(email) {
const query = 'SELECT * FROM users WHERE email = ?';
const usuarios = await executeQuery(query, [email]);
return usuarios.length > 0 ? usuarios[0] : null;
}
static async buscarPorId(id) {
const query = 'SELECT id, nombre, email, rol, fecha_registro FROM users WHERE id = ?';
const usuarios = await executeQuery(query, [id]);
return usuarios.length > 0 ? usuarios[0] : null;
}
static async obtenerTodos(filtros = {}) {
let query = 'SELECT id, nombre, email, rol, fecha_registro FROM users WHERE 1=1';
const params = [];
// Filtro por rol
if (filtros.rol) {
query += ' AND rol = ?';
params.push(filtros.rol);
}
// Búsqueda por nombre o email
if (filtros.busqueda) {
query += ' AND (nombre LIKE ? OR email LIKE ?)';
params.push(`%${filtros.busqueda}%`, `%${filtros.busqueda}%`);
}
// Paginación
const limite = parseInt(filtros.limite) || 10;
const offset = (parseInt(filtros.pagina) - 1) * limite || 0;
query += ' ORDER BY fecha_registro DESC LIMIT ? OFFSET ?';
params.push(limite, offset);
return await executeQuery(query, params);
}
static async actualizarPassword(id, nuevaPassword) {
const query = 'UPDATE users SET password = ? WHERE id = ?';
return await executeQuery(query, [nuevaPassword, id]);
}
}
module.exports = Usuario;