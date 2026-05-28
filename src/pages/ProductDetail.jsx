import { useParams } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";
import Breadcrumbs from "../components/Breadcrumbs";

export default function ProductDetail() {
  const { id } = useParams();
  const { products, addToCart, branches } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("domicilio");
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || "");
  const [showNotification, setShowNotification] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="page-container">
        <Breadcrumbs />
        <div className="empty-state">
          <h2>Producto no encontrado</h2>
          <p>El producto que buscas no existe o fue dado de baja.</p>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORIES.find(c => c.id === product.category);

  const handleAdd = () => {
    addToCart(product, quantity);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    window.location.href = "/checkout";
  };

  return (
    <div className="page-container">
      <Breadcrumbs extra={product.name} />

      {/* Notification */}
      {showNotification && (
        <div className="notification notification--success">
          ✓ {quantity} unidad(es) de {product.name} añadida(s) al carrito
        </div>
      )}

      <div className="product-detail">
        {/* Image */}
        <div className="product-detail-img-wrap">
          <img src={product.image} alt={product.name} className="product-detail-img" />
          {product.featured && (
            <span className="product-detail-featured">Producto Destacado</span>
          )}
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <span className="product-detail-category">
            {categoryInfo?.label}
          </span>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-specs">{product.specs}</p>

          <div className="product-detail-price-row">
            <span className="product-detail-price">${product.price.toFixed(2)}</span>
            <span className="product-detail-tax">IVA incluido</span>
          </div>

          <div className="product-detail-stock">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="product-detail-stock-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {product.stock} unidades disponibles
          </div>

          {/* Quantity */}
          <div className="product-detail-qty-section">
            <label className="product-detail-label">Cantidad:</label>
            <div className="product-detail-qty">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">−</button>
              <span className="qty-value">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="qty-btn">+</button>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="product-detail-delivery">
            <label className="product-detail-label">Método de entrega:</label>
            <div className="delivery-options">
              <button
                onClick={() => setDeliveryMethod("domicilio")}
                className={`delivery-option ${deliveryMethod === "domicilio" ? "delivery-option--active" : ""}`}
              >
                <svg className="delivery-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Envío a domicilio
              </button>
              <button
                onClick={() => setDeliveryMethod("sucursal")}
                className={`delivery-option ${deliveryMethod === "sucursal" ? "delivery-option--active" : ""}`}
              >
                <svg className="delivery-option-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Recoger en sucursal
              </button>
            </div>

            {deliveryMethod === "sucursal" && (
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="delivery-branch-select"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name} — {b.address}</option>
                ))}
              </select>
            )}
          </div>

          {/* Actions */}
          <div className="product-detail-actions">
            <button onClick={handleAdd} className="btn-secondary-lg" id="add-to-cart-detail">
              Añadir al Carrito
            </button>
            <button onClick={handleBuyNow} className="btn-primary-lg" id="buy-now-detail">
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
