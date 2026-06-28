const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// GET - Obtener todos los usuarios
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, creado_en FROM usuarios ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
});

// POST - Crear usuario
router.post('/', auth, async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, hash, rol || 'admin']
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
});

// PUT - Editar usuario
router.put('/:id', auth, async (req, res) => {
  const { nombre, email, rol, password } = req.body;
  try {
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE usuarios SET nombre=$1, email=$2, rol=$3, password=$4 WHERE id=$5',
        [nombre, email, rol, hash, req.params.id]
      );
    } else {
      await pool.query(
        'UPDATE usuarios SET nombre=$1, email=$2, rol=$3 WHERE id=$4',
        [nombre, email, rol, req.params.id]
      );
    }
    res.json({ mensaje: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al editar usuario' });
  }
});

// DELETE - Eliminar usuario
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [req.params.id]);
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

module.exports = router;