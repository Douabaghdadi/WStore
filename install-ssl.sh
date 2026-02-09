#!/bin/bash

# Script pour installer le certificat SSL
# À exécuter APRÈS avoir configuré le DNS

set -e

DOMAIN="w-store.tn"
WWW_DOMAIN="www.w-store.tn"
EMAIL="contact@w-store.tn"  # Changez si nécessaire

echo "=========================================="
echo "Installation du certificat SSL"
echo "=========================================="
echo ""

# Vérifier si on est root
if [ "$EUID" -ne 0 ]; then 
    echo "Ce script doit être exécuté avec sudo"
    exit 1
fi

# Vérifier que le DNS est configuré
echo "Vérification du DNS..."
if ! dig +short $DOMAIN | grep -q "51.254.135.247"; then
    echo "ATTENTION: Le DNS ne semble pas pointer vers ce serveur"
    echo "Assurez-vous que $DOMAIN pointe vers 51.254.135.247"
    read -p "Voulez-vous continuer quand même? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Installer le certificat SSL
echo ""
echo "Installation du certificat SSL avec Let's Encrypt..."
echo ""

certbot --nginx \
    -d $DOMAIN \
    -d $WWW_DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --redirect

# Configurer le renouvellement automatique
echo ""
echo "Configuration du renouvellement automatique..."
systemctl enable certbot.timer
systemctl start certbot.timer

# Test du renouvellement
echo ""
echo "Test du renouvellement..."
certbot renew --dry-run

echo ""
echo "=========================================="
echo "SSL installé avec succès!"
echo "=========================================="
echo ""
echo "Votre site est maintenant accessible en HTTPS:"
echo "   https://w-store.tn"
echo "   https://www.w-store.tn"
echo ""
echo "Le certificat se renouvellera automatiquement."
echo ""
