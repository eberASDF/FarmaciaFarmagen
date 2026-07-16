import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  Home,
  Menu,
  PackageSearch,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import logoFarmaGen from "../assets/logo.jpg";

export default function Navbar({ onOpenCart }) {
  const { user, logout, cartCount, products, productsLoading } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const isHome = location.pathname === "/" || location.pathname === "/home";

  const normalize = (value) => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const searchResults = useMemo(() => {
    const term = normalize(search.trim());
    if (!term) return [];
    if (productsLoading) return [];
    return products.filter((product) => normalize(product.name).includes(term));
  }, [products, productsLoading, search]);

  useEffect(() => {
    const closeSearch = (event) => {
      if (!searchRef.current?.contains(event.target)) setSearchOpen(false);
    };
    document.addEventListener("pointerdown", closeSearch);
    return () => document.removeEventListener("pointerdown", closeSearch);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchResults.length) return;
    navigate(`/products/${searchResults[0].id}`);
    setSearch("");
    setSearchOpen(false);
  };

  const closeSearch = () => {
    setSearch("");
    setSearchOpen(false);
  };

  const handleCartOpen = () => {
    setMobileOpen(false);
    onOpenCart();
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const handleMobileLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <header className="navbar">
      <div className="navbar-promo-strip">
        <span><Clock size={15} aria-hidden="true" /> Lunes a sabado 8 a.m. - 10 p.m. | Domingo 9 a.m. - 9 p.m.</span>
        <span><Phone size={15} aria-hidden="true" /> 653 534 6587</span>
        <span><ShieldCheck size={15} aria-hidden="true" /> Pedidos para recoger en sucursal</span>
      </div>

      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-mark">
            <img src={logoFarmaGen} alt="Farmacia FarmaGen" className="navbar-logo-img" />
          </span>
          <div className="navbar-logo-text">
            <span className="navbar-logo-name">Farmacia FarmaGen</span>
            <span className="navbar-logo-sub">Salud para tu vida</span>
          </div>
        </Link>

        {isHome && (
        <form className="navbar-search" role="search" onSubmit={handleSearchSubmit} ref={searchRef}>
          <Search className="navbar-search-icon" size={22} aria-hidden="true" />
          <input
            type="search"
            maxLength={100}
            placeholder="Buscar medicamentos y productos"
            aria-label="Buscar productos"
            aria-expanded={searchOpen && search.trim().length > 0}
            aria-controls="navbar-search-results"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value.slice(0, 100));
              setSearchOpen(true);
            }}
            onFocus={() => search.trim() && setSearchOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setSearchOpen(false);
            }}
          />
          {search && <button type="button" className="navbar-search-clear" onClick={closeSearch} aria-label="Limpiar búsqueda"><X aria-hidden="true" /></button>}

          {searchOpen && search.trim() && (
            <div className="navbar-search-results" id="navbar-search-results" role="listbox">
              <div className="navbar-search-results-head">
                <span>{searchResults.length} {searchResults.length === 1 ? "resultado" : "resultados"}</span>
                <small>Selecciona un producto</small>
              </div>
              {searchResults.length > 0 ? searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="navbar-search-result"
                  role="option"
                  onClick={closeSearch}
                >
                  <img src={product.image} alt="" />
                  <span className="navbar-search-result-info">
                    <strong>{product.name}</strong>
                    <small>{product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}</small>
                  </span>
                  <span className="navbar-search-result-price">${product.price.toFixed(2)}</span>
                </Link>
              )) : (
                <div className="navbar-search-empty">
                  <PackageSearch aria-hidden="true" />
                  <span>No encontramos productos con “{search.trim()}”</span>
                </div>
              )}
            </div>
          )}
        </form>
        )}

        <div className="navbar-actions">
          <button onClick={handleCartOpen} className="navbar-cart-btn" id="cart-button" aria-label="Abrir carrito">
            <ShoppingCart className="navbar-cart-icon" aria-hidden="true" />
            {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
            <span className="navbar-action-label">Carrito</span>
          </button>

          {user ? (
            <div className="navbar-user-group">
              <Link to="/account" className="navbar-user-pill">
                <UserRound className="navbar-user-icon" aria-hidden="true" />
                {user.name || user.email}
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="navbar-admin-btn">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="navbar-logout-btn" id="logout-button">Salir</button>
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn" id="login-button">
              <UserRound size={21} aria-hidden="true" />
              <span>Iniciar sesion</span>
            </Link>
          )}

          <button className="navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"} aria-expanded={mobileOpen}>
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="navbar-menu-row">
        <nav className="navbar-links">
          <Link to="/" className="navbar-link">
            <Home size={17} aria-hidden="true" />
            Inicio
          </Link>
          <Link to="/products" className="navbar-link navbar-link--strong">
            <Menu size={20} aria-hidden="true" />
            Catalogo
          </Link>
          <Link to="/products" className="navbar-link">Medicamentos</Link>
          <Link to="/products?featured=true" className="navbar-link navbar-link--promo">
            <Sparkles size={17} aria-hidden="true" />
            Promociones
          </Link>
          <Link to="/products?cat=cuidado-personal" className="navbar-link">Cuidado personal</Link>
          <Link to="/branches" className="navbar-link">
            <Store size={17} aria-hidden="true" />
            Sucursales
          </Link>
          <Link to="/products" className="navbar-link">
            <PackageSearch size={17} aria-hidden="true" />
            Novedades
          </Link>
        </nav>
      </div>

      <div className={`mobile-drawer-overlay ${mobileOpen ? "mobile-drawer-overlay--open" : ""}`} onClick={closeMobileMenu} />
      <aside className={`mobile-drawer ${mobileOpen ? "mobile-drawer--open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <img src={logoFarmaGen} alt="" />
            <span>Farmacia FarmaGen</span>
          </div>
          <button type="button" className="mobile-drawer-close" onClick={closeMobileMenu} aria-label="Cerrar menu">
            <X aria-hidden="true" />
          </button>
        </div>

        <nav className="mobile-drawer-nav" aria-label="Menu movil">
          <Link to="/" onClick={closeMobileMenu} className="mobile-drawer-link">Inicio</Link>
          <Link to="/products" onClick={closeMobileMenu} className="mobile-drawer-link">Catalogo</Link>
          <Link to="/products" onClick={closeMobileMenu} className="mobile-drawer-link">Categorias</Link>
          <Link to="/branches" onClick={closeMobileMenu} className="mobile-drawer-link">Sucursales</Link>
          <button type="button" onClick={handleCartOpen} className="mobile-drawer-link mobile-drawer-link--button">
            Carrito {cartCount > 0 ? `(${cartCount})` : ""}
          </button>
          {!user && (
            <>
              <Link to="/login" onClick={closeMobileMenu} className="mobile-drawer-link">Iniciar sesion</Link>
              <Link to="/register" onClick={closeMobileMenu} className="mobile-drawer-link">Crear cuenta</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/account" onClick={closeMobileMenu} className="mobile-drawer-link">Mi cuenta</Link>
              {user.role === "admin" && <Link to="/admin" onClick={closeMobileMenu} className="mobile-drawer-link">Dashboard admin</Link>}
              <button type="button" onClick={handleMobileLogout} className="mobile-drawer-link mobile-drawer-link--button">
                Cerrar sesion
              </button>
            </>
          )}
        </nav>
      </aside>
    </header>
  );
}
