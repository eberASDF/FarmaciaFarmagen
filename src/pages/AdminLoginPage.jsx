import { useEffect, useState } from "react";
import { ArrowLeft, LockKeyhole, LogIn, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logoFarmaGen from "../assets/logo.jpg";

export default function AdminLoginPage() {
  const { loginAdmin, user } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") navigate("/admin", { replace: true });
  }, [navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginAdmin(email.trim(), password);
      setLoading(false);
      if (result.success) navigate("/admin", { replace: true });
      else setError(result.message);
    } catch (error) {
      console.error("Error en formulario de acceso admin:", error);
      setLoading(false);
      setError("No se pudo iniciar sesion como administrador.");
    }
  };

  return (
    <main className="admin-login-page">
      <Link to="/" className="admin-login-back">
        <ArrowLeft aria-hidden="true" />
        Volver a la tienda
      </Link>

      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-header">
          <span className="admin-login-logo"><img src={logoFarmaGen} alt="Farmacia FarmaGen" className="admin-login-logo-img" /></span>
          <p className="admin-login-kicker">Área privada</p>
          <h1 className="admin-login-title" id="admin-login-title">Acceso administrativo</h1>
          <p className="admin-login-subtitle">Gestiona Farmacia FarmaGen desde un solo lugar.</p>
        </div>

        {error && <div className="admin-login-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label className="admin-login-label" htmlFor="admin-login-email">Correo administrativo</label>
            <div className="admin-login-control">
              <Mail aria-hidden="true" />
              <input
                type="email"
                required
                maxLength={100}
                value={email}
                onChange={(event) => setEmail(event.target.value.slice(0, 100))}
                className="admin-login-input"
                placeholder="Ingresa tu correo"
                id="admin-login-email"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label className="admin-login-label" htmlFor="admin-login-password">Contraseña</label>
            <div className="admin-login-control">
              <LockKeyhole aria-hidden="true" />
              <input
                type="password"
                required
                maxLength={100}
                value={password}
                onChange={(event) => setPassword(event.target.value.slice(0, 100))}
                className="admin-login-input"
                placeholder="Ingresa tu contraseña"
                id="admin-login-password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading} id="admin-login-submit">
            {loading ? <span className="admin-login-spinner" /> : <LogIn aria-hidden="true" />}
            {loading ? "Verificando acceso..." : "Ingresar al panel"}
          </button>
        </form>

        <div className="admin-login-footer">
          <ShieldCheck aria-hidden="true" />
          <span>Acceso exclusivo para personal autorizado</span>
        </div>
      </section>
    </main>
  );
}
