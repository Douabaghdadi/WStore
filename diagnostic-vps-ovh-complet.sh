#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🔍 DIAGNOSTIC COMPLET VPS OVH - W.STORE 🔍              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Informations VPS
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 INFORMATIONS VPS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Nom d'hôte: $(hostname)"
echo "IP Publique: $(curl -s ifconfig.me)"
echo "OS: $(lsb_release -d | cut -f2)"
echo "Kernel: $(uname -r)"
echo "Uptime: $(uptime -p)"
echo ""

# Ressources système
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}💻 RESSOURCES SYSTÈME${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo "CPU:"
lscpu | grep "Model name" | cut -d: -f2 | xargs
echo "vCores: $(nproc)"
echo ""

echo "Mémoire:"
free -h
echo ""

echo "Disque:"
df -h / | tail -1
echo ""

echo "Charge système:"
uptime
echo ""

# Vérification des services
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}🔧 SERVICES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# MongoDB
echo -n "MongoDB: "
if systemctl is-active --quiet mongod; then
    echo -e "${GREEN}✅ Actif${NC}"
else
    echo -e "${RED}❌ Inactif${NC}"
fi

# Nginx
echo -n "Nginx: "
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Actif${NC}"
    nginx -v 2>&1 | grep version
else
    echo -e "${RED}❌ Inactif${NC}"
fi

# PM2
echo -n "PM2: "
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ Installé${NC}"
    pm2 --version
else
    echo -e "${RED}❌ Non installé${NC}"
fi
echo ""

# Processus PM2
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📊 PROCESSUS PM2${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
pm2 list
echo ""

# Ports
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}🔌 PORTS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -n "Port 80 (HTTP): "
if netstat -tlnp | grep -q ":80 "; then
    echo -e "${GREEN}✅ Ouvert${NC}"
else
    echo -e "${RED}❌ Fermé${NC}"
fi

echo -n "Port 443 (HTTPS): "
if netstat -tlnp | grep -q ":443 "; then
    echo -e "${GREEN}✅ Ouvert${NC}"
else
    echo -e "${RED}❌ Fermé${NC}"
fi

echo -n "Port 3000 (Frontend): "
if netstat -tlnp | grep -q ":3000 "; then
    echo -e "${GREEN}✅ Ouvert${NC}"
else
    echo -e "${RED}❌ Fermé${NC}"
fi

echo -n "Port 3001 (Backend): "
if netstat -tlnp | grep -q ":3001 "; then
    echo -e "${GREEN}✅ Ouvert${NC}"
else
    echo -e "${RED}❌ Fermé${NC}"
fi

echo -n "Port 27017 (MongoDB): "
if netstat -tlnp | grep -q ":27017 "; then
    echo -e "${GREEN}✅ Ouvert${NC}"
else
    echo -e "${RED}❌ Fermé${NC}"
fi
echo ""

# Tests de connectivité
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}🧪 TESTS DE CONNECTIVITÉ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -n "Backend (localhost:3001): "
if curl -f -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Répond${NC}"
else
    echo -e "${RED}❌ Ne répond pas${NC}"
fi

echo -n "Frontend (localhost:3000): "
if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Répond${NC}"
else
    echo -e "${RED}❌ Ne répond pas${NC}"
fi

echo -n "Site public (w-store.tn): "
if curl -f -s https://w-store.tn > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Accessible${NC}"
else
    echo -e "${RED}❌ Inaccessible${NC}"
fi
echo ""

# Configuration Nginx
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}⚙️  CONFIGURATION NGINX${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
nginx -t 2>&1
echo ""

# Certificat SSL
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}🔒 CERTIFICAT SSL${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
if [ -d "/etc/letsencrypt/live/w-store.tn" ]; then
    echo -e "${GREEN}✅ Certificat SSL présent${NC}"
    echo "Expiration:"
    certbot certificates 2>/dev/null | grep "Expiry Date" || echo "Impossible de vérifier"
else
    echo -e "${RED}❌ Certificat SSL manquant${NC}"
fi
echo ""

# Fichiers de configuration
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📁 FICHIERS DE CONFIGURATION${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo -n "Backend .env: "
if [ -f ~/WStore/backend/.env ]; then
    echo -e "${GREEN}✅ Présent${NC}"
else
    echo -e "${RED}❌ Manquant${NC}"
fi

echo -n "Frontend .env.production: "
if [ -f ~/WStore/frontend/.env.production ]; then
    echo -e "${GREEN}✅ Présent${NC}"
else
    echo -e "${RED}❌ Manquant${NC}"
fi

echo -n "Frontend build: "
if [ -d ~/WStore/frontend/.next ]; then
    echo -e "${GREEN}✅ Présent${NC}"
else
    echo -e "${RED}❌ Manquant${NC}"
fi
echo ""

# Logs récents
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📝 LOGS RÉCENTS (10 dernières lignes)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

echo "Backend:"
pm2 logs backend --lines 10 --nostream 2>/dev/null || echo "Pas de logs backend"
echo ""

echo "Frontend:"
pm2 logs frontend --lines 10 --nostream 2>/dev/null || echo "Pas de logs frontend"
echo ""

echo "Nginx (erreurs):"
tail -10 /var/log/nginx/error.log 2>/dev/null || echo "Pas d'erreurs Nginx récentes"
echo ""

# DNS
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}🌐 CONFIGURATION DNS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Résolution w-store.tn:"
nslookup w-store.tn 2>/dev/null | grep "Address:" | tail -2 || echo "Impossible de résoudre"
echo ""

# Résumé
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📊 RÉSUMÉ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Compter les problèmes
PROBLEMS=0

systemctl is-active --quiet mongod || ((PROBLEMS++))
systemctl is-active --quiet nginx || ((PROBLEMS++))
netstat -tlnp | grep -q ":3000 " || ((PROBLEMS++))
netstat -tlnp | grep -q ":3001 " || ((PROBLEMS++))
curl -f -s http://localhost:3001/api/health > /dev/null 2>&1 || ((PROBLEMS++))
curl -f -s http://localhost:3000 > /dev/null 2>&1 || ((PROBLEMS++))

if [ $PROBLEMS -eq 0 ]; then
    echo -e "${GREEN}✅ Tout fonctionne correctement!${NC}"
else
    echo -e "${RED}❌ $PROBLEMS problème(s) détecté(s)${NC}"
    echo ""
    echo "Pour corriger automatiquement:"
    echo "  cd ~/WStore"
    echo "  chmod +x corriger-502-automatique.sh"
    echo "  ./corriger-502-automatique.sh"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
