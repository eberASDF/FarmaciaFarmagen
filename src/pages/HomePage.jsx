import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import PromoCarousel from "../components/PromoCarousel";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/initialData";

export default function HomePage() {
  const { activeBanners, featuredProducts, branches } = useApp();

  return (
    <div className="home-page">
      {/* Carrusel de Promociones */}
      <PromoCarousel banners={activeBanners} />

      {/* Categorías rápidas */}
      <section className="home-categories">
        <h2 className="section-title">Categorías de Salud</h2>
        <p className="section-subtitle">Encuentra lo que necesitas por tipo de cuidado</p>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link to={`/products?cat=${cat.id}`} key={cat.id} className="category-chip" id={`cat-${cat.id}`}>
              {cat.icon && <span className="category-chip-icon">{cat.icon}</span>}
              <span className="category-chip-label">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="home-featured">
        <div className="section-header">
          <div>
            <h2 className="section-title">Productos Destacados</h2>
            <p className="section-subtitle">Seleccionados por nuestros especialistas</p>
          </div>
          <Link to="/products?featured=true" className="section-link">Ver todos →</Link>
        </div>
        <div className="featured-grid">
          {featuredProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Sucursales Preview */}
      <section className="home-branches">
        <div className="section-header">
          <div>
            <h2 className="section-title">Nuestras Sucursales</h2>
            <p className="section-subtitle">Encuéntranos cerca de ti</p>
          </div>
          <Link to="/branches" className="section-link">Ver todas →</Link>
        </div>
        <div className="branches-preview-grid">
          {branches.slice(0, 3).map(branch => (
            <div key={branch.id} className="branch-preview-card" id={`branch-preview-${branch.id}`}>
              <div className="branch-preview-icon-wrap">
                <svg className="branch-preview-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="branch-preview-name">{branch.name}</h4>
                <p className="branch-preview-address">{branch.address}</p>
                <p className="branch-preview-hours">{branch.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Registro */}
      <section className="home-cta">
        <div className="home-cta-content">
          <h2 className="home-cta-title">¿Aún no tienes cuenta?</h2>
          <p className="home-cta-text">
            Regístrate para guardar tus datos de envío, métodos de pago y recibir ofertas exclusivas.
          </p>
          <Link to="/register" className="home-cta-btn" id="register-cta">
            Crear Cuenta Gratis
          </Link>
        </div>
      </section>
    </div>
  );
}
