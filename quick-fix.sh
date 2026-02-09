#!/bin/bash
# Script de correction rapide - Copier/coller dans le terminal VPS

cd /var/www/mon-app
sudo pm2 delete all
sudo pm2 start ecosystem.config.js --env production
sudo pm2 save
sudo pm2 startup systemd -u ubuntu --hp /home/ubuntu
sudo pm2 save
echo ""
echo "✅ Correction appliquée!"
echo ""
sudo pm2 status
echo ""
echo "📊 Logs (Ctrl+C pour quitter):"
sudo pm2 logs --lines 20
