'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';

export default function SubcategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategory, setSubcategory] = useState<any>(null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showDiscountOnly, setShowDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:5000/api/subcategories/${params.id}`)
      .then(r => r.json())
      .then(data => setSubcategory(data));

    fetch('http://localhost:5000/api/brands')
      .then(r => r.json())
      .then(data => setBrands(data));

    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => {
        console.log('Tous les produits:', data);
        console.log('ID recherché:', params.id);
        const filtered = data.filter((p: any) => {
          console.log('Produit:', p.name, 'Subcategories:', p.subcategories);
          return p.subcategories?.some((sub: any) => sub._id === params.id);
        });
        console.log('Produits filtrés:', filtered);
        setProducts(filtered);
        setFilteredProducts(filtered);
        setLoading(false);
      });
  }, [params.id]);

  useEffect(() => {
    let result = [...products];

    if (selectedBrand) {
      result = result.filter((p: any) => p.brand?._id === selectedBrand);
    }

    if (showDiscountOnly) {
      result = result.filter((p: any) => p.discount > 0);
    }

    if (priceRange.min) {
      result = result.filter((p: any) => {
        const finalPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
        return finalPrice >= parseFloat(priceRange.min);
      });
    }

    if (priceRange.max) {
      result = result.filter((p: any) => {
        const finalPrice = p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;
        return finalPrice <= parseFloat(priceRange.max);
      });
    }

    if (sortBy === 'price-asc') {
      result.sort((a: any, b: any) => {
        const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a: any, b: any) => {
        const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
        const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
        return priceB - priceA;
      });
    }

    setFilteredProducts(result);
  }, [products, selectedBrand, priceRange, showDiscountOnly, sortBy]);

  return (
    <div style={{marginTop: '160px', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px'}}>
      <div className="container py-5">
        <nav aria-label="breadcrumb" style={{marginBottom: '30px'}}>
          <ol className="breadcrumb" style={{backgroundColor: 'transparent', padding: 0}}>
            <li className="breadcrumb-item"><Link href="/" style={{color: '#81C784', textDecoration: 'none'}}>Accueil</Link></li>
            <li className="breadcrumb-item active" style={{color: '#333'}}>{subcategory?.name}</li>
          </ol>
        </nav>

        <div style={{backgroundColor: 'white', borderRadius: '20px', padding: '40px', marginBottom: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)'}}>
          <h1 style={{fontSize: '36px', fontWeight: '700', color: '#1a1a1a', marginBottom: '10px'}}>{subcategory?.name}</h1>
          <p style={{color: '#81C784', fontSize: '15px', fontWeight: '600', margin: 0}}>Catégorie: {subcategory?.category?.name}</p>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', position: 'sticky', top: '180px'}}>
              <h5 style={{fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '25px'}}>Filtres</h5>
              
              <div style={{marginBottom: '25px'}}>
                <label style={{fontSize: '14px', fontWeight: '600', color: '#555', marginBottom: '10px', display: 'block'}}>Marque</label>
                <select 
                  style={{width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', outline: 'none', cursor: 'pointer'}}
                  value={selectedBrand} 
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">Toutes les marques</option>
                  {brands.map((brand: any) => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div style={{marginBottom: '25px'}}>
                <label style={{fontSize: '14px', fontWeight: '600', color: '#555', marginBottom: '10px', display: 'block'}}>Prix (TND)</label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                    style={{width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'}}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                    style={{width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box'}}
                  />
                </div>
              </div>

              <div style={{marginBottom: '25px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                  <input 
                    type="checkbox" 
                    checked={showDiscountOnly}
                    onChange={(e) => setShowDiscountOnly(e.target.checked)}
                    style={{width: '18px', height: '18px', cursor: 'pointer'}}
                  />
                  <span style={{fontSize: '14px', color: '#555'}}>Produits en promotion uniquement</span>
                </label>
              </div>

              <div style={{marginBottom: '25px'}}>
                <label style={{fontSize: '14px', fontWeight: '600', color: '#555', marginBottom: '10px', display: 'block'}}>Trier par</label>
                <select 
                  style={{width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', fontSize: '14px', outline: 'none', cursor: 'pointer'}}
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Par défaut</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                </select>
              </div>

              <button 
                style={{width: '100%', padding: '12px', backgroundColor: '#f5f5f5', color: '#555', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s'}}
                onClick={() => {
                  setSelectedBrand('');
                  setPriceRange({ min: '', max: '' });
                  setShowDiscountOnly(false);
                  setSortBy('');
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              >
                Réinitialiser
              </button>
            </div>
          </div>

          <div className="col-lg-9">
            {loading ? (
              <div style={{textAlign: 'center', padding: '100px 0'}}>
                <div className="spinner-grow text-primary" role="status"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: '0 5px 20px rgba(0,0,0,0.05)'}}>
                <p style={{fontSize: '18px', color: '#999', margin: 0}}>Aucun produit disponible avec ces filtres</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map((product: any) => {
                  const finalPrice = product.discount > 0 ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price;
                  return (
                    <div key={product._id} className="col-md-6 col-xl-4">
                      <div 
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
                        }}
                      >
                        <Link href={`/product/${product._id}`} style={{textDecoration: 'none'}}>
                          <div style={{position: 'relative', backgroundColor: '#fafafa', padding: '20px'}}>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              style={{width: '100%', height: '220px', objectFit: 'contain', borderRadius: '8px'}}
                            />
                            {product.brand?.name && (
                              <div style={{position: 'absolute', top: '15px', left: '15px', backgroundColor: '#81C784', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'}}>
                                {product.brand.name}
                              </div>
                            )}
                            {product.discount > 0 && (
                              <div style={{position: 'absolute', top: '15px', right: '15px', backgroundColor: '#dc3545', color: 'white', padding: '8px 16px', borderRadius: '25px', fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 10px rgba(220,53,69,0.3)'}}>
                                -{product.discount}%
                              </div>
                            )}
                          </div>
                        </Link>
                        <div style={{padding: '20px', flex: 1, display: 'flex', flexDirection: 'column'}}>
                          <Link href={`/product/${product._id}`} style={{textDecoration: 'none'}}>
                            <h4 style={{fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px', height: '48px', overflow: 'hidden', lineHeight: '1.5'}}>{product.name}</h4>
                            <p style={{fontSize: '13px', color: '#999', marginBottom: '15px', height: '20px', overflow: 'hidden'}}>{product.description}</p>
                          </Link>
                          <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div>
                              {product.discount > 0 ? (
                                <>
                                  <div style={{fontSize: '13px', color: '#999', textDecoration: 'line-through', marginBottom: '4px'}}>{product.price} TND</div>
                                  <div style={{fontSize: '20px', fontWeight: '700', color: '#81C784'}}>{finalPrice} TND</div>
                                </>
                              ) : (
                                <div style={{fontSize: '20px', fontWeight: '700', color: '#1a1a1a'}}>{product.price} TND</div>
                              )}
                            </div>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                              }}
                              style={{
                                backgroundColor: '#81C784',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px 18px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6fb070'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#81C784'}
                            >
                              <i className="fa fa-shopping-bag"></i> Ajouter
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
