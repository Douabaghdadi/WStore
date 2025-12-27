"use client";
import { useState } from "react";
import Link from "next/link";

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
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
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
    <div style={{ marginTop: "150px" }}>
      <div style={{ minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa", padding: "100px 20px 60px 20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "60px", maxWidth: "500px", width: "100%", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px", color: "#333", textAlign: "center" }}>Mot de passe oublié</h2>
          <p style={{ color: "#666", textAlign: "center", marginBottom: "32px" }}>Entrez votre email pour recevoir un lien de récupération</p>
          
          {error && <div style={{ padding: "12px", backgroundColor: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>{error}</div>}
          {message && <div style={{ padding: "12px", backgroundColor: "#f0f9ff", color: "#0369a1", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>{message}</div>}
          {resetUrl && (
            <div style={{ padding: "16px", backgroundColor: "#f0fdf4", border: "1px solid #81C784", borderRadius: "8px", marginBottom: "20px" }}>
              <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#166534" }}>Lien de récupération :</p>
              <a href={resetUrl} style={{ color: "#81C784", textDecoration: "none", fontSize: "14px", wordBreak: "break-all" }}>{resetUrl}</a>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#374151", fontSize: "14px", fontWeight: "500" }}>Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: "16px", border: "2px solid #81C784", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
                required
              />
            </div>
            
            <button
              type="submit"
              style={{ width: "100%", padding: "16px", backgroundColor: "#81C784", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginBottom: "24px" }}
            >
              Envoyer le lien de récupération
            </button>
            
            <div style={{ textAlign: "center" }}>
              <Link href="/login" style={{ color: "#81C784", textDecoration: "none", fontSize: "14px" }}>← Retour à la connexion</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}