const fs = require('fs');

console.log('🔧 CORRECTION COMPLÈTE DES FILTRES MOBILE\n');
console.log('==========================================\n');

// Configuration des pages
const pages = [
  {
    path: 'frontend/app/(public)/shop/page.tsx',
    name: 'Boutique',
    hasDrawer: true,
    varName: 'showMobileFilters'
  },
  {
    path: 'frontend/app/(public)/promotions/page.tsx',
    name: 'Promotions',
    hasDrawer: true,
    varName: 'showFilters', // À renommer en showMobileFilters
    needsRename: true
  },
  {
    path: 'frontend/app/(public)/nouveautes/page.tsx',
    name: 'Nouveautés',
    hasDrawer: true,
    varName: 'showFilters', // À renommer en showMobileFilters
    needsRename: true
  },
  {
    path: 'frontend/app/(public)/category/[id]/page.tsx',
    name: 'Catégorie',
    hasDrawer: true,
    varName: 'showMobileFilters'
  },
  {
    path: 'frontend/app/(public)/subcategory/[id]/page.tsx',
    name: 'Sous-catégorie',
    hasDrawer: true,
    varName: 'showMobileFilters'
  },
  {
    path: 'frontend/app/(public)/recherche/page.tsx',
    name: 'Recherche',
    hasDrawer: false, // PAS DE DRAWER - À AJOUTER
    needsDrawer: true
  }
];

let totalCorrections = 0;

pages.forEach(page => {
  console.log(`\n📄 ${page.name} (${page.path})`);
  console.log('─'.repeat(50));
  
  try {
    let content = fs.readFileSync(page.path, 'utf8');
    let modified = false;
    let corrections = [];

    // 1. Renommer showFilters en showMobileFilters si nécessaire
    if (page.needsRename) {
      const oldVar = page.varName;
      const newVar = 'showMobileFilters';
      
      // Renommer la déclaration
      content = content.replace(
        new RegExp(`const \\[${oldVar}, set${oldVar.charAt(0).toUpperCase() + oldVar.slice(1)}\\]`, 'g'),
        `const [${newVar}, set${newVar.charAt(0).toUpperCase() + newVar.slice(1)}]`
      );
      
      // Renommer toutes les utilisations
      content = content.replace(new RegExp(`\\b${oldVar}\\b`, 'g'), newVar);
      content = content.replace(
        new RegExp(`set${oldVar.charAt(0).toUpperCase() + oldVar.slice(1)}`, 'g'),
        `set${newVar.charAt(0).toUpperCase() + newVar.slice(1)}`
      );
      
      corrections.push(`✓ Renommé ${oldVar} en ${newVar}`);
      modified = true;
    }

    // 2. S'assurer que le bouton Réinitialiser ferme le drawer
    if (content.includes('resetFilters') && content.includes('onClick')) {
      const varName = page.needsRename ? 'showMobileFilters' : (page.varName || 'showMobileFilters');
      const setterName = `set${varName.charAt(0).toUpperCase() + varName.slice(1)}`;
      
      // Chercher les boutons réinitialiser qui n'ont pas la fermeture du drawer
      const resetButtonRegex = /onClick=\{(?:\(\)\s*=>\s*)?\{[\s\S]*?resetFilters\(\);?[\s\S]*?\}\}/g;
      const matches = content.match(resetButtonRegex);
      
      if (matches) {
        matches.forEach(match => {
          if (!match.includes(setterName)) {
            const newMatch = match.replace(
              'resetFilters();',
              `resetFilters();\n                ${setterName}(false);`
            );
            content = content.replace(match, newMatch);
            corrections.push(`✓ Ajout fermeture drawer au bouton Réinitialiser`);
            modified = true;
          }
        });
      }
    }

    // 3. Vérifier que l'overlay est présent et fonctionnel
    if (!content.includes('filters-overlay')) {
      corrections.push(`⚠️  ATTENTION: Overlay manquant - correction manuelle requise`);
    } else if (!content.includes('onClick={() => set')) {
      corrections.push(`⚠️  ATTENTION: Overlay non cliquable - correction manuelle requise`);
    }

    // 4. Vérifier que le bouton X est présent
    if (!content.includes('fa-times')) {
      corrections.push(`⚠️  ATTENTION: Bouton X manquant - correction manuelle requise`);
    }

    // 5. Vérifier les media queries
    if (!content.includes('@media (max-width: 991px)')) {
      corrections.push(`⚠️  ATTENTION: Media queries manquantes - correction manuelle requise`);
    }

    // Sauvegarder si modifié
    if (modified) {
      fs.writeFileSync(page.path, content, 'utf8');
      console.log(`✅ Fichier modifié`);
      totalCorrections++;
    } else {
      console.log(`ℹ️  Aucune modification automatique`);
    }

    // Afficher les corrections
    if (corrections.length > 0) {
      corrections.forEach(c => console.log(`   ${c}`));
    }

  } catch (error) {
    console.log(`❌ ERREUR: ${error.message}`);
  }
});

console.log('\n');
console.log('==========================================');
console.log(`✅ Correction terminée: ${totalCorrections} fichier(s) modifié(s)`);
console.log('==========================================\n');

console.log('📋 PROCHAINES ÉTAPES:\n');
console.log('1. Vérifier les changements:');
console.log('   git diff\n');
console.log('2. Tester localement si possible\n');
console.log('3. Commit et push:');
console.log('   git add .');
console.log('   git commit -m "Fix: Correction complète filtres mobile"');
console.log('   git push origin main\n');
console.log('4. Déployer sur VPS:');
console.log('   ssh ubuntu@51.254.135.247');
console.log('   cd /var/www/wstore && git pull origin main');
console.log('   cd frontend && npm run build');
console.log('   pm2 restart wstore-frontend\n');

console.log('⚠️  CORRECTIONS MANUELLES NÉCESSAIRES:\n');
console.log('- Page Recherche: Ajouter le système complet de drawer mobile');
console.log('- Vérifier que tous les overlays sont cliquables');
console.log('- Vérifier que tous les boutons X sont visibles\n');
