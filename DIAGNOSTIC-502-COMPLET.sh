#!/bin/bash

# Script de diagnostic complet pour erreur 502 Bad Gateway
# À exécuter sur le VPS Ubuntu

echo "=========================================="
echo "DIAGNOSTIC COMPLET - 502 BAD GATEWAY"
echo "=========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Vérifier l'espace disque
echo -e "${YELLOW}1. Vérification de l'espace disque...${NC}"
df -h
echo ""

# 2. Vérifier la mémoire
echo -e "${YELLOW}2. Vérification de la mémoire...${NC}"
free -h
echo ""

# 3. Vérifier les processus PM2
echo -e "${YELLOW}3. Vérification des processus PM2...${NC}"
pm2 list
pm2 logs --lines 50 --nostream
echo ""

# 4. Vérifier les ports
echo -e "${YELLOW}4. Vérification des ports...${NC}"
echo "Port 3000 (Frontend):"
netstat -tulpn | grep :3000 || echo "Port 3000 non utilisé"
echo "Port 5000 (Backend):"
netstat -tulpn | grep :5000 || echo "Port 5000 non utilisé"
echo "Port 80 (Nginx):"
netstat -tulpn | grep :80 || echo "Port 80 non utilisé"
echo ""

# 5. Vérifier Nginx
echo -e "${YELLOW}5. Vérification de Nginx...${NC}"
systemctl status nginx --no-pager
nginx -t
echo ""

# 6. Vérifier les logs Nginx
echo -e "${YELLOW}6. Dernières erreurs Nginx...${NC}"
tail -n 50 /var/log/nginx/error.log
echo ""

# 7. Tester les connexions
echo -e "${YELLOW}7. Test des connexions locales...${NC}"
echo "Test Frontend (localhost:3000):"
curl -I http://localhost:3000 2>&1 | head -n 5
echo ""
echo "Test Backend (localhost:5000):"
curl -I http://localhost:5000/api 2>&1 | head -n 5
echo ""

# 8. Vérifier les fichiers de build
echo -e "${YELLOW}8. Vérification des fichiers de build...${NC}"
if [ -d "/var/www/wstore/frontend/.next" ]; then
    echo -e "${GREEN}✓ Build frontend existe${NC}"
    ls -lh /var/www/wstore/frontend/.next | head -n 10
else
    echo -e "${RED}✗ Build frontend manquant${NC}"
fi
echo ""

if [ -f "/var/www/wstore/backend/server.js" ]; then
    echo -e "${GREEN}✓ Backend server.js existe${NC}"
else
    echo -e "${RED}✗ Backend server.js manquant${NC}"
fi
echo ""

# 9. Vérifier les permissions
echo -e "${YELLOW}9. Vérification des permissions...${NC}"
ls -la /var/www/wstore/ | head -n 10
echo ""

# 10. Résumé
echo "=========================================="
echo "RÉSUMÉ DU DIAGNOSTIC"
echo "=========================================="
echo ""

# Vérifier si PM2 tourne
if pm2 list | grep -q "online"; then
    echo -e "${GREEN}✓ PM2 a des processus en ligne${NC}"
else
    echo -e "${RED}✗ Aucun processus PM2 en ligne${NC}"
fi

# Vérifier si Nginx tourne
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx est actif${NC}"
else
    echo -e "${RED}✗ Nginx n'est pas actif${NC}"
fi

# Vérifier l'espace disque
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    echo -e "${RED}✗ Espace disque critique: ${DISK_USAGE}%${NC}"
else
    echo -e "${GREEN}✓ Espace disque OK: ${DISK_USAGE}%${NC}"
fi

echo ""
echo "=========================================="
