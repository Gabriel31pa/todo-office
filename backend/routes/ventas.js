const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');
const auth = require('../middleware/auth');

// GET - Obtener todas las ventas
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, c.nombre AS cliente_nombre
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.fecha DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ventas' });
  }
});

// POST - Registrar venta
router.post('/', auth, async (req, res) => {
  const { cliente_id, items } = req.body;
  const usuario_id = req.usuario.id;

  try {
    // Calcular total
    const total = items.reduce((sum, item) => {
      return sum + item.cantidad * item.precio_unitario;
    }, 0);

    // Crear venta
    const venta = await pool.query(
      'INSERT INTO ventas (cliente_id, usuario_id, total) VALUES ($1, $2, $3) RETURNING *',
      [cliente_id, usuario_id, total]
    );

    const venta_id = venta.rows[0].id;

    // Insertar detalles y actualizar inventario
    for (const item of items) {
      const subtotal = item.cantidad * item.precio_unitario;

      await pool.query(
        'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
        [venta_id, item.producto_id, item.cantidad, item.precio_unitario, subtotal]
      );

      await pool.query(
        'UPDATE inventario SET cantidad = cantidad - $1 WHERE producto_id = $2',
        [item.cantidad, item.producto_id]
      );
    }

    res.json({ mensaje: 'Venta registrada correctamente', venta_id });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar venta' });
  }
});

module.exports = router;