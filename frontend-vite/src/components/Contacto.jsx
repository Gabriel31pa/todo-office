import { useState } from 'react';
import axios from 'axios';
import '../App.css';

function Contacto({ abierto, cerrar }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [cerrando, setCerrando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contacto', {
        nombre,
        correo,
        mensaje,
      });
      setEnviado(true);
      setNombre('');
      setCorreo('');
      setMensaje('');
    } catch (err) {
      setError('Error al enviar el mensaje. Intenta de nuevo.');
    }
  };

  const handleCerrar = () => {
    setCerrando(true);
    setTimeout(() => {
      setCerrando(false);
      setEnviado(false);
      setError('');
      cerrar();
    }, 250);
  };

  if (!abierto) return null;

  return (
    <div
      style={{ ...styles.overlay, animation: cerrando ? 'fadeOut 0.25s ease-in' : 'fadeIn 0.3s ease-out' }}
      onClick={handleCerrar}
    >
      <div
        style={{
          ...styles.modal,
          animation: cerrando ? 'desapareceModalContacto 0.25s ease-in' : 'apareceModalContacto 0.3s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleCerrar} style={styles.cerrar}>✕</button>
        <h2 style={styles.titulo}>📞 Contáctanos</h2>

        <div style={styles.infoFija}>
          <p style={styles.infoItem}>📍 Ciudad de Panamá, Panamá</p>
          <p style={styles.infoItem}>📧 todooffice@gmail.com</p>
          <p style={styles.infoItem}>📱 +507 6123-7890</p>
        </div>

        <hr style={styles.linea} />

        {enviado ? (
          <div style={styles.exito}>
            <p style={styles.exitoTexto}>✓ ¡Mensaje enviado con éxito!</p>
            <p style={styles.exitoSubtexto}>Te responderemos pronto.</p>
            <button className="btn-hover" onClick={handleCerrar} style={styles.botonCerrarExito}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={styles.formTitulo}>Envíanos un mensaje</h3>
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.campo}>
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.campo}>
              <label>Correo:</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.campo}>
              <label>Mensaje:</label>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                style={styles.textarea}
                rows={4}
                required
              />
            </div>
            <button type="submit" className="btn-hover" style={styles.botonEnviar}>
              Enviar Mensaje
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '32px', borderRadius: '10px',
  width: '400px', maxHeight: '90vh', overflowY: 'auto', position: 'relative',
  border: '2px solid transparent',
  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #ffc7fc, #9701df, #ffc7fc, #9701df, #ffc7fc)',
  backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' },
  cerrar: { position: 'absolute', top: '12px', right: '12px', background: 'none',
    border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666' },
  titulo: { textAlign: 'center', color: '#762d78', marginTop: 0, marginBottom: '20px' },
  infoFija: { backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' },
  infoItem: { margin: '8px 0', fontSize: '14px', color: '#333' },
  linea: { border: 'none', borderTop: '1px solid #eee', margin: '20px 0' },
  formTitulo: { fontSize: '15px', marginBottom: '12px', color: '#333' },
  campo: { marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '6px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  textarea: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px',
    resize: 'vertical' },
  botonEnviar: { width: '100%', padding: '12px', backgroundColor: '#9701df', color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  error: { color: '#ef4444', fontSize: '13px', textAlign: 'center', marginBottom: '12px' },
  exito: { textAlign: 'center', padding: '20px 0' },
  exitoTexto: { color: '#9701df', fontWeight: 'bold', fontSize: '16px' },
  exitoSubtexto: { color: '#666', fontSize: '13px' },
  botonCerrarExito: { padding: '10px 24px', backgroundColor: '#9701df', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px' },
};

export default Contacto;