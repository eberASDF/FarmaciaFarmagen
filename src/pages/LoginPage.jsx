import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simular delay de red
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        if (result.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(result.message);
      }
    }, 800);
  };

  return (
    <div className="page-container">
      <Breadcrumbs />

      <div className="auth-card">
        <div className="auth-card-header">
          <svg className="auth-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
          </svg>
          <h1 className="auth-title">Bienvenido</h1>
          <p className="auth-subtitle">Inicia sesión en Farmacia El Desierto</p>
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
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              required
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
            disabled={loading}
            id="login-submit"
          >
            {loading ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        <div className="auth-divider">
          <span>¿No tienes cuenta?</span>
        </div>

        <Link to="/register" className="btn-outline-lg btn-full" id="go-to-register">
          Crear Cuenta
        </Link>

        <div className="auth-hint">
          <p><strong>Admin:</strong> admin@farmacia.com / admin123</p>
          <p><strong>Cliente:</strong> Regístrate con cualquier correo</p>
        </div>
      </div>
    </div>
  );
}
