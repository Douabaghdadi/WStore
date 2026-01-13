'use client';
import Link from 'next/link';
import { useState } from 'react';

const stores = [
  {
    id: 'korba',
    name: 'W.Store Korba',
    address: 'Cité Commerciale, Korba',
    city: 'Korba',
    phone: '+216 52 255 145',
    hours: 'Lun - Sam: 9h00 - 19h00',
    image: '/img/stores/store-korba.jpg',
    mapUrl: 'https://www.google.com/maps/search/W+Store+Korba'
  },
  {
    id: 'dar-chaabene',
    name: 'W.Store Dar Chaâbene',
    address: 'Rue Taher Sfar, Dar Chaâbene El Fehri',
    city: 'Dar Chaâbene El Fehri',
    phone: '+216 52 255 145',
    hours: 'Lun - Sam: 9h00 - 19h00',
    image: '/img/stores/store-dar-chaabene.jpg',
    mapUrl: 'https://www.google.com/maps/search/W+Store+Dar+Chaabene'
  }
];

function StoreCard({ store }: { store: typeof stores[0] }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
      height: '100%'
    }}>
      {/* Store Image */}
      <div style={{
        height: '200px',
        position: 'relative',
        background: '#e2e8f0'
      }}>
        {!imageError ? (
          <img 
            src={store.image}
            alt={store.name}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)'
          }}>
            <i className="fas fa-store" style={{ fontSize: '60px', color: '#a0aec0' }}></i>
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          background: '#c53030',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '700',
          zIndex: 2
        }}>
          <i className="fas fa-map-marker-alt me-2"></i>{store.city}
        </div>
      </div>

      {/* Store Info */}
      <div style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
          {store.name}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Address */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <i className="fas fa-map-marker-alt" style={{ color: 'white', fontSize: '18px' }}></i>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>Adresse</p>
              <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>{store.address}</p>
            </div>
          </div>

          {/* Phone */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <i className="fas fa-phone-alt" style={{ color: 'white', fontSize: '18px' }}></i>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>Téléphone</p>
              <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>{store.phone}</p>
            </div>
          </div>

          {/* Hours */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
            <div style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <i className="fas fa-clock" style={{ color: 'white', fontSize: '18px' }}></i>
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>Horaires</p>
              <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>{store.hours}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
          <a 
            href={store.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
              color: 'white',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 15px rgba(197, 48, 48, 0.3)'
            }}
          >
            <i className="fas fa-directions"></i>
            Itinéraire
          </a>
          <a 
            href={`tel:${store.phone.replace(/\s/g, '')}`}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 20px',
              background: 'white',
              color: '#1a365d',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              border: '2px solid #1a365d'
            }}
          >
            <i className="fas fa-phone-alt"></i>
            Appeler
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MagasinsPage() {
  return (
    <div style={{ marginTop: '150px', minHeight: '100vh', background: '#f7fafc' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)',
        padding: '60px 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px' }}>
            Nos <span style={{ color: '#e53e3e' }}>Magasins</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            Retrouvez-nous dans nos deux points de vente pour découvrir nos produits et bénéficier de conseils personnalisés
          </p>
        </div>
      </div>

      {/* Stores Section */}
      <div className="container" style={{ padding: '50px 15px' }}>
        <div className="row g-4">
          {stores.map((store) => (
            <div key={store.id} id={store.id} className="col-lg-6">
              <StoreCard store={store} />
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div style={{
          marginTop: '50px',
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px' }}>
            Besoin d'aide ?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', marginBottom: '25px', maxWidth: '500px', margin: '0 auto 25px' }}>
            Notre équipe est disponible pour vous conseiller et répondre à toutes vos questions
          </p>
          <Link href="/contact" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 30px',
            background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
            color: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '14px'
          }}>
            <i className="fas fa-envelope"></i>
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
