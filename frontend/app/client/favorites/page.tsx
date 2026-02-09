"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "../../context/FavoritesContext";
import { useCart } from "../../context/CartContext";
import { API_URL } from "../../../lib/api";

export default function FavoritesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Erreur:", err);
      }
      setLoading(false);
    };

    fetchFavoriteProducts();
  }, [favorites]);

  const handleRemoveFavorite = async (productId: string) => {
    await removeFavorite(productId);
    setProducts(products.filter((p) => p._id !== productId));
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div className="spinner-grow" style={{ color: "#1a365d" }} role="status"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: "25px 30px" }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: "center",
        marginBottom: "30px",
        paddingTop: "10px"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          background: "linear-gradient(135deg, #c53030 0%, #e53e3e 100%)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 12px",
          boxShadow: "0 4px 15px rgba(197,48,48,0.25)"
        }}>
          <i className="fas fa-heart" style={{ fontSize: "22px", color: "white" }}></i>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1a365d", margin: "0 0 5px 0" }}>
          Mes Favoris
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
          {products.length} produit{products.length > 1 ? "s" : ""} sauvegardé{products.length > 1 ? "s" : ""}
        </p>
      </div>

      {products.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 30px",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 2px 15px rgba(0,0,0,0.04)"
        }}>
          <div style={{
            width: "90px",
            height: "90px",
            background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 25px"
          }}>
            <i className="far fa-heart" style={{ fontSize: "36px", color: "#ccc" }}></i>
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1a365d", marginBottom: "10px" }}>
            Votre liste de favoris est vide
          </h3>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "25px", maxWidth: "350px", margin: "0 auto 25px" }}>
            Explorez notre catalogue et ajoutez vos produits préférés pour les retrouver facilement.
          </p>
          <Link 
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 25px",
              background: "linear-gradient(135deg, #c53030 0%, #e53e3e 100%)",
              color: "white",
              textDecoration: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              boxShadow: "0 6px 20px rgba(197,48,48,0.25)"
            }}
          >
            <i className="fas fa-shopping-bag"></i>
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {products.map((product) => {
            const finalPrice = product.discount > 0
              ? (product.price * (1 - product.discount / 100)).toFixed(3)
              : product.price.toFixed(3);
            const imgSrc = product.image?.startsWith('http') ? product.image : `${API_URL}${product.image}`;

            return (
              <div 
                key={product._id} 
                style={{
                  background: "white",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 2px 15px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 15px rgba(0,0,0,0.05)";
                }}
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFavorite(product._id)}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "white",
                    border: "none",
                    cursor: "pointer",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#c53030";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#666";
                  }}
                  title="Retirer des favoris"
                >
                  <i className="fas fa-times" style={{ fontSize: "12px" }}></i>
                </button>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "linear-gradient(135deg, #c53030 0%, #e53e3e 100%)",
                    color: "white",
                    padding: "5px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    zIndex: 10
                  }}>
                    -{product.discount}%
                  </div>
                )}

                {/* Product Image */}
                <Link href={`/product/${product._id}`}>
                  <div style={{
                    background: "#f8f9fa",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px"
                  }}>
                    <img
                      src={imgSrc}
                      alt={product.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "160px",
                        objectFit: "contain"
                      }}
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div style={{ padding: "18px" }}>
                  {/* Brand */}
                  {product.brand?.name && (
                    <span style={{
                      display: "inline-block",
                      background: "linear-gradient(135deg, #1a365d 0%, #2c5282 100%)",
                      color: "white",
                      padding: "4px 10px",
                      borderRadius: "15px",
                      fontSize: "10px",
                      fontWeight: "600",
                      marginBottom: "10px",
                      textTransform: "uppercase"
                    }}>
                      {product.brand.name}
                    </span>
                  )}

                  {/* Product Name */}
                  <Link href={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                    <h4 style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1a1a1a",
                      marginBottom: "12px",
                      lineHeight: "1.4",
                      height: "40px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#1a365d"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#1a1a1a"}
                    >
                      {product.name}
                    </h4>
                  </Link>

                  {/* Price Section */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px"
                  }}>
                    {product.discount > 0 ? (
                      <>
                        <span style={{
                          fontSize: "12px",
                          color: "#999",
                          textDecoration: "line-through"
                        }}>
                          {product.price.toFixed(3)} DT
                        </span>
                        <span style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#c53030"
                        }}>
                          {finalPrice} DT
                        </span>
                      </>
                    ) : (
                      <span style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1a365d"
                      }}>
                        {finalPrice} DT
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "15px"
                  }}>
                    <div style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: product.stock > 0 ? "#38a169" : "#c53030"
                    }}></div>
                    <span style={{
                      fontSize: "12px",
                      color: product.stock > 0 ? "#38a169" : "#c53030",
                      fontWeight: "500"
                    }}>
                      {product.stock > 0 ? `En stock (${product.stock})` : "Rupture de stock"}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: product.stock === 0 
                        ? "#e0e0e0" 
                        : "linear-gradient(135deg, #c53030 0%, #e53e3e 100%)",
                      color: product.stock === 0 ? "#999" : "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: product.stock === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: product.stock === 0 ? "none" : "0 4px 15px rgba(197,48,48,0.25)"
                    }}
                  >
                    <i className="fas fa-shopping-bag"></i>
                    {product.stock > 0 ? "Ajouter au panier" : "Indisponible"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
