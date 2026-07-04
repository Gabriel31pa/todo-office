import { useState, useEffect } from 'react';

const slides = [
  {
    icono: '🏪',
    titulo: '¿Quiénes somos?',
    contenido: 'TODO OFFICE es una tienda especializada en artículos de oficina y papelería, fundada con la visión de ofrecer productos de calidad a precios accesibles. Somos un equipo comprometido con brindarte la mejor experiencia de compra, tanto en línea como en persona.',
    color: '#9701df',
  },
  {
    icono: '🛍️',
    titulo: '¿Qué vendemos?',
    contenido: 'Contamos con una amplia variedad de productos en tres categorías principales:',
    lista: [
      '🖊️ Papelería — bolígrafos, marcadores, blocks, correctores y más',
      '💻 Tecnología — impresoras, cartuchos, teclados y accesorios',
      '🗂️ Oficina — engrapadoras, dispensadores, organizadores y más',
    ],
    color: '#762d78',
  },
  {
    icono: '🎯',
    titulo: '¿Qué buscamos?',
    contenido: 'En TODO OFFICE buscamos ser el aliado #1 de cada oficina, estudiante y profesional. Nuestra misión es facilitar el acceso a productos esenciales con rapidez, calidad y un servicio al cliente excepcional. ¡Tu productividad es nuestra prioridad!',
    color: '#383838',
  },
];

function BienvenidaModal({ abierto, cerrar }) {
  const [slideActual, setSlideActual] = useState(0);
  const [cerrando, setCerrando] = useState(false);

  useEffect(() => {
    if (abierto) setSlideActual(0);
  }, [abierto]);

  const siguiente = () => {
    if (slideActual < slides.length - 1) setSlideActual(slideActual + 1);
  };

  const anterior = () => {
    if (slideActual > 0) setSlideActual(slideActual - 1);
  };

  const handleCerrar = () => {
    setCerrando(true);
    setTimeout(() => {
      setCerrando(false);
      cerrar();
    }, 250);
  };

  if (!abierto) return null;

  const slide = slides[slideActual];

  return (
    <div
      style={{ ...styles.overlay, animation: cerrando ? 'fadeOut 0.25s ease-in' : 'fadeIn 0.3s ease-out' }}
      onClick={handleCerrar}
    >
      <div
        style={{ ...styles.modal, animation: cerrando ? 'desapareceModalContacto 0.25s ease-in' : 'apareceModalContacto 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleCerrar} style={styles.cerrar}>✕</button>

        {/* Slide */}
        <div style={styles.slideContainer}>
          <div style={{ ...styles.iconoContainer, backgroundColor: slide.color }}>
            <span style={styles.icono}>{slide.icono}</span>
          </div>
          <h2 style={{ ...styles.titulo, color: slide.color }}>{slide.titulo}</h2>
          <p style={styles.contenido}>{slide.contenido}</p>
          {slide.lista && (
            <ul style={styles.lista}>
              {slide.lista.map((item, i) => (
                <li key={i} style={styles.listaItem}>{item}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Controles del carrusel */}
        <div style={styles.controles}>
          <button
            onClick={anterior}
            disabled={slideActual === 0}
            style={{
              ...styles.botonNav,
              opacity: slideActual === 0 ? 0.3 : 1,
              cursor: slideActual === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ←
          </button>

          {/* Indicadores de puntos */}
          <div style={styles.puntos}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideActual(i)}
                style={{
                  ...styles.punto,
                  backgroundColor: i === slideActual ? '#9701df' : '#ddd',
                  transform: i === slideActual ? 'scale(1.3)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          <button
            onClick={siguiente}
            disabled={slideActual === slides.length - 1}
            style={{
              ...styles.botonNav,
              opacity: slideActual === slides.length - 1 ? 0.3 : 1,
              cursor: slideActual === slides.length - 1 ? 'not-allowed' : 'pointer',
            }}
          >
            →
          </button>
        </div>

        {/* Botón de cerrar en el último slide */}
        {slideActual === slides.length - 1 && (
          <button onClick={handleCerrar} style={styles.botonEntrar}>
            ¡Entrar a la tienda!
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 2000, padding: '20px' },
  modal: { backgroundColor: 'white', padding: '40px 32px 28px', borderRadius: '16px',
    width: '480px', maxWidth: '90vw', position: 'relative', boxSizing: 'border-box',
    border: '2px solid transparent',
    backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #9701df, #383838)',
    backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' },
  cerrar: { position: 'absolute', top: '12px', right: '12px', background: 'none',
    border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666' },
  slideContainer: { textAlign: 'center', minHeight: '220px', display: 'flex',
    flexDirection: 'column', alignItems: 'center' },
  iconoContainer: { width: '70px', height: '70px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' },
  icono: { fontSize: '32px' },
  titulo: { fontSize: '22px', fontWeight: 'bold', margin: '0 0 12px' },
  contenido: { fontSize: '14px', color: '#555', lineHeight: '1.6', margin: '0 0 12px' },
  lista: { textAlign: 'left', padding: '0 0 0 20px', margin: 0 },
  listaItem: { fontSize: '13px', color: '#555', marginBottom: '8px', lineHeight: '1.5' },
  controles: { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: '24px' },
  botonNav: { background: 'none', border: '2px solid #9701df', color: '#9701df',
    width: '36px', height: '36px', borderRadius: '50%', fontSize: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center' },
  puntos: { display: 'flex', gap: '8px' },
  punto: { width: '10px', height: '10px', borderRadius: '50%', border: 'none',
    cursor: 'pointer', transition: 'all 0.2s ease', padding: 0 },
  botonEntrar: { width: '100%', padding: '12px', backgroundColor: '#9701df', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
    fontSize: '15px', marginTop: '16px' },
};

export default BienvenidaModal;