#!/bin/bash

echo "=== CONFIGURATION NGINX AUTOMATIQUE ==="
echo ""

# 1. Sauvegarder l'ancienne configuration
echo "[1/5] Sauvegarde de l'ancienne configuration..."
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)
echo "   OK"
echo ""

# 2. Copier la nouvelle configuration
echo "[2/5] Installation de la nouvelle configuration..."
sudo cp /home/ubuntu/nginx-wstore-complete.conf /etc/nginx/sites-available/default
echo "   OK"
echo ""

# 3. Tester la configuration
echo "[3/5] Test de la configuration Nginx..."
sudo nginx -t
if [ $? -ne 0 ]; then
    echo "   ERREUR: Configuration invalide!"
    echo "   Restauration de l'ancienne configuration..."
    sudo cp /etc/nginx/sites-available/default.backup.* /etc/nginx/sites-available/default
    exit 1
fi
echo "   OK"
echo ""

# 4. Redémarrer Nginx
echo "[4/5] Redémarrage de Nginx..."
sudo systemctl restart nginx
echo "   OK"
echo ""

# 5. Vérifier le statut
echo "[5/5] Vérification du statut..."
sudo systemctl status nginx --no-pager | head -10
echo ""

echo "=== CONFIGURATION TERMINÉE ==="
echo ""
echo "Testez maintenant:"
echo "  - Site: http://51.254.135.247"
echo "  - Image: http://51.254.135.247/uploads/category-1767363292801.webp"
echo ""
