import { useState } from "react";
import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";
import logoFarmaGen from "../assets/logo.jpg";

export default function RegisterPage() {
  const { register } = useApp();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const limits = { name: 50, email: 100, password: 100, confirmPassword: 100, phone: 100 };
    const limit = limits[e.target.name] || 100;
    if (e.target.value.length > limit) {
      setError(e.target.name === "name" ? "El nombre no puede superar 50 caracteres" : "Este campo no puede superar 100 caracteres");
      return;
    }
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Ingresa tu nombre completo.");
      return;
    }
    if (!form.email.trim()) {
      setError("Ingresa tu correo electronico.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
    });
    setLoading(false);

    if (result.success) {
      setSuccess(result.message || "Cuenta creada correctamente.");
    } else {
      setError(result.message);
    }
  };
  return (
    <div className="page-container auth-page auth-page--register">
      <Breadcrumbs />

      <section className="auth-layout auth-layout--wide">
        <aside className="auth-info-panel">
          <img src={logoFarmaGen} alt="" />
          <span>Cuenta FarmaGen</span>
          <h2>Compra mas rapido y consulta tus pedidos</h2>
          <p>Tu telefono es opcional. Puedes completarlo despues desde tu perfil.</p>
        </aside>

      <div className="auth-card auth-card--wide">
        <div className="auth-card-header">
          <img src={logoFarmaGen} alt="Farmacia FarmaGen" className="auth-logo-img" />
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

        {success && (
          <div className="notification notification--success" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre Completo *</label>
              <input type="text" name="name" required maxLength={50} value={form.name} onChange={handleChange} className="form-input" placeholder="Juan Pérez" id="register-name" />
            </div>
            <div className="form-group">
              <label className="form-label">Correo Electrónico *</label>
              <input type="email" name="email" required maxLength={100} value={form.email} onChange={handleChange} className="form-input" placeholder="tu@correo.com" id="register-email" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contraseña *</label>
              <input type="password" name="password" required maxLength={100} value={form.password} onChange={handleChange} className="form-input" placeholder="Mínimo 6 caracteres" id="register-password" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirmar Contraseña *</label>
              <input type="password" name="confirmPassword" required maxLength={100} value={form.confirmPassword} onChange={handleChange} className="form-input" placeholder="Repetir contraseña" id="register-confirm" />
            </div>
          </div>

          <div className="form-divider">
            <span>Dato opcional (puedes agregarlo despues)</span>
          </div>

          <div className="form-group">
            <label className="form-label">Teléfono</label>
            <input type="tel" name="phone" maxLength={100} pattern="[0-9\s()+]*" value={form.phone} onChange={handleChange} className="form-input" placeholder="653 534 6587" id="register-phone" />
          </div>

          <button type="submit" className={`btn-primary-lg btn-full ${loading ? "btn-loading" : ""}`} disabled={loading || Boolean(success)} id="register-submit">
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>
      </div>
      </section>
    </div>
  );
}
