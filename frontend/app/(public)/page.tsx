'use client';
import { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import Link from 'next/link';
import BrandCarousel from '../components/BrandCarousel';
import CategoryCarousel from '../components/CategoryCarousel';
import PromoSection from '../components/PromoSection';
import { API_URL } from '../../lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  image?: string;
  stock?: number;
  brand?: { name: string };
  subcategory?: { name: string };
  category?: { _id: string; name: string };
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const accessoiresScrollRef = useRef<HTMLDivElement>(null);
  const smartphonesScrollRef = useRef<HTMLDivElement>(null);
  const nouveautesScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/products`).then(res => res.json()),
      fetch(`${API_URL}/api/categories`).then(res => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product: Product) => {
    const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
    const qty = quantities[product._id] || 1;
    addToCart({
      _id: product._id,
      name: product.name,
      price: finalPrice,
      image: product.image || '/img/product-placeholder.jpg',
      quantity: qty
    });
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  // Filtrer les produits par catégorie
  const accessoiresCategory = categories.find(c => c.name?.toLowerCase().includes('accessoire'));
  const smartphonesCategory = categories.find(c => 
    c.name?.toLowerCase().includes('smartphone') || 
    c.name?.toLowerCase().includes('phone') ||
    c.name?.toLowerCase().includes('téléphone')
  );
  
  const accessoiresProducts = products.filter(p => 
    p.category?.name?.toLowerCase().includes('accessoire')
  );
  const smartphonesProducts = products.filter(p => 
    p.category?.name?.toLowerCase().includes('smartphone') || 
    p.category?.name?.toLowerCase().includes('phone') ||
    p.category?.name?.toLowerCase().includes('téléphone')
  );

  const scrollAccessoires = (direction: 'left' | 'right') => {
    if (accessoiresScrollRef.current) {
      accessoiresScrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  const scrollSmartphones = (direction: 'left' | 'right') => {
    if (smartphonesScrollRef.current) {
      smartphonesScrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  const scrollNouveautes = (direction: 'left' | 'right') => {
    if (nouveautesScrollRef.current) {
      nouveautesScrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  // Produits les plus récents (triés par date de création)
  const nouveautesProducts = [...products].sort((a, b) => {
    // Trier par _id décroissant (les plus récents en premier car MongoDB ObjectId contient un timestamp)
    return b._id.localeCompare(a._id);
  }).slice(0, 10);

  return (
    <>
      {/* Hero Banners Section */}
      <div className="homepage-banners" style={{ background: '#f7fafc', paddingTop: '15px' }}>
        <div className="container">
          <div className="row g-3">
            {/* Grande bannière iPhone - Gauche */}
            <div className="col-lg-6 col-12">
              <div className="banner-iphone" style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                borderRadius: '20px',
                padding: '30px',
                height: '100%',
                minHeight: '400px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  background: '#c53030',
                  color: 'white',
                  padding: '8px 20px',
                  fontWeight: '700',
                  fontSize: '12px',
                  borderRadius: '5px',
                  zIndex: 10
                }}>
                  PROMO !
                </div>
                <div style={{ position: 'relative', zIndex: 5, flex: 1, marginTop: '60px' }}>
                  <h2 className="banner-title" style={{ color: 'white', fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '5px' }}>
                    iPhone
                  </h2>
                  <h2 className="banner-subtitle" style={{ color: '#a0aec0', fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '25px' }}>
                    16 Pro
                  </h2>
                  <Link href="/shop" className="banner-btn" style={{
                    display: 'inline-block',
                    background: '#c53030',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '13px',
                    textTransform: 'uppercase'
                  }}>
                    Profitez Maintenant !
                  </Link>
                </div>
                <div className="banner-image" style={{
                  position: 'absolute',
                  top: '50%',
                  right: '20px',
                  transform: 'translateY(-50%)',
                  width: '55%',
                  height: '90%',
                  backgroundImage: 'url(/img/banners/iphone-banner.png)',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center right',
                  backgroundRepeat: 'no-repeat'
                }}></div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="col-lg-6 col-12">
              <div className="row g-3">
                <div className="col-12">
                  <div className="banner-headphone" style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderRadius: '20px',
                    padding: '25px 30px',
                    height: '195px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1, zIndex: 5 }}>
                      <p className="banner-label" style={{ color: '#c53030', fontSize: '14px', fontWeight: '700', fontStyle: 'italic', marginBottom: '5px' }}>
                        OFFRE SPÉCIALE
                      </p>
                      <h3 className="banner-heading" style={{ color: '#1a202c', fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px' }}>
                        Casque bluetooth P9 pro max
                      </h3>
                      <Link href="/shop" className="banner-btn-small" style={{
                        display: 'inline-block',
                        background: '#1a202c',
                        color: 'white',
                        padding: '10px 24px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '13px'
                      }}>
                        Profitez
                      </Link>
                    </div>
                    <div className="banner-image-small" style={{
                      position: 'absolute',
                      right: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '180px',
                      height: '160px',
                      backgroundImage: 'url(/img/banners/headphone-banner.png)',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}></div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="banner-airpods" style={{
                    background: 'linear-gradient(135deg, #2d4a7c 0%, #1a365d 50%, #0f2442 100%)',
                    borderRadius: '20px',
                    padding: '20px',
                    height: '195px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <h4 className="banner-small-title" style={{ color: 'white', fontSize: '1rem', fontWeight: '700', marginBottom: '5px' }}>
                      Promo AirPods
                    </h4>
                    <p className="banner-small-desc" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '15px' }}>
                      Borofone BW26
                    </p>
                    <Link href="/shop" className="banner-btn-mini" style={{
                      display: 'inline-block',
                      background: 'white',
                      color: '#1a365d',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>
                      Profitez
                    </Link>
                    <div className="banner-image-mini" style={{
                      position: 'absolute',
                      right: '10px',
                      bottom: '15px',
                      width: '140px',
                      height: '140px',
                      backgroundImage: 'url(/img/banners/airpods-banner.png)',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}></div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="banner-speaker" style={{
                    background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 50%, #9b2c2c 100%)',
                    borderRadius: '20px',
                    padding: '20px',
                    height: '195px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <h4 className="banner-small-title" style={{ color: 'white', fontSize: '1rem', fontWeight: '700', marginBottom: '3px' }}>
                      Speaker Marshall
                    </h4>
                    <p className="banner-small-desc" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '15px' }}>
                      de haute qualité
                    </p>
                    <Link href="/shop" className="banner-btn-mini" style={{
                      display: 'inline-block',
                      background: 'white',
                      color: '#c53030',
                      padding: '8px 18px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>
                      Voir Plus
                    </Link>
                    <div className="banner-image-mini" style={{
                      position: 'absolute',
                      right: '10px',
                      bottom: '15px',
                      width: '140px',
                      height: '140px',
                      backgroundImage: 'url(/img/banners/speaker-banner.png)',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marques - Carrousel Automatique */}
      <BrandCarousel />

      {/* Catégories - Carrousel */}
      <CategoryCarousel />

      {/* Section Promotions */}
      <PromoSection />

      {/* Section Accessoires */}
      {accessoiresProducts.length > 0 && (
        <div style={{ background: '#ffffff', padding: '50px 0' }}>
          <div className="container">
            <div className="row g-5">
              {/* Produits à gauche */}
              <div className="col-lg-9">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a202c', margin: 0 }}>
                    Nos <span style={{ color: '#1a365d' }}>Accessoires</span>
                  </h2>
                  <Link href={accessoiresCategory ? `/category/${accessoiresCategory._id}` : '/shop'} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', color: '#1a365d',
                    textDecoration: 'none', fontWeight: '600', fontSize: '14px',
                    padding: '8px 16px', border: '2px solid #1a365d', borderRadius: '8px'
                  }}>
                    Découvrir <i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </Link>
                </div>

                {/* Carrousel */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => scrollAccessoires('left')} style={{
                    position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)',
                    width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <i className="fas fa-chevron-left" style={{ color: '#1a202c' }}></i>
                  </button>
                  <button onClick={() => scrollAccessoires('right')} style={{
                    position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)',
                    width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <i className="fas fa-chevron-right" style={{ color: '#1a202c' }}></i>
                  </button>

                  <div ref={accessoiresScrollRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 5px' }}>
                    {accessoiresProducts.slice(0, 8).map((product) => {
                      const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
                      const isFav = favorites.includes(product._id);
                      return (
                        <div key={product._id} style={{
                          minWidth: '280px', maxWidth: '280px', background: 'white',
                          borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                          border: '1px solid #e2e8f0', flexShrink: 0
                        }}>
                          <div style={{ position: 'relative', background: '#f7fafc', height: '240px' }}>
                            <Link href={`/product/${product._id}`}>
                              <img src={product.image?.startsWith('http') ? product.image : product.image ? `${API_URL}${product.image}` : '/img/product-placeholder.jpg'}
                                alt={product.name} style={{ width: '100%', height: '240px', objectFit: 'contain', padding: '20px' }} />
                            </Link>
                            {(product.discount ?? 0) > 0 && (
                              <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#1a365d',
                                color: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800'
                              }}>-{product.discount}%</span>
                            )}
                            {/* Bouton favoris */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (isFav) {
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
                                background: isFav ? '#fee2e2' : 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <i 
                                className={isFav ? 'fas fa-heart' : 'far fa-heart'} 
                                style={{ 
                                  color: isFav ? '#dc2626' : '#64748b',
                                  fontSize: '14px'
                                }}
                              ></i>
                            </button>
                          </div>
                          <div style={{ padding: '18px' }}>
                            <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                              <h6 style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px', height: '42px', overflow: 'hidden', marginBottom: '10px' }}>{product.name}</h6>
                            </Link>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px',
                              background: (product.stock ?? 0) > 0 ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '20px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: (product.stock ?? 0) > 0 ? '#22c55e' : '#ef4444' }}></span>
                              <span style={{ color: (product.stock ?? 0) > 0 ? '#16a34a' : '#dc2626', fontSize: '11px', fontWeight: '600' }}>
                                {(product.stock ?? 0) > 0 ? 'En stock' : 'Rupture'}
                              </span>
                            </div>
                            <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>{product.brand?.name || '\u00A0'}</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                              {(product.discount ?? 0) > 0 && (
                                <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' }}>{product.price.toFixed(3)}</span>
                              )}
                              <span style={{ fontSize: '20px', fontWeight: '800', color: (product.discount ?? 0) > 0 ? '#16a34a' : '#1a365d' }}>{finalPrice.toFixed(3)}</span>
                              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>DT</span>
                            </div>
                            
                            {/* Sélecteur de quantité + Bouton Ajouter */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                display: 'flex', alignItems: 'center', background: '#f1f5f9',
                                borderRadius: '8px', padding: '3px', flexShrink: 0
                              }}>
                                <button onClick={() => handleQuantityChange(product._id, -1)} style={{
                                  width: '28px', height: '28px', border: 'none', background: 'white',
                                  color: '#1a365d', borderRadius: '6px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}>-</button>
                                <span style={{ color: '#1e293b', fontWeight: '700', minWidth: '28px', textAlign: 'center', fontSize: '13px' }}>
                                  {quantities[product._id] || 1}
                                </span>
                                <button onClick={() => handleQuantityChange(product._id, 1)} style={{
                                  width: '28px', height: '28px', border: 'none', background: 'white',
                                  color: '#1a365d', borderRadius: '6px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}>+</button>
                              </div>
                              <button onClick={() => handleAddToCart(product)} disabled={(product.stock ?? 0) === 0} style={{
                                flex: 1, border: 'none', background: (product.stock ?? 0) > 0 ? '#1a365d' : '#cbd5e1',
                                color: 'white', borderRadius: '8px', padding: '10px', cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
                                fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                              }}>
                                <i className="fas fa-shopping-cart" style={{ fontSize: '10px' }}></i> Ajouter
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bannière à droite */}
              <div className="col-lg-3 d-none d-lg-block">
                <div style={{
                  borderRadius: '20px',
                  height: '100%',
                  minHeight: '450px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)'
                }}>
                  {/* Image de fond - Ajoute ton image dans /public/img/accessoires-banner.jpg */}
                  <img 
                    src="/img/accessoires-banner.jpg" 
                    alt="Accessoires"
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, width: '100%', height: '100%',
                      objectFit: 'cover',
                      opacity: 0.85
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(26, 54, 93, 0.95) 0%, transparent 100%)',
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}>
                    <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>
                      Accessoires
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '20px' }}>
                      Découvrez notre gamme d'accessoires
                    </p>
                    <Link href={accessoiresCategory ? `/category/${accessoiresCategory._id}` : '/shop'} style={{
                      display: 'inline-block', background: 'white', color: '#1a365d',
                      padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '13px',
                      width: 'fit-content'
                    }}>
                      Voir tout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Smartphones */}
      {smartphonesProducts.length > 0 && (
        <div style={{ background: '#f8f9fa', padding: '50px 0' }}>
          <div className="container">
            <div className="row g-5">
              {/* Bannière à gauche */}
              <div className="col-lg-3 d-none d-lg-block">
                <div style={{
                  borderRadius: '20px',
                  height: '100%',
                  minHeight: '450px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)'
                }}>
                  {/* Image de fond - Ajoute ton image dans /public/img/smartphones-banner.jpg */}
                  <img 
                    src="/img/smartphones-banner.jpg" 
                    alt="Smartphones"
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, width: '100%', height: '100%',
                      objectFit: 'cover',
                      opacity: 0.85
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(197, 48, 48, 0.95) 0%, transparent 100%)',
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}>
                    <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>
                      Smartphones
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '20px' }}>
                      Les derniers modèles disponibles
                    </p>
                    <Link href={smartphonesCategory ? `/category/${smartphonesCategory._id}` : '/shop'} style={{
                      display: 'inline-block', background: 'white', color: '#c53030',
                      padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '13px',
                      width: 'fit-content'
                    }}>
                      Voir tout
                    </Link>
                  </div>
                </div>
              </div>

              {/* Produits à droite */}
              <div className="col-lg-9">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a202c', margin: 0 }}>
                    Nos <span style={{ color: '#c53030' }}>Smartphones</span>
                  </h2>
                  <Link href={smartphonesCategory ? `/category/${smartphonesCategory._id}` : '/shop'} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', color: '#c53030',
                    textDecoration: 'none', fontWeight: '600', fontSize: '14px',
                    padding: '8px 16px', border: '2px solid #c53030', borderRadius: '8px'
                  }}>
                    Découvrir <i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i>
                  </Link>
                </div>

                {/* Carrousel */}
                <div style={{ position: 'relative' }}>
                  <button onClick={() => scrollSmartphones('left')} style={{
                    position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)',
                    width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <i className="fas fa-chevron-left" style={{ color: '#1a202c' }}></i>
                  </button>
                  <button onClick={() => scrollSmartphones('right')} style={{
                    position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)',
                    width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <i className="fas fa-chevron-right" style={{ color: '#1a202c' }}></i>
                  </button>

                  <div ref={smartphonesScrollRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 5px' }}>
                    {smartphonesProducts.slice(0, 8).map((product) => {
                      const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
                      const isFav = favorites.includes(product._id);
                      return (
                        <div key={product._id} style={{
                          minWidth: '280px', maxWidth: '280px', background: 'white',
                          borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                          border: '1px solid #e2e8f0', flexShrink: 0
                        }}>
                          <div style={{ position: 'relative', background: '#f7fafc', height: '240px' }}>
                            <Link href={`/product/${product._id}`}>
                              <img src={product.image?.startsWith('http') ? product.image : product.image ? `${API_URL}${product.image}` : '/img/product-placeholder.jpg'}
                                alt={product.name} style={{ width: '100%', height: '240px', objectFit: 'contain', padding: '20px' }} />
                            </Link>
                            {(product.discount ?? 0) > 0 && (
                              <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#c53030',
                                color: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800'
                              }}>-{product.discount}%</span>
                            )}
                            {/* Bouton favoris */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                if (isFav) {
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
                                background: isFav ? '#fee2e2' : 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <i 
                                className={isFav ? 'fas fa-heart' : 'far fa-heart'} 
                                style={{ 
                                  color: isFav ? '#dc2626' : '#64748b',
                                  fontSize: '14px'
                                }}
                              ></i>
                            </button>
                          </div>
                          <div style={{ padding: '18px' }}>
                            <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                              <h6 style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px', height: '42px', overflow: 'hidden', marginBottom: '10px' }}>{product.name}</h6>
                            </Link>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px',
                              background: (product.stock ?? 0) > 0 ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '20px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: (product.stock ?? 0) > 0 ? '#22c55e' : '#ef4444' }}></span>
                              <span style={{ color: (product.stock ?? 0) > 0 ? '#16a34a' : '#dc2626', fontSize: '11px', fontWeight: '600' }}>
                                {(product.stock ?? 0) > 0 ? 'En stock' : 'Rupture'}
                              </span>
                            </div>
                            <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>{product.brand?.name || '\u00A0'}</p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                              {(product.discount ?? 0) > 0 && (
                                <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' }}>{product.price.toFixed(3)}</span>
                              )}
                              <span style={{ fontSize: '20px', fontWeight: '800', color: (product.discount ?? 0) > 0 ? '#16a34a' : '#c53030' }}>{finalPrice.toFixed(3)}</span>
                              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>DT</span>
                            </div>
                            
                            {/* Sélecteur de quantité + Bouton Ajouter */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                display: 'flex', alignItems: 'center', background: '#f1f5f9',
                                borderRadius: '8px', padding: '3px', flexShrink: 0
                              }}>
                                <button onClick={() => handleQuantityChange(product._id, -1)} style={{
                                  width: '28px', height: '28px', border: 'none', background: 'white',
                                  color: '#c53030', borderRadius: '6px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}>-</button>
                                <span style={{ color: '#1e293b', fontWeight: '700', minWidth: '28px', textAlign: 'center', fontSize: '13px' }}>
                                  {quantities[product._id] || 1}
                                </span>
                                <button onClick={() => handleQuantityChange(product._id, 1)} style={{
                                  width: '28px', height: '28px', border: 'none', background: 'white',
                                  color: '#c53030', borderRadius: '6px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}>+</button>
                              </div>
                              <button onClick={() => handleAddToCart(product)} disabled={(product.stock ?? 0) === 0} style={{
                                flex: 1, border: 'none', background: (product.stock ?? 0) > 0 ? '#c53030' : '#cbd5e1',
                                color: 'white', borderRadius: '8px', padding: '10px', cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
                                fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                              }}>
                                <i className="fas fa-shopping-cart" style={{ fontSize: '10px' }}></i> Ajouter
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
        </div>
      )}

      {/* Nouveautés */}
      <div style={{ background: 'white', padding: '50px 0' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a202c', margin: 0 }}>
              Nos <span style={{ color: '#c53030' }}>Nouveautés</span>
            </h2>
            <Link href="/nouveautes" style={{
              display: 'flex', alignItems: 'center', gap: '8px', color: '#c53030',
              textDecoration: 'none', fontWeight: '600', fontSize: '14px',
              padding: '8px 16px', border: '2px solid #c53030', borderRadius: '8px'
            }}>
              Voir tout <i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#c53030' }} role="status"></div>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <button onClick={() => scrollNouveautes('left')} style={{
                position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)',
                width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className="fas fa-chevron-left" style={{ color: '#1a202c' }}></i>
              </button>
              <button onClick={() => scrollNouveautes('right')} style={{
                position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)',
                width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <i className="fas fa-chevron-right" style={{ color: '#1a202c' }}></i>
              </button>

              <div ref={nouveautesScrollRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 5px' }}>
                {nouveautesProducts.map((product) => {
                  const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
                  const isFav = favorites.includes(product._id);
                  return (
                    <div key={product._id} style={{
                      minWidth: '280px', maxWidth: '280px', background: 'white',
                      borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                      border: '1px solid #e2e8f0', flexShrink: 0
                    }}>
                      <div style={{ position: 'relative', background: '#f7fafc', height: '240px' }}>
                        <Link href={`/product/${product._id}`}>
                          <img src={product.image?.startsWith('http') ? product.image : product.image ? `${API_URL}${product.image}` : '/img/product-placeholder.jpg'}
                            alt={product.name} style={{ width: '100%', height: '240px', objectFit: 'contain', padding: '20px' }} />
                        </Link>
                        <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#c53030',
                          color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700',
                          display: 'flex', alignItems: 'center', gap: '5px'
                        }}><i className="fas fa-star" style={{ fontSize: '9px' }}></i> NOUVEAU</span>
                        {(product.discount ?? 0) > 0 && (
                          <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#1a365d',
                            color: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800'
                          }}>-{product.discount}%</span>
                        )}
                        {/* Bouton favoris */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (isFav) {
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
                            background: isFav ? '#fee2e2' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <i 
                            className={isFav ? 'fas fa-heart' : 'far fa-heart'} 
                            style={{ 
                              color: isFav ? '#dc2626' : '#64748b',
                              fontSize: '14px'
                            }}
                          ></i>
                        </button>
                      </div>
                      <div style={{ padding: '18px' }}>
                        <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                          <h6 style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px', height: '42px', overflow: 'hidden', marginBottom: '10px' }}>{product.name}</h6>
                        </Link>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px',
                          background: (product.stock ?? 0) > 0 ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '20px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: (product.stock ?? 0) > 0 ? '#22c55e' : '#ef4444' }}></span>
                          <span style={{ color: (product.stock ?? 0) > 0 ? '#16a34a' : '#dc2626', fontSize: '11px', fontWeight: '600' }}>
                            {(product.stock ?? 0) > 0 ? 'En stock' : 'Rupture'}
                          </span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>{product.brand?.name || '\u00A0'}</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                          {(product.discount ?? 0) > 0 && (
                            <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' }}>{product.price.toFixed(3)}</span>
                          )}
                          <span style={{ fontSize: '20px', fontWeight: '800', color: (product.discount ?? 0) > 0 ? '#16a34a' : '#c53030' }}>{finalPrice.toFixed(3)}</span>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>DT</span>
                        </div>
                        
                        {/* Sélecteur de quantité + Bouton Ajouter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            display: 'flex', alignItems: 'center', background: '#f1f5f9',
                            borderRadius: '8px', padding: '3px', flexShrink: 0
                          }}>
                            <button onClick={() => handleQuantityChange(product._id, -1)} style={{
                              width: '28px', height: '28px', border: 'none', background: 'white',
                              color: '#c53030', borderRadius: '6px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>-</button>
                            <span style={{ color: '#1e293b', fontWeight: '700', minWidth: '28px', textAlign: 'center', fontSize: '13px' }}>
                              {quantities[product._id] || 1}
                            </span>
                            <button onClick={() => handleQuantityChange(product._id, 1)} style={{
                              width: '28px', height: '28px', border: 'none', background: 'white',
                              color: '#c53030', borderRadius: '6px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>+</button>
                          </div>
                          <button onClick={() => handleAddToCart(product)} disabled={(product.stock ?? 0) === 0} style={{
                            flex: 1, border: 'none', background: (product.stock ?? 0) > 0 ? '#c53030' : '#cbd5e1',
                            color: 'white', borderRadius: '8px', padding: '10px', cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
                            fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                          }}>
                            <i className="fas fa-shopping-cart" style={{ fontSize: '10px' }}></i> Ajouter
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features / Engagements */}
      <div style={{ background: 'linear-gradient(180deg, #f7fafc 0%, #edf2f7 100%)', padding: '25px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(26, 54, 93, 0.1)',
              color: '#1a365d',
              padding: '8px 20px',
              borderRadius: '30px',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '15px'
            }}>
              Pourquoi Nous Choisir
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c' }}>
              Nos <span style={{ color: '#c53030' }}>Engagements</span>
            </h2>
          </div>
          <div className="row g-4 justify-content-center">
            {[
              { icon: 'fa-truck', title: 'Livraison Rapide', desc: 'Gratuite dès 200 DT', gradient: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)', shadow: 'rgba(26, 54, 93, 0.4)' },
              { icon: 'fa-shield-alt', title: 'Garantie Officielle', desc: 'Produits 100% garantis', gradient: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', shadow: 'rgba(197, 48, 48, 0.4)' },
              { icon: 'fa-credit-card', title: 'Paiement Sécurisé', desc: 'Transactions protégées', gradient: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)', shadow: 'rgba(26, 54, 93, 0.4)' },
              { icon: 'fa-headset', title: 'Support 24/7', desc: 'À votre écoute', gradient: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', shadow: 'rgba(197, 48, 48, 0.4)' }
            ].map((f, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="feature-card" style={{ 
                  background: 'white', 
                  borderRadius: '24px', 
                  padding: '40px 20px', 
                  textAlign: 'center',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.06)', 
                  border: '1px solid rgba(0,0,0,0.04)',
                  height: '100%'
                }}>
                  <div className="feature-icon" style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: f.gradient, 
                    borderRadius: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 25px',
                    boxShadow: `0 15px 35px ${f.shadow}`
                  }}>
                    <i className={`fas ${f.icon}`} style={{ fontSize: '32px', color: 'white' }}></i>
                  </div>
                  <h6 className="feature-title" style={{ fontWeight: '700', color: '#1a202c', marginBottom: '10px', fontSize: '17px' }}>{f.title}</h6>
                  <p className="feature-desc" style={{ color: '#718096', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles responsives pour mobile - Design Luxe */}
      <style jsx>{`
        /* Bannières Hero - Mobile */
        @media (max-width: 768px) {
          .homepage-banners {
            padding-top: 15px !important;
            padding-bottom: 10px !important;
          }
          
          .banner-iphone {
            min-height: 320px !important;
            padding: 25px !important;
            border-radius: 24px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
          }
          
          .banner-title,
          .banner-subtitle {
            font-size: 2.2rem !important;
            letter-spacing: -1px !important;
          }
          
          .banner-btn {
            padding: 12px 24px !important;
            font-size: 13px !important;
            box-shadow: 0 4px 16px rgba(197, 48, 48, 0.4) !important;
            transition: all 0.3s ease !important;
          }
          
          .banner-image {
            width: 55% !important;
            right: 15px !important;
          }
          
          .banner-headphone {
            height: 180px !important;
            padding: 22px !important;
            border-radius: 24px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
          }
          
          .banner-heading {
            font-size: 1.2rem !important;
            margin-bottom: 12px !important;
            letter-spacing: -0.5px !important;
          }
          
          .banner-label {
            font-size: 12px !important;
            letter-spacing: 1px !important;
          }
          
          .banner-btn-small {
            padding: 10px 18px !important;
            font-size: 12px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
          }
          
          .banner-image-small {
            width: 140px !important;
            height: 140px !important;
            right: 15px !important;
          }
          
          .banner-airpods,
          .banner-speaker {
            height: 180px !important;
            padding: 18px !important;
            border-radius: 24px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
          }
          
          .banner-small-title {
            font-size: 1rem !important;
            letter-spacing: -0.3px !important;
          }
          
          .banner-small-desc {
            font-size: 11px !important;
            margin-bottom: 12px !important;
          }
          
          .banner-btn-mini {
            padding: 8px 16px !important;
            font-size: 11px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          }
          
          .banner-image-mini {
            width: 110px !important;
            height: 110px !important;
            right: 8px !important;
            bottom: 12px !important;
          }
        }
        
        /* Features - Mobile Luxe */
        @media (max-width: 768px) {
          .feature-card {
            padding: 30px 18px !important;
            border-radius: 20px !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
            transition: all 0.3s ease !important;
          }
          
          .feature-card:active {
            transform: translateY(-4px) !important;
            box-shadow: 0 12px 32px rgba(0,0,0,0.12) !important;
          }
          
          .feature-icon {
            width: 64px !important;
            height: 64px !important;
            margin-bottom: 18px !important;
            border-radius: 18px !important;
          }
          
          .feature-icon i {
            font-size: 26px !important;
          }
          
          .feature-title {
            font-size: 15px !important;
            margin-bottom: 6px !important;
            font-weight: 700 !important;
            letter-spacing: -0.3px !important;
          }
          
          .feature-desc {
            font-size: 12px !important;
            line-height: 1.6 !important;
            opacity: 0.85 !important;
          }
        }
        
        /* Sections produits - Mobile */
        @media (max-width: 768px) {
          .homepage-banners + div,
          .homepage-banners ~ div {
            padding: 35px 0 !important;
          }
          
          h2 {
            font-size: 1.4rem !important;
            font-weight: 800 !important;
            letter-spacing: -0.5px !important;
          }
          
          /* Boutons découvrir - Style Premium */
          a[href*="/category"],
          a[href*="/shop"],
          a[href="/nouveautes"] {
            font-size: 12px !important;
            padding: 8px 16px !important;
            border-width: 2px !important;
            border-radius: 12px !important;
            font-weight: 700 !important;
            letter-spacing: 0.3px !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
          }
          
          /* Boutons de navigation carrousel - Premium */
          button[style*="position: absolute"] {
            width: 40px !important;
            height: 40px !important;
            left: -8px !important;
            border-radius: 50% !important;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
            backdrop-filter: blur(10px) !important;
            background: rgba(255,255,255,0.95) !important;
            transition: all 0.3s ease !important;
          }
          
          button[style*="position: absolute"]:active {
            transform: translateY(-50%) scale(0.95) !important;
          }
          
          button[style*="position: absolute"]:last-of-type {
            right: -8px !important;
            left: auto !important;
          }
        }
        
        /* Cartes produits - Design Luxe Mobile */
        @media (max-width: 768px) {
          /* Taille des cartes - Plus grandes et élégantes */
          div[style*="minWidth: '280px'"] {
            min-width: 260px !important;
            max-width: 260px !important;
            border-radius: 24px !important;
            box-shadow: 0 8px 28px rgba(0,0,0,0.1) !important;
            border: 1px solid rgba(0,0,0,0.06) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            overflow: hidden !important;
          }
          
          /* Effet hover/touch sur les cartes */
          div[style*="minWidth: '280px'"]:active {
            transform: translateY(-6px) !important;
            box-shadow: 0 16px 40px rgba(0,0,0,0.15) !important;
          }
          
          /* Image produit - Plus grande */
          div[style*="minWidth: '280px'"] img {
            height: 220px !important;
            padding: 18px !important;
            transition: transform 0.3s ease !important;
          }
          
          div[style*="minWidth: '280px'"]:active img {
            transform: scale(1.05) !important;
          }
          
          /* Contenu de la carte - Espacement amélioré */
          div[style*="minWidth: '280px'"] > div:last-child {
            padding: 18px !important;
          }
          
          /* Titre produit - Plus lisible */
          div[style*="minWidth: '280px'"] h6 {
            font-size: 14px !important;
            height: 42px !important;
            line-height: 1.5 !important;
            font-weight: 600 !important;
            letter-spacing: -0.2px !important;
          }
          
          /* Prix - Plus visible */
          div[style*="minWidth: '280px'"] span[style*="fontSize: '20px'"] {
            font-size: 20px !important;
            font-weight: 800 !important;
            letter-spacing: -0.5px !important;
          }
          
          /* Badge promo - Style premium */
          div[style*="minWidth: '280px'"] span[style*="position: absolute"][style*="top"] {
            border-radius: 10px !important;
            padding: 7px 12px !important;
            font-size: 12px !important;
            font-weight: 800 !important;
            letter-spacing: 0.5px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
          }
          
          /* Badge stock - Plus élégant */
          div[style*="minWidth: '280px'"] div[style*="display: inline-flex"] {
            padding: 5px 12px !important;
            border-radius: 20px !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            letter-spacing: 0.3px !important;
          }
          
          /* Boutons quantité - Design premium */
          div[style*="minWidth: '28px'"] {
            border-radius: 12px !important;
            padding: 4px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
          }
          
          div[style*="minWidth: '28px'"] button {
            width: 30px !important;
            height: 30px !important;
            font-size: 14px !important;
            border-radius: 8px !important;
            font-weight: 700 !important;
            transition: all 0.2s ease !important;
          }
          
          div[style*="minWidth: '28px'"] button:active {
            transform: scale(0.9) !important;
          }
          
          div[style*="minWidth: '28px'"] span {
            min-width: 30px !important;
            font-size: 13px !important;
            font-weight: 700 !important;
          }
          
          /* Bouton ajouter au panier - Premium */
          button[style*="flex: 1"] {
            padding: 10px !important;
            font-size: 11px !important;
            border-radius: 12px !important;
            font-weight: 700 !important;
            letter-spacing: 0.3px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            transition: all 0.3s ease !important;
          }
          
          button[style*="flex: 1"]:active {
            transform: scale(0.97) !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
          }
          
          /* Bouton favoris - Plus visible */
          button[style*="position: absolute"][style*="bottom: 12px"] {
            width: 40px !important;
            height: 40px !important;
            border-radius: 50% !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
            backdrop-filter: blur(10px) !important;
            transition: all 0.3s ease !important;
          }
          
          button[style*="position: absolute"][style*="bottom: 12px"]:active {
            transform: scale(1.1) !important;
          }
          
          button[style*="position: absolute"][style*="bottom: 12px"] i {
            font-size: 16px !important;
          }
        }
        
        /* Bannières latérales - Masquer sur mobile */
        @media (max-width: 991px) {
          .d-none.d-lg-block {
            display: none !important;
          }
        }
        
        /* Animations fluides */
        @media (max-width: 768px) {
          * {
            -webkit-tap-highlight-color: transparent !important;
          }
          
          button, a {
            touch-action: manipulation !important;
          }
        }
      `}</style>

    </>
  );
}
