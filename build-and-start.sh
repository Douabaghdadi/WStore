#!/bin/bash

echo "═══════════════════════════════════════════════════════════════"
echo "  BUILD ET DÉMARRAGE DE L'APPLICATION WSTORE"
echo "═══════════════════════════════════════════════════════════════"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}[1/5] Vérification du dossier...${NC}"
cd /home/ubuntu/wstore
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur: Le dossier /home/ubuntu/wstore n'existe pas${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dossier trouvé${NC}"

echo ""
echo -e "${BLUE}[2/5] Build du frontend...${NC}"
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build réussi${NC}"

echo ""
echo -e "${BLUE}[3/5] Retour au dossier principal...${NC}"
cd /home/ubuntu/wstore
echo -e "${GREEN}✅ OK${NC}"

echo ""
echo -e "${BLUE}[4/5] Arrêt des anciennes instances PM2...${NC}"
pm2 delete all 2>/dev/null || true
echo -e "${GREEN}✅ Nettoyage effectué${NC}"

echo ""
echo -e "${BLUE}[5/5] Démarrage avec PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
echo -e "${GREEN}✅ Applications démarrées${NC}"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}  ✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${YELLOW}📊 Statut des applications:${NC}"
pm2 status
echo ""
echo -e "${YELLOW}🌐 Votre application est accessible à:${NC}"
echo -e "   ${GREEN}http://51.254.135.247${NC}"
echo ""
echo -e "${YELLOW}📝 Commandes utiles:${NC}"
echo "   pm2 logs          - Voir tous les logs"
echo "   pm2 logs backend  - Logs du backend uniquement"
echo "   pm2 logs frontend - Logs du frontend uniquement"
echo "   pm2 restart all   - Redémarrer les applications"
echo "   pm2 stop all      - Arrêter les applications"
echo ""
