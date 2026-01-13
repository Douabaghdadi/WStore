"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const FacebookLogin = dynamic(() => import("../components/FacebookLogin"), {
  ssr: false,
  loading: () => (
    <button disabled style={{ width: "100%", padding: "15px", backgroundColor: "#e2e8f0", color: "#718096", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "not-allowed", marginBottom: "15px" }}>Chargement...</button>
  )
});

const GoogleLogin = dynamic(() => import("../components/GoogleLogin"), {
  ssr: false,
  loading: () => (
    <button disabled style={{ width: "100%", padding: "15px", backgroundColor: "#e2e8f0", color: "#718096", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "not-allowed", marginBottom: "15px" }}>Chargement...</button>
  )
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      const state = searchParams.get('state');
      if (state === 'google') {
        handleGoogleCallback(code);
      } else {
        handleFacebookCallback(code);
      }
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

  const handleGoogleCallback = async (code: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
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
      setError("Erreur de connexion Google");
    }
  };

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
            Connexion
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
        
          {/* Boutons sociaux */}
          <FacebookLogin onSuccess={() => {}} onError={() => {}} />
          <GoogleLogin onSuccess={() => {}} onError={() => {}} />
        
          {/* Séparateur */}
          <div style={{ 
            textAlign: "center", 
            margin: "20px 0", 
            color: "#a0aec0",
            position: "relative"
          }}>
            <span style={{ background: "#f8f9fa", padding: "0 15px", position: "relative", zIndex: 1, fontSize: "13px" }}>ou</span>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "#e2e8f0" }}></div>
          </div>
        
          <form onSubmit={handleSubmit}>
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
                  border: "1.5px solid #e2e8f0", 
                  borderRadius: "8px", 
                  fontSize: "14px", 
                  boxSizing: "border-box", 
                  outline: "none",
                  transition: "all 0.3s ease",
                  background: "white"
                }}
                onFocus={(e) => e.target.style.borderColor = "#1a365d"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
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
                  border: "1.5px solid #e2e8f0", 
                  borderRadius: "8px", 
                  fontSize: "14px", 
                  boxSizing: "border-box", 
                  outline: "none",
                  transition: "all 0.3s ease",
                  background: "white"
                }}
                onFocus={(e) => e.target.style.borderColor = "#1a365d"}
                onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                required
              />
            </div>
          
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#718096", fontSize: "13px" }}>
                <input type="checkbox" style={{ width: "16px", height: "16px", accentColor: "#1a365d" }} />
                <span>Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" style={{ color: "#c53030", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
                Mot de passe oublié ?
              </Link>
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
              Se connecter
            </button>
          
            <div style={{ textAlign: "center" }}>
              <span style={{ color: "#718096", fontSize: "14px" }}>Pas encore de compte ? </span>
              <Link href="/register" style={{ color: "#c53030", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}>
                S'inscrire
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
