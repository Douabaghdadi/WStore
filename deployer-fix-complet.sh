#!/bin/bash

# Script à exécuter sur le VPS pour corriger le problème localhost

echo "=== CORRECTION DU PROBLÈME LOCALHOST ==="
echo ""

# 1. Arrêter le frontend
echo "1. Arrêt du frontend..."
pm2 stop wstore-frontend

# 2. Extraire la nouvelle version
echo "2. Extraction de la nouvelle version..."
cd /root
if [ -f "frontend-production-fixed.tar.gz" ]; then
    tar -xzf frontend-production-fixed.tar.gz
    echo "   ✓ Archive extraite"
else
    echo "   ✗ Archive non trouvée!"
    exit 1
fi

# 3. Vérifier les variables d'environnement
echo "3. Vérification des variables..."
if [ -f "frontend/.env.production" ]; then
    cat frontend/.env.production
else
    echo "   ✗ Fichier .env.production manquant!"
    exit 1
fi

# 4. Redémarrer le frontend
echo "4. Redémarrage du frontend..."
pm2 restart wstore-frontend

# 5. Vérifier le statut
echo "5. Vérification du statut..."
pm2 status

echo ""
echo "=== CORRECTION TERMINÉE ==="
echo ""
echo "Testez maintenant votre site: http://51.254.135.247"
echo "Les appels API devraient maintenant fonctionner!"
