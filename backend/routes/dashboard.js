const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');
const auth = require('../middleware/auth');

// GET - Resumen del dashboard
router.get('/', auth, async (req, res) => {
  try {
    // Total de ventas
    const totalVentas = await pool.query(
      'SELECT COUNT(*) AS cantidad, COALESCE(SUM(total), 0) AS monto FROM ventas'
    );

    // Total de productos
    const totalProductos = await pool.query(
      'SELECT COUNT(*) AS cantidad FROM productos'
    );

    // Total de clientes
    const totalClientes = await pool.query(
      'SELECT COUNT(*) AS cantidad FROM clientes'
    );

    // Productos con bajo stock
    const bajoStock = await pool.query(`
      SELECT p.nombre, i.cantidad, i.stock_minimo
      FROM inventario i
      JOIN productos p ON p.id = i.producto_id
      WHERE i.cantidad <= i.stock_minimo
      ORDER BY i.cantidad ASC
    `);

    // Ventas recientes
    const ventasRecientes = await pool.query(`
      SELECT v.id, v.total, v.fecha, c.nombre AS cliente_nombre
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.fecha DESC
      LIMIT 5
    `);

    res.json({
      totalVentas: totalVentas.rows[0],
      totalProductos: totalProductos.rows[0].cantidad,
      totalClientes: totalClientes.rows[0].cantidad,
      bajoStock: bajoStock.rows,
      ventasRecientes: ventasRecientes.rows,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener datos del dashboard' });
  }
});

module.exports = router;