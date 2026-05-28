import { createContext, useContext, useState, useEffect } from "react";
import { initialProducts, initialBranches, initialBanners } from "../data/initialData";

const AppContext = createContext(null);

// ─── Helper: localStorage con fallback ──────────────────────────────────────
function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* silently fail */ }
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [products, setProducts] = useState(() => loadFromStorage("fd_products", initialProducts));
  const [branches, setBranches] = useState(() => loadFromStorage("fd_branches", initialBranches));
  const [banners, setBanners] = useState(() => loadFromStorage("fd_banners", initialBanners));
  const [user, setUser] = useState(() => loadFromStorage("fd_user", null));
  const [cart, setCart] = useState(() => loadFromStorage("fd_cart", []));
  const [orders, setOrders] = useState(() => loadFromStorage("fd_orders", []));
  const [registeredUsers, setRegisteredUsers] = useState(() => loadFromStorage("fd_registered_users", [
    { email: "admin@farmacia.com", password: "admin123", name: "Administrador", role: "admin", phone: "", address: "", cardNumber: "" },
  ]));

  // Persistir en localStorage
  useEffect(() => { saveToStorage("fd_products", products); }, [products]);
  useEffect(() => { saveToStorage("fd_branches", branches); }, [branches]);
  useEffect(() => { saveToStorage("fd_banners", banners); }, [banners]);
  useEffect(() => { saveToStorage("fd_user", user); }, [user]);
  useEffect(() => { saveToStorage("fd_cart", cart); }, [cart]);
  useEffect(() => { saveToStorage("fd_orders", orders); }, [orders]);
  useEffect(() => { saveToStorage("fd_registered_users", registeredUsers); }, [registeredUsers]);

  // ── Autenticación ──────────────────────────────────────────────────────────
  const login = (email, password) => {
    const found = registeredUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return { success: true, role: found.role };
    }
    return { success: false, message: "Correo o contraseña incorrectos." };
  };

  const register = (userData) => {
    const exists = registeredUsers.find(u => u.email === userData.email);
    if (exists) return { success: false, message: "Este correo ya está registrado." };
    const newUser = { ...userData, role: "client" };
    setRegisteredUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    setRegisteredUsers(prev => prev.map(u => u.email === updated.email ? updated : u));
  };

  // ── Carrito ────────────────────────────────────────────────────────────────
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ── Pedidos ────────────────────────────────────────────────────────────────
  const placeOrder = (deliveryMethod, branchId = null, address = "") => {
    const order = {
      id: Date.now(),
      items: [...cart],
      total: cartTotal + (deliveryMethod === "domicilio" ? 49 : 0),
      date: new Date().toLocaleDateString("es-MX"),
      deliveryMethod,
      branchId,
      address,
      status: "Confirmado",
      user: user?.email || "invitado",
      userName: user?.name || "Invitado",
    };
    setOrders(prev => [order, ...prev]);
    clearCart();
    return order;
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // ── Admin: Productos ───────────────────────────────────────────────────────
  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, data) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleFeatured = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  // ── Admin: Sucursales ──────────────────────────────────────────────────────
  const addBranch = (branch) => {
    const newBranch = { ...branch, id: Date.now() };
    setBranches(prev => [...prev, newBranch]);
    return newBranch;
  };

  const updateBranch = (id, data) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const deleteBranch = (id) => {
    setBranches(prev => prev.filter(b => b.id !== id));
  };

  // ── Admin: Banners ─────────────────────────────────────────────────────────
  const addBanner = (banner) => {
    const newBanner = { ...banner, id: Date.now(), active: true };
    setBanners(prev => [...prev, newBanner]);
    return newBanner;
  };

  const updateBanner = (id, data) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  };

  const deleteBanner = (id) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const toggleBanner = (id) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const value = {
    // Data
    products, branches, banners, user, cart, orders, registeredUsers,
    // Computed
    cartTotal, cartCount,
    featuredProducts: products.filter(p => p.featured),
    activeBanners: banners.filter(b => b.active),
    // Auth
    login, register, logout, updateProfile,
    // Cart
    addToCart, removeFromCart, updateCartQuantity, clearCart,
    // Orders
    placeOrder,
    // Admin
    updateOrderStatus,
    deleteOrder,
    addProduct, updateProduct, deleteProduct, toggleFeatured,
    addBranch, updateBranch, deleteBranch,
    addBanner, updateBanner, deleteBanner, toggleBanner,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
