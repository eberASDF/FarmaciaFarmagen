import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Home, LoaderCircle, LogIn } from "lucide-react";
import { applyActionCode } from "firebase/auth";
import { auth } from "../firebase/config";
import logoFarmaGen from "../assets/logo.jpg";

export default function EmailVerificationPage() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");
      const oobCode = params.get("oobCode");
      const continueUrl = params.get("continueUrl");
      const lang = params.get("lang");
      void continueUrl;
      void lang;

      if (mode !== "verifyEmail" || !oobCode) {
        setStatus("error");
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

    verifyEmail();
  }, []);

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <main className="email-verification-page">
      <section className="email-verification-card" aria-labelledby="email-verification-title">
        <div className="email-verification-logo-wrap">
          <img src={logoFarmaGen} alt="Farmacia FarmaGen" className="email-verification-logo" />
        </div>
        <span className="email-verification-brand">Farmacia FarmaGen</span>

        <div className={`email-verification-icon ${isLoading ? "email-verification-icon--loading" : ""} ${!isSuccess && !isLoading ? "email-verification-icon--error" : ""}`}>
          {isLoading ? <LoaderCircle aria-hidden="true" /> : isSuccess ? <CheckCircle2 aria-hidden="true" /> : <AlertTriangle aria-hidden="true" />}
        </div>

        <h1 id="email-verification-title">
          {isLoading && "Verificando tu correo"}
          {isSuccess && "Correo verificado correctamente"}
          {!isSuccess && !isLoading && "El enlace no es valido o ya fue utilizado"}
        </h1>

        <p>
          {isLoading && "Estamos confirmando tu cuenta de Farmacia FarmaGen. Esto tomara solo un momento."}
          {isSuccess && "Tu correo fue confirmado. Ahora puedes iniciar sesion en tu cuenta."}
          {!isSuccess && !isLoading && "Puedes pedir otro correo de verificacion desde el inicio de sesion e intentarlo nuevamente."}
        </p>

        {!isLoading && (
          <div className="email-verification-actions">
            <Link to="/login" className="btn-primary-lg">
              <LogIn aria-hidden="true" />
              Ir a Iniciar Sesion
            </Link>
            <Link to="/" className="btn-outline-lg">
              <Home aria-hidden="true" />
              Ir al Inicio
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
