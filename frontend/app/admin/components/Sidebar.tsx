"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
  { path: "/admin", icon: "mdi-view-dashboard", label: "Dashboard", color: "#6366f1" },
  { path: "/admin/users", icon: "mdi-account-group", label: "Utilisateurs", color: "#8b5cf6" },
  { path: "/admin/products", icon: "mdi-package-variant-closed", label: "Produits", color: "#06b6d4" },
  { path: "/admin/orders", icon: "mdi-cart-outline", label: "Commandes", color: "#10b981" },
  { path: "/admin/categories", icon: "mdi-shape", label: "Catégories", color: "#f59e0b" },
  { path: "/admin/subcategories", icon: "mdi-shape-outline", label: "Sous-catégories", color: "#f97316" },
  { path: "/admin/brands", icon: "mdi-tag-multiple", label: "Marques", color: "#ec4899" },
  { path: "/admin/messages", icon: "mdi-email-outline", label: "Messages", color: "#ef4444" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  return (
    <>
      <style jsx>{`
        .modern-sidebar {
          background: #ffffff;
          min-height: 100vh;
          width: 260px;
          position: fixed;
          left: 0;
          top: 0;
          padding-top: 80px;
          z-index: 1000;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
          border-right: 1px solid #e2e8f0;
        }
        
        .sidebar-header {
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
        }
        
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: white;
          text-decoration: none;
        }
        
        .sidebar-brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        
        .sidebar-brand-text {
          font-weight: 700;
          font-size: 1.125rem;
        }
        
        .sidebar-nav {
          padding: 0 1rem;
          list-style: none;
          margin: 0;
        }
        
        .nav-item {
          margin-bottom: 0.25rem;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          color: #475569;
          text-decoration: none;
          border-radius: 10px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .nav-link:hover {
          color: #1e293b;
          background: #f1f5f9;
        }
        
        .nav-link.active {
          color: #6366f1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
        }
        
        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 60%;
          background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 0 4px 4px 0;
        }
        
        .nav-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .nav-link:hover .nav-icon-wrapper,
        .nav-link.active .nav-icon-wrapper {
          transform: scale(1.1);
        }
        
        .nav-icon {
          font-size: 1.25rem;
        }
        
        .nav-label {
          font-weight: 500;
          font-size: 0.9rem;
          color: inherit;
        }
        
        .sidebar-section-title {
          padding: 1.5rem 1rem 0.75rem;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
        }
        
        .sidebar-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        
        .user-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          object-fit: cover;
          border: 2px solid #e2e8f0;
        }
        
        .user-info {
          flex: 1;
          min-width: 0;
        }
        
        .user-name {
          color: #1e293b;
          font-weight: 600;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .user-role {
          color: #64748b;
          font-size: 0.75rem;
        }
      `}</style>
      
      <nav className="modern-sidebar" id="sidebar">
        <div className="sidebar-section-title">Menu Principal</div>
        
        <ul className="sidebar-nav">
          {menuItems.slice(0, 4).map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                href={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span 
                  className="nav-icon-wrapper" 
                  style={{ background: `${item.color}20` }}
                >
                  <i className={`mdi ${item.icon} nav-icon`} style={{ color: item.color }}></i>
                </span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-section-title">Catalogue</div>
        
        <ul className="sidebar-nav">
          {menuItems.slice(4, 7).map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                href={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span 
                  className="nav-icon-wrapper" 
                  style={{ background: `${item.color}20` }}
                >
                  <i className={`mdi ${item.icon} nav-icon`} style={{ color: item.color }}></i>
                </span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="sidebar-section-title">Communication</div>
        
        <ul className="sidebar-nav">
          {menuItems.slice(7).map((item) => (
            <li key={item.path} className="nav-item">
              <Link 
                href={item.path} 
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span 
                  className="nav-icon-wrapper" 
                  style={{ background: `${item.color}20` }}
                >
                  <i className={`mdi ${item.icon} nav-icon`} style={{ color: item.color }}></i>
                </span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        {user && (
          <div className="sidebar-footer" style={{ display: 'none' }}>
          </div>
        )}
      </nav>
    </>
  );
}
