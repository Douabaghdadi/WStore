"use client";
import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import { API_URL } from "../../lib/api";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: { name: string };
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
    checkLoginStatus();
    checkCanReview();
  }, [productId]);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  const checkCanReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/reviews/can-review/${productId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      setCanReview(data.canReview);
      setHasPurchased(data.hasPurchased);
      setHasReviewed(data.hasReviewed);
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reviews/product/${productId}`);
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      console.error("Erreur lors du chargement des avis:", error);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRating) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          rating: newRating,
          comment: newComment
        })
      });

      if (res.ok) {
        setNewRating(0);
        setNewComment("");
        fetchReviews();
        checkCanReview(); // Recharger le statut
      } else {
        const data = await res.json();
        alert(data.error || "Erreur lors de l'ajout de l'avis");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h3 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px", color: "#333" }}>
        Avis clients ({reviews.length})
      </h3>

      {/* Formulaire d'ajout d'avis */}
      {isLoggedIn ? (
        canReview ? (
          <div style={{ backgroundColor: "#f8f9fa", padding: "24px", borderRadius: "12px", marginBottom: "32px" }}>
            <h4 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#333" }}>
              Donnez votre avis
            </h4>
            <form onSubmit={submitReview}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                  Note :
                </label>
                <StarRating rating={newRating} onRatingChange={setNewRating} size={24} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>
                  Commentaire (optionnel) :
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit..."
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "14px",
                    resize: "vertical",
                    minHeight: "80px",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                  maxLength={500}
                />
              </div>
              <button
                type="submit"
                disabled={!newRating || loading}
                style={{
                  backgroundColor: newRating ? "#81C784" : "#ccc",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: newRating ? "pointer" : "not-allowed"
                }}
              >
                {loading ? "Envoi..." : "Publier l'avis"}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ backgroundColor: "#fff3cd", padding: "16px", borderRadius: "8px", marginBottom: "32px", border: "1px solid #ffc107" }}>
            <p style={{ color: "#856404", margin: 0, fontSize: "14px" }}>
              {hasReviewed 
                ? "Vous avez déjà laissé un avis pour ce produit." 
                : "Vous devez acheter ce produit avant de pouvoir laisser un avis."}
            </p>
          </div>
        )
      ) : (
        <div style={{ backgroundColor: "#f0f9ff", padding: "16px", borderRadius: "8px", marginBottom: "32px", textAlign: "center" }}>
          <p style={{ color: "#0369a1", margin: 0 }}>
            <a href="/login" style={{ color: "#81C784", textDecoration: "none", fontWeight: "600" }}>
              Connectez-vous
            </a> pour laisser un avis
          </p>
        </div>
      )}

      {/* Liste des avis */}
      <div>
        {reviews.length === 0 ? (
          <p style={{ color: "#666", textAlign: "center", padding: "40px 0" }}>
            Aucun avis pour le moment. Soyez le premier à donner votre avis !
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px",
                backgroundColor: "white"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontWeight: "600", color: "#333", marginBottom: "4px" }}>
                    {review.user.name}
                  </div>
                  <StarRating rating={review.rating} readonly size={16} />
                </div>
                <div style={{ color: "#666", fontSize: "14px" }}>
                  {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
              {review.comment && (
                <p style={{ color: "#555", lineHeight: "1.6", margin: 0 }}>
                  {review.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}