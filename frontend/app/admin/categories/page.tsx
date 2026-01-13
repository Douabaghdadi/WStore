"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:5000/api/categories");
      if (!response.ok) throw new Error("Erreur lors du chargement des catégories");
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger les catégories.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = categories.filter((cat: any) => {
    return cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description?.toLowerCase().includes(search.toLowerCase());
  });

  const deleteCategory = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      try {
        await fetch(`http://localhost:5000/api/categories/${id}`, { method: "DELETE" });
        fetchCategories();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || "" });
    setImageFile(null);
    setImagePreview(category.image ? `http://localhost:5000${category.image}` : "");
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      if (imageFile) formDataToSend.append("image", imageFile);

      const url = editingCategory 
        ? `http://localhost:5000/api/categories/${editingCategory._id}`
        : "http://localhost:5000/api/categories";
      
      await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        body: formDataToSend
      });
      
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-scroller">
        <Navbar />
        <div className="container-fluid page-body-wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">Catégories</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item active">Catégories</li>
                </ol>
              </nav>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title mb-0">Liste des catégories</h4>
                  <button onClick={openAddModal} className="btn btn-primary btn-sm">
                    <i className="mdi mdi-plus"></i> Ajouter une catégorie
                  </button>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th style={{ width: '80px' }}>Image</th>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length > 0 ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((category: any) => (
                        <tr key={category._id}>
                          <td>
                            <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {category.image ? (
                                <img src={`http://localhost:5000${category.image}`} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <i className="mdi mdi-image" style={{ fontSize: '24px', color: '#ccc' }}></i>
                              )}
                            </div>
                          </td>
                          <td>{category.name}</td>
                          <td>{category.description}</td>
                          <td>
                            <button onClick={() => openEditModal(category)} className="btn btn-sm btn-warning me-2">
                              <i className="mdi mdi-pencil"></i>
                            </button>
                            <button onClick={() => deleteCategory(category._id)} className="btn btn-sm btn-danger">
                              <i className="mdi mdi-delete"></i>
                            </button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="text-center py-4">
                            <i className="mdi mdi-folder-open" style={{ fontSize: '48px', color: '#ccc' }}></i>
                            <p className="text-muted mt-2">Aucune catégorie</p>
                          </td>
                        </tr>
                      )}
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', animation: 'popIn 0.3s ease' }}>
            <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
            
            <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '1.5rem', color: 'white' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    <i className={`mdi ${editingCategory ? 'mdi-folder-edit' : 'mdi-folder-plus'}`}></i>
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 600 }}>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h5>
                    <small style={{ opacity: 0.9 }}>{editingCategory ? 'Mettre à jour les informations' : 'Créer une nouvelle catégorie'}</small>
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
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Nom de la catégorie" style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#ef4444'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <i className="mdi mdi-text me-1"></i> Description
                </label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Description (optionnel)" rows={3} style={{ width: '100%', padding: '0.875rem 1rem', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '0.95rem', outline: 'none', resize: 'none' }} onFocus={(e) => e.target.style.borderColor = '#ef4444'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  <i className="mdi mdi-image me-1"></i> Image
                </label>
                <div style={{ border: '2px dashed #e2e8f0', borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => document.getElementById('imageInput')?.click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
                  ) : (
                    <div style={{ color: '#94a3b8' }}>
                      <i className="mdi mdi-cloud-upload" style={{ fontSize: '2rem' }}></i>
                      <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>Cliquez pour ajouter une image</p>
                    </div>
                  )}
                </div>
                <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>

              <div className="d-flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
                <button type="submit" disabled={submitting} style={{ flex: 2, padding: '0.875rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</> : <><i className="mdi mdi-check me-1"></i>{editingCategory ? 'Mettre à jour' : 'Créer'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
