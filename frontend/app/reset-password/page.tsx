"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Token de récupération manquant");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Mot de passe réinitialisé avec succès");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Erreur lors de la réinitialisation");
    }
  };

  return (
    <div style={{ marginTop: "150px" }}>
      <div style={{ minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa", padding: "100px 20px 60px 20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "60px", maxWidth: "500px", width: "100%", border: "1px solid #e2e8f0" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "16px", color: "#333", textAlign: "center" }}>Nouveau mot de passe</h2>
          <p style={{ color: "#666", textAlign: "center", marginBottom: "32px" }}>Entrez votre nouveau mot de passe</p>
          
          {error && <div style={{ padding: "12px", backgroundColor: "#fee", color: "#c33", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>{error}</div>}
          {message && <div style={{ padding: "12px", backgroundColor: "#f0f9ff", color: "#0369a1", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>{message}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#374151", fontSize: "14px", fontWeight: "500" }}>Nouveau mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "16px", border: "2px solid #81C784", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
                required
              />
            </div>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#374151", fontSize: "14px", fontWeight: "500" }}>Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: "100%", padding: "16px", border: "2px solid #81C784", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box", outline: "none" }}
                required
              />
            </div>
            
            <button
              type="submit"
              style={{ width: "100%", padding: "16px", backgroundColor: "#81C784", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginBottom: "24px" }}
            >
              Réinitialiser le mot de passe
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