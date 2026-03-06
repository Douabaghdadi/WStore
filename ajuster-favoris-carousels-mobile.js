const fs = require('fs');
const path = require('path');

console.log('🔧 Ajustement du bouton favoris dans les carousels pour mobile...\n');

// Fichier ProductCard.tsx
const productCardPath = path.join(__dirname, 'frontend/app/components/ProductCard.tsx');
let productCardContent = fs.readFileSync(productCardPath, 'utf8');

// Ajuster le positionnement du bouton favoris en mobile
// Remplacer right: '50px' par right: '12px' pour le décaler vers la gauche
productCardContent = productCardContent.replace(
  /right: '50px',/g,
  `right: '12px',`
);

fs.writeFileSync(productCardPath, productCardContent, 'utf8');
console.log('✅ ProductCard.tsx - Bouton favoris ajusté (right: 12px)');

// Ajouter des styles CSS spécifiques pour mobile dans globals.css
const globalsCssPath = path.join(__dirname, 'frontend/app/globals.css');
let globalsCssContent = fs.readFileSync(globalsCssPath, 'utf8');

// Vérifier si les styles existent déjà
if (!globalsCssContent.includes('/* Ajustement bouton favoris carousels mobile */')) {
  const mobileStyles = `

/* Ajustement bouton favoris carousels mobile */
@media (max-width: 768px) {
  .favorite-btn-mobile {
    right: 12px !important;
    top: 12px !important;
    width: 36px !important;
    height: 36px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
  }
  
  .favorite-btn-mobile i {
    font-size: 14px !important;
  }
  
  /* Assurer que le bouton est visible dans les carousels */
  .product-card .favorite-btn-mobile {
    z-index: 20 !important;
  }
  
  /* Ajustement pour les carousels spécifiques */
  .carousel-container .favorite-btn-mobile,
  .category-carousel-scroll .favorite-btn-mobile {
    right: 10px !important;
  }
}
`;
  
  globalsCssContent += mobileStyles;
  fs.writeFileSync(globalsCssPath, globalsCssContent, 'utf8');
  console.log('✅ globals.css - Styles mobile ajoutés pour bouton favoris');
} else {
  console.log('ℹ️  globals.css - Styles déjà présents');
}

// Vérifier et ajuster les pages qui utilisent des carousels
const pagesWithCarousels = [
  'frontend/app/(public)/page.tsx',
  'frontend/app/(public)/nouveautes/page.tsx',
  'frontend/app/(public)/shop/page.tsx'
];

pagesWithCarousels.forEach(pagePath => {
  const fullPath = path.join(__dirname, pagePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    // Ajuster tous les boutons favoris avec right: '50px' ou similaire
    if (content.includes("right: '50px'") || content.includes('right: "50px"')) {
      content = content.replace(/right: ['"]50px['"]/g, "right: '12px'");
      modified = true;
    }
    
    // Ajuster aussi les positions avec des valeurs élevées
    if (content.includes("right: '40px'") || content.includes('right: "40px"')) {
      content = content.replace(/right: ['"]40px['"]/g, "right: '12px'");
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${path.basename(pagePath)} - Boutons favoris ajustés`);
    } else {
      console.log(`ℹ️  ${path.basename(pagePath)} - Aucun ajustement nécessaire`);
    }
  }
});

console.log('\n✨ Ajustements terminés!');
console.log('\n📱 Changements appliqués:');
console.log('   • Bouton favoris décalé vers la gauche (right: 12px)');
console.log('   • Taille réduite en mobile (36x36px)');
console.log('   • Meilleure visibilité avec z-index augmenté');
console.log('   • Ombre portée améliorée pour contraste');
console.log('\n🧪 Pour tester:');
console.log('   1. Ouvrir le site en mode mobile (F12 > Toggle device toolbar)');
console.log('   2. Naviguer vers la page d\'accueil');
console.log('   3. Vérifier les sections "Nos Accessoires", "Nos Smartphones", "Nos Nouveautés"');
console.log('   4. Le bouton cœur doit être visible à droite dans chaque carte');
