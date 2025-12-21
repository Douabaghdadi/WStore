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
      <ul className="nav" style={{marginTop: '30px'}}>
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
        <li className={`nav-item ${pathname.startsWith('/admin/brands') ? 'active' : ''}`}>
          <Link className="nav-link" href="/admin/brands">
            <span className="menu-title">Marques</span>
            <i className="mdi mdi-certificate menu-icon"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
