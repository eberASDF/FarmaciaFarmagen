import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function AdminOrders() {
  const { orders, branches, updateOrderStatus, deleteOrder } = useApp();
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [notification, setNotification] = useState("");

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleMarkAsDelivered = (orderId) => {
    updateOrderStatus(orderId, "Entregado");
    showNotif(`Pedido #${orderId} marcado como entregado.`);
  };

  const filteredOrders = orders.filter(order => {
    const userName = order.userName || "Invitado";
    const userEmail = order.user || "invitado";
    const matchClient = !search || 
      userName.toLowerCase().includes(search.toLowerCase()) || 
      userEmail.toLowerCase().includes(search.toLowerCase());
    
    const matchMethod = methodFilter === "all" || order.deliveryMethod === methodFilter;
    const matchBranch = branchFilter === "all" || order.branchId == branchFilter;

    return matchClient && matchMethod && matchBranch;
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestión de Pedidos</h1>
        <span className="admin-page-count">{filteredOrders.length} pedidos</span>
      </div>

      {notification && <div className="notification notification--success">{notification}</div>}

      {/* Filters Bar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        backgroundColor: '#1e293b', 
        padding: '20px', 
        borderRadius: '12px', 
        border: '1px solid #334155',
        marginBottom: '24px'
      }}>
        {/* Search */}
        <div className="form-group">
          <label className="form-label" style={{ color: '#94a3b8' }}>Buscar por Cliente</label>
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Nombre o correo..." 
            className="form-input"
            style={{ backgroundColor: '#0f172a', borderColor: '#334155', color: 'white' }}
          />
        </div>

        {/* Method */}
        <div className="form-group">
          <label className="form-label" style={{ color: '#94a3b8' }}>Método de Entrega</label>
          <select 
            value={methodFilter} 
            onChange={(e) => setMethodFilter(e.target.value)} 
            className="form-select"
            style={{ backgroundColor: '#0f172a', borderColor: '#334155', color: 'white' }}
          >
            <option value="all">Todos los métodos</option>
            <option value="domicilio">Envío a domicilio</option>
            <option value="sucursal">Recoger en sucursal</option>
          </select>
        </div>

        {/* Branch */}
        <div className="form-group">
          <label className="form-label" style={{ color: '#94a3b8' }}>Filtrar por Sucursal</label>
          <select 
            value={branchFilter} 
            onChange={(e) => setBranchFilter(e.target.value)} 
            className="form-select"
            style={{ backgroundColor: '#0f172a', borderColor: '#334155', color: 'white' }}
            disabled={methodFilter === "domicilio"}
          >
            <option value="all">Todas las sucursales</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '48px', 
          backgroundColor: '#1e293b', 
          border: '1px dashed #334155', 
          borderRadius: '12px',
          color: '#94a3b8'
        }}>
          No se encontraron pedidos con los filtros actuales.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredOrders.map(order => {
            const branch = branches.find(b => b.id == order.branchId);
            return (
              <div key={order.id} style={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #334155', 
                borderRadius: '16px', 
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                {/* Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderBottom: '1px solid #334155', 
                  paddingBottom: '12px',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>Pedido #{order.id}</h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Fecha: {order.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      backgroundColor: order.status === 'Entregado' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: order.status === 'Entregado' ? '#34d399' : '#fbbf24',
                      border: order.status === 'Entregado' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                      {order.status}
                    </span>
                    {order.status === 'Confirmado' ? (
                      <button 
                        onClick={() => handleMarkAsDelivered(order.id)} 
                        className="btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Marcar como Entregado
                      </button>
                    ) : (
                      <button 
                        onClick={() => { deleteOrder(order.id); showNotif("Pedido descartado."); }} 
                        className="btn-danger" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Descartar Pedido
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '24px',
                  fontSize: '0.9rem'
                }}>
                  {/* Client and Delivery Info */}
                  <div>
                    <h4 style={{ color: 'white', marginBottom: '12px', fontWeight: '700' }}>Detalles de Entrega</h4>
                    <p style={{ margin: '4px 0', color: '#cbd5e1' }}><strong>Cliente:</strong> {order.userName || "Invitado"}</p>
                    <p style={{ margin: '4px 0', color: '#cbd5e1' }}><strong>Correo:</strong> {order.user}</p>
                    <p style={{ margin: '4px 0', color: '#cbd5e1' }}><strong>Tipo:</strong> {order.deliveryMethod === 'domicilio' ? 'Envío a domicilio' : 'Recoger en sucursal'}</p>
                    {order.deliveryMethod === 'domicilio' && (
                      <div style={{ 
                        marginTop: '12px', 
                        padding: '12px', 
                        backgroundColor: '#0f172a', 
                        borderRadius: '8px', 
                        borderLeft: '4px solid #10b981',
                        border: '1px solid #334155',
                        borderLeftWidth: '4px'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em' }}>
                          Dirección de Envío
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#f8fafc', fontWeight: '600', lineHeight: '1.4' }}>
                          {order.address || "Dirección no especificada"}
                        </p>
                      </div>
                    )}
                    {order.deliveryMethod === 'sucursal' && branch && (
                      <p style={{ margin: '4px 0', color: 'var(--primary)', fontWeight: '600' }}><strong>Sucursal:</strong> {branch.name}</p>
                    )}
                  </div>

                  {/* Items list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ color: 'white', fontWeight: '700' }}>Productos Solicitados</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                          <span>{item.name} <span style={{ color: '#94a3b8' }}>x{item.quantity}</span></span>
                          <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                        </div>
                      ))}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      borderTop: '1px solid #334155', 
                      paddingTop: '8px', 
                      marginTop: '4px',
                      color: 'white',
                      fontWeight: '800',
                      fontSize: '1.05rem'
                    }}>
                      <span>Total:</span>
                      <span style={{ color: 'var(--primary)' }}>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
