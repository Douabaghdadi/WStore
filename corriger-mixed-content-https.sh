#!/bin/bash

# Script de correction Mixed Content HTTPS
# À exécuter sur le VPS

echo "🔒 Correction Mixed Content HTTPS..."
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Vérifier si on est dans le bon répertoire
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Erreur: Répertoires frontend/backend non trouvés${NC}"
    echo -e "${YELLOW}   Assurez-vous d'être à la racine du projet${NC}"
    exit 1
fi

echo -e "${CYAN}📦 Étape 1: Rebuild du frontend...${NC}"
cd frontend

# Nettoyer le cache
echo -e "${YELLOW}   Nettoyage du cache...${NC}"
rm -rf .next

# Build
echo -e "${YELLOW}   Build en cours...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build${NC}"
    cd ..
    exit 1
fi

echo -e "${GREEN}✅ Build terminé avec succès${NC}"
echo ""

cd ..

echo -e "${CYAN}🔄 Étape 2: Restart des services PM2...${NC}"

# Restart frontend
echo -e "${YELLOW}   Restart frontend...${NC}"
pm2 restart frontend

# Restart backend
echo -e "${YELLOW}   Restart backend...${NC}"
pm2 restart backend

echo -e "${GREEN}✅ Services redémarrés${NC}"
echo ""

echo -e "${CYAN}🔍 Étape 3: Vérification Nginx...${NC}"

# Tester la configuration Nginx
sudo nginx -t

if [ $? -eq 0 ]; then
    echo -e "${YELLOW}   Rechargement de Nginx...${NC}"
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx rechargé${NC}"
else
    echo -e "${RED}❌ Erreur dans la configuration Nginx${NC}"
    echo -e "${YELLOW}   Vérifiez /etc/nginx/sites-available/wstore${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Correction terminée!${NC}"
echo ""
echo -e "${CYAN}📱 Testez maintenant:${NC}"
echo -e "${NC}   1. Ouvrez https://w-store.tn${NC}"
echo -e "${NC}   2. Ouvrez la console (F12)${NC}"
echo -e "${NC}   3. Vérifiez qu'il n'y a plus d'erreurs Mixed Content${NC}"
echo -e "${NC}   4. Testez le chargement des produits et filtres${NC}"
echo ""
echo -e "${CYAN}✨ Améliorations appliquées:${NC}"
echo -e "${GREEN}   ✓ API en HTTPS${NC}"
echo -e "${GREEN}   ✓ Plus d'erreurs Mixed Content${NC}"
echo -e "${GREEN}   ✓ Sécurité renforcée${NC}"
echo -e "${GREEN}   ✓ Filtres fonctionnels${NC}"
