'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


export default function Footer() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Erreur chargement catégories:', err));
  }, []);

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0d1b2a 0%, #1a365d 100%)',
      color: 'white',
      paddingTop: '60px',
      paddingBottom: '20px'
    }}>
      <div className="container">
        {/* Logo et Description - Centré sur mobile */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '0 15px'
        }}>
          <div className="mb-4">
            <Image 
              src="/img/logo.png" 
              alt="W.Store - Informatique, Smartphone & Accessoires" 
              width={180}
              height={55}
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            lineHeight: '1.7',
            marginBottom: '25px',
            fontSize: '15px'
          }}>
            Votre boutique en ligne de téléphones mobiles et accessoires premium. 
            Livraison à domicile sur toute la Tunisie.
          </p>
          
          {/* Réseaux sociaux - Centré */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a 
              href="https://www.facebook.com/profile.php?id=100090708515530"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textDecoration: 'none',
                fontSize: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3b5998';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a 
              href="https://www.instagram.com/w.store_tn/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textDecoration: 'none',
                fontSize: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href="https://wa.me/21652255145"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textDecoration: 'none',
                fontSize: '20px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#25D366';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

        {/* Séparateur */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          margin: '30px 0'
        }}></div>

        {/* Liens Rapides */}
        <div style={{
          marginBottom: '35px',
          padding: '0 15px'
        }}>
          <h5 style={{
            fontWeight: '700',
            marginBottom: '20px',
            color: 'white',
            fontSize: '18px',
            borderBottom: '2px solid #c53030',
            paddingBottom: '10px',
            display: 'block',
            width: '100%'
          }}>Liens Rapides</h5>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {[
              { name: 'Accueil', href: '/' },
              { name: 'Boutique', href: '/shop' },
              { name: 'Nos Magasins', href: '/magasins' },
              { name: 'Contact', href: '/contact' }
            ].map((link) => (
              <li key={link.name} style={{marginBottom: '12px'}}>
                <Link 
                  href={link.href}
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    fontSize: '15px',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#c53030';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Séparateur */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          margin: '30px 0'
        }}></div>

        {/* Catégories */}
        <div style={{
          marginBottom: '35px',
          padding: '0 15px'
        }}>
          <h5 style={{
            fontWeight: '700',
            marginBottom: '20px',
            color: 'white',
            fontSize: '18px',
            borderBottom: '2px solid #c53030',
            paddingBottom: '10px',
            display: 'block',
            width: '100%'
          }}>Catégories</h5>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {categories.map((cat) => (
              <li key={cat._id} style={{marginBottom: '12px'}}>
                <Link 
                  href={`/category/${cat._id}`}
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    fontSize: '15px',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#c53030';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                  }}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Séparateur */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          margin: '30px 0'
        }}></div>

        {/* Contact */}
        <div style={{
          marginBottom: '35px',
          padding: '0 15px'
        }}>
          <h5 style={{
            fontWeight: '700',
            marginBottom: '25px',
            color: 'white',
            fontSize: '18px',
            borderBottom: '2px solid #c53030',
            paddingBottom: '10px',
            display: 'inline-block'
          }}>Contact</h5>
          
          {/* Adresse */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <i className="fas fa-map-marker-alt" style={{color: '#c53030', fontSize: '18px'}}></i>
            </div>
            <div style={{flex: 1}}>
              <div style={{
                color: 'white',
                fontWeight: '600',
                marginBottom: '5px',
                fontSize: '15px'
              }}>Adresses</div>
              <div style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                Cité Commerciale, Korba<br />
                Rue Taher Sfar, Dar Chaâbene El Fehri
              </div>
            </div>
          </div>
          
          {/* Téléphones */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <i className="fas fa-phone-alt" style={{color: '#c53030', fontSize: '18px'}}></i>
            </div>
            <div style={{flex: 1}}>
              <div style={{
                color: 'white',
                fontWeight: '600',
                marginBottom: '5px',
                fontSize: '15px'
              }}>Téléphones</div>
              <div style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                +216 52 255 145<br />
                +216 48 018 250
              </div>
            </div>
          </div>
          
          {/* Email */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <i className="fas fa-envelope" style={{color: '#c53030', fontSize: '18px'}}></i>
            </div>
            <div style={{flex: 1}}>
              <div style={{
                color: 'white',
                fontWeight: '600',
                marginBottom: '5px',
                fontSize: '15px'
              }}>Email</div>
              <div style={{
                color: 'rgba(255,255,255,0.85)',
                fontSize: '14px',
                wordBreak: 'break-word'
              }}>wstore887@gmail.com</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          paddingTop: '20px',
          textAlign: 'center',
          padding: '20px 15px 0'
        }}>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '13px',
            margin: '0 0 10px 0',
            lineHeight: '1.6'
          }}>
            © 2026 <strong>W Store</strong>. Tous droits réservés.
          </p>
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            fontSize: '13px'
          }}>
            <Link 
              href="/privacy" 
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#c53030';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              Confidentialité
            </Link>
            <span style={{color: 'rgba(255,255,255,0.4)'}}>|</span>
            <Link 
              href="/terms" 
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#c53030';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              }}
            >
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
