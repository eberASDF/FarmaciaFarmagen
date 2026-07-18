import { useState } from "react";
import { CheckCircle2, MapPin, PackageOpen, Search, Trash2, Truck, XCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";
import { FORM_LIMITS, notifyLimitReached } from "../utils/formLimits";

export default function AdminOrders() {
  const { orders, ordersLoading, ordersError, branches, updateOrderStatus, cancelOrder, archiveOrder, user } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [notification, setNotification] = useState("");

  const statusLabels = {
    pendiente: "Pendiente",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };

  const notify = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const filteredOrders = orders.filter((order) => {
    const orderStatus = order.estado || order.status || "pendiente";
    if (order.archivado || orderStatus === "archivado" || orderStatus === "cancelado/archivado") return false;
    const term = search.toLowerCase();
    const orderProducts = order.productos || order.items || [];
    const orderBranch = order.sucursal || order.branchName || "";
    const matchesClient =
      !term ||
      (order.userName || "Invitado").toLowerCase().includes(term) ||
      (order.user || "invitado").toLowerCase().includes(term) ||
      (order.clienteNombre || "").toLowerCase().includes(term) ||
      (order.clienteCorreo || "").toLowerCase().includes(term);
    const matchesCategory =
      !categoryFilter ||
      orderProducts.some((item) => {
        const itemCategory = String(item.categoria || item.category || "Sin categoría");
        const selectedCategory = CATEGORIES.find((category) => category.id === categoryFilter);
        return itemCategory === categoryFilter || itemCategory === selectedCategory?.label;
      });
    const matchesBranch = !branchFilter || orderBranch === branchFilter;
    const matchesStatus = !statusFilter || orderStatus === statusFilter;

    return matchesClient && matchesCategory && matchesBranch && matchesStatus;
  });

  const branchOptions = Array.from(new Set([
    ...branches
      .filter((branch) => branch.active !== false)
      .map((branch) => branch.name)
      .filter(Boolean),
  ]));

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setBranchFilter("");
    setStatusFilter("");
  };

  const markAsDelivered = async (orderId) => {
    const result = await updateOrderStatus(orderId, "entregado");
    notify(result.message);
  };

  const cancelSelectedOrder = async (orderId) => {
    if (!window.confirm("¿Seguro que deseas cancelar este pedido? El stock será devuelto.")) {
      return;
    }
    const result = await cancelOrder(orderId);
    notify(result.message);
  };

  const discardOrder = async (orderId) => {
    if (!window.confirm("¿Seguro que deseas archivar este pedido? Ya no aparecerá en el panel.")) {
      return;
    }
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
      </div>

      {notification && <div className="notification notification--success">{notification}</div>}

      <div className="admin-filter-bar">
        <label className="admin-filter-search">
          <span>Buscar cliente</span>
          <div>
            <Search aria-hidden="true" />
            <input
              type="search"
              maxLength={FORM_LIMITS.text}
              value={search}
              onChange={(event) => {
                notifyLimitReached({ fieldName: "text", value: event.target.value, limit: FORM_LIMITS.text, notify });
                setSearch(event.target.value.slice(0, FORM_LIMITS.text));
              }}
              placeholder="Nombre o correo"
            />
          </div>
        </label>
        <label className="admin-filter-select">
          <span>Categoria</span>
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">Todas las categorias</option>
            {CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>
        </label>
        <label className="admin-filter-select">
          <span>Sucursal</span>
          <select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)}>
            <option value="">Todas las sucursales</option>
            {branchOptions.map((branchName) => (
              <option key={branchName} value={branchName}>{branchName}</option>
            ))}
          </select>
        </label>
        <label className="admin-filter-select">
          <span>Estado</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">Todos</option>
            <option value="pendiente">Pendientes</option>
            <option value="entregado">Entregados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </label>
        {(search || categoryFilter || branchFilter || statusFilter) && (
          <button type="button" className="btn-outline admin-filter-clear" onClick={clearFilters}>
            Limpiar filtros
          </button>
        )}
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
            const orderStatus = order.estado || order.status || "pendiente";
            const delivered = orderStatus === "entregado";
            const cancelled = orderStatus === "cancelado";
            const pending = orderStatus === "pendiente";
            const statusLabel = statusLabels[orderStatus] || orderStatus;

            return (
              <article className="admin-order-card" key={order.id}>
                <header className="admin-order-header">
                  <div>
                    <span className="admin-order-label">Pedido</span>
                    <h2>#{order.id}</h2>
                    <time>{order.date}</time>
                  </div>
                  <div className="admin-order-actions">
                    <span className={`admin-order-status ${delivered ? "is-delivered" : ""} ${cancelled ? "is-cancelled" : ""}`}>
                      {delivered ? <CheckCircle2 /> : cancelled ? <XCircle /> : <Truck />}
                      {statusLabel}
                    </span>
                    {pending && (
                      <button className="btn-primary admin-order-complete" onClick={() => markAsDelivered(order.id)}>
                        <CheckCircle2 /> Marcar como entregado
                      </button>
                    )}
                    {pending && (
                      <button className="btn-outline admin-order-cancel" onClick={() => cancelSelectedOrder(order.id)}>
                        <XCircle /> Cancelar pedido
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
