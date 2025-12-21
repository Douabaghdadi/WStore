"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row" style={{zIndex: 999}}>
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
        <Link className="navbar-brand brand-logo" href="/admin">
          <img src="/img/logo.png" alt="Parapharmacie" style={{height: '70px', width: 'auto'}} />
        </Link>
        <Link className="navbar-brand brand-logo-mini" href="/admin">
          <img src="/img/logo.png" alt="P" style={{height: '60px', width: 'auto'}} />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-stretch">
        <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
          <span className="mdi mdi-menu"></span>
        </button>
        <div className="search-field d-none d-md-block">
          <form className="d-flex align-items-center h-100" action="#">
            <div className="input-group">
              <div className="input-group-prepend bg-transparent">
                <i className="input-group-text border-0 mdi mdi-magnify"></i>
              </div>
              <input type="text" className="form-control bg-transparent border-0" placeholder="Search projects" />
            </div>
          </form>
        </div>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item nav-profile dropdown">
            <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
              <div className="nav-profile-img">
                <img src={user?.photo ? `http://localhost:5000${user.photo}` : "/admin/images/faces/face1.jpg"} alt="image" />
                <span className="availability-status online"></span>
              </div>
              <div className="nav-profile-text">
                <p className="mb-1 text-black">{user?.name || 'Utilisateur'}</p>
              </div>
            </a>
            <div className="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">
              <Link className="dropdown-item" href="/admin/profile">
                <i className="mdi mdi-account me-2 text-success"></i> Profile
              </Link>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" onClick={handleLogout} style={{ cursor: "pointer" }}>
                <i className="mdi mdi-logout me-2 text-primary"></i> Déconnexion
              </a>
            </div>
          </li>
          <li className="nav-item d-none d-lg-block full-screen-link">
            <a className="nav-link">
              <i className="mdi mdi-fullscreen" id="fullscreen-button"></i>
            </a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link count-indicator dropdown-toggle" id="messageDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="mdi mdi-email-outline"></i>
              <span className="count-symbol bg-warning"></span>
            </a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" href="#" data-bs-toggle="dropdown">
              <i className="mdi mdi-bell-outline"></i>
              <span className="count-symbol bg-danger"></span>
            </a>
          </li>
          <li className="nav-item nav-logout d-none d-lg-block">
            <a className="nav-link" onClick={handleLogout} style={{ cursor: "pointer" }}>
              <i className="mdi mdi-power"></i>
            </a>
          </li>
          <li className="nav-item nav-settings d-none d-lg-block">
            <a className="nav-link" href="#">
              <i className="mdi mdi-format-line-spacing"></i>
            </a>
          </li>
        </ul>
        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  );
}
