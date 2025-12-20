"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
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
      setError("Erreur de connexion");
    }
  };

  return (
    <div style={{ marginTop: "150px" }}>
      <div style={{ minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", padding: "100px 20px 60px 20px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "60px", maxWidth: "900px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "80px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "300px", textAlign: "center" }}>
            <img src="/img/login-illustration.png" alt="Login" style={{ maxWidth: "100%", width: "300px" }} />
          </div>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "40px", color: "#333" }}>Connexion</h2>
            {error && <div style={{ padding: "10px", backgroundColor: "#fee", color: "#c33", borderRadius: "5px", marginBottom: "20px" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }}>👤</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: "100%", padding: "15px 15px 15px 45px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box" }}
                    required
                  />
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }}>🔒</span>
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{ width: "100%", padding: "15px 15px 15px 45px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box" }}
                    required
                  />
                </div>
              </div>
              <div style={{ marginBottom: "30px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#666" }}>
                  <input type="checkbox" />
                  <span>Se souvenir de moi</span>
                </label>
              </div>
              <button
                type="submit"
                style={{ width: "100%", padding: "15px", backgroundColor: "#5dade2", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "600", cursor: "pointer", marginBottom: "20px" }}
              >
                Se connecter
              </button>
              <div style={{ textAlign: "center" }}>
                <span style={{ color: "#666" }}>Pas encore de compte ? </span>
                <Link href="/register" style={{ color: "#5dade2", textDecoration: "none", fontWeight: "600" }}>S'inscrire</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
