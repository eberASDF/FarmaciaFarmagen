import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";
import ProductCard from "../components/ProductCard";
import Breadcrumbs from "../components/Breadcrumbs";

export default function ProductsPage() {
  const { products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");

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
    setSearchParams({});
  };

  const filtered = products.filter(p => {
    const matchCat = !activeCategory || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchFeatured = !activeFeatured || p.featured;
    return matchCat && matchSearch && matchFeatured;
  });

  const activeCatLabel = CATEGORIES.find(c => c.id === activeCategory)?.label;
  const breadcrumbExtra = activeCatLabel 
    ? (activeFeatured ? `${activeCatLabel} (Destacados)` : activeCatLabel) 
    : (activeFeatured ? "Destacados" : null);

  return (
    <div className="products-page">
      <Breadcrumbs extra={breadcrumbExtra} />

      <div className="products-layout">
        {/* Sidebar */}
        <aside className="products-sidebar">
          {/* Search */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Buscar</h3>
            <div className="sidebar-search-wrap">
              <svg className="sidebar-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre del medicamento..."
                className="sidebar-search-input"
                id="product-search"
              />
            </div>
          </div>

          {/* Featured Filter */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Destacados</h3>
            <button
              onClick={toggleFeatured}
              className={`sidebar-filter-btn ${activeFeatured ? "sidebar-filter-btn--active" : ""}`}
              id="filter-featured"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span>Ver solo destacados</span>
              <span className="featured-status-pill" style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: activeFeatured ? 'var(--primary-dark)' : 'var(--border-color)',
                color: activeFeatured ? '#ffffff' : 'var(--text-muted)'
              }}>
                {activeFeatured ? "Activo" : "Inactivo"}
              </span>
            </button>
          </div>

          {/* Category Filters */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Filtrar por Salud</h3>
            <div className="sidebar-filters">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`sidebar-filter-btn ${activeCategory === cat.id ? "sidebar-filter-btn--active" : ""}`}
                  id={`filter-${cat.id}`}
                >
                  {cat.icon && <span>{cat.icon}</span>}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
            {(activeCategory || search || activeFeatured) && (
              <button onClick={clearFilters} className="sidebar-clear-btn">
                ✕ Limpiar Filtros
              </button>
            )}
          </div>

        </aside>

        {/* Product Grid */}
        <section className="products-grid-section">
          <div className="products-grid-header">
            <h1 className="products-grid-title">
              {activeCatLabel ? `Medicamentos: ${activeCatLabel}` : "Todos los Medicamentos"}
            </h1>
            <span className="products-grid-count">{filtered.length} productos</span>
          </div>

          {filtered.length === 0 ? (
            <div className="products-empty">
              <p>No se encontraron productos con estos filtros.</p>
              <button onClick={clearFilters} className="products-empty-btn">Limpiar Filtros</button>
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
