const PDFDocument = require('pdfkit');

function generarPDF(venta, items) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(22).text('FACTURA', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Factura No.: ${venta.id}`);
    doc.text(`Cliente: ${venta.cliente_nombre}`);
    doc.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text('Productos:', { underline: true });
    doc.moveDown(0.5);

    items.forEach((item) => {
      doc.fontSize(11).text(
        `${item.nombre}  -  Cant: ${item.cantidad}  -  Precio: $${parseFloat(item.precio_unitario).toFixed(2)}  -  Subtotal: $${parseFloat(item.subtotal).toFixed(2)}`
      );
    });

    doc.moveDown();
    const subtotal = parseFloat(venta.total) / 1.07;
    const itbms = parseFloat(venta.total) - subtotal;

    doc.fontSize(12).text(`Subtotal: $${subtotal.toFixed(2)}`);
    doc.text(`ITBMS (7%): $${itbms.toFixed(2)}`);
    doc.fontSize(14).text(`TOTAL: $${parseFloat(venta.total).toFixed(2)}`, { bold: true });

    doc.moveDown();
    doc.fontSize(10).text('Gracias por su compra.', { align: 'center' });

    doc.end();
  });
}

module.exports = generarPDF;