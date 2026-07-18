import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { checkActionCode, confirmPasswordReset } from "firebase/auth";
import { KeyRound } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import { auth } from "../firebase/config";
import logoFarmaGen from "../assets/logo.jpg";
import { FORM_LIMITS, notifyLimitReached } from "../utils/formLimits";

const invalidResetCode = "INVALID_RESET_CODE";
const processedResetTitle = "Solicitud de restablecimiento procesada";
const processedResetMessage = "Si tu contraseña ya fue actualizada, vuelve a iniciar sesión. Si aún no puedes entrar, solicita un nuevo enlace.";
const successResetMessage = "Contraseña actualizada correctamente. Ya puedes iniciar sesión.";

function getFirebaseResetError(error) {
  if (
    error.code === "auth/expired-action-code" ||
    error.code === "auth/invalid-action-code" ||
    error.code === "auth/user-disabled" ||
    error.code === "auth/user-not-found"
  ) {
    return invalidResetCode;
  }
  if (error.code === "auth/weak-password") {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  return error.message || "No se pudo actualizar la contraseña. Intenta de nuevo.";
}

export default function ResetPasswordPage() {
  const location = useLocation();
  const [status, setStatus] = useState("checking");
  const [oobCode, setOobCode] = useState("");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validateResetLink = async () => {
      const params = new URLSearchParams(location.search);
      const mode = params.get("mode");
      const code = params.get("oobCode");

      if (mode !== "resetPassword" || !code) {
        setStatus("invalid");
        return;
      }

      try {
        await checkActionCode(auth, code);
        setOobCode(code);
        setStatus("ready");
      } catch (error) {
        console.error("Error validando enlace de restablecimiento:", error);
        setStatus("invalid");
      }
    };

    validateResetLink();
  }, [location.search]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    notifyLimitReached({ fieldName: name, value, limit: FORM_LIMITS.password, notify: setError });
    setForm((prev) => ({ ...prev, [name]: value.slice(0, FORM_LIMITS.password) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, form.password);
      setStatus("success");
    } catch (error) {
      console.error("Error confirmando nueva contraseña:", error);
      const message = getFirebaseResetError(error);
      if (message === invalidResetCode) {
        setStatus("invalid");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isChecking = status === "checking";
  const isInvalid = status === "invalid";
  const isSuccess = status === "success";
  const isReady = status === "ready";

  return (
    <div className="page-container auth-page auth-page--login">
      <Breadcrumbs />

      <section className="auth-layout">
        <aside className="auth-info-panel">
          <img src={logoFarmaGen} alt="" />
          <span>Farmacia FarmaGen</span>
          <h2>Actualiza tu contraseña de forma segura</h2>
          <p>Este formulario solo funciona con un enlace válido enviado por Firebase.</p>
        </aside>

        <div className="auth-card">
          <div className="auth-card-header">
            <img src={logoFarmaGen} alt="Farmacia FarmaGen" className="auth-logo-img" />
            <h1 className="auth-title">{isInvalid ? processedResetTitle : "Restablecer contraseña"}</h1>
            <p className="auth-subtitle">
              {isChecking && "Estamos validando tu enlace."}
              {isReady && "Escribe tu nueva contraseña."}
              {isInvalid && processedResetMessage}
              {isSuccess && successResetMessage}
            </p>
          </div>

          {error && !isInvalid && <div className="auth-error" role="alert">{error}</div>}
          {isSuccess && (
            <div className="notification notification--success" role="status">
              {successResetMessage}
            </div>
          )}

          {isChecking && (
            <div className="auth-loading-state">
              <KeyRound aria-hidden="true" />
              <span>Validando enlace...</span>
            </div>
          )}

          {isReady && (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="reset-password-new">Nueva contraseña</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  maxLength={FORM_LIMITS.password}
                  value={form.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  id="reset-password-new"
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reset-password-confirm">Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  maxLength={FORM_LIMITS.password}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Repetir contraseña"
                  id="reset-password-confirm"
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className={`btn-primary-lg btn-full ${loading ? "btn-loading" : ""}`} disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </form>
          )}

          {(isInvalid || isSuccess) && (
            <div className="auth-reset-actions">
              <Link to="/login" className="btn-primary-lg btn-full">Ir a Inicio de Sesión</Link>
              <Link to="/" className="btn-outline-lg btn-full">Ir a Home</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
