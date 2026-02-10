# Script pour vérifier que le déploiement est complet et fonctionnel
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICATION DEPLOIEMENT COMPLET" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$VPS_HOST = "51.254.135.247"
$VPS_USER = "ubuntu"
$SSH_KEY = "$env:USERPROFILE\.ssh\wstore_deploy"

# Test 1: Connexion SSH
Write-Host "Test 1: Connexion SSH..." -ForegroundColor Yellow
$sshTest = ssh -i $SSH_KEY -o ConnectTimeout=10 -o BatchMode=yes ${VPS_USER}@${VPS_HOST} "echo 'OK'" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Connexion SSH fonctionne" -ForegroundColor Green
} else {
    Write-Host "[ERREUR] Connexion SSH echouee" -ForegroundColor Red
    Write-Host "Executez d'abord: .\fix-ssh-vps-complete.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: Vérifier PM2
Write-Host "Test 2: Verification PM2..." -ForegroundColor Yellow
$pm2Status = ssh -i $SSH_KEY ${VPS_USER}@${VPS_HOST} "pm2 status" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] PM2 fonctionne" -ForegroundColor Green
    Write-Host $pm2Status -ForegroundColor Gray
} else {
    Write-Host "[ERREUR] PM2 ne fonctionne pas" -ForegroundColor Red
}

Write-Host ""

# Test 3: Vérifier les versions déployées
Write-Host "Test 3: Verification des versions..." -ForegroundColor Yellow

# Version locale
Write-Host "Version locale (dernier commit):" -ForegroundColor Cyan
$localCommit = git rev-parse --short HEAD
Write-Host "  Commit: $localCommit" -ForegroundColor Gray
$localDate = git log -1 --format=%cd --date=format:'%Y-%m-%d %H:%M:%S'
Write-Host "  Date: $localDate" -ForegroundColor Gray

Write-Host ""

# Version déployée
Write-Host "Version deployee sur le VPS:" -ForegroundColor Cyan
$remoteCommit = ssh -i $SSH_KEY ${VPS_USER}@${VPS_HOST} "cd /var/www/wstore && git rev-parse --short HEAD 2>/dev/null || echo 'N/A'"
Write-Host "  Commit: $remoteCommit" -ForegroundColor Gray

if ($localCommit -eq $remoteCommit.Trim()) {
    Write-Host "[OK] Les versions correspondent!" -ForegroundColor Green
} else {
    Write-Host "[ATTENTION] Les versions ne correspondent pas" -ForegroundColor Yellow
    Write-Host "Le deploiement n'a peut-etre pas ete effectue" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: Vérifier les services
Write-Host "Test 4: Verification des services..." -ForegroundColor Yellow

# Backend
Write-Host "Backend (port 5000):" -ForegroundColor Cyan
try {
    $backendTest = Invoke-WebRequest -Uri "http://${VPS_HOST}:5000/api/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "[OK] Backend accessible" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Backend non accessible" -ForegroundColor Red
}

Write-Host ""

# Frontend
Write-Host "Frontend (port 3000):" -ForegroundColor Cyan
try {
    $frontendTest = Invoke-WebRequest -Uri "http://${VPS_HOST}:3000" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "[OK] Frontend accessible" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Frontend non accessible" -ForegroundColor Red
}

Write-Host ""

# Test 5: Vérifier les logs
Write-Host "Test 5: Verification des logs recents..." -ForegroundColor Yellow
$logs = ssh -i $SSH_KEY ${VPS_USER}@${VPS_HOST} "pm2 logs --lines 5 --nostream" 2>&1
Write-Host $logs -ForegroundColor Gray

Write-Host ""

# Résumé
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUME" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($localCommit -eq $remoteCommit.Trim()) {
    Write-Host "[OK] Deploiement complet et a jour!" -ForegroundColor Green
    Write-Host ""
    Write-Host "URLs:" -ForegroundColor Yellow
    Write-Host "  Frontend: http://${VPS_HOST}:3000" -ForegroundColor Cyan
    Write-Host "  Backend: http://${VPS_HOST}:5000" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "[ATTENTION] Le deploiement n'est pas a jour" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour deployer manuellement:" -ForegroundColor Cyan
    Write-Host "  .\deployer-maintenant-manuel.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pour deployer via GitHub Actions:" -ForegroundColor Cyan
    Write-Host "  git commit --allow-empty -m `"deploy: mise a jour`"" -ForegroundColor Gray
    Write-Host "  git push origin main" -ForegroundColor Gray
    Write-Host ""
}

