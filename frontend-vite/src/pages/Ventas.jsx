import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const cargarVentas = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/ventas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVentas(res.data);
    } catch (err) {
      setError('Error al cargar ventas');
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const verDetalle = async (venta) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ventas/${venta.id}/detalle`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetalleVenta(res.data);
      setVentaSeleccionada(venta);
    } catch (err) {
      setError('Error al cargar detalle');
    }
  };

  const cerrarDetalle = () => {
    setDetalleVenta(null);
    setVentaSeleccionada(null);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta venta?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/ventas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ventaSeleccionada?.id === id) {
        cerrarDetalle();
      }
      cargarVentas();
    } catch (err) {
      setError('Error al eliminar venta');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🛒 Ventas</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-hover" style={styles.botonVolver}>
          ← Volver
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <table style={styles.tabla}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Cliente</th>
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Fecha</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.vacio}>No hay ventas registradas</td>
            </tr>
          ) : (
            ventas.map((v) => (
              <tr key={v.id} style={styles.fila}>
                <td style={styles.td}>{v.id}</td>
                <td style={styles.td}>{v.cliente_nombre}</td>
                <td style={styles.td}>${parseFloat(v.total).toFixed(2)}</td>
                <td style={styles.td}>{new Date(v.fecha).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <button style={styles.botonDetalle} className="btn-hover" onClick={() => verDetalle(v)}>
                    Ver detalle
                  </button>
                  <button style={styles.botonEliminar} className="btn-hover" onClick={() => handleEliminar(v.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal de detalle */}
      {detalleVenta && ventaSeleccionada && (
        <div style={styles.overlay} onClick={cerrarDetalle}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button onClick={cerrarDetalle} style={styles.cerrarModal}>✕</button>
            <h3 style={styles.modalTitulo}>
              Detalle de Venta #{ventaSeleccionada.id}
            </h3>
            <p style={styles.detalleCliente}>
              Cliente: <strong>{ventaSeleccionada.cliente_nombre}</strong>
            </p>
            <p style={styles.detalleCliente}>
              Fecha: <strong>{new Date(ventaSeleccionada.fecha).toLocaleDateString()}</strong>
            </p>
            <table style={styles.tablaDetalle}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Producto</th>
                  <th style={styles.th}>Cant</th>
                  <th style={styles.th}>Precio</th>
                  <th style={styles.th}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalleVenta.map((d, i) => (
                  <tr key={i} style={styles.fila}>
                    <td style={styles.td}>{d.nombre}</td>
                    <td style={styles.td}>{d.cantidad}</td>
                    <td style={styles.td}>${parseFloat(d.precio_unitario).toFixed(2)}</td>
                    <td style={styles.td}>${parseFloat(d.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={styles.detalleTotal}>
              Total: ${parseFloat(ventaSeleccionada.total).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#cccdd1', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    color: 'white',
    backgroundColor: '#9701df', padding: '16px 24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' },
  botonVolver: { padding: '8px 16px', backgroundColor: '#383838', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white',
    borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tablaDetalle: { width: '100%', borderCollapse: 'collapse', marginTop: '12px' },
  thead: { backgroundColor: '#9701df', color: 'white' },
  th: { padding: '12px 16px', textAlign: 'left' },
  fila: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px' },
  vacio: { textAlign: 'center', padding: '20px', color: '#999' },
  botonDetalle: { padding: '6px 12px', backgroundColor: '#762d78', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' },
  botonEliminar: { padding: '6px 12px', backgroundColor: '#ef4444', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { backgroundColor: 'white', padding: '32px', borderRadius: '10px',
    width: '450px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto',
    position: 'relative', boxSizing: 'border-box' },
  cerrarModal: { position: 'absolute', top: '12px', right: '12px', background: 'none',
    border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666' },
  modalTitulo: { marginTop: 0, color: '#762d78' },
  detalleCliente: { margin: '4px 0', fontSize: '14px', color: '#555' },
  detalleTotal: { marginTop: '16px', textAlign: 'right', fontWeight: 'bold',
    fontSize: '16px', color: '#9701df' },
  error: { color: 'red', marginBottom: '12px' },
};

export default Ventas;