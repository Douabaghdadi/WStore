#!/bin/bash
# Script pour créer l'utilisateur ubuntu et migrer depuis root

set -e

echo "========================================="
echo "  CRÉATION UTILISATEUR UBUNTU SUR VPS"
echo "========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Étape 1: Création de l'utilisateur ubuntu${NC}"
# Créer l'utilisateur ubuntu s'il n'existe pas
if id "ubuntu" &>/dev/null; then
    echo -e "${GREEN}L'utilisateur ubuntu existe déjà${NC}"
else
    useradd -m -s /bin/bash ubuntu
    echo -e "${GREEN}Utilisateur ubuntu créé${NC}"
fi

echo -e "${YELLOW}Étape 2: Configuration du mot de passe${NC}"
# Définir un mot de passe (vous pouvez le changer)
echo "ubuntu:UbuntuW-Store2024!" | chpasswd
echo -e "${GREEN}Mot de passe défini${NC}"

echo -e "${YELLOW}Étape 3: Ajout aux groupes sudo et docker${NC}"
# Ajouter ubuntu au groupe sudo
usermod -aG sudo ubuntu
# Ajouter ubuntu au groupe docker
usermod -aG docker ubuntu
echo -e "${GREEN}Utilisateur ajouté aux groupes sudo et docker${NC}"

echo -e "${YELLOW}Étape 4: Configuration sudo sans mot de passe${NC}"
# Permettre à ubuntu d'utiliser sudo sans mot de passe
echo "ubuntu ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/ubuntu
chmod 0440 /etc/sudoers.d/ubuntu
echo -e "${GREEN}Sudo sans mot de passe configuré${NC}"

echo -e "${YELLOW}Étape 5: Copie des clés SSH${NC}"
# Copier les clés SSH de root vers ubuntu
if [ -d /root/.ssh ]; then
    mkdir -p /home/ubuntu/.ssh
    cp /root/.ssh/authorized_keys /home/ubuntu/.ssh/ 2>/dev/null || true
    chown -R ubuntu:ubuntu /home/ubuntu/.ssh
    chmod 700 /home/ubuntu/.ssh
    chmod 600 /home/ubuntu/.ssh/authorized_keys 2>/dev/null || true
    echo -e "${GREEN}Clés SSH copiées${NC}"
else
    echo -e "${YELLOW}Aucune clé SSH à copier${NC}"
fi

echo -e "${YELLOW}Étape 6: Migration du projet w-store${NC}"
# Copier le projet de /root/w-store vers /home/ubuntu/w-store
if [ -d /root/w-store ]; then
    echo -e "${YELLOW}Copie de /root/w-store vers /home/ubuntu/w-store...${NC}"
    cp -r /root/w-store /home/ubuntu/
    chown -R ubuntu:ubuntu /home/ubuntu/w-store
    echo -e "${GREEN}Projet copié et permissions définies${NC}"
else
    echo -e "${YELLOW}Aucun projet à migrer depuis /root/w-store${NC}"
    # Créer le répertoire pour le futur
    mkdir -p /home/ubuntu/w-store
    chown ubuntu:ubuntu /home/ubuntu/w-store
fi

echo -e "${YELLOW}Étape 7: Configuration du shell${NC}"
# Copier la configuration bash
cp /root/.bashrc /home/ubuntu/.bashrc 2>/dev/null || true
chown ubuntu:ubuntu /home/ubuntu/.bashrc

echo -e "${YELLOW}Étape 8: Test de connexion${NC}"
# Tester que l'utilisateur peut exécuter des commandes
su - ubuntu -c "whoami"
su - ubuntu -c "docker --version" 2>/dev/null || echo -e "${YELLOW}Docker non installé ou non accessible${NC}"

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  UTILISATEUR UBUNTU CRÉÉ AVEC SUCCÈS!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}Informations de connexion:${NC}"
echo "  Utilisateur: ubuntu"
echo "  Mot de passe: UbuntuW-Store2024!"
echo "  Répertoire: /home/ubuntu"
echo "  Projet: /home/ubuntu/w-store"
echo ""
echo -e "${YELLOW}Pour vous connecter:${NC}"
echo "  ssh ubuntu@51.254.135.247"
echo ""
echo -e "${YELLOW}Permissions:${NC}"
echo "  ✓ Sudo sans mot de passe"
echo "  ✓ Accès Docker"
echo "  ✓ Clés SSH copiées"
echo "  ✓ Projet w-store migré"
echo ""
echo -e "${RED}IMPORTANT:${NC}"
echo "  1. Testez la connexion SSH avec ubuntu AVANT de désactiver root"
echo "  2. Gardez une session root ouverte pendant les tests"
echo "  3. Changez le mot de passe après la première connexion"
echo ""
