import { useState } from 'react';
import axios from 'axios';

function Carrito({ carrito, vaciarCarrito, quitarDelCarrito, recargarProductos, abierto, cerrarCarrito }) {
  const [mostrarPago, setMostrarPago] = useState(false);
  const [nombre, setNombre] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [correo, setCorreo] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const itbms = subtotal * 0.07;
  const total = subtotal + itbms;

  const confirmarPago = async () => {
  if (!nombre) {
    setMensaje('Por favor ingresa tu nombre');
    return;
  }
  if (carrito.length === 0) {
    setMensaje('El carrito está vacío');
    return;
  }
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/tienda/compra`, {
  nombre,
  correo,
  metodoPago,
  numeroCuenta,
  items: carrito.map((item) => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
      })),
      total,
    });
    setMensaje('¡Compra realizada con éxito!');
    setPdfUrl(res.data.pdfUrl);
    vaciarCarrito();
    recargarProductos();
    setNombre('');
    setCorreo('');
    setNumeroCuenta('');
  } catch (err) {
    setMensaje('Error al procesar el pago');
  }
};
  return (
    <>
      {/* Fondo oscuro al abrir el carrito */}
      {abierto && <div style={styles.overlay} onClick={cerrarCarrito} />}

      {/* Panel deslizante */}
      <div style={{
        ...styles.panel,
        transform: abierto ? 'translateX(0)' : 'translateX(100%)',
      }}>
        <div style={styles.panelHeader}>
          <h3 style={styles.titulo}>CARRITO DE COMPRAS</h3>
          <button onClick={cerrarCarrito} style={styles.cerrarPanel}>✕</button>
        </div>

        {mensaje && <p style={styles.mensaje}>{mensaje}</p>}

        {carrito.length === 0 ? (
          <p style={styles.vacio}>El carrito está vacío. ¡Añade productos!</p>
        ) : (
          <>
            <table style={styles.tabla}>
              <thead>
                <tr>
                  <th style={styles.th}>Producto</th>
                  <th style={styles.th}>Cant</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id} style={styles.fila}>
                    <td style={styles.td}>{item.nombre}</td>
                    <td style={styles.td}>{item.cantidad}</td>
                    <td style={styles.td}>
                      {(item.precio * item.cantidad).toFixed(2)}
                    </td>
                    <td style={styles.td}>
                      <button onClick={() => quitarDelCarrito(item.id)} style={styles.botonQuitarItem}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={styles.totalContainer}>
              <div style={styles.totalFila}>
                <span style={styles.totalLabel}>Subtotal:</span>
                <span>B/. {subtotal.toFixed(2)}</span>
              </div>
              <div style={styles.totalFila}>
                <span style={styles.totalLabel}>ITBMS (7%):</span>
                <span>B/. {itbms.toFixed(2)}</span>
              </div>
              <div style={{ ...styles.totalFila, borderTop: '1px solid #eee',
                paddingTop: '8px', marginTop: '4px' }}>
                <span style={styles.totalLabel}>TOTAL:</span>
                <span style={styles.totalMonto}>B/. {total.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => setMostrarPago(true)} className="btn-hover" style={styles.botonPagar}>
                PROCEDER AL PAGO
              </button>
            <button onClick={vaciarCarrito} className="btn-hover" style={styles.botonVaciar}>
              Vaciar Carrito
            </button>
          </>
        )}
      </div>

      {/* Modal de pago */}
      {mostrarPago && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <button onClick={() => setMostrarPago(false)} style={styles.cerrar}>✕</button>
            <h3 style={styles.modalTitulo}>DATOS DE PAGO</h3>
            <p style={styles.modalTotal}>Total a Pagar: B/. {total.toFixed(2)}</p>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px',
              textAlign: 'center' }}>
              <span>Subtotal: B/. {subtotal.toFixed(2)} </span>
              <span>| ITBMS: B/. {itbms.toFixed(2)}</span>
            </div>

            <div style={styles.campo}>
              <label>Nombre Completo:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.campo}>
              <label>Correo:</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={styles.input}
                placeholder="tu@email.com"
              />
            </div>

            <div style={styles.campo}>
              <label>Método de Pago:</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                style={styles.input}
              >
                <option>Efectivo</option>
                <option>Tarjeta</option>
                <option>Transferencia</option>
              </select>
            </div>

            {metodoPago !== 'Efectivo' && (
              <div style={styles.campo}>
                <label>Número de Cuenta (solo Tarjeta/Transf.):</label>
                <input
                    type="text"
                    value={numeroCuenta}
                    onChange={(e) => {
                      const soloNumeros = e.target.value.replace(/\D/g, '');
                      setNumeroCuenta(soloNumeros);
                    }}
                    style={styles.input}
                    placeholder="N/A"
                    inputMode="numeric"
                  />
              </div>
            )}

            {mensaje && <p style={styles.mensajeError}>{mensaje}</p>}

            {!pdfUrl ? (
              <button onClick={confirmarPago} className="btn-hover" style={styles.botonConfirmar}>
                  Confirmar Pago y Finalizar
                </button>
            ) : (
              <div>
                <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn-hover" style={styles.botonDescarga}>
                  📄 Descargar Factura PDF
                </a>
                <button onClick={() => { setMostrarPago(false); setPdfUrl(''); }} style={styles.botonCerrarModal}>
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 998,
  },
  panel: {
    position: 'fixed', top: 0, right: 0, height: '100vh', width: '320px',
    maxWidth: '90vw',
    backgroundColor: 'white', boxShadow: '-2px 0 12px rgba(0,0,0,0.15)',
    zIndex: 999, padding: '20px', overflowY: 'auto', boxSizing: 'border-box',
    transition: 'transform 0.3s ease-in-out',
  },
  panelHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '12px', borderBottom: '1px solid #3a3343', paddingBottom: '12px',
  },
  cerrarPanel: {
    background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#9701df',
  },
  botonDescarga: { display: 'block', width: '100%', padding: '12px', backgroundColor: '#16a34a',
  color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: '6px',
  fontWeight: 'bold', marginTop: '8px', boxSizing: 'border-box' },
  botonCerrarModal: { width: '100%', padding: '10px', backgroundColor: '#6b7280', color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '8px' },
  titulo: { fontSize: '15px', fontWeight: 'bold', margin: 0 },
  vacio: { fontSize: '13px', color: '#999', textAlign: 'center', marginTop: '40px' },
  tabla: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { textAlign: 'left', padding: '6px 4px', borderBottom: '1px solid #eee', color: '#666' },
  fila: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '6px 4px', fontSize: '13px' },
  totalContainer: { marginTop: '16px' },
  totalFila: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px',
    fontSize: '13px' },
  totalLabel: { fontSize: '13px', color: '#666' },
  totalMonto: { fontSize: '17px', fontWeight: 'bold', color: '#9701df' },
  botonQuitarItem: { background: 'none', border: 'none', color: '#ef4444',
  cursor: 'pointer', fontSize: '14px', padding: '2px 6px' },
  botonPagar: { width: '100%', padding: '12px', backgroundColor: '#9701df', color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '16px',
  fontWeight: 'bold', fontSize: '14px' },
  botonVaciar: { width: '100%', padding: '10px', backgroundColor: '#dac1da', color: '#9701df',
    border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '8px',
    fontSize: '13px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '32px', borderRadius: '10px',
  width: '380px', maxWidth: '90vw', position: 'relative', boxSizing: 'border-box' },
  cerrar: { position: 'absolute', top: '12px', right: '12px', background: 'none',
    border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666' },
  modalTitulo: { textAlign: 'center', color: '#762d78', marginTop: 0 },
modalTotal: { textAlign: 'center', color: '#9701df', fontWeight: 'bold',
  fontSize: '18px', marginBottom: '4px' },
  campo: { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  botonConfirmar: { width: '100%', padding: '12px', backgroundColor: '#9701df', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
    fontSize: '15px', marginTop: '8px' },
    botonDescarga: { display: 'block', width: '100%', padding: '12px', backgroundColor: '#9701df',
  color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: '6px',
  fontWeight: 'bold', marginTop: '8px', boxSizing: 'border-box' },
  mensaje: { color: '#10b981', fontSize: '13px', textAlign: 'center' },
  mensajeError: { color: '#ef4444', fontSize: '13px', textAlign: 'center' },
};

export default Carrito;