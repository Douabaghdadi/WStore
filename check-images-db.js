const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wstore')
  .then(() => {
    console.log('Connected to MongoDB');
    const Product = mongoose.model('Product', new mongoose.Schema({}, {strict: false}));
    return Product.find().limit(10).select('name image');
  })
  .then(products => {
    console.log('\n=== IMAGES DANS LA BASE DE DONNÉES ===\n');
    products.forEach(p => {
      console.log(`Produit: ${p.name}`);
      console.log(`Image: ${p.image}`);
      console.log('---');
    });
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
  });
