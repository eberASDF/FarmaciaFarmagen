import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";

export default function AccountPage() {
  const { user, updateProfile, orders } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const userOrders = orders.filter(o => o.user === user.email);

  return (
    <div className="page-container">
      <Breadcrumbs />

      <h1 className="page-title">Mi Cuenta</h1>

      {saved && (
        <div className="notification notification--success">
          ✓ Datos actualizados correctamente
        </div>
      )}

      <div className="account-grid">
        {/* Profile Card */}
        <div className="account-card">
          <div className="account-card-header">
            <h2 className="account-card-title">Datos Personales</h2>
            <button onClick={() => setEditing(!editing)} className="account-edit-btn">
              {editing ? "Cancelar" : "Editar"}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="auth-form">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" name="name" value={form.name || ""} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input type="tel" name="phone" value={form.phone || ""} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input type="text" name="address" value={form.address || ""} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Tarjeta</label>
                <input type="text" name="cardNumber" value={form.cardNumber || ""} onChange={handleChange} className="form-input" placeholder="•••• •••• •••• ••••" />
              </div>
              <button type="submit" className="btn-primary-lg btn-full" id="save-profile">Guardar Cambios</button>
            </form>
          ) : (
            <div className="account-info">
              <div className="account-info-row">
                <span className="account-info-label">Nombre:</span>
                <span>{user.name || "—"}</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Teléfono:</span>
                <span>{user.phone || "No registrado"}</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Dirección:</span>
                <span>{user.address || "No registrada"}</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Tarjeta:</span>
                <span>{user.cardNumber ? `•••• •••• •••• ${user.cardNumber.slice(-4)}` : "No registrada"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="account-card">
          <h2 className="account-card-title">Historial de Pedidos</h2>
          {userOrders.length === 0 ? (
            <p className="account-empty">Aún no tienes pedidos realizados.</p>
          ) : (
            <div className="orders-list">
              {userOrders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-item-header">
                    <span className="order-item-id">Pedido #{order.id}</span>
                    <span className="order-item-status">{order.status}</span>
                  </div>
                  <div className="order-item-details">
                    <span>{order.date}</span>
                    <span>{order.items.length} producto(s)</span>
                    <span className="order-item-total">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="order-item-delivery">
                    {order.deliveryMethod === "domicilio" ? "Envío a domicilio" : "Recoger en sucursal"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
