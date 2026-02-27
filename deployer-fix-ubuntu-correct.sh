#!/bin/bash
# Script de déploiement - Correction pour utilisateur ubuntu

echo "🔒 DÉPLOIEMENT FIX MIXED CONTENT"
echo "================================="
echo ""
echo "👤 Utilisateur actuel: $(whoami)"
echo ""

# Vérifier si on est root
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Vous n'êtes pas root. Passage en mode sudo..."
    echo ""
    
    # Chercher le projet
    if [ -d "/root/wstore" ]; then
        PROJECT_PATH="/root/wstore"
        echo "📁 Projet trouvé: $PROJECT_PATH"
    elif [ -d "$HOME/wstore" ]; then
        PROJECT_PATH="$HOME/wstore"
        echo "📁 Projet trouvé: $PROJECT_PATH"
    else
        echo "❌ Projet wstore non trouvé!"
        echo "Recherche en cours..."
        find ~ -name "wstore" -type d 2>/dev/null
        exit 1
    fi
    
    echo ""
    echo "🚀 Exécution avec sudo..."
    sudo bash << 'EOF'
cd /root/wstore || exit 1
echo "📂 Dans: $(pwd)"
echo ""

echo "📥 Pull des changements..."
git pull origin main

echo ""
echo "📦 Build du frontend..."
cd frontend
npm run build

echo ""
echo "🔄 Redémarrage PM2..."
pm2 restart wstore-frontend
pm2 save

echo ""
echo "✅ TERMINÉ!"
echo ""
echo "📊 Logs:"
pm2 logs wstore-frontend --lines 20 --nostream
EOF

else
    # On est déjà root
    PROJECT_PATH="/root/wstore"
    
    echo "📂 Accès au projet..."
    cd $PROJECT_PATH || exit 1
    
    echo "📥 Pull des changements..."
    git pull origin main
    
    echo ""
    echo "📦 Build du frontend..."
    cd frontend
    npm run build
    
    echo ""
    echo "🔄 Redémarrage PM2..."
    pm2 restart wstore-frontend
    pm2 save
    
    echo ""
    echo "✅ TERMINÉ!"
    echo ""
    echo "📊 Logs:"
    pm2 logs wstore-frontend --lines 20 --nostream
fi

echo ""
echo "🧹 N'oubliez pas de vider le cache navigateur!"
echo "  Chrome/Edge: Ctrl + Shift + Delete"
echo ""
echo "🌐 Testez: https://w-store.tn"
