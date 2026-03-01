#!/bin/bash
# 🔧 Script Simple - Débloquer Port 3000 et Redémarrer

echo "🔍 Recherche du processus qui bloque le port 3000..."
sudo lsof -i :3000

echo ""
echo "💀 Arrêt du processus zombie..."
sudo fuser -k 3000/tcp

echo ""
echo "⏳ Attente 3 secondes..."
sleep 3

echo ""
echo "🔄 Redémarrage du frontend..."
cd /home/ubuntu/wstore
pm2 restart wstore-frontend

echo ""
echo "⏳ Attente 5 secondes pour le démarrage..."
sleep 5

echo ""
echo "📊 Vérification de l'état..."
pm2 status

echo ""
echo "📋 Logs du frontend (dernières 30 lignes)..."
pm2 logs wstore-frontend --lines 30 --nostream

echo ""
echo "✅ Terminé!"
echo ""
echo "Si vous voyez 'Ready in XXXms', c'est bon!"
echo "Sinon, exécutez: pm2 logs wstore-frontend"
