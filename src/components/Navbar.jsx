import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  PackageSearch,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

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
    if (!user?.emailVerified) {
      navigate("/login");
      return;
    }
    onOpenCart();
  };

  return (
    <header className="navbar">
      <div className="navbar-promo-strip">
        <ShieldCheck size={16} aria-hidden="true" />
        Envio gratis en pedidos superiores a $899
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
              <button onClick={logout} className="navbar-logout-btn" id="logout-button">Salir</button>
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn" id="login-button">
              <UserRound size={21} aria-hidden="true" />
              <span>Iniciar sesion</span>
            </Link>
          )}

          <button className="navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="navbar-menu-row">
        <nav className="navbar-links">
          <Link to="/products" className="navbar-link navbar-link--strong">
            <Menu size={20} aria-hidden="true" />
            Categorias
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

      {mobileOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Inicio</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Medicamentos</Link>
          <Link to="/products?featured=true" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Promociones</Link>
          <Link to="/branches" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Sucursales</Link>
          {!user && <Link to="/login" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Iniciar sesion</Link>}
          {user && <Link to="/account" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Mi cuenta</Link>}
        </div>
      )}
    </header>
  );
}
