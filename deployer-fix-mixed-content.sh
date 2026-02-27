#!/bin/bash
# Script de déploiement automatique - Correction Mixed Content

echo "🔒 CORRECTION MIXED CONTENT - DÉPLOIEMENT AUTOMATIQUE"
echo "====================================================="
echo ""

# Configuration
PROJECT_PATH="/root/wstore"

echo "📋 Résumé des corrections:"
echo "  ✅ ProductCard.tsx - Fallback HTTPS"
echo "  ✅ contact/page.tsx - Variable d'environnement"
echo "  ✅ admin/orders/page.tsx - Déjà corrigé"
echo ""

echo "🚀 Étape 1: Pull des changements..."
cd $PROJECT_PATH
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du git pull"
    exit 1
fi

echo ""
echo "📦 Étape 2: Rebuild du frontend..."
cd frontend

# Vérifier que .env.production existe
if [ ! -f ".env.production" ]; then
    echo "⚠️  Création de .env.production..."
    cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://w-store.tn
NEXT_PUBLIC_FACEBOOK_APP_ID=1770752150168884
NEXT_PUBLIC_GOOGLE_CLIENT_ID=890386873007-astu30t1t91ptutf2e6asqoibb1jfnrp.apps.googleusercontent.com
EOF
fi

npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo ""
echo "🔄 Étape 3: Redémarrage PM2..."
pm2 restart wstore-frontend
pm2 save

echo ""
echo "✅ DÉPLOIEMENT TERMINÉ!"
echo ""
echo "📊 Logs du frontend:"
pm2 logs wstore-frontend --lines 20 --nostream

echo ""
echo "🧹 N'oubliez pas de vider le cache de votre navigateur:"
echo "  • Chrome/Edge: Ctrl + Shift + Delete"
echo "  • Firefox: Ctrl + Shift + Delete"
echo "  • Safari: Cmd + Option + E"
echo ""
echo "🌐 Testez maintenant: https://w-store.tn"
