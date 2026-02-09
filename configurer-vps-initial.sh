#!/bin/bash
# Script de configuration initiale du VPS
# À exécuter sur le VPS: bash configurer-vps-initial.sh

set -e

echo "=== Configuration initiale du VPS WStore ==="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Mise à jour du système
echo -e "${YELLOW}[1/10] Mise à jour du système...${NC}"
sudo apt update
sudo apt upgrade -y
echo -e "${GREEN}✓ Système mis à jour${NC}"

# 2. Installation de Node.js 18.x
echo -e "\n${YELLOW}[2/10] Installation de Node.js...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    echo -e "${GREEN}✓ Node.js installé: $(node --version)${NC}"
else
    echo -e "${GREEN}✓ Node.js déjà installé: $(node --version)${NC}"
fi

# 3. Installation de PM2
echo -e "\n${YELLOW}[3/10] Installation de PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo -e "${GREEN}✓ PM2 installé: $(pm2 --version)${NC}"
else
    echo -e "${GREEN}✓ PM2 déjà installé: $(pm2 --version)${NC}"
fi

# 4. Configuration PM2 au démarrage
echo -e "\n${YELLOW}[4/10] Configuration PM2 au démarrage...${NC}"
pm2 startup | grep -E "^sudo" | bash || true
echo -e "${GREEN}✓ PM2 configuré pour démarrer automatiquement${NC}"

# 5. Installation de Nginx
echo -e "\n${YELLOW}[5/10] Installation de Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
    echo -e "${GREEN}✓ Nginx installé: $(nginx -v 2>&1)${NC}"
else
    echo -e "${GREEN}✓ Nginx déjà installé: $(nginx -v 2>&1)${NC}"
fi

# 6. Configuration du pare-feu
echo -e "\n${YELLOW}[6/10] Configuration du pare-feu...${NC}"
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 3000/tcp # Frontend
sudo ufw allow 5000/tcp # Backend
echo "y" | sudo ufw enable || true
echo -e "${GREEN}✓ Pare-feu configuré${NC}"
sudo ufw status

# 7. Création des répertoires
echo -e "\n${YELLOW}[7/10] Création des répertoires...${NC}"
mkdir -p /home/ubuntu/wstore/logs
mkdir -p /home/ubuntu/wstore/backend/uploads
mkdir -p /home/ubuntu/wstore/frontend
echo -e "${GREEN}✓ Répertoires créés${NC}"

# 8. Configuration Nginx
echo -e "\n${YELLOW}[8/10] Configuration de Nginx...${NC}"
sudo tee /etc/nginx/sites-available/wstore > /dev/null <<'EOF'
# Frontend (port 80)
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }

    # Uploads statiques
    location /uploads {
        proxy_pass http://localhost:5000/uploads;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Activer la configuration
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/wstore /etc/nginx/sites-enabled/

# Tester et redémarrer Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
echo -e "${GREEN}✓ Nginx configuré et démarré${NC}"

# 9. Installation d'outils utiles
echo -e "\n${YELLOW}[9/10] Installation d'outils utiles...${NC}"
sudo apt install -y htop curl wget git unzip
echo -e "${GREEN}✓ Outils installés${NC}"

# 10. Optimisation système
echo -e "\n${YELLOW}[10/10] Optimisation système...${NC}"

# Augmenter les limites de fichiers ouverts
sudo tee -a /etc/security/limits.conf > /dev/null <<EOF
* soft nofile 65536
* hard nofile 65536
EOF

# Optimisation réseau
sudo tee -a /etc/sysctl.conf > /dev/null <<EOF
net.core.somaxconn = 65536
net.ipv4.tcp_max_syn_backlog = 65536
EOF
sudo sysctl -p

echo -e "${GREEN}✓ Système optimisé${NC}"

# Résumé
echo -e "\n${GREEN}=== Configuration terminée ===${NC}"
echo ""
echo "Informations système:"
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - PM2: $(pm2 --version)"
echo "  - Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo ""
echo "Répertoires créés:"
echo "  - /home/ubuntu/wstore"
echo "  - /home/ubuntu/wstore/logs"
echo "  - /home/ubuntu/wstore/backend/uploads"
echo ""
echo "Services actifs:"
sudo systemctl is-active nginx && echo "  ✓ Nginx" || echo "  ✗ Nginx"
echo ""
echo "Pare-feu:"
sudo ufw status | grep -E "80|443|3000|5000|22"
echo ""
echo -e "${YELLOW}Prochaine étape:${NC}"
echo "  Depuis votre machine Windows, exécutez:"
echo "  ${GREEN}.\deploy-to-vps.ps1${NC}"
echo ""
