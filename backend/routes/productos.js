const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const esProduccion = process.env.DB_HOST !== 'localhost';

// Configurar Cloudinary solo si estamos en producción
if (esProduccion) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Storage local (igual que antes, para desarrollo)
const storageLocal = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `producto_${Date.now()}${ext}`);
  },
});

// Storage en Cloudinary (para producción)
const storageCloudinary = esProduccion
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'todo-office',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
    })
  : null;

const upload = multer({
  storage: esProduccion ? storageCloudinary : storageLocal,
  fileFilter: (req, file, cb) => {
    const tipos = /jpeg|jpg|png|webp/;
    const valido = tipos.test(path.extname(file.originalname).toLowerCase());
    if (valido) cb(null, true);
    else cb(new Error('Solo se permiten imágenes'));
  },
});

function obtenerRutaImagen(file) {
  if (!file) return null;
  return esProduccion ? file.path : `/uploads/${file.filename}`;
}

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, i.cantidad, i.stock_minimo 
      FROM productos p
      LEFT JOIN inventario i ON p.id = i.producto_id
      ORDER BY p.id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
});

router.post('/', auth, upload.single('imagen'), async (req, res) => {
  const { nombre, categoria, precio, descripcion, cantidad } = req.body;
  if (!nombre || !nombre.trim() || !precio || parseFloat(precio) <= 0) {
    return res.status(400).json({ mensaje: 'Nombre y precio válido requeridos' });
  }
  const imagen = obtenerRutaImagen(req.file);
  try {
    const producto = await pool.query(
      'INSERT INTO productos (nombre, categoria, precio, descripcion, imagen) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, categoria, precio, descripcion, imagen]
    );
    await pool.query(
      'INSERT INTO inventario (producto_id, cantidad) VALUES ($1, $2)',
      [producto.rows[0].id, cantidad || 0]
    );
    res.json(producto.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
});

router.put('/:id', auth, upload.single('imagen'), async (req, res) => {
  const { nombre, categoria, precio, descripcion, cantidad } = req.body;
  const imagen = obtenerRutaImagen(req.file);
  try {
    const existe = await pool.query('SELECT id FROM productos WHERE id = $1', [req.params.id]);
    if (existe.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    if (imagen) {
      await pool.query(
        'UPDATE productos SET nombre=$1, categoria=$2, precio=$3, descripcion=$4, imagen=$5 WHERE id=$6',
        [nombre, categoria, precio, descripcion, imagen, req.params.id]
      );
    } else {
      await pool.query(
        'UPDATE productos SET nombre=$1, categoria=$2, precio=$3, descripcion=$4 WHERE id=$5',
        [nombre, categoria, precio, descripcion, req.params.id]
      );
    }
    await pool.query(
      'UPDATE inventario SET cantidad=$1 WHERE producto_id=$2',
      [cantidad, req.params.id]
    );
    res.json({ mensaje: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM productos WHERE id = $1', [req.params.id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
});

module.exports = router;