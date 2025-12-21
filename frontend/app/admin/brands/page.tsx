"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    fetch("http://localhost:5000/api/brands")
      .then(r => r.json())
      .then(data => setBrands(data));
  };

  const filtered = brands.filter((brand: any) => {
    return brand.name.toLowerCase().includes(search.toLowerCase()) ||
      brand.description?.toLowerCase().includes(search.toLowerCase());
  }).sort((a: any, b: any) => {
    return sortOrder === "asc" 
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const deleteBrand = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cette marque ?")) {
      await fetch(`http://localhost:5000/api/brands/${id}`, { method: "DELETE" });
      fetchBrands();
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
                  <li className="breadcrumb-item active" aria-current="page">Marques</li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="card-title">Liste des marques</h4>
                      <Link href="/admin/brands/new" className="btn btn-primary btn-sm">
                        <i className="mdi mdi-plus"></i> Ajouter une marque
                      </Link>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex gap-2 align-items-center">
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher par nom ou description..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                          />
                        </div>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className={`btn ${sortOrder === "asc" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setSortOrder("asc")}
                            title="Trier de A à Z"
                          >
                            <i className="mdi mdi-sort-alphabetical-ascending"></i> A-Z
                          </button>
                          <button
                            type="button"
                            className={`btn ${sortOrder === "desc" ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setSortOrder("desc")}
                            title="Trier de Z à A"
                          >
                            <i className="mdi mdi-sort-alphabetical-descending"></i> Z-A
                          </button>
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
                                <Link href={`/admin/brands/${brand._id}`} className="btn btn-sm btn-warning me-2">
                                  <i className="mdi mdi-pencil"></i>
                                </Link>
                                <button onClick={() => deleteBrand(brand._id)} className="btn btn-sm btn-danger">
                                  <i className="mdi mdi-delete"></i>
                                </button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={3} className="text-center">Aucune marque</td>
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
