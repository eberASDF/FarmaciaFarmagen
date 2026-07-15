import { Link } from "react-router-dom";
import { Clock, Mail, Phone } from "lucide-react";
import logoFarmaGen from "../assets/logo.jpg";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-logo">
            <img src={logoFarmaGen} alt="Farmacia FarmaGen" className="footer-logo-img" />
            <span>Farmacia FarmaGen</span>
          </div>
          <p className="footer-desc">
            Tu farmacia de confianza con pedidos para recoger en sucursal y atencion personalizada.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Navegacion</h4>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/products">Medicamentos</Link></li>
            <li><Link to="/branches">Sucursales</Link></li>
            <li><Link to="/login">Iniciar sesion</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Categorias</h4>
          <ul className="footer-links">
            <li><Link to="/products">Analgesia</Link></li>
            <li><Link to="/products">Vitaminas</Link></li>
            <li><Link to="/products">Dermatologia</Link></li>
            <li><Link to="/products">Cuidado personal</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Atencion al cliente</h4>
          <p className="footer-contact-line">
            <Phone className="footer-contact-icon" aria-hidden="true" />
            653 534 6587
          </p>
          <p className="footer-contact-line">
            <Clock className="footer-contact-icon" aria-hidden="true" />
            <span>Lunes a sábado: 8 a.m. – 10 p.m.<br />Domingo: 9 a.m. – 9 p.m.</span>
          </p>
          <p className="footer-contact-line">
            <Mail className="footer-contact-icon" aria-hidden="true" />
            farma.gen@outlook.com
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>2026 Farmacia FarmaGen. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
