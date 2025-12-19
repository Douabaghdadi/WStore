const Subcategory = require('../models/Subcategory');

exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('category');
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate('category');
    if (!subcategory) return res.status(404).json({ error: 'Sous-catégorie non trouvée' });
    res.json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const subcategory = new Subcategory(req.body);
    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subcategory) return res.status(404).json({ error: 'Sous-catégorie non trouvée' });
    res.json(subcategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) return res.status(404).json({ error: 'Sous-catégorie non trouvée' });
    res.json({ message: 'Sous-catégorie supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
