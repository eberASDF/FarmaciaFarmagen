import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";

export default function AdminFeatured() {
  const { products, toggleFeatured, featuredProducts, user } = useApp();
  const [notification, setNotification] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleToggleFeatured = async (id) => {
    if (user?.role !== "admin") {
      showNotif("No tienes permisos para realizar esta acción");
      return;
    }

    setUpdatingId(id);
    const result = await toggleFeatured(id);
    showNotif(result.message);
    setUpdatingId(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Productos Destacados</h1>
      </div>

      <p className="admin-page-desc">
        Marca los productos que deseas mostrar en la sección de "Productos Destacados" de la página principal. Los clientes los verán al entrar al sitio.
      </p>

      {notification && <div className="notification notification--success">{notification}</div>}

      {/* Current Featured Preview */}
      {featuredProducts.length > 0 && (
        <div className="admin-featured-preview">
          <h2 className="admin-featured-preview-title">Vista previa en página principal:</h2>
          <div className="admin-featured-preview-grid">
            {featuredProducts.slice(0, 4).map(p => (
              <div key={p.id} className="admin-featured-preview-card">
                <img src={p.image || p.imagenUrl || ""} alt={p.name} className="admin-featured-preview-img" />
                <span className="admin-featured-preview-name">{p.name}</span>
                <span className="admin-featured-preview-price">${p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Products Grid */}
      <div className="admin-featured-grid">
        {products.map(p => {
          const catInfo = CATEGORIES.find(c => c.id === p.category);
          return (
            <div
              key={p.id}
              className={`admin-featured-card ${p.featured ? "admin-featured-card--active" : ""}`}
              id={`featured-${p.id}`}
            >
              <div className="admin-featured-card-img-wrap">
                <img src={p.image || p.imagenUrl || ""} alt={p.name} className="admin-featured-card-img" />
                {p.featured && <span className="admin-featured-card-star">✓</span>}
              </div>
              <div className="admin-featured-card-body">
                <span className="admin-featured-card-cat">{catInfo?.label}</span>
                <h3 className="admin-featured-card-name">{p.name}</h3>
                <span className="admin-featured-card-price">${p.price.toFixed(2)}</span>
                <button
                  onClick={() => handleToggleFeatured(p.id)}
                  className={`admin-featured-toggle ${p.featured ? "admin-featured-toggle--active" : ""}`}
                  disabled={updatingId === p.id}
                >
                  {updatingId === p.id ? "Guardando..." : p.featured ? "Quitar Destacado" : "Marcar Destacado"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
