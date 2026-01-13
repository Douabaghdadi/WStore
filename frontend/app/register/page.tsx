"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push(data.user.role === 'admin' ? '/admin' : '/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur d'inscription");
    }
  };

  return (
    <>
      <Header />
      <div style={{ 
        minHeight: "100vh", 
        marginTop: "180px",
        background: "#f8f9fa",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "40px 20px"
      }}>
        {/* Carte englobant logo + formulaire */}
        <div style={{ 
          display: "flex",
          alignItems: "center",
          gap: "60px",
          maxWidth: "800px",
          width: "100%",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          padding: "50px"
        }}>
          {/* Logo à gauche */}
          <div style={{ 
            flex: "0 0 280px", 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center"
          }}>
            <img 
              src="/img/logo.png" 
              alt="W.Store Logo" 
              style={{ width: "100%", maxWidth: "280px", height: "auto" }}
            />
          </div>

          {/* Formulaire à droite */}
          <div style={{ 
            flex: "1",
            maxWidth: "340px"
          }}>
            {/* Titre */}
            <h2 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              marginBottom: "25px", 
              color: "#c53030",
              textAlign: "center"
            }}>
              Inscription
            </h2>
          
            {error && (
              <div style={{ 
                padding: "10px 14px", 
                background: "#fff5f5", 
                color: "#c53030", 
                borderRadius: "8px", 
                marginBottom: "15px",
                border: "1px solid #fed7d7",
                fontSize: "13px"
              }}>{error}</div>
            )}
          
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", color: "#4a5568", fontWeight: "600", fontSize: "13px" }}>Nom complet</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ 
                    width: "100%", 
                    padding: "14px 16px", 
                    border: "2px solid #e2e8f0", 
                    borderRadius: "10px", 
                    fontSize: "14px", 
                    boxSizing: "border-box", 
                    outline: "none",
                    transition: "all 0.3s ease",
                    background: "#f8fafc"
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#1a365d"; e.target.style.background = "white"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", color: "#4a5568", fontWeight: "600", fontSize: "13px" }}>Email</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ 
                    width: "100%", 
                    padding: "14px 16px", 
                    border: "2px solid #e2e8f0", 
                    borderRadius: "10px", 
                    fontSize: "14px", 
                    boxSizing: "border-box", 
                    outline: "none",
                    transition: "all 0.3s ease",
                    background: "#f8fafc"
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#1a365d"; e.target.style.background = "white"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  required
                />
              </div>
            
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", color: "#4a5568", fontWeight: "600", fontSize: "13px" }}>Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ 
                    width: "100%", 
                    padding: "14px 16px", 
                    border: "2px solid #e2e8f0", 
                    borderRadius: "10px", 
                    fontSize: "14px", 
                    boxSizing: "border-box", 
                    outline: "none",
                    transition: "all 0.3s ease",
                    background: "#f8fafc"
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#1a365d"; e.target.style.background = "white"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px", color: "#4a5568", fontWeight: "600", fontSize: "13px" }}>Confirmer le mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  style={{ 
                    width: "100%", 
                    padding: "14px 16px", 
                    border: "2px solid #e2e8f0", 
                    borderRadius: "10px", 
                    fontSize: "14px", 
                    boxSizing: "border-box", 
                    outline: "none",
                    transition: "all 0.3s ease",
                    background: "#f8fafc"
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#1a365d"; e.target.style.background = "white"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  required
                />
              </div>
            
              <button
                type="submit"
                style={{ 
                  width: "100%", 
                  padding: "14px", 
                  background: "#c53030", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "8px", 
                  fontSize: "15px", 
                  fontWeight: "700", 
                  cursor: "pointer", 
                  marginBottom: "20px",
                  transition: "background 0.3s ease"
                }}
                onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = "#9b2c2c"}
                onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = "#c53030"}
              >
                S'inscrire
              </button>
            
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#718096", fontSize: "14px" }}>Vous avez déjà un compte ? </span>
                <Link href="/login" style={{ color: "#c53030", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}>
                  Se connecter
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
