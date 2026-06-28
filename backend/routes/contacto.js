const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
require('dotenv').config();

// POST - Enviar mensaje de contacto (público, sin autenticación)
router.post('/', async (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  try {
    await pool.query(
      'INSERT INTO mensajes_contacto (nombre, correo, mensaje) VALUES ($1, $2, $3)',
      [nombre, correo, mensaje]
    );

    // Enviar notificación a tu correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de contacto - ${nombre}`,
      text: `Nombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`,
    });

    res.json({ mensaje: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.log('Error en contacto:', error.message);
    res.status(500).json({ mensaje: 'Error al enviar el mensaje' });
  }
});

// GET - Obtener todos los mensajes (solo admin)
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM mensajes_contacto ORDER BY fecha DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mensajes' });
  }
});

// DELETE - Eliminar mensaje
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM mensajes_contacto WHERE id = $1', [req.params.id]);
    res.json({ mensaje: 'Mensaje eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar mensaje' });
  }
});

module.exports = router;