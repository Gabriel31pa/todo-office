const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');
const auth = require('../middleware/auth');

// GET - Ventas por rango de fechas
router.get('/ventas', auth, async (req, res) => {
  const { inicio, fin } = req.query;
  try {
    const result = await pool.query(`
      SELECT v.id, v.total, v.fecha, c.nombre AS cliente_nombre
      FROM ventas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      WHERE v.fecha BETWEEN $1 AND $2::date + interval '1 day'
      ORDER BY v.fecha DESC
    `, [inicio, fin]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reporte de ventas' });
  }
});

module.exports = router;