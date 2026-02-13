const fs = require('fs');

console.log('🔧 CORRECTION: Overlay qui bloque le drawer\n');
console.log('Problème: L\'overlay transparent empêche d\'interagir avec les filtres');
console.log('Solution: Rendre l\'overlay conditionnel et avec style inline\n');

const pages = [
  { path: 'frontend/app/(public)/promotions/page.tsx', var: 'showMobileFilters' },
  { path: 'frontend/app/(public)/nouveautes/page.tsx', var: 'showMobileFilters' },
  { path: 'frontend/app/(public)/category/[id]/page.tsx', var: 'showMobileFilters' },
  { path: 'frontend/app/(public)/subcategory/[id]/page.tsx', var: 'showMobileFilters' },
  { path: 'frontend/app/(public)/recherche/page.tsx', var: 'showMobileFilters' }
];

pages.forEach(({ path: pagePath, var: varName }) => {
  try {
    let content = fs.readFileSync(pagePath, 'utf8');
    let modified = false;

    // 1. Supprimer l'overlay des media queries CSS
    const oldOverlayCss = /\.filters-overlay\s*\{[^}]*display:\s*\$\{[^}]*\}[^}]*\}/g;
    if (content.match(oldOverlayCss)) {
      content = content.replace(oldOverlayCss, '');
      modified = true;
      console.log(`✓ ${pagePath}: Overlay CSS supprimé des media queries`);
    }

    // 2. Remplacer l'ancien overlay par le nouveau (conditionnel avec style inline)
    const oldOverlayDiv = /<div className="filters-overlay" onClick=\{\(\) => set\w+\(false\)\}><\/div>/g;
    const newOverlayDiv = `{${varName} && (
        <div 
          className="filters-overlay" 
          onClick={() => set${varName.charAt(0).toUpperCase() + varName.slice(1)}(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9998
          }}
        ></div>
      )}`;

    if (content.match(oldOverlayDiv)) {
      content = content.replace(oldOverlayDiv, newOverlayDiv);
      modified = true;
      console.log(`✓ ${pagePath}: Overlay remplacé par version conditionnelle`);
    }

    // 3. S'assurer que le drawer a background: white dans les media queries
    const drawerCssRegex = /(\.filters-sidebar\s*\{[^}]*z-index:\s*9999[^}]*)(overflow-y:\s*auto[^}]*)\}/g;
    if (content.match(drawerCssRegex)) {
      content = content.replace(drawerCssRegex, '$1$2\n            background: white !important;\n          }');
      modified = true;
      console.log(`✓ ${pagePath}: Background white ajouté au drawer`);
    }

    if (modified) {
      fs.writeFileSync(pagePath, content, 'utf8');
      console.log(`✅ ${pagePath}: Corrections appliquées\n`);
    } else {
      console.log(`ℹ️  ${pagePath}: Aucune modification nécessaire\n`);
    }

  } catch (error) {
    console.error(`❌ ${pagePath}:`, error.message, '\n');
  }
});

console.log('═══════════════════════════════════════');
console.log('✅ Correction terminée!');
console.log('═══════════════════════════════════════\n');

console.log('📋 PROCHAINES ÉTAPES:\n');
console.log('1. Vérifier: git diff');
console.log('2. Commit: git add . && git commit -m "Fix: Overlay ne bloque plus le drawer"');
console.log('3. Push: git push origin main');
console.log('4. Déployer sur VPS\n');
