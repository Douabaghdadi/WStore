#!/bin/bash

###############################################################################
# Script de backup automatique
# Usage: bash backup.sh
# Appelé automatiquement par cron et avant chaque déploiement
###############################################################################

set -e

APP_DIR="/var/www/wstore"
BACKUP_DIR="/var/backups/wstore"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/backup-${TIMESTAMP}.tar.gz"
RETENTION_DAYS=30

echo "💾 Démarrage du backup..."

# Créer le répertoire de backup s'il n'existe pas
mkdir -p ${BACKUP_DIR}

# Vérifier que l'application existe
if [ ! -d "${APP_DIR}" ]; then
    echo "❌ Répertoire application non trouvé: ${APP_DIR}"
    exit 1
fi

# Créer le backup
echo "📦 Création du backup: ${BACKUP_FILE}"
tar -czf ${BACKUP_FILE} \
    -C ${APP_DIR} \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.next/cache' \
    . 2>/dev/null || true

# Vérifier que le backup a été créé
if [ -f "${BACKUP_FILE}" ]; then
    SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
    echo "✅ Backup créé avec succès: ${BACKUP_FILE} (${SIZE})"
else
    echo "❌ Échec de la création du backup"
    exit 1
fi

# Nettoyer les anciens backups
echo "🧹 Nettoyage des backups de plus de ${RETENTION_DAYS} jours..."
find ${BACKUP_DIR} -name "backup-*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete

# Afficher les backups disponibles
echo ""
echo "📋 Backups disponibles:"
ls -lh ${BACKUP_DIR}/backup-*.tar.gz 2>/dev/null | tail -n 10 || echo "Aucun backup trouvé"

echo ""
echo "✅ Backup terminé avec succès"
