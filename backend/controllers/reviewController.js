const Review = require('../models/Review');
const Product = require('../models/Product');

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    // Vérifier si l'utilisateur a déjà noté ce produit
    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return res.status(400).json({ error: 'Vous avez déjà noté ce produit' });
    }

    // Créer l'avis
    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment
    });

    // Mettre à jour la note moyenne du produit
    await updateProductRating(productId);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fonction utilitaire pour mettre à jour la note moyenne
async function updateProductRating(productId) {
  const reviews = await Review.find({ product: productId });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(averageRating * 10) / 10, // Arrondir à 1 décimale
    ratingCount: reviews.length
  });
}