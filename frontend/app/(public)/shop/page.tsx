'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  image?: string;
  stock?: number;
  brand?: { _id: string; name: string };
  category?: { _id: string; name: string };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetch('http://localhost:5000/api/brands').then(r => r.json()).then(setBrands);
    fetch('http://localhost:5000/api/categories').then(r => r.json()).then(setCategories);

    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        const init: { [key: string]: number } = {};
        data.forEach((p: Product) => { init[p._id] = 1; });
        setQuantities(init);
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    let result = [...products];
    if (selectedBrand) result = result.filter((p) => p.brand?._id === selectedBrand);
    if (selectedCategory) result = result.filter((p) => p.category?._id === selectedCategory);
    if (showDiscountOnly) result = result.filter((p) => (p.discount ?? 0) > 0);
    if (showInStockOnly) result = result.filter((p) => (p.stock ?? 0) > 0);
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
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b._id.localeCompare(a._id));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredProducts(result);
  }, [products, selectedBrand, selectedCategory, priceRange, showDiscountOnly, showInStockOnly, sortBy]);

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

  const resetFilters = () => {
    setSelectedBrand('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setShowDiscountOnly(false);
    setShowInStockOnly(false);
    setSortBy('');
  };

  return (
    <div style={{ marginTop: '130px', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 50%, #3c5a99 100%)',
        padding: '35px 0',
        marginBottom: '30px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-30px', left: '10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <nav aria-label="breadcrumb" style={{ marginBottom: '10px' }}>
            <ol className="breadcrumb" style={{ backgroundColor: 'transparent', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <li className="breadcrumb-item">
                <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fas fa-home" style={{ fontSize: '10px' }}></i> Accueil
                </Link>
              </li>
              <li style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>/</li>
              <li className="breadcrumb-item active" style={{ color: 'white', fontSize: '12px', fontWeight: '500' }}>Boutique</li>
            </ol>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-store" style={{ color: 'white', fontSize: '22px' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', margin: 0 }}>
                Notre Boutique
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>
                Découvrez tous nos produits
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-box" style={{ fontSize: '12px' }}></i>
              {products.length} articles disponibles
            </span>
            <span style={{ background: 'rgba(197, 48, 48, 0.3)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="fas fa-tags" style={{ fontSize: '12px' }}></i>
              {products.filter(p => (p.discount ?? 0) > 0).length} en promotion
            </span>
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
              {(selectedBrand || selectedCategory || showDiscountOnly || showInStockOnly || priceRange.min || priceRange.max) && (
                <span style={{ background: '#c53030', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>!</span>
              )}
            </span>
            <i className={`fas fa-chevron-${showMobileFilters ? 'up' : 'down'}`} style={{ color: '#64748b' }}></i>
          </button>
          
          {/* Mobile Filters Panel */}
          {showMobileFilters && (
            <div style={{ marginTop: '15px', backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                <select style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">Catégorie</option>
                  {categories.map((cat: any) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                </select>
                <select style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                  <option value="">Marque</option>
                  {brands.map((brand: any) => (<option key={brand._id} value={brand._id}>{brand.name}</option>))}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                <input type="number" placeholder="Prix min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                <input type="number" placeholder="Prix max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
              </div>
              
              <select style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', marginBottom: '15px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Trier par</option>
                <option value="newest">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name-asc">Nom (A-Z)</option>
              </select>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px', background: showDiscountOnly ? '#fee2e2' : '#f8f9fa', borderRadius: '10px', fontSize: '13px', fontWeight: '500' }}>
                  <input type="checkbox" checked={showDiscountOnly} onChange={(e) => setShowDiscountOnly(e.target.checked)} style={{ accentColor: '#c53030' }} />
                  <i className="fas fa-tag" style={{ color: '#c53030' }}></i> Promos
                </label>
                <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px', background: showInStockOnly ? '#dcfce7' : '#f8f9fa', borderRadius: '10px', fontSize: '13px', fontWeight: '500' }}>
                  <input type="checkbox" checked={showInStockOnly} onChange={(e) => setShowInStockOnly(e.target.checked)} style={{ accentColor: '#16a34a' }} />
                  <i className="fas fa-check" style={{ color: '#16a34a' }}></i> En stock
                </label>
              </div>
              
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
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', position: 'sticky', top: '180px' }}>
              <h5 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-filter" style={{ color: '#c53030' }}></i> Filtres
              </h5>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Catégorie</label>
                <select style={{ width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer', color: '#1a202c' }} value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">Toutes les catégories</option>
                  {categories.map((cat: any) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
                </select>
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Marque</label>
                <select style={{ width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer', color: '#1a202c' }} value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                  <option value="">Toutes les marques</option>
                  {brands.map((brand: any) => (<option key={brand._id} value={brand._id}>{brand.name}</option>))}
                </select>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prix (DT)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }} />
                  <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: showDiscountOnly ? '#fee2e2' : '#f8f9fa', borderRadius: '12px', transition: 'all 0.3s' }}>
                  <input type="checkbox" checked={showDiscountOnly} onChange={(e) => setShowDiscountOnly(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#c53030' }} />
                  <span style={{ fontSize: '14px', color: showDiscountOnly ? '#c53030' : '#64748b', fontWeight: '600' }}>
                    <i className="fas fa-tag me-2"></i>Promotions uniquement
                  </span>
                </label>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '12px', background: showInStockOnly ? '#dcfce7' : '#f8f9fa', borderRadius: '12px', transition: 'all 0.3s' }}>
                  <input type="checkbox" checked={showInStockOnly} onChange={(e) => setShowInStockOnly(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#16a34a' }} />
                  <span style={{ fontSize: '14px', color: showInStockOnly ? '#16a34a' : '#64748b', fontWeight: '600' }}>
                    <i className="fas fa-check-circle me-2"></i>En stock uniquement
                  </span>
                </label>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trier par</label>
                <select style={{ width: '100%', padding: '12px 15px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', outline: 'none', cursor: 'pointer', color: '#1a202c' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="">Par défaut</option>
                  <option value="newest">Plus récents</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="name-asc">Nom (A-Z)</option>
                </select>
              </div>

              <button onClick={resetFilters} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <i className="fas fa-redo"></i> Réinitialiser
              </button>
            </div>
          </div>


          {/* Produits */}
          <div className="col-12 col-lg-9">
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                <span style={{ fontWeight: '700', color: '#1a202c' }}>{filteredProducts.length}</span> produit(s) trouvé(s)
              </p>
              {(selectedBrand || selectedCategory || showDiscountOnly || showInStockOnly || priceRange.min || priceRange.max) && (
                <button onClick={resetFilters} style={{ background: '#fee2e2', color: '#c53030', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fas fa-times"></i> Effacer les filtres
                </button>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div className="spinner-border" style={{ color: '#c53030' }} role="status"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '60px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <i className="fas fa-box-open" style={{ fontSize: '50px', color: '#cbd5e1', marginBottom: '20px' }}></i>
                <h3 style={{ color: '#1a202c', marginBottom: '10px' }}>Aucun produit trouvé</h3>
                <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '20px' }}>Essayez de modifier vos filtres</p>
                <button onClick={resetFilters} style={{ padding: '12px 24px', background: '#c53030', color: 'white', borderRadius: '10px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map((product) => {
                  const finalPrice = (product.discount ?? 0) > 0 ? product.price * (1 - (product.discount ?? 0) / 100) : product.price;
                  const isFavorite = favorites.includes(product._id);
                  return (
                    <div key={product._id} className="col-6 col-md-6 col-xl-4">
                      <div style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}>
                        <div style={{ position: 'relative', backgroundColor: '#f7fafc', height: '280px' }}>
                          <Link href={`/product/${product._id}`}>
                            <img src={product.image?.startsWith('http') ? product.image : product.image ? `http://localhost:5000${product.image}` : '/img/product-placeholder.jpg'} alt={product.name} style={{ width: '100%', height: '280px', objectFit: 'contain', padding: '20px' }} />
                          </Link>
                          {product.brand?.name && (
                            <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', boxShadow: '0 2px 8px rgba(26, 54, 93, 0.3)' }}>{product.brand.name}</span>
                          )}
                          {(product.discount ?? 0) > 0 && (
                            <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)', color: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)' }}>-{product.discount}%</span>
                          )}
                          <button onClick={(e) => { e.preventDefault(); isFavorite ? removeFavorite(product._id) : addFavorite(product._id); }} style={{ position: 'absolute', bottom: '12px', right: '12px', width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: isFavorite ? '#fee2e2' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            <i className={isFavorite ? 'fas fa-heart' : 'far fa-heart'} style={{ color: isFavorite ? '#dc2626' : '#64748b', fontSize: '16px' }}></i>
                          </button>
                        </div>
                        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                            <h6 style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px', lineHeight: '1.5', height: '45px', overflow: 'hidden', marginBottom: '12px' }}>{product.name}</h6>
                          </Link>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px', background: (product.stock ?? 0) > 0 ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '20px', width: 'fit-content' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: (product.stock ?? 0) > 0 ? '#22c55e' : '#ef4444' }}></span>
                            <span style={{ color: (product.stock ?? 0) > 0 ? '#16a34a' : '#dc2626', fontSize: '11px', fontWeight: '600' }}>{(product.stock ?? 0) > 0 ? 'En stock' : 'Rupture'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px', marginTop: 'auto' }}>
                            {(product.discount ?? 0) > 0 && (<span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' }}>{product.price.toFixed(3)}</span>)}
                            <span style={{ fontSize: '20px', fontWeight: '800', color: (product.discount ?? 0) > 0 ? '#16a34a' : '#c53030' }}>{finalPrice.toFixed(3)}</span>
                            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>DT</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '3px', flexShrink: 0 }}>
                              <button onClick={() => handleQuantityChange(product._id, -1)} style={{ width: '28px', height: '28px', border: 'none', background: 'white', color: '#c53030', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>-</button>
                              <span style={{ color: '#1e293b', fontWeight: '700', minWidth: '28px', textAlign: 'center', fontSize: '14px' }}>{quantities[product._id] || 1}</span>
                              <button onClick={() => handleQuantityChange(product._id, 1)} style={{ width: '28px', height: '28px', border: 'none', background: 'white', color: '#c53030', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>+</button>
                            </div>
                            <button onClick={() => handleAddToCart(product)} disabled={(product.stock ?? 0) === 0} style={{ flex: 1, border: 'none', background: (product.stock ?? 0) > 0 ? 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)' : '#cbd5e1', color: 'white', borderRadius: '10px', padding: '10px 15px', cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: (product.stock ?? 0) > 0 ? '0 4px 12px rgba(197, 48, 48, 0.3)' : 'none' }}>
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
