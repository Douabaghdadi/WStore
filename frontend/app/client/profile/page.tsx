"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../lib/api";

export default function ClientProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({ name: parsedUser.name || "", email: parsedUser.email || "", phone: parsedUser.phone || "", address: parsedUser.address || "" });
      if (parsedUser.profileImage) setProfileImage(parsedUser.profileImage);
    }
    setLoading(false);
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, profileImage })
      });
      const updatedUser = { ...user, ...formData, profileImage };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setEditing(false);
    } catch { }
    setSaving(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) { alert("Les mots de passe ne correspondent pas"); return; }
    if (passwordData.newPassword.length < 6) { alert("Le mot de passe doit contenir au moins 6 caractères"); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch { alert("Erreur lors de la mise à jour"); }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div className="spinner-border" style={{ width: "3rem", height: "3rem" }}></div>
          <p style={{ marginTop: "1rem", fontWeight: 500 }}>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .profile-page { min-height: 100vh; background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%); }
        .profile-header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 3rem 0 6rem; position: relative; overflow: hidden; }
        .profile-header::before { content: ''; position: absolute; top: -50%; right: -20%; width: 60%; height: 200%; background: rgba(255,255,255,0.1); border-radius: 50%; }
        .profile-header::after { content: ''; position: absolute; bottom: -30%; left: -10%; width: 40%; height: 150%; background: rgba(255,255,255,0.05); border-radius: 50%; }
        .profile-card { background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); margin-top: -4rem; position: relative; z-index: 10; overflow: hidden; }
        .avatar-wrapper { position: relative; display: inline-block; }
        .avatar { width: 140px; height: 140px; border-radius: 50%; border: 5px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.2); object-fit: cover; background: white; }
        .avatar-placeholder { width: 140px; height: 140px; border-radius: 50%; border: 5px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.2); background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); display: flex; align-items: center; justify-content: center; }
        .avatar-edit-btn { position: absolute; bottom: 5px; right: 5px; width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border: 4px solid white; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(239,68,68,0.4); transition: transform 0.2s; }
        .avatar-edit-btn:hover { transform: scale(1.1); }
        .tab-btn { padding: 1rem 1.5rem; border: none; background: transparent; color: #64748b; font-weight: 600; cursor: pointer; position: relative; transition: all 0.3s; border-radius: 12px; margin: 0 0.25rem; }
        .tab-btn:hover { background: #f8fafc; color: #1e293b; }
        .tab-btn.active { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; box-shadow: 0 4px 15px rgba(239,68,68,0.3); }
        .form-input { width: 100%; padding: 1rem 1.25rem; border: 2px solid #e2e8f0; border-radius: 14px; font-size: 1rem; transition: all 0.3s; background: #f8fafc; }
        .form-input:focus { outline: none; border-color: #ef4444; background: white; box-shadow: 0 0 0 4px rgba(239,68,68,0.1); }
        .form-input:disabled { background: #f1f5f9; color: #64748b; }
        .form-label { display: block; font-weight: 600; color: #475569; margin-bottom: 0.5rem; font-size: 0.9rem; }
        .btn-primary { padding: 1rem 2rem; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; border-radius: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(239,68,68,0.3); display: inline-flex; align-items: center; gap: 0.5rem; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(239,68,68,0.4); }
        .btn-secondary { padding: 1rem 2rem; background: #f1f5f9; color: #64748b; border: none; border-radius: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; gap: 0.5rem; }
        .btn-secondary:hover { background: #e2e8f0; }
        .info-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 1.25rem; margin-bottom: 1rem; border: 1px solid #e2e8f0; }
        .info-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 0.25rem; }
        .info-value { font-weight: 600; color: #1e293b; font-size: 1rem; }
        .success-toast { position: fixed; top: 2rem; right: 2rem; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 1rem 1.5rem; border-radius: 14px; box-shadow: 0 10px 40px rgba(16,185,129,0.3); display: flex; align-items: center; gap: 0.75rem; z-index: 1000; animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .stat-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(239,68,68,0.1); color: #ef4444; border-radius: 50px; font-weight: 600; font-size: 0.85rem; }
      `}</style>

      {showSuccess && (
        <div className="success-toast">
          <i className="fas fa-check-circle" style={{ fontSize: "1.25rem" }}></i>
          <span>Modifications enregistrées avec succès!</span>
        </div>
      )}

      <div className="profile-page">
        <div className="profile-header">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center" style={{ position: "relative", zIndex: 10 }}>
              <div>
                <h1 style={{ color: "white", fontWeight: 700, fontSize: "2rem", marginBottom: "0.5rem" }}>Mon Profil</h1>
                <p style={{ color: "rgba(255,255,255,0.8)", margin: 0 }}>Gérez vos informations personnelles</p>
              </div>
              <Link href="/client" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "12px", textDecoration: "none", fontWeight: 600, backdropFilter: "blur(10px)" }}>
                <i className="fas fa-arrow-left"></i> Retour
              </Link>
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingBottom: "3rem" }}>
          <div className="profile-card">
            <div className="row g-0">
              {/* Sidebar */}
              <div className="col-lg-4" style={{ borderRight: "1px solid #e2e8f0", background: "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)" }}>
                <div style={{ padding: "2.5rem", textAlign: "center" }}>
                  <div className="avatar-wrapper">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="avatar" />
                    ) : (
                      <div className="avatar-placeholder">
                        <i className="fas fa-user" style={{ fontSize: "3.5rem", color: "#cbd5e1" }}></i>
                      </div>
                    )}
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="avatar-edit-btn">
                      <i className="fas fa-camera"></i>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                  </div>
                  
                  <h3 style={{ marginTop: "1.5rem", marginBottom: "0.25rem", color: "#1e293b", fontWeight: 700 }}>{user?.name}</h3>
                  <p style={{ color: "#64748b", marginBottom: "1rem" }}>{user?.email}</p>
                  
                  <div className="stat-badge">
                    <i className="fas fa-crown"></i>
                    {user?.role === "admin" ? "Administrateur" : "Client"}
                  </div>

                  <div style={{ marginTop: "2rem", textAlign: "left" }}>
                    <div className="info-card">
                      <div className="info-label">Membre depuis</div>
                      <div className="info-value">
                        <i className="fas fa-calendar-alt me-2" style={{ color: "#ef4444" }}></i>
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}
                      </div>
                    </div>
                    {user?.phone && (
                      <div className="info-card">
                        <div className="info-label">Téléphone</div>
                        <div className="info-value">
                          <i className="fas fa-phone me-2" style={{ color: "#ef4444" }}></i>
                          {user.phone}
                        </div>
                      </div>
                    )}
                    {user?.address && (
                      <div className="info-card">
                        <div className="info-label">Adresse</div>
                        <div className="info-value">
                          <i className="fas fa-map-marker-alt me-2" style={{ color: "#ef4444" }}></i>
                          {user.address}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="col-lg-8">
                <div style={{ padding: "2rem" }}>
                  {/* Tabs */}
                  <div style={{ marginBottom: "2rem", display: "flex", background: "#f8fafc", padding: "0.5rem", borderRadius: "16px" }}>
                    <button className={`tab-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
                      <i className="fas fa-user me-2"></i> Informations
                    </button>
                    {(!user?.provider || user?.provider === 'local') && (
                      <button className={`tab-btn ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}>
                        <i className="fas fa-shield-alt me-2"></i> Sécurité
                      </button>
                    )}
                  </div>

                  {/* Info Tab */}
                  {activeTab === "info" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <div>
                          <h4 style={{ margin: 0, color: "#1e293b", fontWeight: 700 }}>Informations personnelles</h4>
                          <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Mettez à jour vos informations de profil</p>
                        </div>
                        {!editing && (
                          <button onClick={() => setEditing(true)} className="btn-primary">
                            <i className="fas fa-edit"></i> Modifier
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                          <div className="col-md-6">
                            <label className="form-label"><i className="fas fa-user me-2" style={{ color: "#ef4444" }}></i>Nom complet</label>
                            <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} disabled={!editing} placeholder="Votre nom" />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label"><i className="fas fa-envelope me-2" style={{ color: "#ef4444" }}></i>Email</label>
                            <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={!editing} placeholder="votre@email.com" />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label"><i className="fas fa-phone me-2" style={{ color: "#ef4444" }}></i>Téléphone</label>
                            <input type="tel" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} disabled={!editing} placeholder="+216 XX XXX XXX" />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label"><i className="fas fa-map-marker-alt me-2" style={{ color: "#ef4444" }}></i>Adresse</label>
                            <input type="text" className="form-input" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} disabled={!editing} placeholder="Votre adresse" />
                          </div>
                        </div>

                        {editing && (
                          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                            <button type="submit" className="btn-primary" disabled={saving}>
                              {saving ? <><span className="spinner-border spinner-border-sm"></span> Enregistrement...</> : <><i className="fas fa-check"></i> Enregistrer</>}
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
                              <i className="fas fa-times"></i> Annuler
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div>
                      <div style={{ marginBottom: "1.5rem" }}>
                        <h4 style={{ margin: 0, color: "#1e293b", fontWeight: 700 }}>Sécurité du compte</h4>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Modifiez votre mot de passe pour sécuriser votre compte</p>
                      </div>

                      <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", borderRadius: "16px", padding: "1.25rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem", border: "1px solid #fcd34d" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <i className="fas fa-exclamation-triangle" style={{ color: "white", fontSize: "1.25rem" }}></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#92400e" }}>Conseil de sécurité</div>
                          <div style={{ color: "#a16207", fontSize: "0.9rem" }}>Utilisez un mot de passe fort avec au moins 8 caractères, incluant des lettres, chiffres et symboles.</div>
                        </div>
                      </div>

                      <form onSubmit={handlePasswordSubmit}>
                        <div className="row g-4">
                          <div className="col-12">
                            <label className="form-label"><i className="fas fa-lock me-2" style={{ color: "#ef4444" }}></i>Mot de passe actuel</label>
                            <input type="password" className="form-input" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} placeholder="Entrez votre mot de passe actuel" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label"><i className="fas fa-key me-2" style={{ color: "#ef4444" }}></i>Nouveau mot de passe</label>
                            <input type="password" className="form-input" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} placeholder="Minimum 6 caractères" required />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label"><i className="fas fa-check-double me-2" style={{ color: "#ef4444" }}></i>Confirmer le mot de passe</label>
                            <input type="password" className="form-input" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} placeholder="Confirmez le nouveau mot de passe" required />
                          </div>
                        </div>

                        <div style={{ marginTop: "2rem" }}>
                          <button type="submit" className="btn-primary" disabled={saving}>
                            {saving ? <><span className="spinner-border spinner-border-sm"></span> Mise à jour...</> : <><i className="fas fa-shield-alt"></i> Mettre à jour le mot de passe</>}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
