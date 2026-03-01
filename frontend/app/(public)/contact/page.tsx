"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


export default function ContactPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert('Erreur lors de l\'envoi du message');
      }
    } catch {
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: isMobile ? "80px" : "130px", backgroundColor: "#f7fafc", minHeight: "100vh", paddingBottom: isMobile ? "40px" : "80px" }}>
      {/* Hero Section */}
      <div style={{ 
        background: "linear-gradient(135deg, #0d1b2a 0%, #1a365d 100%)", 
        padding: isMobile ? "40px 20px" : "80px 0", 
        marginBottom: isMobile ? "30px" : "50px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: isMobile ? "100px" : "200px",
          height: isMobile ? "100px" : "200px",
          background: "radial-gradient(circle, rgba(197, 48, 48, 0.2) 0%, transparent 70%)",
          borderRadius: "50%"
        }}></div>
        <div className="container text-center" style={{ position: "relative", zIndex: 1, padding: isMobile ? "0 15px" : "0" }}>
          <span style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)",
            padding: isMobile ? "6px 16px" : "8px 20px",
            borderRadius: "30px",
            marginBottom: isMobile ? "15px" : "20px"
          }}>
            <span style={{ color: "white", fontSize: isMobile ? "11px" : "13px", fontWeight: "700", letterSpacing: isMobile ? "1.5px" : "2px", textTransform: "uppercase" }}>
              Support Client
            </span>
          </span>
          <h1 style={{ fontSize: isMobile ? "28px" : "42px", fontWeight: "800", color: "white", marginBottom: isMobile ? "10px" : "15px", lineHeight: "1.2" }}>
            Contactez-nous
          </h1>
          <p style={{ fontSize: isMobile ? "15px" : "18px", color: "rgba(255,255,255,0.8)", maxWidth: "600px", margin: "0 auto", lineHeight: "1.5" }}>
            Une question sur nos produits ? Notre équipe d&apos;experts est là pour vous aider.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: isMobile ? "0 15px" : "0" }}>
        <div className="row" style={{ gap: isMobile ? "25px" : "0", margin: isMobile ? "0" : "0 -12px" }}>
          {/* Informations de contact */}
          <div className={isMobile ? "" : "col-lg-4"} style={{ width: isMobile ? "100%" : "auto", padding: isMobile ? "0" : "0 12px" }}>
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: isMobile ? "16px" : "20px", 
              padding: isMobile ? "25px 20px" : "40px", 
              boxShadow: "0 5px 25px rgba(0,0,0,0.05)", 
              height: "100%",
              border: "1px solid #e2e8f0"
            }}>
              <h3 style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: "700", color: "#1a202c", marginBottom: isMobile ? "25px" : "30px" }}>
                Nos Coordonnées
              </h3>

              {/* Adresse */}
              <div style={{ display: "flex", gap: isMobile ? "15px" : "20px", marginBottom: isMobile ? "25px" : "30px", alignItems: "flex-start" }}>
                <div style={{ 
                  width: isMobile ? "45px" : "50px", 
                  height: isMobile ? "45px" : "50px", 
                  minWidth: isMobile ? "45px" : "50px",
                  borderRadius: "12px", 
                  background: "linear-gradient(135deg, rgba(26, 54, 93, 0.1) 0%, rgba(26, 54, 93, 0.05) 100%)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0 
                }}>
                  <i className="fas fa-map-marker-alt" style={{ fontSize: isMobile ? "18px" : "20px", color: "#1a365d" }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: "600", color: "#1a202c", marginBottom: "5px" }}>Adresses</h5>
                  <p style={{ fontSize: isMobile ? "13px" : "14px", color: "#718096", margin: 0, lineHeight: "1.6", wordBreak: "break-word" }}>
                    Cité Commerciale, Korba<br />
                    Rue Taher Sfar, Dar Chaâbene El Fehri
                  </p>
                </div>
              </div>

              {/* Téléphone */}
              <div style={{ display: "flex", gap: isMobile ? "15px" : "20px", marginBottom: isMobile ? "25px" : "30px", alignItems: "flex-start" }}>
                <div style={{ 
                  width: isMobile ? "45px" : "50px", 
                  height: isMobile ? "45px" : "50px", 
                  minWidth: isMobile ? "45px" : "50px",
                  borderRadius: "12px", 
                  background: "linear-gradient(135deg, rgba(197, 48, 48, 0.1) 0%, rgba(197, 48, 48, 0.05) 100%)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0 
                }}>
                  <i className="fas fa-phone-alt" style={{ fontSize: isMobile ? "18px" : "20px", color: "#c53030" }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: "600", color: "#1a202c", marginBottom: "5px" }}>Téléphones</h5>
                  <p style={{ fontSize: isMobile ? "13px" : "14px", color: "#718096", margin: 0, lineHeight: "1.6" }}>
                    <a href="tel:+21652255145" style={{ color: "#718096", textDecoration: "none" }}>(+216) 52 255 145</a><br />
                    <a href="tel:+21648018250" style={{ color: "#718096", textDecoration: "none" }}>(+216) 48 018 250</a>
                  </p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: "flex", gap: isMobile ? "15px" : "20px", marginBottom: isMobile ? "25px" : "30px", alignItems: "flex-start" }}>
                <div style={{ 
                  width: isMobile ? "45px" : "50px", 
                  height: isMobile ? "45px" : "50px", 
                  minWidth: isMobile ? "45px" : "50px",
                  borderRadius: "12px", 
                  background: "linear-gradient(135deg, rgba(26, 54, 93, 0.1) 0%, rgba(26, 54, 93, 0.05) 100%)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0 
                }}>
                  <i className="fas fa-envelope" style={{ fontSize: isMobile ? "18px" : "20px", color: "#1a365d" }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: "600", color: "#1a202c", marginBottom: "5px" }}>Email</h5>
                  <p style={{ fontSize: isMobile ? "13px" : "14px", color: "#718096", margin: 0, wordBreak: "break-word" }}>
                    <a href="mailto:wstore887@gmail.com" style={{ color: "#718096", textDecoration: "none" }}>wstore887@gmail.com</a>
                  </p>
                </div>
              </div>

              {/* Horaires */}
              <div style={{ display: "flex", gap: isMobile ? "15px" : "20px", alignItems: "flex-start" }}>
                <div style={{ 
                  width: isMobile ? "45px" : "50px", 
                  height: isMobile ? "45px" : "50px", 
                  minWidth: isMobile ? "45px" : "50px",
                  borderRadius: "12px", 
                  background: "linear-gradient(135deg, rgba(197, 48, 48, 0.1) 0%, rgba(197, 48, 48, 0.05) 100%)", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0 
                }}>
                  <i className="fas fa-clock" style={{ fontSize: isMobile ? "18px" : "20px", color: "#c53030" }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: "600", color: "#1a202c", marginBottom: "5px" }}>Horaires</h5>
                  <p style={{ fontSize: isMobile ? "13px" : "14px", color: "#718096", margin: 0, lineHeight: "1.6" }}>
                    Lun - Dim: 9h00 - 22h00
                  </p>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div style={{ marginTop: isMobile ? "30px" : "40px", paddingTop: isMobile ? "25px" : "30px", borderTop: "1px solid #e2e8f0" }}>
                <h5 style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: "600", color: "#1a202c", marginBottom: "15px" }}>Suivez-nous</h5>
                <div style={{ display: "flex", gap: "12px" }}>
                  {[
                    { icon: 'facebook-f', url: 'https://www.facebook.com/profile.php?id=100090708515530' },
                    { icon: 'instagram', url: 'https://www.instagram.com/w.store_tn/' },
                    { icon: 'whatsapp', url: 'https://wa.me/21652255145' }
                  ].map((social) => (
                    <a 
                      key={social.icon}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        width: isMobile ? "40px" : "44px", 
                        height: isMobile ? "40px" : "44px", 
                        borderRadius: "12px", 
                        background: "linear-gradient(135deg, #1a365d 0%, #0d1b2a 100%)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        color: "white", 
                        transition: "all 0.3s",
                        textDecoration: "none"
                      }}
                    >
                      <i className={`fab fa-${social.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className={isMobile ? "" : "col-lg-8"} style={{ width: isMobile ? "100%" : "auto", padding: isMobile ? "0" : "0 12px" }}>
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: isMobile ? "16px" : "20px", 
              padding: isMobile ? "25px 20px" : "40px", 
              boxShadow: "0 5px 25px rgba(0,0,0,0.05)",
              border: "1px solid #e2e8f0"
            }}>
              <h3 style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: "700", color: "#1a202c", marginBottom: isMobile ? "20px" : "30px" }}>
                Envoyez-nous un message
              </h3>

              {success && (
                <div style={{ 
                  background: "linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(72, 187, 120, 0.05) 100%)", 
                  color: "#276749", 
                  padding: isMobile ? "12px 15px" : "15px 20px", 
                  borderRadius: "12px", 
                  marginBottom: isMobile ? "20px" : "25px", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "10px",
                  border: "1px solid rgba(72, 187, 120, 0.2)",
                  fontSize: isMobile ? "13px" : "14px"
                }}>
                  <i className="fas fa-check-circle"></i>
                  Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row" style={{ gap: isMobile ? "20px" : "0", margin: isMobile ? "0" : "0 -12px" }}>
                  <div className={isMobile ? "" : "col-md-6"} style={{ width: isMobile ? "100%" : "auto", padding: isMobile ? "0" : "0 12px", marginBottom: isMobile ? "0" : "16px" }}>
                    <label style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "600", color: "#4a5568", marginBottom: "8px", display: "block" }}>
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: isMobile ? "12px 16px" : "14px 18px", 
                        border: "2px solid #e2e8f0", 
                        borderRadius: "12px", 
                        fontSize: isMobile ? "14px" : "15px", 
                        outline: "none", 
                        transition: "border-color 0.3s", 
                        boxSizing: "border-box" 
                      }}
                      placeholder="Votre nom"
                      onFocus={(e) => e.target.style.borderColor = "#1a365d"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>
                  <div className={isMobile ? "" : "col-md-6"} style={{ width: isMobile ? "100%" : "auto", padding: isMobile ? "0" : "0 12px", marginBottom: isMobile ? "0" : "16px" }}>
                    <label style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "600", color: "#4a5568", marginBottom: "8px", display: "block" }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: isMobile ? "12px 16px" : "14px 18px", 
                        border: "2px solid #e2e8f0", 
                        borderRadius: "12px", 
                        fontSize: isMobile ? "14px" : "15px", 
                        outline: "none", 
                        transition: "border-color 0.3s", 
                        boxSizing: "border-box" 
                      }}
                      placeholder="votre@email.com"
                      onFocus={(e) => e.target.style.borderColor = "#1a365d"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    />
                  </div>
                  <div className={isMobile ? "" : "col-12"} style={{ width: "100%", padding: isMobile ? "0" : "0 12px", marginBottom: isMobile ? "0" : "16px" }}>
                    <label style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "600", color: "#4a5568", marginBottom: "8px", display: "block" }}>
                      Sujet *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: isMobile ? "12px 16px" : "14px 18px", 
                        border: "2px solid #e2e8f0", 
                        borderRadius: "12px", 
                        fontSize: isMobile ? "14px" : "15px", 
                        outline: "none", 
                        transition: "border-color 0.3s", 
                        boxSizing: "border-box",
                        backgroundColor: "white"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#1a365d"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="info">Information produit</option>
                      <option value="order">Suivi de commande</option>
                      <option value="return">Retour / Échange</option>
                      <option value="warranty">Garantie</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div className={isMobile ? "" : "col-12"} style={{ width: "100%", padding: isMobile ? "0" : "0 12px", marginBottom: isMobile ? "0" : "16px" }}>
                    <label style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "600", color: "#4a5568", marginBottom: "8px", display: "block" }}>
                      Message *
                    </label>
                    <textarea
                      required
                      rows={isMobile ? 5 : 6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ 
                        width: "100%", 
                        padding: isMobile ? "12px 16px" : "14px 18px", 
                        border: "2px solid #e2e8f0", 
                        borderRadius: "12px", 
                        fontSize: isMobile ? "14px" : "15px", 
                        outline: "none", 
                        transition: "border-color 0.3s", 
                        resize: "vertical", 
                        boxSizing: "border-box" 
                      }}
                      placeholder="Décrivez votre demande en détail..."
                      onFocus={(e) => e.target.style.borderColor = "#1a365d"}
                      onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                    ></textarea>
                  </div>
                  <div className={isMobile ? "" : "col-12"} style={{ width: "100%", padding: isMobile ? "0" : "0 12px" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: isMobile ? "100%" : "auto",
                        padding: isMobile ? "14px 30px" : "16px 40px",
                        background: loading ? "#cbd5e0" : "linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: isMobile ? "15px" : "16px",
                        fontWeight: "700",
                        cursor: loading ? "not-allowed" : "pointer",
                        transition: "all 0.3s",
                        boxShadow: loading ? "none" : "0 10px 30px rgba(197, 48, 48, 0.3)"
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
