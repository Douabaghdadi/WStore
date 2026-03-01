#!/bin/bash
# Fix final et deploiement - A executer sur le VPS

cd ~/wstore

echo "=== Correction finale du Mixed Content ==="
echo ""

echo "1. Pull des derniers changements depuis Git..."
git pull origin main || echo "Pas de git configuré, on continue..."

echo "2. Verification de .env.production..."
cat > frontend/.env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://w-store.tn/api
NEXT_PUBLIC_FACEBOOK_APP_ID=1770752150168884
NEXT_PUBLIC_GOOGLE_CLIENT_ID=890386873007-astu30t1t91ptutf2e6asqoibb1jfnrp.apps.googleusercontent.com
EOF

echo "3. Nettoyage complet du cache Next.js..."
cd frontend
rm -rf .next
rm -rf node_modules/.cache

echo "4. Rebuild complet du frontend..."
npm run build

echo "5. Redemarrage de PM2..."
cd ..
pm2 delete wstore-frontend
pm2 start npm --name "wstore-frontend" -- run start --prefix frontend

echo ""
echo "=== Correction terminee! ==="
pm2 status
pm2 logs wstore-frontend --lines 20
