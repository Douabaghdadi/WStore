'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { getCartCount } = useCart();
  const { favoritesCount } = useFavorites();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData && userData !== 'undefined') {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser) fetchPendingOrders();
    }
    
    fetch(`${API_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        console.log('Categories loaded:', data);
        setCategories(data);
      })
      .catch(err => console.error('Erreur chargement catégories:', err));

    fetch(`${API_URL}/api/subcategories`)
      .then(res => res.json())
      .then(data => {
        console.log('Subcategories loaded:', data);
        setSubcategories(data);
      })
      .catch(err => console.error('Erreur chargement sous-catégories:', err));

    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => setAllProducts(data))
      .catch(err => console.error('Erreur chargement produits:', err));
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown')) setShowUserMenu(false);
      if (!target.closest('.search-container')) setShowSearchDropdown(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const fetchPendingOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch(`${API_URL}/api/orders/my-orders`, {
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
    setMobileMenuOpen(false);
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
      setMobileSearchOpen(false);
    }
  };

  // Styles
  const styles = {
    container: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1030,
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
    },
    topBar: {
      background: 'linear-gradient(90deg, #c53030 0%, #e53e3e 100%)',
      padding: '8px 0',
      fontSize: '13px'
    },
    iconBtn: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      border: '2px solid rgba(26,26,26,0.15)',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      transition: 'all 0.3s',
      position: 'relative' as const
    },
    badge: {
      position: 'absolute' as const,
      top: '-6px',
      right: '-6px',
      background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: '700'
    },
    mobileOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 1040,
      opacity: mobileMenuOpen ? 1 : 0,
      visibility: mobileMenuOpen ? 'visible' as const : 'hidden' as const,
      transition: 'all 0.3s ease'
    },
    mobileMenu: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      bottom: 0,
      width: '85%',
      maxWidth: '320px',
      background: 'white',
      zIndex: 1050,
      transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease',
      display: 'flex',
      flexDirection: 'column' as const,
      overflowY: 'auto' as const
    }
  };

  return (
    <>
      <div style={styles.container}>
        {/* Top Bar - Hidden on mobile */}
        <div style={styles.topBar} className="d-none d-md-block">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-4">
                <span style={{color: 'rgba(255,255,255,0.95)'}}>
                  <i className="fas fa-phone-alt me-2"></i>+216 52 255 145
                </span>
                <span style={{color: 'rgba(255,255,255,0.95)'}} className="d-none d-lg-inline">
                  <i className="fas fa-truck me-2"></i>Livraison sur toute la Tunisie
                </span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <a href="https://www.facebook.com/profile.php?id=100090708515530" target="_blank" rel="noopener noreferrer" style={{color: 'rgba(255,255,255,0.95)', textDecoration: 'none'}}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.instagram.com/w.store_tn/" target="_blank" rel="noopener noreferrer" style={{color: 'rgba(255,255,255,0.95)', textDecoration: 'none'}}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://wa.me/21652255145" target="_blank" rel="noopener noreferrer" style={{color: 'rgba(255,255,255,0.95)', textDecoration: 'none'}}>
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container px-3">
          <nav style={{height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            {/* Mobile Menu Button */}
            <button 
              className="d-xl-none"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                ...styles.iconBtn,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-bars" style={{color: '#1a1a1a', fontSize: '18px'}}></i>
            </button>

            {/* Logo */}
            <Link href="/" className="d-flex align-items-center" style={{textDecoration: 'none'}}>
              <Image 
                src="/img/logo.png" 
                alt="W.Store" 
                width={160}
                height={50}
                style={{objectFit: 'contain', maxHeight: '50px', width: 'auto'}}
                priority
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="d-none d-xl-flex align-items-center gap-4">
              <Link href="/" className="nav-link" style={{color: '#1a1a1a', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', padding: '8px 12px', display: 'inline-block'}}>Accueil</Link>
              <Link href="/shop" className="nav-link" style={{color: '#1a1a1a', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', padding: '8px 12px', display: 'inline-block'}}>Boutique</Link>
              <div className="dropdown" style={{position: 'relative'}}
                onMouseEnter={() => setShowUserMenu(false)}
              >
                <a href="#" 
                  className="nav-link" 
                  style={{color: '#1a1a1a', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px'}}
                  onMouseEnter={(e) => {
                    const dropdown = e.currentTarget.nextElementSibling as HTMLElement;
                    if (dropdown) dropdown.style.display = 'block';
                  }}
                >
                  Nos Magasins
                  <i className="fas fa-chevron-down" style={{fontSize: '10px'}}></i>
                </a>
                <div 
                  className="dropdown-menu" 
                  style={{display: 'none', position: 'absolute', top: '100%', left: '0', background: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: '12px 0', minWidth: '220px', zIndex: 1050}}
                  onMouseEnter={(e) => e.currentTarget.style.display = 'block'}
                  onMouseLeave={(e) => e.currentTarget.style.display = 'none'}
                >
                  <Link href="/magasins#korba" className="dropdown-item" style={{display: 'flex', alignItems: 'center', padding: '12px 18px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'background 0.2s'}}>
                    <i className="fas fa-store me-3" style={{color: '#c53030', fontSize: '15px'}}></i>Korba
                  </Link>
                  <Link href="/magasins#dar-chaabene" className="dropdown-item" style={{display: 'flex', alignItems: 'center', padding: '12px 18px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'background 0.2s'}}>
                    <i className="fas fa-store me-3" style={{color: '#c53030', fontSize: '15px'}}></i>Dar Chaâbene
                  </Link>
                  <div style={{borderTop: '1px solid #f1f5f9', margin: '8px 14px'}}></div>
                  <div style={{padding: '4px 14px 8px'}}>
                    <Link href="/magasins" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', color: 'white', textDecoration: 'none', fontWeight: '600', fontSize: '13px', background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', borderRadius: '8px', whiteSpace: 'nowrap'}}>
                      Voir tous les magasins
                      <i className="fas fa-arrow-right ms-2" style={{fontSize: '11px'}}></i>
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/contact" className="nav-link" style={{color: '#4a4a4a', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase'}}>Contact</Link>
            </div>

            {/* Right Icons */}
            <div className="d-flex align-items-center gap-2">
              {/* Desktop Search */}
              <div className="search-container d-none d-lg-block" style={{ position: 'relative' }}>
                <form onSubmit={handleSearchSubmit}>
                  <div style={{display: 'flex', alignItems: 'center', background: '#f7fafc', borderRadius: '10px', border: '2px solid rgba(26,26,26,0.1)', padding: '0 12px'}}>
                    <i className="fas fa-search" style={{ color: '#64748b', fontSize: '14px' }}></i>
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                      style={{border: 'none', background: 'transparent', padding: '10px 12px', fontSize: '14px', outline: 'none', width: '180px', color: '#1a202c'}}
                    />
                  </div>
                </form>
                {/* Search Results Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <div style={{position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px', background: 'white', borderRadius: '12px', boxShadow: '0 15px 50px rgba(0,0,0,0.2)', zIndex: 9999, maxHeight: '350px', overflowY: 'auto', border: '1px solid #e2e8f0', minWidth: '300px'}}>
                    {searchResults.map((product: any) => {
                      const finalPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
                      return (
                        <Link key={product._id} href={`/product/${product._id}`} onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                          style={{display: 'flex', alignItems: 'center', padding: '10px 14px', textDecoration: 'none', borderBottom: '1px solid #f1f5f9'}}>
                          <img src={product.image?.startsWith('http') ? product.image : `${API_URL}${product.image}`} alt={product.name}
                            style={{width: '45px', height: '45px', objectFit: 'contain', borderRadius: '8px', background: '#f7fafc', marginRight: '10px'}}/>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{fontSize: '13px', fontWeight: '600', color: '#1a202c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{product.name}</div>
                            <div style={{fontSize: '13px', fontWeight: '700', color: '#c53030'}}>{finalPrice.toFixed(3)} DT</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Search Button */}
              <button className="d-lg-none" onClick={() => setMobileSearchOpen(!mobileSearchOpen)} style={{...styles.iconBtn, border: 'none', cursor: 'pointer'}}>
                <i className="fas fa-search" style={{color: '#1a1a1a', fontSize: '16px'}}></i>
              </button>

              {/* Cart */}
              <Link href="/cart" style={styles.iconBtn}>
                <i className="fa fa-shopping-bag" style={{color: '#1a1a1a', fontSize: '16px'}}></i>
                {getCartCount() > 0 && <span style={styles.badge}>{getCartCount()}</span>}
              </Link>

              {/* Favorites - Hidden on small mobile */}
              <Link href="/client/favorites" className="d-none d-sm-flex" style={styles.iconBtn}>
                <i className="fa fa-heart" style={{color: '#c53030', fontSize: '16px'}}></i>
                {favoritesCount > 0 && <span style={styles.badge}>{favoritesCount}</span>}
              </Link>

              {/* User */}
              {user ? (
                <div className="dropdown" style={{ position: 'relative' }}>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation();
                      // Sur mobile, ouvrir le menu latéral au lieu du dropdown
                      if (window.innerWidth < 1200) {
                        setMobileMenuOpen(true);
                      } else {
                        setShowUserMenu(!showUserMenu);
                      }
                    }}
                    style={{
                      ...styles.iconBtn, 
                      background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', 
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-user" style={{color: 'white', fontSize: '14px'}}></i>
                  </button>
                  {/* Dropdown desktop uniquement */}
                  {showUserMenu && (
                    <div className="d-none d-xl-block" style={{
                      position: 'absolute', 
                      right: 0, 
                      top: '100%', 
                      marginTop: '10px', 
                      minWidth: '250px', 
                      backgroundColor: 'white', 
                      borderRadius: '12px', 
                      boxShadow: '0 15px 50px rgba(0,0,0,0.2)', 
                      zIndex: 9999, 
                      overflow: 'hidden', 
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{padding: '16px', background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)', color: 'white'}}>
                        <div style={{fontSize: '14px', fontWeight: '700'}}>{user.name || 'Utilisateur'}</div>
                        <div style={{fontSize: '12px', opacity: 0.8}}>{user.email}</div>
                      </div>
                      <div style={{ padding: '8px 0' }}>
                        <Link href={user.role === 'admin' ? '/admin' : '/client'} onClick={() => setShowUserMenu(false)}
                          style={{display: 'flex', alignItems: 'center', padding: '12px 16px', color: '#2d3748', textDecoration: 'none', fontSize: '14px'}}>
                          <i className={`fas ${user.role === 'admin' ? 'fa-cog' : 'fa-user-circle'}`} style={{marginRight: '10px', color: '#c53030'}}></i>
                          {user.role === 'admin' ? 'Administration' : 'Mon Compte'}
                        </Link>
                        <Link href="/client/orders" onClick={() => setShowUserMenu(false)}
                          style={{display: 'flex', alignItems: 'center', padding: '12px 16px', color: '#2d3748', textDecoration: 'none', fontSize: '14px'}}>
                          <i className="fas fa-box" style={{marginRight: '10px', color: '#c53030'}}></i>Mes Commandes
                          {pendingOrdersCount > 0 && <span style={{marginLeft: 'auto', background: '#c53030', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '11px'}}>{pendingOrdersCount}</span>}
                        </Link>
                      </div>
                      <div style={{borderTop: '1px solid #e2e8f0', padding: '8px 0'}}>
                        <button onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '12px 16px', 
                          color: '#c53030', 
                          textDecoration: 'none', 
                          fontSize: '14px', 
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                          width: '100%',
                          textAlign: 'left'
                        }}>
                          <i className="fas fa-sign-out-alt" style={{marginRight: '10px'}}></i>Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    // Sur mobile, ouvrir le menu latéral, sur desktop aller à /login
                    if (window.innerWidth < 1200) {
                      setMobileMenuOpen(true);
                    } else {
                      router.push('/login');
                    }
                  }}
                  style={{...styles.iconBtn, border: 'none', background: 'transparent', cursor: 'pointer'}}
                >
                  <i className="fas fa-user" style={{color: '#1a1a1a', fontSize: '14px'}}></i>
                </button>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="d-lg-none" style={{padding: '10px 15px', background: '#f7fafc', borderTop: '1px solid #e2e8f0'}}>
            <form onSubmit={handleSearchSubmit} style={{display: 'flex', gap: '10px'}}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
                style={{flex: 1, padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '16px', outline: 'none'}}
              />
              <button type="submit" style={{padding: '12px 20px', background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600'}}>
                <i className="fas fa-search"></i>
              </button>
            </form>
            {/* Mobile Search Results */}
            {searchResults.length > 0 && (
              <div style={{marginTop: '10px', background: 'white', borderRadius: '12px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', maxHeight: '300px', overflowY: 'auto'}}>
                {searchResults.map((product: any) => {
                  const finalPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;
                  return (
                    <Link key={product._id} href={`/product/${product._id}`} onClick={() => { setMobileSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                      style={{display: 'flex', alignItems: 'center', padding: '10px 12px', textDecoration: 'none', borderBottom: '1px solid #f1f5f9'}}>
                      <img src={product.image?.startsWith('http') ? product.image : `${API_URL}${product.image}`} alt={product.name}
                        style={{width: '40px', height: '40px', objectFit: 'contain', borderRadius: '6px', background: '#f7fafc', marginRight: '10px'}}/>
                      <div style={{ flex: 1 }}>
                        <div style={{fontSize: '13px', fontWeight: '600', color: '#1a202c'}}>{product.name}</div>
                        <div style={{fontSize: '13px', fontWeight: '700', color: '#c53030'}}>{finalPrice.toFixed(3)} DT</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Categories Bar - Desktop only */}
        <div className="d-none d-md-block" style={{background: '#f7fafc', borderTop: '3px solid #c53030', padding: '10px 0', position: 'relative', zIndex: 1020, overflow: 'visible'}}>
          <div className="container px-3">
            <div className="categories-scroll-container" style={{display: 'flex', gap: '0', justifyContent: 'center'}}>
              {categories.map(cat => {
                const catSubcategories = subcategories.filter(sub => {
                  const categoryId = sub.category?._id || sub.category;
                  return categoryId === cat._id;
                });
                
                return (
                  <div 
                    key={cat._id} 
                    className="category-dropdown-wrapper"
                    onMouseEnter={() => setHoveredCategory(cat._id)} 
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <Link href={`/category/${cat._id}`}
                      style={{display: 'flex', alignItems: 'center', padding: '8px 14px', color: hoveredCategory === cat._id ? '#c53030' : '#4a5568', fontSize: '13px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'color 0.2s'}}>
                      {cat.name}
                      {catSubcategories.length > 0 && <i className="fas fa-chevron-down ms-2" style={{fontSize: '9px', color: '#a0aec0'}}></i>}
                    </Link>
                    {hoveredCategory === cat._id && catSubcategories.length > 0 && (
                      <div 
                        className="category-dropdown"
                        onMouseEnter={() => setHoveredCategory(cat._id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        {catSubcategories.map(sub => (
                          <Link key={sub._id} href={`/subcategory/${sub._id}`} className="category-dropdown-item">
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

      {/* Mobile Menu Overlay */}
      <div style={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)} />

      {/* Mobile Slide Menu - Luxueux */}
      <div style={styles.mobileMenu}>
        {/* Mobile Menu Header */}
        <div style={{
          padding: '20px 24px',
          background: 'white',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Image src="/img/logo.png" alt="W.Store" width={160} height={55} style={{objectFit: 'contain'}}/>
            <button onClick={() => setMobileMenuOpen(false)} style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '12px',
              width: '44px',
              height: '44px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-times" style={{color: '#1a202c', fontSize: '16px'}}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu Links */}
        <div style={{flex: 1, padding: '20px 16px', overflowY: 'auto', background: '#fafbfc'}}>
          {/* Section utilisateur si connecté */}
          {user && (
            <div style={{background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{padding: '12px', background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)', borderRadius: '12px', marginBottom: '12px'}}>
                <div style={{color: 'white', fontSize: '15px', fontWeight: '700', marginBottom: '4px'}}>{user.name || 'Utilisateur'}</div>
                <div style={{color: 'rgba(255,255,255,0.8)', fontSize: '12px'}}>{user.email}</div>
              </div>
              <Link href={user.role === 'admin' ? '/admin' : '/client'} onClick={() => setMobileMenuOpen(false)} style={{display: 'flex', alignItems: 'center', padding: '12px', color: '#1a202c', textDecoration: 'none', borderRadius: '8px', marginBottom: '4px', background: '#f8fafc'}}>
                <i className={`fas ${user.role === 'admin' ? 'fa-cog' : 'fa-user-circle'}`} style={{color: '#c53030', fontSize: '16px', width: '24px', marginRight: '12px', textAlign: 'center', flexShrink: 0}}></i>
                <span style={{fontSize: '14px', fontWeight: '600', lineHeight: '1.5', flex: 1}}>{user.role === 'admin' ? 'Administration' : 'Mon Compte'}</span>
              </Link>
              <Link href="/client/orders" onClick={() => setMobileMenuOpen(false)} style={{display: 'flex', alignItems: 'center', padding: '12px', color: '#1a202c', textDecoration: 'none', borderRadius: '8px', background: '#f8fafc'}}>
                <i className="fas fa-box" style={{color: '#c53030', fontSize: '16px', width: '24px', marginRight: '12px', textAlign: 'center', flexShrink: 0}}></i>
                <span style={{fontSize: '14px', fontWeight: '600', lineHeight: '1.5', flex: 1}}>Mes Commandes</span>
                {pendingOrdersCount > 0 && <span style={{background: '#c53030', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: '700'}}>{pendingOrdersCount}</span>}
              </Link>
            </div>
          )}
          
          {/* Navigation principale */}
          <div style={{background: 'white', borderRadius: '16px', padding: '12px 0', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
            <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{display: 'flex', alignItems: 'center', padding: '14px 16px', color: '#1a202c', textDecoration: 'none', borderBottom: '1px solid #f1f5f9', minHeight: '48px'}}>
              <i className="fas fa-home" style={{color: '#c53030', fontSize: '16px', width: '24px', marginRight: '12px', textAlign: 'center', flexShrink: 0}}></i>
              <span style={{fontSize: '15px', fontWeight: '600', lineHeight: '1.5', flex: 1}}>Accueil</span>
            </Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} style={{display: 'flex', alignItems: 'center', padding: '14px 16px', color: '#1a202c', textDecoration: 'none', borderBottom: '1px solid #f1f5f9', minHeight: '48px'}}>
              <i className="fas fa-shopping-bag" style={{color: '#1a365d', fontSize: '16px', width: '24px', marginRight: '12px', textAlign: 'center', flexShrink: 0}}></i>
              <span style={{fontSize: '15px', fontWeight: '600', lineHeight: '1.5', flex: 1}}>Boutique</span>
            </Link>
            <Link href="/magasins" onClick={() => setMobileMenuOpen(false)} style={{display: 'flex', alignItems: 'center', padding: '14px 16px', color: '#1a202c', textDecoration: 'none', borderBottom: '1px solid #f1f5f9', minHeight: '48px'}}>
              <i className="fas fa-map-marker-alt" style={{color: '#16a34a', fontSize: '16px', width: '24px', marginRight: '12px', textAlign: 'center', flexShrink: 0}}></i>
              <span style={{fontSize: '15px', fontWeight: '600', lineHeight: '1.5', flex: 1}}>Nos Magasins</span>
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} style={{display: 'flex', alignItems: 'center', padding: '14px 16px', color: '#1a202c', textDecoration: 'none', minHeight: '48px'}}>
              <i className="fas fa-envelope" style={{color: '#d97706', fontSize: '16px', width: '24px', marginRight: '12px', textAlign: 'center', flexShrink: 0}}></i>
              <span style={{fontSize: '15px', fontWeight: '600', lineHeight: '1.5', flex: 1}}>Contact</span>
            </Link>
          </div>

          {/* Catégories */}
          <div style={{background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
            <div style={{fontSize: '13px', fontWeight: '700', color: '#1a365d', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center'}}>
              <i className="fas fa-th-large" style={{marginRight: '8px', fontSize: '12px'}}></i>
              Catégories
            </div>
            {categories.map((cat, index) => {
              const catSubcategories = subcategories.filter(sub => sub.category?._id === cat._id);
              const isExpanded = expandedCategory === cat._id;
              return (
                <div key={cat._id} style={{borderTop: index > 0 ? '1px solid #f1f5f9' : 'none'}}>
                  <div 
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 4px', cursor: 'pointer'}}
                    onClick={() => setExpandedCategory(isExpanded ? null : cat._id)}>
                    <Link href={`/category/${cat._id}`} onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
                      style={{color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: '500', flex: 1}}>{cat.name}</Link>
                    {catSubcategories.length > 0 && (
                      <div style={{width: '28px', height: '28px', borderRadius: '8px', background: isExpanded ? '#1a365d' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'}}>
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`} style={{fontSize: '10px', color: isExpanded ? 'white' : '#64748b'}}></i>
                      </div>
                    )}
                  </div>
                  {isExpanded && catSubcategories.length > 0 && (
                    <div style={{paddingBottom: '10px', paddingLeft: '8px'}}>
                      {catSubcategories.map(sub => (
                        <Link key={sub._id} href={`/subcategory/${sub._id}`} onClick={() => setMobileMenuOpen(false)}
                          style={{display: 'flex', alignItems: 'center', padding: '10px 12px', color: '#64748b', textDecoration: 'none', fontSize: '13px', borderRadius: '8px', marginBottom: '2px', background: '#f8fafc'}}>
                          <i className="fas fa-angle-right" style={{marginRight: '10px', fontSize: '10px', color: '#c53030'}}></i>
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

        {/* Mobile Menu Footer */}
        <div style={{padding: '16px', borderTop: '1px solid #e2e8f0', background: 'white'}}>
          {user ? (
            <button onClick={handleLogout}
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '14px 16px', color: 'white', background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)'}}>
              <i className="fas fa-sign-out-alt" style={{marginRight: '10px'}}></i>Déconnexion
            </button>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px', background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)'}}>
              <i className="fas fa-user" style={{marginRight: '10px'}}></i>Se connecter
            </Link>
          )}
          
          {/* Réseaux sociaux */}
          <div style={{display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9'}}>
            <a href="https://www.facebook.com/profile.php?id=100090708515530" target="_blank" rel="noopener noreferrer" 
              style={{width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a365d', textDecoration: 'none'}}>
              <i className="fab fa-facebook-f" style={{fontSize: '16px'}}></i>
            </a>
            <a href="https://www.instagram.com/w.store_tn/" target="_blank" rel="noopener noreferrer"
              style={{width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c53030', textDecoration: 'none'}}>
              <i className="fab fa-instagram" style={{fontSize: '16px'}}></i>
            </a>
            <a href="https://wa.me/21652255145" target="_blank" rel="noopener noreferrer"
              style={{width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', textDecoration: 'none'}}>
              <i className="fab fa-whatsapp" style={{fontSize: '18px'}}></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
