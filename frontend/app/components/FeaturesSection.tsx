'use client';

export default function FeaturesSection() {
  const features = [
    { icon: 'fa-truck', title: 'Livraison Rapide', desc: 'Gratuite dès 200 DT', gradient: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)', shadow: 'rgba(26, 54, 93, 0.4)' },
    { icon: 'fa-shield-alt', title: 'Garantie Officielle', desc: 'Produits 100% garantis', gradient: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', shadow: 'rgba(197, 48, 48, 0.4)' },
    { icon: 'fa-credit-card', title: 'Paiement Sécurisé', desc: 'Transactions protégées', gradient: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)', shadow: 'rgba(26, 54, 93, 0.4)' },
    { icon: 'fa-headset', title: 'Support 24/7', desc: 'À votre écoute', gradient: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)', shadow: 'rgba(197, 48, 48, 0.4)' }
  ];

  return (
    <div style={{ background: 'linear-gradient(180deg, #f7fafc 0%, #edf2f7 100%)', padding: '70px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(26, 54, 93, 0.1)',
            color: '#1a365d',
            padding: '8px 20px',
            borderRadius: '30px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '15px'
          }}>
            Pourquoi Nous Choisir
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1a202c' }}>
            Nos <span style={{ color: '#c53030' }}>Engagements</span>
          </h2>
        </div>
        <div className="row g-4 justify-content-center">
          {features.map((f, i) => (
            <div key={i} className="col-6 col-md-3">
              <div style={{ 
                background: 'white', 
                borderRadius: '24px', 
                padding: '40px 20px', 
                textAlign: 'center',
                boxShadow: '0 10px 40px rgba(0,0,0,0.06)', 
                border: '1px solid rgba(0,0,0,0.04)',
                height: '100%'
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: f.gradient, 
                  borderRadius: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 25px',
                  boxShadow: `0 15px 35px ${f.shadow}`
                }}>
                  <i className={`fas ${f.icon}`} style={{ fontSize: '32px', color: 'white' }}></i>
                </div>
                <h6 style={{ fontWeight: '700', color: '#1a202c', marginBottom: '10px', fontSize: '17px' }}>{f.title}</h6>
                <p style={{ color: '#718096', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
