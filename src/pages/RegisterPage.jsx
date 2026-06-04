import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";

export default function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
      });
      setLoading(false);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }
    }, 800);
  };

  return (
    <div className="page-container">
      <Breadcrumbs />

      <div className="auth-card auth-card--wide">
        <div className="auth-card-header">
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Registra tus datos para una experiencia personalizada</p>
        </div>

        {error && (
          <div className="auth-error">
            <svg className="auth-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre Completo *</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} className="form-input" placeholder="Juan Pérez" id="register-name" />
            </div>
            <div className="form-group">
              <label className="form-label">Correo Electrónico *</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} className="form-input" placeholder="tu@correo.com" id="register-email" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contraseña *</label>
              <input type="password" name="password" required value={form.password} onChange={handleChange} className="form-input" placeholder="Mínimo 6 caracteres" id="register-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar Contraseña *</label>
              <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} className="form-input" placeholder="Repetir contraseña" id="register-confirm" />
            </div>
          </div>

          <div className="form-divider">
            <span>Datos opcionales (puedes agregarlos después)</span>
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="(614) 555-1234" id="register-phone" />
          </div>

          <div className="form-group">
            <label className="form-label">Dirección de Envío</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} className="form-input" placeholder="Calle, número, colonia, ciudad" id="register-address" />
          </div>

          <button type="submit" className={`btn-primary-lg btn-full ${loading ? "btn-loading" : ""}`} disabled={loading} id="register-submit">
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}
