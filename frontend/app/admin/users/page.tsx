"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const filtered = users.filter((user: any) => {
    const matchSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || user.role === filterRole;
    return matchSearch && matchRole;
  });

  const resetFilters = () => {
    setSearch("");
    setFilterRole("");
    setCurrentPage(1);
  };

  const deleteUser = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      fetchUsers();
    }
  };

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">Utilisateurs</h3>
              <Link href="/admin/users/new" className="btn btn-primary btn-sm">
                <i className="mdi mdi-plus"></i> Ajouter un utilisateur
              </Link>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="mb-4">
                  <div className="row g-2 mb-3 align-items-center">
                    <div className="col-lg-9 col-md-12">
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <i className="mdi mdi-magnify text-muted"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0 ps-0"
                          placeholder="Rechercher par nom ou email..."
                          value={search}
                          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <button 
                        className={`btn w-100 ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <i className={`mdi mdi-filter${showFilters ? '-remove' : '-variant'}`}></i> 
                        {showFilters ? 'Masquer filtres' : 'Afficher filtres'}
                      </button>
                    </div>
                  </div>
                  {showFilters && (
                    <div className="card shadow-sm border-0 mt-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <div className="card-body">
                        <h6 className="mb-3 text-primary">
                          <i className="mdi mdi-filter-variant"></i> Filtres avancés
                        </h6>
                        <div className="row g-3">
                          <div className="col-md-12">
                            <label className="form-label fw-bold small text-muted">RÔLE</label>
                            <select 
                              className="form-select" 
                              value={filterRole} 
                              onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
                            >
                              <option value="">Tous les rôles</option>
                              <option value="admin">🔑 Admin</option>
                              <option value="user">👤 Utilisateur</option>
                            </select>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                          <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}>
                            <i className="mdi mdi-refresh"></i> Réinitialiser
                          </button>
                          <span className="badge bg-primary rounded-pill px-3 py-2">
                            {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Rôle</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user: any) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <label className={`badge badge-${user.role === 'admin' ? 'danger' : 'info'}`}>
                              {user.role}
                            </label>
                          </td>
                          <td>
                            <Link href={`/admin/users/${user._id}`} className="btn btn-warning btn-sm me-2">
                              <i className="mdi mdi-pencil"></i>
                            </Link>
                            <button onClick={() => deleteUser(user._id)} className="btn btn-danger btn-sm">
                              <i className="mdi mdi-delete"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
  );
}
