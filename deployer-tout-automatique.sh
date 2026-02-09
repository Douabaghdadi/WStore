#!/bin/bash

# Script Bash pour déployer TOUS les changements automatiquement

set -e

# Variables
VPS_IP="51.254.135.247"
VPS_USER="root"
APP_DIR="/root/wstore"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BLUE='\033[0;34m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║     DÉPLOIEMENT AUTOMATIQUE DE TOUS LES CHANGEMENTS          ║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Résumé des changements
echo -e "${YELLOW}📦 CHANGEMENTS À DÉPLOYER :${NC}"
echo ""
echo -e "${GREEN}✅ Optimisations Mobile :${NC}"
echo "   - globals.css (styles responsive)"
echo "   - Header.module.css (header mobile)"
echo ""
echo -e "${GREEN}✅ Corrections OAuth :${NC}"
echo "   - GoogleLogin.tsx (URL dynamique)"
echo "   - FacebookLogin.tsx (URL dynamique)"
echo ""

# Confirmation
read -p "Voulez-vous continuer ? (o/n) " confirm
if [ "$confirm" != "o" ]; then
    echo -e "${RED}❌ Déploiement annulé.${NC}"
    exit 0
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  ÉTAPE 1 : UPLOAD DES FICHIERS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Upload des fichiers CSS
echo -e "${YELLOW}📤 Upload de globals.css...${NC}"
scp frontend/app/globals.css ${VPS_USER}@${VPS_IP}:${APP_DIR}/frontend/app/
echo -e "${GREEN}✅ globals.css uploadé${NC}"

echo -e "${YELLOW}📤 Upload de Header.module.css...${NC}"
scp frontend/app/components/Header.module.css ${VPS_USER}@${VPS_IP}:${APP_DIR}/frontend/app/components/
echo -e "${GREEN}✅ Header.module.css uploadé${NC}"

# Upload des composants OAuth
echo -e "${YELLOW}📤 Upload de GoogleLogin.tsx...${NC}"
scp frontend/app/components/GoogleLogin.tsx ${VPS_USER}@${VPS_IP}:${APP_DIR}/frontend/app/components/
echo -e "${GREEN}✅ GoogleLogin.tsx uploadé${NC}"

echo -e "${YELLOW}📤 Upload de FacebookLogin.tsx...${NC}"
scp frontend/app/components/FacebookLogin.tsx ${VPS_USER}@${VPS_IP}:${APP_DIR}/frontend/app/components/
echo -e "${GREEN}✅ FacebookLogin.tsx uploadé${NC}"

echo ""
echo -e "${GREEN}✅ Tous les fichiers ont été uploadés avec succès !${NC}"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  ÉTAPE 2 : REBUILD ET REDÉMARRAGE SUR LE SERVEUR${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}🔨 Build du frontend en cours...${NC}"
echo -e "${GRAY}⏳ Cela peut prendre 2-3 minutes...${NC}"
echo ""

# Exécution des commandes sur le serveur
ssh ${VPS_USER}@${VPS_IP} << 'ENDSSH'
cd /root/wstore/frontend

echo '🔨 Build du frontend...'
npm run build

echo ''
echo '🔄 Redémarrage des applications...'
pm2 restart wstore-frontend
pm2 restart wstore-backend

echo ''
echo '✅ Applications redémarrées !'
echo ''

echo '📊 Statut des applications :'
pm2 status

echo ''
echo '📝 Logs récents du frontend :'
pm2 logs wstore-frontend --lines 20 --nostream

ENDSSH

echo ""
echo -e "${GREEN}✅ Build et redémarrage terminés avec succès !${NC}"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  ÉTAPE 3 : CONFIGURATION OAUTH REQUISE${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}⚠️  IMPORTANT : Vous devez maintenant configurer les URLs OAuth${NC}"
echo ""

echo -e "${BLUE}🔵 FACEBOOK DEVELOPERS${NC}"
echo "URL : https://developers.facebook.com/apps/1770752150168884"
echo -e "${GRAY}→ Facebook Login → Paramètres${NC}"
echo -e "${GRAY}→ URI de redirection OAuth valides :${NC}"
echo -e "${GRAY}   http://localhost:3000/login${NC}"
echo -e "${GRAY}   http://51.254.135.247:3000/login${NC}"
echo ""

echo -e "${RED}🔴 GOOGLE CLOUD CONSOLE${NC}"
echo "URL : https://console.cloud.google.com/"
echo -e "${GRAY}→ APIs et services → Identifiants${NC}"
echo -e "${GRAY}→ URI de redirection autorisés :${NC}"
echo -e "${GRAY}   http://localhost:3000/login${NC}"
echo -e "${GRAY}   http://51.254.135.247:3000/login${NC}"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  ÉTAPE 4 : TESTS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}🧪 TESTS À EFFECTUER :${NC}"
echo ""

echo -e "${CYAN}1. TEST MOBILE${NC}"
echo "   → Ouvrir sur téléphone : http://51.254.135.247:3000"
echo -e "${GRAY}   → Vérifier l'affichage des bannières${NC}"
echo -e "${GRAY}   → Vérifier l'affichage des cartes produits${NC}"
echo -e "${GRAY}   → Vérifier le header mobile${NC}"
echo ""

echo -e "${CYAN}2. TEST OAUTH FACEBOOK${NC}"
echo "   → Aller sur : http://51.254.135.247:3000/login"
echo -e "${GRAY}   → Cliquer sur 'Continuer avec Facebook'${NC}"
echo -e "${GRAY}   → Vérifier la redirection (pas localhost)${NC}"
echo -e "${GRAY}   → Autoriser et vérifier la connexion${NC}"
echo ""

echo -e "${CYAN}3. TEST OAUTH GOOGLE${NC}"
echo "   → Aller sur : http://51.254.135.247:3000/login"
echo -e "${GRAY}   → Cliquer sur 'Continuer avec Google'${NC}"
echo -e "${GRAY}   → Vérifier la redirection (pas localhost)${NC}"
echo -e "${GRAY}   → Autoriser et vérifier la connexion${NC}"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  RÉSUMÉ${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}✅ TERMINÉ :${NC}"
echo "   - Fichiers uploadés"
echo "   - Build effectué"
echo "   - Applications redémarrées"
echo ""

echo -e "${YELLOW}⏳ À FAIRE :${NC}"
echo "   1. Configurer Facebook Developers"
echo "   2. Configurer Google Cloud Console"
echo "   3. Tester l'application"
echo ""

echo -e "${CYAN}📖 DOCUMENTATION :${NC}"
echo "   - DEPLOYER-TOUS-CHANGEMENTS.txt"
echo "   - COMMANDES-OAUTH-COPIER-COLLER.txt"
echo "   - CONFIGURER-OAUTH-PRODUCTION.md"
echo ""

echo -e "${GREEN}🎉 Déploiement terminé avec succès !${NC}"
echo ""
