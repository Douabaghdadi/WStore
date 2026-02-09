#!/bin/bash

echo "=== Correction du problème API sur VPS Ubuntu ==="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variables
VPS_IP="51.254.135.247"
PROJECT_DIR="/root/wstore"

echo -e "${YELLOW}1. Vérification du backend...${NC}"
cd $PROJECT_DIR/backend

# Vérifier si le backend tourne
if pm2 list | grep -q "wstore-backend"; then
    echo -e "${GREEN}Backend détecté${NC}"
else
    echo -e "${RED}Backend non détecté!${NC}"
fi

echo -e "${YELLOW}2. Vérification des variables d'environnement frontend...${NC}"
cd $PROJECT_DIR/frontend

# Afficher le contenu actuel
echo "Contenu de .env.production:"
cat .env.production

echo -e "\n${YELLOW}3. Rebuild du frontend avec les bonnes variables...${NC}"

# S'assurer que les variables sont correctes
export NEXT_PUBLIC_API_URL=http://$VPS_IP:5000
export NEXT_PUBLIC_FACEBOOK_APP_ID=1770752150168884
export NEXT_PUBLIC_GOOGLE_CLIENT_ID=890386873007-astu30t1t91ptutf2e6asqoibb1jfnrp.apps.googleusercontent.com

echo "Variables d'environnement définies:"
echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"

# Nettoyer et rebuild
echo -e "${YELLOW}Nettoyage du cache Next.js...${NC}"
rm -rf .next
rm -rf node_modules/.cache

echo -e "${YELLOW}Build du frontend...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build réussi!${NC}"
else
    echo -e "${RED}Erreur lors du build!${NC}"
    exit 1
fi

echo -e "\n${YELLOW}4. Redémarrage des services PM2...${NC}"

# Arrêter les services
pm2 stop wstore-backend wstore-frontend

# Redémarrer le backend
cd $PROJECT_DIR/backend
pm2 start ecosystem.config.js --only wstore-backend

# Attendre que le backend démarre
sleep 3

# Redémarrer le frontend
cd $PROJECT_DIR/frontend
pm2 start ecosystem.config.js --only wstore-frontend

# Sauvegarder la configuration PM2
pm2 save

echo -e "\n${YELLOW}5. Vérification des services...${NC}"
pm2 list

echo -e "\n${YELLOW}6. Test de connexion...${NC}"
sleep 5

# Tester le backend
echo "Test backend:"
curl -s http://localhost:5000/api/products | head -c 100

echo -e "\n\nTest frontend:"
curl -s http://localhost:3000 | grep -o "<title>.*</title>"

echo -e "\n${GREEN}=== Correction terminée ===${NC}"
echo -e "${YELLOW}Accédez à votre site: http://$VPS_IP${NC}"
echo -e "${YELLOW}Pour voir les logs:${NC}"
echo "  pm2 logs wstore-backend"
echo "  pm2 logs wstore-frontend"
