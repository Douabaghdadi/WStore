"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "../../lib/api";

interface DashboardCard {
  title: string;
  subtitle: string;
  icon: string;
  link: string;
  color: string;
  bgGradient: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchClientStats();
  }, [router]);

  const fetchClientStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const orders = await response.json();
      
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((o: any) => o.status === "pending").length,
        deliveredOrders: orders.filter((o: any) => o.status === "delivered").length,
        totalSpent: orders
          .filter((o: any) => o.status !== "cancelled")
          .reduce((sum: number, o: any) => sum + o.totalAmount, 0)
      });
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setLoading(false);
    }
  };

  const dashboardCards: DashboardCard[] = [
    {
      title: "Mes commandes",
      subtitle: "Suivez l'état de toutes vos commandes",
      icon: "📦",
      link: "/client/orders",
      color: "#1a365d",
      bgGradient: "linear-gradient(135deg, #1a365d 0%, #2c5282 100%)"
    },
    {
      title: "Mes favoris",
      subtitle: "Retrouvez tous vos produits favoris",
      icon: "❤️",
      link: "/client/favorites",
      color: "#c53030",
      bgGradient: "linear-gradient(135deg, #c53030 0%, #e53e3e 100%)"
    },
    {
      title: "Mon profil",
      subtitle: "Gérez vos informations personnelles",
      icon: "👤",
      link: "/client/profile",
      color: "#2d3748",
      bgGradient: "linear-gradient(135deg, #2d3748 0%, #4a5568 100%)"
    }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
        <div className="spinner-border" style={{ color: "#1a365d", width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "3rem 0", 
      backgroundColor: "#ffffff",
      minHeight: "calc(100vh - 200px)" 
    }}>
      {/* Welcome Section */}
      <div className="container mb-5">
        <div className="text-center mb-5">
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "700", 
            color: "#1a365d",
            letterSpacing: "1px",
            marginBottom: "0.5rem"
          }}>
            ESPACE CLIENT
          </h1>
          <div style={{
            width: "60px",
            height: "3px",
            background: "linear-gradient(90deg, #c53030 0%, #e53e3e 100%)",
            margin: "1rem auto 1.5rem"
          }}></div>
          <p style={{ 
            fontSize: "1rem", 
            color: "#6c757d",
            fontWeight: "400"
          }}>
            Bienvenue, <strong style={{ fontWeight: "600", color: "#1a365d" }}>{user?.name || "Client"}</strong>
          </p>
        </div>
      </div>



      {/* Dashboard Cards Grid */}
      <div className="container pb-5">
        <div className="row g-4">
          {dashboardCards.map((card, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <Link href={card.link} style={{ textDecoration: "none" }}>
                <div 
                  className="card border-0 h-100"
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.06)";
                  }}
                >
                  <div 
                    style={{
                      background: card.bgGradient,
                      height: "4px",
                      width: "100%"
                    }}
                  ></div>
                  <div className="card-body text-center p-4">
                    <div 
                      style={{
                        fontSize: "3.5rem",
                        marginBottom: "1rem",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                        lineHeight: 1
                      }}
                    >
                      {card.icon}
                    </div>
                    <h5 
                      className="card-title mb-2" 
                      style={{ 
                        color: card.color,
                        fontWeight: "600",
                        fontSize: "1.1rem"
                      }}
                    >
                      {card.title}
                    </h5>
                    <p 
                      className="card-text text-muted mb-0"
                      style={{ 
                        fontSize: "0.85rem",
                        lineHeight: "1.5"
                      }}
                    >
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
