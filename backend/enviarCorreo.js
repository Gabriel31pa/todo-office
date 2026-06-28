const { Resend } = require('resend');
const fs = require('fs');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarCorreo(correoCliente, rutaPDF, ventaId) {
  try {
    const pdfBuffer = fs.readFileSync(rutaPDF);

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: correoCliente,
      subject: `Factura #${ventaId} - Gracias por su compra`,
      text: 'Estimado cliente, adjuntamos la copia de su factura en formato PDF. Gracias por su compra.',
      attachments: [
        {
          filename: `factura_${ventaId}.pdf`,
          content: pdfBuffer,
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