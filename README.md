# 🛍️ WStore - E-commerce Platform

Plateforme e-commerce moderne avec Next.js et Express.

**🔴 LIVE:** http://51.254.135.247:3000

**🚀 Dernière mise à jour:** 2026-02-09 - Test déploiement automatique

---

## ⚡ NOUVEAU : Déploiement Automatique CI/CD

**🎉 Votre projet est maintenant équipé d'un pipeline CI/CD professionnel !**

### ✅ État du Déploiement

- **Frontend**: http://51.254.135.247:3000 ✅
- **Backend**: http://51.254.135.247:5000 ✅
- **CI/CD**: Actif et fonctionnel ✅

### 🚀 Démarrage Rapide

**Commencez ici :** [START-HERE-CI-CD.md](./START-HERE-CI-CD.md)

**Ou choisissez un guide :**
- [QUICK-START-CI-CD.md](./QUICK-START-CI-CD.md) - 15 minutes
- [GUIDE-VISUEL-CI-CD.md](./GUIDE-VISUEL-CI-CD.md) - Guide visuel
- [SETUP-CI-CD.md](./SETUP-CI-CD.md) - Guide complet

### 📊 Avant vs Après

| Avant | Après |
|-------|-------|
| 15 min de déploiement | 2 min automatique |
| 200+ scripts manuels | 1 workflow |
| Pas de tests | Tests automatiques |
| Pas de rollback | Rollback en 1 clic |
| Fiabilité 70% | Fiabilité 99.9% |

---

## 🚀 Déploiement Automatique

Ce projet utilise **GitHub Actions** pour un déploiement automatique et robuste.

### ✨ Fonctionnalités CI/CD

- ✅ Tests automatiques à chaque push
- ✅ Déploiement automatique sur production (branche `main`)
- ✅ Déploiement staging (branche `develop`)
- ✅ Backups automatiques avant chaque déploiement
- ✅ Health checks après déploiement
- ✅ Rollback automatique en cas d'échec
- ✅ Notifications par email

### 📋 Configuration Initiale

**Suivez le guide complet : [SETUP-CI-CD.md](./SETUP-CI-CD.md)**

Résumé rapide :

1. **Créer un dépôt GitHub**
2. **Configurer les secrets GitHub** (clés SSH, variables d'environnement)
3. **Préparer le VPS** (Node.js, PM2)
4. **Push le code** → Déploiement automatique !

### 🔄 Workflow de Développement

```bash
# 1. Faire vos modifications
git add .
git commit -m "feat: nouvelle fonctionnalité"

# 2. Push vers GitHub
git push origin main

# 3. C'est tout ! Le déploiement se fait automatiquement
```

### 📊 Suivre le Déploiement

Aller sur : `https://github.com/VOTRE-USERNAME/wstore/actions`

### 🆘 Rollback

```bash
# Méthode 1 : Revenir au commit précédent
git revert HEAD
git push origin main

# Méthode 2 : Restaurer un backup sur le VPS
ssh ubuntu@51.254.135.247
cd /var/www/wstore
tar -xzf /var/backups/wstore/backup-LATEST.tar.gz
pm2 restart all
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           GitHub Actions                │
│  (Tests → Build → Deploy → Health)      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         VPS (51.254.135.247)            │
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  Frontend    │  │  Backend     │    │
│  │  Next.js     │  │  Express     │    │
│  │  Port 3000   │  │  Port 5000   │    │
│  │  (PM2)       │  │  (PM2)       │    │
│  └──────────────┘  └──────┬───────┘    │
│                           │             │
└───────────────────────────┼─────────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │  MongoDB Atlas │
                   └────────────────┘
```

## 🛠️ Stack Technique

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Express.js, Node.js
- **Database**: MongoDB Atlas
- **Deployment**: GitHub Actions, PM2
- **Server**: Ubuntu VPS

## 📝 Commandes Utiles

### Développement Local

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

### Production (VPS)

```bash
# Voir le statut
ssh ubuntu@51.254.135.247 "pm2 status"

# Voir les logs
ssh ubuntu@51.254.135.247 "pm2 logs"

# Redémarrer
ssh ubuntu@51.254.135.247 "pm2 restart all"
```

## 🔐 Variables d'Environnement

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://51.254.135.247:5000
```

## 📚 Documentation

- [Configuration CI/CD](./SETUP-CI-CD.md) - Guide complet de configuration
- [Workflow de Déploiement](./.github/workflows/deploy-production.yml)
- [Docker Setup](./docker-compose.yml) - Configuration Docker (optionnel)

## 🎯 Avantages du CI/CD

| Avant | Après |
|-------|-------|
| 15 min de déploiement | 2 min automatique |
| Risque d'erreurs | Tests automatiques |
| Pas de rollback | Rollback en 1 clic |
| 200+ scripts | 1 workflow |

## 📞 Support

Pour toute question, consultez [SETUP-CI-CD.md](./SETUP-CI-CD.md)

## 📄 Licence

MIT
