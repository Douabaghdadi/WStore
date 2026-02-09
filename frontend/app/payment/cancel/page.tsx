"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderRef = orderId?.slice(-8).toUpperCase();

  return (
    <div style={{marginTop: '160px', backgroundColor: '#fafbfc', minHeight: '100vh', paddingBottom: '80px'}}>
      <div className="container py-5">
        <div style={{maxWidth: '600px', margin: '0 auto', textAlign: 'center'}}>
          <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 10px 40px rgba(245,158,11,0.3)'}}>
            <i className="fas fa-exclamation-triangle" style={{fontSize: '45px', color: 'white'}}></i>
          </div>
          
          <h1 style={{fontSize: '32px', fontWeight: '700', color: '#1a365d', marginBottom: '15px'}}>Paiement annulé</h1>
          <p style={{color: '#6b7280', fontSize: '16px', marginBottom: '30px'}}>
            Votre paiement a été annulé. Votre commande est toujours en attente.
          </p>

          {orderRef && (
            <div style={{backgroundColor: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', marginBottom: '30px'}}>
              <span style={{color: '#6b7280', fontSize: '14px'}}>Référence de commande</span>
              <div style={{fontSize: '20px', fontWeight: '700', color: '#1a365d'}}>#{orderRef}</div>
              <p style={{color: '#6b7280', fontSize: '14px', marginTop: '10px', marginBottom: 0}}>
                Vous pouvez réessayer le paiement depuis vos commandes
              </p>
            </div>
          )}

          <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/client/orders" style={{padding: '14px 30px', backgroundColor: '#1a365d', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: '600'}}>
              Voir mes commandes
            </Link>
            <Link href="/checkout" style={{padding: '14px 30px', backgroundColor: '#c53030', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: '600'}}>
              Réessayer le paiement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div style={{marginTop: '160px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div className="spinner-border text-warning" role="status" style={{width: '3rem', height: '3rem'}}></div>
          <p style={{marginTop: '20px', color: '#6b7280'}}>Chargement...</p>
        </div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
