"use client";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Link from "next/link";
import "./dashboard.css";

interface DashboardStats {
  totalRevenue: number;
  weeklyRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  weeklyOrders: number;
  ordersGrowth: number;
  totalProducts: number;
  lowStockProducts: number;
  totalUsers: number;
  newUsers: number;
  pendingOrders: number;
  recentOrders: any[];
  dailyRevenue: number;
  monthlyRevenue: number;
  dailyOrders: number;
  monthlyOrders: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    weeklyRevenue: 0,
    revenueGrowth: 0,
    totalOrders: 0,
    weeklyOrders: 0,
    ordersGrowth: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalUsers: 0,
    newUsers: 0,
    pendingOrders: 0,
    recentOrders: [],
    dailyRevenue: 0,
    monthlyRevenue: 0,
    dailyOrders: 0,
    monthlyOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Récupérer toutes les données en parallèle
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        fetch("http://localhost:5000/api/orders/all", { headers }),
        fetch("http://localhost:5000/api/products", { headers }),
        fetch("http://localhost:5000/api/users", { headers })
      ]);

      const orders = await ordersRes.json();
      const products = await productsRes.json();
      const users = await usersRes.json();

      // Calculer les statistiques
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Revenus
      const totalRevenue = orders
        .filter((o: any) => o.status !== "cancelled")
        .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

      const dailyRevenue = orders
        .filter((o: any) => o.status !== "cancelled" && new Date(o.createdAt) >= oneDayAgo)
        .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

      const weeklyRevenue = orders
        .filter((o: any) => o.status !== "cancelled" && new Date(o.createdAt) >= oneWeekAgo)
        .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

      const monthlyRevenue = orders
        .filter((o: any) => o.status !== "cancelled" && new Date(o.createdAt) >= oneMonthAgo)
        .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

      const previousWeekRevenue = orders
        .filter((o: any) => o.status !== "cancelled" && new Date(o.createdAt) >= twoWeeksAgo && new Date(o.createdAt) < oneWeekAgo)
        .reduce((sum: number, o: any) => sum + o.totalAmount, 0);

      const revenueGrowth = previousWeekRevenue > 0 
        ? ((weeklyRevenue - previousWeekRevenue) / previousWeekRevenue) * 100 
        : 100;

      // Commandes
      const totalOrders = orders.length;
      const dailyOrders = orders.filter((o: any) => new Date(o.createdAt) >= oneDayAgo).length;
      const weeklyOrders = orders.filter((o: any) => new Date(o.createdAt) >= oneWeekAgo).length;
      const monthlyOrders = orders.filter((o: any) => new Date(o.createdAt) >= oneMonthAgo).length;
      const previousWeekOrders = orders.filter((o: any) => new Date(o.createdAt) >= twoWeeksAgo && new Date(o.createdAt) < oneWeekAgo).length;
      const ordersGrowth = previousWeekOrders > 0 
        ? ((weeklyOrders - previousWeekOrders) / previousWeekOrders) * 100 
        : 100;

      // Produits
      const totalProducts = products.length;
      const lowStockProducts = products.filter((p: any) => p.stock < 10).length;

      // Utilisateurs
      const totalUsers = users.length;
      const newUsers = users.filter((u: any) => new Date(u.createdAt) >= oneWeekAgo).length;

      // Commandes en attente
      const pendingOrders = orders.filter((o: any) => o.status === "pending").length;

      // Commandes récentes (5 dernières)
      const recentOrders = orders
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalRevenue,
        weeklyRevenue,
        revenueGrowth,
        totalOrders,
        weeklyOrders,
        ordersGrowth,
        totalProducts,
        lowStockProducts,
        totalUsers,
        newUsers,
        pendingOrders,
        recentOrders,
        dailyRevenue,
        monthlyRevenue,
        dailyOrders,
        monthlyOrders
      });
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: { class: "badge-warning", text: "En attente" },
      confirmed: { class: "badge-info", text: "Confirmée" },
      shipped: { class: "badge-primary", text: "Expédiée" },
      delivered: { class: "badge-success", text: "Livrée" },
      cancelled: { class: "badge-danger", text: "Annulée" }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) {
    return (
      <div className="container-scroller">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="mdi mdi-home"></i>
                </span> Dashboard
              </h3>
            </div>
            {/* Statistiques principales */}
            <div className="row">
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card bg-gradient-danger card-img-holder text-white">
                  <div className="card-body">
                    <img src="/admin/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    <h4 className="font-weight-normal mb-3">
                      Ventes Hebdomadaires 
                      <i className="mdi mdi-chart-line mdi-24px float-end"></i>
                    </h4>
                    <h2 className="mb-5">{stats.weeklyRevenue.toFixed(2)} TND</h2>
                    <h6 className="card-text">
                      {stats.revenueGrowth >= 0 ? "+" : ""}{stats.revenueGrowth.toFixed(1)}% vs semaine dernière
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card bg-gradient-info card-img-holder text-white">
                  <div className="card-body">
                    <img src="/admin/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    <h4 className="font-weight-normal mb-3">
                      Commandes Hebdomadaires 
                      <i className="mdi mdi-bookmark-outline mdi-24px float-end"></i>
                    </h4>
                    <h2 className="mb-5">{stats.weeklyOrders}</h2>
                    <h6 className="card-text">
                      {stats.ordersGrowth >= 0 ? "+" : ""}{stats.ordersGrowth.toFixed(1)}% vs semaine dernière
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card bg-gradient-success card-img-holder text-white">
                  <div className="card-body">
                    <img src="/admin/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    <h4 className="font-weight-normal mb-3">
                      Produits 
                      <i className="mdi mdi-package-variant mdi-24px float-end"></i>
                    </h4>
                    <h2 className="mb-5">{stats.totalProducts}</h2>
                    <h6 className="card-text">
                      {stats.lowStockProducts} produit{stats.lowStockProducts > 1 ? "s" : ""} en rupture
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-md-3 stretch-card grid-margin">
                <div className="card bg-gradient-warning card-img-holder text-white">
                  <div className="card-body">
                    <img src="/admin/images/dashboard/circle.svg" className="card-img-absolute" alt="circle-image" />
                    <h4 className="font-weight-normal mb-3">
                      Utilisateurs 
                      <i className="mdi mdi-account-multiple mdi-24px float-end"></i>
                    </h4>
                    <h2 className="mb-5">{stats.totalUsers}</h2>
                    <h6 className="card-text">
                      {stats.newUsers} nouveau{stats.newUsers > 1 ? "x" : ""} cette semaine
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Revenus par Période */}
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-4">
                      <i className="mdi mdi-cash-multiple text-success"></i> Revenus par Période
                    </h4>
                    <div className="row">
                      <div className="col-md-3 mb-3">
                        <div className="revenue-card border-start border-5 border-info p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="text-muted mb-1 small">AUJOURD'HUI</p>
                              <h3 className="mb-0 text-info">{stats.dailyRevenue.toFixed(2)} TND</h3>
                              <small className="text-muted">{stats.dailyOrders} commande{stats.dailyOrders > 1 ? 's' : ''}</small>
                            </div>
                            <div className="icon-wrapper">
                              <i className="mdi mdi-calendar-today text-info" style={{ fontSize: '32px' }}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="revenue-card border-start border-5 border-primary p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="text-muted mb-1 small">CETTE SEMAINE</p>
                              <h3 className="mb-0 text-primary">{stats.weeklyRevenue.toFixed(2)} TND</h3>
                              <small className="text-muted">{stats.weeklyOrders} commande{stats.weeklyOrders > 1 ? 's' : ''}</small>
                            </div>
                            <div className="icon-wrapper">
                              <i className="mdi mdi-calendar-week text-primary" style={{ fontSize: '32px' }}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="revenue-card border-start border-5 border-warning p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="text-muted mb-1 small">CE MOIS</p>
                              <h3 className="mb-0 text-warning">{stats.monthlyRevenue.toFixed(2)} TND</h3>
                              <small className="text-muted">{stats.monthlyOrders} commande{stats.monthlyOrders > 1 ? 's' : ''}</small>
                            </div>
                            <div className="icon-wrapper">
                              <i className="mdi mdi-calendar-month text-warning" style={{ fontSize: '32px' }}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-3">
                        <div className="revenue-card border-start border-5 border-success p-3 bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p className="text-muted mb-1 small">TOTAL</p>
                              <h3 className="mb-0 text-success">{stats.totalRevenue.toFixed(2)} TND</h3>
                              <small className="text-muted">{stats.totalOrders} commande{stats.totalOrders > 1 ? 's' : ''}</small>
                            </div>
                            <div className="icon-wrapper">
                              <i className="mdi mdi-cash-multiple text-success" style={{ fontSize: '32px' }}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statistiques détaillées */}
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <div className="card bg-gradient-info text-white">
                          <div className="card-body">
                            <h5 className="mb-3">
                              <i className="mdi mdi-trending-up"></i> Moyenne par Commande
                            </h5>
                            <div className="row">
                              <div className="col-6">
                                <p className="mb-1 small">Aujourd'hui</p>
                                <h4>{stats.dailyOrders > 0 ? (stats.dailyRevenue / stats.dailyOrders).toFixed(2) : '0.00'} TND</h4>
                              </div>
                              <div className="col-6">
                                <p className="mb-1 small">Cette semaine</p>
                                <h4>{stats.weeklyOrders > 0 ? (stats.weeklyRevenue / stats.weeklyOrders).toFixed(2) : '0.00'} TND</h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card bg-gradient-success text-white">
                          <div className="card-body">
                            <h5 className="mb-3">
                              <i className="mdi mdi-chart-line"></i> Croissance
                            </h5>
                            <div className="row">
                              <div className="col-6">
                                <p className="mb-1 small">Revenus</p>
                                <h4>
                                  {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
                                  <i className={`mdi mdi-arrow-${stats.revenueGrowth >= 0 ? 'up' : 'down'} ms-2`}></i>
                                </h4>
                              </div>
                              <div className="col-6">
                                <p className="mb-1 small">Commandes</p>
                                <h4>
                                  {stats.ordersGrowth >= 0 ? '+' : ''}{stats.ordersGrowth.toFixed(1)}%
                                  <i className={`mdi mdi-arrow-${stats.ordersGrowth >= 0 ? 'up' : 'down'} ms-2`}></i>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques secondaires */}
            <div className="row">
              <div className="col-md-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h4 className="card-title mb-2">Revenu Total</h4>
                        <h2 className="text-primary mb-0">{stats.totalRevenue.toFixed(2)} TND</h2>
                      </div>
                      <div className="icon-lg bg-primary-light rounded-circle">
                        <i className="mdi mdi-cash-multiple text-primary mdi-36px"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h4 className="card-title mb-2">Total Commandes</h4>
                        <h2 className="text-info mb-0">{stats.totalOrders}</h2>
                      </div>
                      <div className="icon-lg bg-info-light rounded-circle">
                        <i className="mdi mdi-cart text-info mdi-36px"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h4 className="card-title mb-2">Commandes en Attente</h4>
                        <h2 className="text-warning mb-0">{stats.pendingOrders}</h2>
                      </div>
                      <div className="icon-lg bg-warning-light rounded-circle">
                        <i className="mdi mdi-clock-alert text-warning mdi-36px"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Commandes récentes */}
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="card-title mb-0">Commandes Récentes</h4>
                      <Link href="/admin/orders" className="btn btn-sm btn-primary">
                        <i className="mdi mdi-eye"></i> Voir tout
                      </Link>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID Commande</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Statut</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentOrders.length > 0 ? (
                            stats.recentOrders.map((order: any) => (
                              <tr key={order._id}>
                                <td>
                                  <span className="font-weight-bold text-primary">
                                    #{order._id.slice(-8).toUpperCase()}
                                  </span>
                                </td>
                                <td>
                                  <div>
                                    <div className="font-weight-bold">{order.user?.name || "N/A"}</div>
                                    <small className="text-muted">{order.user?.email || "N/A"}</small>
                                  </div>
                                </td>
                                <td>
                                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                  <br />
                                  <small className="text-muted">
                                    {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </small>
                                </td>
                                <td className="font-weight-bold text-success">
                                  {order.totalAmount.toFixed(2)} TND
                                </td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td>
                                  <Link 
                                    href="/admin/orders" 
                                    className="btn btn-sm btn-info"
                                    title="Voir détails"
                                  >
                                    <i className="mdi mdi-eye"></i>
                                  </Link>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="text-center py-4">
                                <i className="mdi mdi-cart-off" style={{ fontSize: '48px', color: '#ccc' }}></i>
                                <p className="text-muted mt-2">Aucune commande récente</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="d-sm-flex justify-content-center justify-content-sm-between">
              <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © 2023 Parapharmacie. All rights reserved.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
