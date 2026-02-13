const fs = require('fs');
const path = require('path');

// Pages à corriger
const pages = [
  'frontend/app/(public)/shop/page.tsx',
  'frontend/app/(public)/promotions/page.tsx',
  'frontend/app/(public)/nouveautes/page.tsx',
  'frontend/app/(public)/category/[id]/page.tsx',
  'frontend/app/(public)/subcategory/[id]/page.tsx',
  'frontend/app/(public)/recherche/page.tsx'
];

console.log('🔧 Correction des filtres mobile sur toutes les pages...\n');

pages.forEach(pagePath => {
  try {
    let content = fs.readFileSync(pagePath, 'utf8');
    let modified = false;

    // 1. S'assurer que le bouton X est toujours visible (pas de display: none)
    if (content.includes('display: \'none\'') && content.includes('fas fa-times')) {
      content = content.replace(
        /display:\s*['"]none['"]/g,
        'display: \'flex\''
      );
      modified = true;
      console.log(`✓ ${pagePath}: Bouton X rendu visible`);
    }

    // 2. Vérifier que le z-index du drawer est correct
    if (!content.includes('z-index: 9999')) {
      content = content.replace(
        /z-index:\s*\d+\s*!important/g,
        'z-index: 9999 !important'
      );
      modified = true;
      console.log(`✓ ${pagePath}: Z-index corrigé`);
    }

    // 3. S'assurer que l'overlay est cliquable
    if (!content.includes('filters-overlay') || !content.includes('onClick={() => setShow')) {
      console.log(`⚠️  ${pagePath}: Vérifier l'overlay manuellement`);
    }

    // 4. Vérifier que le bouton "Réinitialiser" ferme le drawer
    if (content.includes('onClick={() => {') && content.includes('resetFilters')) {
      if (!content.includes('setShowMobileFilters(false)') && !content.includes('setShowFilters(false)')) {
        // Ajouter la fermeture du drawer dans le bouton réinitialiser
        content = content.replace(
          /onClick=\{[^}]*resetFilters\(\);?\s*\}\}/g,
          (match) => {
            if (content.includes('showMobileFilters')) {
              return match.replace('resetFilters();', 'resetFilters();\n                setShowMobileFilters(false);');
            } else if (content.includes('showFilters')) {
              return match.replace('resetFilters();', 'resetFilters();\n                setShowFilters(false);');
            }
            return match;
          }
        );
        modified = true;
        console.log(`✓ ${pagePath}: Fermeture du drawer ajoutée au bouton réinitialiser`);
      }
    }

    if (modified) {
      fs.writeFileSync(pagePath, content, 'utf8');
      console.log(`✅ ${pagePath}: Corrections appliquées\n`);
    } else {
      console.log(`ℹ️  ${pagePath}: Aucune correction nécessaire\n`);
    }

  } catch (error) {
    console.error(`❌ Erreur sur ${pagePath}:`, error.message);
  }
});

console.log('\n✅ Correction des filtres mobile terminée!');
console.log('\n📋 Prochaines étapes:');
console.log('1. Vérifier les changements avec: git diff');
console.log('2. Tester localement si possible');
console.log('3. Commit et push: git add . && git commit -m "Fix: Correction filtres mobile" && git push');
console.log('4. Déployer sur le VPS');
