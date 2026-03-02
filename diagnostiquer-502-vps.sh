#!/bin/bash

echo "🔍 DIAGNOSTIC 502 BAD GATEWAY - VPS"
echo "===================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📋 1. Vérification des processus PM2..."
pm2 list
echo ""

echo "📋 2. Statut détaillé PM2..."
pm2 status
echo ""

echo "📋 3. Logs Backend (dernières 30 lignes)..."
pm2 logs backend --lines 30 --nostream
echo ""

echo "📋 4. Logs Frontend (dernières 30 lignes)..."
pm2 logs frontend --lines 30 --nostream
echo ""

echo "📋 5. Vérification des ports..."
echo "Port 3001 (Backend):"
netstat -tlnp | grep :3001 || echo -e "${RED}❌ Port 3001 non utilisé${NC}"
echo ""
echo "Port 3000 (Frontend):"
netstat -tlnp | grep :3000 || echo -e "${RED}❌ Port 3000 non utilisé${NC}"
echo ""

echo "📋 6. Test connexion Backend..."
curl -I http://localhost:3001/api/health 2>/dev/null || echo -e "${RED}❌ Backend ne répond pas${NC}"
echo ""

echo "📋 7. Test connexion Frontend..."
curl -I http://localhost:3000 2>/dev/null || echo -e "${RED}❌ Frontend ne répond pas${NC}"
echo ""

echo "📋 8. Vérification Nginx..."
systemctl status nginx --no-pager
echo ""

echo "📋 9. Test configuration Nginx..."
nginx -t
echo ""

echo "📋 10. Logs Nginx (erreurs récentes)..."
tail -50 /var/log/nginx/error.log
echo ""

echo "📋 11. Espace disque..."
df -h
echo ""

echo "📋 12. Mémoire disponible..."
free -h
echo ""

echo ""
echo "🔧 SOLUTIONS RECOMMANDÉES:"
echo "=========================="
echo ""
echo "Si Backend ne répond pas:"
echo "  cd ~/WStore/backend && pm2 restart backend"
echo ""
echo "Si Frontend ne répond pas:"
echo "  cd ~/WStore/frontend && pm2 restart frontend"
echo ""
echo "Si les deux ne répondent pas:"
echo "  pm2 restart all"
echo ""
echo "Si Nginx a des erreurs:"
echo "  sudo systemctl restart nginx"
echo ""
echo "Pour rebuild complet:"
echo "  cd ~/WStore && ./infrastructure/scripts/quick-deploy.sh"
