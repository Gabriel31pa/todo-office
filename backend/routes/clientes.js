const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');
const auth = require('../middleware/auth');

// GET - Obtener todos los clientes con estadísticas
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.nombre, c.creado_en,
        COUNT(v.id) AS total_compras,
        COALESCE(SUM(v.total), 0) AS total_gastado
      FROM clientes c
      LEFT JOIN ventas v ON c.id = v.cliente_id
      GROUP BY c.id
      ORDER BY c.id DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener clientes' });
  }
});

// POST - Crear cliente
router.post('/', auth, async (req, res) => {
  const { nombre } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ mensaje: 'Nombre es requerido' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO clientes (nombre) VALUES ($1) RETURNING *',
      [nombre.trim()]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear cliente' });
  }
});

// PUT - Editar cliente
router.put('/:id', auth, async (req, res) => {
  const { nombre } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ mensaje: 'Nombre es requerido' });
  }
  try {
    const result = await pool.query(
      'UPDATE clientes SET nombre=$1 WHERE id=$2 RETURNING *',
      [nombre.trim(), req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al editar cliente' });
  }
});

// DELETE - Eliminar cliente
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query(`
      DELETE FROM detalle_venta 
      WHERE venta_id IN (
        SELECT id FROM ventas WHERE cliente_id = $1
      )
    `, [req.params.id]);

    await pool.query(
      'DELETE FROM ventas WHERE cliente_id = $1', 
      [req.params.id]
    );

    await pool.query(
      'DELETE FROM clientes WHERE id = $1', 
      [req.params.id]
    );

    res.json({ mensaje: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar cliente' });
  }
});

module.exports = router;