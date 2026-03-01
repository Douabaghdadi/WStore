"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


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

function LoginContent() {
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
      const res = await fetch(`${API_URL}/api/auth/facebook`, {
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
      const res = await fetch(`${API_URL}/api/auth/google`, {
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
      const res = await fetch(`${API_URL}/api/auth/login`, {
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
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .login-container {
          animation: fadeIn 0.6s ease-out;
        }
        
        .login-card {
          animation: slideIn 0.8s ease-out;
        }
        
        @media (max-width: 991px) {
          .login-container {
            margin-top: 80px !important;
            padding: 20px 15px !important;
            min-height: calc(100vh - 80px) !important;
          }
          .login-card {
            padding: 40px 25px !important;
            border-radius: 20px !important;
          }
          .form-section {
            max-width: 100% !important;
            width: 100% !important;
          }
          .login-title {
            font-size: 26px !important;
            margin-bottom: 20px !important;
          }
          .remember-forgot {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: flex-start !important;
          }
          .social-buttons {
            flex-direction: column !important;
          }
        }
        
        @media (max-width: 576px) {
          .login-container {
            margin-top: 70px !important;
            padding: 15px 10px !important;
          }
          .login-card {
            padding: 30px 20px !important;
          }
          .login-title {
            font-size: 24px !important;
          }
        }
      `}</style>
      <div className="login-container" style={{ 
        minHeight: "100vh", 
        marginTop: "80px",
        background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 50%, #e2e8f0 100%)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Éléments décoratifs de fond */}
        <div style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(197, 48, 48, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}></div>
        <div style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(26, 54, 93, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}></div>
        
        {/* Carte principale */}
        <div className="login-card" style={{ 
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "480px",
          width: "100%",
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.05)",
          padding: "50px 40px",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Bande décorative */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #c53030 0%, #1a365d 100%)"
          }}></div>

          {/* Section Formulaire */}
          <div className="form-section" style={{ 
            width: "100%",
            maxWidth: "400px"
          }}>
            {/* Titre avec icône */}
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
              <div style={{
                width: "50px",
                height: "50px",
                background: "linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 15px",
                boxShadow: "0 8px 20px rgba(197, 48, 48, 0.3)"
              }}>
                <i className="fas fa-user" style={{ color: "white", fontSize: "20px" }}></i>
              </div>
              <h2 className="login-title" style={{ 
                fontSize: "32px", 
                fontWeight: "800", 
                marginBottom: "8px", 
                background: "linear-gradient(135deg, #c53030 0%, #1a365d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                Connexion
              </h2>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
                Connectez-vous pour continuer
              </p>
            </div>
          
            {error && (
              <div style={{ 
                padding: "12px 16px", 
                background: "linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)", 
                color: "#c53030", 
                borderRadius: "12px", 
                marginBottom: "20px",
                border: "1px solid #fca5a5",
                fontSize: "13px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 2px 8px rgba(197, 48, 48, 0.1)"
              }}>
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}
          
            {/* Boutons sociaux */}
            <div className="social-buttons" style={{ display: "flex", gap: "12px", marginBottom: "25px" }}>
              <div style={{ flex: 1 }}>
                <FacebookLogin onSuccess={() => {}} onError={() => {}} />
              </div>
              <div style={{ flex: 1 }}>
                <GoogleLogin onSuccess={() => {}} onError={() => {}} />
              </div>
            </div>
          
            {/* Séparateur élégant */}
            <div style={{ 
              textAlign: "center", 
              margin: "25px 0", 
              position: "relative"
            }}>
              <span style={{ 
                background: "white", 
                padding: "0 20px", 
                position: "relative", 
                zIndex: 1, 
                fontSize: "13px",
                color: "#94a3b8",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>ou</span>
              <div style={{ 
                position: "absolute", 
                top: "50%", 
                left: 0, 
                right: 0, 
                height: "2px", 
                background: "linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)" 
              }}></div>
            </div>
          
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#334155", 
                  fontWeight: "700", 
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  <i className="fas fa-envelope" style={{ marginRight: "8px", color: "#64748b" }}></i>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ 
                    width: "100%", 
                    padding: "14px 18px", 
                    border: "2px solid #e2e8f0", 
                    borderRadius: "12px", 
                    fontSize: "14px", 
                    boxSizing: "border-box", 
                    outline: "none",
                    transition: "all 0.3s ease",
                    background: "#f8fafc",
                    fontWeight: "500"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a365d";
                    e.target.style.background = "white";
                    e.target.style.boxShadow = "0 0 0 4px rgba(26, 54, 93, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>
            
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#334155", 
                  fontWeight: "700", 
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  <i className="fas fa-lock" style={{ marginRight: "8px", color: "#64748b" }}></i>
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{ 
                    width: "100%", 
                    padding: "14px 18px", 
                    border: "2px solid #e2e8f0", 
                    borderRadius: "12px", 
                    fontSize: "14px", 
                    boxSizing: "border-box", 
                    outline: "none",
                    transition: "all 0.3s ease",
                    background: "#f8fafc",
                    fontWeight: "500"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#1a365d";
                    e.target.style.background = "white";
                    e.target.style.boxShadow = "0 0 0 4px rgba(26, 54, 93, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "#f8fafc";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>
            
              <div className="remember-forgot" style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginBottom: "25px" 
              }}>
                <label style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px", 
                  cursor: "pointer", 
                  color: "#64748b", 
                  fontSize: "13px",
                  fontWeight: "600"
                }}>
                  <input 
                    type="checkbox" 
                    style={{ 
                      width: "18px", 
                      height: "18px", 
                      accentColor: "#1a365d",
                      cursor: "pointer"
                    }} 
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <Link 
                  href="/forgot-password" 
                  style={{ 
                    color: "#c53030", 
                    textDecoration: "none", 
                    fontSize: "13px", 
                    fontWeight: "700",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#9b2c2c";
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#c53030";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            
              <button
                type="submit"
                style={{ 
                  width: "100%", 
                  padding: "16px", 
                  background: "linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)", 
                  color: "white", 
                  border: "none", 
                  borderRadius: "12px", 
                  fontSize: "16px", 
                  fontWeight: "700", 
                  cursor: "pointer", 
                  marginBottom: "25px",
                  transition: "all 0.3s ease",
                  boxShadow: "0 8px 20px rgba(197, 48, 48, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                  (e.target as HTMLButtonElement).style.boxShadow = "0 12px 28px rgba(197, 48, 48, 0.4)";
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.target as HTMLButtonElement).style.boxShadow = "0 8px 20px rgba(197, 48, 48, 0.3)";
                }}
              >
                <i className="fas fa-sign-in-alt"></i>
                Se connecter
              </button>
            
              <div style={{ 
                textAlign: "center",
                padding: "20px",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <span style={{ color: "#64748b", fontSize: "14px", fontWeight: "500" }}>
                  Pas encore de compte ?
                </span>
                {" "}
                <Link 
                  href="/register" 
                  style={{ 
                    color: "#c53030", 
                    textDecoration: "none", 
                    fontWeight: "800", 
                    fontSize: "14px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "#9b2c2c";
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "#c53030";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  S'inscrire maintenant →
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ marginTop: '160px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border" style={{ color: '#c53030' }} role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
