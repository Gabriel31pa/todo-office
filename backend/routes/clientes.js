const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');
const auth = require('../middleware/auth');

// GET - Obtener todos los clientes
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener clientes' });
  }
});

// POST - Crear cliente
router.post('/', auth, async (req, res) => {
  const { nombre, email, telefono, direccion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clientes (nombre, email, telefono, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, telefono, direccion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear cliente' });
  }
});

// PUT - Editar cliente
router.put('/:id', auth, async (req, res) => {
  const { nombre, email, telefono, direccion } = req.body;
  try {
    const result = await pool.query(
      'UPDATE clientes SET nombre=$1, email=$2, telefono=$3, direccion=$4 WHERE id=$5 RETURNING *',
      [nombre, email, telefono, direccion, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al editar cliente' });
  }
});

// DELETE - Eliminar cliente
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM clientes WHERE id = $1', [req.params.id]);
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar cliente' });
  }
});

module.exports = router;