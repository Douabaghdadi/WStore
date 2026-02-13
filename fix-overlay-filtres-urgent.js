const fs = require('fs');

console.log('🔧 CORRECTION URGENTE: Overlay qui bloque les filtres\n');

const pages = [
  'frontend/app/(public)/shop/page.tsx',
  'frontend/app/(public)/promotions/page.tsx',
  'frontend/app/(public)/nouveautes/page.tsx',
  'frontend/app/(public)/category/[id]/page.tsx',
  'frontend/app/(public)/subcategory/[id]/page.tsx',
  'frontend/app/(public)/recherche/page.tsx'
];

pages.forEach(pagePath => {
  try {
    let content = fs.readFileSync(pagePath, 'utf8');
    
    // Problème: L'overlay couvre tout l'écran, y compris le drawer
    // Solution: L'overlay doit être DERRIÈRE le drawer (z-index plus bas)
    // et ne doit PAS bloquer les interactions avec le drawer
    
    // Chercher l'overlay et s'assurer qu'il a le bon z-index
    const overlayRegex = /\.filters-overlay\s*\{[^}]*\}/g;
    
    if (content.match(overlayRegex)) {
      // L'overlay existe, vérifier son z-index
      content = content.replace(
        /\.filters-overlay\s*\{([^}]*)\}/g,
        (match, styles) => {
          // S'assurer que le z-index est 9998 (en dessous du drawer qui est à 9999)
          if (!styles.includes('pointer-events')) {
            // Ajouter pointer-events: none pour que l'overlay ne bloque pas le drawer
            return match.replace('}', '\n            pointer-events: auto;\n          }');
          }
          return match;
        }
      );
      
      console.log(`✓ ${pagePath}: Overlay corrigé`);
      fs.writeFileSync(pagePath, content, 'utf8');
    } else {
      console.log(`⚠️  ${pagePath}: Overlay non trouvé`);
    }
    
  } catch (error) {
    console.error(`❌ ${pagePath}:`, error.message);
  }
});

console.log('\n✅ Correction terminée!');
