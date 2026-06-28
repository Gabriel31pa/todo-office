import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Reportes() {
  const [ventasPorFecha, setVentasPorFecha] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const cargarInventario = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/productos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventario(res.data);
    } catch (err) {
      setError('Error al cargar inventario');
    }
  };

  useEffect(() => {
  cargarInventario();
  cargarVentas();
}, []);

  const cargarVentas = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/ventas', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setVentasPorFecha(res.data);
  } catch (err) {
    setError('Error al cargar ventas');
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>📊 Reportes</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-hover" style={styles.botonVolver}>
          ← Volver
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Reporte de ventas por fecha */}
      <div style={styles.seccion}>
        <h3 style={styles.seccionTitulo}>🗓️ Ventas por Fecha</h3>

        <table style={styles.tabla}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Cliente</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ventasPorFecha.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.vacio}>
                  No hay ventas registradas
                </td>
              </tr>
            ) : (
              ventasPorFecha.map((v) => (
                <tr key={v.id} style={styles.fila}>
                  <td style={styles.td}>{v.id}</td>
                  <td style={styles.td}>{v.cliente_nombre}</td>
                  <td style={styles.td}>${parseFloat(v.total).toFixed(2)}</td>
                  <td style={styles.td}>{new Date(v.fecha).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {ventasPorFecha.length > 0 && (
          <div style={styles.totalReporte}>
            Total del período: $
            {ventasPorFecha.reduce((sum, v) => sum + parseFloat(v.total), 0).toFixed(2)}
          </div>
        )}
      </div>

      {/* Reporte de inventario actual */}
      <div style={styles.seccion}>
        <h3 style={styles.seccionTitulo}>📦 Inventario Actual</h3>
        <table style={styles.tabla}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Producto</th>
              <th style={styles.th}>Categoría</th>
              <th style={styles.th}>Precio</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {inventario.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.vacio}>No hay productos registrados</td>
              </tr>
            ) : (
              inventario.map((p) => (
                <tr key={p.id} style={styles.fila}>
                  <td style={styles.td}>{p.nombre}</td>
                  <td style={styles.td}>{p.categoria}</td>
                  <td style={styles.td}>${parseFloat(p.precio).toFixed(2)}</td>
                  <td style={styles.td}>{p.cantidad}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: p.cantidad <= p.stock_minimo ? '#ef4444' : '#10b981'
                    }}>
                      {p.cantidad <= p.stock_minimo ? 'Bajo stock' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
  seccion: { backgroundColor: 'white', padding: '24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' },
  seccionTitulo: { margin: '0 0 16px', color: '#333' },
  filtros: { display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '16px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  botonBuscar: { padding: '10px 20px', backgroundColor: '#9701df', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  tabla: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#9701df', color: 'white' },
  th: { padding: '12px 16px', textAlign: 'left' },
  fila: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px' },
  badge: { padding: '4px 10px', borderRadius: '20px', color: 'white', fontSize: '12px' },
  vacio: { textAlign: 'center', padding: '20px', color: '#999' },
  totalReporte: { marginTop: '16px', fontWeight: 'bold', fontSize: '16px',
    color: '#9701df', textAlign: 'right' },
  error: { color: 'red', marginBottom: '12px' },
};

export default Reportes;