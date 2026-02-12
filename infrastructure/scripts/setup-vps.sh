#!/bin/bash

###############################################################################
# Script de configuration initiale du VPS
# Usage: bash setup-vps.sh
# Ce script doit être exécuté UNE SEULE FOIS lors de la première installation
###############################################################################

set -e

echo "🚀 Configuration initiale du VPS pour WStore"
echo "=============================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
APP_DIR="/var/www/wstore"
BACKUP_DIR="/var/backups/wstore"
LOG_DIR="/var/log/wstore"
NODE_VERSION="20"

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si le script est exécuté en tant que root ou avec sudo
if [ "$EUID" -ne 0 ]; then 
    log_error "Ce script doit être exécuté avec sudo"
    exit 1
fi

log_info "Mise à jour du système..."
apt-get update
apt-get upgrade -y

log_info "Installation des dépendances système..."
apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    nginx \
    ufw \
    fail2ban \
    htop \
    certbot \
    python3-certbot-nginx

log_info "Installation de Node.js ${NODE_VERSION}..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y nodejs

log_info "Installation de PM2..."
npm install -g pm2
pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save

log_info "Création des répertoires..."
mkdir -p ${APP_DIR}
mkdir -p ${BACKUP_DIR}
mkdir -p ${LOG_DIR}
mkdir -p ${APP_DIR}/logs

log_info "Configuration des permissions..."
chown -R ubuntu:ubuntu ${APP_DIR}
chown -R ubuntu:ubuntu ${BACKUP_DIR}
chown -R ubuntu:ubuntu ${LOG_DIR}
chmod -R 755 ${APP_DIR}

log_info "Configuration du firewall (UFW)..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp  # Frontend (temporaire pour debug)
ufw allow 5000/tcp  # Backend (temporaire pour debug)
ufw status

log_info "Configuration de Nginx..."
# Backup de la config par défaut
if [ -f /etc/nginx/sites-enabled/default ]; then
    mv /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup
fi

# Créer la config Nginx pour WStore
cat > /etc/nginx/sites-available/wstore << 'EOF'
# Configuration Nginx pour WStore
upstream frontend {
    server localhost:3000;
    keepalive 64;
}

upstream backend {
    server localhost:5000;
    keepalive 64;
}

# Redirection HTTP vers HTTPS (à activer après SSL)
# server {
#     listen 80;
#     server_name 51.254.135.247;
#     return 301 https://$server_name$request_uri;
# }

server {
    listen 80;
    server_name 51.254.135.247;

    # Logs
    access_log /var/log/nginx/wstore-access.log;
    error_log /var/log/nginx/wstore-error.log;

    # Sécurité
    client_max_body_size 10M;
    client_body_timeout 60s;
    client_header_timeout 60s;

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    # Backend uploads
    location /uploads {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # Cache pour les images
        proxy_cache_valid 200 30d;
        proxy_cache_bypass $http_pragma $http_authorization;
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/wstore /etc/nginx/sites-enabled/wstore

# Tester la configuration
nginx -t

# Redémarrer Nginx
systemctl restart nginx
systemctl enable nginx

log_info "Configuration de la rotation des logs..."
cat > /etc/logrotate.d/wstore << 'EOF'
/var/log/wstore/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}

/var/www/wstore/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

log_info "Configuration du cron pour les backups automatiques..."
# Backup quotidien à 2h du matin
(crontab -l 2>/dev/null; echo "0 2 * * * ${APP_DIR}/infrastructure/scripts/backup.sh") | crontab -

log_info "Configuration du monitoring..."
cat > ${APP_DIR}/infrastructure/scripts/healthcheck.sh << 'EOF'
#!/bin/bash
# Health check automatique

FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000/api/products"
LOG_FILE="/var/log/wstore/healthcheck.log"

check_service() {
    local url=$1
    local name=$2
    
    if curl -f -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo "[$(date)] ✅ $name is healthy" >> $LOG_FILE
        return 0
    else
        echo "[$(date)] ❌ $name is down - restarting..." >> $LOG_FILE
        pm2 restart $name
        return 1
    fi
}

check_service "$FRONTEND_URL" "wstore-frontend"
check_service "$BACKEND_URL" "wstore-backend"
EOF

chmod +x ${APP_DIR}/infrastructure/scripts/healthcheck.sh

# Health check toutes les 5 minutes
(crontab -l 2>/dev/null; echo "*/5 * * * * ${APP_DIR}/infrastructure/scripts/healthcheck.sh") | crontab -

log_info "Configuration de fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

log_info "Optimisation des paramètres système..."
cat >> /etc/sysctl.conf << 'EOF'

# Optimisations pour Node.js
fs.file-max = 65535
net.core.somaxconn = 1024
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.ip_local_port_range = 10000 65000
EOF

sysctl -p

log_info "Installation des outils de monitoring..."
npm install -g pm2-logrotate
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

echo ""
echo "=============================================="
log_info "✅ Configuration du VPS terminée avec succès!"
echo "=============================================="
echo ""
echo "📋 Résumé de la configuration:"
echo "  - Node.js version: $(node -v)"
echo "  - NPM version: $(npm -v)"
echo "  - PM2 installé: $(pm2 -v)"
echo "  - Nginx configuré et actif"
echo "  - Firewall (UFW) activé"
echo "  - Fail2ban activé"
echo "  - Backups automatiques: quotidiens à 2h"
echo "  - Health checks: toutes les 5 minutes"
echo "  - Rotation des logs: 30 jours"
echo ""
echo "📁 Répertoires créés:"
echo "  - Application: ${APP_DIR}"
echo "  - Backups: ${BACKUP_DIR}"
echo "  - Logs: ${LOG_DIR}"
echo ""
echo "🔐 Prochaines étapes:"
echo "  1. Configurer les secrets GitHub (VPS_SSH_KEY, etc.)"
echo "  2. Pousser le code sur GitHub (branche main)"
echo "  3. Le déploiement se fera automatiquement via CI/CD"
echo "  4. Optionnel: Configurer SSL avec: sudo certbot --nginx -d votre-domaine.com"
echo ""
echo "🔍 Commandes utiles:"
echo "  - Voir les logs: pm2 logs"
echo "  - Statut des services: pm2 status"
echo "  - Monitoring: pm2 monit"
echo "  - Redémarrer: pm2 restart all"
echo ""
