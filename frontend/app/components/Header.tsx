'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { getCartCount } = useCart();
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'undefined') {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser) {
        fetchPendingOrders();
      }
    }
    
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Erreur chargement catégories:', err));

    fetch('http://localhost:5000/api/subcategories')
      .then(res => res.json())
      .then(data => setSubcategories(data))
      .catch(err => console.error('Erreur chargement sous-catégories:', err));

    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(err => console.error('Erreur chargement produits:', err));

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown')) {
        setShowUserMenu(false);
      }
      if (!target.closest('.search-container')) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const orders = await response.json();
        const pending = orders.filter((o: any) => 
          o.status === 'pending' || o.status === 'confirmed' || o.status === 'shipped'
        ).length;
        setPendingOrdersCount(pending);
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPendingOrdersCount(0);
    router.push('/login');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      const filtered = allProducts.filter((product: any) =>
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.brand?.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="container-fluid fixed-top" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      padding: 0,
      boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
    }}>
      {/* Top Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #c53030 0%, #e53e3e 100%)',
        padding: '8px 0',
        fontSize: '13px'
      }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-4">
              <span style={{color: 'rgba(255,255,255,0.95)'}}>
                <i className="fas fa-phone-alt me-2"></i>+216 52 255 145 / 48 018 250
              </span>
              <span style={{color: 'rgba(255,255,255,0.95)'}}>
                <i className="fas fa-truck me-2"></i>Livraison sur toute la Tunisie
              </span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <a href="https://www.facebook.com/profile.php?id=100090708515530" target="_blank" rel="noopener noreferrer" style={{color: 'rgba(255,255,255,0.95)', textDecoration: 'none', transition: 'all 0.3s'}}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/w.store_tn/" target="_blank" rel="noopener noreferrer" style={{color: 'rgba(255,255,255,0.95)', textDecoration: 'none', transition: 'all 0.3s'}}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://wa.me/21652255145" target="_blank" rel="noopener noreferrer" style={{color: 'rgba(255,255,255,0.95)', textDecoration: 'none', transition: 'all 0.3s'}}>
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container px-0">
        <nav className="navbar navbar-expand-xl" style={{height: '85px', background: 'transparent'}}>
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <Image 
              src="/img/logo.png" 
              alt="W.Store - Informatique, Smartphone & Accessoires" 
              width={200}
              height={60}
              style={{
                objectFit: 'contain',
                maxHeight: '60px',
                width: 'auto'
              }}
              priority
            />
          </Link>
          
          <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" style={{
            border: '2px solid rgba(26,26,26,0.2)',
            borderRadius: '8px'
          }}>
            <span className="fa fa-bars" style={{color: '#1a1a1a'}}></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav mx-auto">
              <Link href="/" className="nav-item nav-link" style={{
                color: '#1a1a1a',
                fontWeight: '600',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Accueil</Link>
              <Link href="/shop" className="nav-item nav-link" style={{
                color: '#4a4a4a',
                fontWeight: '600',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Boutique</Link>
              <div className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown" style={{
                  color: '#4a4a4a',
                  fontWeight: '600',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Nos Magasins</a>
                <div className="dropdown-menu m-0" style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  padding: '10px 0'
                }}>
                  <Link href="/magasins#korba" className="dropdown-item" style={{padding: '10px 20px'}}>
                    <i className="fas fa-store me-2" style={{color: '#c53030'}}></i>Korba - Cité Commerciale
                  </Link>
                  <Link href="/magasins#dar-chaabene" className="dropdown-item" style={{padding: '10px 20px'}}>
                    <i className="fas fa-store me-2" style={{color: '#c53030'}}></i>Dar Chaâbene El Fehri
                  </Link>
                  <div style={{borderTop: '1px solid #e2e8f0', margin: '8px 0'}}></div>
                  <Link href="/magasins" className="dropdown-item" style={{padding: '10px 20px'}}>
                    <i className="fas fa-map-marked-alt me-2" style={{color: '#c53030'}}></i>Voir tous les magasins
                  </Link>
                </div>
              </div>
              <Link href="/contact" className="nav-item nav-link" style={{
                color: '#4a4a4a',
                fontWeight: '600',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Contact</Link>
            </div>
            
            <div className="d-flex align-items-center gap-3">
              {/* Search */}
              <div className="search-container" style={{ position: 'relative' }}>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    border: '2px solid rgba(26,26,26,0.1)',
                    padding: '0 12px',
                    transition: 'all 0.3s'
                  }}>
                    <i className="fas fa-search" style={{ color: '#64748b', fontSize: '14px' }}></i>
                    <input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        padding: '10px 12px',
                        fontSize: '14px',
                        outline: 'none',
                        width: '200px',
                        color: '#1a202c'
                      }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearchDropdown(false); }}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <i className="fas fa-times" style={{ color: '#94a3b8', fontSize: '12px' }}></i>
                      </button>
                    )}
                  </div>
                </form>
                
                {/* Search Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
                    zIndex: 9999,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    border: '1px solid #e2e8f0',
                    minWidth: '350px'
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                        {searchResults.length} résultat(s) pour "{searchQuery}"
                      </span>
                    </div>
                    {searchResults.map((product: any) => {
                      const finalPrice = product.discount > 0 
                        ? product.price * (1 - product.discount / 100) 
                        : product.price;
                      return (
                        <Link
                          key={product._id}
                          href={`/product/${product._id}`}
                          onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            textDecoration: 'none',
                            borderBottom: '1px solid #f1f5f9',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <img
                            src={product.image?.startsWith('http') ? product.image : product.image ? `http://localhost:5000${product.image}` : '/img/product-placeholder.jpg'}
                            alt={product.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'contain',
                              borderRadius: '8px',
                              background: '#f7fafc',
                              marginRight: '12px'
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#1a202c',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {product.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              {product.category?.name}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                            {product.discount > 0 && (
                              <div style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>
                                {product.price.toFixed(3)} DT
                              </div>
                            )}
                            <div style={{ fontSize: '14px', fontWeight: '700', color: product.discount > 0 ? '#16a34a' : '#c53030' }}>
                              {finalPrice.toFixed(3)} DT
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    <Link
                      href={`/recherche?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                      style={{
                        display: 'block',
                        padding: '14px 16px',
                        textAlign: 'center',
                        color: '#c53030',
                        fontWeight: '600',
                        fontSize: '13px',
                        textDecoration: 'none',
                        background: '#fef2f2',
                        borderRadius: '0 0 16px 16px'
                      }}
                    >
                      Voir tous les résultats <i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                  </div>
                )}
                
                {/* No results */}
                {showSearchDropdown && searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
                    zIndex: 9999,
                    padding: '30px 20px',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0',
                    minWidth: '300px'
                  }}>
                    <i className="fas fa-search" style={{ fontSize: '30px', color: '#cbd5e1', marginBottom: '12px' }}></i>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
                      Aucun produit trouvé pour "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
              
              {/* Cart */}
              <Link href="/cart" className="position-relative" style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                border: '2px solid rgba(26,26,26,0.15)',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s'
              }}>
                <i className="fa fa-shopping-bag" style={{color: '#1a1a1a', fontSize: '18px'}}></i>
                {getCartCount() > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>{getCartCount()}</span>
                )}
              </Link>
              
              {/* Favorites */}
              <Link href="/client/favorites" className="position-relative" style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                border: '2px solid rgba(26,26,26,0.15)',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s'
              }}>
                <i className="fa fa-heart" style={{color: '#c53030', fontSize: '18px'}}></i>
                {favoritesCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '700'
                  }}>{favoritesCount}</span>
                )}
              </Link>
              
              {/* User */}
              {user ? (
                <div className="dropdown" style={{ position: 'relative' }}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowUserMenu(!showUserMenu);
                    }}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      boxShadow: '0 4px 15px rgba(197, 48, 48, 0.3)'
                    }}
                  >
                    <i className="fas fa-user" style={{color: 'white', fontSize: '16px'}}></i>
                  </a>
                  {showUserMenu && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '10px',
                      minWidth: '280px',
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
                      zIndex: 1000,
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
                        color: 'white'
                      }}>
                        <div style={{fontSize: '16px', fontWeight: '700', marginBottom: '4px'}}>
                          {user.name || 'Utilisateur'}
                        </div>
                        <div style={{fontSize: '13px', opacity: 0.8}}>
                          {user.email}
                        </div>
                      </div>
                      
                      <div style={{ padding: '8px 0' }}>
                        <Link 
                          href={user.role === 'admin' ? '/admin' : '/client'} 
                          onClick={() => setShowUserMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '14px 20px',
                            color: '#2d3748',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                          }}
                        >
                          <i className={`fas ${user.role === 'admin' ? 'fa-cog' : 'fa-user-circle'}`}
                            style={{fontSize: '16px', marginRight: '12px', color: '#c53030', width: '20px'}}></i>
                          {user.role === 'admin' ? 'Administration' : 'Mon Compte'}
                        </Link>
                        <Link 
                          href="/client/orders" 
                          onClick={() => setShowUserMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '14px 20px',
                            color: '#2d3748',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                        >
                          <i className="fas fa-box" style={{fontSize: '16px', marginRight: '12px', color: '#c53030', width: '20px'}}></i>
                          Mes Commandes
                          {pendingOrdersCount > 0 && (
                            <span style={{
                              marginLeft: 'auto',
                              background: '#c53030',
                              color: 'white',
                              borderRadius: '10px',
                              padding: '2px 8px',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}>{pendingOrdersCount}</span>
                          )}
                        </Link>
                      </div>

                      <div style={{borderTop: '1px solid #e2e8f0', padding: '8px 0'}}>
                        <a 
                          onClick={(e) => {
                            e.preventDefault();
                            setShowUserMenu(false);
                            handleLogout();
                          }} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '14px 20px',
                            color: '#c53030',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fas fa-sign-out-alt" style={{fontSize: '16px', marginRight: '12px', width: '20px'}}></i>
                          Déconnexion
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  border: '2px solid rgba(26,26,26,0.15)',
                  background: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}>
                  <i className="fas fa-user" style={{color: '#1a1a1a', fontSize: '16px'}}></i>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>
      
      {/* Categories Bar */}
      <div style={{
        background: '#f7fafc',
        borderTop: '3px solid #c53030',
        padding: '12px 0'
      }}>
        <div className="container">
          <div style={{display: 'flex', gap: '0', justifyContent: 'center', flexWrap: 'wrap'}}>
            {categories.map(cat => {
              const catSubcategories = subcategories.filter(sub => sub.category?._id === cat._id);
              return (
                <div 
                  key={cat._id}
                  style={{position: 'relative'}}
                  onMouseEnter={() => setHoveredCategory(cat._id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <a 
                    href="#" 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 16px',
                      color: '#4a5568',
                      fontSize: '13px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {cat.name} 
                    {catSubcategories.length > 0 && (
                      <i className="fas fa-chevron-down ms-2" style={{fontSize: '10px', color: '#a0aec0'}}></i>
                    )}
                  </a>
                  {hoveredCategory === cat._id && catSubcategories.length > 0 && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        minWidth: '240px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                        zIndex: 99999,
                        padding: '10px 0',
                        border: '1px solid #e2e8f0'
                      }}
                      onMouseEnter={() => setHoveredCategory(cat._id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {catSubcategories.map(sub => (
                        <Link
                          key={sub._id}
                          href={`/subcategory/${sub._id}`}
                          style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: '#4a5568',
                            fontSize: '13px',
                            fontWeight: '500',
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f7fafc';
                            e.currentTarget.style.color = '#c53030';
                            e.currentTarget.style.paddingLeft = '24px';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#4a5568';
                            e.currentTarget.style.paddingLeft = '20px';
                          }}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
