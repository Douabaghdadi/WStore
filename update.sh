#!/bin/bash

# Script de mise à jour rapide
# Usage: bash update.sh

set -e

read -p "Entrez l'IP de votre VPS: " VPS_IP

APP_DIR="/var/www/mon-app"

echo "🔄 Mise à jour de l'application..."

# Transférer les nouveaux fichiers
rsync -avz --exclude 'node_modules' \
           --exclude '.next' \
           --exclude '.git' \
           --exclude 'backend/uploads' \
           --exclude 'backend/.env*' \
           --exclude 'frontend/.env*' \
           ./ ubuntu@$VPS_IP:$APP_DIR/

# Redémarrer l'application
ssh ubuntu@$VPS_IP << ENDSSH

cd $APP_DIR

echo "📦 Mise à jour du backend..."
cd backend
npm install --production

echo "📦 Rebuild du frontend..."
cd ../frontend
npm install
npm run build

echo "🔄 Redémarrage des applications..."
sudo pm2 delete all
sudo pm2 start ecosystem.config.js --env production
sudo pm2 save

echo "✅ Mise à jour terminée!"
sudo pm2 status

ENDSSH

echo ""
echo "✅ Application mise à jour avec succès!"
