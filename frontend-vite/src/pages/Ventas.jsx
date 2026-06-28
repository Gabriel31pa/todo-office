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

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta venta?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/ventas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (ventaSeleccionada?.id === id) {
        setDetalleVenta(null);
        setVentaSeleccionada(null);
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

      <div style={styles.contenido}>
        {/* Tabla de ventas */}
        <div style={styles.tablaContainer}>
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
                  <tr key={v.id} style={{
                    ...styles.fila,
                    backgroundColor: ventaSeleccionada?.id === v.id ? '#f3e8ff' : 'white',
                  }}>
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
        </div>

        {/* Panel de detalle */}
        {detalleVenta && ventaSeleccionada && (
          <div style={styles.detalle}>
            <div style={styles.detalleTitulo}>
              <h3 style={{ margin: 0 }}>
                Detalle de Venta #{ventaSeleccionada.id}
              </h3>
              <button onClick={() => { setDetalleVenta(null); setVentaSeleccionada(null); }}
                style={styles.cerrar}>✕</button>
            </div>
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
        )}
      </div>
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
  contenido: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  tablaContainer: { flex: 1 },
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
  detalle: { width: '350px', backgroundColor: 'white', padding: '20px',
    borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexShrink: 0 },
  detalleTitulo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '12px' },
  cerrar: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer',
    color: '#666' },
  detalleCliente: { margin: '4px 0', fontSize: '14px', color: '#555' },
  detalleTotal: { marginTop: '16px', textAlign: 'right', fontWeight: 'bold',
    fontSize: '16px', color: '#9701df' },
  error: { color: 'red', marginBottom: '12px' },
};

export default Ventas;