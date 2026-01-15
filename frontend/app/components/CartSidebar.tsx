"use client";
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = () => {
    setPromoError('');
    
    // Codes promo valides (à personnaliser)
    const validCodes: { [key: string]: number } = {
      'WSTORE10': 10,
      'WSTORE20': 20,
      'BIENVENUE': 15,
      'PROMO5': 5
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
  const shippingCost = 7;
  const finalTotal = subtotal - discountAmount + shippingCost;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.6)', 
            zIndex: 9998,
            backdropFilter: 'blur(4px)'
          }} 
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : '-380px',
        width: '380px',
        maxWidth: '90vw',
        height: '100vh',
        backgroundColor: '#ffffff',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
        transition: 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 20px',
          background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-shopping-bag" style={{ color: 'white', fontSize: '16px' }}></i>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: 'white' }}>Mon Panier</h3>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                {cart.length} article{cart.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <i className="fas fa-times" style={{ color: 'white', fontSize: '16px' }}></i>
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f8f9fa' }}>
          {cart.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '50px 20px',
              background: 'white',
              borderRadius: '14px',
              marginTop: '10px'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <i className="fas fa-shopping-bag" style={{ fontSize: '28px', color: '#a0aec0' }}></i>
              </div>
              <h4 style={{ color: '#2d3748', fontWeight: '700', marginBottom: '6px', fontSize: '15px' }}>Panier vide</h4>
              <p style={{ color: '#718096', fontSize: '13px', marginBottom: '16px' }}>
                Découvrez nos produits
              </p>
              <Link href="/shop" onClick={onClose} style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '13px'
              }}>
                Voir la boutique
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cart.map(item => {
                const finalPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
                
                return (
                  <div key={item._id} style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    border: '1px solid #e2e8f0'
                  }}>
                    {/* Image */}
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '10px',
                      background: '#f7fafc',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img 
                        src={item.image?.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#1a202c',
                        marginBottom: '4px',
                        lineHeight: '1.3',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>{item.name}</h4>

                      {/* Price */}
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#c53030'
                        }}>
                          {finalPrice.toFixed(3)} DT
                        </span>
                      </div>

                      {/* Quantity & Delete */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: '#f7fafc',
                          borderRadius: '8px',
                          padding: '2px'
                        }}>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: 'none',
                              borderRadius: '6px',
                              background: 'white',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1a365d',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                            }}
                          >−</button>
                          <span style={{
                            minWidth: '32px',
                            textAlign: 'center',
                            fontSize: '13px',
                            fontWeight: '700',
                            color: '#1a202c'
                          }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              border: 'none',
                              borderRadius: '6px',
                              background: 'white',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1a365d',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                            }}
                          >+</button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item._id)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#fee2e2',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i className="fas fa-trash-alt" style={{ color: '#dc2626', fontSize: '12px' }}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{
            padding: '12px 16px',
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
          }}>
            {/* Code Promo - Compact */}
            <div style={{ marginBottom: '12px' }}>
              {!promoApplied ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Code promo"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: promoError ? '2px solid #c53030' : '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleApplyPromo}
                    style={{
                      padding: '10px 14px',
                      background: '#1a365d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #86efac'
                }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#166534' }}>
                    <i className="fas fa-check-circle me-1"></i>{promoCode.toUpperCase()} (-{promoDiscount}%)
                  </span>
                  <button onClick={removePromo} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                    Retirer
                  </button>
                </div>
              )}
            </div>

            {/* Summary - Compact */}
            <div style={{ fontSize: '13px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#718096' }}>Sous-total</span>
                <span style={{ color: '#1a202c', fontWeight: '600' }}>{subtotal.toFixed(3)} DT</span>
              </div>
              {promoApplied && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#16a34a' }}>Réduction</span>
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>-{discountAmount.toFixed(3)} DT</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px dashed #e2e8f0' }}>
                <span style={{ color: '#718096' }}>Livraison</span>
                <span style={{ color: '#1a202c', fontWeight: '600' }}>{shippingCost.toFixed(3)} DT</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ color: '#1a202c', fontWeight: '700' }}>Total</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#c53030' }}>{finalTotal.toFixed(3)} DT</span>
              </div>
            </div>

            {/* Buttons - Always visible */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link 
                href="/cart" 
                onClick={onClose}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  background: 'white',
                  color: '#1a365d',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: '2px solid #1a365d'
                }}
              >
                <i className="fas fa-shopping-bag" style={{ fontSize: '12px' }}></i>
                Panier
              </Link>
              <Link 
                href="/checkout" 
                onClick={onClose}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)'
                }}
              >
                <i className="fas fa-lock" style={{ fontSize: '11px' }}></i>
                Commander
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
