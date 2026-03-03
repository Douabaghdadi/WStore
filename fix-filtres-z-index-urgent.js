const fs = require('fs');
const path = require('path');

console.log('🚨 FIX URGENT: Correction z-index filtres mobile\n');

const files = [
  'frontend/app/(public)/shop/page.tsx',
  'frontend/app/(public)/category/[id]/page.tsx',
  'frontend/app/(public)/subcategory/[id]/page.tsx',
  'frontend/app/(public)/promotions/page.tsx'
];

// Styles CSS avec z-index TRÈS ÉLEVÉ
const fixedMobileFilterStyles = `
        @media (max-width: 991px) {
          .filters-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: \${showMobileFilters ? '0' : '-100%'} !important;
            width: 85% !important;
            max-width: 320px !important;
            height: 100vh !important;
            z-index: 99999 !important;
            transition: left 0.3s ease !important;
            overflow-y: auto !important;
            background: white !important;
            box-shadow: 2px 0 20px rgba(0,0,0,0.3) !important;
            padding: 20px !important;
          }
          .filters-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0,0,0,0.5) !important;
            z-index: 99998 !important;
            opacity: \${showMobileFilters ? '1' : '0'} !important;
            visibility: \${showMobileFilters ? 'visible' : 'hidden'} !important;
            pointer-events: \${showMobileFilters ? 'auto' : 'none'} !important;
            transition: opacity 0.3s ease, visibility 0.3s ease !important;
          }
          .mobile-filter-btn {
            display: flex !important;
          }
          
          /* Empêcher le scroll du body quand les filtres sont ouverts */
          body.filters-open {
            overflow: hidden !important;
          }
        }
        @media (min-width: 992px) {
          .mobile-filter-btn {
            display: none !important;
          }
          .filters-overlay {
            display: none !important;
          }
        }`;

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  console.log(`\n📄 ${file}`);

  // 1. Remplacer les styles
  const styleRegex = /<style jsx>\{`[\s\S]*?`\}<\/style>/;
  if (styleRegex.test(content)) {
    content = content.replace(styleRegex, `<style jsx>{\`${fixedMobileFilterStyles}\`}</style>`);
    modified = true;
    console.log('  ✅ Z-index augmenté à 99999');
  }

  // 2. Ajouter useEffect pour bloquer le scroll du body
  const useEffectPattern = /const \{ addToCart \} = useCart\(\);/;
  if (useEffectPattern.test(content) && !content.includes('useEffect(() => {')) {
    const useEffectCode = `
  const { addToCart } = useCart();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // Bloquer le scroll du body quand les filtres sont ouverts
  useEffect(() => {
    if (showMobileFilters) {
      document.body.classList.add('filters-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('filters-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('filters-open');
      document.body.style.overflow = '';
    };
  }, [showMobileFilters]);`;

    content = content.replace(
      /const \{ addToCart \} = useCart\(\);\s*const \{ favorites, addFavorite, removeFavorite \} = useFavorites\(\);/,
      useEffectCode
    );
    modified = true;
    console.log('  ✅ Blocage scroll body ajouté');
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✅ Fichier sauvegardé');
  } else {
    console.log('  ℹ️  Aucune modification');
  }
});

console.log('\n✅ FIX URGENT TERMINÉ!\n');
console.log('📋 Changements:');
console.log('  • Z-index sidebar: 99999 (au-dessus de tout)');
console.log('  • Z-index overlay: 99998');
console.log('  • Scroll body bloqué quand filtres ouverts');
console.log('  • Footer ne peut plus passer par-dessus\n');
