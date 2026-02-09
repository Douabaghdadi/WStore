'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '../../lib/api';

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  productCount: number;
}

export default function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/categories/with-count`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Erreur:', err));
  }, []);

  // Dupliquer les catégories pour un défilement infini
  const duplicatedCategories = [...categories, ...categories, ...categories];

  if (categories.length === 0) return null;

  return (
    <div style={{ 
      background: '#f5f5f7', 
      padding: '30px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1d1d1f', marginBottom: '8px' }}>
            Nos Catégories
          </h2>
          <p style={{ color: '#86868b', fontSize: '15px', margin: 0 }}>
            Parcourez notre sélection de produits par catégorie
          </p>
        </div>
      </div>

      {/* Gradient gauche */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: '120px',
        bottom: 0,
        width: '100px',
        background: 'linear-gradient(to right, #f5f5f7, transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }}></div>
      
      {/* Gradient droit */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: '120px',
        bottom: 0,
        width: '100px',
        background: 'linear-gradient(to left, #f5f5f7, transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }}></div>

      {/* Conteneur du carrousel */}
      <div 
        className="category-carousel-scroll"
        style={{
          display: 'flex',
          gap: '20px',
          width: 'fit-content',
          paddingLeft: '20px',
          paddingRight: '20px'
        }}
      >
        {duplicatedCategories.map((category, index) => (
          <Link 
            key={`${category._id}-${index}`} 
            href={`/category/${category._id}`} 
            style={{ textDecoration: 'none', flexShrink: 0 }}
          >
            <div style={{ 
              width: '240px',
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
            >
              <div style={{ 
                height: '200px',
                background: '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {category.image && category.image !== 'undefined' ? (
                  <img 
                    src={category.image.startsWith('http') ? category.image : `${API_URL}${category.image}`}
                    alt={category.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #c53030 0%, #9b2c2c 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(197, 48, 48, 0.3);">
                          <i class="fas fa-box-open" style="font-size: 28px; color: white;"></i>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(197, 48, 48, 0.3)'
                  }}>
                    <i className="fas fa-box-open" style={{ fontSize: '28px', color: 'white' }}></i>
                  </div>
                )}
              </div>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h6 style={{ 
                  fontWeight: '600', 
                  color: '#1d1d1f', 
                  fontSize: '17px',
                  marginBottom: '8px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {category.name}
                </h6>
                <span style={{ 
                  color: '#86868b', 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {category.productCount} produits
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes categoryCarouselScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .category-carousel-scroll {
          animation: categoryCarouselScroll 30s linear infinite;
        }
        .category-carousel-scroll:hover {
          animation-play-state: paused;
        }
        
        /* Styles responsives mobile */
        @media (max-width: 768px) {
          .category-carousel-scroll > a > div {
            width: 170px !important;
          }
          
          .category-carousel-scroll > a > div > div:first-child {
            height: 150px !important;
          }
          
          .category-carousel-scroll > a > div > div:last-child {
            padding: 16px !important;
          }
          
          .category-carousel-scroll h6 {
            font-size: 15px !important;
          }
          
          .category-carousel-scroll span {
            font-size: 12px !important;
          }
        }
      `}} />
    </div>
  );
}
