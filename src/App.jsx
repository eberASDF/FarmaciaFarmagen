import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import VerifiedRoute from "./components/VerifiedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Public pages
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import BranchesPage from "./pages/BranchesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AccountPage from "./pages/AccountPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin pages
import AdminLayout from "./admin/AdminLayout";
import AdminProducts from "./admin/AdminProducts";
import AdminBranches from "./admin/AdminBranches";
import AdminCarousel from "./admin/AdminCarousel";
import AdminFeatured from "./admin/AdminFeatured";
import AdminOrders from "./admin/AdminOrders";

const routerBasename = import.meta.env.BASE_URL;

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={routerBasename}>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="recuperar-contrasena" element={<ForgotPasswordPage />} />
            <Route path="restablecer-contrasena" element={<ResetPasswordPage />} />
            <Route path="account" element={<VerifiedRoute><AccountPage /></VerifiedRoute>} />
            <Route path="checkout" element={<VerifiedRoute><CheckoutPage /></VerifiedRoute>} />
          </Route>

          {/* Admin Login — Standalone (sin Navbar/Footer) */}
          <Route path="/verificacion-correo" element={<EmailVerificationPage />} />
          <Route path="/admin-access" element={<AdminLoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<VerifiedRoute requiredRole="admin" loginPath="/admin-access"><AdminLayout /></VerifiedRoute>}>
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="branches" element={<AdminBranches />} />
            <Route path="carousel" element={<AdminCarousel />} />
            <Route path="featured" element={<AdminFeatured />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          {/* 404 — Página no encontrada */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
