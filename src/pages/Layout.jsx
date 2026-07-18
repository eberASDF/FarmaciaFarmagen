import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import { useApp } from "../context/AppContext";

export default function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartNotifications, dismissCartNotification } = useApp();

  const handleNotificationClick = (notification) => {
    if (notification.action !== "open-cart") return;
    setIsCartOpen(true);
    dismissCartNotification(notification.id);
  };

  return (
    <div className="site-layout">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <div className="cart-toast-stack" aria-live="polite" aria-atomic="false">
        {cartNotifications.map(notification => (
          <div
            key={notification.id}
            className={`cart-toast cart-toast--${notification.type} ${notification.leaving ? "cart-toast--leaving" : ""}`}
            role="status"
            onClick={() => handleNotificationClick(notification)}
          >
            {notification.message}
          </div>
        ))}
      </div>

      <main className="site-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
