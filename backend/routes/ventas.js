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

// POST - Registrar nueva venta
router.post('/', auth, async (req, res) => {
  const { cliente_id, usuario_id, items, total } = req.body;
  try {
    // Verificar stock antes de procesar
    for (const item of items) {
      const stockResult = await pool.query(
        'SELECT cantidad FROM inventario WHERE producto_id = $1',
        [item.producto_id]
      );
      const stockDisponible = stockResult.rows[0]?.cantidad || 0;
      if (item.cantidad > stockDisponible) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para el producto ${item.producto_id}`
        });
      }
    }

    // Crear la venta
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

    res.json({
      mensaje: 'Venta registrada correctamente',
      venta_id,
      venta: venta.rows[0]
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar venta' });
  }
});

// GET - Detalle de una venta
router.get('/:id/detalle', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dv.cantidad, dv.precio_unitario, dv.subtotal, p.nombre
      FROM detalle_venta dv
      JOIN productos p ON dv.producto_id = p.id
      WHERE dv.venta_id = $1
    `, [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener detalle' });
  }
});

// DELETE - Eliminar venta y restaurar inventario
router.delete('/:id', auth, async (req, res) => {
  try {
    // Obtener detalles de la venta para restaurar inventario
    const detalles = await pool.query(
      'SELECT producto_id, cantidad FROM detalle_venta WHERE venta_id = $1',
      [req.params.id]
    );

    // Restaurar cantidades al inventario
    for (const detalle of detalles.rows) {
      await pool.query(
        'UPDATE inventario SET cantidad = cantidad + $1 WHERE producto_id = $2',
        [detalle.cantidad, detalle.producto_id]
      );
    }

    await pool.query(
      'DELETE FROM detalle_venta WHERE venta_id = $1',
      [req.params.id]
    );
    await pool.query(
      'DELETE FROM ventas WHERE id = $1',
      [req.params.id]
    );
    res.json({ mensaje: 'Venta eliminada' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar venta' });
  }
});

module.exports = router;