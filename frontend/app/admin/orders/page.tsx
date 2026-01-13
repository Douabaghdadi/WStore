"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState(initialSearch);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          const updatedOrder = await response.json();
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const getStatusBadge = (status: string, large = false) => {
    const badges: any = {
      pending: { bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", icon: "mdi-clock-outline", text: "En attente" },
      confirmed: { bg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", icon: "mdi-check-circle-outline", text: "Confirmée" },
      shipped: { bg: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", icon: "mdi-truck-delivery-outline", text: "Expédiée" },
      delivered: { bg: "linear-gradient(135deg, #10b981 0%, #059669 100%)", icon: "mdi-package-variant", text: "Livrée" },
      cancelled: { bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", icon: "mdi-close-circle-outline", text: "Annulée" }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: large ? "10px 20px" : "6px 14px",
        background: badge.bg, color: "white", borderRadius: "50px",
        fontSize: large ? "0.95rem" : "0.8rem", fontWeight: 600,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
      }}>
        <i className={`mdi ${badge.icon}`}></i> {badge.text}
      </span>
    );
  };

  const getPaymentBadge = (method: string, large = false) => {
    const isCash = method === "cash";
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: large ? "10px 20px" : "6px 14px",
        background: isCash ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        color: "white", borderRadius: "50px",
        fontSize: large ? "0.95rem" : "0.8rem", fontWeight: 600,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
      }}>
        <i className={`mdi ${isCash ? "mdi-cash" : "mdi-credit-card"}`}></i>
        {isCash ? "Espèces" : "Carte"}
      </span>
    );
  };

  // Fonctions du calendrier
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const getOrdersCountForDate = (date: Date) => {
    return orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.toDateString() === date.toDateString();
    }).length;
  };

  const isSameDay = (date1: Date, date2: Date | null) => {
    if (!date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isSameDay(clickedDate, selectedDate)) {
      setSelectedDate(null);
    } else {
      setSelectedDate(clickedDate);
    }
    setCurrentPage(1);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const ordersCount = getOrdersCountForDate(date);
      const isSelected = isSameDay(date, selectedDate);
      const isTodayDate = isToday(date);
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isTodayDate ? 'today' : ''} ${ordersCount > 0 ? 'has-orders' : ''}`}
          onClick={() => handleDateClick(day)}
          style={{
            cursor: 'pointer', padding: '8px', textAlign: 'center', borderRadius: '8px',
            backgroundColor: isSelected ? '#ef4444' : ordersCount > 0 ? '#fef2f2' : 'transparent',
            color: isSelected ? 'white' : 'inherit',
            border: isTodayDate ? '2px solid #ef4444' : '1px solid transparent',
            position: 'relative', minHeight: '45px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontWeight: isTodayDate || isSelected ? 'bold' : 'normal' }}>{day}</span>
          {ordersCount > 0 && (
            <span style={{
              fontSize: '10px',
              backgroundColor: isSelected ? 'white' : '#ef4444',
              color: isSelected ? '#ef4444' : 'white',
              borderRadius: '10px', padding: '1px 6px', marginTop: '2px'
            }}>
              {ordersCount}
            </span>
          )}
        </div>
      );
    }
    
    return (
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-sm" style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" }} onClick={prevMonth}>
              <i className="mdi mdi-chevron-left"></i>
            </button>
            <h5 className="mb-0" style={{ color: "#ef4444" }}>
              <i className="mdi mdi-calendar"></i> {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h5>
            <button className="btn btn-sm" style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" }} onClick={nextMonth}>
              <i className="mdi mdi-chevron-right"></i>
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {dayNames.map(day => (
              <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', color: '#6c757d', fontSize: '12px', padding: '8px 0' }}>
                {day}
              </div>
            ))}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {days}
          </div>
          
          {selectedDate && (
            <div className="mt-3 pt-3 border-top">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  <i className="mdi mdi-filter"></i> Filtré par: <strong>{selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                </span>
                <button className="btn btn-sm" style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca" }} onClick={() => setSelectedDate(null)}>
                  <i className="mdi mdi-close"></i> Effacer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const filtered = orders.filter((order: any) => {
    const matchSearch = 
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress?.fullName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || order.status === filterStatus;
    const matchPayment = !filterPayment || order.paymentMethod === filterPayment;
    const matchDate = !selectedDate || new Date(order.createdAt).toDateString() === selectedDate.toDateString();
    return matchSearch && matchStatus && matchPayment && matchDate;
  }).sort((a: any, b: any) => {
    if (sortBy === "date-desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "date-asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "amount-desc") return b.totalAmount - a.totalAmount;
    if (sortBy === "amount-asc") return a.totalAmount - b.totalAmount;
    return 0;
  });

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterPayment("");
    setSortBy("date-desc");
    setSelectedDate(null);
    setCurrentPage(1);
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter((o: any) => o.status === "pending").length,
      confirmed: orders.filter((o: any) => o.status === "confirmed").length,
      shipped: orders.filter((o: any) => o.status === "shipped").length,
      delivered: orders.filter((o: any) => o.status === "delivered").length,
      cancelled: orders.filter((o: any) => o.status === "cancelled").length,
      totalRevenue: orders.filter((o: any) => o.status !== "cancelled").reduce((sum: number, o: any) => sum + o.totalAmount, 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">Gestion des Commandes</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Commandes</li>
                </ol>
              </nav>
            </div>

            {/* Statistiques */}
            <div className="row mb-4">
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card" style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "white" }}>
                  <div className="card-body">
                    <h4 className="font-weight-normal mb-3">Total Commandes<i className="mdi mdi-cart float-right" style={{ fontSize: "24px", opacity: 0.8 }}></i></h4>
                    <h2 className="mb-0">{stats.total}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "white" }}>
                  <div className="card-body">
                    <h4 className="font-weight-normal mb-3">En attente<i className="mdi mdi-clock-outline float-right" style={{ fontSize: "24px", opacity: 0.8 }}></i></h4>
                    <h2 className="mb-0">{stats.pending}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card" style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", color: "white" }}>
                  <div className="card-body">
                    <h4 className="font-weight-normal mb-3">En cours<i className="mdi mdi-truck-delivery float-right" style={{ fontSize: "24px", opacity: 0.8 }}></i></h4>
                    <h2 className="mb-0">{stats.confirmed + stats.shipped}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white" }}>
                  <div className="card-body">
                    <h4 className="font-weight-normal mb-3">Revenu Total<i className="mdi mdi-cash-multiple float-right" style={{ fontSize: "24px", opacity: 0.8 }}></i></h4>
                    <h2 className="mb-0">{stats.totalRevenue.toFixed(2)} TND</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendrier */}
            <div className="row mb-4">
              <div className="col-12">{renderCalendar()}</div>
            </div>

            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-4">Liste des commandes</h4>
                    
                    {/* Barre de recherche et filtres */}
                    <div className="mb-4">
                      <div className="row g-2 mb-3 align-items-center">
                        <div className="col-lg-6 col-md-12">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0"><i className="mdi mdi-magnify text-muted"></i></span>
                            <input type="text" className="form-control border-start-0 ps-0" placeholder="Rechercher par ID, client, email..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0"><i className="mdi mdi-sort text-muted"></i></span>
                            <select className="form-select border-start-0" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                              <option value="date-desc">📅 Plus récentes</option>
                              <option value="date-asc">📅 Plus anciennes</option>
                              <option value="amount-desc">💰 Montant décroissant</option>
                              <option value="amount-asc">💰 Montant croissant</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <button className={`btn w-100`} style={{ background: showFilters ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" : "#fef2f2", color: showFilters ? "white" : "#ef4444", border: showFilters ? "none" : "1px solid #fecaca" }} onClick={() => setShowFilters(!showFilters)}>
                            <i className={`mdi mdi-filter${showFilters ? '-remove' : '-variant'}`}></i> {showFilters ? 'Masquer filtres' : 'Afficher filtres'}
                          </button>
                        </div>
                      </div>

                      {showFilters && (
                        <div className="card shadow-sm border-0 mt-3" style={{ backgroundColor: '#f8f9fa' }}>
                          <div className="card-body">
                            <h6 className="mb-3" style={{ color: "#ef4444" }}><i className="mdi mdi-filter-variant"></i> Filtres avancés</h6>
                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label fw-bold small text-muted">STATUT</label>
                                <select className="form-select" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
                                  <option value="">Tous les statuts</option>
                                  <option value="pending">⏳ En attente</option>
                                  <option value="confirmed">✅ Confirmée</option>
                                  <option value="shipped">🚚 Expédiée</option>
                                  <option value="delivered">📦 Livrée</option>
                                  <option value="cancelled">❌ Annulée</option>
                                </select>
                              </div>
                              <div className="col-md-6">
                                <label className="form-label fw-bold small text-muted">MODE DE PAIEMENT</label>
                                <select className="form-select" value={filterPayment} onChange={(e) => { setFilterPayment(e.target.value); setCurrentPage(1); }}>
                                  <option value="">Tous les modes</option>
                                  <option value="cash">💵 Espèces</option>
                                  <option value="card">💳 Carte</option>
                                </select>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                              <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}><i className="mdi mdi-refresh"></i> Réinitialiser</button>
                              <span style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "white", padding: "6px 16px", borderRadius: "50px", fontSize: "0.85rem", fontWeight: 600 }}>{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Table des commandes */}
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID Commande</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Articles</th>
                            <th>Montant</th>
                            <th>Paiement</th>
                            <th>Statut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.length > 0 ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order: any) => (
                            <tr key={order._id}>
                              <td><span style={{ fontWeight: 700, color: "#ef4444" }}>#{order._id.slice(-8).toUpperCase()}</span></td>
                              <td>
                                <div><div className="font-weight-bold">{order.user?.name || "N/A"}</div><small className="text-muted">{order.user?.email || "N/A"}</small></div>
                              </td>
                              <td>
                                <div>{new Date(order.createdAt).toLocaleDateString('fr-FR')}<br /><small className="text-muted">{new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</small></div>
                              </td>
                              <td><span style={{ background: "#f1f5f9", padding: "4px 12px", borderRadius: "50px", fontSize: "0.85rem", fontWeight: 600 }}>{order.items?.length || 0} article{order.items?.length > 1 ? 's' : ''}</span></td>
                              <td style={{ fontWeight: 700, color: "#10b981" }}>{order.totalAmount.toFixed(2)} TND</td>
                              <td>{getPaymentBadge(order.paymentMethod)}</td>
                              <td>{getStatusBadge(order.status)}</td>
                              <td>
                                <button onClick={() => viewOrderDetails(order)} style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer" }} title="Voir détails">
                                  <i className="mdi mdi-eye"></i>
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={8} className="text-center py-4">
                                <i className="mdi mdi-cart-off" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                <p className="text-muted mt-2">Aucune commande trouvée</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {filtered.length > itemsPerPage && (
                      <div className="d-flex justify-content-center mt-3">
                        <nav>
                          <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button>
                            </li>
                            {[...Array(Math.ceil(filtered.length / itemsPerPage))].map((_, i) => (
                              <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                              </li>
                            ))}
                            <li className={`page-item ${currentPage === Math.ceil(filtered.length / itemsPerPage) ? 'disabled' : ''}`}>
                              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de détails de commande - Design moderne */}
      {showModal && selectedOrder && (
        <>
          <style>{`
            @keyframes modalSlideIn {
              from { opacity: 0; transform: scale(0.9) translateY(-20px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            .order-modal-overlay {
              position: fixed; top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
              display: flex; align-items: center; justify-content: center;
              z-index: 9999; padding: 20px;
            }
            .order-modal {
              background: white; border-radius: 24px; width: 100%; max-width: 900px;
              max-height: 90vh; overflow: hidden; box-shadow: 0 25px 80px rgba(0,0,0,0.3);
              animation: modalSlideIn 0.3s ease-out;
            }
            .order-modal-header {
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              padding: 24px 32px; color: white; position: relative; overflow: hidden;
            }
            .order-modal-header::before {
              content: ''; position: absolute; top: -50%; right: -20%;
              width: 60%; height: 200%; background: rgba(255,255,255,0.1);
              border-radius: 50%; pointer-events: none;
            }
            .order-modal-body { padding: 32px; overflow-y: auto; max-height: calc(90vh - 180px); }
            .info-section {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border-radius: 16px; padding: 20px; margin-bottom: 20px;
              border: 1px solid #e2e8f0;
            }
            .info-section-title {
              font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;
              color: #94a3b8; margin-bottom: 12px; font-weight: 700;
              display: flex; align-items: center; gap: 8px;
            }
            .info-section-title i { color: #ef4444; font-size: 1rem; }
            .info-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
            .info-row:last-child { margin-bottom: 0; }
            .info-label { color: #64748b; font-size: 0.85rem; min-width: 80px; }
            .info-value { color: #1e293b; font-weight: 600; font-size: 0.95rem; }
            .status-section {
              display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;
            }
            .status-card {
              background: white; border-radius: 16px; padding: 20px; text-align: center;
              border: 2px solid #e2e8f0; transition: all 0.3s;
            }
            .status-card:hover { border-color: #ef4444; transform: translateY(-2px); }
            .status-card-label {
              font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;
              color: #94a3b8; margin-bottom: 10px; font-weight: 700;
            }
            .product-table { width: 100%; border-collapse: separate; border-spacing: 0; }
            .product-table th {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              padding: 14px 16px; text-align: left; font-size: 0.75rem;
              text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;
              font-weight: 700; border-bottom: 2px solid #e2e8f0;
            }
            .product-table td {
              padding: 16px; border-bottom: 1px solid #f1f5f9; vertical-align: middle;
            }
            .product-table tr:last-child td { border-bottom: none; }
            .product-table tr:hover td { background: #fafafa; }
            .product-img {
              width: 60px; height: 60px; border-radius: 12px; object-fit: cover;
              border: 2px solid #f1f5f9;
            }
            .product-name { font-weight: 600; color: #1e293b; }
            .qty-badge {
              background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
              padding: 8px 16px; border-radius: 50px; font-weight: 700; color: #475569;
            }
            .price-cell { font-weight: 700; color: #10b981; font-size: 1rem; }
            .total-row {
              background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
              border-radius: 16px; padding: 20px; margin-top: 20px;
              display: flex; justify-content: space-between; align-items: center;
            }
            .total-label { font-size: 1.1rem; font-weight: 700; color: #1e293b; }
            .total-value { font-size: 1.5rem; font-weight: 800; color: #ef4444; }
            .action-buttons { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
            .action-btn {
              flex: 1; min-width: 150px; padding: 14px 24px; border: none; border-radius: 14px;
              font-weight: 600; cursor: pointer; display: flex; align-items: center;
              justify-content: center; gap: 8px; transition: all 0.3s; font-size: 0.95rem;
            }
            .action-btn:hover { transform: translateY(-2px); }
            .btn-confirm { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; }
            .btn-confirm:hover { box-shadow: 0 8px 25px rgba(59,130,246,0.4); }
            .btn-ship { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; }
            .btn-ship:hover { box-shadow: 0 8px 25px rgba(139,92,246,0.4); }
            .btn-deliver { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; }
            .btn-deliver:hover { box-shadow: 0 8px 25px rgba(16,185,129,0.4); }
            .btn-cancel { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; }
            .btn-cancel:hover { box-shadow: 0 8px 25px rgba(239,68,68,0.4); }
            .btn-close-modal {
              background: #f1f5f9; color: #64748b; padding: 14px 32px;
              border: none; border-radius: 14px; font-weight: 600; cursor: pointer;
              transition: all 0.3s;
            }
            .btn-close-modal:hover { background: #e2e8f0; }
          `}</style>
          
          <div className="order-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="order-modal" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="order-modal-header">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.2)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="mdi mdi-receipt" style={{ fontSize: "1.5rem" }}></i>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontWeight: 700, fontSize: "1.3rem" }}>Commande #{selectedOrder._id.slice(-8).toUpperCase()}</h4>
                        <p style={{ margin: 0, opacity: 0.9, fontSize: "0.9rem" }}>
                          <i className="mdi mdi-calendar-clock me-1"></i>
                          {new Date(selectedOrder.createdAt).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", width: "40px", height: "40px", borderRadius: "12px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="mdi mdi-close" style={{ fontSize: "1.3rem" }}></i>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="order-modal-body">
                {/* Informations client et livraison */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                  <div className="info-section">
                    <div className="info-section-title"><i className="mdi mdi-account"></i> Informations Client</div>
                    <div className="info-row">
                      <span className="info-label">Nom:</span>
                      <span className="info-value">{selectedOrder.user?.name || "N/A"}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{selectedOrder.user?.email || "N/A"}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Téléphone:</span>
                      <span className="info-value">{selectedOrder.shippingAddress?.phone || "N/A"}</span>
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <div className="info-section-title"><i className="mdi mdi-map-marker"></i> Adresse de Livraison</div>
                    <div style={{ color: "#1e293b" }}>
                      <div style={{ fontWeight: 700, marginBottom: "4px" }}>{selectedOrder.shippingAddress?.fullName}</div>
                      <div style={{ color: "#64748b" }}>{selectedOrder.shippingAddress?.address}</div>
                      <div style={{ color: "#64748b" }}>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</div>
                    </div>
                  </div>
                </div>

                {/* Statut, Paiement, Date */}
                <div className="status-section">
                  <div className="status-card">
                    <div className="status-card-label">Statut</div>
                    {getStatusBadge(selectedOrder.status, true)}
                  </div>
                  <div className="status-card">
                    <div className="status-card-label">Paiement</div>
                    {getPaymentBadge(selectedOrder.paymentMethod, true)}
                  </div>
                  <div className="status-card">
                    <div className="status-card-label">Date</div>
                    <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                      {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      {new Date(selectedOrder.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                {/* Articles commandés */}
                <div className="info-section-title" style={{ marginBottom: "16px" }}>
                  <i className="mdi mdi-package-variant"></i> Articles Commandés
                </div>
                <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Prix unitaire</th>
                        <th>Quantité</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item: any, index: number) => (
                        <tr key={index}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                              {item.product?.image ? (
                                <img src={item.product.image} alt={item.product?.name} className="product-img" />
                              ) : (
                                <div style={{ width: "60px", height: "60px", borderRadius: "12px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <i className="mdi mdi-image-off" style={{ color: "#94a3b8", fontSize: "1.5rem" }}></i>
                                </div>
                              )}
                              <span className="product-name">{item.product?.name || "Produit supprimé"}</span>
                            </div>
                          </td>
                          <td style={{ fontWeight: 600, color: "#475569" }}>{item.price.toFixed(2)} TND</td>
                          <td><span className="qty-badge">{item.quantity}</span></td>
                          <td className="price-cell">{(item.price * item.quantity).toFixed(2)} TND</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="total-row">
                  <span className="total-label"><i className="mdi mdi-calculator me-2"></i>Total de la commande</span>
                  <span className="total-value">{selectedOrder.totalAmount.toFixed(2)} TND</span>
                </div>

                {/* Bouton télécharger bon de livraison */}
                <div style={{ marginTop: "20px" }}>
                  <button 
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <!DOCTYPE html>
                          <html>
                          <head>
                            <title>Bon de Livraison - ${selectedOrder._id.slice(-8).toUpperCase()}</title>
                            <style>
                              * { margin: 0; padding: 0; box-sizing: border-box; }
                              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
                              .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #ef4444; }
                              .logo { font-size: 28px; font-weight: bold; color: #ef4444; }
                              .logo-sub { font-size: 12px; color: #666; }
                              .doc-info { text-align: right; }
                              .doc-title { font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 8px; }
                              .doc-number { font-size: 14px; color: #ef4444; font-weight: 600; }
                              .doc-date { font-size: 12px; color: #666; margin-top: 4px; }
                              .section { margin-bottom: 30px; }
                              .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 12px; font-weight: 600; }
                              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
                              .info-box { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444; }
                              .info-label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
                              .info-value { font-size: 14px; color: #1e293b; font-weight: 500; }
                              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                              th { background: #f1f5f9; padding: 14px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
                              td { padding: 14px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
                              .product-name { font-weight: 600; color: #1e293b; }
                              .qty { text-align: center; background: #f1f5f9; border-radius: 20px; padding: 4px 12px; display: inline-block; font-weight: 600; }
                              .price { font-weight: 600; color: #10b981; }
                              .total-section { margin-top: 30px; display: flex; justify-content: flex-end; }
                              .total-box { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 20px 40px; border-radius: 12px; text-align: right; }
                              .total-label { font-size: 14px; color: #64748b; margin-bottom: 4px; }
                              .total-value { font-size: 28px; font-weight: bold; color: #ef4444; }
                              .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; }
                              .signature-box { width: 200px; text-align: center; }
                              .signature-line { border-top: 2px solid #cbd5e1; padding-top: 8px; margin-top: 40px; font-size: 12px; color: #64748b; }
                              .thank-you { margin-top: 40px; text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px; }
                              .thank-you-text { font-size: 14px; color: #64748b; font-style: italic; }
                              .company-footer { margin-top: 40px; padding: 20px; background: #ef4444; color: white; text-align: center; border-radius: 8px; }
                              .company-name { font-size: 14px; font-weight: bold; margin-bottom: 8px; }
                              .company-info { font-size: 12px; opacity: 0.9; }
                              @media print { body { padding: 20px; } }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <div>
                                <div class="logo">W.STORE</div>
                                <div class="logo-sub">Informatique, Smartphones & Accessoires</div>
                              </div>
                              <div class="doc-info">
                                <div class="doc-title">BON DE LIVRAISON</div>
                                <div class="doc-number">#${selectedOrder._id.slice(-8).toUpperCase()}</div>
                                <div class="doc-date">${new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                              </div>
                            </div>
                            
                            <div class="info-grid">
                              <div class="info-box">
                                <div class="section-title">Client</div>
                                <div class="info-value" style="font-size: 16px; margin-bottom: 8px;">${selectedOrder.shippingAddress.fullName}</div>
                                <div class="info-label">Adresse</div>
                                <div class="info-value">${selectedOrder.shippingAddress.address}</div>
                                <div class="info-value">${selectedOrder.shippingAddress.postalCode} ${selectedOrder.shippingAddress.city}</div>
                                <div class="info-label" style="margin-top: 8px;">Téléphone</div>
                                <div class="info-value">${selectedOrder.shippingAddress.phone}</div>
                              </div>
                              
                              <div class="info-box">
                                <div class="section-title">Commande</div>
                                <div class="info-label">Référence</div>
                                <div class="info-value">#${selectedOrder._id.slice(-8).toUpperCase()}</div>
                                <div class="info-label" style="margin-top: 8px;">Date</div>
                                <div class="info-value">${new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')}</div>
                                <div class="info-label" style="margin-top: 8px;">Paiement</div>
                                <div class="info-value">${selectedOrder.paymentMethod === 'card' ? 'Carte bancaire' : 'À la livraison'}</div>
                              </div>
                            </div>
                            
                            <div class="section">
                              <div class="section-title">Articles commandés</div>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Désignation</th>
                                    <th>Prix unitaire</th>
                                    <th style="text-align: center;">Quantité</th>
                                    <th style="text-align: right;">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${selectedOrder.items.map(item => `
                                    <tr>
                                      <td class="product-name">${item.product?.name || 'Produit'}</td>
                                      <td>${item.price.toFixed(2)} TND</td>
                                      <td style="text-align: center;"><span class="qty">${item.quantity}</span></td>
                                      <td style="text-align: right;" class="price">${(item.price * item.quantity).toFixed(2)} TND</td>
                                    </tr>
                                  `).join('')}
                                </tbody>
                              </table>
                            </div>
                            
                            <div class="total-section">
                              <div class="total-box">
                                <div class="total-label">Total à payer</div>
                                <div class="total-value">${selectedOrder.totalAmount.toFixed(2)} TND</div>
                              </div>
                            </div>
                            
                            <div class="footer">
                              <div class="signature-box">
                                <div class="signature-line">Signature Client</div>
                              </div>
                              <div class="signature-box">
                                <div class="signature-line">Signature Livreur</div>
                              </div>
                            </div>
                            
                            <div class="thank-you">
                              <div class="thank-you-text">Merci pour votre confiance !</div>
                            </div>
                            
                            <div class="company-footer">
                              <div class="company-name">W.STORE - Informatique, Smartphones & Accessoires</div>
                              <div class="company-info">+216 52 255 145 / 48 018 250 | wstore887@gmail.com | www.wstore.tn</div>
                              <div class="company-info" style="margin-top: 4px;">Cité Commerciale, Korba | Rue Taher Sfar, Dar Chaâbene El Fehri</div>
                            </div>
                          </body>
                          </html>
                              .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 8px; font-size: 12px; color: #666; }
                              .thank-you { text-align: center; margin-top: 40px; padding: 20px; background: #f8fafc; border-radius: 8px; }
                              .thank-you-text { font-size: 14px; color: #64748b; }
                              @media print { body { padding: 20px; } }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <div>
                                <div class="logo">PARAPHARMACIE</div>
                                <div class="logo-sub">Votre santé, notre priorité</div>
                              </div>
                              <div class="doc-info">
                                <div class="doc-title">BON DE LIVRAISON</div>
                                <div class="doc-number">#${selectedOrder._id.slice(-8).toUpperCase()}</div>
                                <div class="doc-date">${new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                              </div>
                            </div>
                            
                            <div class="section">
                              <div class="info-grid">
                                <div class="info-box">
                                  <div class="section-title">Informations Client</div>
                                  <div style="margin-bottom: 8px;"><div class="info-label">Nom</div><div class="info-value">${selectedOrder.user?.name || 'N/A'}</div></div>
                                  <div style="margin-bottom: 8px;"><div class="info-label">Email</div><div class="info-value">${selectedOrder.user?.email || 'N/A'}</div></div>
                                  <div><div class="info-label">Téléphone</div><div class="info-value">${selectedOrder.shippingAddress?.phone || 'N/A'}</div></div>
                                </div>
                                <div class="info-box">
                                  <div class="section-title">Adresse de Livraison</div>
                                  <div class="info-value" style="font-size: 16px; margin-bottom: 8px;">${selectedOrder.shippingAddress?.fullName || ''}</div>
                                  <div class="info-value">${selectedOrder.shippingAddress?.address || ''}</div>
                                  <div class="info-value">${selectedOrder.shippingAddress?.city || ''}, ${selectedOrder.shippingAddress?.postalCode || ''}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div class="section">
                              <div class="section-title">Articles Commandés</div>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Produit</th>
                                    <th>Prix Unitaire</th>
                                    <th style="text-align: center;">Quantité</th>
                                    <th style="text-align: right;">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${selectedOrder.items?.map((item: any) => `
                                    <tr>
                                      <td class="product-name">${item.product?.name || 'Produit'}</td>
                                      <td>${item.price.toFixed(2)} TND</td>
                                      <td style="text-align: center;"><span class="qty">${item.quantity}</span></td>
                                      <td style="text-align: right;" class="price">${(item.price * item.quantity).toFixed(2)} TND</td>
                                    </tr>
                                  `).join('')}
                                </tbody>
                              </table>
                            </div>
                            
                            <div class="total-section">
                              <div class="total-box">
                                <div class="total-label">Total à payer</div>
                                <div class="total-value">${selectedOrder.totalAmount.toFixed(2)} TND</div>
                              </div>
                            </div>
                            
                            <div class="footer">
                              <div class="signature-box">
                                <div class="signature-line">Signature Client</div>
                              </div>
                              <div class="signature-box">
                                <div class="signature-line">Signature Livreur</div>
                              </div>
                            </div>
                            
                            <div class="thank-you">
                              <div class="thank-you-text">Merci pour votre confiance !</div>
                            </div>
                          </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                    style={{
                      width: "100%", padding: "16px 24px", border: "2px dashed #e2e8f0",
                      borderRadius: "14px", background: "white", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                      color: "#64748b", fontWeight: 600, fontSize: "0.95rem", transition: "all 0.3s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "#fef2f2"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; e.currentTarget.style.background = "white"; }}
                  >
                    <i className="mdi mdi-file-download-outline" style={{ fontSize: "1.3rem" }}></i>
                    Télécharger le bon de livraison
                  </button>
                </div>

                {/* Actions de changement de statut */}
                {selectedOrder.status !== "cancelled" && selectedOrder.status !== "delivered" && (
                  <div className="action-buttons">
                    {selectedOrder.status === "pending" && (
                      <>
                        <button className="action-btn btn-confirm" onClick={() => { updateOrderStatus(selectedOrder._id, "confirmed"); setShowModal(false); }}>
                          <i className="mdi mdi-check-circle"></i> Confirmer la commande
                        </button>
                        <button className="action-btn btn-cancel" onClick={() => { updateOrderStatus(selectedOrder._id, "cancelled"); setShowModal(false); }}>
                          <i className="mdi mdi-close-circle"></i> Annuler
                        </button>
                      </>
                    )}
                    {selectedOrder.status === "confirmed" && (
                      <button className="action-btn btn-ship" onClick={() => { updateOrderStatus(selectedOrder._id, "shipped"); setShowModal(false); }}>
                        <i className="mdi mdi-truck-delivery"></i> Marquer comme expédiée
                      </button>
                    )}
                    {selectedOrder.status === "shipped" && (
                      <button className="action-btn btn-deliver" onClick={() => { updateOrderStatus(selectedOrder._id, "delivered"); setShowModal(false); }}>
                        <i className="mdi mdi-package-variant"></i> Marquer comme livrée
                      </button>
                    )}
                  </div>
                )}

                {/* Bouton fermer */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                  <button className="btn-close-modal" onClick={() => setShowModal(false)}>
                    <i className="mdi mdi-close me-2"></i> Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
