#!/bin/bash

# Script de configuration HTTPS avec Nginx et Let's Encrypt
# Pour w-store.tn

set -e

echo "=========================================="
echo "Configuration HTTPS pour w-store.tn"
echo "=========================================="
echo ""

# Variables
DOMAIN="w-store.tn"
WWW_DOMAIN="www.w-store.tn"
EMAIL="votre-email@example.com"  # CHANGEZ CECI
BACKEND_PORT=5000
FRONTEND_PORT=3000

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Vérifier si on est root ou avec sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Ce script doit être exécuté avec sudo${NC}"
    exit 1
fi

# 1. Installer Nginx
echo -e "${YELLOW}1. Installation de Nginx...${NC}"
apt update
apt install -y nginx

# 2. Installer Certbot
echo -e "${YELLOW}2. Installation de Certbot...${NC}"
apt install -y certbot python3-certbot-nginx

# 3. Configurer Nginx pour le frontend
echo -e "${YELLOW}3. Configuration Nginx pour le frontend...${NC}"
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name w-store.tn www.w-store.tn;

    # Logs
    access_log /var/log/nginx/wstore-access.log;
    error_log /var/log/nginx/wstore-error.log;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads (images, etc.)
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# 4. Activer le site
echo -e "${YELLOW}4. Activation du site...${NC}"
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 5. Tester la configuration Nginx
echo -e "${YELLOW}5. Test de la configuration Nginx...${NC}"
nginx -t

# 6. Redémarrer Nginx
echo -e "${YELLOW}6. Redémarrage de Nginx...${NC}"
systemctl restart nginx
systemctl enable nginx

# 7. Configurer le pare-feu
echo -e "${YELLOW}7. Configuration du pare-feu...${NC}"
ufw allow 'Nginx Full'
ufw allow 22
ufw --force enable

echo ""
echo -e "${GREEN}=========================================="
echo "Configuration de base terminée!"
echo "==========================================${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT: Avant de continuer avec SSL${NC}"
echo ""
echo "1. Assurez-vous que votre DNS pointe vers ce serveur:"
echo "   - A record: w-store.tn -> 51.254.135.247"
echo "   - A record: www.w-store.tn -> 51.254.135.247"
echo ""
echo "2. Vérifiez avec: dig w-store.tn"
echo ""
echo "3. Testez HTTP: http://w-store.tn"
echo ""
echo -e "${YELLOW}Une fois le DNS configuré, exécutez:${NC}"
echo "   sudo certbot --nginx -d w-store.tn -d www.w-store.tn"
echo ""
echo -e "${GREEN}Votre site est accessible sur:${NC}"
echo "   http://w-store.tn"
echo "   http://www.w-store.tn"
echo ""
