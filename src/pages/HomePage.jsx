import { Link } from "react-router-dom";
import {
  Baby,
  Bandage,
  ChevronRight,
  Droplets,
  Eye,
  HeartPulse,
  MapPin,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  Truck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import PromoCarousel from "../components/PromoCarousel";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/initialData";

const categoryIcons = {
  analgesia: Pill,
  respiratorio: Stethoscope,
  vitaminas: Sparkles,
  gastro: Droplets,
  dermatologia: ShieldCheck,
  diabetes: Syringe,
  oftalmologia: Eye,
  infantil: Baby,
  "cuidado-personal": HeartPulse,
  "salud-sexual": Bandage,
};

export default function HomePage() {
  const { activeBanners, featuredProducts, branches, productsLoading, productsError } = useApp();
  const activeBranches = branches.filter(branch => branch.active !== false);

  return (
    <div className="home-page home-market">
      <section className="home-hero-full">
        <PromoCarousel banners={activeBanners} />
      </section>

      <section className="home-service-bar" aria-label="Beneficios de compra">
        <div className="home-service-item">
          <HeartPulse aria-hidden="true" />
          <div>
            <strong>Atencion farmaceutica</strong>
            <span>Orientacion clara antes de comprar</span>
          </div>
        </div>
        <div className="home-service-item">
          <Truck aria-hidden="true" />
          <div>
            <strong>Pedido para recoger</strong>
            <span>Elige sucursal y pasa por tu pedido</span>
          </div>
        </div>
        <div className="home-service-item">
          <ShieldCheck aria-hidden="true" />
          <div>
            <strong>Compra segura</strong>
            <span>Datos protegidos y productos verificados</span>
          </div>
        </div>
      </section>

      <section className="home-section home-categories">
        <div className="home-section-head">
          <div>
            <span className="home-section-kicker">Comprar por categoria</span>
            <h2 className="section-title">Encuentra rapido lo que necesitas</h2>
          </div>
          <Link to="/products" className="section-link">
            Ver catalogo
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="categories-grid categories-grid--compact">
          {CATEGORIES.map(cat => {
            const Icon = categoryIcons[cat.id] || Pill;
            return (
              <Link to={`/products?cat=${cat.id}`} key={cat.id} className="category-chip" id={`cat-${cat.id}`}>
                <span className={`category-chip-icon category-chip-icon--${cat.id}`}>
                  <Icon size={24} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <span className="category-chip-label">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-section home-featured">
        <div className="home-section-head">
          <div>
            <span className="home-section-kicker">Seleccionados por nuestros especialistas</span>
            <h2 className="section-title">Productos destacados</h2>
          </div>
          <Link to="/products?featured=true" className="section-link">
            Ver todos
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="featured-grid">
          {productsLoading ? (
            <div className="products-empty">
              <p>Cargando productos...</p>
            </div>
          ) : productsError ? (
            <div className="products-empty">
              <p>{productsError}</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="products-empty">
              <p>No hay productos disponibles por el momento.</p>
            </div>
          ) : (
            featuredProducts.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      <section className="home-section home-branches">
        <div className="home-section-head">
          <div>
            <span className="home-section-kicker">Recoge cerca de ti</span>
            <h2 className="section-title">Sucursales FarmaGen</h2>
          </div>
          <Link to="/branches" className="section-link">
            Ver sucursales
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="branches-preview-grid">
          {activeBranches.slice(0, 3).map(branch => (
            <div key={branch.id} className="branch-preview-card" id={`branch-preview-${branch.id}`}>
              <div className="branch-preview-icon-wrap">
                <MapPin className="branch-preview-icon" aria-hidden="true" />
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

      <section className="home-account-strip">
        <div>
          <span className="home-section-kicker">Tu farmacia en linea</span>
          <h2>Haz tu pedido y recógelo en sucursal</h2>
          <p>Crea una cuenta para consultar tus pedidos, descargar tickets y agilizar futuras compras.</p>
        </div>
        <div className="home-account-actions">
          <Link to="/products" className="home-cta-btn">Comprar ahora</Link>
          <Link to="/register" className="section-link" id="register-cta">Crear cuenta</Link>
        </div>
      </section>
    </div>
  );
}
