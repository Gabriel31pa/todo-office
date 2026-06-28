import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Mensajes() {
  const [mensajes, setMensajes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const cargarMensajes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contacto', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensajes(res.data);
    } catch (err) {
      setError('Error al cargar mensajes');
    }
  };

  useEffect(() => {
    cargarMensajes();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este mensaje?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/contacto/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarMensajes();
    } catch (err) {
      setError('Error al eliminar mensaje');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>📨 Mensajes de Contacto</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-hover" style={styles.botonVolver}>
          ← Volver
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {mensajes.length === 0 ? (
        <p style={styles.vacio}>No hay mensajes recibidos</p>
      ) : (
        <div style={styles.lista}>
          {mensajes.map((m) => (
            <div key={m.id} style={styles.mensajeCard}>
              <div style={styles.mensajeHeader}>
                <div>
                  <strong>{m.nombre}</strong>
                  <span style={styles.correo}> &lt;{m.correo}&gt;</span>
                </div>
                <span style={styles.fecha}>
                  {new Date(m.fecha).toLocaleString()}
                </span>
              </div>
              <p style={styles.mensajeTexto}>{m.mensaje}</p>
              <button onClick={() => handleEliminar(m.id)} className="btn-hover" style={styles.botonEliminar}>
                Eliminar
              </button>
            </div>
          ))}
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
  lista: { display: 'flex', flexDirection: 'column', gap: '16px' },
  mensajeCard: { backgroundColor: 'white', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '4px solid #9701df' },
  mensajeHeader: { display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '10px' },
  correo: { color: '#666', fontSize: '13px' },
  fecha: { fontSize: '12px', color: '#999' },
  mensajeTexto: { color: '#333', fontSize: '14px', lineHeight: '1.5', marginBottom: '12px' },
  botonEliminar: { padding: '6px 14px', backgroundColor: '#ef4444', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  vacio: { textAlign: 'center', color: '#999', marginTop: '40px' },
  error: { color: 'red', marginBottom: '12px' },
};

export default Mensajes;