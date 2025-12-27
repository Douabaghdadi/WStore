"use client";
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cash'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        totalAmount: getCartTotal() + 7,
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        const order = await res.json();
        const orderRef = order._id.slice(-8).toUpperCase();
        clearCart();
        setTimeout(() => {
          router.push(`/order-success?ref=${orderRef}`);
        }, 100);
      } else {
        const data = await res.json();
        setError(data.error || 'Erreur lors de la commande');
      }
    } catch (err) {
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
    <div style={{marginTop: '160px', backgroundColor: '#fafbfc', minHeight: '100vh', paddingBottom: '80px'}}>
      <div className="container py-5">
        <div style={{textAlign: 'center', marginBottom: '50px'}}>
          <div style={{display: 'inline-block', padding: '8px 20px', backgroundColor: '#e8f5e9', borderRadius: '20px', marginBottom: '20px'}}>
            <span style={{fontSize: '13px', fontWeight: '600', color: '#66BB6A', letterSpacing: '0.5px'}}>ÉTAPE FINALE</span>
          </div>
          <h1 style={{fontSize: '48px', fontWeight: '800', color: '#1a1a1a', marginBottom: '12px', letterSpacing: '-0.5px'}}>Finaliser votre commande</h1>
          <p style={{color: '#6b7280', fontSize: '17px', maxWidth: '600px', margin: '0 auto 40px'}}>Complétez vos informations de livraison pour recevoir vos produits en toute sécurité</p>
          
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0', maxWidth: '700px', margin: '0 auto'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(129,199,132,0.3)'}}>
                <i className="fa fa-shopping-cart" style={{color: 'white', fontSize: '18px'}}></i>
              </div>
              <span style={{fontSize: '14px', fontWeight: '600', color: '#1a1a1a'}}>Panier</span>
            </div>
            <div style={{width: '80px', height: '2px', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', margin: '0 8px'}}></div>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(129,199,132,0.3)'}}>
                <i className="fa fa-shipping-fast" style={{color: 'white', fontSize: '18px'}}></i>
              </div>
              <span style={{fontSize: '14px', fontWeight: '600', color: '#1a1a1a'}}>Livraison</span>
            </div>
            <div style={{width: '80px', height: '2px', backgroundColor: '#e5e7eb', margin: '0 8px'}}></div>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
              <div style={{width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #e5e7eb'}}>
                <i className="fa fa-check-circle" style={{color: '#9ca3af', fontSize: '18px'}}></i>
              </div>
              <span style={{fontSize: '14px', fontWeight: '600', color: '#9ca3af'}}>Confirmation</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div style={{maxWidth: '800px', margin: '0 auto 30px', padding: '16px 20px', backgroundColor: '#fff5f5', color: '#dc2626', borderRadius: '12px', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '12px'}}>
            <i className="fa fa-exclamation-circle" style={{fontSize: '18px'}}></i>
            <span>{error}</span>
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-7">
            <div style={{backgroundColor: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '35px'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <i className="fa fa-shipping-fast" style={{color: 'white', fontSize: '18px'}}></i>
                </div>
                <h3 style={{fontSize: '24px', fontWeight: '700', color: '#1a1a1a', margin: 0}}>Informations de livraison</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '14px', letterSpacing: '0.2px'}}>Nom complet *</label>
                  <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Entrez votre nom complet" style={{width: '100%', padding: '14px 18px', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', transition: 'all 0.2s', outline: 'none', backgroundColor: '#fafbfc'}} onFocus={(e) => {e.target.style.borderColor = '#81C784'; e.target.style.backgroundColor = 'white';}} onBlur={(e) => {e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#fafbfc';}} />
                </div>
                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '14px', letterSpacing: '0.2px'}}>Téléphone *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+216 XX XXX XXX" style={{width: '100%', padding: '14px 18px', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', transition: 'all 0.2s', outline: 'none', backgroundColor: '#fafbfc'}} onFocus={(e) => {e.target.style.borderColor = '#81C784'; e.target.style.backgroundColor = 'white';}} onBlur={(e) => {e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#fafbfc';}} />
                </div>
                <div style={{marginBottom: '24px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '14px', letterSpacing: '0.2px'}}>Adresse complète *</label>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Rue, numéro, bâtiment..." style={{width: '100%', padding: '14px 18px', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', transition: 'all 0.2s', outline: 'none', backgroundColor: '#fafbfc'}} onFocus={(e) => {e.target.style.borderColor = '#81C784'; e.target.style.backgroundColor = 'white';}} onBlur={(e) => {e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#fafbfc';}} />
                </div>
                <div className="row g-3" style={{marginBottom: '24px'}}>
                  <div className="col-md-6">
                    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '14px', letterSpacing: '0.2px'}}>Ville *</label>
                    <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="Tunis" style={{width: '100%', padding: '14px 18px', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', transition: 'all 0.2s', outline: 'none', backgroundColor: '#fafbfc'}} onFocus={(e) => {e.target.style.borderColor = '#81C784'; e.target.style.backgroundColor = 'white';}} onBlur={(e) => {e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#fafbfc';}} />
                  </div>
                  <div className="col-md-6">
                    <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '14px', letterSpacing: '0.2px'}}>Code postal *</label>
                    <input type="text" required value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} placeholder="1000" style={{width: '100%', padding: '14px 18px', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '15px', transition: 'all 0.2s', outline: 'none', backgroundColor: '#fafbfc'}} onFocus={(e) => {e.target.style.borderColor = '#81C784'; e.target.style.backgroundColor = 'white';}} onBlur={(e) => {e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = '#fafbfc';}} />
                  </div>
                </div>
                <div style={{marginBottom: '32px'}}>
                  <label style={{display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '14px', letterSpacing: '0.2px'}}>Mode de paiement *</label>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                    <div onClick={() => setFormData({...formData, paymentMethod: 'cash'})} style={{padding: '16px', border: formData.paymentMethod === 'cash' ? '2px solid #81C784' : '1.5px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.paymentMethod === 'cash' ? '#f0f9f4' : 'white'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <i className="fa fa-money-bill-wave" style={{fontSize: '20px', color: formData.paymentMethod === 'cash' ? '#81C784' : '#9ca3af'}}></i>
                        <span style={{fontWeight: '600', fontSize: '14px', color: formData.paymentMethod === 'cash' ? '#1a1a1a' : '#6b7280'}}>À la livraison</span>
                      </div>
                    </div>
                    <div onClick={() => setFormData({...formData, paymentMethod: 'card'})} style={{padding: '16px', border: formData.paymentMethod === 'card' ? '2px solid #81C784' : '1.5px solid #e5e7eb', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: formData.paymentMethod === 'card' ? '#f0f9f4' : 'white'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <i className="fa fa-credit-card" style={{fontSize: '20px', color: formData.paymentMethod === 'card' ? '#81C784' : '#9ca3af'}}></i>
                        <span style={{fontWeight: '600', fontSize: '14px', color: formData.paymentMethod === 'card' ? '#1a1a1a' : '#6b7280'}}>Carte bancaire</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading} style={{width: '100%', padding: '18px', background: loading ? '#d1d5db' : 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 10px 25px rgba(129,199,132,0.25)', transition: 'all 0.3s', letterSpacing: '0.3px'}} onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}>
                  {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-5">
            <div style={{position: 'sticky', top: '180px'}}>
              <div style={{backgroundColor: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', marginBottom: '20px'}}>
                <h3 style={{fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '24px'}}>Récapitulatif ({cart.length} article{cart.length > 1 ? 's' : ''})</h3>
                <div style={{maxHeight: '280px', overflowY: 'auto', marginBottom: '24px', paddingRight: '8px'}}>
                  {cart.map(item => {
                    const finalPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
                    return (
                      <div key={item._id} style={{display: 'flex', gap: '14px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6'}}>
                        <div style={{width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f9fafb', flexShrink: 0, border: '1px solid #e5e7eb'}}>
                          <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'contain', padding: '8px'}} />
                        </div>
                        <div style={{flex: 1}}>
                          <div style={{fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#1a1a1a', lineHeight: '1.4'}}>{item.name}</div>
                          <div style={{fontSize: '13px', color: '#6b7280', marginBottom: '4px'}}>Quantité: {item.quantity}</div>
                          <div style={{fontSize: '15px', fontWeight: '700', color: '#81C784'}}>{(finalPrice * item.quantity).toFixed(2)} TND</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{borderTop: '2px solid #f3f4f6', paddingTop: '20px', marginBottom: '20px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px'}}>
                    <span style={{color: '#6b7280'}}>Sous-total</span>
                    <span style={{fontWeight: '600', color: '#1a1a1a'}}>{getCartTotal().toFixed(2)} TND</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px'}}>
                    <span style={{color: '#6b7280'}}>Frais de livraison</span>
                    <span style={{fontWeight: '600', color: '#1a1a1a'}}>7.00 TND</span>
                  </div>
                  <div style={{borderTop: '2px solid #f3f4f6', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontSize: '16px', fontWeight: '600', color: '#6b7280'}}>Total à payer</span>
                    <span style={{fontSize: '32px', fontWeight: '800', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{(getCartTotal() + 7).toFixed(2)} TND</span>
                  </div>
                </div>
              </div>
              <div style={{backgroundColor: '#f0f9f4', borderRadius: '16px', padding: '24px', border: '1px solid #d1f4dd'}}>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px'}}>
                  <div style={{width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <i className="fa fa-shield-alt" style={{fontSize: '16px', color: '#66BB6A'}}></i>
                  </div>
                  <div>
                    <div style={{fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px'}}>Paiement sécurisé</div>
                    <div style={{fontSize: '13px', color: '#6b7280', lineHeight: '1.5'}}>Vos données sont protégées</div>
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                  <div style={{width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <i className="fa fa-truck" style={{fontSize: '16px', color: '#66BB6A'}}></i>
                  </div>
                  <div>
                    <div style={{fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px'}}>Livraison rapide</div>
                    <div style={{fontSize: '13px', color: '#6b7280', lineHeight: '1.5'}}>Sous 2-4 jours ouvrables</div>
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
