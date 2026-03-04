#!/bin/bash

echo "=== NETTOYAGE GIT UPLOADS ==="

cd /home/ubuntu/wstore

echo "1. Suppression des fichiers uploads du tracking Git..."
git rm -r --cached backend/uploads/ 2>/dev/null || true

echo "2. Vérification .gitignore..."
if ! grep -q "backend/uploads/" .gitignore; then
    echo "backend/uploads/" >> .gitignore
fi

echo "3. Commit des changements..."
git add .gitignore
git commit -m "fix: Remove uploads from Git tracking" 2>/dev/null || echo "Rien à commiter"

echo "4. Correction des permissions uploads..."
sudo chown -R ubuntu:ubuntu backend/uploads/
sudo chmod -R 755 backend/uploads/
sudo find backend/uploads/ -type f -exec chmod 644 {} \;

echo "5. Test Git status..."
git status

echo ""
echo "✅ Nettoyage terminé"
