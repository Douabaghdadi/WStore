'use client';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";


interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    discount?: number;
    image?: string;
    stock?: number;
    brand?: { name: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  
  const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
  const isFav = favorites.includes(product._id);

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: finalPrice,
      image: product.image || '/img/product-placeholder.jpg',
      quantity: quantity
    });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <div 
      className="product-card"
      style={{
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
        flexShrink: 0
      }}
    >
      {/* Image Container */}
      <div style={{ position: 'relative', background: '#f7fafc', height: '240px' }}>
        <Link href={`/product/${product._id}`}>
          <img 
            src={product.image?.startsWith('http') ? product.image : product.image ? `${process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn"}${product.image}` : '/img/product-placeholder.jpg'}
            alt={product.name} 
            style={{ width: '100%', height: '240px', objectFit: 'contain', padding: '20px' }} 
          />
        </Link>
        
        {/* Discount Badge */}
        {(product.discount ?? 0) > 0 && (
          <span style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            background: '#1a365d',
            color: 'white', 
            padding: '6px 10px', 
            borderRadius: '8px', 
            fontSize: '12px', 
            fontWeight: '800'
          }}>
            -{product.discount}%
          </span>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (isFav) {
              removeFavorite(product._id);
            } else {
              addFavorite(product._id);
            }
          }}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: isFav ? '#fee2e2' : 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          <i 
            className={isFav ? 'fas fa-heart' : 'far fa-heart'} 
            style={{ 
              color: isFav ? '#dc2626' : '#64748b',
              fontSize: '14px'
            }}
          ></i>
        </button>
      </div>

      {/* Product Info */}
      <div style={{ padding: '18px' }}>
        <Link href={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <h6 style={{ 
            fontWeight: '600', 
            color: '#1e293b', 
            fontSize: '14px', 
            height: '42px', 
            overflow: 'hidden', 
            marginBottom: '10px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {product.name}
          </h6>
        </Link>
        
        {/* Stock Badge */}
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px', 
          marginBottom: '12px',
          background: (product.stock ?? 0) > 0 ? '#dcfce7' : '#fee2e2', 
          padding: '4px 10px', 
          borderRadius: '20px' 
        }}>
          <span style={{ 
            width: '6px', 
            height: '6px', 
            borderRadius: '50%', 
            background: (product.stock ?? 0) > 0 ? '#22c55e' : '#ef4444' 
          }}></span>
          <span style={{ 
            color: (product.stock ?? 0) > 0 ? '#16a34a' : '#dc2626', 
            fontSize: '11px', 
            fontWeight: '600' 
          }}>
            {(product.stock ?? 0) > 0 ? 'En stock' : 'Rupture'}
          </span>
        </div>
        
        {/* Brand */}
        <p style={{ 
          color: '#64748b', 
          fontSize: '11px', 
          fontWeight: '600', 
          textTransform: 'uppercase', 
          marginBottom: '8px' 
        }}>
          {product.brand?.name || '\u00A0'}
        </p>
        
        {/* Price */}
        <div className="price" style={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          gap: '10px', 
          marginBottom: '16px' 
        }}>
          {(product.discount ?? 0) > 0 && (
            <span style={{ 
              fontSize: '13px', 
              color: '#94a3b8', 
              textDecoration: 'line-through' 
            }}>
              {product.price.toFixed(3)}
            </span>
          )}
          <span style={{ 
            fontSize: '20px', 
            fontWeight: '800', 
            color: (product.discount ?? 0) > 0 ? '#16a34a' : '#1a365d' 
          }}>
            {finalPrice.toFixed(3)}
          </span>
          <span style={{ 
            fontSize: '12px', 
            color: '#64748b', 
            fontWeight: '600' 
          }}>
            DT
          </span>
        </div>
        
        {/* Quantity Selector + Add to Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            className="quantity-selector"
            style={{
              display: 'flex', 
              alignItems: 'center', 
              background: '#f1f5f9',
              borderRadius: '8px', 
              padding: '3px', 
              flexShrink: 0
            }}
          >
            <button 
              onClick={() => handleQuantityChange(-1)} 
              style={{
                width: '28px', 
                height: '28px', 
                border: 'none', 
                background: 'white',
                color: '#1a365d', 
                borderRadius: '6px', 
                cursor: 'pointer',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: '700', 
                fontSize: '14px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              -
            </button>
            <span style={{ 
              color: '#1e293b', 
              fontWeight: '700', 
              minWidth: '28px', 
              textAlign: 'center', 
              fontSize: '13px' 
            }}>
              {quantity}
            </span>
            <button 
              onClick={() => handleQuantityChange(1)} 
              style={{
                width: '28px', 
                height: '28px', 
                border: 'none', 
                background: 'white',
                color: '#1a365d', 
                borderRadius: '6px', 
                cursor: 'pointer',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: '700', 
                fontSize: '14px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              +
            </button>
          </div>
          
          <button 
            onClick={handleAddToCart} 
            disabled={(product.stock ?? 0) === 0} 
            className="add-to-cart-btn"
            style={{
              flex: 1, 
              border: 'none', 
              background: (product.stock ?? 0) > 0 ? '#1a365d' : '#cbd5e1',
              color: 'white', 
              borderRadius: '8px', 
              padding: '10px', 
              cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
              fontSize: '11px', 
              fontWeight: '700', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px'
            }}
          >
            <i className="fas fa-shopping-cart" style={{ fontSize: '10px' }}></i> Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
