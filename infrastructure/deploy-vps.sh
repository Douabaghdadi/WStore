#!/bin/bash
# Script de deploiement WStore - execute sur le VPS
set -e

echo "========================================="
echo "=== DEPLOIEMENT WSTORE ==="
echo "========================================="

export PATH="/home/ubuntu/.nvm/versions/node/v20.11.1/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

cd /home/ubuntu/wstore

# --- Git pull ---
echo "=== Git pull ==="
if [ ! -d .git ]; then
  git init
  git remote add origin https://github.com/Douabaghdadi/WStore.git
fi
git fetch origin
git reset --hard origin/main || git reset --hard origin/master

# --- Nettoyage URLs dans MongoDB ---
echo "=== Nettoyage URLs HTTP dans MongoDB ==="
mongosh --quiet wstore --eval '
  // Fix localhost URLs in products
  var r1 = db.products.updateMany(
    { image: { $regex: "^http://localhost:5000" } },
    [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]
  );
  print("Products localhost fixed: " + r1.modifiedCount);
  
  // Fix IP-based URLs in products  
  var r2 = db.products.updateMany(
    { image: { $regex: "^http://51\\.254\\.135\\.247" } },
    [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]
  );
  print("Products IP fixed: " + r2.modifiedCount);
  
  // Fix categories
  db.categories.updateMany(
    { image: { $regex: "^http://localhost:5000" } },
    [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]
  );
  db.categories.updateMany(
    { image: { $regex: "^http://51\\.254\\.135\\.247" } },
    [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]
  );
  
  // Fix subcategories
  db.subcategories.updateMany(
    { image: { $regex: "^http://localhost:5000" } },
    [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]
  );
  db.subcategories.updateMany(
    { image: { $regex: "^http://51\\.254\\.135\\.247" } },
    [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]
  );
  
  // Fix brands
  db.brands.updateMany(
    { image: { $regex: "^http://localhost:5000" } },
    [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]
  );
  db.brands.updateMany(
    { image: { $regex: "^http://51\\.254\\.135\\.247" } },
    [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]
  );
  print("MongoDB cleanup done!");
' || echo "MongoDB cleanup skipped"

# --- Backend ---
echo "=== Configuration backend ==="
sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=https://w-store.tn|' backend/.env
sed -i 's|BACKEND_URL=.*|BACKEND_URL=https://w-store.tn|' backend/.env
cd /home/ubuntu/wstore/backend
npm install --production

# --- Frontend ---
echo "=== Configuration frontend ==="
cd /home/ubuntu/wstore/frontend

# Ecrire .env.production proprement
echo "NEXT_PUBLIC_API_URL=https://w-store.tn" > .env.production
echo "NEXT_PUBLIC_FACEBOOK_APP_ID=1770752150168884" >> .env.production
echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=890386873007-astu30t1t91ptutf2e6asqoibb1jfnrp.apps.googleusercontent.com" >> .env.production

echo "=== Nettoyage complet du cache frontend ==="
rm -rf .next
rm -rf node_modules/.cache

echo "=== Installation frontend ==="
npm install

echo "=== Build frontend (HTTPS) ==="
export NEXT_PUBLIC_API_URL=https://w-store.tn
npm run build

echo "=== Redemarrage PM2 ==="
pm2 delete wstore-backend 2>/dev/null || true
pm2 delete wstore-frontend 2>/dev/null || true
cd /home/ubuntu/wstore/backend
pm2 start server.js --name wstore-backend
cd /home/ubuntu/wstore/frontend
pm2 start npm --name wstore-frontend -- start
pm2 save

echo "=== Verification ==="
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/products && echo " - Backend OK" || echo " - Backend FAILED"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo " - Frontend OK" || echo " - Frontend FAILED"

echo "========================================="
echo "=== DEPLOIEMENT TERMINE! ==="
echo "========================================="
