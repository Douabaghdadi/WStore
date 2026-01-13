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
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client"
  });
  const [loading, setLoading] = useState(false);

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

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "client" });
    setShowModal(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingUser) {
        // Mise à jour
        const updateData: any = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password) updateData.password = formData.password;
        
        await fetch(`http://localhost:5000/api/users/${editingUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData)
        });
      } else {
        // Création
        await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
      }
      
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
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
              <button onClick={openAddModal} className="btn btn-primary btn-sm">
                <i className="mdi mdi-plus"></i> Ajouter un utilisateur
              </button>
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
                            <button onClick={() => openEditModal(user)} className="btn btn-warning btn-sm me-2">
                              <i className="mdi mdi-pencil"></i>
                            </button>
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

      {/* Modal Popup */}
      {showModal && (
        <div 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }} 
          onClick={() => setShowModal(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{ 
              background: 'white',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              animation: 'popIn 0.3s ease'
            }}
          >
            <style>{`
              @keyframes popIn {
                from {
                  opacity: 0;
                  transform: scale(0.9) translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
            `}</style>
            
            {/* Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              padding: '1.5rem',
              color: 'white'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    <i className={`mdi ${editingUser ? 'mdi-account-edit' : 'mdi-account-plus'}`}></i>
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 600 }}>
                      {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                    </h5>
                    <small style={{ opacity: 0.9 }}>
                      {editingUser ? 'Mettre à jour les informations' : 'Créer un nouveau compte'}
                    </small>
                  </div>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '10px',
                    width: '40px',
                    height: '40px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="mdi mdi-close" style={{ fontSize: '1.25rem' }}></i>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  <i className="mdi mdi-account-outline me-1"></i>
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Entrez le nom"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  <i className="mdi mdi-email-outline me-1"></i>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="exemple@email.com"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  <i className="mdi mdi-lock-outline me-1"></i>
                  Mot de passe {editingUser && <span style={{ fontWeight: 400, textTransform: 'none' }}>(laisser vide pour ne pas changer)</span>}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingUser}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  <i className="mdi mdi-shield-account-outline me-1"></i>
                  Rôle
                </label>
                <div className="d-flex gap-2">
                  {[
                    { value: 'client', label: 'Client', icon: 'mdi-account', color: '#3b82f6' },
                    { value: 'admin', label: 'Admin', icon: 'mdi-shield-crown', color: '#ef4444' }
                  ].map(role => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({...formData, role: role.value})}
                      style={{
                        flex: 1,
                        padding: '0.875rem',
                        borderRadius: '12px',
                        border: formData.role === role.value 
                          ? `2px solid ${role.color}` 
                          : '2px solid #e2e8f0',
                        background: formData.role === role.value 
                          ? `${role.color}10` 
                          : 'white',
                        color: formData.role === role.value 
                          ? role.color 
                          : '#64748b',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <i className={`mdi ${role.icon}`}></i>
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: '0.875rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-check"></i>
                      {editingUser ? 'Mettre à jour' : 'Créer l\'utilisateur'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
