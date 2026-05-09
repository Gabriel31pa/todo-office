-- Crear la base de datos
CREATE DATABASE inventario_db;

-- Conectarte a ella y crear las tablas
\c inventario_db

-- Tabla de Usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'usuario', -- 'admin' o 'usuario'
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de Clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefono VARCHAR(20),
  direccion TEXT,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de Productos
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de Inventario
CREATE TABLE inventario (
  id SERIAL PRIMARY KEY,
  producto_id INT REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INT DEFAULT 0,
  stock_minimo INT DEFAULT 5,
  actualizado_en TIMESTAMP DEFAULT NOW()
);

-- Tabla de Ventas
CREATE TABLE ventas (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES clientes(id),
  usuario_id INT REFERENCES usuarios(id),
  total DECIMAL(10,2) NOT NULL,
  fecha TIMESTAMP DEFAULT NOW()
);

-- Tabla de Detalle de Venta
CREATE TABLE detalle_venta (
  id SERIAL PRIMARY KEY,
  venta_id INT REFERENCES ventas(id) ON DELETE CASCADE,
  producto_id INT REFERENCES productos(id),
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);