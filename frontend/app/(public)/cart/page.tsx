"use client";
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const applyPromoCode = () => {
    const validCodes: { [key: string]: number } = {
      'WELCOME10': 10,
      'PROMO20': 20,
      'VIP30': 30,
      'FLASH15': 15,
      'SUMMER25': 25
    };

    const code = promoCode.toUpperCase().trim();
    
    if (validCodes[code]) {
      setPromoDiscount(validCodes[code]);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Code promo invalide');
      setPromoApplied(false);
      setPromoDiscount(0);
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoError('');
  };

  const subtotal = getCartTotal();
  const discountAmount = promoApplied ? (subtotal * promoDiscount / 100) : 0;
  const shippingCost = (subtotal - discountAmount) >= 200 ? 0 : 7;
  const total = subtotal - discountAmount + shippingCost;

  if (cart.length === 0) {
    return (
      <div style={{marginTop: '160px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa'}}>
        <div style={{textAlign: 'center', backgroundColor: 'white', padding: '60px 80px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)'}}>
          <div style={{width: '120px', height: '120px', margin: '0 auto 30px', background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 35px rgba(26, 54, 93, 0.3)'}}>
            <i className="fas fa-shopping-cart" style={{fontSize: '50px', color: 'white'}}></i>
          </div>
          <h2 style={{fontSize: '28px', fontWeight: '800', color: '#1a202c', marginBottom: '15px'}}>Votre panier est vide</h2>
          <p style={{color: '#64748b', fontSize: '16px', marginBottom: '30px'}}>Découvrez nos produits et commencez vos achats</p>
          <Link href="/" style={{display: 'inline-block', padding: '15px 40px', background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', boxShadow: '0 8px 20px rgba(197, 48, 48, 0.3)'}}>
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{marginTop: '160px', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '80px'}}>
      {/* Header */}
      <div className="container" style={{ paddingTop: '30px', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(197, 48, 48, 0.3)',
            marginBottom: '15px'
          }}>
            <i className="fas fa-shopping-cart" style={{ color: 'white', fontSize: '26px' }}></i>
          </div>
          <h1 style={{fontSize: '2.2rem', fontWeight: '800', color: '#1a202c', margin: 0, marginBottom: '5px'}}>Votre Panier</h1>
          <p style={{color: '#64748b', fontSize: '14px', margin: 0}}>{cart.length} article{cart.length > 1 ? 's' : ''} dans votre panier</p>
        </div>
      </div>
      
      <div className="container">
        <div className="row g-4">
          {/* Liste des produits */}
          <div className="col-lg-8">
            <div style={{backgroundColor: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'}}>
              {cart.map((item, index) => {
                const imageUrl = item.image?.startsWith('http') ? item.image : item.image ? `http://localhost:5000${item.image}` : '/img/product-placeholder.jpg';
                return (
                  <div key={item._id} style={{display: 'flex', gap: '20px', padding: '20px 0', borderBottom: index < cart.length - 1 ? '1px solid #e2e8f0' : 'none', alignItems: 'center'}}>
                    <div style={{width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f7fafc', flexShrink: 0}}>
                      <img src={imageUrl} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'contain', padding: '10px'}} />
                    </div>
                    <div style={{flex: 1}}>
                      <Link href={`/product/${item._id}`} style={{ textDecoration: 'none' }}>
                        <h4 style={{fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '8px', lineHeight: '1.4'}}>{item.name}</h4>
                      </Link>
                      <div style={{fontSize: '20px', fontWeight: '800', color: '#c53030', marginBottom: '12px'}}>
                        {item.price.toFixed(3)} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>DT</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap'}}>
                        {/* Quantité */}
                        <div style={{display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '10px', padding: '4px'}}>
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{
                            width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: 'white',
                            cursor: 'pointer', fontSize: '16px', fontWeight: '700', color: '#1a365d',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>−</button>
                          <span style={{minWidth: '40px', textAlign: 'center', fontSize: '15px', fontWeight: '700', color: '#1a202c'}}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{
                            width: '32px', height: '32px', border: 'none', borderRadius: '8px', backgroundColor: 'white',
                            cursor: 'pointer', fontSize: '16px', fontWeight: '700', color: '#1a365d',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>+</button>
                        </div>
                        {/* Supprimer */}
                        <button onClick={() => removeFromCart(item._id)} style={{
                          padding: '8px 16px', backgroundColor: '#fee2e2', color: '#c53030', border: 'none',
                          borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                          display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                          <i className="fas fa-trash" style={{fontSize: '11px'}}></i> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Résumé */}
          <div className="col-lg-4">
            <div style={{backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', position: 'sticky', top: '180px'}}>
              {/* Header résumé */}
              <div style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)', padding: '20px 25px' }}>
                <h3 style={{fontSize: '18px', fontWeight: '700', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <i className="fas fa-receipt"></i> Résumé de la commande
                </h3>
              </div>
              
              <div style={{ padding: '25px' }}>
                <div style={{marginBottom: '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
                    <span style={{ color: '#64748b' }}>Sous-total</span>
                    <span style={{fontWeight: '700', color: '#1a202c'}}>{subtotal.toFixed(3)} DT</span>
                  </div>
                  
                  {promoApplied && (
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
                      <span style={{ color: '#16a34a', fontWeight: '600' }}>
                        <i className="fas fa-tag me-1"></i> Réduction ({promoDiscount}%)
                      </span>
                      <span style={{fontWeight: '700', color: '#16a34a'}}>-{discountAmount.toFixed(3)} DT</span>
                    </div>
                  )}
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px'}}>
                    <span style={{ color: '#64748b' }}>Livraison</span>
                    <span style={{fontWeight: '700', color: shippingCost === 0 ? '#16a34a' : '#1a202c'}}>
                      {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(3)} DT`}
                    </span>
                  </div>
                  
                  {/* Info livraison gratuite */}
                  {(subtotal - discountAmount) < 200 && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#dbeafe', borderRadius: '10px', marginTop: '15px'}}>
                      <i className="fas fa-truck" style={{fontSize: '16px', color: '#1a365d'}}></i>
                      <span style={{fontSize: '12px', color: '#1a365d', fontWeight: '500'}}>
                        Plus que {(200 - (subtotal - discountAmount)).toFixed(3)} DT pour la livraison gratuite
                      </span>
                    </div>
                  )}
                  {(subtotal - discountAmount) >= 200 && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#dcfce7', borderRadius: '10px', marginTop: '15px'}}>
                      <i className="fas fa-check-circle" style={{fontSize: '16px', color: '#16a34a'}}></i>
                      <span style={{fontSize: '12px', color: '#16a34a', fontWeight: '600'}}>Livraison gratuite !</span>
                    </div>
                  )}
                </div>
                
                {/* Total */}
                <div style={{borderTop: '2px solid #e2e8f0', paddingTop: '20px', marginBottom: '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '16px', fontWeight: '700', color: '#1a202c'}}>Total</span>
                    <span style={{fontSize: '28px', fontWeight: '800', color: '#c53030'}}>
                      {total.toFixed(3)} <span style={{ fontSize: '16px' }}>DT</span>
                    </span>
                  </div>
                  {promoApplied && (
                    <div style={{ textAlign: 'right', marginTop: '5px' }}>
                      <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
                        Vous économisez {discountAmount.toFixed(3)} DT !
                      </span>
                    </div>
                  )}
                </div>

                {/* Code Promo - Entre Total et Commander */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '10px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <i className="fas fa-ticket-alt me-2"></i>Code promo
                  </label>
                  {!promoApplied ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="ENTREZ VOTRE CODE"
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && applyPromoCode()}
                        style={{
                          flex: 1,
                          padding: '12px 14px',
                          border: promoError ? '2px solid #ef4444' : '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '14px',
                          outline: 'none',
                          textTransform: 'uppercase'
                        }}
                      />
                      <button
                        onClick={applyPromoCode}
                        disabled={!promoCode.trim()}
                        style={{
                          padding: '12px 18px',
                          background: promoCode.trim() ? 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)' : '#e2e8f0',
                          color: promoCode.trim() ? 'white' : '#94a3b8',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: promoCode.trim() ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Appliquer
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: '#dcfce7',
                      borderRadius: '10px',
                      border: '2px solid #86efac'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-check-circle" style={{ color: '#16a34a', fontSize: '16px' }}></i>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#166534' }}>
                          {promoCode.toUpperCase()} (-{promoDiscount}%)
                        </span>
                      </div>
                      <button
                        onClick={removePromo}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <i className="fas fa-times"></i> Retirer
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-exclamation-circle"></i> {promoError}
                    </p>
                  )}
                </div>
                
                {/* Boutons */}
                <Link href="/checkout" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  width: '100%', padding: '14px',
                  background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                  color: 'white', textDecoration: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '700', marginBottom: '12px',
                  boxShadow: '0 8px 20px rgba(197, 48, 48, 0.3)'
                }}>
                  <i className="fas fa-lock"></i> Commander maintenant
                </Link>
                <Link href="/" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%', padding: '14px',
                  backgroundColor: '#f1f5f9', color: '#1a365d',
                  textDecoration: 'none', borderRadius: '12px',
                  fontSize: '14px', fontWeight: '600'
                }}>
                  <i className="fas fa-arrow-left"></i> Continuer vos achats
                </Link>
                
                {/* Garanties */}
                <div style={{marginTop: '25px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '12px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                    <div style={{ width: '32px', height: '32px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-shield-alt" style={{fontSize: '14px', color: '#1a365d'}}></i>
                    </div>
                    <span style={{fontSize: '13px', color: '#64748b'}}>Paiement 100% sécurisé</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                    <div style={{ width: '32px', height: '32px', background: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-truck" style={{fontSize: '14px', color: '#16a34a'}}></i>
                    </div>
                    <span style={{fontSize: '13px', color: '#64748b'}}>Livraison rapide</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{ width: '32px', height: '32px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fas fa-headset" style={{fontSize: '14px', color: '#d97706'}}></i>
                    </div>
                    <span style={{fontSize: '13px', color: '#64748b'}}>Support client 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
