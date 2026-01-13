const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get categories with product count
exports.getCategoriesWithCount = async (req, res) => {
  try {
    const categories = await Category.find();
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        // Count products directly by category field
        const productCount = await Product.countDocuments({
          category: category._id
        });
        
        return {
          _id: category._id,
          name: category.name,
          description: category.description,
          image: category.image,
          productCount
        };
      })
    );
    
    res.json(categoriesWithCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const categoryData = {
      name: req.body.name,
      description: req.body.description
    };
    
    if (req.file) {
      categoryData.image = '/uploads/' + req.file.filename;
    }
    
    const category = new Category(categoryData);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description
    };
    
    if (req.file) {
      updateData.image = '/uploads/' + req.file.filename;
    }
    
    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Catégorie non trouvée' });
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
