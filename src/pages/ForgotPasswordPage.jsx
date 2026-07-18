import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import { auth } from "../firebase/config";
import logoFarmaGen from "../assets/logo.jpg";
import { FORM_LIMITS, notifyLimitReached } from "../utils/formLimits";

const neutralPasswordResetMessage = "Si el correo está registrado, te enviaremos un enlace para restablecer tu contraseña.";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const correo = email.trim().toLowerCase();
    if (!correo) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}${import.meta.env.BASE_URL}restablecer-contrasena`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, correo, actionCodeSettings);
      setSuccess(neutralPasswordResetMessage);
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
      setSuccess(neutralPasswordResetMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container auth-page auth-page--login">
      <Breadcrumbs />

      <section className="auth-layout">
        <aside className="auth-info-panel">
          <img src={logoFarmaGen} alt="" />
          <span>Farmacia FarmaGen</span>
          <h2>Recupera el acceso a tu cuenta</h2>
          <p>Escribe tu correo y, si está registrado, recibirás un enlace seguro.</p>
        </aside>

        <div className="auth-card">
          <div className="auth-card-header">
            <img src={logoFarmaGen} alt="Farmacia FarmaGen" className="auth-logo-img" />
            <h1 className="auth-title">Recuperar contraseña</h1>
            <p className="auth-subtitle">Ingresa el correo registrado en Farmacia FarmaGen</p>
          </div>

          {error && <div className="auth-error" role="alert">{error}</div>}
          {success && <div className="notification notification--success" role="status">{success}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-password-email">Correo Electrónico</label>
              <div className="auth-input-with-icon">
                <Mail aria-hidden="true" />
                <input
                  type="email"
                  required
                  maxLength={FORM_LIMITS.email}
                  value={email}
                  onChange={(event) => {
                    notifyLimitReached({ fieldName: "email", value: event.target.value, limit: FORM_LIMITS.email, notify: setError });
                    setEmail(event.target.value.slice(0, FORM_LIMITS.email));
                  }}
                  className="form-input"
                  placeholder="tu@correo.com"
                  id="forgot-password-email"
                  autoComplete="email"
                />
              </div>
            </div>

            <button type="submit" className={`btn-primary-lg btn-full ${loading ? "btn-loading" : ""}`} disabled={loading}>
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>

          <div className="auth-divider">
            <span>¿Ya tienes acceso?</span>
          </div>

          <Link to="/login" className="btn-outline-lg btn-full">
            Ir a Iniciar Sesión
          </Link>
        </div>
      </section>
    </div>
  );
}
