#!/bin/bash

# Script pour déployer les corrections OAuth sur le serveur

echo "========================================"
echo "  DÉPLOIEMENT CORRECTIONS OAUTH"
echo "========================================"
echo ""

# Variables
VPS_IP="51.254.135.247"
VPS_USER="root"
APP_DIR="/root/wstore"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Étape 1 : Upload des fichiers
echo -e "${CYAN}📤 Étape 1 : Upload des fichiers modifiés...${NC}"
echo ""

echo "Upload de GoogleLogin.tsx..."
scp frontend/app/components/GoogleLogin.tsx ${VPS_USER}@${VPS_IP}:${APP_DIR}/frontend/app/components/

echo "Upload de FacebookLogin.tsx..."
scp frontend/app/components/FacebookLogin.tsx ${VPS_USER}@${VPS_IP}:${APP_DIR}/frontend/app/components/

echo -e "${GREEN}✅ Fichiers uploadés !${NC}"
echo ""

# Étape 2 : Rebuild et redémarrage sur le serveur
echo -e "${CYAN}🔨 Étape 2 : Rebuild et redémarrage sur le serveur...${NC}"
echo ""

ssh ${VPS_USER}@${VPS_IP} << 'ENDSSH'
cd /root/wstore/frontend

echo "🔨 Build du frontend..."
npm run build

echo "🔄 Redémarrage des applications..."
pm2 restart wstore-frontend
pm2 restart wstore-backend

echo "✅ Applications redémarrées !"
echo ""

echo "📊 Statut des applications :"
pm2 status

echo ""
echo "📝 Logs récents du frontend :"
pm2 logs wstore-frontend --lines 20 --nostream

ENDSSH

echo ""
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo ""

# Étape 3 : Instructions de test
echo "========================================"
echo "  TESTER LA CONNEXION"
echo "========================================"
echo ""
echo "1. Ouvrir : http://${VPS_IP}:3000/login"
echo "2. Tester 'Continuer avec Facebook'"
echo "3. Tester 'Continuer avec Google'"
echo ""

# Étape 4 : Rappel configuration
echo "========================================"
echo "  N'OUBLIEZ PAS !"
echo "========================================"
echo ""
echo -e "${YELLOW}⚠️  Configurer les URLs de redirection :${NC}"
echo ""
echo "🔵 Facebook Developers :"
echo "   https://developers.facebook.com/apps/1770752150168884"
echo "   → Facebook Login → Paramètres"
echo "   → Ajouter : http://${VPS_IP}:3000/login"
echo ""
echo "🔴 Google Cloud Console :"
echo "   https://console.cloud.google.com/"
echo "   → APIs et services → Identifiants"
echo "   → Ajouter : http://${VPS_IP}:3000/login"
echo ""

echo -e "${GREEN}Terminé ! 🎉${NC}"
