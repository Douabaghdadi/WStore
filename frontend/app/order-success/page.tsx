"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  status: string;
  createdAt: string;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderRef, setOrderRef] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ref = searchParams.get("ref");
    const orderId = searchParams.get("id");
    if (!ref) {
      router.push("/");
      return;
    }
    setOrderRef(ref);
    
    if (orderId) {
      const token = localStorage.getItem("token");
      fetch(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setOrder(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [searchParams, router]);

  const downloadPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Couleurs du site
    const primaryBlue = [26, 54, 93];    // #1a365d
    const accentRed = [197, 48, 48];     // #c53030
    const lightGray = [248, 249, 250];   // #f8f9fa
    const darkText = [26, 26, 26];       // #1a1a1a
    const grayText = [107, 114, 128];    // #6b7280

    // Charger le logo
    const loadImage = (url: string): Promise<string> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => resolve("");
        img.src = url;
      });
    };

    const logoData = await loadImage("/img/logo.png");

    // ===== EN-TÊTE =====
    // Bande rouge en haut
    doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.rect(0, 0, pageWidth, 8, 'F');
    
    // Zone header blanche
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 8, pageWidth, 35, 'F');
    
    // Logo
    if (logoData) {
      doc.addImage(logoData, 'PNG', 15, 12, 45, 25);
    }
    
    // Titre BON DE LIVRAISON
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.roundedRect(pageWidth - 75, 15, 60, 22, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("BON DE LIVRAISON", pageWidth - 45, 28, { align: "center" });
    
    // Ligne séparatrice
    doc.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setLineWidth(0.5);
    doc.line(15, 45, pageWidth - 15, 45);

    // ===== INFORMATIONS COMMANDE & CLIENT =====
    const infoY = 55;
    
    // Box Commande
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(15, infoY, 85, 45, 3, 3, 'F');
    
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("COMMANDE", 20, infoY + 10);
    
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Référence:`, 20, infoY + 20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.text(`#${orderRef}`, 50, infoY + 20);
    
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFont("helvetica", "normal");
    doc.text(`Date:`, 20, infoY + 28);
    doc.text(order ? new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('fr-FR'), 50, infoY + 28);
    
    doc.text(`Paiement:`, 20, infoY + 36);
    doc.text(order?.paymentMethod === 'card' ? 'Carte bancaire' : 'À la livraison', 50, infoY + 36);
    
    // Box Livraison
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(105, infoY, 90, 45, 3, 3, 'F');
    
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("LIVRAISON", 110, infoY + 10);
    
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFontSize(9);
    if (order) {
      doc.setFont("helvetica", "bold");
      doc.text(order.shippingAddress.fullName, 110, infoY + 20);
      doc.setFont("helvetica", "normal");
      doc.text(order.shippingAddress.address, 110, infoY + 28);
      doc.text(`${order.shippingAddress.postalCode} ${order.shippingAddress.city}`, 110, infoY + 36);
      doc.setTextColor(grayText[0], grayText[1], grayText[2]);
      doc.text(`Tél: ${order.shippingAddress.phone}`, 110, infoY + 44);
    }

    // ===== TABLEAU DES PRODUITS =====
    const tableData = order?.items.map(item => [
      item.product?.name || 'Produit',
      item.quantity.toString(),
      `${item.price.toFixed(3)} DT`,
      `${(item.price * item.quantity).toFixed(3)} DT`
    ]) || [];
    
    // Calculer sous-total et frais de livraison
    const subtotal = order?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const shipping = (order?.totalAmount || 0) - subtotal;
    
    autoTable(doc, {
      startY: infoY + 55,
      head: [['Désignation', 'Qté', 'Prix unitaire', 'Total']],
      body: tableData,
      headStyles: { 
        fillColor: [primaryBlue[0], primaryBlue[1], primaryBlue[2]], 
        textColor: 255, 
        fontStyle: 'bold',
        fontSize: 9,
        cellPadding: 6
      },
      bodyStyles: {
        fontSize: 9,
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [252, 252, 253]
      },
      styles: { 
        lineColor: [229, 231, 235],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 85 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: 15, right: 15 }
    });
    
    // Position après le tableau
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    
    // ===== TOTAUX =====
    const totalsX = pageWidth - 90;
    
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(totalsX - 5, finalY + 5, 80, 35, 3, 3, 'F');
    
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Sous-total:", totalsX, finalY + 15);
    doc.text(`${subtotal.toFixed(3)} DT`, pageWidth - 20, finalY + 15, { align: "right" });
    
    doc.text("Livraison:", totalsX, finalY + 23);
    doc.text(shipping > 0 ? `${shipping.toFixed(3)} DT` : "Gratuit", pageWidth - 20, finalY + 23, { align: "right" });
    
    doc.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.line(totalsX, finalY + 27, pageWidth - 15, finalY + 27);
    
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL TTC:", totalsX, finalY + 35);
    doc.setTextColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.text(`${order?.totalAmount.toFixed(3)} DT`, pageWidth - 20, finalY + 35, { align: "right" });

    // ===== PIED DE PAGE =====
    // Bande rouge en bas
    doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("W.STORE - Informatique, Smartphones & Accessoires", pageWidth / 2, pageHeight - 17, { align: "center" });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("+216 52 255 145 / 48 018 250  |  wstore887@gmail.com  |  www.wstore.tn", pageWidth / 2, pageHeight - 10, { align: "center" });
    
    // Message de remerciement
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Merci pour votre confiance !", pageWidth / 2, pageHeight - 30, { align: "center" });

    // Télécharger
    doc.save(`bon-livraison-${orderRef}.pdf`);
  };

  if (isLoading) {
    return (
      <div style={{ marginTop: "160px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner-grow" style={{ color: "#1a365d" }} role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "160px", backgroundColor: "#fafbfc", minHeight: "100vh", paddingBottom: "80px" }}>
      <div className="container py-5">
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "linear-gradient(135deg, #38a169 0%, #48bb78 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 25px", boxShadow: "0 15px 40px rgba(56,161,105,0.25)" }}>
            <i className="fas fa-check" style={{ fontSize: "40px", color: "white" }}></i>
          </div>
          
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#1a365d", marginBottom: "12px" }}>
            Commande confirmée !
          </h1>
          
          <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "30px", lineHeight: "1.6" }}>
            Merci pour votre commande. Nous avons bien reçu votre demande et nous la traitons dans les plus brefs délais.
          </p>
          
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "30px", boxShadow: "0 2px 15px rgba(0,0,0,0.04)", border: "1px solid #e5e7eb", marginBottom: "25px" }}>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "8px" }}>
                Référence de commande
              </span>
              <div style={{ display: "inline-block", padding: "10px 20px", backgroundColor: "#eef2f7", borderRadius: "10px", border: "2px dashed #1a365d" }}>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#1a365d", letterSpacing: "1px" }}>
                  #{orderRef}
                </span>
              </div>
            </div>
            
            <div style={{ borderTop: "2px solid #f3f4f6", paddingTop: "20px", marginTop: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", textAlign: "left" }}>
                <div style={{ padding: "16px", backgroundColor: "#fafbfc", borderRadius: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <i className="fas fa-envelope" style={{ fontSize: "16px", color: "#1a365d" }}></i>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a1a" }}>
                      Email de confirmation
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, lineHeight: "1.5" }}>
                    Vous recevrez un email avec les détails
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#fafbfc", borderRadius: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <i className="fas fa-truck" style={{ fontSize: "16px", color: "#1a365d" }}></i>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a1a" }}>
                      Livraison estimée
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, lineHeight: "1.5" }}>
                    2-4 jours ouvrables
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={downloadPDF}
              style={{ padding: "12px 28px", background: "linear-gradient(135deg, #38a169 0%, #48bb78 100%)", color: "white", textDecoration: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", boxShadow: "0 6px 18px rgba(56,161,105,0.25)", display: "inline-flex", alignItems: "center", gap: "8px", border: "none", cursor: "pointer" }}
            >
              <i className="fas fa-download"></i>
              Télécharger bon de livraison
            </button>
            <Link 
              href="/client/orders" 
              style={{ padding: "12px 28px", background: "linear-gradient(135deg, #c53030 0%, #e53e3e 100%)", color: "white", textDecoration: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", boxShadow: "0 6px 18px rgba(197,48,48,0.25)", display: "inline-block", border: "none", cursor: "pointer" }}
            >
              Voir mes commandes
            </Link>
            <Link 
              href="/" 
              style={{ padding: "12px 28px", backgroundColor: "white", color: "#1a365d", textDecoration: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", border: "2px solid #1a365d", display: "inline-block", cursor: "pointer" }}
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ marginTop: '160px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-grow" style={{ color: '#1a365d' }} role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
