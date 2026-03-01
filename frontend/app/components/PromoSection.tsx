'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  description?: string;
  image?: string;
  stock: number;
  brand?: { name: string };
  subcategory?: { name: string };
  category?: { _id: string; name: string; image?: string };
}

export default function PromoSection() {
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    setDebugInfo('Chargement en cours...');
    fetch(`${API_URL}/api/products`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('PromoSection - Tous les produits:', data);
        setDebugInfo(`Total produits: ${data.length}`);
        
        // Filtrer les produits avec une promotion (discount > 0)
        const productsWithDiscount = data.filter((p: Product) => {
          const hasDiscount = p.discount && p.discount > 0;
          console.log(`Produit ${p.name}: discount = ${p.discount}, hasDiscount = ${hasDiscount}`);
          return hasDiscount;
        });
        
        console.log('PromoSection - Produits en promo:', productsWithDiscount.length);
        setDebugInfo(`Total: ${data.length}, En promo: ${productsWithDiscount.length}`);
        setPromoProducts(productsWithDiscount);
        
        // Initialiser les quantités
        const initialQuantities: { [key: string]: number } = {};
        productsWithDiscount.forEach((p: Product) => {
          initialQuantities[p._id] = 1;
        });
        setQuantities(initialQuantities);
        setLoading(false);
      })
      .catch(err => {
        console.error('PromoSection - Erreur:', err);
        setError(err.message);
        setDebugInfo(`Erreur: ${err.message}`);
        setLoading(false);
      });
  }, []);

  // Toujours afficher quelque chose pour le debug
  if (loading) {
    return (
      <div style={{ background: '#e3f2fd', padding: '30px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ color: '#1565c0', marginBottom: '10px' }}><strong>PromoSection:</strong> Chargement...</p>
          <div className="spinner-border" style={{ color: '#c53030' }} role="status"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#ffebee', padding: '30px 0' }}>
        <div className="container">
          <p style={{ color: '#c62828', margin: 0 }}>
            <strong>PromoSection Erreur:</strong> {error}
          </p>
        </div>
      </div>
    );
  }

  if (promoProducts.length === 0) {
    return (
      <div style={{ background: '#fff3cd', padding: '30px 0' }}>
        <div className="container">
          <p style={{ margin: 0, color: '#856404' }}>
            <strong>PromoSection Debug:</strong> {debugInfo} - Aucun produit avec discount &gt; 0 trouvé.
          </p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const discountedPrice = product.discount 
      ? product.price * (1 - product.discount / 100) 
      : product.price;
    
    addToCart({
      _id: product._id,
      name: product.name,
      price: discountedPrice,
      image: product.image || '/img/product-placeholder.jpg',
      quantity: quantities[product._id] || 1
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Prendre la catégorie du premier produit en promo pour l'affichage
  const featuredCategory = promoProducts[0]?.category;

  return (
    <div style={{ background: '#f8f9fa', padding: '50px 0' }}>
      <div className="container">
        <div className="row g-4">
          {/* Grande image catégorie à gauche */}
          <div className="col-lg-3 d-none d-lg-block">
            <div style={{
              borderRadius: '20px',
              height: '100%',
              minHeight: '450px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '30px'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/img/promo-banner.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}></div>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{ 
                  color: 'white', 
                  fontSize: '1.8rem', 
                  fontWeight: '800',
                  marginBottom: '15px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}>
                  Promotions
                </h3>
                <p style={{ 
                  color: 'rgba(255,255,255,0.85)', 
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  Profitez de nos meilleures offres
                </p>
                <Link href="/promotions" style={{
                  display: 'inline-block',
                  background: '#c53030',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '13px'
                }}>
                  Voir tout
                </Link>
              </div>
            </div>
          </div>

          {/* Produits en promo à droite */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a202c', margin: 0 }}>
                Coup d'œil sur nos <span style={{ color: '#c53030' }}>Promotions</span>
              </h2>
              <Link href="/promotions" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1a365d',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                padding: '8px 16px',
                border: '2px solid #1a365d',
                borderRadius: '8px',
                transition: 'all 0.3s'
              }}>
                Découvrir <i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i>
              </Link>
            </div>

            {/* Carrousel de produits */}
            <div style={{ position: 'relative' }}>
              {/* Boutons de navigation */}
              <button 
                onClick={() => scroll('left')}
                style={{
                  position: 'absolute',
                  left: '-15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'white',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-chevron-left" style={{ color: '#1a202c' }}></i>
              </button>
              <button 
                onClick={() => scroll('right')}
                style={{
                  position: 'absolute',
                  right: '-15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'white',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-chevron-right" style={{ color: '#1a202c' }}></i>
              </button>

              {/* Container scrollable */}
              <div 
                ref={scrollRef}
                style={{
                  display: 'flex',
                  gap: '20px',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  padding: '10px 5px'
                }}
              >
                {promoProducts.map((product) => {
                  const discountedPrice = product.price * (1 - product.discount / 100);
                  const isFavorite = favorites.includes(product._id);
                  const isHovered = hoveredCard === product._id;
                  
                  return (
                    <div 
                      key={product._id}
                      onMouseEnter={() => setHoveredCard(product._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      style={{
                        minWidth: '260px',
                        maxWidth: '260px',
                        background: 'white',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: isHovered 
                          ? '0 20px 40px rgba(26, 54, 93, 0.15)' 
                          : '0 4px 20px rgba(0,0,0,0.06)',
                        border: '1px solid #e2e8f0',
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)'
                      }}
                    >
                      {/* Image du produit */}
                      <div style={{ position: 'relative', background: '#f7fafc', height: '180px' }}>
                        <Link href={`/product/${product._id}`}>
                          <img 
                            src={product.image || '/img/product-placeholder.jpg'}
                            alt={product.name}
                            style={{ width: '100%', height: '180px', objectFit: 'contain', padding: '15px' }}
                          />
                        </Link>
                        
                        {/* Badges container */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          {/* Badge Promo */}
                          <span style={{
                            background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 8px rgba(26, 54, 93, 0.3)'
                          }}>
                            <i className="fas fa-tag" style={{ fontSize: '9px' }}></i>
                            Promo
                          </span>
                        </div>
                        
                        {/* Badge pourcentage */}
                        <span style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                          color: 'white',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '800',
                          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                        }}>
                          -{product.discount}%
                        </span>

                        {/* Bouton favoris */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (isFavorite) {
                              removeFavorite(product._id);
                            } else {
                              addFavorite(product._id);
                            }
                          }}
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            border: 'none',
                            background: isFavorite ? '#fee2e2' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <i 
                            className={isFavorite ? 'fas fa-heart' : 'far fa-heart'} 
                            style={{ 
                              color: isFavorite ? '#dc2626' : '#64748b',
                              fontSize: '14px'
                            }}
                          ></i>
                        </button>
                      </div>

                      {/* Infos produit */}
                      <div style={{ padding: '18px' }}>
                        {/* Nom du produit */}
                        <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                          <h6 style={{ 
                            fontWeight: '600', 
                            color: '#1e293b', 
                            fontSize: '14px', 
                            lineHeight: '1.5',
                            height: '42px',
                            overflow: 'hidden',
                            marginBottom: '10px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {product.name}
                          </h6>
                        </Link>

                        {/* Stock indicator */}
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px',
                          marginBottom: '12px',
                          background: product.stock > 0 ? '#dcfce7' : '#fee2e2',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          width: 'fit-content'
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: product.stock > 0 ? '#22c55e' : '#ef4444'
                          }}></span>
                          <span style={{ 
                            color: product.stock > 0 ? '#16a34a' : '#dc2626',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {product.stock > 0 ? 'En stock' : 'Rupture'}
                          </span>
                        </div>

                        {/* Marque - hauteur fixe */}
                        <p style={{ 
                          color: '#64748b', 
                          fontSize: '11px', 
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          marginBottom: '8px'
                        }}>
                          {product.brand?.name || '\u00A0'}
                        </p>

                        {/* Prix */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'baseline', 
                          gap: '10px', 
                          marginBottom: '16px'
                        }}>
                          <span style={{ 
                            fontSize: '13px', 
                            color: '#94a3b8', 
                            textDecoration: 'line-through',
                            fontWeight: '500'
                          }}>
                            {product.price.toFixed(3)}
                          </span>
                          <span style={{ 
                            fontSize: '20px', 
                            fontWeight: '800', 
                            color: '#16a34a'
                          }}>
                            {discountedPrice.toFixed(3)}
                          </span>
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#64748b',
                            fontWeight: '600'
                          }}>
                            DT
                          </span>
                        </div>

                        {/* Quantité et Ajouter au panier */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          flexWrap: 'nowrap'
                        }}>
                          {/* Sélecteur de quantité */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#f1f5f9',
                            borderRadius: '8px',
                            padding: '3px',
                            flexShrink: 0
                          }}>
                            <button 
                              onClick={() => handleQuantityChange(product._id, -1)}
                              style={{
                                width: '26px',
                                height: '26px',
                                border: 'none',
                                background: 'white',
                                color: '#1a365d',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '14px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}
                            >
                              -
                            </button>
                            <span style={{ 
                              color: '#1e293b', 
                              fontWeight: '700',
                              minWidth: '24px',
                              textAlign: 'center',
                              fontSize: '13px'
                            }}>
                              {quantities[product._id] || 1}
                            </span>
                            <button 
                              onClick={() => handleQuantityChange(product._id, 1)}
                              style={{
                                width: '26px',
                                height: '26px',
                                border: 'none',
                                background: 'white',
                                color: '#1a365d',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '14px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}
                            >
                              +
                            </button>
                          </div>

                          {/* Bouton Ajouter */}
                          <button 
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            style={{
                              flex: 1,
                              minWidth: 0,
                              border: 'none',
                              background: product.stock > 0 
                                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' 
                                : '#cbd5e1',
                              color: 'white',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                              fontSize: '11px',
                              fontWeight: '700',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                              boxShadow: product.stock > 0 
                                ? '0 4px 12px rgba(220, 38, 38, 0.3)' 
                                : 'none',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <i className="fas fa-shopping-cart" style={{ fontSize: '10px' }}></i>
                            Ajouter
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Styles responsives mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          /* Titre section */
          h2 {
            font-size: 1.3rem !important;
          }
          
          /* Bouton découvrir */
          a[href="/promotions"] {
            font-size: 12px !important;
            padding: 6px 12px !important;
          }
          
          /* Boutons navigation carrousel */
          button[style*="position: absolute"] {
            width: 35px !important;
            height: 35px !important;
          }
          
          button[style*="left: '-15px'"] {
            left: -10px !important;
          }
          
          button[style*="right: '-15px'"] {
            right: -10px !important;
          }
          
          /* Cartes produits */
          div[style*="minWidth: '260px'"] {
            min-width: 220px !important;
            max-width: 220px !important;
          }
          
          /* Image produit */
          div[style*="minWidth: '260px'"] img {
            height: 160px !important;
            padding: 12px !important;
          }
          
          /* Contenu carte */
          div[style*="minWidth: '260px'"] > div:last-child {
            padding: 15px !important;
          }
          
          /* Titre produit */
          div[style*="minWidth: '260px'"] h6 {
            font-size: 13px !important;
            height: 38px !important;
          }
          
          /* Prix */
          div[style*="minWidth: '260px'"] span[style*="fontSize: '20px'"] {
            font-size: 18px !important;
          }
          
          /* Boutons quantité */
          button[style*="width: '26px'"] {
            width: 24px !important;
            height: 24px !important;
            font-size: 13px !important;
          }
          
          /* Bouton ajouter */
          button[style*="flex: 1"] {
            padding: 7px 10px !important;
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}
