import { Suspense } from 'react';

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div style={{marginTop: '160px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
}
