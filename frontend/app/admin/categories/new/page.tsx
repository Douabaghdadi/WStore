"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


export default function NewCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await fetch(`${API_URL}/api/categories`, {
        method: "POST",
        body: formDataToSend
      });

      if (response.ok) {
        router.push("/admin/categories");
      } else {
        alert("Erreur lors de la création de la catégorie");
      }
    } catch (error) {
      alert("Erreur lors de la création de la catégorie");
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
              <h3 className="page-title">Ajouter une catégorie</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link href="/admin">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link href="/admin/categories">Catégories</Link></li>
                  <li className="breadcrumb-item active">Nouveau</li>
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
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.name} 
                          onChange={e => setFormData({...formData, name: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea 
                          className="form-control" 
                          rows={4} 
                          value={formData.description} 
                          onChange={e => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                      </div>
                      <div className="form-group">
                        <label>Image de la catégorie</label>
                        <div className="d-flex align-items-start gap-3">
                          <div 
                            style={{
                              width: '150px',
                              height: '150px',
                              border: '2px dashed #ddd',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              background: '#f8f9fa'
                            }}
                          >
                            {imagePreview ? (
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="text-center text-muted">
                                <i className="mdi mdi-image" style={{ fontSize: '40px' }}></i>
                                <p className="mb-0" style={{ fontSize: '12px' }}>Aucune image</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <input
                              type="file"
                              id="categoryImage"
                              accept="image/*"
                              onChange={handleImageChange}
                              style={{ display: 'none' }}
                            />
                            <label htmlFor="categoryImage" className="btn btn-outline-primary btn-sm">
                              <i className="mdi mdi-upload"></i> Choisir une image
                            </label>
                            <p className="text-muted mt-2" style={{ fontSize: '12px' }}>
                              Formats acceptés: JPG, PNG, GIF<br/>
                              Taille recommandée: 400x300 pixels
                            </p>
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Enregistrement...
                          </>
                        ) : (
                          'Enregistrer'
                        )}
                      </button>
                      <Link href="/admin/categories" className="btn btn-light">Annuler</Link>
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
