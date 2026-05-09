const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');
const auth = require('../middleware/auth');

// GET - Obtener todos los productos con su stock
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

// POST - Crear producto y su inventario
router.post('/', auth, async (req, res) => {
  const { nombre, categoria, precio, descripcion, cantidad } = req.body;
  try {
    const producto = await pool.query(
      'INSERT INTO productos (nombre, categoria, precio, descripcion) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, categoria, precio, descripcion]
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

// DELETE - Eliminar producto
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM productos WHERE id = $1', [req.params.id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
});

// PUT - Editar producto
router.put('/:id', auth, async (req, res) => {
  const { nombre, categoria, precio, descripcion, cantidad } = req.body;
  try {
    await pool.query(
      'UPDATE productos SET nombre=$1, categoria=$2, precio=$3, descripcion=$4 WHERE id=$5',
      [nombre, categoria, precio, descripcion, req.params.id]
    );
    await pool.query(
      'UPDATE inventario SET cantidad=$1 WHERE producto_id=$2',
      [cantidad, req.params.id]
    );
    res.json({ mensaje: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
});
module.exports = router;