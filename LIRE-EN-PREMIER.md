# 🚀 Déploiement WStore - Commencez Ici

## 🎯 Problème Actuel

La version déployée sur votre VPS ne correspond pas à la version locale car **l'authentification SSH n'est pas configurée**.

## ✅ Solution Rapide (10 minutes)

### Option 1: Script Automatique (Recommandé)

Exécutez simplement ce script qui fait tout pour vous:

```powershell
.\COMMENCER-ICI-DEPLOIEMENT.ps1
```

Ce script va:
1. ✅ Configurer l'authentification SSH
2. ✅ Vous guider pour ajouter la clé dans GitHub
3. ✅ Déclencher le déploiement automatique

### Option 2: Étape par Étape

Si vous préférez faire étape par étape:

#### 1. Configurer SSH (5 min)
```powershell
.\fix-ssh-vps-complete.ps1
```

#### 2. Ajouter la clé dans GitHub (2 min)
- Allez sur: https://github.com/Douabaghdadi/WStore/settings/secrets/actions
- Créez un secret `VPS_SSH_KEY`
- Collez la clé privée affichée par le script

#### 3. Déployer (1 min)
```powershell
git commit --allow-empty -m "deploy: configuration SSH"
git push origin main
```

#### 4. Vérifier (1 min)
```powershell
.\verifier-deploiement-final.ps1
```

## 📊 Résultat Attendu

Après avoir suivi ces étapes:

✅ **SSH fonctionne sans mot de passe**
```powershell
ssh -i ~/.ssh/wstore_deploy ubuntu@51.254.135.247 "echo OK"
```

✅ **GitHub Actions déploie automatiquement**
- Chaque push vers `main` déclenche un déploiement
- Surveillez sur: https://github.com/Douabaghdadi/WStore/actions

✅ **Le site est accessible**
- Frontend: http://51.254.135.247:3000
- Backend: http://51.254.135.247:5000

✅ **Les versions correspondent**
```powershell
# Vérifier
.\verifier-deploiement-final.ps1
```

## 🔧 Déploiement Manuel (Alternative)

Si vous préférez déployer manuellement sans GitHub Actions:

```powershell
.\deployer-maintenant-manuel.ps1
```

## 📚 Documentation Complète

Pour plus de détails, consultez:
- **SOLUTION-DEPLOIEMENT-COMPLETE.md** - Guide complet avec troubleshooting
- **CONFIGURER-CLE-SSH.md** - Guide détaillé SSH

## ⚠️ Problèmes Courants

### "Permission denied (publickey)"
```powershell
# Re-configurer SSH
.\fix-ssh-vps-complete.ps1
```

### "Les versions ne correspondent pas"
```powershell
# Vérifier le déploiement
.\verifier-deploiement-final.ps1

# Déployer manuellement si nécessaire
.\deployer-maintenant-manuel.ps1
```

### "GitHub Actions échoue"
1. Vérifiez que le secret `VPS_SSH_KEY` existe
2. Vérifiez que la clé publique est sur le VPS
3. Testez localement: `ssh -i ~/.ssh/wstore_deploy ubuntu@51.254.135.247 "pm2 status"`

## 🎯 Checklist

- [ ] Exécuter `.\COMMENCER-ICI-DEPLOIEMENT.ps1`
- [ ] Ajouter la clé dans GitHub Secrets
- [ ] Push vers GitHub
- [ ] Vérifier le déploiement sur GitHub Actions
- [ ] Tester le site: http://51.254.135.247:3000
- [ ] Vérifier avec `.\verifier-deploiement-final.ps1`

---

## 🚀 Commencez Maintenant

```powershell
.\COMMENCER-ICI-DEPLOIEMENT.ps1
```

**Temps total: ~10 minutes**
