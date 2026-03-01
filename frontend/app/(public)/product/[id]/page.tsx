'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductReviews from '../../../components/ProductReviews';
import StarRating from '../../../components/StarRating';
import { useCart } from '../../../context/CartContext';
import { useFavorites } from '../../../context/FavoritesContext';
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    fetch(`${API_URL}/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="container-fluid py-5" style={{marginTop: '130px', background: '#f7fafc', minHeight: '100vh'}}>
        <div className="text-center py-5">
          <div className="spinner-border" style={{color: '#c53030'}} role="status"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-fluid py-5" style={{marginTop: '130px'}}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(197, 48, 48, 0.1) 0%, rgba(197, 48, 48, 0.05) 100%)',
          border: '1px solid rgba(197, 48, 48, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          color: '#c53030'
        }}>Produit non trouvé</div>
      </div>
    );
  }

  const finalPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  const handleAddToCart = () => {
    if (product.stock > 0) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  return (
    <div style={{marginTop: '130px', backgroundColor: '#f7fafc', minHeight: '100vh'}}>
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" style={{marginBottom: '30px'}}>
          <ol className="breadcrumb" style={{backgroundColor: 'transparent', padding: 0, margin: 0}}>
            <li className="breadcrumb-item">
              <Link href="/" style={{color: '#718096', textDecoration: 'none', fontWeight: '500'}}>Accueil</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/shop" style={{color: '#718096', textDecoration: 'none', fontWeight: '500'}}>Boutique</Link>
            </li>
            {product.category && (
              <li className="breadcrumb-item">
                <span style={{color: '#718096'}}>{product.category.name}</span>
              </li>
            )}
            <li className="breadcrumb-item active" style={{color: '#1a202c', fontWeight: '600'}}>{product.name}</li>
          </ol>
        </nav>

        {/* Product Card */}
        <div style={{
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          <div className="row g-0">
            {/* Product Image */}
            <div className="col-lg-6">
              <div style={{
                padding: '50px', 
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                position: 'relative',
                minHeight: '550px'
              }}>
                <img 
                  src={product.image ? (product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`) : '/img/product-placeholder.jpg'}
                  style={{maxWidth: '95%', maxHeight: '600px', objectFit: 'contain', borderRadius: '12px'}} 
                  alt={product.name} 
                />
                {product.discount > 0 && (
                  <div style={{
                    position: 'absolute', 
                    top: '20px', 
                    left: '20px',
                    background: 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 4px 15px rgba(197, 48, 48, 0.3)'
                  }}>
                    -{product.discount}%
                  </div>
                )}
                {product.stock === 0 && (
                  <div style={{
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px',
                    background: '#718096',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 4px 15px rgba(113, 128, 150, 0.3)'
                  }}>
                    Rupture de stock
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="col-lg-6">
              <div style={{padding: '30px'}}>
                {product.brand && (
                  <div style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, rgba(26, 54, 93, 0.1) 0%, rgba(26, 54, 93, 0.05) 100%)',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    marginBottom: '10px'
                  }}>
                    <span style={{color: '#1a365d', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase'}}>
                      {product.brand.name}
                    </span>
                  </div>
                )}
                
                <h1 style={{
                  fontSize: '24px', 
                  fontWeight: '700', 
                  color: '#1a202c', 
                  marginBottom: '15px', 
                  lineHeight: '1.3'
                }}>{product.name}</h1>
                
                {/* Rating */}
                <div style={{marginBottom: '15px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <StarRating rating={product.rating || 0} readonly size={16} />
                    <span style={{color: '#718096', fontSize: '13px', fontWeight: '500'}}>
                      ({product.ratingCount || 0} avis)
                    </span>
                  </div>
                </div>

                {/* Subcategories */}
                {product.subcategories && product.subcategories.length > 0 && (
                  <div style={{marginBottom: '15px'}}>
                    {product.subcategories.map((sub: any) => (
                      <span key={sub._id} style={{
                        display: 'inline-block', 
                        backgroundColor: '#f7fafc', 
                        color: '#4a5568', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        marginRight: '6px', 
                        marginBottom: '6px',
                        border: '1px solid #e2e8f0'
                      }}>{sub.name}</span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div style={{
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)', 
                  padding: '18px', 
                  borderRadius: '12px', 
                  marginBottom: '20px',
                  border: '1px solid #e2e8f0'
                }}>
                  {product.discount > 0 ? (
                    <>
                      <div style={{fontSize: '14px', color: '#a0aec0', textDecoration: 'line-through', marginBottom: '3px'}}>
                        {product.price.toFixed(3)} DT
                      </div>
                      <div style={{fontSize: '28px', fontWeight: '800', color: '#c53030', marginBottom: '6px'}}>
                        {finalPrice} <span style={{fontSize: '16px', color: '#718096'}}>DT</span>
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(72, 187, 120, 0.05) 100%)',
                        color: '#276749',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        <i className="fas fa-check-circle"></i>
                        Économisez {(product.price - parseFloat(finalPrice)).toFixed(3)} DT
                      </div>
                    </>
                  ) : (
                    <div style={{fontSize: '28px', fontWeight: '800', color: '#1a365d'}}>
                      {product.price.toFixed(3)} <span style={{fontSize: '16px', color: '#718096'}}>DT</span>
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                {product.stock === 0 && (
                  <div style={{
                    marginBottom: '15px',
                    padding: '12px 16px',
                    background: 'linear-gradient(135deg, rgba(113, 128, 150, 0.1) 0%, rgba(113, 128, 150, 0.05) 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: '1px solid rgba(113, 128, 150, 0.2)'
                  }}>
                    <i className="fas fa-times-circle" style={{color: '#718096', fontSize: '18px'}}></i>
                    <div>
                      <span style={{color: '#4a5568', fontSize: '14px', fontWeight: '700', display: 'block'}}>
                        Rupture de stock
                      </span>
                      <span style={{color: '#718096', fontSize: '12px'}}>
                        Ce produit n'est plus disponible actuellement
                      </span>
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div style={{marginBottom: '15px'}}>
                  <label style={{display: 'block', marginBottom: '8px', color: '#4a5568', fontWeight: '600', fontSize: '13px'}}>
                    Quantité
                  </label>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0',
                    background: '#f7fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                  }}>
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{
                        width: '36px',
                        height: '36px',
                        border: 'none',
                        background: 'transparent',
                        color: '#1a365d',
                        fontWeight: '700',
                        fontSize: '16px',
                        cursor: 'pointer'
                      }}
                    >-</button>
                    <span style={{
                      width: '40px',
                      textAlign: 'center',
                      fontWeight: '700',
                      fontSize: '14px',
                      color: '#1a202c'
                    }}>{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      style={{
                        width: '36px',
                        height: '36px',
                        border: 'none',
                        background: 'transparent',
                        color: '#1a365d',
                        fontWeight: '700',
                        fontSize: '16px',
                        cursor: 'pointer'
                      }}
                    >+</button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCart}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: product.stock === 0 ? '#cbd5e0' : 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: product.stock === 0 ? 'none' : '0 6px 20px rgba(197, 48, 48, 0.25)'
                  }}
                  disabled={product.stock === 0}
                >
                  <i className="fa fa-shopping-cart" style={{marginRight: '10px'}}></i>
                  {product.stock > 0 ? 'Ajouter au panier' : 'Produit indisponible'}
                </button>

                {/* Wishlist Button */}
                <button 
                  onClick={() => {
                    if (isFavorite(product._id)) {
                      removeFavorite(product._id);
                    } else {
                      addFavorite(product._id);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: isFavorite(product._id) ? 'rgba(197, 48, 48, 0.05)' : 'white',
                    color: isFavorite(product._id) ? '#c53030' : '#4a5568',
                    border: isFavorite(product._id) ? '2px solid #c53030' : '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '10px'
                  }}
                >
                  <i className={isFavorite(product._id) ? "fas fa-heart" : "far fa-heart"} style={{marginRight: '10px'}}></i>
                  {isFavorite(product._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                </button>

                {/* Features */}
                <div style={{marginTop: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                  {[
                    { icon: 'fa-truck', text: 'Livraison rapide' },
                    { icon: 'fa-shield-alt', text: 'Garantie officielle' },
                    { icon: 'fa-undo', text: 'Retour 14 jours' }
                  ].map((feature, index) => (
                    <div key={index} style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <i className={`fas ${feature.icon}`} style={{color: '#1a365d', fontSize: '12px'}}></i>
                      <span style={{color: '#718096', fontSize: '12px', fontWeight: '500'}}>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{
          backgroundColor: 'white', 
          borderRadius: '14px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
          padding: '25px', 
          marginTop: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#1a202c', 
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              width: '3px',
              height: '18px',
              background: 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)',
              borderRadius: '2px'
            }}></span>
            Description du produit
          </h3>
          <p style={{
            fontSize: '14px', 
            lineHeight: '1.7', 
            color: '#4a5568', 
            whiteSpace: 'pre-line'
          }}>{product.description}</p>
        </div>

        {/* Reviews */}
        <div style={{
          backgroundColor: 'white', 
          borderRadius: '14px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)', 
          padding: '25px', 
          marginTop: '20px', 
          marginBottom: '40px',
          border: '1px solid #e2e8f0'
        }}>
          <ProductReviews productId={product._id} />
        </div>
      </div>
    </div>
  );
}
