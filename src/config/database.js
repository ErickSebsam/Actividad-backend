const mysql = require('mysql2/promise');
const dbConfig = {
host: process.env.DB_HOST || 'localhost',
user: process.env.DB_USER || 'root',
password: process.env.DB_PASSWORD || '',
database: process.env.DB_NAME || 'marketplace',
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
};
// Pool de conexiones 
const pool = mysql.createPool(dbConfig);
// Función para probar la conexión
const testConnection = async () => {
try {
const connection = await pool.getConnection();
console.log(' Base de datos conectada correctamente');
connection.release();
} catch (error) {
console.error(' Error al conectar con la base de datos:', error.message);
process.exit(1);
}
};
// Función para ejecutar queries
const executeQuery = async (query, params = []) => {
try {
const [rows] = await pool.execute(query, params);
return rows;
} catch (error) {
console.error('Error en query:', error.message);
throw error;
}
};
module.exports = { pool, testConnection, executeQuery };