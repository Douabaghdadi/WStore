#!/bin/bash
# Script de déploiement manuel OAuth sur VPS
# À exécuter directement sur le VPS après le push GitHub

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     DÉPLOIEMENT MANUEL OAUTH APRÈS PUSH GITHUB              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Vérifier qu'on est dans le bon répertoire
if [ ! -d "/root/wstore" ]; then
    echo -e "${RED}Erreur: Répertoire /root/wstore non trouvé${NC}"
    exit 1
fi

echo -e "${YELLOW}1. Backup des fichiers actuels...${NC}"
BACKUP_DIR="/root/wstore/backups/oauth_manual_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp /root/wstore/backend/.env "$BACKUP_DIR/.env.backup"
echo -e "${GREEN}✓ Backup créé: $BACKUP_DIR${NC}"

echo -e "${YELLOW}2. Pull des derniers changements depuis GitHub...${NC}"
cd /root/wstore
git pull origin main
echo -e "${GREEN}✓ Code mis à jour depuis GitHub${NC}"

echo -e "${YELLOW}3. Mise à jour des dépendances backend...${NC}"
cd /root/wstore/backend
npm ci
echo -e "${GREEN}✓ Dépendances backend installées${NC}"

echo -e "${YELLOW}4. Mise à jour des variables d'environnement...${NC}"
sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=https://wstore.tn|g' .env
sed -i 's|BACKEND_URL=.*|BACKEND_URL=http://51.254.135.247|g' .env
echo -e "${GREEN}✓ Variables d'environnement mises à jour:${NC}"
grep -E "FRONTEND_URL|BACKEND_URL" .env

echo -e "${YELLOW}5. Mise à jour des dépendances frontend...${NC}"
cd /root/wstore/frontend
npm ci --legacy-peer-deps
echo -e "${GREEN}✓ Dépendances frontend installées${NC}"

echo -e "${YELLOW}6. Rebuild du frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erreur lors du build du frontend${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend rebuild avec succès${NC}"

echo -e "${YELLOW}7. Redémarrage des services PM2...${NC}"
pm2 restart all
pm2 save
echo -e "${GREEN}✓ Services redémarrés${NC}"

echo -e "${YELLOW}8. Vérification des services...${NC}"
sleep 3
pm2 status

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              DÉPLOIEMENT TERMINÉ AVEC SUCCÈS                 ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${RED}⚠️  IMPORTANT: Configuration OAuth requise${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}🔴 GOOGLE CLOUD CONSOLE:${NC}"
echo "   https://console.cloud.google.com/apis/credentials"
echo ""
echo "   Client ID: 890386873007-astu30t1t91ptutf2e6asqoibb1jfnrp.apps.googleusercontent.com"
echo ""
echo -e "${YELLOW}   Modifiez:${NC}"
echo "   ✓ Authorized JavaScript origins: https://wstore.tn"
echo "   ✓ Authorized redirect URIs: https://wstore.tn/login"
echo ""
echo -e "${CYAN}🔴 FACEBOOK DEVELOPERS:${NC}"
echo "   https://developers.facebook.com/apps/1770752150168884"
echo ""
echo -e "${YELLOW}   Modifiez:${NC}"
echo "   ✓ App Domains: wstore.tn"
echo "   ✓ Valid OAuth Redirect URIs: https://wstore.tn/login"
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✅ Testez maintenant sur: https://wstore.tn/login${NC}"
echo ""
echo "Backup sauvegardé dans: $BACKUP_DIR"
echo ""
