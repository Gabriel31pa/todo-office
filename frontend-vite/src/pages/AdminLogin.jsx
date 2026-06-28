import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../App.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cerrando, setCerrando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      login(res.data.usuario, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  const handleCerrar = () => {
    setCerrando(true);
    setTimeout(() => navigate('/'), 250);
  };

  return (
    <>
      <div
        style={{ ...styles.overlay, animation: cerrando ? 'fadeOut 0.25s ease-in' : 'fadeIn 0.3s ease-out' }}
        onClick={handleCerrar}
      />
      <div style={{
        ...styles.modal,
        animation: cerrando ? 'desapareceModal 0.25s ease-in' : 'apareceModal 0.3s ease-out',
      }}>
        <button onClick={handleCerrar} style={styles.cerrar}>✕</button>
        <h2 style={styles.titulo}>Acceso de Administrador</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.campo}>
            <label>Usuario:</label>
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input} required />
          </div>
          <div style={styles.campo}>
            <label>PIN:</label>
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input} required />
          </div>
          <button type="submit" className="btn-hover" style={styles.boton}>Ingresar</button>
        </form>
      </div>
    </>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#cccdd1', zIndex: 999, cursor: 'pointer' },
  modal: { position: 'fixed', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white', padding: '40px', borderRadius: '10px',
  width: '360px', zIndex: 1000,
  border: '2px solid transparent',
  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #9701df, #383838)',
  backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' },
  cerrar: { position: 'absolute', top: '12px', right: '12px', background: 'none',
    border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666' },
  titulo: { textAlign: 'center', color: '#762d78', marginTop: 0 },
  campo: { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  boton: { width: '100%', padding: '12px', backgroundColor: '#9701df', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold',
    fontSize: '15px' },
  error: { color: 'red', textAlign: 'center', marginBottom: '12px' },
};

export default AdminLogin;