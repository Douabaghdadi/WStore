const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory'
  },
  description: String,
  image: String,
  stock: {
    type: Number,
    default: 0
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
