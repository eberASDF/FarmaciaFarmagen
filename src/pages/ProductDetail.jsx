import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";
import Breadcrumbs from "../components/Breadcrumbs";
import { FORM_LIMITS } from "../utils/formLimits";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, productsLoading, productsError, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

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
  const maxQuantity = Math.min(stock, FORM_LIMITS.numberMax);
  const isOutOfStock = stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const result = addToCart(product, quantity);
    if (result.success) navigate("/checkout");
  };

  return (
    <div className="page-container product-detail-page">
      <Breadcrumbs extra={product.name} />

      <section className="product-detail">
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
              <button onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))} className="qty-btn" disabled={isOutOfStock || quantity >= maxQuantity}>+</button>
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
      </section>

      <section className="product-detail-description">
        <h2>Descripcion del producto</h2>
        <p>{product.specs || "Producto disponible para pedido y recoleccion en sucursal."}</p>
        <div className="product-detail-basics">
          <span><strong>Categoria:</strong> {categoryInfo?.label || product.category}</span>
          <span><strong>Disponibilidad:</strong> {isOutOfStock ? "Agotado" : "Disponible"}</span>
          <span><strong>Entrega:</strong> Recoger en sucursal</span>
        </div>
      </section>
    </div>
  );
}
