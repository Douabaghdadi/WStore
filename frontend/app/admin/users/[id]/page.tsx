"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "client",
    photo: ""
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const fetchUser = async () => {
    const res = await fetch(`http://localhost:5000/api/users/${params.id}`);
    const data = await res.json();
    setFormData({ name: data.name, email: data.email, role: data.role, photo: data.photo || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("role", formData.role);
    if (photoFile) {
      data.append("photo", photoFile);
    }
    const res = await fetch(`http://localhost:5000/api/users/${params.id}`, {
      method: "PUT",
      body: data
    });
    if (res.ok) {
      const updatedUser = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Profil mis à jour avec succès!');
      router.push("/admin/profile");
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
              <h3 className="page-title">Modifier Utilisateur</h3>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <div className="mb-3">
                      <img 
                        src={formData.photo ? (formData.photo.startsWith('blob:') ? formData.photo : `http://localhost:5000${formData.photo}`) : "/admin/images/faces/face1.jpg"} 
                        alt="Photo" 
                        style={{ 
                          width: "200px", 
                          height: "200px", 
                          objectFit: "cover", 
                          borderRadius: "50%",
                          border: "5px solid #e0e0e0"
                        }} 
                      />
                    </div>
                    <input
                      type="file"
                      id="photoUpload"
                      className="d-none"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhotoFile(file);
                          setFormData({...formData, photo: URL.createObjectURL(file)});
                        }
                      }}
                    />
                    <label htmlFor="photoUpload" className="btn btn-primary btn-sm">
                      <i className="mdi mdi-camera"></i> Changer la photo
                    </label>
                  </div>
                  <div className="col-md-8">
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label>Nom</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Rôle</label>
                        <select
                          className="form-control"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                          <option value="client">Client</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary me-2">Enregistrer</button>
                      <button type="button" onClick={() => router.push("/admin/users")} className="btn btn-light">Annuler</button>
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
