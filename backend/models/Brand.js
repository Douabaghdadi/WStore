const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  image: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Brand', brandSchema);
