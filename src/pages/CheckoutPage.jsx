import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";
import { downloadPickupTicket } from "../utils/orderTicket";

export default function CheckoutPage() {
  const { cart, cartTotal, user, branches, placeOrder } = useApp();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const activeBranches = branches.filter(branch => branch.active !== false);
  const availableBranches = activeBranches.length
    ? activeBranches
    : [
        { id: "centro", name: "Sucursal Centro" },
        { id: "norte", name: "Sucursal Norte" },
        { id: "sur", name: "Sucursal Sur" },
      ];

  if (cart.length === 0 && !orderComplete) {
    return <Navigate to="/products" />;
  }

  if ((!user || !user.emailVerified) && !orderComplete) {
    return <Navigate to="/login" replace state={{ from: "/checkout", message: "Para proceder con tu compra necesitas iniciar sesion." }} />;
  }

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!selectedBranch) {
      setMessage("Selecciona una sucursal para recoger tu pedido.");
      return;
    }
    setProcessing(true);

    const result = await placeOrder(selectedBranch);
    setProcessing(false);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    setOrderComplete(result.order);
  };

  if (orderComplete) {
    return (
      <div className="page-container">
        <Breadcrumbs />
        <div className="checkout-success">
          <div className="checkout-success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="checkout-success-title">Pedido creado correctamente</h1>
          <p className="checkout-success-id">Pedido #{orderComplete.id}</p>
          <p className="checkout-success-text">
            Pedido creado correctamente. Puedes pasar a recogerlo en la sucursal seleccionada.
          </p>
          <p className="checkout-success-text">
            Sucursal: <strong>{orderComplete.sucursal}</strong>
          </p>
          <div className="checkout-success-total" style={{ marginBottom: "24px" }}>
            Total: <strong>${orderComplete.total.toFixed(2)}</strong>
          </div>
          <button
            onClick={() => downloadPickupTicket(orderComplete, branches)}
            className="btn-secondary-lg"
            style={{ width: "100%", marginBottom: "16px" }}
          >
            Descargar ticket
          </button>
          <button onClick={() => navigate("/")} className="btn-primary-lg" style={{ width: "100%" }}>
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Breadcrumbs />

      <h1 className="page-title">Confirmar pedido</h1>

      <div className="checkout-layout">
        <div className="checkout-summary">
          <h2 className="checkout-section-title">Resumen del Pedido</h2>
          <div className="checkout-items">
            {cart.map(item => (
              <div key={item.id} className="checkout-item">
                <img src={item.image} alt={item.name} className="checkout-item-img" />
                <div className="checkout-item-info">
                  <h4>{item.name}</h4>
                  <p>Cant: {item.quantity} x ${item.price.toFixed(2)}</p>
                </div>
                <span className="checkout-item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-totals">
            <div className="checkout-totals-row checkout-totals-row--total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="checkout-form">
          <h2 className="checkout-section-title">Recoger en sucursal</h2>
          <div className="checkout-payment-note">
            Tu pedido quedara registrado para recogerlo directamente en la sucursal.
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pickup-branch">Sucursal para recoger</label>
            <select
              id="pickup-branch"
              className="form-select"
              value={selectedBranch}
              onChange={(event) => setSelectedBranch(event.target.value)}
              required
            >
              <option value="">Selecciona una sucursal</option>
              {availableBranches.map((branch) => (
                <option key={branch.id || branch.name} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {message && <p className="checkout-payment-error">{message}</p>}

          <button
            type="submit"
            className={`btn-primary-lg btn-full ${processing ? "btn-loading" : ""}`}
            disabled={processing}
            id="confirm-order"
          >
            {processing ? "Registrando pedido..." : `Confirmar pedido - $${cartTotal.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
