'use client';
import { useEffect, useState } from 'react';

interface Brand {
  _id: string;
  name: string;
  image?: string;
}

export default function BrandCarousel() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/brands')
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(err => console.error('Erreur:', err));
  }, []);

  const duplicatedBrands = [...brands, ...brands, ...brands];

  if (brands.length === 0) return null;

  return (
    <div style={{ 
      background: '#f7fafc', 
      padding: '30px 0',
      marginTop: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(197, 48, 48, 0.08) 0%, transparent 70%)',
        borderRadius: '50%'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-30px',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(26, 54, 93, 0.05) 0%, transparent 70%)',
        borderRadius: '50%'
      }}></div>

      {/* Header */}
      <div className="container" style={{ position: 'relative', zIndex: 1, marginBottom: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(197, 48, 48, 0.1)',
            color: '#c53030',
            padding: '8px 20px',
            borderRadius: '30px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '15px'
          }}>
            Nos Partenaires
          </span>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#1a202c', 
            marginBottom: '10px',
            letterSpacing: '-0.5px'
          }}>
            Marques de <span style={{ color: '#c53030' }}>Confiance</span>
          </h2>
          <p style={{ color: '#718096', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
            Nous collaborons avec les meilleures marques pour vous offrir des produits de qualité
          </p>
        </div>
      </div>

      {/* Gradient gauche */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '180px',
        bottom: 0,
        width: '120px',
        background: 'linear-gradient(to right, #f7fafc, transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }}></div>
      
      {/* Gradient droit */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: '180px',
        bottom: 0,
        width: '120px',
        background: 'linear-gradient(to left, #f7fafc, transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }}></div>
      
      {/* Conteneur du carrousel */}
      <div 
        className="brand-carousel-scroll"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          width: 'fit-content',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}
      >
        {duplicatedBrands.map((brand, index) => (
          <div 
            key={`${brand._id}-${index}`}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '160px',
              height: '80px',
              background: '#1a365d',
              borderRadius: '16px',
              border: '1px solid #2d4a7c',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              flexShrink: 0,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '0 20px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(26,54,93,0.3)';
              e.currentTarget.style.background = '#234876';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
              e.currentTarget.style.background = '#1a365d';
            }}
          >
            {brand.image ? (
              <img 
                src={`http://localhost:5000${brand.image}`}
                alt={brand.name}
                style={{
                  maxWidth: '120px',
                  maxHeight: '50px',
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)',
                  opacity: 0.9
                }}
              />
            ) : (
              <span style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                color: 'white',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                {brand.name}
              </span>
            )}
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes brandCarouselScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .brand-carousel-scroll {
          animation: brandCarouselScroll 30s linear infinite;
        }
        .brand-carousel-scroll:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}
