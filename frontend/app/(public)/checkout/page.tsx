"use client";
import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../../lib/api';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  useEffect(() => {
    if (cart.length === 0 && !loading && isAuthenticated) {
      router.push('/cart');
    }
  }, [cart, loading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          quantity: item.quantity,
          price: item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price
        })),
        totalAmount: getCartTotal() + (getCartTotal() >= 200 ? 0 : 7),
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const order = await res.json();
        
        // Si paiement par carte, initier Paymee
        if (formData.paymentMethod === 'card') {
          const paymentRes = await fetch(`${API_URL}/api/payments/initiate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ orderId: order._id })
          });

          const paymentData = await paymentRes.json();

          if (paymentData.success && paymentData.paymentUrl) {
            clearCart();
            // Rediriger vers Paymee
            window.location.href = paymentData.paymentUrl;
            return;
          } else {
            setError(paymentData.error || 'Erreur lors de l\'initialisation du paiement');
            setLoading(false);
            return;
          }
        }

        // Paiement à la livraison
        const orderRef = order._id.slice(-8).toUpperCase();
        clearCart();
        setTimeout(() => {
          router.push(`/order-success?ref=${orderRef}&id=${order._id}`);
        }, 100);
      } else {
        const data = await res.json();
        setError(data.error || 'Erreur lors de la commande');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !loading) {
    router.push('/cart');
    return null;
  }

  return (
    <div style={{marginTop: '130px', backgroundColor: '#fafbfc', minHeight: '100vh', paddingBottom: '80px'}}>
      <div className="container py-5">
        <div style={{textAlign: 'center', marginBottom: '50px'}}>
          <div style={{width: '50px', height: '50px', borderRadius: '12px', background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', boxShadow: '0 4px 15px rgba(197,48,48,0.3)'}}>
            <i className="fas fa-credit-card" style={{color: 'white', fontSize: '22px'}}></i>
          </div>
          <h1 style={{fontSize: '32px', fontWeight: '700', color: '#1a365d', marginBottom: '10px'}}>Finaliser votre commande</h1>
          <p style={{color: '#6b7280', fontSize: '15px', maxWidth: '500px', margin: '0 auto 30px'}}>Complétez vos informations de livraison</p>
          
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0', maxWidth: '600px', margin: '0 auto'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <div style={{width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(26,54,93,0.3)'}}>
                <i className="fas fa-shopping-cart" style={{color: 'white', fontSize: '14px'}}></i>
              </div>
              <span style={{fontSize: '13px', fontWeight: '600', color: '#1a365d'}}>Panier</span>
            </div>
            <div style={{width: '60px', height: '2px', background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)', margin: '0 8px'}}></div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <div style={{width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(197,48,48,0.3)'}}>
                <i className="fas fa-shipping-fast" style={{color: 'white', fontSize: '14px'}}></i>
              </div>
              <span style={{fontSize: '13px', fontWeight: '600', color: '#c53030'}}>Livraison</span>
            </div>
            <div style={{width: '60px', height: '2px', backgroundColor: '#e5e7eb', margin: '0 8px'}}></div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <div style={{width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #e5e7eb'}}>
                <i className="fas fa-check-circle" style={{color: '#9ca3af', fontSize: '14px'}}></i>
              </div>
              <span style={{fontSize: '13px', fontWeight: '600', color: '#9ca3af'}}>Confirmation</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div style={{maxWidth: '800px', margin: '0 auto 30px', padding: '14px 18px', backgroundColor: '#fff5f5', color: '#c53030', borderRadius: '10px', border: '1px solid #fed7d7', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <i className="fas fa-exclamation-circle" style={{fontSize: '16px'}}></i>
            <span>{error}</span>
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-7">
            <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px'}}>
                <div style={{width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <i className="fas fa-shipping-fast" style={{color: 'white', fontSize: '16px'}}></i>
                </div>
                <h3 style={{fontSize: '20px', fontWeight: '700', color: '#1a365d', margin: 0}}>Informations de livraison</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '20px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '13px'}}>Nom complet *</label>
                  <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Entrez votre nom complet" style={{width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.2s', outline: 'none', backgroundColor: '#fafbfc'}} onFocus={(e) => {(e.target as HTMLInputElement).style.borderColor = '#1a365d'; (e.target as HTMLInputElement).style.backgroundColor = 'white';}} onBlur={(e) => {(e.target as HTMLInputElement).style.borderColor = '#e5e7eb'; (e.target as HTMLInputElement).style.backgroundColor = '#fafbfc';}} />
                </div>
                <div style={{marginBottom: '20px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '13px'}}>Téléphone *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+216 XX XXX XXX" style={{width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.2s', outline: 'none', backgroundColor: '#fafbfc'}} onFocus={(e) => {(e.target as HTMLInputElement).style.borderColor = '#1a365d'; (e.target as HTMLInputElement).style.backgroundColor = 'white';}} onBlur={(e) => {(e.target as HTMLInputElement).style.borderColor = '#e5e7eb'; (e.target as HTMLInputElement).style.backgroundColor = '#fafbfc';}} />
                </div>
                <div style={{marginBottom: '20px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '13px'}}>Adresse complète *</label>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Rue, numéro, bâtiment..." style={{width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.2s', outline: 'none', backgroundColor: '#fafbfc'}} onFocus={(e) => {(e.target as HTMLInputElement).style.borderColor = '#1a365d'; (e.target as HTMLInputElement).style.backgroundColor = 'white';}} onBlur={(e) => {(e.target as HTMLInputElement).style.borderColor = '#e5e7eb'; (e.target as HTMLInputElement).style.backgroundColor = '#fafbfc';}} />
                </div>
                <div className="row g-3" style={{marginBottom: '20px'}}>
                  <div className="col-md-6">
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '13px'}}>Ville *</label>
                    <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="Tunis" style={{width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.2s', outline: 'none', backgroundColor: '#fafbfc'}} onFocus={(e) => {(e.target as HTMLInputElement).style.borderColor = '#1a365d'; (e.target as HTMLInputElement).style.backgroundColor = 'white';}} onBlur={(e) => {(e.target as HTMLInputElement).style.borderColor = '#e5e7eb'; (e.target as HTMLInputElement).style.backgroundColor = '#fafbfc';}} />
                  </div>
                  <div className="col-md-6">
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '13px'}}>Code postal *</label>
                    <input type="text" required value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} placeholder="1000" style={{width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', transition: 'all 0.2s', outline: 'none', backgroundColor: '#fafbfc'}} onFocus={(e) => {(e.target as HTMLInputElement).style.borderColor = '#1a365d'; (e.target as HTMLInputElement).style.backgroundColor = 'white';}} onBlur={(e) => {(e.target as HTMLInputElement).style.borderColor = '#e5e7eb'; (e.target as HTMLInputElement).style.backgroundColor = '#fafbfc';}} />
                  </div>
                </div>
                <div style={{marginBottom: '25px'}}>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '13px'}}>Mode de paiement *</label>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                    <div onClick={() => setFormData({...formData, paymentMethod: 'cash'})} style={{padding: '14px', border: formData.paymentMethod === 'cash' ? '2px solid #1a365d' : '1.5px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.paymentMethod === 'cash' ? '#eef2f7' : 'white'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <i className="fas fa-money-bill-wave" style={{fontSize: '18px', color: formData.paymentMethod === 'cash' ? '#1a365d' : '#9ca3af'}}></i>
                        <span style={{fontWeight: '600', fontSize: '13px', color: formData.paymentMethod === 'cash' ? '#1a365d' : '#6b7280'}}>À la livraison</span>
                      </div>
                    </div>
                    <div onClick={() => setFormData({...formData, paymentMethod: 'card'})} style={{padding: '14px', border: formData.paymentMethod === 'card' ? '2px solid #1a365d' : '1.5px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.paymentMethod === 'card' ? '#eef2f7' : 'white'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <i className="fas fa-credit-card" style={{fontSize: '18px', color: formData.paymentMethod === 'card' ? '#1a365d' : '#9ca3af'}}></i>
                        <span style={{fontWeight: '600', fontSize: '13px', color: formData.paymentMethod === 'card' ? '#1a365d' : '#6b7280'}}>Carte bancaire</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{width: '100%', padding: '14px', background: loading ? '#d1d5db' : 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 20px rgba(197,48,48,0.25)', transition: 'all 0.3s'}} onMouseEnter={(e) => !loading && ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)')} onMouseLeave={(e) => !loading && ((e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)')}>
                  {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-5">
            <div style={{position: 'sticky', top: '180px'}}>
              <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', marginBottom: '15px'}}>
                <h3 style={{fontSize: '18px', fontWeight: '700', color: '#1a365d', marginBottom: '20px'}}>Récapitulatif ({cart.length} article{cart.length > 1 ? 's' : ''})</h3>
                <div style={{maxHeight: '250px', overflowY: 'auto', marginBottom: '20px', paddingRight: '8px'}}>
                  {cart.map(item => {
                    const finalPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
                    const imgSrc = item.image?.startsWith('http') ? item.image : `${API_URL}${item.image}`;
                    return (
                      <div key={item._id} style={{display: 'flex', gap: '12px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid #f3f4f6'}}>
                        <div style={{width: '60px', height: '60px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f9fafb', flexShrink: 0, border: '1px solid #e5e7eb'}}>
                          <img src={imgSrc} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'contain', padding: '6px'}} />
                        </div>
                        <div style={{flex: 1}}>
                          <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '4px', color: '#1a1a1a', lineHeight: '1.4'}}>{item.name}</div>
                          <div style={{fontSize: '12px', color: '#6b7280', marginBottom: '3px'}}>Quantité: {item.quantity}</div>
                          <div style={{fontSize: '14px', fontWeight: '700', color: '#c53030'}}>{(finalPrice * item.quantity).toFixed(3)} DT</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{borderTop: '2px solid #f3f4f6', paddingTop: '16px', marginBottom: '16px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px'}}>
                    <span style={{color: '#6b7280'}}>Sous-total</span>
                    <span style={{fontWeight: '600', color: '#1a1a1a'}}>{getCartTotal().toFixed(3)} DT</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px'}}>
                    <span style={{color: '#6b7280'}}>Frais de livraison</span>
                    <span style={{fontWeight: '600', color: '#1a1a1a'}}>{getCartTotal() >= 200 ? 'Gratuit' : '7.000 DT'}</span>
                  </div>
                  <div style={{borderTop: '2px solid #f3f4f6', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '14px', fontWeight: '600', color: '#6b7280'}}>Total à payer</span>
                    <span style={{fontSize: '26px', fontWeight: '800', color: '#c53030'}}>{(getCartTotal() + (getCartTotal() >= 200 ? 0 : 7)).toFixed(3)} DT</span>
                  </div>
                </div>
              </div>
              <div style={{background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)', borderRadius: '12px', padding: '20px'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px'}}>
                  <div style={{width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <i className="fas fa-shield-alt" style={{fontSize: '14px', color: 'white'}}></i>
                  </div>
                  <div>
                    <div style={{fontSize: '13px', fontWeight: '600', color: 'white', marginBottom: '2px'}}>Paiement sécurisé</div>
                    <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4'}}>Vos données sont protégées</div>
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                  <div style={{width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <i className="fas fa-truck" style={{fontSize: '14px', color: 'white'}}></i>
                  </div>
                  <div>
                    <div style={{fontSize: '13px', fontWeight: '600', color: 'white', marginBottom: '2px'}}>Livraison rapide</div>
                    <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4'}}>Sous 2-4 jours ouvrables</div>
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
