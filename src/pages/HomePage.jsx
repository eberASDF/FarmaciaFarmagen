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
    <div className="home-page">
      <PromoCarousel banners={activeBanners} />

      <section className="home-trust-strip" aria-label="Beneficios de compra">
        <div className="home-trust-item">
          <Truck aria-hidden="true" />
          <span>Entrega local rapida</span>
        </div>
        <div className="home-trust-item">
          <ShieldCheck aria-hidden="true" />
          <span>Compra segura</span>
        </div>
        <div className="home-trust-item">
          <HeartPulse aria-hidden="true" />
          <span>Atencion farmaceutica</span>
        </div>
      </section>

      <section className="home-categories">
        <div className="section-header">
          <div>
            <h2 className="section-title">Farmacia online de confianza</h2>
            <p className="section-subtitle">Encuentra lo que necesitas por tipo de cuidado</p>
          </div>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(cat => {
            const Icon = categoryIcons[cat.id] || Pill;
            return (
              <Link to={`/products?cat=${cat.id}`} key={cat.id} className="category-chip" id={`cat-${cat.id}`}>
                <span className={`category-chip-icon category-chip-icon--${cat.id}`}>
                  <Icon size={30} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <span className="category-chip-label">{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-featured">
        <div className="section-header">
          <div>
            <h2 className="section-title">Productos destacados</h2>
            <p className="section-subtitle">Seleccionados por nuestros especialistas</p>
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

      <section className="home-branches">
        <div className="section-header">
          <div>
            <h2 className="section-title">Nuestras sucursales</h2>
            <p className="section-subtitle">Encuentranos cerca de ti</p>
          </div>
          <Link to="/branches" className="section-link">
            Ver todas
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

      <section className="home-cta">
        <div className="home-cta-content">
          <h2 className="home-cta-title">Compra con seguimiento y ofertas personalizadas</h2>
          <p className="home-cta-text">
            Crea tu cuenta para guardar tus datos de envio, consultar pedidos y recibir promociones.
          </p>
          <Link to="/register" className="home-cta-btn" id="register-cta">
            Crear cuenta
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
