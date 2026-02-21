#!/bin/bash
# Script à exécuter sur le VPS après le déploiement GitHub
# Usage: bash finaliser-oauth-vps.sh

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     FINALISATION OAUTH APRÈS DÉPLOIEMENT GITHUB              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Vérifier qu'on est dans le bon répertoire
if [ ! -d "/root/wstore" ]; then
    echo -e "${RED}Erreur: Répertoire /root/wstore non trouvé${NC}"
    exit 1
fi

echo -e "${YELLOW}1. Backup des fichiers actuels...${NC}"
BACKUP_DIR="/root/wstore/backups/oauth_github_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp /root/wstore/backend/.env "$BACKUP_DIR/.env.backup"
echo -e "${GREEN}✓ Backup créé: $BACKUP_DIR${NC}"

echo -e "${YELLOW}2. Mise à jour des variables d'environnement...${NC}"
cd /root/wstore/backend

# Vérifier si les variables existent déjà
if grep -q "FRONTEND_URL=" .env; then
    # Mettre à jour les variables existantes
    sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=https://wstore.tn|g' .env
    sed -i 's|BACKEND_URL=.*|BACKEND_URL=http://51.254.135.247|g' .env
else
    # Ajouter les variables si elles n'existent pas
    echo "" >> .env
    echo "# OAuth URLs" >> .env
    echo "FRONTEND_URL=https://wstore.tn" >> .env
    echo "BACKEND_URL=http://51.254.135.247" >> .env
fi

echo -e "${GREEN}✓ Variables d'environnement mises à jour:${NC}"
grep -E "FRONTEND_URL|BACKEND_URL" .env

echo -e "${YELLOW}3. Arrêt des services...${NC}"
pm2 stop all

echo -e "${YELLOW}4. Rebuild du frontend...${NC}"
cd /root/wstore/frontend
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erreur lors du build du frontend${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend rebuild avec succès${NC}"

echo -e "${YELLOW}5. Redémarrage des services...${NC}"
pm2 restart all
pm2 save

echo -e "${YELLOW}6. Vérification des services...${NC}"
sleep 3
pm2 status

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              FINALISATION TERMINÉE AVEC SUCCÈS               ║${NC}"
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
