#!/bin/bash

###############################################################################
# Script de déploiement rapide (pour urgences uniquement)
# Usage: bash quick-deploy.sh
# Note: Préférez toujours le déploiement via GitHub Actions
###############################################################################

set -e

APP_DIR="/var/www/wstore"
BACKUP_DIR="/var/backups/wstore"

echo "⚠️  DÉPLOIEMENT RAPIDE D'URGENCE"
echo "================================"
echo ""
echo "Ce script est pour les urgences uniquement."
echo "Utilisez normalement le déploiement via GitHub Actions."
echo ""
read -p "Continuer ? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Annulé."
    exit 1
fi

# Backup
echo "💾 Création d'un backup..."
bash ${APP_DIR}/infrastructure/scripts/backup.sh

# Pull des derniers changements
echo "📥 Récupération des derniers changements..."
cd ${APP_DIR}
git pull origin main

# Installation des dépendances
echo "📦 Installation des dépendances backend..."
cd ${APP_DIR}/backend
npm ci --production --legacy-peer-deps

echo "📦 Installation des dépendances frontend..."
cd ${APP_DIR}/frontend
npm ci --production --legacy-peer-deps

echo "🏗️  Build du frontend..."
npm run build

# Redémarrage
echo "🔄 Redémarrage des services..."
pm2 restart all

echo ""
echo "✅ Déploiement rapide terminé"
echo "🔍 Vérifiez les logs: pm2 logs"
