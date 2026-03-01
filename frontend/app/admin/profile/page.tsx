"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser._id || parsedUser.id) {
        fetchUserDetails(parsedUser._id || parsedUser.id);
      }
    }
  }, []);

  const fetchUserDetails = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">Mon Profil</h3>
            </div>
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <div className="row">
                  <div className="col-md-4 text-center border-end">
                    <div className="mb-4">
                      <img 
                        src={user.photo ? `${API_URL}${user.photo}` : "/admin/images/faces/face1.jpg"}
                        alt="Photo" 
                        style={{ 
                          width: "180px", 
                          height: "180px", 
                          objectFit: "cover", 
                          borderRadius: "50%",
                          border: "4px solid #a855f7",
                          boxShadow: "0 4px 15px rgba(168, 85, 247, 0.3)"
                        }} 
                      />
                    </div>
                    <h4 className="mb-2 fw-bold">{user.name}</h4>
                    <span className={`badge badge-${user.role === 'admin' ? 'danger' : 'info'} px-3 py-2`}>
                      {user.role === 'admin' ? '🔑 Administrateur' : '👤 Client'}
                    </span>
                  </div>
                  <div className="col-md-8 ps-5">
                    <h5 className="mb-4 text-primary fw-bold">
                      <i className="mdi mdi-account-details"></i> Informations personnelles
                    </h5>
                    <div className="mb-4 p-3 bg-light rounded">
                      <div className="row mb-3">
                        <div className="col-md-3">
                          <strong className="text-muted"><i className="mdi mdi-account"></i> Nom:</strong>
                        </div>
                        <div className="col-md-9">
                          <span className="fs-6">{user.name}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row mb-3">
                        <div className="col-md-3">
                          <strong className="text-muted"><i className="mdi mdi-email"></i> Email:</strong>
                        </div>
                        <div className="col-md-9">
                          <span className="fs-6">{user.email}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-md-3">
                          <strong className="text-muted"><i className="mdi mdi-shield-account"></i> Rôle:</strong>
                        </div>
                        <div className="col-md-9">
                          <span className={`badge badge-${user.role === 'admin' ? 'danger' : 'info'}`}>
                            {user.role === 'admin' ? 'Administrateur' : 'Client'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Link href={`/admin/users/${user._id}`} className="btn btn-primary btn-lg">
                        <i className="mdi mdi-pencil"></i> Modifier mon profil
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
