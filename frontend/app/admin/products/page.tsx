"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubcategory, setFilterSubcategory] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetch("http://localhost:5000/api/categories")
      .then(r => r.json())
      .then(data => setCategories(data));
    fetch("http://localhost:5000/api/subcategories")
      .then(r => r.json())
      .then(data => setSubcategories(data));
  }, []);

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/products")
      .then(r => r.json())
      .then(data => setProducts(data));
  };

  const filtered = products.filter((prod: any) => {
    const matchSearch = prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.category?.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.subcategory?.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || prod.category?._id === filterCategory;
    const matchSubcategory = !filterSubcategory || prod.subcategory?._id === filterSubcategory;
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

  const resetFilters = () => {
    setSearch("");
    setFilterCategory("");
    setFilterSubcategory("");
    setFilterStock("");
    setSortBy("");
    setCurrentPage(1);
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
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
              <h3 className="page-title">Produits</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Produits</li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="card-title">Liste des produits</h4>
                      <Link href="/admin/products/new" className="btn btn-primary btn-sm">
                        <i className="mdi mdi-plus"></i> Ajouter un produit
                      </Link>
                    </div>
                    <div className="mb-4">
                      <div className="row g-2 mb-3 align-items-center">
                        <div className="col-lg-6 col-md-12">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="mdi mdi-magnify text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0 ps-0"
                              placeholder="Rechercher par nom, catégorie ou sous-catégorie..."
                              value={search}
                              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                              <i className="mdi mdi-sort text-muted"></i>
                            </span>
                            <select 
                              className="form-select border-start-0" 
                              value={sortBy} 
                              onChange={(e) => setSortBy(e.target.value)}
                            >
                              <option value="">Trier par</option>
                              <option value="price-asc">💰 Prix croissant</option>
                              <option value="price-desc">💰 Prix décroissant</option>
                              <option value="stock-asc">📦 Stock croissant</option>
                              <option value="stock-desc">📦 Stock décroissant</option>
                            </select>
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
                        <div className="card shadow-sm border-0 mt-3" style={{ backgroundColor: '#f8f9fa', animation: 'slideDown 0.3s ease-out' }}>
                          <style jsx>{`
                            @keyframes slideDown {
                              from {
                                opacity: 0;
                                transform: translateY(-10px);
                              }
                              to {
                                opacity: 1;
                                transform: translateY(0);
                              }
                            }
                          `}</style>
                          <div className="card-body">
                            <h6 className="mb-3 text-primary">
                              <i className="mdi mdi-filter-variant"></i> Filtres avancés
                            </h6>
                            <div className="row g-3">
                              <div className="col-md-4">
                                <label className="form-label fw-bold small text-muted">CATÉGORIE</label>
                                <select 
                                  className="form-select" 
                                  value={filterCategory} 
                                  onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                                >
                                  <option value="">Toutes les catégories</option>
                                  {categories.map((cat: any) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label fw-bold small text-muted">SOUS-CATÉGORIE</label>
                                <select 
                                  className="form-select" 
                                  value={filterSubcategory} 
                                  onChange={(e) => { setFilterSubcategory(e.target.value); setCurrentPage(1); }}
                                >
                                  <option value="">Toutes les sous-catégories</option>
                                  {subcategories.map((sub: any) => (
                                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-md-4">
                                <label className="form-label fw-bold small text-muted">STOCK</label>
                                <select 
                                  className="form-select" 
                                  value={filterStock} 
                                  onChange={(e) => { setFilterStock(e.target.value); setCurrentPage(1); }}
                                >
                                  <option value="">Tous les stocks</option>
                                  <option value="in">✅ En stock</option>
                                  <option value="low">⚠️ Stock faible (≤10)</option>
                                  <option value="out">❌ Rupture de stock</option>
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
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Nom</th>
                            <th>Marque</th>
                            <th>Catégorie</th>
                            <th>Sous-catégorie</th>
                            <th>Prix</th>
                            <th>Stock</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.length > 0 ? filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product: any) => (
                            <tr key={product._id}>
                              <td>
                                <img src={product.image} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }} />
                              </td>
                              <td>{product.name}</td>
                              <td>{product.brand?.name || <span className="text-muted">-</span>}</td>
                              <td>{product.category?.name}</td>
                              <td>{product.subcategory?.name}</td>
                              <td>{product.price} €</td>
                              <td>
                                <label className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                                  {product.stock}
                                </label>
                              </td>
                              <td>
                                <Link href={`/admin/products/${product._id}`} className="btn btn-sm btn-warning me-2">
                                  <i className="mdi mdi-pencil"></i>
                                </Link>
                                <button onClick={() => deleteProduct(product._id)} className="btn btn-sm btn-danger">
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={8} className="text-center">Aucun produit</td>
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
        </div>
      </div>
    </div>
  );
}
