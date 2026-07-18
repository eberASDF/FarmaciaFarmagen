import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";
import { downloadPickupTicket } from "../utils/orderTicket";
import { FORM_LIMITS, getLimitMessage, notifyLimitReached } from "../utils/formLimits";

export default function AccountPage() {
  const { user, loadUserProfile, updateProfile, orders, branches } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      if (!user?.uid) return;
      setLoadingProfile(true);
      const result = await loadUserProfile(user.uid);
      if (!active) return;
      if (!result.success) {
        setMessageType("error");
        setMessage(result.message || "Error al cargar perfil");
      }
      setLoadingProfile(false);
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    setForm({ ...(user || {}) });
  }, [user]);

  if (!user || !user.emailVerified) return <Navigate to="/login" />;

  const statusLabels = {
    pendiente: "Pendiente",
    entregado: "Entregado",
    cancelado: "Cancelado",
    archivado: "Archivado",
    "cancelado/archivado": "Cancelado y archivado",
  };

  const handleChange = (e) => {
    const limit = e.target.name === "name" ? FORM_LIMITS.name : FORM_LIMITS.phone;
    if (e.target.value.length > limit) {
      setMessageType("error");
      setMessage(getLimitMessage(e.target.name, limit));
      return;
    }
    notifyLimitReached({
      fieldName: e.target.name,
      value: e.target.value,
      limit,
      notify: (text) => {
        setMessageType("error");
        setMessage(text);
      },
    });
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if ((form.name || "").length > FORM_LIMITS.name || (form.phone || "").length > FORM_LIMITS.phone) return;
    setSavingProfile(true);
    const result = await updateProfile(form);
    setSavingProfile(false);
    setMessageType(result.success ? "success" : "error");
    setMessage(result.message);
    if (result.success) setEditing(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const userOrders = orders.filter(o => o.usuarioId === user.uid && !o.archivado && o.status !== "archivado");
  const handleDownloadTicket = (order) => {
    const orderStatus = order.estado || order.status || "pendiente";
    if (orderStatus !== "pendiente") return;
    downloadPickupTicket(order, branches);
  };

  return (
    <div className="page-container account-page-redesign">
      <Breadcrumbs />

      <section className="account-hero">
        <div>
          <span className="catalog-eyebrow">Mi cuenta</span>
          <h1 className="page-title">Hola, {user.name || "cliente"}</h1>
          <p>Administra tus datos y consulta tus pedidos para recoger en sucursal.</p>
        </div>
        {user.role === "admin" && (
          <Link to="/admin" className="account-admin-link">
            Ir al dashboard
          </Link>
        )}
      </section>

      {message && (
        <div className={`notification ${messageType === "success" ? "notification--success" : ""}`} role="status">
          {message}
        </div>
      )}

      <div className="account-grid">
        <div className="account-card">
          <div className="account-card-header">
            <h2 className="account-card-title">Datos Personales</h2>
            <button onClick={() => setEditing(!editing)} className="account-edit-btn" disabled={loadingProfile || savingProfile}>
              {editing ? "Cancelar" : "Editar"}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="auth-form">
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" name="name" maxLength={FORM_LIMITS.name} value={form.name || ""} onChange={handleChange} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Telefono</label>
                <input type="tel" name="phone" maxLength={FORM_LIMITS.phone} pattern="[0-9\s()+]*" value={form.phone || ""} onChange={handleChange} className="form-input" />
              </div>
              <button type="submit" className="btn-primary-lg btn-full" id="save-profile" disabled={savingProfile}>
                {savingProfile ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          ) : (
            <div className="account-info">
              <div className="account-info-row">
                <span className="account-info-label">Nombre:</span>
                <span>{user.name || "-"}</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="account-info-row">
                <span className="account-info-label">Telefono:</span>
                <span>{user.phone || "No registrado"}</span>
              </div>
            </div>
          )}
        </div>

        <div className="account-card">
          <h2 className="account-card-title">Historial de Pedidos</h2>
          {userOrders.length === 0 ? (
            <p className="account-empty">Aun no tienes pedidos realizados.</p>
          ) : (
            <div className="orders-list">
              {userOrders.map(order => {
                const orderStatus = order.estado || order.status || "pendiente";
                const canDownloadTicket = orderStatus === "pendiente";

                return (
                <div key={order.id} className="order-item">
                  <div className="order-item-header">
                    <span className="order-item-id">Pedido #{order.id}</span>
                    <span className="order-item-status">{statusLabels[orderStatus] || orderStatus}</span>
                  </div>
                  <div className="order-item-details">
                    <span>{order.date}</span>
                    <span>{order.items.length} producto(s)</span>
                    <span className="order-item-total">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="order-item-delivery">Recoger en sucursal</div>
                  {canDownloadTicket && (
                    <button
                      type="button"
                      className="order-ticket-btn"
                      onClick={() => handleDownloadTicket(order)}
                    >
                      Descargar Ticket para Sucursal
                    </button>
                  )}
                </div>
              );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
