"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSubcategories();
    fetch("http://localhost:5000/api/categories")
      .then(r => r.json())
      .then(data => setCategories(data));
  }, []);

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

  const fetchSubcategories = () => {
    fetch("http://localhost:5000/api/subcategories")
      .then(r => r.json())
      .then(data => setSubcategories(data));
  };

  const deleteSubcategory = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette sous-catégorie ?")) {
      await fetch(`http://localhost:5000/api/subcategories/${id}`, { method: "DELETE" });
      fetchSubcategories();
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
                  <li className="breadcrumb-item active" aria-current="page">Sous-catégories</li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="card-title">Liste des sous-catégories</h4>
                      <Link href="/admin/subcategories/new" className="btn btn-primary btn-sm">
                        <i className="mdi mdi-plus"></i> Ajouter une sous-catégorie
                      </Link>
                    </div>
                    <div className="mb-3">
                      <div className="row mb-2">
                        <div className="col-md-10">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher par nom, catégorie ou description..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                          />
                        </div>
                        <div className="col-md-2">
                          <button 
                            className="btn btn-outline-primary w-100" 
                            onClick={() => setShowFilters(!showFilters)}
                          >
                            <i className={`mdi mdi-filter${showFilters ? '-remove' : ''}`}></i> Filtres
                          </button>
                        </div>
                      </div>
                      {showFilters && (
                        <div className="card">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-12">
                                <label className="form-label">Catégorie</label>
                                <select 
                                  className="form-control" 
                                  value={filterCategory} 
                                  onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                                >
                                  <option value="">Toutes les catégories</option>
                                  {categories.map((cat: any) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="mt-3">
                              <button className="btn btn-sm btn-secondary" onClick={resetFilters}>
                                <i className="mdi mdi-refresh"></i> Réinitialiser
                              </button>
                              <span className="ms-3 text-muted">{filtered.length} résultat(s)</span>
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
                              <td>{subcategory.category?.name}</td>
                              <td>{subcategory.description}</td>
                              <td>
                                <Link href={`/admin/subcategories/${subcategory._id}`} className="btn btn-sm btn-warning me-2">
                                  <i className="mdi mdi-pencil"></i>
                                </Link>
                                <button onClick={() => deleteSubcategory(subcategory._id)} className="btn btn-sm btn-danger">
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="text-center">Aucune sous-catégorie</td>
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
