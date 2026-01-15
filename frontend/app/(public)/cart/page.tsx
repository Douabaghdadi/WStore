"use client";

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const applyPromoCode = () => {
    const validCodes: { [key: string]: number } = { 'WELCOME10': 10, 'PROMO20': 20, 'VIP30': 30 };
    const code = promoCode.toUpperCase().trim();
    if (validCodes[code]) {
      setPromoDiscount(validCodes[code]);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Code invalide');
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  const subtotal = getCartTotal();
  const discountAmount = promoApplied ? (subtotal * promoDiscount / 100) : 0;
  const shippingCost = (subtotal - discountAmount) >= 200 ? 0 : 7;
  const total = subtotal - discountAmount + shippingCost;

  const getImageUrl = (image: string) => {
    if (!image) return '/img/product-placeholder.jpg';
    if (image.startsWith('http')) return image;
    return 'http://localhost:5000' + image;
  };

  if (cart.length === 0) {
    return (
      <div style={{marginTop: isMobile ? '100px' : '160px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', padding: '20px'}}>
        <div style={{textAlign: 'center', backgroundColor: 'white', padding: isMobile ? '40px 25px' : '60px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)'}}>
          <div style={{width: isMobile ? '70px' : '100px', height: isMobile ? '70px' : '100px', margin: '0 auto 20px', background: 'linear-gradient(135deg, #1a365d, #2d4a7c)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <i className="fas fa-shopping-cart" style={{fontSize: isMobile ? '28px' : '40px', color: 'white'}}></i>
          </div>
          <h2 style={{fontSize: isMobile ? '20px' : '26px', fontWeight: '800', color: '#1a202c', marginBottom: '10px'}}>Panier vide</h2>
          <p style={{color: '#64748b', marginBottom: '25px'}}>Découvrez nos produits</p>
          <Link href="/" style={{display: 'inline-block', padding: '14px 35px', background: 'linear-gradient(135deg, #c53030, #e53e3e)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: '700'}}>Découvrir</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{marginTop: isMobile ? '100px' : '160px', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '40px'}}>
      <div className="container" style={{paddingTop: isMobile ? '15px' : '30px', paddingBottom: '15px'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
          <div style={{width: isMobile ? '45px' : '55px', height: isMobile ? '45px' : '55px', background: 'linear-gradient(135deg, #c53030, #e53e3e)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'}}>
            <i className="fas fa-shopping-cart" style={{color: 'white', fontSize: isMobile ? '18px' : '22px'}}></i>
          </div>
          <h1 style={{fontSize: isMobile ? '1.4rem' : '2rem', fontWeight: '800', color: '#1a202c', margin: 0}}>Votre Panier</h1>
          <p style={{color: '#64748b', fontSize: '14px', margin: '5px 0 0'}}>{cart.length} article{cart.length > 1 ? 's' : ''}</p>
        </div>
      </div>
      
      <div className="container">
        <div className="row g-3">
          <div className={isMobile ? "" : "col-lg-8"} style={{width: isMobile ? '100%' : undefined}}>
            <div style={{backgroundColor: 'white', borderRadius: '16px', padding: isMobile ? '10px' : '20px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)'}}>
              {cart.map((item, index) => (
                <div key={item._id} style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: isMobile ? '12px' : '15px',
                  padding: isMobile ? '12px 0' : '15px 0',
                  borderBottom: index < cart.length - 1 ? '1px solid #eee' : 'none',
                  alignItems: 'center'
                }}>
                  {/* Image */}
                  <div style={{
                    width: isMobile ? '80px' : '100px',
                    height: isMobile ? '80px' : '100px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#f7fafc',
                    flexShrink: 0
                  }}>
                    <img src={getImageUrl(item.image)} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'contain', padding: '5px'}} />
                  </div>
                  
                  {/* Info */}
                  <div style={{flex: 1, minWidth: 0}}>
                    <h4 style={{
                      fontSize: isMobile ? '13px' : '15px',
                      fontWeight: '700',
                      color: '#1a202c',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: isMobile ? 'nowrap' : 'normal'
                    }}>{item.name}</h4>
                    
                    <div style={{fontSize: isMobile ? '16px' : '18px', fontWeight: '800', color: '#c53030', marginBottom: '8px'}}>
                      {item.price.toFixed(3)} DT
                    </div>
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                      {/* Quantité */}
                      <div style={{display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '2px'}}>
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{
                          width: isMobile ? '28px' : '32px',
                          height: isMobile ? '28px' : '32px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#1a365d',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>-</button>
                        <span style={{minWidth: isMobile ? '30px' : '35px', textAlign: 'center', fontSize: '14px', fontWeight: '700'}}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{
                          width: isMobile ? '28px' : '32px',
                          height: isMobile ? '28px' : '32px',
                          border: 'none',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#1a365d',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>+</button>
                      </div>
                      
                      {/* Supprimer */}
                      <button onClick={() => removeFromCart(item._id)} style={{
                        padding: isMobile ? '6px 10px' : '7px 14px',
                        backgroundColor: '#fee2e2',
                        color: '#c53030',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: isMobile ? '11px' : '12px',
                        fontWeight: '600'
                      }}>
                        <i className="fas fa-trash" style={{marginRight: '4px'}}></i>
                        {!isMobile && 'Supprimer'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={isMobile ? "" : "col-lg-4"} style={{width: isMobile ? '100%' : undefined}}>
            <div style={{backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 15px rgba(0,0,0,0.05)'}}>
              <div style={{background: 'linear-gradient(135deg, #1a365d, #2d4a7c)', padding: '15px 18px'}}>
                <h3 style={{fontSize: '16px', fontWeight: '700', color: 'white', margin: 0}}>
                  <i className="fas fa-receipt" style={{marginRight: '8px'}}></i>Résumé
                </h3>
              </div>
              <div style={{padding: '18px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                  <span style={{color: '#64748b'}}>Sous-total</span>
                  <span style={{fontWeight: '700'}}>{subtotal.toFixed(3)} DT</span>
                </div>
                {promoApplied && (
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                    <span style={{color: '#16a34a', fontWeight: '600'}}>Réduction -{promoDiscount}%</span>
                    <span style={{fontWeight: '700', color: '#16a34a'}}>-{discountAmount.toFixed(3)} DT</span>
                  </div>
                )}
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
                  <span style={{color: '#64748b'}}>Livraison</span>
                  <span style={{fontWeight: '700', color: shippingCost === 0 ? '#16a34a' : '#1a202c'}}>{shippingCost === 0 ? 'Gratuite' : shippingCost.toFixed(3) + ' DT'}</span>
                </div>
                
                <div style={{borderTop: '2px solid #eee', paddingTop: '12px', marginTop: '12px', marginBottom: '15px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: '700', fontSize: '15px'}}>Total</span>
                    <span style={{fontSize: isMobile ? '20px' : '22px', fontWeight: '800', color: '#c53030'}}>{total.toFixed(3)} DT</span>
                  </div>
                </div>
                
                <div style={{marginBottom: '15px'}}>
                  {!promoApplied ? (
                    <div style={{display: 'flex', gap: '8px'}}>
                      <input type="text" placeholder="CODE PROMO" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} style={{flex: 1, padding: '10px 12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', textTransform: 'uppercase'}} />
                      <button onClick={applyPromoCode} style={{padding: '10px 14px', background: '#1a365d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700'}}>OK</button>
                    </div>
                  ) : (
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#dcfce7', borderRadius: '8px'}}>
                      <span style={{fontSize: '13px', fontWeight: '700', color: '#166534'}}>{promoCode.toUpperCase()} (-{promoDiscount}%)</span>
                      <button onClick={() => {setPromoApplied(false); setPromoDiscount(0); setPromoCode('');}} style={{background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontWeight: '700'}}>✕</button>
                    </div>
                  )}
                  {promoError && <p style={{color: '#ef4444', fontSize: '11px', marginTop: '5px', marginBottom: 0}}>{promoError}</p>}
                </div>
                
                <div style={{display: 'flex', gap: '10px'}}>
                  <Link href="/checkout" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #c53030, #e53e3e)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 4px 12px rgba(197,48,48,0.3)'
                  }}>
                    <i className="fas fa-lock" style={{marginRight: '6px'}}></i>Commander
                  </Link>
                  <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#1a365d',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-arrow-left" style={{marginRight: '6px'}}></i>Continuer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
