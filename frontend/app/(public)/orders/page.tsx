"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_URL}/api/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statusColors: any = {
    pending: '#ffc107',
    confirmed: '#17a2b8',
    shipped: '#007bff',
    delivered: '#28a745',
    cancelled: '#dc3545'
  };

  const statusLabels: any = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  if (loading) {
    return (
      <div style={{marginTop: '130px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="spinner-grow text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div style={{marginTop: '130px', backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px'}}>
      <div className="container py-5">
        <h1 style={{fontSize: '36px', fontWeight: '700', marginBottom: '40px'}}>Mes Commandes</h1>
        
        {orders.length === 0 ? (
          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: '0 5px 20px rgba(0,0,0,0.05)'}}>
            <p style={{fontSize: '18px', color: '#999'}}>Vous n'avez pas encore de commandes</p>
          </div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            {orders.map((order: any) => (
              <div key={order._id} style={{backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0'}}>
                  <div>
                    <div style={{fontSize: '14px', color: '#999', marginBottom: '5px'}}>
                      Commande #{order._id.slice(-8)}
                    </div>
                    <div style={{fontSize: '14px', color: '#666'}}>
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div style={{padding: '8px 16px', backgroundColor: statusColors[order.status], color: 'white', borderRadius: '20px', fontSize: '14px', fontWeight: '600'}}>
                    {statusLabels[order.status]}
                  </div>
                </div>
                
                <div style={{marginBottom: '20px'}}>
                  {order.items.map((item: any) => (
                    <div key={item._id} style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                      <img src={item.product.image} alt={item.product.name} style={{width: '60px', height: '60px', objectFit: 'contain', borderRadius: '8px', backgroundColor: '#fafafa'}} />
                      <div style={{flex: 1}}>
                        <div style={{fontSize: '16px', fontWeight: '600', marginBottom: '5px'}}>{item.product.name}</div>
                        <div style={{fontSize: '14px', color: '#666'}}>
                          Quantité: {item.quantity} × {item.price.toFixed(2)} TND
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f0f0f0'}}>
                  <div>
                    <div style={{fontSize: '14px', color: '#666', marginBottom: '5px'}}>Adresse de livraison</div>
                    <div style={{fontSize: '14px', fontWeight: '600'}}>
                      {order.shippingAddress.fullName} - {order.shippingAddress.phone}
                    </div>
                    <div style={{fontSize: '14px', color: '#666'}}>
                      {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
                    </div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '14px', color: '#666', marginBottom: '5px'}}>Total</div>
                    <div style={{fontSize: '24px', fontWeight: '700', color: '#81C784'}}>
                      {order.totalAmount.toFixed(2)} TND
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
