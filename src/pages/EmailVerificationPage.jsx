import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Home, LoaderCircle, LogIn } from "lucide-react";
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
        setStatus("processed");
        return;
      }

      try {
        await applyActionCode(auth, oobCode);
        setStatus("success");
      } catch {
        setStatus("processed");
      }
    };

    verifyEmail();
  }, []);

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isProcessed = status === "processed";

  return (
    <main className="email-verification-page email-verification-redesign">
      <aside className="email-verification-side">
        <img src={logoFarmaGen} alt="" />
        <span>Farmacia FarmaGen</span>
        <h2>Cuenta protegida para tus pedidos</h2>
        <p>La verificacion ayuda a mantener segura tu cuenta y tus tickets de pedido.</p>
      </aside>
      <section className="email-verification-card" aria-labelledby="email-verification-title">
        <div className="email-verification-logo-wrap">
          <img src={logoFarmaGen} alt="Farmacia FarmaGen" className="email-verification-logo" />
        </div>
        <span className="email-verification-brand">Farmacia FarmaGen</span>

        <div className={`email-verification-icon ${isLoading ? "email-verification-icon--loading" : ""}`}>
          {isLoading ? <LoaderCircle aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
        </div>

        <h1 id="email-verification-title">
          {isLoading && "Verificando tu correo"}
          {isSuccess && "Correo verificado correctamente"}
          {isProcessed && "Verificacion procesada"}
        </h1>

        <p>
          {isLoading && "Estamos confirmando tu cuenta de Farmacia FarmaGen. Esto tomara solo un momento."}
          {isSuccess && "Tu correo fue confirmado. Ahora puedes iniciar sesion en tu cuenta."}
          {isProcessed && "Si tu correo ya fue confirmado, vuelve a la pagina e inicia sesion."}
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
