const nodemailer = require('nodemailer');
require('dotenv').config();

async function enviarCorreo(correoCliente, rutaPDF, ventaId) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      family: 4,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correoCliente,
      subject: `Factura #${ventaId} - Gracias por su compra`,
      text: 'Estimado cliente, adjuntamos la copia de su factura en formato PDF. Gracias por su compra.',
      attachments: [
        {
          filename: `factura_${ventaId}.pdf`,
          path: rutaPDF,
        },
      ],
    });
    console.log(`Correo enviado exitosamente a ${correoCliente}`);
  } catch (error) {
    console.error(`Error al enviar correo a ${correoCliente}:`, error.message);
    throw error;
  }
}

module.exports = enviarCorreo;