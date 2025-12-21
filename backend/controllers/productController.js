const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category').populate('subcategory').populate('brand');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category').populate('subcategory').populate('brand');
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const Subcategory = require('../models/Subcategory');
    const subcategory = await Subcategory.findById(req.body.subcategory);
    
    const productData = {
      ...req.body,
      category: subcategory.category,
      image: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.image
    };
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const Subcategory = require('../models/Subcategory');
    const subcategory = await Subcategory.findById(req.body.subcategory);
    
    const updateData = {
      ...req.body,
      category: subcategory.category,
      image: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.image
    };
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
