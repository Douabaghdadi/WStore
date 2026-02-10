# Script de démarrage rapide pour configurer et déployer
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║         🚀 CONFIGURATION ET DEPLOIEMENT WSTORE 🚀         ║" -ForegroundColor White
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Ce script va:" -ForegroundColor Yellow
Write-Host "  1. Configurer l'authentification SSH" -ForegroundColor White
Write-Host "  2. Vous guider pour ajouter la cle dans GitHub" -ForegroundColor White
Write-Host "  3. Declencher le deploiement automatique" -ForegroundColor White
Write-Host ""

Write-Host "Appuyez sur Entree pour commencer..." -ForegroundColor Cyan
Read-Host

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "ETAPE 1/3: Configuration SSH" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Exécuter la configuration SSH
.\fix-ssh-vps-complete.ps1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERREUR] La configuration SSH a echoue" -ForegroundColor Red
    Write-Host "Verifiez les erreurs ci-dessus et reessayez" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "ETAPE 2/3: Configuration GitHub Secrets" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Avez-vous ajoute la cle privee dans GitHub Secrets?" -ForegroundColor Yellow
Write-Host ""
Write-Host "Si NON:" -ForegroundColor Red
Write-Host "  1. Allez sur: https://github.com/Douabaghdadi/WStore/settings/secrets/actions" -ForegroundColor White
Write-Host "  2. Creez un secret nomme: VPS_SSH_KEY" -ForegroundColor White
Write-Host "  3. Collez la cle privee affichee ci-dessus" -ForegroundColor White
Write-Host ""
Write-Host "Si OUI, appuyez sur Entree pour continuer..." -ForegroundColor Green
Read-Host

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "ETAPE 3/3: Declenchement du Deploiement" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Voulez-vous declencher le deploiement maintenant? (O/N)" -ForegroundColor Yellow
$deploy = Read-Host

if ($deploy -eq "O" -or $deploy -eq "o") {
    Write-Host ""
    Write-Host "Creation d'un commit de deploiement..." -ForegroundColor Cyan
    
    git add .
    git commit -m "deploy: configuration SSH et deploiement automatique"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Commit cree" -ForegroundColor Green
    } else {
        Write-Host "[INFO] Aucun changement a commiter, creation d'un commit vide..." -ForegroundColor Yellow
        git commit --allow-empty -m "deploy: test deploiement automatique"
    }
    
    Write-Host ""
    Write-Host "Push vers GitHub..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║                                                            ║" -ForegroundColor Green
        Write-Host "║                  ✅ DEPLOIEMENT LANCE! ✅                  ║" -ForegroundColor White
        Write-Host "║                                                            ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "Surveillez le deploiement sur:" -ForegroundColor Yellow
        Write-Host "https://github.com/Douabaghdadi/WStore/actions" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Le deploiement prend environ 5-10 minutes" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Une fois termine, votre site sera accessible sur:" -ForegroundColor Yellow
        Write-Host "  Frontend: http://51.254.135.247:3000" -ForegroundColor Cyan
        Write-Host "  Backend:  http://51.254.135.247:5000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Pour verifier le deploiement:" -ForegroundColor Yellow
        Write-Host "  .\verifier-deploiement-final.ps1" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "[ERREUR] Echec du push vers GitHub" -ForegroundColor Red
        Write-Host "Verifiez votre connexion et reessayez" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Deploiement annule" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour deployer plus tard:" -ForegroundColor Cyan
    Write-Host "  git commit --allow-empty -m `"deploy: mise a jour`"" -ForegroundColor Gray
    Write-Host "  git push origin main" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ou pour deployer manuellement:" -ForegroundColor Cyan
    Write-Host "  .\deployer-maintenant-manuel.ps1" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "SCRIPTS DISPONIBLES" -ForegroundColor White
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  .\fix-ssh-vps-complete.ps1          - Configurer SSH" -ForegroundColor Gray
Write-Host ""
Write-Host "Deploiement:" -ForegroundColor Yellow
Write-Host "  .\deployer-maintenant-manuel.ps1    - Deploiement manuel" -ForegroundColor Gray
Write-Host "  git push origin main                - Deploiement automatique" -ForegroundColor Gray
Write-Host ""
Write-Host "Verification:" -ForegroundColor Yellow
Write-Host "  .\verifier-deploiement-final.ps1    - Verifier le deploiement" -ForegroundColor Gray
Write-Host "  .\tester-ssh-vps.ps1                - Tester la connexion SSH" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  SOLUTION-DEPLOIEMENT-COMPLETE.md    - Guide complet" -ForegroundColor Gray
Write-Host ""

