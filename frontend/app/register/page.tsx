"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../components/Header";
import dynamic from "next/dynamic";

const FacebookLogin = dynamic(() => import("../components/FacebookLogin"), {
  ssr: false,
  loading: () => (
    <button
      disabled
      style={{
        width: "100%",
        padding: "15px",
        backgroundColor: "#ccc",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "not-allowed",
        marginBottom: "15px"
      }}
    >
      Chargement...
    </button>
  )
});

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Vérifier si on revient de Facebook avec un code
    const code = searchParams.get('code');
    if (code) {
      handleFacebookCallback(code);
    }
  }, [searchParams]);

  const handleFacebookCallback = async (code: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
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
      setError("Erreur de connexion Facebook");
    }
  };

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
      <div style={{ marginTop: "250px" }}>
      <div style={{ minHeight: "calc(100vh - 200px)", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", padding: "100px 20px 60px 20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.1)", padding: "60px", maxWidth: "900px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "80px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "300px", textAlign: "center" }}>
              <img src="/img/login-illustration.png" alt="Register" style={{ maxWidth: "100%", width: "300px" }} />
            </div>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "40px", color: "#333" }}>Inscription</h2>
              {error && <div style={{ padding: "10px", backgroundColor: "#fee", color: "#c33", borderRadius: "5px", marginBottom: "20px" }}>{error}</div>}
              
              <FacebookLogin 
                onSuccess={() => {}}
                onError={() => {}}
              />
              
              <div style={{ textAlign: "center", margin: "20px 0", color: "#666" }}>ou</div>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }}>👤</span>
                    <input
                      type="text"
                      placeholder="Nom complet"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ width: "100%", padding: "15px 15px 15px 45px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box" }}
                      required
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }}>📧</span>
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
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }}>🔒</span>
                    <input
                      type="password"
                      placeholder="Confirmer le mot de passe"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      style={{ width: "100%", padding: "15px 15px 15px 45px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "16px", boxSizing: "border-box" }}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  style={{ width: "100%", padding: "15px", backgroundColor: "#5dade2", color: "white", border: "none", borderRadius: "8px", fontSize: "18px", fontWeight: "600", cursor: "pointer", marginBottom: "20px" }}
                >
                  S'inscrire
                </button>
                <div style={{ textAlign: "center" }}>
                  <span style={{ color: "#666" }}>Vous avez déjà un compte ? </span>
                  <Link href="/login" style={{ color: "#5dade2", textDecoration: "none", fontWeight: "600" }}>Se connecter</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
