#!/bin/bash

echo "=========================================="
echo "DIAGNOSTIC 502 BAD GATEWAY"
echo "=========================================="
echo ""

echo "1. Vérification des conteneurs Docker..."
docker ps -a

echo ""
echo "2. Vérification des logs du backend..."
docker logs wstore-backend --tail 50

echo ""
echo "3. Vérification des logs du frontend..."
docker logs wstore-frontend --tail 50

echo ""
echo "4. Vérification des logs nginx..."
docker logs wstore-nginx --tail 50

echo ""
echo "5. Test de connexion au backend depuis l'hôte..."
curl -I http://localhost:5000/api/products

echo ""
echo "6. Test de connexion au frontend depuis l'hôte..."
curl -I http://localhost:3000

echo ""
echo "7. Vérification des ports en écoute..."
netstat -tlnp | grep -E ':(80|443|3000|5000)'

echo ""
echo "8. Vérification du réseau Docker..."
docker network inspect wstore-network

echo ""
echo "=========================================="
echo "FIN DU DIAGNOSTIC"
echo "=========================================="
