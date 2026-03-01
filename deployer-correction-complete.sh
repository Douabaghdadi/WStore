#!/bin/bash

echo "🚀 CORRECTION ET DÉPLOIEMENT COMPLET"
echo "===================================="
echo ""

# 1. Corriger les URLs API
echo "📝 Étape 1: Correction des URLs API..."
node corriger-api-url-definitif.js

# 2. Vérifier le fichier .env.production
echo ""
echo "📝 Étape 2: Vérification de .env.production..."
if [ ! -f "frontend/.env.production" ]; then
  echo "❌ Fichier .env.production manquant!"
  echo "Création du fichier..."
  cat > frontend/.env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://w-store.tn
NEXT_PUBLIC_FACEBOOK_APP_ID=1770752150168884
NEXT_PUBLIC_GOOGLE_CLIENT_ID=890386873007-astu30t1t91ptutf2e6asqoibb1jfnrp.apps.googleusercontent.com
EOF
fi

cat frontend/.env.production
echo "✅ Configuration vérifiée"

# 3. Rebuild du frontend
echo ""
echo "📝 Étape 3: Rebuild du frontend..."
cd frontend
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Erreur lors du build!"
  exit 1
fi

echo "✅ Build réussi"

# 4. Redémarrer PM2
echo ""
echo "📝 Étape 4: Redémarrage de l'application..."
cd ..
pm2 restart wstore-frontend
pm2 restart wstore-backend

# 5. Vérifier le statut
echo ""
echo "📝 Étape 5: Vérification du statut..."
pm2 status

echo ""
echo "✅ DÉPLOIEMENT TERMINÉ!"
echo ""
echo "🔍 Pour vérifier:"
echo "   - Ouvrez https://w-store.tn"
echo "   - Videz le cache du navigateur (Ctrl+Shift+R)"
echo "   - Vérifiez la console (F12)"
echo ""
echo "📊 Logs en temps réel:"
echo "   pm2 logs wstore-frontend"
echo "   pm2 logs wstore-backend"
