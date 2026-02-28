#!/bin/bash
# Script de deploiement WStore - execute sur le VPS
# PAS de set -e pour eviter les arrets silencieux

echo "========================================="
echo "=== DEPLOIEMENT WSTORE ==="
echo "========================================="

# Setup PATH pour nvm/node
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH="$HOME/.nvm/versions/node/v20.11.1/bin:$HOME/.local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

echo "Node: $(node --version 2>/dev/null || echo 'NOT FOUND')"
echo "NPM: $(npm --version 2>/dev/null || echo 'NOT FOUND')"
echo "PM2: $(pm2 --version 2>/dev/null || echo 'NOT FOUND')"

cd /home/ubuntu/wstore || { echo "ERREUR: /home/ubuntu/wstore introuvable"; exit 1; }

# --- Git pull ---
echo ""
echo "=== 1. Git pull ==="
if [ ! -d .git ]; then
  git init
  git remote add origin https://github.com/Douabaghdadi/WStore.git
fi
git fetch origin
git reset --hard origin/main || git reset --hard origin/master
echo "Git pull OK"

# --- Nettoyage URLs dans MongoDB ---
echo ""
echo "=== 2. Nettoyage URLs HTTP dans MongoDB ==="
if command -v mongosh &> /dev/null; then
  mongosh --quiet wstore --eval '
    var r1 = db.products.updateMany(
      { image: /^http:\/\/localhost:5000/ },
      [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]
    );
    print("Products localhost: " + r1.modifiedCount);
    var r2 = db.products.updateMany(
      { image: /^http:\/\/51\.254\.135\.247/ },
      [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]
    );
    print("Products IP: " + r2.modifiedCount);
    db.categories.updateMany({ image: /^http:\/\/localhost:5000/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]);
    db.categories.updateMany({ image: /^http:\/\/51\.254\.135\.247/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]);
    db.subcategories.updateMany({ image: /^http:\/\/localhost:5000/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]);
    db.subcategories.updateMany({ image: /^http:\/\/51\.254\.135\.247/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]);
    db.brands.updateMany({ image: /^http:\/\/localhost:5000/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]);
    db.brands.updateMany({ image: /^http:\/\/51\.254\.135\.247/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]);
    print("MongoDB cleanup done!");
  ' && echo "MongoDB cleanup OK" || echo "MongoDB cleanup ECHOUE (erreur mongosh)"
else
  echo "mongosh non trouve, essai avec mongo..."
  mongo wstore --eval '
    db.products.updateMany({ image: /^http:\/\/localhost:5000/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]);
    db.products.updateMany({ image: /^http:\/\/51\.254\.135\.247/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]);
    db.categories.updateMany({ image: /^http:\/\/localhost:5000/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]);
    db.categories.updateMany({ image: /^http:\/\/51\.254\.135\.247/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]);
    db.subcategories.updateMany({ image: /^http:\/\/localhost:5000/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]);
    db.subcategories.updateMany({ image: /^http:\/\/51\.254\.135\.247/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]);
    db.brands.updateMany({ image: /^http:\/\/localhost:5000/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://localhost:5000", replacement: "" } } } }]);
    db.brands.updateMany({ image: /^http:\/\/51\.254\.135\.247/ }, [{ $set: { image: { $replaceOne: { input: "$image", find: "http://51.254.135.247:5000", replacement: "" } } } }]);
    print("MongoDB cleanup done!");
  ' && echo "MongoDB cleanup OK" || echo "MongoDB cleanup ECHOUE"
fi

# --- Backend ---
echo ""
echo "=== 3. Configuration backend ==="
sed -i 's|FRONTEND_URL=.*|FRONTEND_URL=https://w-store.tn|' backend/.env 2>/dev/null || true
sed -i 's|BACKEND_URL=.*|BACKEND_URL=https://w-store.tn|' backend/.env 2>/dev/null || true
cd /home/ubuntu/wstore/backend
npm install --production && echo "Backend npm install OK" || echo "Backend npm install ECHOUE"

# --- Frontend ---
echo ""
echo "=== 4. Configuration frontend ==="
cd /home/ubuntu/wstore/frontend

# Ecrire .env.production proprement
echo "NEXT_PUBLIC_API_URL=https://w-store.tn" > .env.production
echo "NEXT_PUBLIC_FACEBOOK_APP_ID=1770752150168884" >> .env.production
echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=890386873007-astu30t1t91ptutf2e6asqoibb1jfnrp.apps.googleusercontent.com" >> .env.production
echo "Contenu .env.production:"
cat .env.production

echo ""
echo "=== 5. Nettoyage complet du cache frontend ==="
rm -rf .next
rm -rf node_modules/.cache
echo "Cache nettoye"

echo ""
echo "=== 6. Installation frontend ==="
npm install && echo "Frontend npm install OK" || echo "Frontend npm install ECHOUE"

echo ""
echo "=== 7. Build frontend (HTTPS) ==="
export NEXT_PUBLIC_API_URL=https://w-store.tn
npm run build && echo "Frontend build OK" || echo "Frontend build ECHOUE"

echo ""
echo "=== 8. Redemarrage PM2 ==="
pm2 delete wstore-backend 2>/dev/null || true
pm2 delete wstore-frontend 2>/dev/null || true
sleep 2
cd /home/ubuntu/wstore/backend
pm2 start server.js --name wstore-backend && echo "Backend PM2 OK" || echo "Backend PM2 ECHOUE"
cd /home/ubuntu/wstore/frontend
pm2 start npm --name wstore-frontend -- start && echo "Frontend PM2 OK" || echo "Frontend PM2 ECHOUE"
pm2 save

echo ""
echo "=== 9. Verification ==="
sleep 5
curl -s -o /dev/null -w "Backend HTTP: %{http_code}\n" http://localhost:5000/api/products || echo "Backend check ECHOUE"
curl -s -o /dev/null -w "Frontend HTTP: %{http_code}\n" http://localhost:3000 || echo "Frontend check ECHOUE"

echo ""
echo "========================================="
echo "=== DEPLOIEMENT TERMINE! ==="
echo "========================================="
