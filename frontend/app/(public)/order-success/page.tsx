"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderRef, setOrderRef] = useState('');

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (!ref) {
      router.push('/');
      return;
    }
    setOrderRef(ref);
  }, [searchParams]);

  return (
    <div style={{marginTop: '160px', backgroundColor: '#fafbfc', minHeight: '100vh', paddingBottom: '80px'}}>
      <div className="container py-5">
        <div style={{maxWidth: '700px', margin: '0 auto', textAlign: 'center'}}>
          <div style={{width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 20px 60px rgba(129,199,132,0.3)'}}>
            <i className="fa fa-check" style={{fontSize: '60px', color: 'white'}}></i>
          </div>
          
          <h1 style={{fontSize: '42px', fontWeight: '800', color: '#1a1a1a', marginBottom: '16px'}}>Commande confirmée !</h1>
          <p style={{fontSize: '18px', color: '#6b7280', marginBottom: '40px', lineHeight: '1.6'}}>Merci pour votre commande. Nous avons bien reçu votre demande et nous la traitons dans les plus brefs délais.</p>
          
          <div style={{backgroundColor: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb', marginBottom: '30px'}}>
            <div style={{marginBottom: '24px'}}>
              <span style={{fontSize: '14px', color: '#6b7280', display: 'block', marginBottom: '8px'}}>Référence de commande</span>
              <div style={{display: 'inline-block', padding: '12px 24px', backgroundColor: '#f0f9f4', borderRadius: '12px', border: '2px dashed #81C784'}}>
                <span style={{fontSize: '24px', fontWeight: '800', color: '#1a1a1a', letterSpacing: '1px'}}>#{orderRef}</span>
              </div>
            </div>
            
            <div style={{borderTop: '2px solid #f3f4f6', paddingTop: '24px', marginTop: '24px'}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'left'}}>
                <div style={{padding: '20px', backgroundColor: '#fafbfc', borderRadius: '12px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <i className="fa fa-envelope" style={{fontSize: '18px', color: '#81C784'}}></i>
                    <span style={{fontSize: '14px', fontWeight: '600', color: '#1a1a1a'}}>Email de confirmation</span>
                  </div>
                  <p style={{fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5'}}>Vous recevrez un email avec les détails</p>
                </div>
                <div style={{padding: '20px', backgroundColor: '#fafbfc', borderRadius: '12px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
                    <i className="fa fa-truck" style={{fontSize: '18px', color: '#81C784'}}></i>
                    <span style={{fontSize: '14px', fontWeight: '600', color: '#1a1a1a'}}>Livraison estimée</span>
                  </div>
                  <p style={{fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.5'}}>2-4 jours ouvrables</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/orders" style={{padding: '16px 32px', background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', boxShadow: '0 8px 20px rgba(129,199,132,0.25)', display: 'inline-block'}}>
              Voir mes commandes
            </Link>
            <Link href="/" style={{padding: '16px 32px', backgroundColor: 'white', color: '#1a1a1a', textDecoration: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', border: '2px solid #e5e7eb', display: 'inline-block'}}>
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
