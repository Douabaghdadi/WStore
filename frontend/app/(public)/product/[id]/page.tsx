'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductReviews from '../../../components/ProductReviews';
import StarRating from '../../../components/StarRating';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="container-fluid py-5" style={{marginTop: '160px'}}>
        <div className="text-center py-5">
          <div className="spinner-grow text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-fluid py-5" style={{marginTop: '160px'}}>
        <div className="alert alert-danger">Produit non trouvé</div>
      </div>
    );
  }

  const finalPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  return (
    <div style={{marginTop: '160px', backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
      <div className="container py-5">
        <nav aria-label="breadcrumb" style={{marginBottom: '30px'}}>
          <ol className="breadcrumb" style={{backgroundColor: 'transparent', padding: 0}}>
            <li className="breadcrumb-item"><Link href="/" style={{color: '#81C784', textDecoration: 'none'}}>Accueil</Link></li>
            <li className="breadcrumb-item"><span style={{color: '#666'}}>{product.category?.name}</span></li>
            <li className="breadcrumb-item active" style={{color: '#333'}}>{product.name}</li>
          </ol>
        </nav>

        <div style={{backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', overflow: 'hidden'}}>
          <div className="row g-0">
            <div className="col-lg-6">
              <div style={{padding: '40px', backgroundColor: '#fafafa', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                <img src={product.image} style={{maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '12px'}} alt={product.name} />
                {product.discount > 0 && (
                  <div style={{position: 'absolute', top: '30px', right: '30px'}}>
                    <span style={{backgroundColor: '#dc3545', color: 'white', padding: '12px 20px', borderRadius: '50px', fontSize: '18px', fontWeight: '700', boxShadow: '0 4px 15px rgba(220,53,69,0.3)'}}>-{product.discount}%</span>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div style={{padding: '50px'}}>
                {product.brand && (
                  <p style={{color: '#999', fontSize: '13px', fontWeight: '500', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px'}}>
                    Marque: <span style={{color: '#81C784', fontWeight: '700'}}>{product.brand.name}</span>
                  </p>
                )}
                
                <h1 style={{fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px', lineHeight: '1.3'}}>{product.name}</h1>
                
                <div style={{marginBottom: '25px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <StarRating rating={product.rating || 0} readonly size={22} />
                    <span style={{color: '#666', fontSize: '15px', fontWeight: '500'}}>
                      ({product.ratingCount || 0} avis clients)
                    </span>
                  </div>
                </div>

                {product.subcategories && product.subcategories.length > 0 && (
                  <div style={{marginBottom: '30px'}}>
                    {product.subcategories.map((sub: any) => (
                      <span key={sub._id} style={{display: 'inline-block', backgroundColor: '#f0f0f0', color: '#555', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', marginRight: '8px', marginBottom: '8px'}}>{sub.name}</span>
                    ))}
                  </div>
                )}

                <div style={{backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '12px', marginBottom: '30px'}}>
                  {product.discount > 0 ? (
                    <>
                      <div style={{fontSize: '20px', color: '#999', textDecoration: 'line-through', marginBottom: '8px'}}>{product.price} TND</div>
                      <div style={{fontSize: '42px', fontWeight: '700', color: '#81C784', marginBottom: '10px'}}>{finalPrice} TND</div>
                      <div style={{color: '#81C784', fontSize: '15px', fontWeight: '600'}}>
                        ✓ Économisez {(product.price - finalPrice).toFixed(2)} TND
                      </div>
                    </>
                  ) : (
                    <div style={{fontSize: '42px', fontWeight: '700', color: '#1a1a1a'}}>{product.price} TND</div>
                  )}
                </div>

                <button 
                  style={{
                    width: '100%',
                    padding: '18px',
                    backgroundColor: product.stock === 0 ? '#ccc' : '#81C784',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '700',
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: product.stock === 0 ? 'none' : '0 4px 20px rgba(129,199,132,0.3)',
                    letterSpacing: '0.5px'
                  }}
                  disabled={product.stock === 0}
                  onMouseEnter={(e) => !product.stock && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <i className="fa fa-shopping-bag" style={{marginRight: '12px'}}></i>
                  {product.stock > 0 ? 'Ajouter au panier' : 'Produit indisponible'}
                </button>

                {product.stock > 0 && product.stock < 10 && (
                  <p style={{marginTop: '15px', color: '#ff6b6b', fontSize: '14px', fontWeight: '600', textAlign: 'center'}}>
                    ⚠️ Plus que {product.stock} en stock
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', padding: '50px', marginTop: '30px'}}>
          <h3 style={{fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '25px', borderBottom: '3px solid #81C784', paddingBottom: '15px', display: 'inline-block'}}>Description</h3>
          <p style={{fontSize: '16px', lineHeight: '1.8', color: '#555', whiteSpace: 'pre-line', marginTop: '20px'}}>{product.description}</p>
        </div>

        <div style={{backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', padding: '50px', marginTop: '30px', marginBottom: '50px'}}>
          <ProductReviews productId={product._id} />
        </div>
      </div>
    </div>
  );
}
