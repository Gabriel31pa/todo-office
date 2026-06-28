import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDatos(res.data);
      } catch (err) {
        console.log('Error al cargar dashboard');
      }
    };
    cargarDatos();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.titulo}>Panel Principal</h1>
        <div style={styles.headerDerecha}>
          <span style={styles.bienvenida}>Hola, {usuario?.nombre}</span>
          <button onClick={handleLogout} className="btn-hover" style={styles.botonSalir}>Cerrar Sesión</button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div style={styles.estadisticas}>
        <div style={styles.stat}>
          <h3 style={styles.statNumero}>{datos?.totalProductos || 0}</h3>
          <p style={styles.statLabel}>Productos</p>
        </div>
        <div style={styles.stat}>
          <h3 style={styles.statNumero}>{datos?.totalClientes || 0}</h3>
          <p style={styles.statLabel}>Clientes</p>
        </div>
        <div style={styles.stat}>
          <h3 style={styles.statNumero}>{datos?.totalVentas.cantidad || 0}</h3>
          <p style={styles.statLabel}>Ventas</p>
        </div>
        <div style={styles.stat}>
          <h3 style={styles.statNumero}>${parseFloat(datos?.totalVentas.monto || 0).toFixed(2)}</h3>
          <p style={styles.statLabel}>Ingresos Totales</p>
        </div>
              {usuario?.rol === 'admin' && (
          <div style={styles.tarjeta} className="btn-hover" onClick={() => navigate('/usuarios')}>
            <h3>👤 Usuarios</h3>
            <p>Gestionar usuarios del sistema</p>
          </div>
        )}
      </div>

      {/* Navegación */}
      <div style={styles.tarjetas}>
        <div style={styles.tarjeta} className="btn-hover" onClick={() => navigate('/productos')}>
          <h3>📦 Productos</h3>
          <p>Gestionar productos e inventario</p>
        </div>
        <div style={styles.tarjeta} className="btn-hover" onClick={() => navigate('/clientes')}>
          <h3>👥 Clientes</h3>
          <p>Gestionar clientes registrados</p>
        </div>
        <div style={styles.tarjeta} className="btn-hover" onClick={() => navigate('/ventas')}>
          <h3>🛒 Ventas</h3>
          <p>Registrar y ver ventas</p>
        </div>
        <div style={styles.tarjeta} className="btn-hover" onClick={() => navigate('/reportes')}>
          <h3>📊 Reportes</h3>
            <p>Ventas por fecha e inventario</p>
        </div>
        <div style={styles.tarjeta} className="btn-hover" onClick={() => navigate('/mensajes')}>
          <h3>📨 Mensajes</h3>
          <p>Ver mensajes de contacto recibidos</p>
        </div>
      </div>

      {/* Productos con bajo stock */}
      {datos?.bajoStock?.length > 0 && (
        <div style={styles.alerta}>
          <h3 style={styles.alertaTitulo}>⚠️ Productos con bajo stock</h3>
          <table style={styles.tabla}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Stock actual</th>
                <th style={styles.th}>Stock mínimo</th>
              </tr>
            </thead>
            <tbody>
              {datos.bajoStock.map((p, i) => (
                <tr key={i} style={styles.fila}>
                  <td style={styles.td}>{p.nombre}</td>
                  <td style={{ ...styles.td, color: 'red', fontWeight: 'bold' }}>{p.cantidad}</td>
                  <td style={styles.td}>{p.stock_minimo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ventas recientes */}
      {datos?.ventasRecientes?.length > 0 && (
        <div style={styles.seccion}>
          <h3 style={styles.seccionTitulo}>🕒 Ventas Recientes</h3>
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
              {datos.ventasRecientes.map((v) => (
                <tr key={v.id} style={styles.fila}>
                  <td style={styles.td}>{v.id}</td>
                  <td style={styles.td}>{v.cliente_nombre}</td>
                  <td style={styles.td}>${parseFloat(v.total).toFixed(2)}</td>
                  <td style={styles.td}>{new Date(v.fecha).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#cccdd1', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#8d06d4', padding: '16px 24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' },
  titulo: { margin: 0, color: '#ffffff' },
  headerDerecha: { display: 'flex', alignItems: 'center', gap: '16px' },
  bienvenida: { fontSize: '15px', color: '#ffffff' },
  botonSalir: { padding: '8px 16px', backgroundColor: '#762d78', color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  estadisticas: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px', marginBottom: '24px' },
  stat: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' },
  statNumero: { fontSize: '32px', margin: 0, color: '#9701df' },
  statLabel: { margin: '8px 0 0', color: '#666' },
  tarjetas: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px', marginBottom: '24px' },
  tarjeta: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' },
  alerta: { backgroundColor: 'white', padding: '24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px',
    borderLeft: '4px solid #9701df' },
  alertaTitulo: { margin: '0 0 16px', color: '#9701df' },
  seccion: { backgroundColor: 'white', padding: '24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' },
  seccionTitulo: { margin: '0 0 16px', color: '#9701df' },
  tabla: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#9701df', color: 'white' },
  th: { padding: '12px 16px', textAlign: 'left' },
  fila: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px' },
};

export default Dashboard;