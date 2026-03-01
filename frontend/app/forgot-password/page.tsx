"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
        if (data.resetUrl) {
          setResetUrl(data.resetUrl);
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors de l'envoi de l'email");
    }
  };

  return (
    <>
      <Header />
      <div style={{ 
        minHeight: "100vh", 
        marginTop: "150px",
        background: "#f8f9fa",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "40px 20px"
      }}>
        {/* Carte */}
        <div style={{ 
          maxWidth: "450px",
          width: "100%",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 15px 50px rgba(0,0,0,0.1)",
          padding: "50px 45px"
        }}>
          {/* Titre */}
          <h2 style={{ 
            fontSize: "26px", 
            fontWeight: "700", 
            marginBottom: "10px", 
            color: "#c53030",
            textAlign: "center"
          }}>
            Mot de passe oublié
          </h2>
          <p style={{ 
            color: "#718096", 
            fontSize: "14px", 
            marginBottom: "30px",
            textAlign: "center"
          }}>
            Entrez votre email pour recevoir un lien de récupération
          </p>
        
          {error && (
            <div style={{ 
              padding: "12px 16px", 
              background: "#fff5f5", 
              color: "#c53030", 
              borderRadius: "10px", 
              marginBottom: "20px",
              border: "1px solid #fed7d7",
              fontSize: "13px"
            }}>{error}</div>
          )}
          
          {message && (
            <div style={{ 
              padding: "12px 16px", 
              background: "#f0f9ff", 
              color: "#1a365d", 
              borderRadius: "10px", 
              marginBottom: "20px",
              border: "1px solid #bee3f8",
              fontSize: "13px"
            }}>{message}</div>
          )}
          
          {resetUrl && (
            <div style={{ 
              padding: "16px", 
              backgroundColor: "#f0fdf4", 
              border: "1px solid #38a169", 
              borderRadius: "10px", 
              marginBottom: "20px" 
            }}>
              <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#166534", fontSize: "13px" }}>Lien de récupération :</p>
              <a href={resetUrl} style={{ color: "#1a365d", textDecoration: "none", fontSize: "13px", wordBreak: "break-all" }}>{resetUrl}</a>
            </div>
          )}
        
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#4a5568", fontWeight: "600", fontSize: "13px" }}>Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                padding: "15px", 
                background: "#c53030", 
                color: "white", 
                border: "none", 
                borderRadius: "10px", 
                fontSize: "15px", 
                fontWeight: "700", 
                cursor: "pointer", 
                marginBottom: "24px",
                transition: "background 0.3s ease"
              }}
              onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = "#9b2c2c"}
              onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = "#c53030"}
            >
              Envoyer le lien de récupération
            </button>
          
            <div style={{ textAlign: "center" }}>
              <Link href="/login" style={{ color: "#1a365d", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
                ← Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
