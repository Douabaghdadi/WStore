#!/bin/bash

# Script de déploiement automatique pour VPS OVH
# Usage: bash deploy.sh

set -e

echo "======================================"
echo "🚀 Déploiement automatique VPS OVH"
echo "======================================"

# Variables à configurer
read -p "Entrez l'IP de votre VPS: " VPS_IP
read -p "Entrez votre nom de domaine (ou appuyez sur Entrée pour utiliser l'IP): " DOMAIN_NAME
read -p "Entrez votre email pour SSL (optionnel): " SSL_EMAIL
read -p "Entrez l'URI MongoDB: " MONGODB_URI
read -sp "Entrez le JWT_SECRET: " JWT_SECRET
echo ""

DOMAIN_NAME=${DOMAIN_NAME:-$VPS_IP}
APP_DIR="/var/www/mon-app"

echo ""
echo "📋 Configuration:"
echo "  - VPS IP: $VPS_IP"
echo "  - Domaine: $DOMAIN_NAME"
echo "  - App Directory: $APP_DIR"
echo ""

read -p "Continuer? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Connexion SSH et exécution des commandes
ssh root@$VPS_IP << 'ENDSSH'

echo "📦 Mise à jour du système..."
apt update && apt upgrade -y

echo "📦 Installation de Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo "📦 Installation de PM2..."
npm install -g pm2

echo "📦 Installation de Nginx..."
apt install -y nginx

echo "📦 Installation de Git..."
apt install -y git

echo "✅ Installation des dépendances terminée"

ENDSSH

echo ""
echo "📤 Transfert des fichiers vers le VPS..."

# Créer le répertoire sur le VPS
ssh root@$VPS_IP "mkdir -p $APP_DIR"

# Transférer les fichiers (exclure node_modules et .next)
rsync -avz --exclude 'node_modules' \
           --exclude '.next' \
           --exclude '.git' \
           --exclude 'backend/uploads' \
           ./ root@$VPS_IP:$APP_DIR/

echo "✅ Fichiers transférés"

# Configuration et démarrage sur le VPS
ssh root@$VPS_IP << ENDSSH

cd $APP_DIR

echo "🔧 Configuration du Backend..."
cd backend

# Créer le fichier .env.production
cat > .env.production << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=$MONGODB_URI
JWT_SECRET=$JWT_SECRET
FRONTEND_URL=http://$DOMAIN_NAME
EOF

# Installation des dépendances backend
npm install --production

# Créer le dossier uploads
mkdir -p uploads

echo "🔧 Configuration du Frontend..."
cd ../frontend

# Créer le fichier .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=http://$DOMAIN_NAME/api
NODE_ENV=production
EOF

# Installation et build du frontend
npm install
npm run build

echo "🔧 Configuration de Nginx..."
cat > /etc/nginx/sites-available/mon-app << 'NGINX_EOF'
server {
    listen 80;
    server_name $DOMAIN_NAME;

    client_max_body_size 50M;

    # Frontend Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Uploads statiques
    location /uploads {
        alias $APP_DIR/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

# Remplacer la variable DOMAIN_NAME dans le fichier nginx
sed -i "s/\$DOMAIN_NAME/$DOMAIN_NAME/g" /etc/nginx/sites-available/mon-app

# Activer le site
ln -sf /etc/nginx/sites-available/mon-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester et redémarrer Nginx
nginx -t
systemctl restart nginx

echo "🚀 Démarrage des applications avec PM2..."
cd $APP_DIR

# Démarrer avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root

echo "🔥 Configuration du firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "✅ Déploiement terminé!"
echo ""
echo "📊 Statut des applications:"
pm2 status

echo ""
echo "🌐 Votre application est accessible sur:"
echo "   http://$DOMAIN_NAME"
echo ""
echo "📝 Commandes utiles:"
echo "   pm2 status          - Voir le statut"
echo "   pm2 logs            - Voir les logs"
echo "   pm2 restart all     - Redémarrer"
echo "   pm2 stop all        - Arrêter"

ENDSSH

# Configuration SSL si email fourni
if [ ! -z "$SSL_EMAIL" ]; then
    echo ""
    echo "🔒 Configuration SSL avec Let's Encrypt..."
    ssh root@$VPS_IP << ENDSSH
    certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos -m $SSL_EMAIL
    systemctl reload nginx
ENDSSH
    echo "✅ SSL configuré! Votre site est accessible en HTTPS"
fi

echo ""
echo "======================================"
echo "✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"
echo "======================================"
echo ""
echo "🌐 URL: http://$DOMAIN_NAME"
if [ ! -z "$SSL_EMAIL" ]; then
    echo "🔒 HTTPS: https://$DOMAIN_NAME"
fi
echo ""
