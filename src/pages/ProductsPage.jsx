import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Baby,
  Bandage,
  Droplets,
  Eye,
  HeartPulse,
  Pill,
  Search,
  Shield,
  Sparkles,
  Star,
  Stethoscope,
  Syringe,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import { FORM_LIMITS, notifyLimitReached } from "../utils/formLimits";

const categoryIcons = {
  analgesia: Pill,
  respiratorio: Stethoscope,
  vitaminas: Sparkles,
  gastro: Droplets,
  dermatologia: Shield,
  diabetes: Syringe,
  oftalmologia: Eye,
  infantil: Baby,
  "cuidado-personal": HeartPulse,
  "salud-sexual": Bandage,
};

export default function ProductsPage() {
  const { products, productsLoading, productsError } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [limitMessage, setLimitMessage] = useState("");

  const activeCategory = searchParams.get("cat") || null;
  const activeFeatured = searchParams.get("featured") === "true";

  const setCategory = (catId) => {
    if (catId === activeCategory) {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", catId);
    }
    setSearchParams(searchParams);
  };

  const toggleFeatured = () => {
    if (activeFeatured) {
      searchParams.delete("featured");
    } else {
      searchParams.set("featured", "true");
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearch("");
    setLimitMessage("");
    setSearchParams({});
  };

  const handleMobileCategoryChange = (event) => {
    const nextCategory = event.target.value;
    if (!nextCategory) {
      searchParams.delete("cat");
    } else {
      searchParams.set("cat", nextCategory);
    }
    setSearchParams(searchParams);
  };

  const filtered = products.filter(p => {
    const matchCat = !activeCategory || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchFeatured = !activeFeatured || p.featured;
    return matchCat && matchSearch && matchFeatured;
  });

  const activeCatLabel = CATEGORIES.find(c => c.id === activeCategory)?.label;
  const breadcrumbExtra = activeCatLabel
    ? (activeFeatured ? `${activeCatLabel} destacados` : activeCatLabel)
    : (activeFeatured ? "Destacados" : null);

  return (
    <div className="products-page catalog-redesign">
      <Breadcrumbs extra={breadcrumbExtra} />

      <section className="catalog-hero">
        <div>
          <span className="catalog-eyebrow">Catalogo FarmaGen</span>
          <h1>{activeCatLabel ? activeCatLabel : activeFeatured ? "Productos destacados" : "Medicamentos y cuidado personal"}</h1>
          <p>Consulta productos disponibles y agrega al carrito para recoger tu pedido en sucursal.</p>
        </div>
      </section>

      <div className="products-layout">
        <aside className="products-sidebar">
          <div className="sidebar-section">
            <span className="sidebar-kicker">Filtrar por</span>
            <h3 className="sidebar-title">Categorias</h3>
            <div className="sidebar-filters">
              <button
                onClick={clearFilters}
                className={`sidebar-filter-btn ${!activeCategory && !activeFeatured ? "sidebar-filter-btn--active" : ""}`}
              >
                <Sparkles className="sidebar-filter-icon" aria-hidden="true" />
                <span>Todas las categorias</span>
              </button>
              {CATEGORIES.map(cat => {
                const Icon = categoryIcons[cat.id] || Pill;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`sidebar-filter-btn ${activeCategory === cat.id ? "sidebar-filter-btn--active" : ""}`}
                    id={`filter-${cat.id}`}
                  >
                    <Icon className="sidebar-filter-icon" aria-hidden="true" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="products-grid-section">
          <div className="products-mobile-category">
            <label htmlFor="mobile-category-select">Categoria:</label>
            <select
              id="mobile-category-select"
              value={activeCategory || ""}
              onChange={handleMobileCategoryChange}
            >
              <option value="">Todas las categorias</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="products-toolbar">
            <div className="products-search-wrap">
              <Search className="products-search-icon" aria-hidden="true" />
              <input
                type="text"
                maxLength={FORM_LIMITS.text}
                value={search}
                onChange={(e) => {
                  notifyLimitReached({ fieldName: "text", value: e.target.value, limit: FORM_LIMITS.text, notify: setLimitMessage });
                  setSearch(e.target.value.slice(0, FORM_LIMITS.text));
                }}
                placeholder="Buscar productos o marcas..."
                className="products-search-input"
                id="product-search"
              />
            </div>
            <button
              onClick={toggleFeatured}
              className={`products-featured-btn ${activeFeatured ? "products-featured-btn--active" : ""}`}
              id="filter-featured"
            >
              <Star size={18} aria-hidden="true" />
              Destacados
            </button>
            {(activeCategory || search || activeFeatured) && (
              <button onClick={clearFilters} className="products-clear-btn">
                <X size={17} aria-hidden="true" />
                Limpiar
              </button>
            )}
          </div>

          {limitMessage && <div className="notification" role="status">{limitMessage}</div>}

          <div className="products-grid-header">
            <div>
              <p className="products-kicker">Resultados</p>
              <h1 className="products-grid-title">
                {activeCatLabel ? activeCatLabel : "Productos"}
              </h1>
            </div>
          </div>

          {productsLoading ? (
            <div className="products-empty">
              <p>Cargando productos...</p>
            </div>
          ) : productsError ? (
            <div className="products-empty">
              <p>{productsError}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <p>No hay productos disponibles por el momento.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="products-empty">
              <p>No se encontraron productos con estos filtros.</p>
              <button onClick={clearFilters} className="products-empty-btn">Limpiar filtros</button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
