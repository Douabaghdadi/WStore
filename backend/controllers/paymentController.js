const Order = require('../models/Order');

const PAYMEE_API_URL = process.env.PAYMEE_ENV === 'production' 
  ? 'https://app.paymee.tn/api/v2/payments/create'
  : 'https://sandbox.paymee.tn/api/v2/payments/create';

const PAYMEE_CHECK_URL = process.env.PAYMEE_ENV === 'production'
  ? 'https://app.paymee.tn/api/v2/payments'
  : 'https://sandbox.paymee.tn/api/v2/payments';

// Initier un paiement Paymee
exports.initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    console.log('Initiation paiement pour commande:', orderId);
    console.log('PAYMEE_API_KEY configurée:', !!process.env.PAYMEE_API_KEY);
    
    if (!process.env.PAYMEE_API_KEY || process.env.PAYMEE_API_KEY === 'your_paymee_api_key_here') {
      return res.status(400).json({ 
        error: 'Clé API Paymee non configurée. Veuillez configurer PAYMEE_API_KEY dans le fichier .env' 
      });
    }
    
    const order = await Order.findOne({ _id: orderId, user: req.user.id })
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Cette commande est déjà payée' });
    }

    // Extraire prénom et nom
    const nameParts = order.shippingAddress.fullName.split(' ');
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.slice(1).join(' ') || 'Client';

    const paymentData = {
      amount: order.totalAmount,
      note: `Commande #${order._id.toString().slice(-8).toUpperCase()}`,
      first_name: firstName,
      last_name: lastName,
      email: order.user?.email || 'client@example.com',
      phone: order.shippingAddress.phone,
      return_url: `${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?orderId=${order._id}`,
      webhook_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      order_id: order._id.toString()
    };

    console.log('Données envoyées à Paymee:', paymentData);
    console.log('URL Paymee:', PAYMEE_API_URL);

    const response = await fetch(PAYMEE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.PAYMEE_API_KEY}`
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();
    console.log('Réponse Paymee:', result);

    if (result.status && result.data) {
      // Sauvegarder le token Paymee dans la commande
      order.paymeeToken = result.data.token;
      order.paymentStatus = 'pending';
      await order.save();

      return res.json({
        success: true,
        paymentUrl: result.data.payment_url,
        token: result.data.token
      });
    } else {
      return res.status(400).json({ 
        error: 'Erreur Paymee: ' + (result.message || 'Réponse invalide'),
        details: result 
      });
    }
  } catch (error) {
    console.error('Erreur Paymee:', error);
    res.status(500).json({ error: 'Erreur serveur lors du paiement: ' + error.message });
  }
};


// Webhook Paymee - appelé automatiquement après paiement
exports.paymeeWebhook = async (req, res) => {
  try {
    const { 
      token, 
      payment_status, 
      order_id, 
      amount, 
      transaction_id,
      check_sum 
    } = req.body;

    console.log('Webhook Paymee reçu:', req.body);

    const order = await Order.findById(order_id);
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Vérifier que le token correspond
    if (order.paymeeToken !== token) {
      return res.status(400).json({ error: 'Token invalide' });
    }

    if (payment_status === true || payment_status === 'true') {
      order.paymentStatus = 'paid';
      order.paymeeTransactionId = transaction_id;
      order.status = 'confirmed';
      await order.save();
      
      console.log(`Commande ${order_id} payée avec succès`);
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      
      console.log(`Paiement échoué pour commande ${order_id}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur webhook Paymee:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Vérifier le statut d'un paiement
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    if (!order.paymeeToken) {
      return res.json({ 
        paymentStatus: order.paymentStatus || 'not_initiated',
        orderStatus: order.status 
      });
    }

    // Vérifier le statut auprès de Paymee
    const response = await fetch(`${PAYMEE_CHECK_URL}/${order.paymeeToken}/check`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${process.env.PAYMEE_API_KEY}`
      }
    });

    const result = await response.json();

    if (result.data && result.data.payment_status) {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await order.save();
    }

    res.json({
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      paymeeStatus: result.data
    });
  } catch (error) {
    console.error('Erreur vérification paiement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
