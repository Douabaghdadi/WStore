#!/bin/bash
# Script à exécuter sur le VPS pour terminer le déploiement
# Usage: ssh ubuntu@51.254.135.247 'bash -s' < finish-deploy-vps.sh

set -e

echo "=== Finalisation du déploiement WStore ==="

APP_DIR="/home/ubuntu/wstore"

# Créer le répertoire
mkdir -p $APP_DIR
cd $APP_DIR

# Extraire l'archive
echo "Extraction..."
tar -xzf /home/ubuntu/wstore-deploy.tar.gz

# Configuration
echo "Configuration..."
cd $APP_DIR/backend
cp .env.production .env

cd $APP_DIR/frontend
cp .env.production .env.local

# Installation backend
echo "Installation backend..."
cd $APP_DIR/backend
npm install --production

# Installation et build frontend
echo "Installation frontend..."
cd $APP_DIR/frontend
npm install

echo "Build frontend..."
npm run build

# Démarrage PM2
echo "Démarrage avec PM2..."
cd $APP_DIR
pm2 stop all || true
pm2 delete all || true
pm2 start ecosystem.config.js
pm2 save

echo "=== Déploiement terminé ==="
pm2 status
