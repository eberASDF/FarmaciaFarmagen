import { Link } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Navbar({ onOpenCart }) {
  const { user, logout, cartCount } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <svg className="navbar-logo-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" />
          </svg>
          <div className="navbar-logo-text">
            <span className="navbar-logo-name">EL DESIERTO</span>
            <span className="navbar-logo-sub">FARMACIA</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          <Link to="/" className="navbar-link">Inicio</Link>
          <Link to="/products" className="navbar-link">Medicamentos</Link>
          <Link to="/branches" className="navbar-link">Sucursales</Link>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <button onClick={onOpenCart} className="navbar-cart-btn" id="cart-button">
            <svg className="navbar-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && <span className="navbar-cart-badge">{cartCount}</span>}
          </button>

          {user ? (
            <div className="navbar-user-group">
              <Link to="/account" className="navbar-user-pill">
                <svg className="navbar-user-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {user.name || user.email}
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="navbar-admin-btn" id="admin-panel-link">PANEL ADMIN</Link>
              )}
              <button onClick={logout} className="navbar-logout-btn" id="logout-button">Salir</button>
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn" id="login-button">
              Iniciar Sesión
            </Link>
          )}

          {/* Mobile hamburger */}
          <button className="navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menú">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen
                ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Inicio</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Medicamentos</Link>
          <Link to="/branches" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Sucursales</Link>
          {!user && <Link to="/login" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Iniciar Sesión</Link>}
          {user && <Link to="/account" onClick={() => setMobileOpen(false)} className="navbar-mobile-link">Mi Cuenta</Link>}
          {user?.role === "admin" && <Link to="/admin" onClick={() => setMobileOpen(false)} className="navbar-mobile-link navbar-mobile-admin">Panel Admin</Link>}
        </div>
      )}
    </header>
  );
}
