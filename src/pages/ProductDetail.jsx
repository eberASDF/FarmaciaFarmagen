import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";
import Breadcrumbs from "../components/Breadcrumbs";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, productsLoading, productsError, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  const product = products.find(p => String(p.id) === String(id));

  if (productsLoading) {
    return (
      <div className="page-container">
        <Breadcrumbs />
        <div className="empty-state">
          <h2>Cargando productos...</h2>
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="page-container">
        <Breadcrumbs />
        <div className="empty-state">
          <h2>No se pudieron cargar los productos. Intenta de nuevo mas tarde.</h2>
        </div>
      </div>
    );
  }

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
  const imageSrc = product.image || product.imagenUrl || product.imageUrl || "";
  const price = Number(product.price || product.precio || 0);
  const stock = Math.max(0, Number(product.stock || 0));
  const isOutOfStock = stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate("/checkout");
  };

  return (
    <div className="page-container">
      <Breadcrumbs extra={product.name} />

      {showNotification && (
        <div className="notification notification--success">
          {quantity} unidad(es) de {product.name} anadida(s) al carrito
        </div>
      )}

      <div className="product-detail">
        <div className="product-detail-img-wrap">
          <img src={imageSrc} alt={product.name} className="product-detail-img" />
          {product.featured && (
            <span className="product-detail-featured">Producto Destacado</span>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">
            {categoryInfo?.label}
          </span>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-specs">{product.specs}</p>

          <div className="product-detail-price-row">
            <span className="product-detail-price">${price.toFixed(2)}</span>
            <span className="product-detail-tax">IVA incluido</span>
          </div>

          <div className="product-detail-stock">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="product-detail-stock-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {isOutOfStock ? "Agotado" : `${stock} unidades disponibles`}
          </div>

          <div className="product-detail-qty-section">
            <label className="product-detail-label">Cantidad:</label>
            <div className="product-detail-qty">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn">-</button>
              <span className="qty-value">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(stock, quantity + 1))} className="qty-btn" disabled={isOutOfStock}>+</button>
            </div>
          </div>

          <div className="product-detail-delivery">
            <label className="product-detail-label">Entrega:</label>
            <div className="checkout-payment-note">
              Pedido para recoger en sucursal.
            </div>
          </div>

          <div className="product-detail-actions">
            <button onClick={handleAdd} className="btn-secondary-lg" id="add-to-cart-detail" disabled={isOutOfStock}>
              Anadir al Carrito
            </button>
            <button onClick={handleBuyNow} className="btn-primary-lg" id="buy-now-detail" disabled={isOutOfStock}>
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
