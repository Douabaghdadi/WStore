"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL } from "../../../lib/api";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearInterval(timer);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <>
      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "70px",
        background: "white", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        zIndex: 1001, display: "flex", alignItems: "center", padding: "0 1.5rem"
      }}>
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", width: "260px", paddingRight: "1rem" }}>
          <img src="/img/logo.png" alt="Parapharmacie" style={{ height: "40px", width: "auto", maxWidth: "180px", objectFit: "contain" }} />
        </Link>
        
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
              <strong style={{ color: "#1e293b" }}>{formatDate()}</strong>
            </div>
            
            <form onSubmit={handleSearch} style={{ position: "relative", width: "400px" }}>
              <i className="mdi mdi-magnify" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: "1.125rem" }}></i>
              <input 
                type="text" 
                placeholder="Rechercher produits, commandes, clients..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "0.625rem 1rem 0.625rem 2.75rem",
                  border: "2px solid #e2e8f0", borderRadius: "10px",
                  fontSize: "0.875rem", background: "#f8fafc", outline: "none"
                }}
              />
            </form>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="profile-dropdown-container" style={{ position: "relative" }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.375rem 0.75rem 0.375rem 0.375rem",
                  border: "2px solid #e2e8f0", borderRadius: "50px",
                  background: "white", cursor: "pointer", transition: "all 0.2s ease"
                }}
              >
                <img 
                  src={user?.photo ? `${API_URL}${user.photo}` : "/admin/images/faces/face1.jpg"}
                  alt="Profile" 
                  style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1e293b" }}>{user?.name || 'Admin'}</div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Administrateur</div>
                </div>
                <i className="mdi mdi-chevron-down" style={{ color: "#94a3b8", transition: "transform 0.2s", transform: showDropdown ? "rotate(180deg)" : "rotate(0)" }}></i>
              </button>
              
              {showDropdown && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  minWidth: "220px", background: "white", borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)", padding: "0.5rem",
                  zIndex: 9999, animation: "dropdownFade 0.2s ease"
                }}>
                  <Link 
                    href="/admin/profile" 
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.75rem 1rem", color: "#475569", textDecoration: "none",
                      borderRadius: "8px", fontSize: "0.875rem"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                  >
                    <i className="mdi mdi-account-outline" style={{ fontSize: "1.125rem", width: "24px" }}></i>
                    Mon profil
                  </Link>
                  <Link 
                    href="/admin/settings" 
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.75rem 1rem", color: "#475569", textDecoration: "none",
                      borderRadius: "8px", fontSize: "0.875rem"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                  >
                    <i className="mdi mdi-cog-outline" style={{ fontSize: "1.125rem", width: "24px" }}></i>
                    Paramètres
                  </Link>
                  <div style={{ height: "1px", background: "#e2e8f0", margin: "0.5rem 0" }}></div>
                  <button 
                    onClick={handleLogout}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.75rem 1rem", color: "#475569", background: "none",
                      border: "none", borderRadius: "8px", width: "100%",
                      fontSize: "0.875rem", cursor: "pointer", textAlign: "left"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
                  >
                    <i className="mdi mdi-logout" style={{ fontSize: "1.125rem", width: "24px" }}></i>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
