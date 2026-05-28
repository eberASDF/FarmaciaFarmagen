import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-logo">
            <svg className="footer-logo-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
            </svg>
            <span>Farmacia El Desierto</span>
          </div>
          <p className="footer-desc">
            Tu farmacia de confianza con entrega a domicilio y atención personalizada en cada sucursal. Más de 15 años cuidando de tu salud.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Navegación</h4>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/products">Medicamentos</Link></li>
            <li><Link to="/branches">Sucursales</Link></li>
            <li><Link to="/login">Iniciar Sesión</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Categorías</h4>
          <ul className="footer-links">
            <li><Link to="/products">Analgesia</Link></li>
            <li><Link to="/products">Vitaminas</Link></li>
            <li><Link to="/products">Dermatología</Link></li>
            <li><Link to="/products">Cuidado Personal</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Atención al Cliente</h4>
          <p className="footer-contact-line">
            <svg viewBox="0 0 20 20" fill="currentColor" className="footer-contact-icon"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
            01-800-DESIERTO
          </p>
          <p className="footer-contact-line">
            <svg viewBox="0 0 20 20" fill="currentColor" className="footer-contact-icon"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
            Lunes a Domingo: 24 Horas
          </p>
          <p className="footer-contact-line">
            <svg viewBox="0 0 20 20" fill="currentColor" className="footer-contact-icon"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
            contacto@eldesierto.com
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Farmacia El Desierto. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
