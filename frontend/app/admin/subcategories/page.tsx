"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchSubcategories();
  }, []);

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
                          {subcategories.length > 0 ? subcategories.map((subcategory: any) => (
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
