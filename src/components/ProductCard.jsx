import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";

export default function ProductCard({ product }) {
  const { addToCart } = useApp();
  const categoryInfo = CATEGORIES.find(c => c.id === product.category);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div className="product-card-img-wrap">
          <img src={product.image} alt={product.name} className="product-card-img" loading="lazy" />
          <span className="product-card-category">
            {categoryInfo?.label || product.category}
          </span>
          {product.featured && (
            <span className="product-card-featured">
              Destacado
            </span>
          )}
        </div>
      </Link>
      <div className="product-card-body">
        <Link to={`/products/${product.id}`} className="product-card-name-link">
          <h3 className="product-card-name">{product.name}</h3>
        </Link>
        <p className="product-card-specs">{product.specs?.substring(0, 70)}...</p>
        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <button onClick={handleAdd} className="product-card-add-btn" id={`add-to-cart-${product.id}`}>
            <svg className="product-card-add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
