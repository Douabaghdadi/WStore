"use client";
import { useCart } from '../context/CartContext';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  return (
    <>
      {isOpen && (
        <div onClick={onClose} style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9998}} />
      )}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : '-400px',
        width: '400px',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '-5px 0 15px rgba(0,0,0,0.2)',
        transition: 'right 0.3s ease',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{padding: '20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3 style={{fontSize: '20px', fontWeight: '700', margin: 0}}>Mon Panier ({cart.length})</h3>
          <button onClick={onClose} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666'}}>×</button>
        </div>

        <div style={{flex: 1, overflowY: 'auto', padding: '20px'}}>
          {cart.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px 0', color: '#999'}}>
              <i className="fa fa-shopping-bag" style={{fontSize: '48px', marginBottom: '15px', display: 'block'}}></i>
              Votre panier est vide
            </div>
          ) : (
            cart.map(item => {
              const finalPrice = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
              return (
                <div key={item._id} style={{display: 'flex', gap: '15px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0'}}>
                  <img src={item.image} alt={item.name} style={{width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#fafafa'}} />
                  <div style={{flex: 1}}>
                    <h4 style={{fontSize: '14px', fontWeight: '600', marginBottom: '5px'}}>{item.name}</h4>
                    <div style={{fontSize: '14px', fontWeight: '700', color: '#81C784', marginBottom: '10px'}}>
                      {finalPrice.toFixed(2)} TND
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} style={{width: '25px', height: '25px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px'}}>-</button>
                      <span style={{minWidth: '20px', textAlign: 'center', fontSize: '14px'}}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{width: '25px', height: '25px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px'}}>+</button>
                      <button onClick={() => removeFromCart(item._id)} style={{marginLeft: 'auto', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div style={{padding: '20px', borderTop: '1px solid #f0f0f0'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '18px', fontWeight: '700'}}>
              <span>Total</span>
              <span style={{color: '#81C784'}}>{getCartTotal().toFixed(2)} TND</span>
            </div>
            <Link href="/cart" onClick={onClose} style={{display: 'block', width: '100%', padding: '12px', backgroundColor: '#81C784', color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', marginBottom: '10px'}}>
              Voir le panier
            </Link>
            <Link href="/checkout" onClick={onClose} style={{display: 'block', width: '100%', padding: '12px', backgroundColor: '#333', color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600'}}>
              Commander
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
