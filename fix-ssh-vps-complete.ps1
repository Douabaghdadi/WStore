# Script complet pour corriger l'authentification SSH sur le VPS
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CORRECTION SSH VPS - SOLUTION COMPLETE" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$VPS_HOST = "51.254.135.247"
$VPS_USER = "ubuntu"
$SSH_KEY_PATH = "$env:USERPROFILE\.ssh\wstore_deploy"

# Étape 1: Vérifier si la clé existe
Write-Host "Etape 1: Verification de la cle SSH locale..." -ForegroundColor Yellow
if (Test-Path $SSH_KEY_PATH) {
    Write-Host "[OK] Cle SSH trouvee: $SSH_KEY_PATH" -ForegroundColor Green
} else {
    Write-Host "[INFO] Cle SSH non trouvee, generation en cours..." -ForegroundColor Yellow
    Write-Host ""
    
    # Créer le répertoire .ssh s'il n'existe pas
    $sshDir = "$env:USERPROFILE\.ssh"
    if (-not (Test-Path $sshDir)) {
        New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
    }
    
    # Générer la clé SSH
    Write-Host "Generation de la cle SSH RSA 4096 bits..." -ForegroundColor Cyan
    ssh-keygen -t rsa -b 4096 -C "github-actions-wstore" -f $SSH_KEY_PATH -N '""'
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Cle SSH generee avec succes" -ForegroundColor Green
    } else {
        Write-Host "[ERREUR] Echec de la generation de la cle" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# Étape 2: Afficher la clé publique
Write-Host "Etape 2: Cle publique a copier sur le VPS:" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Gray
$publicKey = Get-Content "${SSH_KEY_PATH}.pub"
Write-Host $publicKey -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Étape 3: Instructions pour configurer le VPS
Write-Host "Etape 3: Configuration sur le VPS" -ForegroundColor Yellow
Write-Host ""
Write-Host "METHODE 1 - Automatique (recommandee):" -ForegroundColor Cyan
Write-Host "Executez cette commande (vous devrez entrer le mot de passe du VPS):" -ForegroundColor White
Write-Host ""
Write-Host "ssh ${VPS_USER}@${VPS_HOST} `"mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$publicKey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo 'Cle SSH ajoutee avec succes!'`"" -ForegroundColor Yellow
Write-Host ""
Write-Host "OU" -ForegroundColor White
Write-Host ""
Write-Host "METHODE 2 - Manuelle:" -ForegroundColor Cyan
Write-Host "1. Connectez-vous au VPS: ssh ${VPS_USER}@${VPS_HOST}" -ForegroundColor White
Write-Host "2. Executez ces commandes:" -ForegroundColor White
Write-Host "   mkdir -p ~/.ssh" -ForegroundColor Gray
Write-Host "   chmod 700 ~/.ssh" -ForegroundColor Gray
Write-Host "   nano ~/.ssh/authorized_keys" -ForegroundColor Gray
Write-Host "3. Collez la cle publique ci-dessus" -ForegroundColor White
Write-Host "4. Sauvegardez (Ctrl+O, Enter, Ctrl+X)" -ForegroundColor White
Write-Host "5. Executez: chmod 600 ~/.ssh/authorized_keys" -ForegroundColor Gray
Write-Host ""

# Proposer d'exécuter automatiquement
Write-Host "Voulez-vous executer la configuration automatique maintenant? (O/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "O" -or $response -eq "o") {
    Write-Host ""
    Write-Host "Configuration automatique en cours..." -ForegroundColor Cyan
    Write-Host "Vous devrez entrer le mot de passe du VPS" -ForegroundColor Yellow
    Write-Host ""
    
    ssh ${VPS_USER}@${VPS_HOST} "mkdir -p ~/.ssh && chmod 700 ~/.ssh && echo '$publicKey' >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo 'Cle SSH ajoutee avec succes!'"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "[OK] Configuration reussie!" -ForegroundColor Green
        
        # Étape 4: Tester la connexion
        Write-Host ""
        Write-Host "Etape 4: Test de connexion SSH sans mot de passe..." -ForegroundColor Yellow
        
        $testResult = ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no -o BatchMode=yes ${VPS_USER}@${VPS_HOST} "echo 'SSH OK'" 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Connexion SSH sans mot de passe fonctionne!" -ForegroundColor Green
            Write-Host "Reponse: $testResult" -ForegroundColor Gray
            Write-Host ""
            
            # Étape 5: Afficher la clé privée pour GitHub
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "CONFIGURATION GITHUB SECRETS" -ForegroundColor White
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Etape 5: Ajoutez la cle privee dans GitHub Secrets" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "1. Allez sur:" -ForegroundColor Cyan
            Write-Host "   https://github.com/Douabaghdadi/WStore/settings/secrets/actions" -ForegroundColor Gray
            Write-Host ""
            Write-Host "2. Cliquez sur 'New repository secret'" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "3. Nom du secret: VPS_SSH_KEY" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "4. Valeur (copiez TOUT le contenu ci-dessous):" -ForegroundColor Cyan
            Write-Host "----------------------------------------" -ForegroundColor Gray
            Get-Content $SSH_KEY_PATH
            Write-Host "----------------------------------------" -ForegroundColor Gray
            Write-Host ""
            Write-Host "5. Cliquez sur 'Add secret'" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "PROCHAINE ETAPE" -ForegroundColor White
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Une fois le secret ajoute, testez le deploiement:" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "git commit --allow-empty -m `"test: deploiement SSH configure`"" -ForegroundColor Cyan
            Write-Host "git push origin main" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Surveillez le deploiement sur:" -ForegroundColor Yellow
            Write-Host "https://github.com/Douabaghdadi/WStore/actions" -ForegroundColor Gray
            Write-Host ""
            
        } else {
            Write-Host "[ERREUR] La connexion SSH ne fonctionne toujours pas" -ForegroundColor Red
            Write-Host "Erreur: $testResult" -ForegroundColor Red
            Write-Host ""
            Write-Host "SOLUTIONS:" -ForegroundColor Yellow
            Write-Host "1. Verifiez que la cle a bien ete ajoutee sur le VPS:" -ForegroundColor White
            Write-Host "   ssh ${VPS_USER}@${VPS_HOST} `"cat ~/.ssh/authorized_keys`"" -ForegroundColor Gray
            Write-Host ""
            Write-Host "2. Verifiez les permissions:" -ForegroundColor White
            Write-Host "   ssh ${VPS_USER}@${VPS_HOST} `"ls -la ~/.ssh`"" -ForegroundColor Gray
            Write-Host ""
            Write-Host "3. Verifiez la configuration SSH du serveur:" -ForegroundColor White
            Write-Host "   ssh ${VPS_USER}@${VPS_HOST} `"sudo grep PubkeyAuthentication /etc/ssh/sshd_config`"" -ForegroundColor Gray
        }
        
    } else {
        Write-Host ""
        Write-Host "[ERREUR] Echec de la configuration" -ForegroundColor Red
        Write-Host "Utilisez la METHODE 2 (manuelle) ci-dessus" -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Configuration manuelle requise. Suivez les instructions ci-dessus." -ForegroundColor Yellow
}

Write-Host ""
