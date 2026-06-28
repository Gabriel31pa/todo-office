const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/conexion');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1', [email]
    );
    const usuario = result.rows[0];
    if (!usuario) return res.status(400).json({ mensaje: 'Usuario no encontrado' });

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// POST /api/auth/registro (crear primer admin)
router.post('/registro', async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !nombre.trim() || !email || !email.trim() || !password) {
    return res.status(400).json({ mensaje: 'Nombre, email y contraseña requeridos' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, hash, rol || 'usuario']
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
});

module.exports = router;