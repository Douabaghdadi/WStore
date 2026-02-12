#!/bin/bash

###############################################################################
# Script de rollback
# Usage: bash rollback.sh [backup-file]
# Si aucun fichier n'est spécifié, utilise le backup le plus récent
###############################################################################

set -e

APP_DIR="/var/www/wstore"
BACKUP_DIR="/var/backups/wstore"

echo "⏮️  Démarrage du rollback..."

# Déterminer quel backup utiliser
if [ -z "$1" ]; then
    BACKUP_FILE=$(ls -t ${BACKUP_DIR}/backup-*.tar.gz 2>/dev/null | head -n 1)
    if [ -z "${BACKUP_FILE}" ]; then
        echo "❌ Aucun backup trouvé dans ${BACKUP_DIR}"
        exit 1
    fi
    echo "📦 Utilisation du backup le plus récent: ${BACKUP_FILE}"
else
    BACKUP_FILE="${BACKUP_DIR}/$1"
    if [ ! -f "${BACKUP_FILE}" ]; then
        echo "❌ Backup non trouvé: ${BACKUP_FILE}"
        exit 1
    fi
    echo "📦 Utilisation du backup spécifié: ${BACKUP_FILE}"
fi

# Arrêter les services
echo "🛑 Arrêt des services..."
pm2 stop all || true

# Créer un backup de sécurité de l'état actuel
SAFETY_BACKUP="${BACKUP_DIR}/pre-rollback-$(date +%Y%m%d-%H%M%S).tar.gz"
echo "💾 Création d'un backup de sécurité: ${SAFETY_BACKUP}"
tar -czf ${SAFETY_BACKUP} -C ${APP_DIR} . 2>/dev/null || true

# Nettoyer le répertoire actuel (sauf uploads)
echo "🧹 Nettoyage du répertoire application..."
cd ${APP_DIR}
find . -mindepth 1 -maxdepth 1 ! -name 'uploads' ! -name 'logs' -exec rm -rf {} +

# Restaurer le backup
echo "📦 Restauration du backup..."
tar -xzf ${BACKUP_FILE} -C ${APP_DIR}

# Réinstaller les dépendances
echo "📝 Réinstallation des dépendances backend..."
cd ${APP_DIR}/backend
npm ci --production --legacy-peer-deps

echo "📝 Réinstallation des dépendances frontend..."
cd ${APP_DIR}/frontend
npm ci --production --legacy-peer-deps

# Redémarrer les services
echo "🔄 Redémarrage des services..."
cd ${APP_DIR}
pm2 restart all || pm2 start ecosystem.config.js

# Attendre que les services démarrent
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier que les services sont actifs
echo "🏥 Vérification de la santé des services..."
if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend est actif"
else
    echo "⚠️  Frontend ne répond pas"
fi

if curl -f -s http://localhost:5000/api/products > /dev/null 2>&1; then
    echo "✅ Backend est actif"
else
    echo "⚠️  Backend ne répond pas"
fi

echo ""
echo "✅ Rollback terminé"
echo "📊 Statut des services:"
pm2 status

echo ""
echo "💡 Si le rollback a échoué, vous pouvez restaurer l'état pré-rollback:"
echo "   bash rollback.sh $(basename ${SAFETY_BACKUP})"
