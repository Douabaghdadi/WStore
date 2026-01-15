"use client";
import Script from "next/script";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartSidebar from "../components/CartSidebar";
import { useCart } from "../context/CartContext";

export default function PublicLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { showCartSidebar, setShowCartSidebar } = useCart();

  return (
    <>
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
      <CartSidebar isOpen={showCartSidebar} onClose={() => setShowCartSidebar(false)} />
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" />
    </>
  );
}
