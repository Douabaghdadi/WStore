#!/bin/bash

# Script pour initialiser Git sur le VPS
echo "=== Initialisation Git sur VPS ==="

cd /home/ubuntu/wstore

# Vérifier si c'est déjà un repo git
if [ -d ".git" ]; then
    echo "Git déjà initialisé"
else
    echo "Initialisation de Git..."
    git init
    git remote add origin https://github.com/Douabaghdadi/WStore.git
fi

# Configurer Git
git config --global user.email "douabaghdadi89@gmail.com"
git config --global user.name "Douabaghdadi"

# Fetch et reset
echo "Récupération du code..."
git fetch origin
git reset --hard origin/main

echo "✅ Git initialisé et code synchronisé"
