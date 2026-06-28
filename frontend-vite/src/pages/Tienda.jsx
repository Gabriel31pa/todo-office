import { useState, useEffect } from 'react';
import axios from 'axios';
import Carrito from '../components/Carrito';
import { useNavigate } from 'react-router-dom';
import Contacto from '../components/Contacto';
import Footer from '../components/Footer';

const coloresCategorias = {
  'Papelería': { fondo: '#f3e8ff', texto: '#6d28d9' },
  'Tecnología': { fondo: '#cffafe', texto: '#0e7490' },
  'Oficina': { fondo: '#fef3c7', texto: '#b45309' },
};

function Tienda() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [orden, setOrden] = useState('default');
  const [categoriaActiva, setCategoriaActiva] = useState('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [carritoPulso, setCarritoPulso] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState('');
  const [cargando, setCargando] = useState(true);
  const [contactoAbierto, setContactoAbierto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
  setCargando(true);
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tienda/productos`);
    setProductos(res.data);
    const cats = ['Todo', ...new Set(res.data.map((p) => p.categoria).filter(Boolean))];
    setCategorias(cats);
  } catch (err) {
    console.log('Error al cargar productos');
  } finally {
    setCargando(false);
  }
};

  const agregarAlCarrito = (producto) => {
  const itemEnCarrito = carrito.find((item) => item.id === producto.id);
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

  if (cantidadEnCarrito >= producto.cantidad) {
    alert(`Solo hay ${producto.cantidad} unidades disponibles`);
    return;
  }

  if (itemEnCarrito) {
    setCarrito(carrito.map((item) =>
      item.id === producto.id
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    ));
  } else {
    setCarrito([...carrito, { ...producto, cantidad: 1 }]);
  }

  setCarritoPulso(true);
  setTimeout(() => setCarritoPulso(false), 350);

  setNotificacion(`✓ ${producto.nombre} añadido al carrito`);
  setTimeout(() => setNotificacion(''), 2000);
};

  const quitarDelCarrito = (productoId) => {
    const existe = carrito.find((item) => item.id === productoId);
    if (existe && existe.cantidad > 1) {
      setCarrito(carrito.map((item) =>
        item.id === productoId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ));
    } else {
      setCarrito(carrito.filter((item) => item.id !== productoId));
    }
  };

  const vaciarCarrito = () => setCarrito([]);

  const productosFiltrados = productos
  .filter((p) => {
    const coincideCategoria = categoriaActiva === 'Todo' || p.categoria === categoriaActiva;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  })
  .sort((a, b) => {
    if (orden === 'az') return a.nombre.localeCompare(b.nombre);
    if (orden === 'za') return b.nombre.localeCompare(a.nombre);
    if (orden === 'precioAsc') return a.precio - b.precio;
    if (orden === 'precioDesc') return b.precio - a.precio;
    return 0;
  });

  return (
  <>
    {notificacion && (
      <div style={styles.notificacion}>{notificacion}</div>
    )}
    <div style={styles.container}>
      {/* Header */}
      <div className="header-tienda" style={styles.header}>
        <h1 style={styles.logo}>TODO OFFICE</h1>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscador-tienda"
          style={styles.buscador}
        />
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          style={styles.selectOrden}
        >
          <option value="default">Ordenar por...</option>
          <option value="az">Nombre: A-Z</option>
          <option value="za">Nombre: Z-A</option>
          <option value="precioAsc">Precio: Menor a Mayor</option>
          <option value="precioDesc">Precio: Mayor a Menor</option>
        </select>
            <button
                onClick={() => setCarritoAbierto(true)}
                className={`btn-hover ${carritoPulso ? 'carrito-pulso' : ''}`}
                style={styles.botonCarrito}
              >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Carrito
              {carrito.reduce((sum, item) => sum + item.cantidad, 0) > 0 && (
                <span style={styles.badgeCarrito}>
                  {carrito.reduce((sum, item) => sum + item.cantidad, 0)}
                </span>
              )}
            </button>
            <button onClick={() => setContactoAbierto(true)} className="btn-hover" style={styles.botonContacto}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Contacto
            </button>
            <button onClick={() => navigate('/admin/login')} className="btn-hover" style={styles.botonAdmin}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </svg>
              Admin
            </button>
        </div>

      <div className="contenido-tienda" style={styles.contenido}>
        {/* Sidebar categorías */}
        <div className="sidebar-tienda" style={styles.sidebar}>
          <h3 style={styles.categoriaTitulo}>CATEGORÍAS</h3>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className="btn-categoria categoria-boton"
              style={{
                ...styles.categoriaBoton,
                backgroundColor: categoriaActiva === cat ? '#9701df' : 'transparent',
                color: 'white',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Productos */}
        <div style={styles.productos}>
          <p style={styles.contador}>
            Mostrando {productosFiltrados.length} de {productos.length} productos
          </p>
          {cargando ? (
  <div className="grid-productos" style={styles.grid}>
    {[...Array(8)].map((_, i) => (
      <div key={i} style={styles.tarjeta}>
        <div className="skeleton" style={{ height: '150px', marginBottom: '12px' }}></div>
        <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '8px' }}></div>
        <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: '12px' }}></div>
        <div className="skeleton" style={{ height: '36px' }}></div>
      </div>
    ))}
  </div>
) : productosFiltrados.length === 0 ? (
  <p style={styles.vacio}>No hay productos disponibles</p>
) : (
  <div className="grid-productos" key={categoriaActiva + orden} style={styles.grid}>
              {productosFiltrados.map((p, i) => {
                const itemEnCarrito = carrito.find((item) => item.id === p.id);
                const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
                const stockAgotado = cantidadEnCarrito >= p.cantidad || p.cantidad <= 0;
                const stockRestante = p.cantidad - cantidadEnCarrito;

                return (
                  <div key={p.id} className="tarjeta-producto" style={{
                    ...styles.tarjeta,
                    opacity: p.cantidad <= 0 ? 0.7 : 1,
                    animationDelay: `${i * 0.07}s`,
                  }}>
                    
                    <div style={styles.imagenContainer}>
                        {p.imagen ? (
                            <img
                            src={`${import.meta.env.VITE_API_URL}${p.imagen}`}
                            alt={p.nombre}
                            style={styles.imagen}
                            />
                        ) : (
                            <span style={styles.imagenPlaceholder}>📦</span>
                        )}
                    </div>
                    <h4 style={styles.productoNombre}>{p.nombre}</h4>
                    <p style={styles.productoPrecio}>
                      B/. {parseFloat(p.precio).toFixed(2)}
                    </p>
                    <p style={{
                      ...styles.productoStock,
                      color: p.cantidad <= 0 ? '#ef4444' : '#666',
                      fontWeight: p.cantidad <= 0 ? 'bold' : 'normal',
                    }}>
                      {p.cantidad <= 0
                        ? '¡Agotado!'
                        : `Stock: ${stockRestante}`}
                    </p>
                    <span style={{
                        ...styles.badgeCategoria,
                        backgroundColor: coloresCategorias[p.categoria]?.fondo || '#f3e8ff',
                        color: coloresCategorias[p.categoria]?.texto || '#6d28d9',
                      }}>
                        {p.categoria}
                      </span>
                    {p.descripcion && (
                    <p style={styles.productoDescripcion}>{p.descripcion}</p>
                    )}
                    <button
                      onClick={() => agregarAlCarrito(p)}
                      disabled={stockAgotado}
                      className="btn-añadir"
                      style={{
                        ...styles.botonAnadir,
                        width: '100%',
                        backgroundColor: stockAgotado ? '#ccc' : '#9701df',
                        cursor: stockAgotado ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {stockAgotado ? 'Sin stock' : 'Añadir'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Carrito */}
        <Carrito
            carrito={carrito}
            vaciarCarrito={vaciarCarrito}
            quitarDelCarrito={quitarDelCarrito}
            recargarProductos={cargarProductos}
            abierto={carritoAbierto}
            cerrarCarrito={() => setCarritoAbierto(false)}
          />
      </div>
    <Contacto
      abierto={contactoAbierto}
      cerrar={() => setContactoAbierto(false)}
    />
    <Footer />
  </div>
</>
);
}

const styles = {
  container: { backgroundColor: '#cccdd1', display: 'flex',
  flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#383838',
  padding: '12px 24px', position: 'sticky', top: 0, zIndex: 100 },
  logo: { color: 'white', margin: 0, fontSize: '25px', minWidth: '150px' },
  buscador: { flex: 1, backgroundColor: '#e8d4ece3', padding: '10px 16px', borderRadius: '6px', border: '2px solid transparent',
  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #ffc7fc, #9701df, #ffc7fc, #9701df, #ffc7fc)',
  backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box',
    fontSize: '14px' },
    badgeCarrito: {
  position: 'absolute',
  top: '-6px',
  right: '-6px',
  backgroundColor: '#ef4444',
  color: 'white',
  borderRadius: '50%',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '11px',
  fontWeight: 'bold',
  border: '2px solid #383838',
},
    contador: { fontSize: '14px', color: '#55004a', marginBottom: '12px', marginTop: 0 },
    selectOrden: {backgroundColor: '#e8d4ece3', padding: '6px 5px', borderRadius: '6px', border: '2px solid transparent',
  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #ffc7fc, #9701df, #ffc7fc, #9701df, #ffc7fc)',
  backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box',
    fontSize: '14px' },
    notificacion: { position: 'fixed', bottom: '30px', left: '50%',
  transform: 'translateX(-50%)', backgroundColor: '#4b1d48',
  color: 'white', padding: '14px 28px', borderRadius: '8px', fontWeight: 'bold',
  fontSize: '14px', zIndex: 2000, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  animation: 'fadeInOut 2s ease-in-out' },
   botonCarrito: { padding: '5.5px 17px', backgroundColor: '#762d78', color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
  position: 'relative', display: 'flex', alignItems: 'center' },
botonContacto: { padding: '7px 15px', backgroundColor: '#762d78', color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
  display: 'flex', alignItems: 'center' },
botonAdmin: { padding: '7px 17px', backgroundColor: '#762d78', color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
  display: 'flex', alignItems: 'center' },
  contenido: { display: 'flex', gap: '0' },
  sidebar: { width: '160px', backgroundColor: '#3a3343', padding: '20px 12px',
  borderRight: '1px solid #4a4258', flexShrink: 0 },
categoriaTitulo: { fontSize: '13px', fontWeight: 'bold', color: '#c4b5fd',
  marginBottom: '12px', marginTop: 0 },
categoriaBoton: { display: 'block', width: '100%', padding: '10px 12px',
  marginBottom: '8px', border: '1px solid #4a4258', borderRadius: '6px',
  cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: 'white',
  backgroundColor: 'transparent' },
  badgeCategoria: {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '11px',
  fontWeight: 'bold',
  marginBottom: '8px',
},
  productos: { flex: 1, padding: '20px', overflowY: 'auto' },
  productoDescripcion: { margin: '0 0 12px', fontSize: '12px', color: '#888', fontStyle: 'italic' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px' },
  tarjeta: { backgroundColor: 'white', borderRadius: '10px', padding: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '2px solid transparent',
  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #ffc7fc, #9701df, #ffc7fc, #9701df, #ffc7fc)',
  backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' },
  imagenContainer: { height: '150px', backgroundColor: '#f9fafb', borderRadius: '8px',
  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
  overflow: 'hidden' },
    imagen: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' },
  imagenPlaceholder: { fontSize: '40px' },
  productoNombre: { margin: '0 0 6px', fontSize: '15px', fontWeight: 'bold' },
  productoPrecio: { margin: '0 0 4px', color: '#9701df', fontWeight: 'bold' },
  productoStock: { margin: '0 0 4px', fontSize: '13px' },
  productoCategoria: { margin: '0 0 12px', fontSize: '13px', color: '#666' },
  botonAnadir: { flex: 1, padding: '8px', color: 'white', border: 'none',
  borderRadius: '6px', fontSize: '13px' },  
  vacio: { textAlign: 'center', color: '#999', marginTop: '40px' },
  
};


export default Tienda;