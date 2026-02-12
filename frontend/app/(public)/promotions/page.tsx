'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { API_URL } from '../../../lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  image?: string;
  stock?: number;
  brand?: { _id: string; name: string };
  category?: { _id: string; name: string };
}

export default function PromotionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetch(`${API_URL}/api/brands`)
      .then(r => r.json())
      .then(data => setBrands(data));

    fetch(`${API_URL}/api/categories`)
      .then(r => r.json())
      .then(data => setCategories(data));

    fetch(`${API_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        const promoProducts = data.filter((p: Product) => (p.discount ?? 0) > 0);
        setProducts(promoProducts);
        setFilteredProducts(promoProducts);
        const initialQuantities: { [key: string]: number } = {};
        promoProducts.forEach((p: Product) => { initialQuantities[p._id] = 1; });
        setQuantities(initialQuantities);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    let result = [...products];
    if (selectedBrand) result = result.filter((p) => p.brand?._id === selectedBrand);
    if (selectedCategory) result = result.filter((p) => p.category?._id === selectedCategory);
    if (priceRange.min) {
      result = result.filter((p) => {
        const finalPrice = (p.discount ?? 0) > 0 ? p.price * (1 - (p.discount ?? 0) / 100) : p.price;
        return finalPrice >= parseFloat(priceRange.min);
      });
    }
    if (priceRange.max) {
      result = result.filter((p) => {
        const finalPrice = (p.discount ?? 0) > 0 ? p.price * (1 - (p.discount ?? 0) / 100) : p.price;
        return finalPrice <= parseFloat(priceRange.max);
      });
    }
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const priceA = (a.discount ?? 0) > 0 ? a.price * (1 - (a.discount ?? 0) / 100) : a.price;
        const priceB = (b.discount ?? 0) > 0 ? b.price * (1 - (b.discount ?? 0) / 100) : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const priceA = (a.discount ?? 0) > 0 ? a.price * (1 - (a.discount ?? 0) / 100) : a.price;
        const priceB = (b.discount ?? 0) > 0 ? b.price * (1 - (b.discount ?? 0) / 100) : b.price;
        return priceB - priceA;
      });
    } else if (sortBy === 'discount-desc') {
      result.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
    }
    setFilteredProducts(result);
  }, [products, selectedBrand, selectedCategory, priceRange, sortBy]);

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, (prev[productId] || 1) + delta) }));
  };

  const handleAddToCart = (product: Product) => {
    const finalPrice = (product.discount ?? 0) > 0 ? product.price * (1 - (product.discount ?? 0) / 100) : product.price;
    addToCart({
      _id: product._id,
      name: product.name,
      price: finalPrice,
      image: product.image || '/img/product-placeholder.jpg',
      quantity: quantities[product._id] || 1
    });
  };

  return (
    <div style={{ marginTop: '150px', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px' }}>
      <style jsx>{`
        @media (max-width: 991px) {
          .filters-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: ${showFilters ? '0' : '-100%'} !important;
            width: 85% !important;
            max-width: 320px !important;
            height: 100vh !important;
            z-index: 9999 !important;
            transition: left 0.3s ease !important;
            overflow-y: auto !important;
          }
          .filters-overlay {
            display: ${showFilters ? 'block' : 'none'};
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
          }
          .mobile-filter-btn {
            display: flex !important;
          }
          .hero-section {
            padding: 20px 0 !important;
          }
          .hero-title {
            font-size: 1.5rem !important;
          }
          .hero-icon {
            width: 40px !important;
            height: 40px !important;
          }
          .hero-icon i {
            font-size: 18px !important;
          }
          .product-card-img {
            height: 200px !important;
          }
          .product-card-img img {
            height: 200px !important;
            padding: 15px !important;
          }
          .product-card-content {
            padding: 15px !important;
          }
          .product-card-title {
            font-size: 14px !important;
            height: 40px !important;
            margin-bottom: 10px !important;
          }
          .product-card-price {
            font-size: 18px !important;
            margin-bottom: 12px !important;
          }
          .product-card-actions {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .product-card-quantity {
            width: 100% !important;
            justify-content: center !important;
          }
          .product-card-add-btn {
            width: 100% !important;
            padding: 12px 15px !important;
          }
        }
        @media (min-width: 992px) {
          .mobile-filter-btn {
            display: none !important;
          }
        }
      `}</style>

      {/* Overlay pour mobile */}
      <div className="filters-overlay" onClick={() => setShowFilters(false)}></div>

      {/* Hero Section */}
      <div className="hero-section" style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)',
        padding: '35px 0',
        marginBottom: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <nav aria-label="breadcrumb" style={{ marginBottom: '10px' }}>
            <ol className="breadcrumb" style={{ backgroundColor: 'transparent', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <li className="breadcrumb-item">
                <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-home" style={{ fontSize: '10px' }}></i> Accueil
                </Link>
              </li>
              <li style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>/</li>
              <li className="breadcrumb-item active" style={{ color: 'white', fontSize: '12px', fontWeight: '500' }}>Promotions</li>
            </ol>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <div className="hero-icon" style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-tags" style={{ color: 'white', fontSize: '22px' }}></i>
            </div>
            <div>
              <h1 className="hero-title" style={{ fontSize: '2rem', fontWeight: '800', color: 'white', margin: 0 }}>
                Promotions
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>
                Profitez de nos meilleures offres !
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <span style={{ 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontSize: '13px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fas fa-fire" style={{ fontSize: '12px' }}></i>
              {filteredProducts.length} article{filteredProducts.length > 1 ? 's' : ''} en promotion
            </span>
          </div>
        </div>
      </div>


      <div className="container">
        <div className="row g-4">
          {/* Filtres */}
          <div className="col-lg-3">
            <div className="filters-sidebar" style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              position: 'sticky',
              top: '180px'
            }}>
              {/* Bouton fermer pour mobile */}
              <div style={{ display: 'none' }} className="d-lg-none d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', margin: 0 }}>
                  <i className="fas fa-filter" style={{ color: '#dc2626' }}></i> Filtres
                </h5>
                <button 
                  onClick={() => setShowFilters(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '0',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <h5 className="d-none d-lg-flex" style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-filter" style={{ color: '#dc2626' }}></i> Filtres
              </h5>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Catégorie</label>
                <select 
                  style={{ width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer', color: '#1a202c' }}
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Marque</label>
                <select 
                  style={{ width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer', color: '#1a202c' }}
                  value={selectedBrand} 
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">Toutes les marques</option>
                  {brands.map((brand: any) => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prix (DT)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trier par</label>
                <select 
                  style={{ width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer', color: '#1a202c' }}
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Par défaut</option>
                  <option value="discount-desc">Réduction (+ élevée)</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>

              <button 
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onClick={() => {
                  setSelectedBrand('');
                  setSelectedCategory('');
                  setPriceRange({ min: '', max: '' });
                  setSortBy('');
                  setShowFilters(false);
                }}
              >
                <i className="fas fa-redo"></i> Réinitialiser
              </button>
            </div>
          </div>


          {/* Produits */}
          <div className="col-lg-9">
            {/* Bouton filtres mobile */}
            <button 
              className="mobile-filter-btn mb-3"
              onClick={() => setShowFilters(true)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
              }}
            >
              <i className="fas fa-filter"></i> Filtres et Tri
            </button>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                <span style={{ fontWeight: '700', color: '#1a202c' }}>{filteredProducts.length}</span> produit(s) en promotion
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div className="spinner-border" style={{ color: '#dc2626' }} role="status"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <i className="fas fa-tags" style={{ fontSize: '50px', color: '#cbd5e1', marginBottom: '20px' }}></i>
                <p style={{ fontSize: '18px', color: '#64748b', margin: 0 }}>Aucune promotion disponible avec ces filtres</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map((product) => {
                  const finalPrice = (product.discount ?? 0) > 0 ? product.price * (1 - (product.discount ?? 0) / 100) : product.price;
                  const isFavorite = favorites.includes(product._id);
                  return (
                    <div key={product._id} className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4">
                      <div style={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                        border: '1px solid #e2e8f0',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{ position: 'relative', backgroundColor: '#f7fafc' }} className="product-card-img">
                          <Link href={`/product/${product._id}`}>
                            <img 
                              src={product.image?.startsWith('http') ? product.image : product.image ? `${API_URL}${product.image}` : '/img/product-placeholder.jpg'}
                              alt={product.name}
                              style={{ width: '100%', height: '280px', objectFit: 'contain', padding: '20px' }}
                            />
                          </Link>
                          {product.brand?.name && (
                            <span style={{
                              position: 'absolute', top: '12px', left: '12px',
                              background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)',
                              color: 'white', padding: '6px 12px', borderRadius: '8px',
                              fontSize: '11px', fontWeight: '700',
                              boxShadow: '0 2px 8px rgba(26, 54, 93, 0.3)'
                            }}>
                              {product.brand.name}
                            </span>
                          )}
                          <span style={{
                            position: 'absolute', top: '12px', right: '12px',
                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            color: 'white', padding: '8px 12px', borderRadius: '8px',
                            fontSize: '14px', fontWeight: '800',
                            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                          }}>
                            -{product.discount}%
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (isFavorite) { removeFavorite(product._id); }
                              else { addFavorite(product._id); }
                            }}
                            style={{
                              position: 'absolute', bottom: '12px', right: '12px',
                              width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                              background: isFavorite ? '#fee2e2' : 'white', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                            }}
                          >
                            <i className={isFavorite ? 'fas fa-heart' : 'far fa-heart'} 
                              style={{ color: isFavorite ? '#dc2626' : '#64748b', fontSize: '16px' }}></i>
                          </button>
                        </div>
                        <div className="product-card-content" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                            <h6 className="product-card-title" style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px', lineHeight: '1.5', height: '45px', overflow: 'hidden', marginBottom: '12px' }}>
                              {product.name}
                            </h6>
                          </Link>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px',
                            background: (product.stock ?? 0) > 0 ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '20px', width: 'fit-content' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: (product.stock ?? 0) > 0 ? '#22c55e' : '#ef4444' }}></span>
                            <span style={{ color: (product.stock ?? 0) > 0 ? '#16a34a' : '#dc2626', fontSize: '11px', fontWeight: '600' }}>
                              {(product.stock ?? 0) > 0 ? 'En stock' : 'Rupture'}
                            </span>
                          </div>
                          <div className="product-card-price" style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px', marginTop: 'auto' }}>
                            <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' }}>{product.price.toFixed(3)}</span>
                            <span style={{ fontSize: '22px', fontWeight: '800', color: '#16a34a' }}>{finalPrice.toFixed(3)}</span>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>DT</span>
                          </div>
                          <div className="product-card-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="product-card-quantity" style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '3px', flexShrink: 0 }}>
                              <button onClick={() => handleQuantityChange(product._id, -1)} style={{
                                width: '28px', height: '28px', border: 'none', background: 'white', color: '#dc2626',
                                borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}>-</button>
                              <span style={{ color: '#1e293b', fontWeight: '700', minWidth: '28px', textAlign: 'center', fontSize: '14px' }}>{quantities[product._id] || 1}</span>
                              <button onClick={() => handleQuantityChange(product._id, 1)} style={{
                                width: '28px', height: '28px', border: 'none', background: 'white', color: '#dc2626',
                                borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}>+</button>
                            </div>
                            <button className="product-card-add-btn" onClick={() => handleAddToCart(product)} disabled={(product.stock ?? 0) === 0} style={{
                              flex: 1, border: 'none',
                              background: (product.stock ?? 0) > 0 ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : '#cbd5e1',
                              color: 'white', borderRadius: '10px', padding: '10px 15px',
                              cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
                              fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                              boxShadow: (product.stock ?? 0) > 0 ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none'
                            }}>
                              <i className="fas fa-shopping-cart"></i> Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
