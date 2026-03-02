#!/bin/bash

# Script pour installer PM2 et corriger l'erreur 502
# À exécuter sur le VPS Ubuntu

echo "=========================================="
echo "INSTALLATION PM2 ET CORRECTION 502"
echo "=========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Installer Node.js et npm si nécessaire
echo -e "${YELLOW}1. Vérification de Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo "Installation de Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo -e "${GREEN}✓ Node.js déjà installé: $(node -v)${NC}"
fi
echo ""

# 2. Installer PM2 globalement
echo -e "${YELLOW}2. Installation de PM2...${NC}"
sudo npm install -g pm2
echo -e "${GREEN}✓ PM2 installé: $(pm2 -v)${NC}"
echo ""

# 3. Nettoyer l'espace disque
echo -e "${YELLOW}3. Nettoyage de l'espace disque...${NC}"
sudo apt-get clean
sudo rm -rf /tmp/* /var/tmp/* 2>/dev/null || true
echo -e "${GREEN}✓ Espace nettoyé${NC}"
echo ""

# 4. Vérifier le répertoire du projet
echo -e "${YELLOW}4. Vérification du projet...${NC}"
if [ -d "/var/www/wstore" ]; then
    echo -e "${GREEN}✓ Projet trouvé: /var/www/wstore${NC}"
    PROJECT_DIR="/var/www/wstore"
elif [ -d "/home/ubuntu/wstore" ]; then
    echo -e "${GREEN}✓ Projet trouvé: /home/ubuntu/wstore${NC}"
    PROJECT_DIR="/home/ubuntu/wstore"
else
    echo -e "${RED}✗ Projet non trouvé!${NC}"
    echo "Veuillez spécifier le chemin du projet:"
    read PROJECT_DIR
fi
echo ""

# 5. Installer les dépendances
echo -e "${YELLOW}5. Installation des dépendances...${NC}"

# Backend
if [ -d "$PROJECT_DIR/backend" ]; then
    echo "Installation backend..."
    cd $PROJECT_DIR/backend
    npm install
    echo -e "${GREEN}✓ Backend installé${NC}"
fi

# Frontend
if [ -d "$PROJECT_DIR/frontend" ]; then
    echo "Installation frontend..."
    cd $PROJECT_DIR/frontend
    npm install
    echo -e "${GREEN}✓ Frontend installé${NC}"
fi
echo ""

# 6. Build du frontend
echo -e "${YELLOW}6. Build du frontend...${NC}"
cd $PROJECT_DIR/frontend
rm -rf .next
npm run build
echo -e "${GREEN}✓ Frontend build${NC}"
echo ""

# 7. Créer le dossier de logs
echo -e "${YELLOW}7. Création du dossier de logs...${NC}"
mkdir -p $PROJECT_DIR/logs
chmod 755 $PROJECT_DIR/logs
echo -e "${GREEN}✓ Dossier de logs créé${NC}"
echo ""

# 8. Démarrer les services avec PM2
echo -e "${YELLOW}8. Démarrage des services PM2...${NC}"

# Arrêter les anciens processus
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Démarrer le backend
cd $PROJECT_DIR/backend
pm2 start server.js --name wstore-backend

# Démarrer le frontend
cd $PROJECT_DIR/frontend
pm2 start npm --name wstore-frontend -- start

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo -e "${GREEN}✓ Services PM2 démarrés${NC}"
echo ""

# 9. Attendre que les services démarrent
echo -e "${YELLOW}9. Attente du démarrage des services...${NC}"
sleep 10
echo ""

# 10. Vérifier les services
echo -e "${YELLOW}10. Vérification des services...${NC}"
pm2 list
echo ""

# 11. Installer et configurer Nginx si nécessaire
echo -e "${YELLOW}11. Vérification de Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    echo "Installation de Nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Redémarrer Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
echo -e "${GREEN}✓ Nginx configuré${NC}"
echo ""

# 12. Test des services
echo -e "${YELLOW}12. Test des services...${NC}"
echo "Frontend (port 3000):"
curl -I http://localhost:3000 2>&1 | head -n 1
echo ""
echo "Backend (port 5000):"
curl -I http://localhost:5000/api 2>&1 | head -n 1
echo ""

# 13. Résumé
echo "=========================================="
echo -e "${GREEN}INSTALLATION ET CORRECTION TERMINÉES${NC}"
echo "=========================================="
echo ""
echo "État des services:"
pm2 list
echo ""
echo "Nginx:"
sudo systemctl status nginx --no-pager | head -n 3
echo ""
echo "Testez maintenant: http://51.254.135.247"
echo ""
echo "Commandes utiles:"
echo "  pm2 logs          - Voir les logs"
echo "  pm2 restart all   - Redémarrer les services"
echo "  pm2 monit         - Monitorer les services"
echo ""
