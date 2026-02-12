# 🛍️ WStore - E-commerce Platform

Application e-commerce moderne avec Next.js et Node.js.

## 🚀 Déploiement

### Déploiement automatique (recommandé)

```bash
git add .
git commit -m "feat: votre message"
git push origin main
```

Le déploiement se fait automatiquement via GitHub Actions.

### Documentation

- **[COMMENCER ICI](COMMENCER-ICI-NOUVELLE-INFRA.md)** - Guide de démarrage
- **[Infrastructure](INFRASTRUCTURE-PROFESSIONNELLE.md)** - Architecture complète
- **[Migration](GUIDE-MIGRATION-INFRASTRUCTURE.md)** - Guide de migration

## 📋 Prérequis

- Node.js 20+
- MongoDB
- PM2 (production)

## 🛠️ Installation locale

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Configurez .env
npm run dev

# Frontend
cd frontend
npm install
cp .env.example .env.local
# Configurez .env.local
npm run dev
```

## 🔧 Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wstore
JWT_SECRET=votre_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📊 Monitoring

```bash
# Statut des services
ssh ubuntu@51.254.135.247
pm2 status

# Logs en temps réel
pm2 logs

# Dashboard de monitoring
bash /var/www/wstore/infrastructure/scripts/monitoring.sh
```

## 🔄 Rollback

En cas de problème après un déploiement :

```bash
ssh ubuntu@51.254.135.247
bash /var/www/wstore/infrastructure/scripts/rollback.sh
```

## 🏗️ Architecture

```
Frontend (Next.js) → Nginx → Backend (Node.js) → MongoDB
                              ↓
                            PM2 (Process Manager)
```

## 📝 Scripts disponibles

### Développement
```bash
npm run dev      # Démarrer en mode développement
npm run build    # Build pour production
npm run start    # Démarrer en production
npm run lint     # Linter le code
```

### Production (sur VPS)
```bash
pm2 status       # Voir le statut
pm2 logs         # Voir les logs
pm2 restart all  # Redémarrer tous les services
pm2 monit        # Monitoring interactif
```

## 🔐 Sécurité

- Secrets gérés via GitHub Secrets
- HTTPS avec Let's Encrypt (recommandé)
- Firewall UFW configuré
- Fail2ban actif
- Headers de sécurité HTTP

## 📈 Performance

- Compression Gzip activée
- Cache statique optimisé
- Keep-alive connections
- PM2 cluster mode disponible

## 🐛 Dépannage

### Application ne démarre pas
```bash
pm2 logs --err
pm2 restart all
```

### Problème de base de données
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
```

### Problème Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 📞 Support

- Logs : `pm2 logs`
- Monitoring : `bash infrastructure/scripts/monitoring.sh`
- Backups : `ls /var/backups/wstore/`

## 📄 Licence

MIT

## 👥 Contributeurs

Votre équipe
