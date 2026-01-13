const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    // Vérifier si l'utilisateur a acheté ce produit
    const hasPurchased = await Order.findOne({
      user: userId,
      'items.product': productId,
      status: 'delivered' // Seulement les commandes livrées
    });

    if (!hasPurchased) {
      return res.status(403).json({ error: 'Vous devez acheter ce produit avant de pouvoir laisser un avis' });
    }

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

exports.canUserReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Vérifier si l'utilisateur a acheté ce produit
    const hasPurchased = await Order.findOne({
      user: userId,
      'items.product': productId,
      status: 'delivered'
    });

    // Vérifier si l'utilisateur a déjà laissé un avis
    const existingReview = await Review.findOne({ product: productId, user: userId });

    res.json({
      canReview: hasPurchased && !existingReview,
      hasPurchased: !!hasPurchased,
      hasReviewed: !!existingReview
    });
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