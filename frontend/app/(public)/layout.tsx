"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Script from "next/script";
import "../globals.css";
import { CartProvider } from "../context/CartContext";
import CartSidebar from "../components/CartSidebar";
import { useCart } from "../context/CartContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { showCartSidebar, setShowCartSidebar } = useCart();
  
  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" />
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Raleway:wght@600;800&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/css/style.css" />
      <link rel="stylesheet" href="/css/custom.css" />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartSidebar isOpen={showCartSidebar} onClose={() => setShowCartSidebar(false)} />
      <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" />
    </>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <LayoutContent>{children}</LayoutContent>
    </CartProvider>
  );
}
