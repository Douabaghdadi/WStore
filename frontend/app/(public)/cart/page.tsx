"use client";
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div style={{marginTop: '160px', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
        <div style={{textAlign: 'center', backgroundColor: 'white', padding: '60px 80px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)'}}>
          <div style={{width: '120px', height: '120px', margin: '0 auto 30px', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <i className="fa fa-shopping-bag" style={{fontSize: '50px', color: 'white'}}></i>
          </div>
          <h2 style={{fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '15px'}}>Votre panier est vide</h2>
          <p style={{color: '#666', fontSize: '16px', marginBottom: '30px'}}>Découvrez nos produits et commencez vos achats</p>
          <Link href="/" style={{display: 'inline-block', padding: '15px 40px', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', boxShadow: '0 8px 20px rgba(129,199,132,0.3)', transition: 'all 0.3s'}}>
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{marginTop: '160px', backgroundColor: 'white', minHeight: '100vh', paddingBottom: '80px'}}>
      <div className="container py-5">
        <div style={{textAlign: 'center', marginBottom: '50px'}}>
          <h1 style={{fontSize: '42px', fontWeight: '800', background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px'}}>Votre Panier</h1>
          <p style={{color: '#666', fontSize: '16px'}}>{cart.length} article{cart.length > 1 ? 's' : ''} dans votre panier</p>
        </div>
        
        <div className="row g-4">
          <div className="col-lg-8">
            <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #e0e0e0'}}>
              {cart.map((item, index) => {
                const finalPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
                return (
                  <div key={item._id} style={{display: 'flex', gap: '20px', padding: '20px 0', borderBottom: index < cart.length - 1 ? '1px solid #f0f0f0' : 'none'}}>
                    <div style={{position: 'relative', width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fafafa', flexShrink: 0}}>
                      <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'contain', padding: '10px'}} />
                      {item.discount > 0 && (
                        <div style={{position: 'absolute', top: '10px', right: '10px', backgroundColor: '#ff4757', color: 'white', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700'}}>-{item.discount}%</div>
                      )}
                    </div>
                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                      <div>
                        <h4 style={{fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px', lineHeight: '1.4'}}>{item.name}</h4>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px'}}>
                          <div style={{fontSize: '24px', fontWeight: '800', color: '#81C784'}}>{finalPrice.toFixed(2)} TND</div>
                          {item.discount > 0 && (
                            <div style={{fontSize: '16px', color: '#999', textDecoration: 'line-through'}}>{item.price} TND</div>
                          )}
                        </div>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#f8f9fa', padding: '8px 16px', borderRadius: '12px'}}>
                          <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{width: '36px', height: '36px', border: 'none', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#666', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#81C784'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>−</button>
                          <span style={{minWidth: '40px', textAlign: 'center', fontSize: '18px', fontWeight: '700', color: '#1a1a1a'}}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{width: '36px', height: '36px', border: 'none', borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', fontSize: '18px', fontWeight: '700', color: '#666', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#81C784'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item._id)} style={{padding: '10px 20px', backgroundColor: '#fff5f5', color: '#ff4757', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.3s'}} onMouseEnter={(e) => {e.currentTarget.style.backgroundColor = '#ff4757'; e.currentTarget.style.color = 'white';}} onMouseLeave={(e) => {e.currentTarget.style.backgroundColor = '#fff5f5'; e.currentTarget.style.color = '#ff4757';}}>
                          <i className="fa fa-trash" style={{marginRight: '8px'}}></i>Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-lg-4">
            <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', position: 'sticky', top: '180px', border: '1px solid #e0e0e0'}}>
              <h3 style={{fontSize: '24px', fontWeight: '800', marginBottom: '30px', color: '#1a1a1a'}}>Résumé de la commande</h3>
              <div style={{borderTop: '2px solid #f0f0f0', paddingTop: '25px', marginBottom: '25px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '18px', fontSize: '16px', color: '#666'}}>
                  <span>Sous-total</span>
                  <span style={{fontWeight: '700', color: '#1a1a1a'}}>{getCartTotal().toFixed(2)} TND</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '18px', fontSize: '16px', color: '#666'}}>
                  <span>Livraison</span>
                  <span style={{fontWeight: '700', color: '#1a1a1a'}}>7.00 TND</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#f0f9f4', borderRadius: '12px', marginBottom: '20px'}}>
                  <i className="fa fa-truck" style={{fontSize: '20px', color: '#81C784'}}></i>
                  <span style={{fontSize: '13px', color: '#666'}}>Livraison gratuite dès 100 TND</span>
                </div>
                <div style={{borderTop: '2px solid #f0f0f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontSize: '18px', fontWeight: '700', color: '#1a1a1a'}}>Total</span>
                  <span style={{fontSize: '32px', fontWeight: '800', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{(getCartTotal() + 7).toFixed(2)} TND</span>
                </div>
              </div>
              <Link href="/checkout" style={{display: 'block', width: '100%', padding: '18px', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: '14px', fontSize: '18px', fontWeight: '700', marginBottom: '15px', boxShadow: '0 10px 30px rgba(129,199,132,0.3)', transition: 'all 0.3s'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                Passer la commande
              </Link>
              <Link href="/" style={{display: 'block', width: '100%', padding: '18px', backgroundColor: '#f8f9fa', color: '#666', textAlign: 'center', textDecoration: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: '600', transition: 'all 0.3s'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}>
                Continuer vos achats
              </Link>
              <div style={{marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                  <i className="fa fa-shield-alt" style={{fontSize: '18px', color: '#81C784'}}></i>
                  <span style={{fontSize: '13px', color: '#666'}}>Paiement 100% sécurisé</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <i className="fa fa-undo" style={{fontSize: '18px', color: '#81C784'}}></i>
                  <span style={{fontSize: '13px', color: '#666'}}>Retour gratuit sous 14 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
