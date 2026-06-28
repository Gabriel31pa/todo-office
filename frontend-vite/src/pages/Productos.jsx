import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function obtenerUrlImagen(imagen) {
  if (!imagen) return null;
  if (imagen.startsWith('http')) return imagen;
  return `${import.meta.env.VITE_API_URL}${imagen}`;
}

function Productos() {
  const [productos, setProductos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    descripcion: '',
    cantidad: '',
  });
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const cargarProductos = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/productos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(res.data);
    } catch (err) {
      setError('Error al cargar productos');
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEditar = (producto) => {
    setEditando(producto.id);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      descripcion: producto.descripcion,
      cantidad: producto.cantidad,
    });
    setPreview(producto.imagen ? obtenerUrlImagen(producto.imagen) : null);
    setImagen(null);
    setMostrarForm(true);
  };

  const handleCancelar = () => {
    setEditando(null);
    setForm({ nombre: '', categoria: '', precio: '', descripcion: '', cantidad: '' });
    setImagen(null);
    setPreview(null);
    setMostrarForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nombre', form.nombre);
      formData.append('categoria', form.categoria);
      formData.append('precio', form.precio);
      formData.append('descripcion', form.descripcion);
      formData.append('cantidad', form.cantidad);
      if (imagen) formData.append('imagen', imagen);

      if (editando) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/productos/${editando}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/productos`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      handleCancelar();
      cargarProductos();
    } catch (err) {
      setError('Error al guardar producto');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarProductos();
    } catch (err) {
      setError('Error al eliminar producto');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>📦 Productos</h2>
        <div style={styles.headerBotones}>
          <button onClick={() => setMostrarForm(true)} className="btn-hover" style={styles.botonAgregar}>
            + Agregar Producto
          </button>
          <button onClick={() => navigate('/dashboard')} className="btn-hover" style={styles.botonVolver}>
            ← Volver
          </button>
        </div>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* Modal del formulario */}
      {mostrarForm && (
        <div style={styles.overlay} onClick={handleCancelar}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCancelar} style={styles.cerrarModal}>✕</button>
            <h3 style={styles.modalTitulo}>{editando ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.grid}>
                <div style={styles.campo}>
                  <label>Nombre</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange}
                    style={styles.input} required />
                </div>
                <div style={styles.campo}>
                  <label>Categoría</label>
                  <input name="categoria" value={form.categoria} onChange={handleChange}
                    style={styles.input} />
                </div>
                <div style={styles.campo}>
                  <label>Precio</label>
                  <input name="precio" type="number" value={form.precio} onChange={handleChange}
                    style={styles.input} required />
                </div>
                <div style={styles.campo}>
                  <label>Stock</label>
                  <input name="cantidad" type="number" value={form.cantidad} onChange={handleChange}
                    style={styles.input} required />
                </div>
                <div style={styles.campo}>
                  <label>Descripción</label>
                  <input name="descripcion" value={form.descripcion} onChange={handleChange}
                    style={styles.input} />
                </div>
                <div style={styles.campo}>
                  <label>Imagen del producto</label>
                  <input type="file" accept="image/*" onChange={handleImagen}
                    style={styles.input} />
                  {preview && (
                    <img src={preview} alt="preview" style={styles.preview} />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" className="btn-hover" style={styles.botonGuardar}>
                  {editando ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
                <button type="button" onClick={handleCancelar} className="btn-hover" style={styles.botonCancelar}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table style={styles.tabla}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>Imagen</th>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Categoría</th>
            <th style={styles.th}>Precio</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan="6" style={styles.vacio}>No hay productos registrados</td>
            </tr>
          ) : (
            productos.map((p) => (
              <tr key={p.id} style={styles.fila}>
                <td style={styles.td}>
                  {p.imagen ? (
                    <img src={obtenerUrlImagen(p.imagen)} alt={p.nombre}
                      style={styles.imagenTabla} />
                  ) : (
                    <span style={styles.sinImagen}>📦</span>
                  )}
                </td>
                <td style={styles.td}>{p.nombre}</td>
                <td style={styles.td}>{p.categoria}</td>
                <td style={styles.td}>${parseFloat(p.precio).toFixed(2)}</td>
                <td style={{
                  ...styles.td,
                  color: p.cantidad <= p.stock_minimo ? 'red' : 'green',
                  fontWeight: 'bold'
                }}>
                  {p.cantidad}
                </td>
                <td style={styles.td}>
                  <button style={styles.botonEditar} className="btn-hover" onClick={() => handleEditar(p)}>
                    Editar
                  </button>
                  <button style={styles.botonEliminar} className="btn-hover" onClick={() => handleEliminar(p.id)}>
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
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { backgroundColor: 'white', padding: '32px', borderRadius: '10px',
    width: '600px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto',
    position: 'relative', boxSizing: 'border-box' },
  cerrarModal: { position: 'absolute', top: '12px', right: '12px', background: 'none',
    border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666' },
  modalTitulo: { marginTop: 0, color: '#762d78' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px' },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  preview: { width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px',
    marginTop: '8px' },
  tabla: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white',
    borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  thead: { backgroundColor: '#9701df', color: 'white' },
  th: { padding: '12px 16px', textAlign: 'left' },
  fila: { borderBottom: '1px solid #eee' },
  td: { padding: '12px 16px' },
  imagenTabla: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' },
  sinImagen: { fontSize: '24px' },
  vacio: { textAlign: 'center', padding: '20px', color: '#999' },
  error: { color: 'red', marginBottom: '12px' },
};

export default Productos;