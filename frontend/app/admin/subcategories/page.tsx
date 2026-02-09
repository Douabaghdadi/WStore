"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { API_URL } from "../../../lib/api";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", description: "", category: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubcategories();
    fetch(`${API_URL}/api/categories`).then(r => r.json()).then(data => setCategories(data));
  }, []);

  const fetchSubcategories = () => {
    fetch(`${API_URL}/api/subcategories`).then(r => r.json()).then(data => setSubcategories(data));
  };

  const filtered = subcategories.filter((sub: any) => {
    const matchSearch = sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.category?.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || sub.category?._id === filterCategory;
    return matchSearch && matchCategory;
  });

  const resetFilters = () => {
    setSearch("");
    setFilterCategory("");
    setCurrentPage(1);
  };

  const deleteSubcategory = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette sous-catégorie ?")) {
      await fetch(`${API_URL}/api/subcategories/${id}`, { method: "DELETE" });
      fetchSubcategories();
    }
  };

  const openAddModal = () => {
    setEditingSubcategory(null);
    setFormData({ name: "", description: "", category: categories.length > 0 ? (categories[0] as any)._id : "" });
    setShowModal(true);
  };

  const openEditModal = (subcategory: any) => {
    setEditingSubcategory(subcategory);
    setFormData({ name: subcategory.name, description: subcategory.description || "", category: subcategory.category?._id || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = editingSubcategory 
        ? `${API_URL}/api/subcategories/${editingSubcategory._id}`
        : `${API_URL}/api/subcategories`;
      
      await fetch(url, {
        method: editingSubcategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      setShowModal(false);
      fetchSubcategories();
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
              <h3 className="page-title">Sous-catégories</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Sous-catégories</li>
                </ol>
              </nav>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title mb-0">Liste des sous-catégories</h4>
                  <button onClick={openAddModal} className="btn btn-primary btn-sm">
                    <i className="mdi mdi-plus"></i> Ajouter une sous-catégorie
                  </button>
                </div>
                <div className="mb-3">
                  <div className="row mb-2">
                    <div className="col-md-10">
                      <input type="text" className="form-control" placeholder="Rechercher..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} />
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-outline-primary w-100" onClick={() => setShowFilters(!showFilters)}>
                        <i className={`mdi mdi-filter${showFilters ? '-remove' : ''}`}></i> Filtres
                      </button>
                    </div>
                  </div>
                  {showFilters && (
                    <div className="card mt-2" style={{ backgroundColor: '#f8f9fa' }}>
                      <div className="card-body">
                        <label className="form-label small text-muted">CATÉGORIE</label>
                        <select className="form-select" value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}>
                          <option value="">Toutes les catégories</option>
                          {categories.map((cat: any) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                        </select>
                        <div className="mt-3 d-flex justify-content-between align-items-center">
                          <button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}><i className="mdi mdi-refresh"></i> Réinitialiser</button>
                          <span className="badge bg-primary">{filtered.length} résultat(s)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length > 0 ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((subcategory: any) => (
                        <tr key={subcategory._id}>
                          <td>{subcategory.name}</td>
                          <td><span className="badge badge-info">{subcategory.category?.name}</span></td>
                          <td>{subcategory.description}</td>
                          <td>
                            <button onClick={() => openEditModal(subcategory)} className="btn btn-sm btn-warning me-2">
                              <i className="mdi mdi-pencil"></i>
                            </button>
                            <button onClick={() => deleteSubcategory(subcategory._id)} className="btn btn-sm btn-danger">
                              <i className="mdi mdi-delete"></i>
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="text-center py-4"><i className="mdi mdi-folder-multiple-outline" style={{ fontSize: '48px', color: '#ccc' }}></i><p className="text-muted mt-2">Aucune sous-catégorie</p></td></tr>
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
                    <i className={`mdi ${editingSubcategory ? 'mdi-folder-edit' : 'mdi-folder-plus'}`}></i>
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 600 }}>{editingSubcategory ? 'Modifier la sous-catégorie' : 'Nouvelle sous-catégorie'}</h5>
                    <small style={{ opacity: 0.9 }}>{editingSubcategory ? 'Mettre à jour les informations' : 'Créer une nouvelle sous-catégorie'}</small>
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
                  <i className="mdi mdi-folder-outline me-1"></i> Nom
                </label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Nom de la sous-catégorie" style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#ef4444'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <i className="mdi mdi-shape-outline me-1"></i> Catégorie parente
                </label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', background: 'white' }} onFocus={(e) => e.target.style.borderColor = '#ef4444'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}>
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat: any) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                </select>
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
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</> : <><i className="mdi mdi-check me-1"></i>{editingSubcategory ? 'Mettre à jour' : 'Créer'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
