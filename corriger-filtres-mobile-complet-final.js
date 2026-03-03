const fs = require('fs');
const path = require('path');

console.log('🔧 Correction complète des filtres mobile dans toute l\'application...\n');

const files = [
  'frontend/app/(public)/shop/page.tsx',
  'frontend/app/(public)/category/[id]/page.tsx',
  'frontend/app/(public)/subcategory/[id]/page.tsx',
  'frontend/app/(public)/promotions/page.tsx'
];

// Styles CSS optimisés pour les filtres mobile
const mobileFilterStyles = `
        @media (max-width: 991px) {
          .filters-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: \${showMobileFilters ? '0' : '-100%'} !important;
            width: 85% !important;
            max-width: 320px !important;
            height: 100vh !important;
            z-index: 10002 !important;
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
            z-index: 10001 !important;
            opacity: \${showMobileFilters ? '1' : '0'} !important;
            visibility: \${showMobileFilters ? 'visible' : 'hidden'} !important;
            pointer-events: \${showMobileFilters ? 'auto' : 'none'} !important;
            transition: opacity 0.3s ease, visibility 0.3s ease !important;
          }
          .mobile-filter-btn {
            display: flex !important;
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

  console.log(`\n📄 Traitement: ${file}`);

  // 1. Remplacer les styles existants par les styles optimisés
  const styleRegex = /<style jsx>\{`[\s\S]*?`\}<\/style>/;
  if (styleRegex.test(content)) {
    content = content.replace(styleRegex, `<style jsx>{\`${mobileFilterStyles}\`}</style>`);
    modified = true;
    console.log('  ✅ Styles CSS des filtres mobile mis à jour');
  }

  // 2. S'assurer que l'overlay est présent et correctement positionné
  if (!content.includes('filters-overlay')) {
    // Trouver où insérer l'overlay (après le style jsx et avant le contenu principal)
    const insertPosition = content.indexOf('<div style={{ marginTop:');
    if (insertPosition !== -1) {
      const overlayCode = `
      {/* Overlay pour mobile */}
      <div 
        className="filters-overlay" 
        onClick={() => setShowMobileFilters(false)}
      ></div>

      `;
      content = content.slice(0, insertPosition) + overlayCode + content.slice(insertPosition);
      modified = true;
      console.log('  ✅ Overlay mobile ajouté');
    }
  }

  // 3. Vérifier et corriger le bouton de fermeture dans la sidebar
  const closeButtonPattern = /<div className="d-lg-none d-flex justify-content-between align-items-center mb-3">[\s\S]*?<\/div>/;
  const correctCloseButton = `<div className="d-lg-none d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', margin: 0 }}>
                  <i className="fas fa-filter" style={{ color: '#c53030' }}></i> Filtres
                </h5>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '0',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>`;

  if (closeButtonPattern.test(content)) {
    content = content.replace(closeButtonPattern, correctCloseButton);
    modified = true;
    console.log('  ✅ Bouton de fermeture corrigé');
  }

  // 4. Corriger le bouton "Filtres et Tri" mobile
  const mobileFilterBtnPattern = /<button\s+className="mobile-filter-btn mb-3"[\s\S]*?<\/button>/;
  const correctMobileFilterBtn = `<button 
              className="mobile-filter-btn mb-3"
              onClick={() => setShowMobileFilters(true)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(197, 48, 48, 0.3)'
              }}
            >
              <i className="fas fa-filter"></i> Filtres et Tri
            </button>`;

  if (mobileFilterBtnPattern.test(content)) {
    content = content.replace(mobileFilterBtnPattern, correctMobileFilterBtn);
    modified = true;
    console.log('  ✅ Bouton "Filtres et Tri" corrigé');
  }

  // 5. Ajouter la fermeture automatique après sélection d'un filtre
  const selectPatterns = [
    { 
      old: /onChange=\{\(e\) => setSelectedCategory\(e\.target\.value\)\}/g,
      new: `onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    if (window.innerWidth < 992) {
                      setTimeout(() => setShowMobileFilters(false), 300);
                    }
                  }}`
    },
    { 
      old: /onChange=\{\(e\) => setSelectedBrand\(e\.target\.value\)\}/g,
      new: `onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    if (window.innerWidth < 992) {
                      setTimeout(() => setShowMobileFilters(false), 300);
                    }
                  }}`
    },
    { 
      old: /onChange=\{\(e\) => setSelectedSubcategory\(e\.target\.value\)\}/g,
      new: `onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    if (window.innerWidth < 992) {
                      setTimeout(() => setShowMobileFilters(false), 300);
                    }
                  }}`
    },
    { 
      old: /onChange=\{\(e\) => setSortBy\(e\.target\.value\)\}/g,
      new: `onChange={(e) => {
                    setSortBy(e.target.value);
                    if (window.innerWidth < 992) {
                      setTimeout(() => setShowMobileFilters(false), 300);
                    }
                  }}`
    }
  ];

  selectPatterns.forEach(pattern => {
    if (pattern.old.test(content)) {
      content = content.replace(pattern.old, pattern.new);
      modified = true;
    }
  });

  if (modified) {
    console.log('  ✅ Fermeture automatique après sélection ajoutée');
  }

  // 6. Corriger le bouton Réinitialiser pour fermer le drawer
  const resetButtonPattern = /<button\s+(?:onClick=\{\(\) => \{[\s\S]*?resetFilters\(\);[\s\S]*?\}\}|onClick=\{resetFilters\}|className="reset-filters-btn"[\s\S]*?onClick=\{[\s\S]*?\})[\s\S]*?Réinitialiser[\s\S]*?<\/button>/;
  
  if (resetButtonPattern.test(content)) {
    content = content.replace(
      resetButtonPattern,
      `<button onClick={() => {
                resetFilters();
                setShowMobileFilters(false);
              }} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <i className="fas fa-redo"></i> Réinitialiser
              </button>`
    );
    modified = true;
    console.log('  ✅ Bouton Réinitialiser corrigé');
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Fichier sauvegardé avec succès`);
  } else {
    console.log(`  ℹ️  Aucune modification nécessaire`);
  }
});

console.log('\n✅ Correction des filtres mobile terminée!\n');
console.log('📋 Résumé des améliorations:');
console.log('  • Z-index optimisé (overlay: 10001, sidebar: 10002)');
console.log('  • Largeur sidebar: 85% (max 320px)');
console.log('  • Transitions fluides (0.3s)');
console.log('  • Fermeture automatique après sélection');
console.log('  • Bouton de fermeture visible et accessible');
console.log('  • Overlay cliquable pour fermer');
console.log('  • Styles cohérents sur toutes les pages\n');
