import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";

export default function CheckoutPage() {
  const { cart, cartTotal, branches, user, placeOrder } = useApp();
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState("domicilio");
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || "");
  const [address, setAddress] = useState(user?.address || "");
  const [cardNumber, setCardNumber] = useState(user?.cardNumber || "");
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  if (cart.length === 0 && !orderComplete) {
    return <Navigate to="/products" />;
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      const order = placeOrder(
        deliveryMethod,
        deliveryMethod === "sucursal" ? selectedBranch : null,
        deliveryMethod === "domicilio" ? address : ""
      );
      setOrderComplete(order);
      setProcessing(false);
    }, 1500);
  };

  const handleDownloadTicket = () => {
    if (!orderComplete) return;
    const branch = branches.find(b => b.id == orderComplete.branchId);
    
    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = 500;
    canvas.height = 650;
    const ctx = canvas.getContext("2d");
    
    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Outer border
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
    
    // Header Banner
    ctx.fillStyle = "#064e3b";
    ctx.fillRect(8, 8, canvas.width - 16, 80);
    
    // Header Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FARMACIA EL DESIERTO", canvas.width / 2, 42);
    ctx.font = "14px sans-serif";
    ctx.fillText("TICKET DE RECOGIDA EN SUCURSAL", canvas.width / 2, 65);
    
    // Ticket details layout
    ctx.textAlign = "left";
    ctx.fillStyle = "#111827";
    
    // Info Block
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("ID de Pedido:", 30, 120);
    ctx.fillText("Fecha:", 30, 142);
    ctx.fillText("Cliente:", 30, 164);
    ctx.fillText("Entrega en:", 30, 186);
    
    ctx.font = "13px sans-serif";
    ctx.fillText(orderComplete.id.toString(), 130, 120);
    ctx.fillText(orderComplete.date, 130, 142);
    ctx.fillText(`${orderComplete.userName || "Invitado"} (${orderComplete.user})`, 130, 164);
    ctx.fillText(branch ? branch.name : "Sucursal seleccionada", 130, 186);
    
    // Branch address info
    if (branch) {
      ctx.fillStyle = "#4b5563";
      ctx.font = "italic 11px sans-serif";
      ctx.fillText(branch.address, 30, 206);
      ctx.fillText(`Horario: ${branch.hours}`, 30, 222);
    }
    
    // Separator line
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 240);
    ctx.lineTo(canvas.width - 30, 240);
    ctx.stroke();
    
    // Products header
    ctx.fillStyle = "#064e3b";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("PRODUCTO", 35, 265);
    ctx.textAlign = "right";
    ctx.fillText("SUBTOTAL", canvas.width - 35, 265);
    
    // Products list
    ctx.textAlign = "left";
    ctx.fillStyle = "#111827";
    ctx.font = "13px sans-serif";
    
    let y = 295;
    orderComplete.items.forEach(item => {
      // Draw product name & qty
      ctx.fillText(`${item.name} (x${item.quantity})`, 35, y);
      
      // Draw subtotal
      ctx.textAlign = "right";
      ctx.fillText(`$${(item.price * item.quantity).toFixed(2)}`, canvas.width - 35, y);
      ctx.textAlign = "left";
      y += 24;
    });
    
    // Separator
    ctx.strokeStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.moveTo(30, y + 10);
    ctx.lineTo(canvas.width - 30, y + 10);
    ctx.stroke();
    
    // Total
    ctx.fillStyle = "#111827";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("TOTAL PAGADO", 35, y + 42);
    ctx.textAlign = "right";
    ctx.fillStyle = "#10b981";
    ctx.fillText(`$${orderComplete.total.toFixed(2)}`, canvas.width - 35, y + 42);
    
    // Footer message
    ctx.textAlign = "center";
    ctx.fillStyle = "#4b5563";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("PRESENTA ESTA IMAGEN EN LA SUCURSAL PARA RETIRAR TU COMPRA", canvas.width / 2, canvas.height - 45);
    ctx.font = "10px sans-serif";
    ctx.fillText("Gracias por confiar en Farmacia El Desierto.", canvas.width / 2, canvas.height - 25);
    
    // Download image
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `ticket-pedido-${orderComplete.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h1 className="checkout-success-title">¡Pedido Confirmado!</h1>
          <p className="checkout-success-id">Pedido #{orderComplete.id}</p>
          <p className="checkout-success-text">
            {orderComplete.deliveryMethod === "domicilio"
              ? "Tu pedido será enviado a tu domicilio en las próximas 2 horas."
              : `Tu pedido estará listo para recoger en ${branches.find(b => b.id == orderComplete.branchId)?.name || "la sucursal seleccionada"}.`}
          </p>
          <div className="checkout-success-total" style={{ marginBottom: '24px' }}>
            Total pagado: <strong>${orderComplete.total.toFixed(2)}</strong>
          </div>
          
          {orderComplete.deliveryMethod === "sucursal" && (
            <button onClick={handleDownloadTicket} className="btn-secondary-lg" style={{ marginBottom: '16px', width: '100%' }}>
              Descargar Ticket para Sucursal
            </button>
          )}

          <button onClick={() => navigate("/")} className="btn-primary-lg" style={{ width: '100%' }}>
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Breadcrumbs />

      <h1 className="page-title">Finalizar Compra</h1>

      <div className="checkout-layout">
        {/* Order Summary */}
        <div className="checkout-summary">
          <h2 className="checkout-section-title">Resumen del Pedido</h2>
          <div className="checkout-items">
            {cart.map(item => (
              <div key={item.id} className="checkout-item">
                <img src={item.image} alt={item.name} className="checkout-item-img" />
                <div className="checkout-item-info">
                  <h4>{item.name}</h4>
                  <p>Cant: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <span className="checkout-item-subtotal">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-totals">
            <div className="checkout-totals-row">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="checkout-totals-row">
              <span>Envío:</span>
              <span>{deliveryMethod === "domicilio" ? "$49.00" : "Gratis"}</span>
            </div>
            <div className="checkout-totals-row checkout-totals-row--total">
              <span>Total:</span>
              <span>${(cartTotal + (deliveryMethod === "domicilio" ? 49 : 0)).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="checkout-form">
          {/* Delivery Method */}
          <h2 className="checkout-section-title">Método de Entrega</h2>
          <div className="delivery-options">
            <button
              type="button"
              onClick={() => setDeliveryMethod("domicilio")}
              className={`delivery-option ${deliveryMethod === "domicilio" ? "delivery-option--active" : ""}`}
            >
              <svg className="delivery-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div>
                <strong>Envío a Domicilio</strong>
                <span className="delivery-option-price">$49.00</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryMethod("sucursal")}
              className={`delivery-option ${deliveryMethod === "sucursal" ? "delivery-option--active" : ""}`}
            >
              <svg className="delivery-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <strong>Recoger en Sucursal</strong>
                <span className="delivery-option-price">Gratis</span>
              </div>
            </button>
          </div>

          {deliveryMethod === "domicilio" && (
            <div className="form-group">
              <label className="form-label">Dirección de Envío</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
                placeholder="Calle, número, colonia, ciudad"
                id="checkout-address"
              />
            </div>
          )}

          {deliveryMethod === "sucursal" && (
            <div className="form-group">
              <label className="form-label">Selecciona Sucursal</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="form-select"
                id="checkout-branch"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} — {b.address}</option>
                ))}
              </select>
            </div>
          )}

          {/* Payment */}
          <h2 className="checkout-section-title">Datos de Pago</h2>
          <div className="form-group">
            <label className="form-label">Número de Tarjeta</label>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="form-input"
              placeholder="•••• •••• •••• ••••"
              id="checkout-card"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha de Exp.</label>
              <input type="text" required className="form-input" placeholder="MM/AA" id="checkout-exp" />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input type="text" required className="form-input" placeholder="•••" id="checkout-cvv" />
            </div>
          </div>

          <button
            type="submit"
            className={`btn-primary-lg btn-full ${processing ? "btn-loading" : ""}`}
            disabled={processing}
            id="confirm-order"
          >
            {processing ? "Procesando pago..." : `Confirmar Pedido — $${(cartTotal + (deliveryMethod === "domicilio" ? 49 : 0)).toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
