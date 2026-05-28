import { Link, useLocation } from "react-router-dom";

const routeLabels = {
  products: "Medicamentos",
  branches: "Sucursales",
  login: "Iniciar Sesión",
  register: "Crear Cuenta",
  account: "Mi Cuenta",
  checkout: "Checkout",
  admin: "Panel Admin",
};

const adminLabels = {
  products: "Productos",
  branches: "Sucursales",
  carousel: "Carrusel",
  featured: "Destacados",
};

export default function Breadcrumbs({ extra }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const isAdmin = pathnames[0] === "admin";

  const getLabel = (segment, index) => {
    // If it's an admin sub-route
    if (isAdmin && index > 0) {
      return adminLabels[segment] || segment;
    }
    // If it's a product ID (numeric)
    if (!isNaN(segment)) {
      return "Detalle";
    }
    return routeLabels[segment] || segment;
  };

  // Don't show on homepage
  if (pathnames.length === 0) return null;

  return (
    <nav
      className="breadcrumb-nav"
      aria-label="Breadcrumb"
    >
      <ol className="breadcrumb-list">
        {/* Home link */}
        <li className="breadcrumb-item">
          <Link to={isAdmin ? "/admin" : "/"} className="breadcrumb-link">
            <svg className="breadcrumb-home-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            {isAdmin ? "Panel Admin" : "Inicio"}
          </Link>
        </li>

        {/* Dynamic segments */}
        {pathnames.map((segment, index) => {
          // Skip the first "admin" segment since we show "Panel Admin" as home
          if (isAdmin && index === 0) return null;

          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const label = getLabel(segment, index);

          return (
            <li key={to} className="breadcrumb-item">
              <svg className="breadcrumb-separator" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {isLast ? (
                <span className="breadcrumb-current">{label}</span>
              ) : (
                <Link to={to} className="breadcrumb-link">{label}</Link>
              )}
            </li>
          );
        })}

        {/* Extra segment (e.g. category filter or product name) */}
        {extra && (
          <li className="breadcrumb-item">
            <svg className="breadcrumb-separator" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="breadcrumb-extra">{extra}</span>
          </li>
        )}
      </ol>
    </nav>
  );
}
