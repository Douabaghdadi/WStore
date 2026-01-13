'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Footer() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Erreur chargement catégories:', err));
  }, []);

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0d1b2a 0%, #1a365d 100%)',
      color: 'white',
      paddingTop: '80px'
    }}>
      {/* Main Footer */}
      <div className="container">
        <div className="row g-5">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-4">
              <Image 
                src="/img/logo.png" 
                alt="W.Store - Informatique, Smartphone & Accessoires" 
                width={180}
                height={55}
                style={{
                  objectFit: 'contain'
                }}
              />
            </div>
            <p style={{color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', marginBottom: '25px'}}>
              Votre boutique en ligne de téléphones mobiles et accessoires premium. 
              Livraison à domicile sur toute la Tunisie.
            </p>
            <div className="d-flex gap-3">
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
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                >
                  <i className={`fab fa-${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 style={{fontWeight: '700', marginBottom: '25px', color: 'white'}}>Liens Rapides</h5>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
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
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#c53030';
                      e.currentTarget.style.paddingLeft = '5px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                      e.currentTarget.style.paddingLeft = '0';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6">
            <h5 style={{fontWeight: '700', marginBottom: '25px', color: 'white'}}>Catégories</h5>
            <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
              {categories.map((cat) => (
                <li key={cat._id} style={{marginBottom: '12px'}}>
                  <Link 
                    href={`/category/${cat._id}`}
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#c53030';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                    }}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <h5 style={{fontWeight: '700', marginBottom: '25px', color: 'white'}}>Contact</h5>
            <div style={{marginBottom: '20px'}}>
              <div className="d-flex align-items-start gap-3 mb-3">
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
                  <i className="fas fa-map-marker-alt" style={{color: '#c53030'}}></i>
                </div>
                <div>
                  <div style={{color: 'white', fontWeight: '600', marginBottom: '4px'}}>Adresses</div>
                  <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px'}}>Cité Commerciale, Korba</div>
                  <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px'}}>Rue Taher Sfar, Dar Chaâbene El Fehri</div>
                </div>
              </div>
              
              <div className="d-flex align-items-start gap-3 mb-3">
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
                  <i className="fas fa-phone-alt" style={{color: '#c53030'}}></i>
                </div>
                <div>
                  <div style={{color: 'white', fontWeight: '600', marginBottom: '4px'}}>Téléphones</div>
                  <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px'}}>+216 52 255 145</div>
                  <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px'}}>+216 48 018 250</div>
                </div>
              </div>
              
              <div className="d-flex align-items-start gap-3">
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
                  <i className="fas fa-envelope" style={{color: '#c53030'}}></i>
                </div>
                <div>
                  <div style={{color: 'white', fontWeight: '600', marginBottom: '4px'}}>Email</div>
                  <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px'}}>wstore887@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '60px',
        padding: '25px 0'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: 0}}>
                © 2026 W Store. Tous droits réservés.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex gap-4 justify-content-md-end">
                <Link href="/privacy" style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none'}}>
                  Politique de confidentialité
                </Link>
                <Link href="/terms" style={{color: 'rgba(255,255,255,0.6)', fontSize: '14px', textDecoration: 'none'}}>
                  Conditions d'utilisation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
