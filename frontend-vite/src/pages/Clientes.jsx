import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null);
  const [nombreEditado, setNombreEditado] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const cargarClientes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/clientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(res.data);
    } catch (err) {
      setError('Error al cargar clientes');
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleEditar = (cliente) => {
    setEditando(cliente.id);
    setNombreEditado(cliente.nombre);
  };

  const handleCancelar = () => {
    setEditando(null);
    setNombreEditado('');
  };

  const handleGuardar = async (id) => {
    if (!nombreEditado.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/clientes/${id}`,
        { nombre: nombreEditado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditando(null);
      setNombreEditado('');
      cargarClientes();
    } catch (err) {
      setError('Error al editar cliente');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este cliente?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/clientes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarClientes();
    } catch (err) {
      setError('Error al eliminar cliente');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>👥 Clientes</h2>
        <div style={styles.headerBotones}>
          <button onClick={() => navigate('/dashboard')} className="btn-hover" style={styles.botonVolver}>
            ← Volver
          </button>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <table style={styles.tabla}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Total Compras</th>
            <th style={styles.th}>Total Gastado</th>
            <th style={styles.th}>Cliente desde</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.vacio}>No hay clientes registrados</td>
            </tr>
          ) : (
            clientes.map((c) => (
              <tr key={c.id} style={styles.fila}>
                <td style={styles.td}>{c.id}</td>
                <td style={styles.td}>
                  {editando === c.id ? (
                    <input
                      type="text"
                      value={nombreEditado}
                      onChange={(e) => setNombreEditado(e.target.value)}
                      style={styles.inputEdicion}
                      autoFocus
                    />
                  ) : (
                    c.nombre
                  )}
                </td>
                <td style={styles.td}>
                  <span style={styles.badge}>{c.total_compras} compras</span>
                </td>
                <td style={styles.td}>
                  <span style={styles.monto}>
                    ${parseFloat(c.total_gastado).toFixed(2)}
                  </span>
                </td>
                <td style={styles.td}>
                  {new Date(c.creado_en).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  {editando === c.id ? (
                    <>
                      <button style={styles.botonGuardar} className="btn-hover" onClick={() => handleGuardar(c.id)}>
                        Guardar
                      </button>
                      <button style={styles.botonCancelar} className="btn-hover" onClick={handleCancelar}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button style={styles.botonEditar} className="btn-hover" onClick={() => handleEditar(c)}>
                        Editar
                      </button>
                      <button style={styles.botonEliminar} className="btn-hover" onClick={() => handleEliminar(c.id)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: '30px', backgroundColor: '#cccdd1', minHeight: '100vh' },
  badge: { padding: '4px 10px', borderRadius: '20px', backgroundColor: '#f3e8ff',
    color: '#762d78', fontSize: '12px', fontWeight: 'bold' },
  monto: { color: '#9701df', fontWeight: 'bold' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    color: 'white',
    backgroundColor: '#9701df', padding: '16px 24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' },
  headerBotones: { display: 'flex', gap: '12px' },
  botonVolver: { padding: '8px 16px', backgroundColor: '#383838', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  botonEditar: { padding: '6px 12px', backgroundColor: '#762d78', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' },
  botonEliminar: { padding: '6px 12px', backgroundColor: '#ef4444', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  botonGuardar: { padding: '6px 12px', backgroundColor: '#9701df', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' },
  botonCancelar: { padding: '6px 12px', backgroundColor: '#6b7280', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  inputEdicion: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc',
    fontSize: '14px', width: '100%' },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white',
    borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  thead: { backgroundColor: '#9701df', color: 'white' },
  th: { padding: '12px 16px', textAlign: 'left' },
  fila: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px' },
  vacio: { textAlign: 'center', padding: '20px', color: '#999' },
  error: { color: 'red', marginBottom: '12px' },
};

export default Clientes;