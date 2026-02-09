"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { API_URL } from "../../../lib/api";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  createdAt: string;
}

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
      pending: { label: "En attente", color: "#ed8936", bgColor: "#fef6e7", icon: "⏳" },
      confirmed: { label: "Confirmée", color: "#1a365d", bgColor: "#eef2f7", icon: "✓" },
      shipped: { label: "Expédiée", color: "#805ad5", bgColor: "#f3e8ff", icon: "🚚" },
      delivered: { label: "Livrée", color: "#38a169", bgColor: "#e6ffed", icon: "✅" },
      cancelled: { label: "Annulée", color: "#c53030", bgColor: "#fff5f5", icon: "❌" }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPaymentLabel = (method: string) => {
    return method === "cash" ? "💵 Paiement à la livraison" : "💳 Carte bancaire";
  };

  const filteredOrders = filterStatus 
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  const getOrderStats = () => ({
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    inProgress: orders.filter(o => ["confirmed", "shipped"].includes(o.status)).length
  });

  const stats = getOrderStats();

  const downloadPDF = async (order: Order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const orderRef = order._id.slice(-8).toUpperCase();
    
    // Couleurs du site
    const primaryBlue = [26, 54, 93];
    const accentRed = [197, 48, 48];
    const lightGray = [248, 249, 250];
    const darkText = [26, 26, 26];
    const grayText = [107, 114, 128];

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

    // En-tête
    doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.rect(0, 0, pageWidth, 8, 'F');
    
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 8, pageWidth, 35, 'F');
    
    if (logoData) {
      doc.addImage(logoData, 'PNG', 15, 12, 45, 25);
    }
    
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.roundedRect(pageWidth - 75, 15, 60, 22, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("BON DE LIVRAISON", pageWidth - 45, 28, { align: "center" });
    
    doc.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setLineWidth(0.5);
    doc.line(15, 45, pageWidth - 15, 45);

    // Informations
    const infoY = 55;
    
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
    doc.text(new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }), 50, infoY + 28);
    
    doc.text(`Paiement:`, 20, infoY + 36);
    doc.text(order.paymentMethod === 'card' ? 'Carte bancaire' : 'À la livraison', 50, infoY + 36);
    
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.roundedRect(105, infoY, 90, 45, 3, 3, 'F');
    
    doc.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("LIVRAISON", 110, infoY + 10);
    
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(order.shippingAddress.fullName, 110, infoY + 20);
    doc.setFont("helvetica", "normal");
    doc.text(order.shippingAddress.address, 110, infoY + 28);
    doc.text(`${order.shippingAddress.postalCode} ${order.shippingAddress.city}`, 110, infoY + 36);
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text(`Tél: ${order.shippingAddress.phone}`, 110, infoY + 44);

    // Tableau des produits
    const tableData = order.items.map(item => [
      item.product?.name || 'Produit',
      item.quantity.toString(),
      `${item.price.toFixed(3)} DT`,
      `${(item.price * item.quantity).toFixed(3)} DT`
    ]);
    
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = order.totalAmount - subtotal;
    
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
      bodyStyles: { fontSize: 9, cellPadding: 5 },
      alternateRowStyles: { fillColor: [252, 252, 253] },
      styles: { lineColor: [229, 231, 235], lineWidth: 0.1 },
      columnStyles: {
        0: { cellWidth: 85 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: 15, right: 15 }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    
    // Totaux
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
    doc.text(`${order.totalAmount.toFixed(3)} DT`, pageWidth - 20, finalY + 35, { align: "right" });

    // Pied de page
    doc.setFillColor(accentRed[0], accentRed[1], accentRed[2]);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("W.STORE - Informatique, Smartphones & Accessoires", pageWidth / 2, pageHeight - 17, { align: "center" });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("+216 52 255 145 / 48 018 250  |  wstore887@gmail.com  |  www.wstore.tn", pageWidth / 2, pageHeight - 10, { align: "center" });
    
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Merci pour votre confiance !", pageWidth / 2, pageHeight - 30, { align: "center" });

    doc.save(`bon-livraison-${orderRef}.pdf`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border" style={{ width: "3rem", height: "3rem", color: "#1a365d" }}>
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 200px)", backgroundColor: "#ffffff", padding: "2rem 0" }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1a365d", marginBottom: "0.3rem" }}>
              MES COMMANDES
            </h1>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>Suivez l'état de vos commandes</p>
          </div>
          <Link href="/client" className="btn" style={{ borderRadius: "10px", padding: "8px 20px", border: "2px solid #1a365d", color: "#1a365d", fontWeight: "600", fontSize: "0.9rem" }}>
            ← Retour
          </Link>
        </div>

        {/* Stats rapides */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card border-0" style={{ borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1a365d" }}>{stats.total}</div>
                <small className="text-muted">Total</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0" style={{ borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ed8936" }}>{stats.pending}</div>
                <small className="text-muted">En attente</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0" style={{ borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1a365d" }}>{stats.inProgress}</div>
                <small className="text-muted">En cours</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0" style={{ borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div className="card-body text-center py-3">
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#38a169" }}>{stats.delivered}</div>
                <small className="text-muted">Livrées</small>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="card border-0 mb-4" style={{ borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <div className="card-body py-3">
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="text-muted me-2" style={{ fontSize: "0.9rem" }}>Filtrer:</span>
              <button 
                className="btn btn-sm"
                style={{ 
                  borderRadius: "8px", 
                  backgroundColor: !filterStatus ? '#1a365d' : 'transparent',
                  color: !filterStatus ? 'white' : '#1a365d',
                  border: '1.5px solid #1a365d',
                  fontWeight: '600',
                  fontSize: '0.8rem'
                }}
                onClick={() => setFilterStatus("")}
              >
                Toutes ({orders.length})
              </button>
              <button 
                className="btn btn-sm"
                style={{ 
                  borderRadius: "8px",
                  backgroundColor: filterStatus === 'pending' ? '#ed8936' : 'transparent',
                  color: filterStatus === 'pending' ? 'white' : '#ed8936',
                  border: '1.5px solid #ed8936',
                  fontWeight: '600',
                  fontSize: '0.8rem'
                }}
                onClick={() => setFilterStatus("pending")}
              >
                ⏳ En attente
              </button>
              <button 
                className="btn btn-sm"
                style={{ 
                  borderRadius: "8px",
                  backgroundColor: filterStatus === 'confirmed' ? '#1a365d' : 'transparent',
                  color: filterStatus === 'confirmed' ? 'white' : '#1a365d',
                  border: '1.5px solid #1a365d',
                  fontWeight: '600',
                  fontSize: '0.8rem'
                }}
                onClick={() => setFilterStatus("confirmed")}
              >
                ✓ Confirmées
              </button>
              <button 
                className="btn btn-sm"
                style={{ 
                  borderRadius: "8px",
                  backgroundColor: filterStatus === 'shipped' ? '#805ad5' : 'transparent',
                  color: filterStatus === 'shipped' ? 'white' : '#805ad5',
                  border: '1.5px solid #805ad5',
                  fontWeight: '600',
                  fontSize: '0.8rem'
                }}
                onClick={() => setFilterStatus("shipped")}
              >
                🚚 Expédiées
              </button>
              <button 
                className="btn btn-sm"
                style={{ 
                  borderRadius: "8px",
                  backgroundColor: filterStatus === 'delivered' ? '#38a169' : 'transparent',
                  color: filterStatus === 'delivered' ? 'white' : '#38a169',
                  border: '1.5px solid #38a169',
                  fontWeight: '600',
                  fontSize: '0.8rem'
                }}
                onClick={() => setFilterStatus("delivered")}
              >
                ✅ Livrées
              </button>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        {filteredOrders.length > 0 ? (
          <div className="row g-3">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order._id} className="col-12">
                  <div 
                    className="card border-0" 
                    style={{ 
                      borderRadius: "12px", 
                      overflow: "hidden",
                      borderLeft: `4px solid ${statusInfo.color}`,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
                    }}
                  >
                    <div className="card-body p-3">
                      {/* En-tête de la commande */}
                      <div className="d-flex flex-wrap justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="mb-1" style={{ fontWeight: "700", color: "#1a365d" }}>
                            Commande #{order._id.slice(-8).toUpperCase()}
                          </h6>
                          <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                            Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        </div>
                        <span 
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "0.75rem",
                            fontWeight: "600"
                          }}
                        >
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </div>

                      {/* Produits de la commande */}
                      <div className="mb-3">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div 
                            key={index} 
                            className="d-flex align-items-center mb-2 p-2" 
                            style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
                          >
                            <div 
                              style={{ 
                                width: "50px", 
                                height: "50px", 
                                borderRadius: "6px",
                                overflow: "hidden",
                                backgroundColor: "#e9ecef",
                                flexShrink: 0
                              }}
                            >
                              {item.product?.image ? (
                                <img 
                                  src={item.product.image.startsWith('http') ? item.product.image : `${API_URL}${item.product.image}`}
                                  alt={item.product?.name || "Produit"}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              ) : (
                                <div className="d-flex align-items-center justify-content-center h-100">
                                  <span style={{ fontSize: "1.2rem" }}>📦</span>
                                </div>
                              )}
                            </div>
                            <div className="ms-3 flex-grow-1">
                              <p className="mb-0" style={{ fontWeight: "500", color: "#1a365d", fontSize: "0.9rem" }}>
                                {item.product?.name || "Produit non disponible"}
                              </p>
                              <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                                Qté: {item.quantity} × {item.price.toFixed(3)} DT
                              </small>
                            </div>
                            <div style={{ fontWeight: "600", color: "#c53030", fontSize: "0.9rem" }}>
                              {(item.quantity * item.price).toFixed(3)} DT
                            </div>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-muted text-center mb-0 mt-2" style={{ fontSize: "0.8rem" }}>
                            + {order.items.length - 2} autre(s) article(s)
                          </p>
                        )}
                      </div>

                      {/* Footer de la commande */}
                      <div className="d-flex flex-wrap justify-content-between align-items-center pt-3" style={{ borderTop: "1px solid #eee" }}>
                        <div className="d-flex gap-4">
                          <div>
                            <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Articles</small>
                            <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                          </div>
                          <div>
                            <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Paiement</small>
                            <span style={{ fontSize: "0.85rem" }}>{order.paymentMethod === "cash" ? "💵 Espèces" : "💳 Carte"}</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div className="text-end">
                            <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Total</small>
                            <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#c53030" }}>
                              {order.totalAmount.toFixed(3)} DT
                            </span>
                          </div>
                          <button 
                            className="btn"
                            style={{ borderRadius: "8px", padding: "6px 16px", border: "2px solid #1a365d", color: "#1a365d", fontWeight: "600", fontSize: "0.85rem" }}
                            onClick={() => setSelectedOrder(order)}
                          >
                            Détails
                          </button>
                          <button 
                            className="btn"
                            style={{ borderRadius: "8px", padding: "6px 16px", backgroundColor: "#38a169", color: "white", fontWeight: "600", fontSize: "0.85rem", border: "none" }}
                            onClick={() => downloadPDF(order)}
                          >
                            <i className="fas fa-download me-2"></i>
                            Bon de livraison
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card border-0" style={{ borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div className="card-body text-center py-5">
              <div style={{ fontSize: "4rem", opacity: 0.3 }}>🛒</div>
              <h5 style={{ color: "#1a365d", fontWeight: "600", marginTop: "1rem" }}>
                {filterStatus ? "Aucune commande avec ce statut" : "Vous n'avez pas encore de commandes"}
              </h5>
              <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
                {filterStatus ? "Essayez un autre filtre" : "Découvrez nos produits et passez votre première commande !"}
              </p>
              {!filterStatus && (
                <Link href="/" className="btn" style={{ borderRadius: "10px", padding: "10px 25px", background: "linear-gradient(135deg, #c53030 0%, #e53e3e 100%)", color: "white", fontWeight: "600" }}>
                  Commencer mes achats
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedOrder && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }} 
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ borderRadius: "16px", border: "none" }}>
              <div className="modal-header border-0 pb-0">
                <div>
                  <h5 className="modal-title" style={{ fontWeight: "700", color: "#1a365d" }}>
                    Commande #{selectedOrder._id.slice(-8).toUpperCase()}
                  </h5>
                  <small className="text-muted">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Suivi de commande */}
                <div className="mb-4">
                  <h6 className="text-muted mb-3" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                    SUIVI DE COMMANDE
                  </h6>
                  <div className="d-flex justify-content-between position-relative" style={{ padding: "0 20px" }}>
                    <div 
                      style={{ 
                        position: "absolute", 
                        top: "15px", 
                        left: "40px", 
                        right: "40px", 
                        height: "3px", 
                        backgroundColor: "#e9ecef",
                        zIndex: 0
                      }}
                    >
                      <div 
                        style={{ 
                          height: "100%", 
                          backgroundColor: "#38a169",
                          width: selectedOrder.status === "pending" ? "0%" :
                                 selectedOrder.status === "confirmed" ? "33%" :
                                 selectedOrder.status === "shipped" ? "66%" :
                                 selectedOrder.status === "delivered" ? "100%" : "0%",
                          transition: "width 0.5s ease"
                        }}
                      ></div>
                    </div>
                    {["pending", "confirmed", "shipped", "delivered"].map((status, index) => {
                      const statusInfo = getStatusInfo(status);
                      const isActive = ["pending", "confirmed", "shipped", "delivered"].indexOf(selectedOrder.status) >= index;
                      const isCurrent = selectedOrder.status === status;
                      return (
                        <div key={status} className="text-center" style={{ zIndex: 1 }}>
                          <div 
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: isActive ? statusInfo.color : "#e9ecef",
                              color: isActive ? "white" : "#adb5bd",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto 6px",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                              boxShadow: isCurrent ? `0 0 0 3px ${statusInfo.bgColor}` : "none",
                              transition: "all 0.3s ease"
                            }}
                          >
                            {isActive ? "✓" : index + 1}
                          </div>
                          <small 
                            style={{ 
                              color: isActive ? statusInfo.color : "#adb5bd",
                              fontWeight: isCurrent ? "600" : "400",
                              fontSize: "0.7rem"
                            }}
                          >
                            {statusInfo.label}
                          </small>
                        </div>
                      );
                    })}
                  </div>
                  {selectedOrder.status === "cancelled" && (
                    <div className="alert alert-danger mt-3 mb-0" style={{ borderRadius: "8px", fontSize: "0.9rem" }}>
                      <strong>❌ Commande annulée</strong>
                    </div>
                  )}
                </div>

                {/* Adresse de livraison */}
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <h6 className="text-muted mb-2" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                      ADRESSE DE LIVRAISON
                    </h6>
                    <div className="p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                      <p className="mb-1" style={{ fontWeight: "600", fontSize: "0.9rem" }}>{selectedOrder.shippingAddress?.fullName}</p>
                      <p className="mb-1 text-muted" style={{ fontSize: "0.85rem" }}>{selectedOrder.shippingAddress?.address}</p>
                      <p className="mb-1 text-muted" style={{ fontSize: "0.85rem" }}>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                      <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>📞 {selectedOrder.shippingAddress?.phone}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                      MODE DE PAIEMENT
                    </h6>
                    <div className="p-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
                      <p className="mb-0" style={{ fontSize: "0.95rem" }}>
                        {getPaymentLabel(selectedOrder.paymentMethod)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Articles */}
                <h6 className="text-muted mb-3" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                  ARTICLES ({selectedOrder.items.length})
                </h6>
                <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                  {selectedOrder.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="d-flex align-items-center mb-2 p-2" 
                      style={{ backgroundColor: "#f8f9fa", borderRadius: "10px" }}
                    >
                      <div 
                        style={{ 
                          width: "55px", 
                          height: "55px", 
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "#e9ecef",
                          flexShrink: 0
                        }}
                      >
                        {item.product?.image ? (
                          <img 
                            src={item.product.image.startsWith('http') ? item.product.image : `${API_URL}${item.product.image}`}
                            alt={item.product?.name || "Produit"}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center h-100">
                            <span style={{ fontSize: "1.5rem" }}>📦</span>
                          </div>
                        )}
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <p className="mb-1" style={{ fontWeight: "600", color: "#1a365d", fontSize: "0.9rem" }}>
                          {item.product?.name || "Produit non disponible"}
                        </p>
                        <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                          {item.quantity} × {item.price.toFixed(3)} DT
                        </small>
                      </div>
                      <div style={{ fontWeight: "700", color: "#c53030", fontSize: "0.95rem" }}>
                        {(item.quantity * item.price).toFixed(3)} DT
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div 
                  className="d-flex justify-content-between align-items-center mt-4 p-3" 
                  style={{ 
                    background: "linear-gradient(135deg, #1a365d 0%, #2c5282 100%)", 
                    borderRadius: "10px",
                    color: "white"
                  }}
                >
                  <span style={{ fontSize: "0.95rem", fontWeight: "500" }}>Total de la commande</span>
                  <span style={{ fontSize: "1.3rem", fontWeight: "700" }}>
                    {selectedOrder.totalAmount.toFixed(3)} DT
                  </span>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button 
                  type="button" 
                  className="btn" 
                  style={{ borderRadius: "8px", backgroundColor: "#38a169", color: "white", fontWeight: "600" }}
                  onClick={() => downloadPDF(selectedOrder)}
                >
                  <i className="fas fa-download me-2"></i>
                  Télécharger le bon
                </button>
                <button 
                  type="button" 
                  className="btn" 
                  style={{ borderRadius: "8px", backgroundColor: "#6b7280", color: "white", fontWeight: "600" }}
                  onClick={() => setSelectedOrder(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
