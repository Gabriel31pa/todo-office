function Footer({ onVerBienvenida }) {
  const anioActual = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.contenido}>
        <div style={styles.columna}>
          <h3 style={styles.logo}>TODO OFFICE</h3>
          <p style={styles.descripcion}>
            Tu tienda de artículos de oficina y papelería.
          </p>
        </div>

        <div style={styles.columna}>
          <h4 style={styles.titulo}>CONTACTO</h4>
          <div style={styles.itemConIcono}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9701df" strokeWidth="2" style={styles.icono}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Ciudad de Panamá, Panamá</span>
          </div>
          <div style={styles.itemConIcono}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9701df" strokeWidth="2" style={styles.icono}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>+507 6123-7890</span>
          </div>
          <div style={styles.itemConIcono}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9701df" strokeWidth="2" style={styles.icono}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>todooffice@gmail.com</span>
          </div>
        </div>
      </div>

      <div style={styles.linea} />


    {onVerBienvenida && (
        <p style={styles.enlaceBienvenida}>
          <button onClick={onVerBienvenida} style={styles.botonBienvenida}>
            ¿Quiénes somos?
          </button>
        </p>
      )}

      <p style={styles.copyright}>
        © {anioActual} TODO OFFICE. Todos los derechos reservados.
      </p>
    </footer>
  );
}

const styles = {
  footer: { backgroundColor: '#1a1a1a', backgroundImage: 'linear-gradient(180deg, #1a1a1a, #0f0f0f)',
  color: 'white', padding: '10px 24px 6px' },
  contenido: { display: 'flex', flexWrap: 'wrap', gap: '40px', maxWidth: '900px',
    margin: '0 auto', justifyContent: 'space-between' },
  columna: { minWidth: '220px' },
  enlaceBienvenida: { textAlign: 'center', margin: '0 0 8px' },
botonBienvenida: { background: 'none', border: 'none', color: '#c084fc',
  cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' },
  logo: { margin: '0 0 8px', fontSize: '18px', color: '#c084fc', letterSpacing: '0.5px' },
  descripcion: { margin: 0, fontSize: '13px', color: '#999' },
  titulo: { margin: '0 0 14px', fontSize: '13px', color: '#fff', letterSpacing: '0.5px',
    fontWeight: 'bold' },
  itemConIcono: { display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '4px',
  fontSize: '11px', color: '#ccc' },
  icono: { flexShrink: 0, marginTop: '2px' },
  linea: { borderTop: '1px solid #2a2a2a', maxWidth: '900px', margin: '8px auto 6px' },
  copyright: { textAlign: 'center', fontSize: '12px', color: '#666', margin: 0 },
};

export default Footer;