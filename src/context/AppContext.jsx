import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { initialProducts, initialBranches, initialBanners } from "../data/initialData";
import { auth, db } from "../firebase/config";

const AppContext = createContext(null);
// Cambia esta URL por el dominio real en produccion si no quieres usar el origen actual.
const actionCodeSettings = {
  url: `${window.location.origin}/verificacion-correo`,
  handleCodeInApp: true,
};
const FARMAGEN_PHONE = "653 534 6587";
const FARMAGEN_HOURS = "Lunes a sábado: 8 a.m. – 10 p.m. | Domingo: 9 a.m. – 9 p.m.";
const FARMAGEN_CITY = "San Luis Río Colorado, Sonora";
const LEGACY_NAME = ["Farmacia", "El", "Desierto"].join(" ");
const LEGACY_PLURAL_NAME = ["Farmacias", "El", "Desierto"].join(" ");
const LEGACY_UPPER_NAME = LEGACY_NAME.toUpperCase();
const LEGACY_PHONE = ["01-800", "DESIERTO"].join("-");
const LEGACY_EMAIL = ["contacto", "eldesierto.com"].join("@");
const LEGACY_CITY = ["Ciudad del", "Desierto"].join(" ");

function replaceLegacyPharmacyText(value) {
  if (typeof value !== "string") return value;
  return value
    .split(LEGACY_UPPER_NAME).join("FARMACIA FARMAGEN")
    .split(LEGACY_PLURAL_NAME).join("Farmacia FarmaGen")
    .split(LEGACY_NAME).join("Farmacia FarmaGen")
    .split(LEGACY_PHONE).join(FARMAGEN_PHONE)
    .split(LEGACY_EMAIL).join("farma.gen@outlook.com")
    .split(LEGACY_CITY).join(FARMAGEN_CITY);
}

function normalizeBranch(branch, docId = branch.id) {
  const name = replaceLegacyPharmacyText(branch.nombre || branch.name || "");
  const address = replaceLegacyPharmacyText(branch.direccion || branch.address || "");
  const phone = branch.telefono || branch.phone || FARMAGEN_PHONE;
  const hours = branch.horario || branch.hours || FARMAGEN_HOURS;
  const active = branch.activa ?? branch.active ?? true;
  const image = branch.imagenUrl || branch.image || "";

  return {
    ...branch,
    id: docId,
    nombre: name,
    direccion: address,
    telefono: phone,
    horario: hours,
    imagenUrl: image,
    activa: Boolean(active),
    name,
    address,
    phone,
    hours,
    image,
    active: Boolean(active),
  };
}

function normalizeBanner(banner, docId = banner.id) {
  const title = replaceLegacyPharmacyText(banner.titulo || banner.title || "");
  const subtitle = replaceLegacyPharmacyText(banner.descripcion || banner.subtitle || "");
  const image = banner.imagenUrl || banner.image || "";
  const active = banner.activo ?? banner.active ?? true;
  const order = Number(banner.orden ?? banner.order ?? banner.id ?? 0);

  return {
    ...banner,
    id: docId,
    titulo: title,
    descripcion: subtitle,
    imagenUrl: image,
    activo: Boolean(active),
    orden: Number.isFinite(order) ? order : 0,
    title,
    subtitle,
    image,
    active: Boolean(active),
    order: Number.isFinite(order) ? order : 0,
    ctaText: replaceLegacyPharmacyText(banner.ctaText || ""),
    ctaLink: banner.ctaLink || "",
  };
}

function buildBannerFirestorePayload(banner, fallbackOrder = 0) {
  const title = String(banner.title || banner.titulo || "").trim();
  const subtitle = String(banner.subtitle || banner.descripcion || "").trim();
  const image = String(banner.image || banner.imagenUrl || "").trim();
  const order = Number(banner.order ?? banner.orden ?? fallbackOrder);

  return {
    titulo: title,
    descripcion: subtitle,
    imagenUrl: image,
    activo: Boolean(banner.active ?? banner.activo ?? true),
    orden: Number.isFinite(order) ? order : fallbackOrder,
    ctaText: String(banner.ctaText || "").trim(),
    ctaLink: String(banner.ctaLink || "").trim(),
    actualizadoEn: serverTimestamp(),
  };
}

function buildBranchFirestorePayload(branch) {
  const name = String(branch.name || branch.nombre || "").trim();
  const address = String(branch.address || branch.direccion || "").trim();
  const phone = String(branch.phone || branch.telefono || "").trim();
  const hours = String(branch.hours || branch.horario || "").trim();
  const image = String(branch.image || branch.imagenUrl || "").trim();

  return {
    nombre: name,
    direccion: address,
    telefono: phone,
    horario: hours,
    imagenUrl: image,
    activa: Boolean(branch.active ?? branch.activa ?? true),
    actualizadoEn: serverTimestamp(),
  };
}

const ORDER_STATUSES = ["pendiente", "entregado", "archivado"];
const LEGACY_ORDER_STATUS = {
  Confirmado: "pendiente",
  Entregado: "entregado",
  Pendiente: "pendiente",
};

function formatOrderDate(value) {
  const date = typeof value?.toDate === "function" ? value.toDate() : value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toLocaleDateString("es-MX");
  return date.toLocaleDateString("es-MX");
}

function normalizeOrderProduct(item) {
  const cantidad = Number(item.cantidad ?? item.quantity ?? 1);
  const precio = Number(item.precio ?? item.price ?? 0);
  const nombre = item.nombre || item.name || "";
  const imagenUrl = item.imagenUrl || item.imageUrl || item.image || "";
  const categoria = item.categoria || item.category || "";

  return {
    id: item.id,
    nombre,
    name: nombre,
    precio,
    price: precio,
    cantidad,
    quantity: cantidad,
    imagenUrl,
    imageUrl: imagenUrl,
    image: imagenUrl,
    categoria,
    category: categoria,
  };
}

function normalizeOrder(order, docId = order.id) {
  const rawStatus = order.estado || order.status || "pendiente";
  const estado = LEGACY_ORDER_STATUS[rawStatus] || rawStatus;
  const tipoEntrega = order.tipoEntrega || order.deliveryMethod || "recoger_sucursal";
  const productos = (order.productos || order.items || []).map(normalizeOrderProduct);
  const sucursal = order.sucursal || order.branchName || "";

  return {
    ...order,
    id: docId,
    usuarioId: order.usuarioId || "",
    clienteNombre: order.clienteNombre || order.userName || "Invitado",
    clienteCorreo: order.clienteCorreo || order.user || "invitado",
    clienteTelefono: order.clienteTelefono || "",
    clienteDireccion: order.clienteDireccion || order.address || "",
    productos,
    items: productos,
    total: Number(order.total || 0),
    sucursal,
    tipoEntrega,
    deliveryMethod: tipoEntrega,
    estado,
    status: estado,
    archivado: Boolean(order.archivado) || estado === "archivado",
    branchId: order.branchId || order.sucursalId || null,
    address: order.clienteDireccion || order.address || "",
    user: order.clienteCorreo || order.user || "invitado",
    userName: order.clienteNombre || order.userName || "Invitado",
    date: order.date || formatOrderDate(order.creadoEn),
    creadoEn: order.creadoEn || null,
    actualizadoEn: order.actualizadoEn || null,
  };
}

function normalizeProduct(product, docId = product.id) {
  const nombre = product.nombre || product.name || "";
  const categoria = product.categoria || product.category || "";
  const precio = Number(product.precio ?? product.price ?? 0);
  const stock = Math.max(0, Number(product.stock ?? 0));
  const imagenUrl = product.imagenUrl || product.imageUrl || product.image || "";
  const descripcion = product.descripcion || product.description || product.specs || "";
  const destacado = Boolean(product.destacado ?? product.featured ?? false);

  return {
    ...product,
    id: docId,
    nombre,
    name: nombre,
    categoria,
    category: categoria,
    precio,
    price: precio,
    stock,
    imagenUrl,
    imageUrl: imagenUrl,
    image: imagenUrl,
    descripcion,
    description: descripcion,
    specs: descripcion,
    destacado,
    featured: destacado,
    creadoEn: product.creadoEn || null,
    actualizadoEn: product.actualizadoEn || null,
  };
}

function buildProductFirestorePayload(data, includeCreatedAt = false) {
  const payload = {
    nombre: (data.nombre ?? data.name ?? "").trim(),
    categoria: data.categoria ?? data.category ?? "",
    precio: Number(data.precio ?? data.price ?? 0),
    stock: Number(data.stock ?? 0),
    imagenUrl: data.imagenUrl ?? data.imageUrl ?? data.image ?? "",
    descripcion: (data.descripcion ?? data.description ?? data.specs ?? "").trim(),
    destacado: Boolean(data.destacado ?? data.featured ?? false),
    actualizadoEn: serverTimestamp(),
  };

  if (includeCreatedAt) payload.creadoEn = serverTimestamp();
  return payload;
}

function buildOrderProduct(item) {
  const normalized = normalizeOrderProduct(item);
  return {
    id: String(normalized.id),
    nombre: normalized.nombre,
    precio: normalized.precio,
    cantidad: normalized.cantidad,
    imagenUrl: normalized.imagenUrl,
    categoria: normalized.categoria,
  };
}

function normalizeUserProfile(profile, fallbackUser = {}) {
  return {
    ...fallbackUser,
    uid: profile.uid || fallbackUser.uid || "",
    name: profile.nombre || fallbackUser.name || fallbackUser.email || "",
    email: profile.correo || fallbackUser.email || "",
    phone: profile.telefono || "",
    address: profile.direccion || "",
    role: profile.rol || fallbackUser.role || "cliente",
    emailVerified: profile.emailVerificado ?? fallbackUser.emailVerified ?? true,
    estadoCuenta: profile.estadoCuenta || fallbackUser.estadoCuenta || "activo",
  };
}

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
  const [products, setProducts] = useState(() => loadFromStorage("fd_products", initialProducts).map(product => normalizeProduct(product)));
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [branches, setBranches] = useState(() => initialBranches.map(branch => normalizeBranch(branch)));
  const [banners, setBanners] = useState(() => initialBanners.map(banner => normalizeBanner(banner)));
  const [featuredProducts, setFeaturedProducts] = useState(() => products.filter(product => product.featured));
  const [activeBanners, setActiveBanners] = useState(() => banners.filter(banner => banner.active));
  const [user, setUser] = useState(() => loadFromStorage("fd_user", null));
  const [cart, setCart] = useState(() => loadFromStorage("fd_cart", []));
  const [orders, setOrders] = useState(() => loadFromStorage("fd_orders", []).map(normalizeOrder));
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState(() => loadFromStorage("fd_registered_users", [
    { email: "admin@farmacia.com", password: "admin123", name: "Administrador", role: "admin", phone: "", address: "", cardNumber: "", emailVerified: true },
  ]));

  const loadFirestoreProducts = async () => {
    setProductsLoading(true);
    setProductsError("");

    try {
      const snapshot = await getDocs(collection(db, "productos"));
      const firestoreProducts = snapshot.docs.map((productDoc) => normalizeProduct(productDoc.data(), productDoc.id));
      setProducts(firestoreProducts);
    } catch {
      setProducts([]);
      setProductsError("No se pudieron cargar los productos. Intenta de nuevo más tarde.");
    } finally {
      setProductsLoading(false);
    }
  };

  // Usa FUNCIÓN ASÍNCRONA 1 para simular la carga inicial del catálogo.
  useEffect(() => {
    loadFirestoreProducts();
  }, []);

  // Usa FUNCIÓN ASÍNCRONA 2 cada vez que cambia el catálogo.
  useEffect(() => {
    setFeaturedProducts(products.filter((product) => product.featured === true));
  }, [products]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "banners"),
      (snapshot) => {
        const firestoreBanners = snapshot.docs
          .map((bannerDoc) => normalizeBanner(bannerDoc.data(), bannerDoc.id))
          .sort((a, b) => (a.orden || 0) - (b.orden || 0));

        setBanners(firestoreBanners.length ? firestoreBanners : initialBanners.map(banner => normalizeBanner(banner)));
      },
      () => {
        setBanners(initialBanners.map(banner => normalizeBanner(banner)));
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "sucursales"),
      (snapshot) => {
        const firestoreBranches = snapshot.docs
          .map((branchDoc) => normalizeBranch(branchDoc.data(), branchDoc.id))
          .sort((a, b) => a.name.localeCompare(b.name));

        setBranches(firestoreBranches.length ? firestoreBranches : initialBranches.map(branch => normalizeBranch(branch)));
      },
      () => {
        setBranches(initialBranches.map(branch => normalizeBranch(branch)));
      }
    );

    return unsubscribe;
  }, []);

  // Usa FUNCIÓN ASÍNCRONA 3 cada vez que cambia la lista de banners.
  useEffect(() => {
    setActiveBanners(banners.filter((banner) => banner.active === true));
  }, [banners]);

  // Usa FUNCIÓN ASÍNCRONA 4 para simular la carga inicial de sucursales.
  useEffect(() => {
    if (!user?.emailVerified) {
      setOrders([]);
      setOrdersLoading(false);
      setOrdersError("");
      return undefined;
    }

    if (user.role !== "admin" && !user.uid) {
      setOrders([]);
      setOrdersLoading(false);
      setOrdersError("No tienes permisos para ver pedidos");
      return undefined;
    }

    setOrdersLoading(true);
    setOrdersError("");

    const ordersQuery = user.role === "admin"
      ? collection(db, "pedidos")
      : query(collection(db, "pedidos"), where("usuarioId", "==", user.uid));

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const firestoreOrders = snapshot.docs
          .map((orderDoc) => normalizeOrder(orderDoc.data(), orderDoc.id))
          .sort((a, b) => {
            const dateA = typeof a.creadoEn?.toMillis === "function" ? a.creadoEn.toMillis() : new Date(a.creadoEn || 0).getTime();
            const dateB = typeof b.creadoEn?.toMillis === "function" ? b.creadoEn.toMillis() : new Date(b.creadoEn || 0).getTime();
            return dateB - dateA;
          });
        setOrders(firestoreOrders);
        setOrdersLoading(false);
      },
      () => {
        setOrders([]);
        setOrdersError("No tienes permisos para ver pedidos");
        setOrdersLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.emailVerified, user?.role, user?.uid]);

  // Persistir en localStorage
  useEffect(() => {
    if (!productsLoading && !productsError && products.length > 0) saveToStorage("fd_products", products);
  }, [products, productsLoading, productsError]);
  useEffect(() => { saveToStorage("fd_user", user); }, [user]);
  useEffect(() => { saveToStorage("fd_cart", cart); }, [cart]);
  useEffect(() => { saveToStorage("fd_orders", orders); }, [orders]);
  useEffect(() => { saveToStorage("fd_registered_users", registeredUsers); }, [registeredUsers]);

  // ── Autenticación ──────────────────────────────────────────────────────────
  const login = (email, password) => {
    const found = registeredUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser({ ...found, emailVerified: true });
      return { success: true, role: found.role };
    }
    return { success: false, message: "Correo o contraseña incorrectos." };
  };

  // Login solo para usuarios normales (rechaza admin)
  const loginUser = async (email, password) => {
    try {
      const correo = email.trim().toLowerCase();
      const credential = await signInWithEmailAndPassword(auth, correo, password);
      const firebaseUser = credential.user;

      if (!firebaseUser.emailVerified) {
        await signOut(auth);
        setUser(null);
        return {
          success: false,
          requiresEmailVerification: true,
          message: "Debes verificar tu correo antes de iniciar sesion.",
        };
      }

      const userRef = doc(db, "usuarios", firebaseUser.uid);
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        correo,
        emailVerificado: true,
        estadoCuenta: "activo",
      }, { merge: true });

      const snapshot = await getDoc(userRef);
      const profile = snapshot.exists() ? snapshot.data() : {};
      const verifiedUser = {
        uid: firebaseUser.uid,
        name: profile.nombre || firebaseUser.displayName || correo,
        email: profile.correo || correo,
        phone: profile.telefono || "",
        address: profile.direccion || "",
        role: profile.rol || "cliente",
        emailVerified: true,
        estadoCuenta: "activo",
      };

      setRegisteredUsers(prev => {
        const withoutExisting = prev.filter(u => u.email !== verifiedUser.email);
        return [...withoutExisting, verifiedUser];
      });
      setUser(verifiedUser);
      return { success: true, role: verifiedUser.role };
    } catch (error) {
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        return { success: false, message: "Correo o contrasena incorrectos." };
      }
      return { success: false, message: "No se pudo iniciar sesion. Intentalo de nuevo." };
    }

    const found = registeredUsers.find(u => u.email === email && u.password === password);
    if (found && found.role === "admin") {
      return { success: false, message: "Credenciales no válidas." };
    }
    if (found) {
      setUser(found);
      return { success: true, role: found.role };
    }
    return { success: false, message: "Correo o contraseña incorrectos." };
  };

  // Login solo para admin (rechaza usuarios normales)
  const loginAdmin = (email, password) => {
    const found = registeredUsers.find(u => u.email === email && u.password === password);
    if (found && found.role === "admin") {
      setUser({ ...found, emailVerified: true });
      return { success: true, role: found.role };
    }
    if (found) {
      return { success: false, message: "Acceso denegado. Esta área es solo para administradores." };
    }
    return { success: false, message: "Credenciales de administrador incorrectas." };
  };

  const register = async (userData) => {
    const nombre = userData.name.trim();
    const correo = userData.email.trim().toLowerCase();
    const telefono = userData.phone?.trim() || "";
    const direccion = userData.address?.trim() || "";

    if (!nombre) return { success: false, message: "Ingresa tu nombre completo." };
    if (!correo) return { success: false, message: "Ingresa tu correo electronico." };
    if (!userData.password || userData.password.length < 6) {
      return { success: false, message: "La contrasena debe tener al menos 6 caracteres." };
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, correo, userData.password);
      const firebaseUser = credential.user;
      const newUser = {
        uid: firebaseUser.uid,
        name: nombre,
        email: correo,
        phone: telefono,
        address: direccion,
        role: "cliente",
        emailVerified: false,
        estadoCuenta: "pendiente_verificacion",
      };

      await setDoc(doc(db, "usuarios", firebaseUser.uid), {
        uid: firebaseUser.uid,
        nombre,
        correo,
        telefono,
        direccion,
        rol: "cliente",
        emailVerificado: false,
        estadoCuenta: "pendiente_verificacion",
        creadoEn: serverTimestamp(),
      });

      await sendEmailVerification(firebaseUser, actionCodeSettings);
      await signOut(auth);

      setRegisteredUsers(prev => {
        const withoutExisting = prev.filter(u => u.email !== correo);
        return [...withoutExisting, newUser];
      });
      setUser(null);
      return {
        success: true,
        message: "Tu cuenta fue creada. Te enviamos un correo de verificacion. Revisa tu bandeja de entrada o spam. Despues de verificar tu correo, inicia sesion.",
      };
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        return { success: false, message: "Este correo ya esta en uso." };
      }
      if (error.code === "auth/weak-password") {
        return { success: false, message: "La contrasena es muy debil. Usa al menos 6 caracteres." };
      }
      if (error.code === "auth/invalid-email") {
        return { success: false, message: "Ingresa un correo electronico valido." };
      }
      return { success: false, message: "No se pudo crear la cuenta. Intentalo de nuevo." };
    }
  };

  const resendVerificationEmail = async (email, password) => {
    try {
      const correo = email.trim().toLowerCase();
      const credential = await signInWithEmailAndPassword(auth, correo, password);
      await sendEmailVerification(credential.user, actionCodeSettings);
      await signOut(auth);
      setUser(null);
      return { success: true, message: "Te reenviamos el correo de verificacion. Revisa tu bandeja de entrada o spam." };
    } catch (error) {
      if (error.code === "auth/too-many-requests") {
        return { success: false, message: "Firebase bloqueo temporalmente los intentos. Espera unos minutos e intentalo de nuevo." };
      }
      return { success: false, message: "No pudimos reenviar el correo. Verifica tus datos e intentalo de nuevo." };
    }
  };

  const logout = () => {
    signOut(auth).catch(() => {});
    setUser(null);
  };

  const loadUserProfile = async (uid = user?.uid) => {
    if (!uid) return { success: false, message: "Error al cargar perfil" };

    try {
      const snapshot = await getDoc(doc(db, "usuarios", uid));
      if (!snapshot.exists()) return { success: false, message: "Error al cargar perfil" };

      const profile = normalizeUserProfile(snapshot.data(), user || {});
      setUser(profile);
      setRegisteredUsers(prev => {
        const withoutExisting = prev.filter(u => u.email !== profile.email);
        return [...withoutExisting, profile];
      });
      return { success: true, profile };
    } catch {
      return { success: false, message: "Error al cargar perfil" };
    }
  };

  const updateProfile = async (updatedData) => {
    if (!user?.uid) return { success: false, message: "Error al actualizar perfil" };

    const nombre = (updatedData.name || "").trim();
    const telefono = (updatedData.phone || "").trim();
    const direccion = (updatedData.address || "").trim();

    if (nombre.length > 50 || telefono.length > 100 || direccion.length > 100) {
      return { success: false, message: "Error al actualizar perfil" };
    }

    try {
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        nombre,
        correo: user.email,
        telefono,
        direccion,
        actualizadoEn: serverTimestamp(),
      }, { merge: true });

      const updated = {
        ...user,
        name: nombre,
        phone: telefono,
        address: direccion,
      };
      setUser(updated);
      setRegisteredUsers(prev => prev.map(u => u.email === updated.email ? updated : u));
      return { success: true, message: "Perfil actualizado correctamente" };
    } catch {
      return { success: false, message: "Error al actualizar perfil" };
    }
  };

  // ── Carrito ────────────────────────────────────────────────────────────────
  const addToCart = (product, quantity = 1) => {
    const stock = Math.max(0, Number(product.stock ?? 0));
    if (stock <= 0) return { success: false, message: "Producto agotado" };

    const safeQuantity = Math.min(stock, 9999, Math.max(1, Number(quantity) || 1));
    const cartProduct = normalizeProduct(product);
    const cartItem = {
      id: cartProduct.id,
      nombre: cartProduct.nombre,
      name: cartProduct.name,
      precio: cartProduct.precio,
      price: cartProduct.price,
      imagenUrl: cartProduct.imagenUrl,
      imageUrl: cartProduct.imageUrl,
      image: cartProduct.image,
      stock: cartProduct.stock,
      cantidad: safeQuantity,
      quantity: safeQuantity,
    };

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: Math.min(stock, 9999, item.quantity + safeQuantity),
                cantidad: Math.min(stock, 9999, item.quantity + safeQuantity),
              }
            : item
        );
      }
      return [...prev, cartItem];
    });
    return { success: true };
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    setCart(prev => prev.map(item => {
      if (item.id !== id) return item;
      const maxQuantity = Math.min(9999, Math.max(1, Number(item.stock) || 9999));
      const nextQuantity = Math.min(maxQuantity, Math.max(1, Number(quantity) || 1));
      return { ...item, quantity: nextQuantity, cantidad: nextQuantity };
    }));
  };
  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // ── Pedidos ────────────────────────────────────────────────────────────────
  const placeOrder = async (sucursal) => {
    if (!user?.uid || !user?.emailVerified) {
      return { success: false, message: "Debes iniciar sesión para finalizar la compra." };
    }

    const selectedBranchName = String(sucursal || "").trim();
    if (!selectedBranchName) {
      return { success: false, message: "Selecciona una sucursal para recoger tu pedido." };
    }

    const orderItems = cart.map(buildOrderProduct);
    const total = Number(cartTotal.toFixed(2));
    const orderRef = doc(collection(db, "pedidos"));
    const createdAt = new Date().toISOString();
    const orderPayload = {
      usuarioId: user.uid,
      clienteNombre: user.name || user.email,
      clienteCorreo: user.email,
      clienteTelefono: user.phone || "",
      productos: orderItems,
      total,
      sucursal: selectedBranchName,
      tipoEntrega: "recoger_sucursal",
      estado: "pendiente",
      creadoEn: serverTimestamp(),
      actualizadoEn: serverTimestamp(),
      archivado: false,
    };

    try {
      await runTransaction(db, async (transaction) => {
        const productSnapshots = [];

        for (const item of orderItems) {
          const productRef = doc(db, "productos", String(item.id));
          const snapshot = await transaction.get(productRef);
          if (!snapshot.exists()) throw new Error("NO_STOCK");

          const currentStock = Number(snapshot.data().stock || 0);
          if (currentStock < item.cantidad) throw new Error("NO_STOCK");

          productSnapshots.push({ productRef, id: item.id, nextStock: currentStock - item.cantidad });
        }

        productSnapshots.forEach(({ productRef, nextStock }) => {
          transaction.update(productRef, {
            stock: nextStock,
            actualizadoEn: serverTimestamp(),
          });
        });

        transaction.set(orderRef, orderPayload);
      });

      setProducts(prev => prev.map(product => {
        const orderedItem = orderItems.find(item => String(item.id) === String(product.id));
        return orderedItem
          ? { ...product, stock: Math.max(0, Number(product.stock || 0) - orderedItem.cantidad) }
          : product;
      }));

      const order = normalizeOrder({
        ...orderPayload,
        creadoEn: createdAt,
        actualizadoEn: createdAt,
      }, orderRef.id);
      setOrders(prev => [order, ...prev.filter(existing => existing.id !== order.id)]);
      clearCart();
      return { success: true, message: "Pedido creado correctamente", order };
    } catch (error) {
      if (error.message === "NO_STOCK") {
        return { success: false, message: "No hay suficiente stock para uno o más productos." };
      }
      return { success: false, message: "Error al crear el pedido" };
    }
  };

  const updateOrderStatus = async (orderId, status = "entregado") => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para ver pedidos" };
    }

    if (status !== "entregado" || !ORDER_STATUSES.includes(status)) {
      return { success: false, message: "Error al actualizar pedido" };
    }

    try {
      await updateDoc(doc(db, "pedidos", String(orderId)), {
        estado: "entregado",
        actualizadoEn: serverTimestamp(),
      });
      setOrders(prev => prev.map(o => String(o.id) === String(orderId) ? { ...o, estado: "entregado", status: "entregado" } : o));
      return { success: true, message: "Pedido marcado como entregado" };
    } catch {
      return { success: false, message: "Error al actualizar pedido" };
    }
  };

  const archiveOrder = async (orderId) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para ver pedidos" };
    }

    try {
      await updateDoc(doc(db, "pedidos", String(orderId)), {
        estado: "archivado",
        archivado: true,
        actualizadoEn: serverTimestamp(),
      });
      setOrders(prev => prev.filter(o => String(o.id) !== String(orderId)));
      return { success: true, message: "Pedido archivado correctamente" };
    } catch {
      return { success: false, message: "Error al actualizar pedido" };
    }
  };

  const deleteOrder = archiveOrder;

  // ── Admin: Productos ───────────────────────────────────────────────────────
  const addProduct = (product) => {
    const newProduct = normalizeProduct(product, product.id || Date.now());
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = async (id, data) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta acción" };
    }

    try {
      const payload = buildProductFirestorePayload(data);
      await updateDoc(doc(db, "productos", String(id)), payload);

      const updatedProduct = normalizeProduct({
        ...data,
        ...payload,
        actualizadoEn: new Date().toISOString(),
      }, id);
      setProducts(prev => prev.map(p => String(p.id) === String(id) ? { ...p, ...updatedProduct } : p));
      return { success: true, message: "Producto actualizado correctamente" };
    } catch {
      return { success: false, message: "Error al actualizar producto" };
    }
  };

  const deleteProduct = async (id) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta acción" };
    }

    try {
      await deleteDoc(doc(db, "productos", String(id)));
      setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
      setCart(prev => prev.filter(item => String(item.id) !== String(id)));
      return { success: true, message: "Producto eliminado correctamente" };
    } catch {
      return { success: false, message: "Error al eliminar producto" };
    }
  };

  const toggleFeatured = async (id) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta acción" };
    }

    const currentProduct = products.find(p => String(p.id) === String(id));
    if (!currentProduct) return { success: false, message: "Error al actualizar producto" };

    const nextFeatured = !currentProduct.featured;
    try {
      await updateDoc(doc(db, "productos", String(id)), {
        destacado: nextFeatured,
        actualizadoEn: serverTimestamp(),
      });
      setProducts(prev => prev.map(p => String(p.id) === String(id)
        ? {
            ...p,
            destacado: nextFeatured,
            featured: nextFeatured,
            actualizadoEn: new Date().toISOString(),
          }
        : p
      ));
      return {
        success: true,
        message: nextFeatured ? "Producto marcado como destacado" : "Producto quitado de destacados",
      };
    } catch {
      return { success: false, message: "Error al actualizar producto" };
    }
  };

  // ── Admin: Sucursales ──────────────────────────────────────────────────────
  const addBranch = async (branch) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta accion" };
    }

    try {
      const branchRef = doc(collection(db, "sucursales"));
      await setDoc(branchRef, {
        ...buildBranchFirestorePayload({ ...branch, active: true }),
        creadoEn: serverTimestamp(),
      });
      return { success: true, message: `"${branch.name}" agregada correctamente.` };
    } catch {
      return { success: false, message: "Error al guardar la sucursal" };
    }
  };

  const updateBranch = async (id, data) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta accion" };
    }

    try {
      const currentBranch = branches.find(branch => String(branch.id) === String(id));
      await setDoc(doc(db, "sucursales", String(id)), buildBranchFirestorePayload({ ...currentBranch, ...data }), { merge: true });
      return { success: true, message: `"${data.name}" actualizada correctamente.` };
    } catch {
      return { success: false, message: "Error al actualizar la sucursal" };
    }
  };

  const deleteBranch = async (id) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta accion" };
    }

    try {
      await deleteDoc(doc(db, "sucursales", String(id)));
      return { success: true, message: "Sucursal eliminada." };
    } catch {
      return { success: false, message: "Error al eliminar la sucursal" };
    }
  };

  const toggleBranch = async (id) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta accion" };
    }

    const currentBranch = branches.find(branch => String(branch.id) === String(id));
    if (!currentBranch) return { success: false, message: "Sucursal no encontrada" };

    try {
      const nextActive = !currentBranch.active;
      await setDoc(doc(db, "sucursales", String(id)), {
        activa: nextActive,
        actualizadoEn: serverTimestamp(),
      }, { merge: true });
      return { success: true, message: nextActive ? "Sucursal activada." : "Sucursal desactivada." };
    } catch {
      return { success: false, message: "Error al actualizar la sucursal" };
    }
  };

  // ── Admin: Banners ─────────────────────────────────────────────────────────
  const addBanner = async (banner) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta accion" };
    }

    try {
      const bannerRef = doc(collection(db, "banners"));
      await setDoc(bannerRef, {
        ...buildBannerFirestorePayload({ ...banner, active: true }, banners.length + 1),
        creadoEn: serverTimestamp(),
      });
      return { success: true, message: "Banner agregado correctamente." };
    } catch {
      return { success: false, message: "Error al guardar el banner" };
    }
  };

  const updateBanner = async (id, data) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta accion" };
    }

    try {
      const currentBanner = banners.find(banner => String(banner.id) === String(id));
      await setDoc(doc(db, "banners", String(id)), buildBannerFirestorePayload({ ...currentBanner, ...data }), { merge: true });
      return { success: true, message: "Banner actualizado correctamente." };
    } catch {
      return { success: false, message: "Error al actualizar el banner" };
    }
  };

  const deleteBanner = async (id) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta accion" };
    }

    try {
      await deleteDoc(doc(db, "banners", String(id)));
      return { success: true, message: "Banner eliminado." };
    } catch {
      return { success: false, message: "Error al eliminar el banner" };
    }
  };

  const toggleBanner = async (id) => {
    if (user?.role !== "admin") {
      return { success: false, message: "No tienes permisos para realizar esta accion" };
    }

    const currentBanner = banners.find(banner => String(banner.id) === String(id));
    if (!currentBanner) return { success: false, message: "Banner no encontrado" };

    try {
      const nextActive = !currentBanner.active;
      await setDoc(doc(db, "banners", String(id)), {
        activo: nextActive,
        actualizadoEn: serverTimestamp(),
      }, { merge: true });
      return { success: true, message: nextActive ? "Banner activado." : "Banner desactivado." };
    } catch {
      return { success: false, message: "Error al actualizar el banner" };
    }
  };

  const value = {
    // Data
    products, productsLoading, productsError, branches, banners, user, cart, orders, ordersLoading, ordersError, registeredUsers,
    // Computed
    cartTotal, cartCount,
    featuredProducts,
    activeBanners,
    // Auth
    login, loginUser, loginAdmin, register, resendVerificationEmail, logout, loadUserProfile, updateProfile,
    // Cart
    addToCart, removeFromCart, updateCartQuantity, clearCart,
    // Orders
    placeOrder,
    // Admin
    updateOrderStatus,
    archiveOrder, deleteOrder,
    addProduct, updateProduct, deleteProduct, toggleFeatured,
    addBranch, updateBranch, deleteBranch, toggleBranch,
    addBanner, updateBanner, deleteBanner, toggleBanner,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
// El hook comparte archivo con el proveedor para conservar la estructura actual.
// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
