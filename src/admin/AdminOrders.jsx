import { useState } from "react";
import { CheckCircle2, MapPin, PackageOpen, Search, Trash2, Truck } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AdminOrders() {
  const { orders, ordersLoading, ordersError, branches, updateOrderStatus, archiveOrder, user } = useApp();
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState("");

  const statusLabels = {
    pendiente: "Pendiente",
    entregado: "Entregado",
  };

  const notify = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const filteredOrders = orders.filter((order) => {
    if (order.archivado || order.estado === "archivado" || order.status === "archivado") return false;
    const term = search.toLowerCase();
    const matchesClient =
      !term ||
      (order.userName || "Invitado").toLowerCase().includes(term) ||
      (order.user || "invitado").toLowerCase().includes(term);

    return matchesClient;
  });

  const markAsDelivered = async (orderId) => {
    const result = await updateOrderStatus(orderId, "entregado");
    notify(result.message);
  };

  const discardOrder = async (orderId) => {
    const result = await archiveOrder(orderId);
    notify(result.message);
  };

  if (user?.role !== "admin") {
    return (
      <div className="admin-page">
        <div className="admin-empty-state">
          <PackageOpen aria-hidden="true" />
          <h2>No tienes permisos para ver pedidos</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-kicker">Operaciones</p>
          <h1 className="admin-page-title">Gestion de pedidos</h1>
        </div>
        <span className="admin-page-count">{filteredOrders.length} pedidos</span>
      </div>

      {notification && <div className="notification notification--success">{notification}</div>}

      <div className="admin-filter-bar">
        <label className="admin-filter-search">
          <span>Buscar cliente</span>
          <div>
            <Search aria-hidden="true" />
            <input
              type="search"
              maxLength={100}
              value={search}
              onChange={(event) => setSearch(event.target.value.slice(0, 100))}
              placeholder="Nombre o correo"
            />
          </div>
        </label>
      </div>

      {ordersLoading ? (
        <div className="admin-empty-state">
          <PackageOpen aria-hidden="true" />
          <h2>Cargando pedidos...</h2>
        </div>
      ) : ordersError ? (
        <div className="admin-empty-state">
          <PackageOpen aria-hidden="true" />
          <h2>{ordersError}</h2>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-empty-state">
          <PackageOpen aria-hidden="true" />
          <h2>No hay pedidos para mostrar</h2>
          <p>Los pedidos registrados apareceran aqui.</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {filteredOrders.map((order) => {
            const branch = branches.find((item) => item.id == order.branchId);
            const pickupBranch = order.sucursal || branch?.name || "No especificada";
            const delivered = order.status === "entregado";
            const statusLabel = statusLabels[order.status] || order.status;

            return (
              <article className="admin-order-card" key={order.id}>
                <header className="admin-order-header">
                  <div>
                    <span className="admin-order-label">Pedido</span>
                    <h2>#{order.id}</h2>
                    <time>{order.date}</time>
                  </div>
                  <div className="admin-order-actions">
                    <span className={`admin-order-status ${delivered ? "is-delivered" : ""}`}>
                      {delivered ? <CheckCircle2 /> : <Truck />}
                      {statusLabel}
                    </span>
                    {!delivered && (
                      <button className="btn-primary admin-order-complete" onClick={() => markAsDelivered(order.id)}>
                        <CheckCircle2 /> Marcar como entregado
                      </button>
                    )}
                    <button
                      className="admin-icon-danger"
                      onClick={() => discardOrder(order.id)}
                      title="Eliminar pedido"
                      aria-label={`Eliminar pedido ${order.id}`}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </header>

                <div className="admin-order-body">
                  <section>
                    <h3>Entrega</h3>
                    <dl className="admin-order-details">
                      <div><dt>Cliente</dt><dd>{order.userName || "Invitado"}</dd></div>
                      <div><dt>Correo</dt><dd>{order.user || "No disponible"}</dd></div>
                      <div><dt>Telefono</dt><dd>{order.clienteTelefono || "No disponible"}</dd></div>
                      <div><dt>Modalidad</dt><dd>Recoger en sucursal</dd></div>
                      <div><dt>Sucursal</dt><dd>{pickupBranch}</dd></div>
                    </dl>
                    {pickupBranch && pickupBranch !== "No especificada" && (
                      <div className="admin-order-location">
                        <MapPin />
                        <span>{pickupBranch}</span>
                      </div>
                    )}
                  </section>
                  <section>
                    <h3>Productos</h3>
                    <div className="admin-order-items">
                      {order.items.map((item, index) => (
                        <div key={`${item.id || item.name}-${index}`}>
                          <span>{item.name} <small>x{item.quantity}</small></span>
                          <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="admin-order-total"><span>Total</span><strong>${order.total.toFixed(2)}</strong></div>
                  </section>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
