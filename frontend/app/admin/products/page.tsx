"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubcategory, setFilterSubcategory] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", discount: "0", stock: "", subcategories: [] as string[], brand: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Erreur");
      setProducts(await response.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/api/categories");
    if (res.ok) setCategories(await res.json());
  };

  const fetchSubcategories = async () => {
    const res = await fetch("http://localhost:5000/api/subcategories");
    if (res.ok) setSubcategories(await res.json());
  };

  const fetchBrands = async () => {
    const res = await fetch("http://localhost:5000/api/brands");
    if (res.ok) setBrands(await res.json());
  };

  const filtered = products.filter((prod: any) => {
    const matchSearch = prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.category?.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || prod.category?._id === filterCategory;
    const matchSubcategory = !filterSubcategory || prod.subcategories?.some((sub: any) => sub._id === filterSubcategory);
    const matchStock = !filterStock || 
      (filterStock === "in" && prod.stock > 0) ||
      (filterStock === "out" && prod.stock === 0) ||
      (filterStock === "low" && prod.stock > 0 && prod.stock <= 10);
    return matchSearch && matchCategory && matchSubcategory && matchStock;
  }).sort((a: any, b: any) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "stock-asc") return a.stock - b.stock;
    if (sortBy === "stock-desc") return b.stock - a.stock;
    return 0;
  });

  const resetFilters = () => { setSearch(""); setFilterCategory(""); setFilterSubcategory(""); setFilterStock(""); setSortBy(""); setCurrentPage(1); };

  const deleteProduct = async (id: string) => {
    if (confirm("Supprimer ce produit ?")) {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    }
  };

  const toggleStock = async (product: any) => {
    const newStock = product.stock > 0 ? 0 : (product.previousStock > 0 ? product.previousStock : 10);
    await fetch(`http://localhost:5000/api/products/${product._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, stock: newStock, previousStock: product.stock, category: product.category?._id, subcategories: product.subcategories?.map((s: any) => s._id), brand: product.brand?._id })
    });
    fetchProducts();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", description: "", price: "", discount: "0", stock: "", subcategories: [], brand: "" });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      discount: product.discount?.toString() || "0",
      stock: product.stock.toString(),
      subcategories: product.subcategories?.map((s: any) => s._id) || [],
      brand: product.brand?._id || ""
    });
    setImageFile(null);
    setImagePreview(product.image || "");
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("discount", formData.discount);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("subcategories", JSON.stringify(formData.subcategories));
      if (formData.brand) formDataToSend.append("brand", formData.brand);
      if (imageFile) formDataToSend.append("image", imageFile);

      const url = editingProduct ? `http://localhost:5000/api/products/${editingProduct._id}` : "http://localhost:5000/api/products";
      await fetch(url, { method: editingProduct ? "PUT" : "POST", body: formDataToSend });
      
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const groupedSubcategories = categories.map((cat: any) => ({
    category: cat,
    subcats: subcategories.filter((sub: any) => sub.category?._id === cat._id)
  })).filter((group: any) => group.subcats.length > 0);

  if (loading) {
    return (
      <div className="container-scroller"><Navbar /><div className="container-fluid page-body-wrapper"><Sidebar /><div className="main-panel"><div className="content-wrapper"><div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}><div className="spinner-border text-primary"></div></div></div></div></div></div>
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
              <h3 className="page-title">Produits</h3>
              <nav aria-label="breadcrumb"><ol className="breadcrumb"><li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li><li className="breadcrumb-item active">Produits</li></ol></nav>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="card-title mb-0">Liste des produits</h4>
                  <button onClick={openAddModal} className="btn btn-primary btn-sm"><i className="mdi mdi-plus"></i> Ajouter un produit</button>
                </div>
                <div className="mb-4">
                  <div className="row g-2 mb-3">
                    <div className="col-lg-6"><input type="text" className="form-control" placeholder="Rechercher..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} /></div>
                    <div className="col-lg-3"><select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="">Trier par</option><option value="price-asc">Prix ↑</option><option value="price-desc">Prix ↓</option><option value="stock-asc">Stock ↑</option><option value="stock-desc">Stock ↓</option></select></div>
                    <div className="col-lg-3"><button className={`btn w-100 ${showFilters ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setShowFilters(!showFilters)}><i className="mdi mdi-filter"></i> Filtres</button></div>
                  </div>
                  {showFilters && (
                    <div className="card mt-2" style={{ backgroundColor: '#f8f9fa' }}>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-md-4"><label className="form-label small text-muted">CATÉGORIE</label><select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}><option value="">Toutes</option>{categories.map((cat: any) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}</select></div>
                          <div className="col-md-4"><label className="form-label small text-muted">SOUS-CATÉGORIE</label><select className="form-select" value={filterSubcategory} onChange={(e) => setFilterSubcategory(e.target.value)}><option value="">Toutes</option>{subcategories.map((sub: any) => (<option key={sub._id} value={sub._id}>{sub.name}</option>))}</select></div>
                          <div className="col-md-4"><label className="form-label small text-muted">STOCK</label><select className="form-select" value={filterStock} onChange={(e) => setFilterStock(e.target.value)}><option value="">Tous</option><option value="in">En stock</option><option value="low">Stock faible</option><option value="out">Rupture</option></select></div>
                        </div>
                        <div className="mt-3 d-flex justify-content-between"><button className="btn btn-sm btn-outline-secondary" onClick={resetFilters}><i className="mdi mdi-refresh"></i> Réinitialiser</button><span className="badge bg-primary">{filtered.length} résultat(s)</span></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead><tr><th>Image</th><th>Nom</th><th>Marque</th><th>Catégorie</th><th>Prix</th><th>Stock</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filtered.length > 0 ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product: any) => (
                        <tr key={product._id}>
                          <td><img src={product.image} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }} /></td>
                          <td>{product.name}</td>
                          <td>{product.brand?.name || "-"}</td>
                          <td>{product.category?.name}</td>
                          <td>{product.discount > 0 ? (<><span className="text-decoration-line-through text-muted">{product.price}</span> <span className="text-success fw-bold">{(product.price * (1 - product.discount / 100)).toFixed(2)}</span></>) : product.price} TND</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <span className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>{product.stock}</span>
                              <div onClick={() => toggleStock(product)} style={{ width: '40px', height: '22px', borderRadius: '11px', background: product.stock > 0 ? '#28a745' : '#dc3545', cursor: 'pointer', position: 'relative' }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '2px', left: product.stock > 0 ? '20px' : '2px', transition: 'left 0.3s' }}></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <button onClick={() => openEditModal(product)} className="btn btn-sm btn-warning me-2"><i className="mdi mdi-pencil"></i></button>
                            <button onClick={() => deleteProduct(product._id)} className="btn btn-sm btn-danger"><i className="mdi mdi-delete"></i></button>
                          </td>
                        </tr>
                      )) : (<tr><td colSpan={7} className="text-center py-4"><i className="mdi mdi-package-variant-closed" style={{ fontSize: '48px', color: '#ccc' }}></i><p className="text-muted mt-2">Aucun produit</p></td></tr>)}
                    </tbody>
                  </table>
                </div>
                {filtered.length > itemsPerPage && (
                  <div className="d-flex justify-content-center mt-3"><nav><ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Précédent</button></li>
                    {[...Array(Math.ceil(filtered.length / itemsPerPage))].map((_, i) => (<li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}><button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button></li>))}
                    <li className={`page-item ${currentPage === Math.ceil(filtered.length / itemsPerPage) ? 'disabled' : ''}`}><button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Suivant</button></li>
                  </ul></nav></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup Produit */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }} onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '700px', maxHeight: '90vh', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'popIn 0.3s ease' }}>
            <style>{`@keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
            
            <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', padding: '1.5rem', color: 'white', flexShrink: 0 }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    <i className={`mdi ${editingProduct ? 'mdi-package-variant' : 'mdi-package-variant-closed-plus'}`}></i>
                  </div>
                  <div>
                    <h5 style={{ margin: 0, fontWeight: 600 }}>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h5>
                    <small style={{ opacity: 0.9 }}>{editingProduct ? 'Mettre à jour les informations' : 'Ajouter un nouveau produit'}</small>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', width: '40px', height: '40px', color: 'white', cursor: 'pointer' }}>
                  <i className="mdi mdi-close" style={{ fontSize: '1.25rem' }}></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              <div className="row">
                <div className="col-md-8">
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Nom du produit</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Nom du produit" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#ef4444'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Marque</label>
                    <select value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none', background: 'white' }}>
                      <option value="">Aucune</option>
                      {brands.map((b: any) => (<option key={b._id} value={b._id}>{b.name}</option>))}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Description du produit" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none', resize: 'none' }} onFocus={(e) => e.target.style.borderColor = '#ef4444'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>

              <div className="row">
                <div className="col-md-4">
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Prix (TND)</label>
                    <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required placeholder="0.00" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none' }} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Réduction (%)</label>
                    <input type="number" min="0" max="100" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} placeholder="0" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none' }} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Stock</label>
                    <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required placeholder="0" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', outline: 'none' }} />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sous-catégories <span className="badge bg-primary ms-2">{formData.subcategories.length}</span></label>
                <div style={{ border: '2px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem', maxHeight: '150px', overflowY: 'auto' }}>
                  {groupedSubcategories.map((group: any) => (
                    <div key={group.category._id} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{group.category.name}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginLeft: '0.5rem' }}>
                        {group.subcats.map((sub: any) => (
                          <label key={sub._id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', background: formData.subcategories.includes(sub._id) ? '#fef2f2' : '#f8fafc', border: formData.subcategories.includes(sub._id) ? '1px solid #ef4444' : '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input type="checkbox" checked={formData.subcategories.includes(sub._id)} onChange={(e) => {
                              const newSubs = e.target.checked ? [...formData.subcategories, sub._id] : formData.subcategories.filter(id => id !== sub._id);
                              setFormData({...formData, subcategories: newSubs});
                            }} style={{ accentColor: '#ef4444' }} />
                            {sub.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Image</label>
                <div style={{ border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '1rem', textAlign: 'center', cursor: 'pointer' }} onClick={() => document.getElementById('productImageInput')?.click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '120px', borderRadius: '8px' }} />
                  ) : (
                    <div style={{ color: '#94a3b8' }}><i className="mdi mdi-cloud-upload" style={{ fontSize: '2rem' }}></i><p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>Cliquez pour ajouter</p></div>
                  )}
                </div>
                <input type="file" id="productImageInput" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>

              <div className="d-flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>Annuler</button>
                <button type="submit" disabled={submitting} style={{ flex: 2, padding: '0.875rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement...</> : <><i className="mdi mdi-check me-1"></i>{editingProduct ? 'Mettre à jour' : 'Créer'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
