const Brand = require('../models/Brand');

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Marque non trouvée' });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!brand) return res.status(404).json({ error: 'Marque non trouvée' });
    res.json(brand);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Marque non trouvée' });
    res.json({ message: 'Marque supprimée' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
