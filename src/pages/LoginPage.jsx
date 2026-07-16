import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";
import logoFarmaGen from "../assets/logo.jpg";

export default function LoginPage() {
  const { loginUser, resendVerificationEmail } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  const initialMessage = location.state?.message || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialMessage);
  const [success, setSuccess] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPendingVerification(false);
    setLoading(true);

    const result = await loginUser(email, password);
    setLoading(false);
    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.message);
      setPendingVerification(Boolean(result.requiresEmailVerification));
    }
  };

  const handleResendVerification = async () => {
    setError("");
    setSuccess("");
    setResending(true);
    const result = await resendVerificationEmail(email, password);
    setResending(false);
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };
  return (
    <div className="page-container auth-page auth-page--login">
      <Breadcrumbs />

      <section className="auth-layout">
        <aside className="auth-info-panel">
          <img src={logoFarmaGen} alt="" />
          <span>Farmacia FarmaGen</span>
          <h2>Accede a tus pedidos y tickets</h2>
          <p>Inicia sesion para confirmar pedidos, consultar tu perfil y recoger en sucursal.</p>
        </aside>

      <div className="auth-card">
        <div className="auth-card-header">
          <img src={logoFarmaGen} alt="Farmacia FarmaGen" className="auth-logo-img" />
          <h1 className="auth-title">Bienvenido</h1>
          <p className="auth-subtitle">Inicia sesión en Farmacia FarmaGen</p>
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
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              required
              maxLength={100}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="tu@correo.com"
              id="login-email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              required
              maxLength={100}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              id="login-password"
            />
          </div>

          <button
            type="submit"
            className={`btn-primary-lg btn-full ${loading ? "btn-loading" : ""}`}
            disabled={loading || resending}
            id="login-submit"
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>

          {pendingVerification && (
            <button
              type="button"
              className="btn-outline-lg btn-full"
              onClick={handleResendVerification}
              disabled={loading || resending}
            >
              {resending ? "Reenviando correo..." : "Reenviar correo de verificacion"}
            </button>
          )}
        </form>

        <div className="auth-divider">
          <span>¿No tienes cuenta?</span>
        </div>

        <Link to="/register" className="btn-outline-lg btn-full" id="go-to-register">
          Crear Cuenta
        </Link>

      </div>
      </section>
    </div>
  );
}
