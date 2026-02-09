#!/bin/bash

# Script pour redémarrer PM2 avec la configuration correcte
echo "🔄 Redémarrage de PM2 avec la configuration de production..."

# Arrêter tous les processus PM2
sudo pm2 delete all

# Démarrer avec la configuration de production
sudo pm2 start ecosystem.config.js --env production

# Sauvegarder la configuration PM2
sudo pm2 save

# Afficher le statut
sudo pm2 status

echo "✅ PM2 redémarré avec succès!"
echo ""
echo "📊 Pour voir les logs:"
echo "   sudo pm2 logs"
echo ""
echo "📈 Pour voir le statut:"
echo "   sudo pm2 status"
