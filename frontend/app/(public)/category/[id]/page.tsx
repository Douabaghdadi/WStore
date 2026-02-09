'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { API_URL } from '../../../../lib/api';

interface Subcategory {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface CategoryRef {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  image?: string;
  stock?: number;
  brand?: Brand;
  category?: CategoryRef;
  subcategories?: Subcategory[];
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedSubcategory('');
    setPriceRange({ min: '', max: '' });
    setShowDiscountOnly(false);
    setSortBy('');
  };

  useEffect(() => {
    fetch(`${API_URL}/api/categories/${params.id}`)
      .then(r => r.json())
      .then(data => setCategory(data));

    fetch(`${API_URL}/api/brands`)
      .then(r => r.json())
      .then(data => setBrands(data));

    fetch(`${API_URL}/api/subcategories`)
      .then(r => r.json())
      .then(data => {
        const filtered = data.filter((sub: Subcategory & { category?: CategoryRef }) => sub.category?._id === params.id);
        setSubcategories(filtered);
      });

    fetch(`${API_URL}/api/products`)
      .then(r => r.json())
      .then(data => {
        const filtered = data.filter((p: Product) => p.category?._id === params.id);
        setProducts(filtered);
        setFilteredProducts(filtered);
        const initialQuantities: { [key: string]: number } = {};
        filtered.forEach((p: Product) => { initialQuantities[p._id] = 1; });
        setQuantities(initialQuantities);
        setLoading(false);
      });
  }, [params.id]);


  useEffect(() => {
    let result = [...products];
    if (selectedBrand) result = result.filter((p) => p.brand?._id === selectedBrand);
    if (selectedSubcategory) result = result.filter((p) => p.subcategories?.some((sub) => sub._id === selectedSubcategory));
    if (showDiscountOnly) result = result.filter((p) => (p.discount ?? 0) > 0);
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
    }
    setFilteredProducts(result);
  }, [products, selectedBrand, selectedSubcategory, priceRange, showDiscountOnly, sortBy]);

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
    <div style={{ marginTop: '130px', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1b2a 0%, #1a365d 50%, #2d4a7c 100%)',
        padding: '25px 0',
        marginBottom: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '50%'
        }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <nav aria-label="breadcrumb" style={{ marginBottom: '10px' }}>
            <ol className="breadcrumb" style={{ backgroundColor: 'transparent', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <li className="breadcrumb-item">
                <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-home" style={{ fontSize: '10px' }}></i> Accueil
                </Link>
              </li>
              <li style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>/</li>
              <li className="breadcrumb-item active" style={{ color: 'white', fontSize: '12px', fontWeight: '500' }}>{category?.name}</li>
            </ol>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 15px rgba(197, 48, 48, 0.3)'
            }}>
              <i className="fas fa-folder" style={{ color: 'white', fontSize: '16px' }}></i>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', margin: 0 }}>
              {category?.name}
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <span style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <i className="fas fa-box" style={{ fontSize: '10px' }}></i>
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </span>
            {subcategories.length > 0 && (
              <span style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <i className="fas fa-layer-group" style={{ fontSize: '10px' }}></i>
                {subcategories.length} sous-catégorie{subcategories.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>


      <div className="container">
        {/* Mobile Filter Button */}
        <div className="d-lg-none" style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            style={{
              width: '100%',
              padding: '14px 20px',
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a202c',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-sliders-h" style={{ color: '#c53030' }}></i>
              Filtres et tri
              {(selectedBrand || selectedSubcategory || showDiscountOnly || priceRange.min || priceRange.max) && (
                <span style={{ background: '#c53030', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>!</span>
              )}
            </span>
            <i className={`fas fa-chevron-${showMobileFilters ? 'up' : 'down'}`} style={{ color: '#64748b' }}></i>
          </button>
          
          {showMobileFilters && (
            <div style={{ marginTop: '15px', backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              {subcategories.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <select style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)}>
                    <option value="">Toutes les sous-catégories</option>
                    {subcategories.map((sub: any) => (<option key={sub._id} value={sub._id}>{sub.name}</option>))}
                  </select>
                </div>
              )}
              
              <div style={{ marginBottom: '15px' }}>
                <select style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                  <option value="">Toutes les marques</option>
                  {brands.map((brand: any) => (<option key={brand._id} value={brand._id}>{brand.name}</option>))}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                <input type="number" placeholder="Prix min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                <input type="number" placeholder="Prix max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
              </div>
              
              <select style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', marginBottom: '15px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Trier par</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '12px', background: showDiscountOnly ? '#fee2e2' : '#f8f9fa', borderRadius: '10px', fontSize: '14px', fontWeight: '500', marginBottom: '15px' }}>
                <input type="checkbox" checked={showDiscountOnly} onChange={(e) => setShowDiscountOnly(e.target.checked)} style={{ accentColor: '#c53030' }} />
                <i className="fas fa-tag" style={{ color: '#c53030' }}></i> Promotions uniquement
              </label>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={resetFilters} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  <i className="fas fa-redo me-2"></i>Réinitialiser
                </button>
                <button onClick={() => setShowMobileFilters(false)} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                  Voir {filteredProducts.length} résultats
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="row g-4">
          {/* Filtres - Hidden on mobile */}
          <div className="col-lg-3 d-none d-lg-block">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              position: 'sticky',
              top: '180px'
            }}>
              <h5 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-filter" style={{ color: '#c53030' }}></i> Filtres
              </h5>

              {subcategories.length > 0 && (
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sous-catégorie</label>
                  <select 
                    style={{ width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer', color: '#1a202c' }}
                    value={selectedSubcategory} 
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                  >
                    <option value="">Toutes les sous-catégories</option>
                    {subcategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Marque</label>
                <select 
                  style={{ width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer', color: '#1a202c' }}
                  value={selectedBrand} 
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">Toutes les marques</option>
                  {brands.map((brand) => (
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: showDiscountOnly ? '#fee2e2' : '#f8f9fa', borderRadius: '12px', transition: 'all 0.3s' }}>
                  <input 
                    type="checkbox" 
                    checked={showDiscountOnly}
                    onChange={(e) => setShowDiscountOnly(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#c53030' }}
                  />
                  <span style={{ fontSize: '14px', color: showDiscountOnly ? '#c53030' : '#64748b', fontWeight: '600' }}>
                    <i className="fas fa-tag me-2"></i>Promotions uniquement
                  </span>
                </label>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trier par</label>
                <select 
                  style={{ width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer', color: '#1a202c' }}
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Par défaut</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>

              <button 
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)',
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
                onClick={resetFilters}
              >
                <i className="fas fa-redo"></i> Réinitialiser
              </button>
            </div>
          </div>


          {/* Produits */}
          <div className="col-12 col-lg-9">
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                <span style={{ fontWeight: '700', color: '#1a202c' }}>{filteredProducts.length}</span> produit(s) trouvé(s)
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div className="spinner-border" style={{ color: '#c53030' }} role="status"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <i className="fas fa-box-open" style={{ fontSize: '50px', color: '#cbd5e1', marginBottom: '20px' }}></i>
                <p style={{ fontSize: '18px', color: '#64748b', margin: 0 }}>Aucun produit disponible avec ces filtres</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map((product) => {
                  const finalPrice = (product.discount ?? 0) > 0 ? product.price * (1 - (product.discount ?? 0) / 100) : product.price;
                  const isFavorite = favorites.includes(product._id);
                  return (
                    <div key={product._id} className="col-6 col-md-6 col-xl-4">
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
                        <div style={{ position: 'relative', backgroundColor: '#f7fafc', height: '280px' }}>
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
                          {(product.discount ?? 0) > 0 && (
                            <span style={{
                              position: 'absolute', top: '12px', right: '12px',
                              background: 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)',
                              color: 'white', padding: '6px 10px', borderRadius: '8px',
                              fontSize: '12px', fontWeight: '800',
                              boxShadow: '0 2px 8px rgba(197, 48, 48, 0.3)'
                            }}>
                              -{product.discount}%
                            </span>
                          )}
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
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                            <h6 style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px', lineHeight: '1.5', height: '45px', overflow: 'hidden', marginBottom: '12px' }}>
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
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px', marginTop: 'auto' }}>
                            {(product.discount ?? 0) > 0 && (
                              <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' }}>{product.price.toFixed(3)}</span>
                            )}
                            <span style={{ fontSize: '20px', fontWeight: '800', color: (product.discount ?? 0) > 0 ? '#16a34a' : '#c53030' }}>{finalPrice.toFixed(3)}</span>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>DT</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '3px', flexShrink: 0 }}>
                              <button onClick={() => handleQuantityChange(product._id, -1)} style={{
                                width: '28px', height: '28px', border: 'none', background: 'white', color: '#c53030',
                                borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}>-</button>
                              <span style={{ color: '#1e293b', fontWeight: '700', minWidth: '28px', textAlign: 'center', fontSize: '14px' }}>{quantities[product._id] || 1}</span>
                              <button onClick={() => handleQuantityChange(product._id, 1)} style={{
                                width: '28px', height: '28px', border: 'none', background: 'white', color: '#c53030',
                                borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}>+</button>
                            </div>
                            <button onClick={() => handleAddToCart(product)} disabled={(product.stock ?? 0) === 0} style={{
                              flex: 1, border: 'none',
                              background: (product.stock ?? 0) > 0 ? 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)' : '#cbd5e1',
                              color: 'white', borderRadius: '10px', padding: '10px 15px',
                              cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
                              fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                              boxShadow: (product.stock ?? 0) > 0 ? '0 4px 12px rgba(197, 48, 48, 0.3)' : 'none'
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
