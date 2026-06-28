import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'admin',
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditar = (usuario) => {
    setEditando(usuario.id);
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol,
    });
    setMostrarForm(true);
  };

  const handleCancelar = () => {
    setEditando(null);
    setForm({ nombre: '', email: '', password: '', rol: 'admin' });
    setMostrarForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/usuarios/${editando}`, form, {
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/usuarios`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleCancelar();
      cargarUsuarios();
    } catch (err) {
      setError('Error al guardar usuario');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarUsuarios();
    } catch (err) {
      setError('Error al eliminar usuario');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>👤 Usuarios</h2>
        <div style={styles.headerBotones}>
          <button onClick={() => setMostrarForm(!mostrarForm)} className="btn-hover" style={styles.botonAgregar}>
            {mostrarForm ? 'Cancelar' : '+ Agregar Usuario'}
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-hover" style={styles.botonVolver}>
            ← Volver
          </button>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>{editando ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
          <div style={styles.grid}>
            <div style={styles.campo}>
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange}
                style={styles.input} required />
            </div>
            <div style={styles.campo}>
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                style={styles.input} required />
            </div>
            <div style={styles.campo}>
              <label>{editando ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</label>
              <input name="password" type="password" value={form.password}
                onChange={handleChange} style={styles.input}
                required={!editando} />
            </div>
            <div style={styles.campo}>
              <label>Rol</label>
              <select name="rol" value={form.rol} onChange={handleChange} style={styles.input}>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-hover" style={styles.botonGuardar}>
              {editando ? 'Actualizar Usuario' : 'Guardar Usuario'}
            </button>
            <button type="button" onClick={handleCancelar} className="btn-hover" style={styles.botonCancelar}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      <table style={styles.tabla}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Rol</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.vacio}>No hay usuarios registrados</td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.id} style={styles.fila}>
                <td style={styles.td}>{u.nombre}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: '#9701df'
                  }}>
                    {u.rol}
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.botonEditar} className="btn-hover" onClick={() => handleEditar(u)}>
                    Editar
                  </button>
                  <button style={styles.botonEliminar} className="btn-hover" onClick={() => handleEliminar(u.id)}>
                    Eliminar
                  </button>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    color: 'white',
    backgroundColor: '#9701df', padding: '16px 24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' },
  headerBotones: { display: 'flex', gap: '12px' },
  botonVolver: { padding: '8px 16px', backgroundColor: '#383838', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  botonAgregar: { padding: '8px 16px', backgroundColor: '#762d78', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  botonGuardar: { padding: '10px 20px', backgroundColor: '#9701df', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px' },
  botonCancelar: { padding: '10px 20px', backgroundColor: '#383838', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px' },
  botonEditar: { padding: '6px 12px', backgroundColor: '#762d78', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' },
  botonEliminar: { padding: '6px 12px', backgroundColor: '#ef4444', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer' },
  form: { backgroundColor: 'white', padding: '24px', borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white',
    borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  thead: { backgroundColor: '#9701df', color: 'white' },
  th: { padding: '12px 16px', textAlign: 'left' },
  fila: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px' },
  badge: { padding: '4px 10px', borderRadius: '20px', color: 'white', fontSize: '12px' },
  vacio: { textAlign: 'center', padding: '20px', color: '#999' },
  error: { color: 'red', marginBottom: '12px' },
};

export default Usuarios;