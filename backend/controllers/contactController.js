const Contact = require('../models/Contact');

// Créer un nouveau message de contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const contact = new Contact({ name, email, subject, message });
    await contact.save();
    
    res.status(201).json({ success: true, message: 'Message envoyé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer tous les messages (admin)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un message par ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Message non trouvé' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour le statut d'un message
exports.updateContactStatus = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Message non trouvé' });
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un message
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Message non trouvé' });
    res.json({ success: true, message: 'Message supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Compter les messages non lus
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Contact.countDocuments({ status: 'unread' });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
