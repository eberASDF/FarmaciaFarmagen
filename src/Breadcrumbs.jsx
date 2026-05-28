import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb({ categoryFilter }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getLabel = (path) => {
    const labels = {
      'products': 'Catálogo',
      'login': 'Acceso',
      'about': 'Sucursales',
    };
    return labels[path] || path;
  };

  return (
    <nav className="flex mb-6 py-2 text-sm font-medium text-slate-500" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="hover:text-emerald-700">Inicio</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center">
              <span className="mx-2 text-slate-300">/</span>
              {isLast ? (
                <span className="text-emerald-800 font-bold capitalize">{getLabel(value)}</span>
              ) : (
                <Link to={to} className="hover:text-emerald-700 capitalize">{getLabel(value)}</Link>
              )}
            </li>
          );
        })}
        {categoryFilter && (
          <li className="flex items-center">
            <span className="mx-2 text-slate-300">/</span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-bold uppercase">
              {categoryFilter}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}