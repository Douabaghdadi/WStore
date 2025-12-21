"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    subcategory: "",
    brand: "",
    image: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/subcategories")
      .then(r => r.json())
      .then(data => setSubcategories(data));
    fetch("http://localhost:5000/api/brands")
      .then(r => r.json())
      .then(data => setBrands(data));

    fetch(`http://localhost:5000/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        subcategory: data.subcategory?._id || "",
        brand: data.brand?._id || "",
        image: data.image
      }));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/api/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    router.push("/admin/products");
  };

  return (
    <div className="container-scroller">
      <Navbar />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title">Modifier le produit</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/products">Produits</Link></li>
                  <li className="breadcrumb-item active">Modifier</li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="col-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Nom</label>
                        <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
                      </div>
                      <div className="form-group">
                        <label>Sous-catégorie</label>
                        <select className="form-control" value={formData.subcategory} onChange={e => setFormData({...formData, subcategory: e.target.value})} required>
                          <option value="">Sélectionner une sous-catégorie</option>
                          {subcategories.map((sub: any) => (
                            <option key={sub._id} value={sub._id}>{sub.category?.name} - {sub.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Marque</label>
                        <select className="form-control" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}>
                          <option value="">Sélectionner une marque (optionnel)</option>
                          {brands.map((brand: any) => (
                            <option key={brand._id} value={brand._id}>{brand.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Prix (€)</label>
                        <input type="number" step="0.01" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Stock</label>
                        <input type="number" className="form-control" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>URL Image</label>
                        <input type="text" className="form-control" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} required />
                      </div>
                      <button type="submit" className="btn btn-primary me-2">Enregistrer</button>
                      <Link href="/admin/products" className="btn btn-light">Annuler</Link>
                    </form>
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
