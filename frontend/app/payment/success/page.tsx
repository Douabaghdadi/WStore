"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    const checkPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/payments/status/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await res.json();
        
        if (data.paymentStatus === 'paid') {
          setStatus('success');
          // Récupérer les détails de la commande
          const orderRes = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (orderRes.ok) {
            setOrder(await orderRes.json());
          }
        } else {
          // Attendre un peu et revérifier (le webhook peut prendre du temps)
          setTimeout(checkPayment, 2000);
        }
      } catch (error) {
        setStatus('error');
      }
    };

    checkPayment();
  }, [orderId, router]);

  if (status === 'loading') {
    return (
      <div style={{marginTop: '160px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}></div>
          <p style={{marginTop: '20px', color: '#6b7280'}}>Vérification du paiement en cours...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{marginTop: '160px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', maxWidth: '500px', padding: '40px'}}>
          <div style={{width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'}}>
            <i className="fas fa-times" style={{fontSize: '40px', color: '#dc2626'}}></i>
          </div>
          <h1 style={{fontSize: '24px', fontWeight: '700', color: '#1a365d', marginBottom: '10px'}}>Erreur de vérification</h1>
          <p style={{color: '#6b7280', marginBottom: '30px'}}>Impossible de vérifier le statut du paiement.</p>
          <Link href="/client/orders" style={{padding: '12px 30px', backgroundColor: '#1a365d', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600'}}>
            Voir mes commandes
          </Link>
        </div>
      </div>
    );
  }

  const orderRef = orderId?.slice(-8).toUpperCase();

  return (
    <div style={{marginTop: '160px', backgroundColor: '#fafbfc', minHeight: '100vh', paddingBottom: '80px'}}>
      <div className="container py-5">
        <div style={{maxWidth: '600px', margin: '0 auto', textAlign: 'center'}}>
          <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 10px 40px rgba(16,185,129,0.3)'}}>
            <i className="fas fa-check" style={{fontSize: '50px', color: 'white'}}></i>
          </div>
          
          <h1 style={{fontSize: '32px', fontWeight: '700', color: '#1a365d', marginBottom: '15px'}}>Paiement réussi !</h1>
          <p style={{color: '#6b7280', fontSize: '16px', marginBottom: '30px'}}>
            Merci pour votre commande. Votre paiement a été traité avec succès.
          </p>

          <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', marginBottom: '30px'}}>
            <div style={{marginBottom: '20px'}}>
              <span style={{color: '#6b7280', fontSize: '14px'}}>Référence de commande</span>
              <div style={{fontSize: '24px', fontWeight: '700', color: '#1a365d'}}>#{orderRef}</div>
            </div>
            
            {order && (
              <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                  <span style={{color: '#6b7280'}}>Montant payé</span>
                  <span style={{fontWeight: '700', color: '#10b981'}}>{order.totalAmount?.toFixed(3)} DT</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#6b7280'}}>Statut</span>
                  <span style={{fontWeight: '600', color: '#10b981'}}>Confirmée</span>
                </div>
              </div>
            )}
          </div>

          <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
            <Link href="/client/orders" style={{padding: '14px 30px', backgroundColor: '#1a365d', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: '600'}}>
              Voir mes commandes
            </Link>
            <Link href="/shop" style={{padding: '14px 30px', backgroundColor: 'white', color: '#1a365d', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', border: '2px solid #1a365d'}}>
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
