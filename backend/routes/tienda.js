const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');
const generarPDF = require('../generarPDF');
const enviarCorreo = require('../enviarCorreo');

// GET - Obtener todos los productos (con y sin stock)
router.get('/productos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, i.cantidad, i.stock_minimo 
      FROM productos p
      LEFT JOIN inventario i ON p.id = i.producto_id
      ORDER BY p.nombre ASC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
});

// POST - Registrar compra desde la tienda
router.post('/compra', async (req, res) => {
  const { nombre, correo, metodoPago, numeroCuenta, items, total } = req.body;
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
          mensaje: `Stock insuficiente para el producto seleccionado`
        });
      }
    }

    // Buscar o crear cliente con ese nombre
    let cliente = await pool.query(
      'SELECT * FROM clientes WHERE nombre = $1', [nombre]
    );

    let cliente_id;
    if (cliente.rows.length === 0) {
      const nuevoCliente = await pool.query(
        'INSERT INTO clientes (nombre) VALUES ($1) RETURNING *', [nombre]
      );
      cliente_id = nuevoCliente.rows[0].id;
    } else {
      cliente_id = cliente.rows[0].id;
    }

    // Crear la venta
    const venta = await pool.query(
      'INSERT INTO ventas (cliente_id, usuario_id, total) VALUES ($1, $2, $3) RETURNING *',
      [cliente_id, 1, total]
    );

    const venta_id = venta.rows[0].id;
    const detallesParaPDF = [];

    // Insertar detalles y actualizar inventario
    for (const item of items) {
      const subtotal = item.cantidad * item.precio_unitario;

      const productoInfo = await pool.query(
        'SELECT nombre FROM productos WHERE id = $1', [item.producto_id]
      );

      await pool.query(
        'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
        [venta_id, item.producto_id, item.cantidad, item.precio_unitario, subtotal]
      );

      await pool.query(
        'UPDATE inventario SET cantidad = cantidad - $1 WHERE producto_id = $2',
        [item.cantidad, item.producto_id]
      );

      detallesParaPDF.push({
        nombre: productoInfo.rows[0].nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal,
      });
    }

    // Generar PDF de la factura
    const ventaCompleta = {
      id: venta_id,
      cliente_nombre: nombre,
      fecha: venta.rows[0].fecha,
      total,
    };
    const rutaPDF = generarPDF(ventaCompleta, detallesParaPDF);

    // Enviar correo si el cliente dio su email
    if (correo) {
      try {
        await enviarCorreo(correo, rutaPDF, venta_id);
      } catch (errorCorreo) {
        console.log('Error al enviar correo:', errorCorreo.message);
      }
    }

    res.json({
      mensaje: 'Compra registrada correctamente',
      venta_id,
      pdfUrl: `${process.env.BACKEND_URL || 'http://localhost:5000'}/facturas/factura_${venta_id}.pdf`,
    });
  } catch (error) {
    console.log('ERROR:', error.message);
    res.status(500).json({ mensaje: 'Error al procesar compra' });
  }
});

module.exports = router;