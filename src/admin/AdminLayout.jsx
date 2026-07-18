import { NavLink, Outlet, Navigate, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import Breadcrumbs from "../components/Breadcrumbs";
import logoFarmaGen from "../assets/logo.jpg";

export default function AdminLayout() {
  const { user, logout } = useApp();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionTitle = location.pathname.includes("/branches")
    ? "Sucursales"
    : location.pathname.includes("/carousel")
      ? "Banners"
      : location.pathname.includes("/featured")
        ? "Destacados"
        : location.pathname.includes("/orders")
          ? "Pedidos"
          : "Productos";

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin-access" />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={`admin-layout ${menuOpen ? "admin-layout--menu-open" : ""}`}>
      <button
        type="button"
        className={`admin-mobile-menu-backdrop ${menuOpen ? "admin-mobile-menu-backdrop--open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-label="Cerrar menu de administracion"
      />

      <aside className={`admin-sidebar ${menuOpen ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <span className="admin-brand-mark">
              <img src={logoFarmaGen} alt="Farmacia FarmaGen" className="admin-brand-logo" />
            </span>
            <div>
              <span className="admin-sidebar-title">Farmacia FarmaGen</span>
              <span className="admin-sidebar-sub">Panel de administracion</span>
            </div>
          </div>
          <Link to="/" className="admin-back-link" aria-label="Volver a la tienda">
            <ArrowLeft aria-hidden="true" />
          </Link>
          <button type="button" className="admin-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menu">
            <X aria-hidden="true" />
          </button>
        </div>

        <nav className="admin-nav">
          <span className="admin-nav-label">Gestion</span>
          <NavLink to="/admin/products" onClick={() => setMenuOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link--active" : ""}`}>
            <LayoutDashboard className="admin-nav-icon" aria-hidden="true" />
            Productos
          </NavLink>
          <NavLink to="/admin/branches" onClick={() => setMenuOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link--active" : ""}`}>
            <Building2 className="admin-nav-icon" aria-hidden="true" />
            Sucursales
          </NavLink>
          <NavLink to="/admin/carousel" onClick={() => setMenuOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link--active" : ""}`}>
            <Image className="admin-nav-icon" aria-hidden="true" />
            Banners
          </NavLink>
          <NavLink to="/admin/featured" onClick={() => setMenuOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link--active" : ""}`}>
            <Star className="admin-nav-icon" aria-hidden="true" />
            Destacados
          </NavLink>
          <NavLink to="/admin/orders" onClick={() => setMenuOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link--active" : ""}`}>
            <ShoppingBag className="admin-nav-icon" aria-hidden="true" />
            Pedidos
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <span className="admin-user-avatar">{(user.name || user.email || "A").charAt(0).toUpperCase()}</span>
            <div>
              <strong>{user.name || "Administrador"}</strong>
              <span>{user.email}</span>
            </div>
          </div>
          <button onClick={logout} className="admin-logout-btn">
            <LogOut aria-hidden="true" />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <div className="admin-content-top">
          <button type="button" className="admin-mobile-menu-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menu de administracion">
            <Menu aria-hidden="true" />
          </button>
          <div className="admin-content-title">
            <Breadcrumbs />
            <h1>{sectionTitle}</h1>
          </div>
          <span className="admin-status-pill">
            <Sparkles size={15} aria-hidden="true" />
            Tienda activa
          </span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
