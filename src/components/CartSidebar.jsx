import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, cartCount, clearCart, orders, branches, user } = useApp();
  const [activeTab, setActiveTab] = useState("cart"); // "cart" or "orders"

  const activeOrders = orders.filter(order => {
    const isGuest = order.user === "invitado";
    if (user) {
      return order.user === user.email && order.status === "Confirmado";
    } else {
      return isGuest && order.status === "Confirmado";
    }
  });

  return (
    <>
      {/* Overlay */}
      <div className={`cart-overlay ${isOpen ? "cart-overlay--visible" : ""}`} onClick={onClose} />

      {/* Sidebar */}
      <aside className={`cart-sidebar ${isOpen ? "cart-sidebar--open" : ""}`}>
        <div className="cart-header">
          <h2 className="cart-title">
            <svg className="cart-title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Farmacia El Desierto
          </h2>
          <button onClick={onClose} className="cart-close-btn" aria-label="Cerrar carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          padding: '0 20px',
          backgroundColor: 'var(--bg-white)'
        }}>
          <button
            onClick={() => setActiveTab("cart")}
            style={{
              flex: 1,
              padding: '12px 0',
              fontWeight: '700',
              fontSize: '0.85rem',
              color: activeTab === 'cart' ? 'var(--primary-dark)' : 'var(--text-muted)',
              borderBottom: activeTab === 'cart' ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'var(--transition)',
              backgroundColor: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Mi Carrito ({cartCount})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              flex: 1,
              padding: '12px 0',
              fontWeight: '700',
              fontSize: '0.85rem',
              color: activeTab === 'orders' ? 'var(--primary-dark)' : 'var(--text-muted)',
              borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'var(--transition)',
              backgroundColor: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Mis Pedidos
            {activeOrders.length > 0 && (
              <span style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '20px',
                fontWeight: '800',
                display: 'inline-block',
                lineHeight: '1'
              }}>
                {activeOrders.length}
              </span>
            )}
          </button>
        </div>

        <div className="cart-items">
          {activeTab === "cart" ? (
            cart.length === 0 ? (
              <div className="cart-empty">
                <svg className="cart-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p>Tu carrito está vacío</p>
                <Link to="/products" onClick={onClose} className="cart-empty-cta">Ver Medicamentos</Link>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    <div className="cart-item-controls">
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="cart-qty-btn">−</button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="cart-qty-btn">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="cart-item-remove" aria-label="Quitar">
                    <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))
            )
          ) : (
            /* Active Orders Tab */
            activeOrders.length === 0 ? (
              <div className="cart-empty" style={{ justifyContent: 'center', height: '100%' }}>
                <svg className="cart-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--border-color)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p style={{ fontWeight: '500', color: 'var(--text-muted)' }}>No tienes pedidos activos</p>
                <p style={{ fontSize: '0.8rem', textAlign: 'center', color: '#94a3b8', padding: '0 20px' }}>
                  Cuando realices un pedido, podrás seguir su preparación y entrega en tiempo real desde aquí.
                </p>
              </div>
            ) : (
              activeOrders.map(order => {
                const branch = branches.find(b => b.id == order.branchId);
                return (
                  <div key={order.id} style={{
                    backgroundColor: 'var(--bg-light)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'var(--transition)',
                    position: 'relative'
                  }}>
                    {/* Header: ID and Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
                        Pedido #{order.id.toString().slice(-6)}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(245, 158, 11, 0.12)',
                        color: '#d97706',
                        border: '1px solid rgba(245, 158, 11, 0.2)'
                      }}>
                        {order.status}
                      </span>
                    </div>

                    {/* Preparation Status Indicator */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#ecfdf5',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        animation: 'pulse 1.5s infinite'
                      }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#064e3b' }}>
                        {order.deliveryMethod === 'domicilio' 
                          ? 'Preparando envío a domicilio...' 
                          : 'Listo para recoger en sucursal...'}
                      </span>
                    </div>

                    {/* Details: Date and Method */}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>
                        <strong>Fecha:</strong> {order.date}
                      </div>
                      <div>
                        <strong>Entrega:</strong> {order.deliveryMethod === 'domicilio' ? 'A Domicilio' : 'Recoger en Sucursal'}
                      </div>
                      
                      {order.deliveryMethod === 'domicilio' && order.address && (
                        <div style={{ 
                          marginTop: '6px', 
                          padding: '8px', 
                          backgroundColor: 'var(--bg-white)', 
                          borderRadius: '6px', 
                          borderLeft: '3px solid var(--primary)',
                          border: '1px solid var(--border-color)',
                          borderLeftWidth: '3px',
                          fontSize: '0.75rem',
                          color: 'var(--text-dark)'
                        }}>
                          <strong>Dirección:</strong> {order.address}
                        </div>
                      )}

                      {order.deliveryMethod === 'sucursal' && branch && (
                        <div style={{ 
                          marginTop: '6px', 
                          padding: '8px', 
                          backgroundColor: 'var(--bg-white)', 
                          borderRadius: '6px', 
                          borderLeft: '3px solid var(--primary)',
                          border: '1px solid var(--border-color)',
                          borderLeftWidth: '3px',
                          fontSize: '0.75rem',
                          color: 'var(--text-dark)'
                        }}>
                          <strong>Sucursal:</strong> {branch.name}
                          <br />
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{branch.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Products summary list */}
                    <div style={{ 
                      borderTop: '1px dashed var(--border-color)', 
                      paddingTop: '8px', 
                      marginTop: '4px' 
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                            <span style={{ color: 'var(--text-dark)' }}>
                              {item.name} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span>
                            </span>
                            <span style={{ fontWeight: '600' }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '8px',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}>
                      <span style={{ color: 'var(--text-dark)' }}>Total:</span>
                      <span style={{ color: 'var(--primary-dark)', fontSize: '0.95rem', fontWeight: '800' }}>
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>

        {activeTab === "cart" && cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span className="cart-total-price">${cartTotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" onClick={onClose} className="cart-checkout-btn" id="checkout-button">
              Proceder al Pago
            </Link>
            <button onClick={clearCart} className="cart-clear-btn">Vaciar Carrito</button>
          </div>
        )}
      </aside>
    </>
  );
}
