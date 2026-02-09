"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { API_URL } from "../../../lib/api";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    fetch(`${API_URL}/api/brands`)
      .then(r => r.json())
      .then(data => setBrands(data));
  };

  const filtered = brands.filter((brand: any) => {
    return brand.name.toLowerCase().includes(search.toLowerCase()) ||
      brand.description?.toLowerCase().includes(search.toLowerCase());
  }).sort((a: any, b: any) => {
    return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
  });

  const deleteBrand = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette marque ?")) {
      await fetch(`${API_URL}/api/brands/${id}`, { method: "DELETE" });
      fetchBrands();
    }
  };

  const openAddModal = () => {
    setEditingBrand(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (brand: any) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, description: brand.description || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = editingBrand 
        ? `${API_URL}/api/brands/${editingBrand._id}`
        : `${API_URL}/api/brands`;
      
      await fetch(url, {
        method: editingBrand ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      setShowModal(false);
      fetchBrands();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setSubmitting(false);
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
              <h3 className="page-title">Marques</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Marques</li>
                </ol>
              </nav>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title mb-0">Liste des marques</h4>
                  <button onClick={openAddModal} className="btn btn-primary btn-sm">
                    <i className="mdi mdi-plus"></i> Ajouter une marque
                  </button>
                </div>
                <div className="mb-3">
                  <div className="d-flex gap-2 align-items-center">
                    <div style={{ flex: 1 }}>
                      <input type="text" className="form-control" placeholder="Rechercher..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
                    </div>
                    <div className="btn-group">
                      <button type="button" className={`btn ${sortOrder === "asc" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setSortOrder("asc")}>A-Z</button>
                      <button type="button" className={`btn ${sortOrder === "desc" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setSortOrder("desc")}>Z-A</button>
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length > 0 ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((brand: any) => (
                        <tr key={brand._id}>
                          <td>{brand.name}</td>
                          <td>{brand.description}</td>
                          <td>
                            <button onClick={() => openEditModal(brand)} className="btn btn-sm btn-warning me-2">
                              <i className="mdi mdi-pencil"></i>
                            </button>
                            <button onClick={() => deleteBrand(brand._id)} className="btn btn-sm btn-danger">
                              <i className="mdi mdi-delete"></i>
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={3} className="text-center py-4"><i className="mdi mdi-tag-off" style={{ fontSize: '48px', color: '#ccc' }}></i><p className="text-muted mt-2">Aucune marque</p></td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {filtered.length > itemsPerPage && (
                  <div className="d-flex justify-content-center mt-3">
                    <nav><ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button></li>
                      {[...Array(Math.ceil(filtered.length / itemsPerPage))].map((_, i) => (<li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}><button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button></li>))}
                      <li className={`page-item ${currentPage === Math.ceil(filtered.length / itemsPerPage) ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button></li>
                    </ul></nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', animation: 'popIn 0.3s ease' }}>
            <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
            
            <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '1.5rem', color: 'white' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    <i className={`mdi ${editingBrand ? 'mdi-tag-edit' : 'mdi-tag-plus'}`}></i>
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 600 }}>{editingBrand ? 'Modifier la marque' : 'Nouvelle marque'}</h5>
                    <small style={{ opacity: 0.9 }}>{editingBrand ? 'Mettre à jour les informations' : 'Créer une nouvelle marque'}</small>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', width: '40px', height: '40px', color: 'white', cursor: 'pointer' }}>
                  <i className="mdi mdi-close" style={{ fontSize: '1.25rem' }}></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <i className="mdi mdi-tag-outline me-1"></i> Nom
                </label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Nom de la marque" style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#ef4444'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <i className="mdi mdi-text me-1"></i> Description
                </label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Description (optionnel)" rows={3} style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', resize: 'none' }} onFocus={(e) => e.target.style.borderColor = '#ef4444'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              <div className="d-flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
                <button type="submit" disabled={submitting} style={{ flex: 2, padding: '0.875rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</> : <><i className="mdi mdi-check me-1"></i>{editingBrand ? 'Mettre à jour' : 'Créer'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
