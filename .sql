-- Crear base de datos
CREATE DATABASE IF NOT EXISTS marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marketplace;
-- Tabla usuarios
CREATE TABLE users (
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(100) NOT NULL,

email VARCHAR(150) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
rol ENUM('comprador', 'vendedor', 'admin') DEFAULT 'comprador',
fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
INDEX idx_email (email),
INDEX idx_rol (rol)
);
-- Tabla categorías
CREATE TABLE categories (
id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(100) NOT NULL,
descripcion TEXT,
imagen_icono VARCHAR(255),
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tabla productos
CREATE TABLE products (
id INT PRIMARY KEY AUTO_INCREMENT,
vendedor_id INT NOT NULL,
categoria_id INT NOT NULL,
nombre VARCHAR(200) NOT NULL,
descripcion TEXT,
precio DECIMAL(10, 2) NOT NULL,
stock INT DEFAULT 0,
imagen_url VARCHAR(255),
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (vendedor_id) REFERENCES users(id) ON DELETE CASCADE,
FOREIGN KEY (categoria_id) REFERENCES categories(id),
INDEX idx_vendedor (vendedor_id),
INDEX idx_categoria (categoria_id),
INDEX idx_precio (precio)
);
-- Tabla órdenes
CREATE TABLE orders (
id INT PRIMARY KEY AUTO_INCREMENT,
comprador_id INT NOT NULL,
total DECIMAL(10, 2) NOT NULL,
estado ENUM('pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada') DEFAULT 'pendiente',
direccion_envio TEXT,
notas TEXT,
fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (comprador_id) REFERENCES users(id),
INDEX idx_comprador (comprador_id),
INDEX idx_estado (estado),
INDEX idx_fecha (fecha_orden)
);
-- Tabla detalles de orden
CREATE TABLE order_details (
id INT PRIMARY KEY AUTO_INCREMENT,
orden_id INT NOT NULL,
producto_id INT NOT NULL,
cantidad INT NOT NULL,
precio_unitario DECIMAL(10, 2) NOT NULL,

subtotal DECIMAL(10, 2) NOT NULL,
FOREIGN KEY (orden_id) REFERENCES orders(id) ON DELETE CASCADE,
FOREIGN KEY (producto_id) REFERENCES products(id),
INDEX idx_orden (orden_id),
INDEX idx_producto (producto_id)
);