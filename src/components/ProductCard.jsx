import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";

export default function ProductCard({ product }) {
  const { addToCart } = useApp();
  const categoryInfo = CATEGORIES.find(c => c.id === product.category);
  const isOutOfStock = Number(product.stock) <= 0;
  const imageSrc = product.image || product.imagenUrl || product.imageUrl || "";
  const price = Number(product.price || product.precio || 0);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-card-img-wrap">
          <img src={imageSrc} alt={product.name} className="product-card-img" loading="lazy" />
        </div>
      </Link>
      <div className="product-card-body">
        <div className="product-card-meta-row">
          <span className="product-card-category">{categoryInfo?.label || product.category}</span>
          {isOutOfStock && <span className="product-card-stock-badge">Agotado</span>}
          {!isOutOfStock && product.featured && <span className="product-card-featured">Destacado</span>}
        </div>
        <Link to={`/products/${product.id}`} className="product-card-name-link">
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <p className="product-card-specs">{product.specs?.substring(0, 70)}...</p>
        <div className="product-card-footer">
          <span className="product-card-price">${price.toFixed(2)}</span>
          <button onClick={handleAdd} className="product-card-add-btn" id={`add-to-cart-${product.id}`} disabled={isOutOfStock}>
            <Plus className="product-card-add-icon" aria-hidden="true" />
            {isOutOfStock ? "Agotado" : "Anadir"}
          </button>
        </div>
      </div>
    </div>
  );
}
