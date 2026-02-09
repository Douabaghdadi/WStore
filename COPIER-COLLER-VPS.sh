#!/bin/bash
# Script a copier-coller sur le VPS
# Vous etes deja connecte, executez simplement ces commandes

echo "Creation du fichier ecosystem.config.js corrige..."
cat > /tmp/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'server.js',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_file: '.env.production',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
EOF

echo "Backup de l'ancien fichier..."
sudo cp /var/www/mon-app/ecosystem.config.js /var/www/mon-app/ecosystem.config.js.backup

echo "Copie du nouveau fichier..."
sudo cp /tmp/ecosystem.config.js /var/www/mon-app/ecosystem.config.js

echo "Modification de backend/server.js..."
sudo cp /var/www/mon-app/backend/server.js /var/www/mon-app/backend/server.js.backup

# Creer le nouveau server.js
cat > /tmp/server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statsRoutes = require('./routes/statsRoutes');
const favoriteRoutes = require('./routes/favorites');
const paymentRoutes = require('./routes/paymentRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Load environment variables
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production' });
} else {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.error('Erreur MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contacts', contactRoutes);

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
EOF

sudo cp /tmp/server.js /var/www/mon-app/backend/server.js

echo ""
echo "Fichiers mis a jour!"
echo ""
echo "Redemarrage de PM2..."
cd /var/www/mon-app
sudo pm2 delete all
sudo pm2 start ecosystem.config.js --env production
sudo pm2 save

echo ""
echo "Verification..."
sleep 3
sudo pm2 status

echo ""
echo "Logs (Ctrl+C pour quitter):"
sudo pm2 logs --lines 20
