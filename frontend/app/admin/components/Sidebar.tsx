"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar" style={{zIndex: 1000}}>
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a href="#" className="nav-link">
            <div className="nav-profile-image">
              <img src="/admin/images/faces/face1.jpg" alt="profile" />
              <span className="login-status online"></span>
            </div>
            <div className="nav-profile-text d-flex flex-column">
              <span className="font-weight-bold mb-2">{user?.name || 'Utilisateur'}</span>
              <span className="text-secondary text-small">{user?.role === 'admin' ? 'Administrateur' : 'Client'}</span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>
        <li className={`nav-item ${pathname === '/admin' ? 'active' : ''}`}>
          <Link className="nav-link" href="/admin">
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-home menu-icon"></i>
          </Link>
        </li>
        <li className={`nav-item ${pathname.startsWith('/admin/users') ? 'active' : ''}`}>
          <Link className="nav-link" href="/admin/users">
            <span className="menu-title">Utilisateurs</span>
            <i className="mdi mdi-account-multiple menu-icon"></i>
          </Link>
        </li>
        <li className={`nav-item ${pathname.startsWith('/admin/products') ? 'active' : ''}`}>
          <Link className="nav-link" href="/admin/products">
            <span className="menu-title">Produits</span>
            <i className="mdi mdi-package-variant menu-icon"></i>
          </Link>
        </li>
        <li className={`nav-item ${pathname.startsWith('/admin/categories') ? 'active' : ''}`}>
          <Link className="nav-link" href="/admin/categories">
            <span className="menu-title">Catégories</span>
            <i className="mdi mdi-tag menu-icon"></i>
          </Link>
        </li>
        <li className={`nav-item ${pathname.startsWith('/admin/subcategories') ? 'active' : ''}`}>
          <Link className="nav-link" href="/admin/subcategories">
            <span className="menu-title">Sous-catégories</span>
            <i className="mdi mdi-tag-multiple menu-icon"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
