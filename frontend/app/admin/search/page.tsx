"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { API_URL } from "../../../lib/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category?: { name: string };
}

interface Order {
  _id: string;
  orderNumber: string;
  user?: { name: string; email: string };
  total: number;
  status: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (query) {
      searchAll(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const searchAll = async (q: string) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Nettoyer le terme de recherche (enlever # et espaces)
    const cleanQuery = q.replace(/^#/, '').trim().toLowerCase();

    try {
      // Recherche produits
      const prodRes = await fetch(`${API_URL}/api/products`);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.filter((p: Product) => 
          p.name?.toLowerCase().includes(cleanQuery) ||
          p.category?.name?.toLowerCase().includes(cleanQuery)
        ));
      }

      // Recherche commandes (admin endpoint)
      const orderRes = await fetch(`${API_URL}/api/orders/all`, { headers });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData.filter((o: Order) => {
          // Le numéro affiché est les 8 derniers caractères de l'ID
          const displayId = o._id?.slice(-8).toLowerCase();
          return displayId?.includes(cleanQuery) ||
            o._id?.toLowerCase().includes(cleanQuery) ||
            o.user?.name?.toLowerCase().includes(cleanQuery) ||
            o.user?.email?.toLowerCase().includes(cleanQuery);
        }));
      }

      // Recherche utilisateurs
      const userRes = await fetch(`${API_URL}/api/users`, { headers });
      if (userRes.ok) {
        const userData = await userRes.json();
        setUsers(userData.filter((u: User) => 
          u.name?.toLowerCase().includes(cleanQuery) ||
          u.email?.toLowerCase().includes(cleanQuery)
        ));
      }

      // Recherche messages
      const contactRes = await fetch(`${API_URL}/api/contacts`, { headers });
      if (contactRes.ok) {
        const contactData = await contactRes.json();
        setContacts(contactData.filter((c: Contact) => 
          c.name?.toLowerCase().includes(cleanQuery) ||
          c.email?.toLowerCase().includes(cleanQuery) ||
          c.subject?.toLowerCase().includes(cleanQuery)
        ));
      }
    } catch (error) {
      console.error("Erreur de recherche:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalResults = products.length + orders.length + users.length + contacts.length;

  const getStatusBadge = (status: string, type: string) => {
    if (type === "order") {
      const styles: Record<string, { bg: string; label: string }> = {
        pending: { bg: "#fef3c7", label: "En attente" },
        confirmed: { bg: "#dbeafe", label: "Confirmée" },
        shipped: { bg: "#e0e7ff", label: "Expédiée" },
        delivered: { bg: "#dcfce7", label: "Livrée" },
        cancelled: { bg: "#fee2e2", label: "Annulée" }
      };
      const s = styles[status] || { bg: "#f3f4f6", label: status };
      return <span className="badge" style={{ backgroundColor: s.bg }}>{s.label}</span>;
    }
    if (type === "contact") {
      const styles: Record<string, { bg: string; color: string; label: string }> = {
        unread: { bg: "#fee2e2", color: "#c53030", label: "Non lu" },
        read: { bg: "#e0f2fe", color: "#0369a1", label: "Lu" },
        replied: { bg: "#dcfce7", color: "#16a34a", label: "Répondu" }
      };
      const s = styles[status] || styles.unread;
      return <span className="badge" style={{ backgroundColor: s.bg, color: s.color }}>{s.label}</span>;
    }
    return <span className="badge bg-secondary">{status}</span>;
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h3 className="page-title">
          Résultats de recherche pour "{query}"
        </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
            <li className="breadcrumb-item active">Recherche</li>
          </ol>
        </nav>
      </div>

      {!query ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="mdi mdi-magnify" style={{ fontSize: "64px", color: "#ccc" }}></i>
            <p className="text-muted mt-3">Entrez un terme de recherche</p>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                Tous ({totalResults})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                Produits ({products.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Commandes ({orders.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                Utilisateurs ({users.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "contacts" ? "active" : ""}`}
                onClick={() => setActiveTab("contacts")}
              >
                Messages ({contacts.length})
              </button>
            </li>
          </ul>

          {totalResults === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="mdi mdi-magnify-close" style={{ fontSize: "64px", color: "#ccc" }}></i>
                <p className="text-muted mt-3">Aucun résultat trouvé pour "{query}"</p>
              </div>
            </div>
          ) : (
            <>
              {/* Produits */}
              {(activeTab === "all" || activeTab === "products") && products.length > 0 && (
                <div className="card mb-4">
                  <div className="card-body">
                    <h4 className="card-title">
                      <i className="mdi mdi-package-variant me-2"></i>
                      Produits ({products.length})
                    </h4>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Catégorie</th>
                            <th>Prix</th>
                            <th>Stock</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.slice(0, activeTab === "all" ? 5 : undefined).map(product => (
                            <tr key={product._id}>
                              <td>
                                <img src={product.image} alt={product.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                              </td>
                              <td>{product.name}</td>
                              <td>{product.category?.name || "-"}</td>
                              <td>{product.price} TND</td>
                              <td>
                                <span className={`badge ${product.stock > 0 ? "badge-success" : "badge-danger"}`}>
                                  {product.stock}
                                </span>
                              </td>
                              <td>
                                <Link href={`/admin/products/${product._id}`} className="btn btn-sm btn-warning">
                                  <i className="mdi mdi-pencil"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {activeTab === "all" && products.length > 5 && (
                      <button className="btn btn-link" onClick={() => setActiveTab("products")}>
                        Voir tous les produits ({products.length})
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Commandes */}
              {(activeTab === "all" || activeTab === "orders") && orders.length > 0 && (
                <div className="card mb-4">
                  <div className="card-body">
                    <h4 className="card-title">
                      <i className="mdi mdi-cart me-2"></i>
                      Commandes ({orders.length})
                    </h4>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>N° Commande</th>
                            <th>Client</th>
                            <th>Total</th>
                            <th>Statut</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, activeTab === "all" ? 5 : undefined).map(order => (
                            <tr key={order._id}>
                              <td>#{order._id.slice(-8).toUpperCase()}</td>
                              <td>
                                <div>{order.user?.name || "Invité"}</div>
                                <small className="text-muted">{order.user?.email}</small>
                              </td>
                              <td>{order.total?.toFixed(2)} TND</td>
                              <td>{getStatusBadge(order.status, "order")}</td>
                              <td>{new Date(order.createdAt).toLocaleDateString("fr-FR")}</td>
                              <td>
                                <Link href={`/admin/orders?search=${order._id.slice(-8)}`} className="btn btn-sm btn-info">
                                  <i className="mdi mdi-eye"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {activeTab === "all" && orders.length > 5 && (
                      <button className="btn btn-link" onClick={() => setActiveTab("orders")}>
                        Voir toutes les commandes ({orders.length})
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Utilisateurs */}
              {(activeTab === "all" || activeTab === "users") && users.length > 0 && (
                <div className="card mb-4">
                  <div className="card-body">
                    <h4 className="card-title">
                      <i className="mdi mdi-account-group me-2"></i>
                      Utilisateurs ({users.length})
                    </h4>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>Inscription</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.slice(0, activeTab === "all" ? 5 : undefined).map(user => (
                            <tr key={user._id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>
                                <span className={`badge ${user.role === "admin" ? "badge-danger" : "badge-info"}`}>
                                  {user.role === "admin" ? "Admin" : "Client"}
                                </span>
                              </td>
                              <td>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</td>
                              <td>
                                <Link href={`/admin/users/${user._id}`} className="btn btn-sm btn-info">
                                  <i className="mdi mdi-eye"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {activeTab === "all" && users.length > 5 && (
                      <button className="btn btn-link" onClick={() => setActiveTab("users")}>
                        Voir tous les utilisateurs ({users.length})
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              {(activeTab === "all" || activeTab === "contacts") && contacts.length > 0 && (
                <div className="card mb-4">
                  <div className="card-body">
                    <h4 className="card-title">
                      <i className="mdi mdi-email me-2"></i>
                      Messages ({contacts.length})
                    </h4>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Expéditeur</th>
                            <th>Sujet</th>
                            <th>Statut</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.slice(0, activeTab === "all" ? 5 : undefined).map(contact => (
                            <tr key={contact._id}>
                              <td>
                                <div>{contact.name}</div>
                                <small className="text-muted">{contact.email}</small>
                              </td>
                              <td>{contact.subject}</td>
                              <td>{getStatusBadge(contact.status, "contact")}</td>
                              <td>{new Date(contact.createdAt).toLocaleDateString("fr-FR")}</td>
                              <td>
                                <Link href="/admin/messages" className="btn btn-sm btn-info">
                                  <i className="mdi mdi-eye"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {activeTab === "all" && contacts.length > 5 && (
                      <button className="btn btn-link" onClick={() => setActiveTab("contacts")}>
                        Voir tous les messages ({contacts.length})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminSearchPage() {
  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <Suspense fallback={
            <div className="content-wrapper">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="spinner-border text-primary"></div>
              </div>
            </div>
          }>
            <SearchContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
