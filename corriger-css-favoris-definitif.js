const fs = require('fs');
const path = require('path');

console.log('🔧 Correction définitive du CSS pour boutons favoris...\n');

const globalsCssPath = path.join(__dirname, 'frontend/app/globals.css');
let content = fs.readFileSync(globalsCssPath, 'utf8');

// Supprimer tous les anciens styles contradictoires pour favorite-btn-mobile
console.log('🗑️  Suppression des anciens styles contradictoires...');

// Supprimer le bloc qui force right: 50px, 60px, 70px
content = content.replace(/\/\* Tous les boutons favoris dans les cartes produits \*\/[\s\S]*?right: 50px !important;[\s\S]*?}\s*@media \(max-width: 768px\)[\s\S]*?right: 60px !important;[\s\S]*?}\s*@media \(max-width: 480px\)[\s\S]*?right: 70px !important;[\s\S]*?}/g, '');

// Supprimer l'ancien bloc "Ajustement bouton favoris carousels mobile"
content = content.replace(/\/\* Ajustement bouton favoris carousels mobile \*\/[\s\S]*?@media \(max-width: 768px\) \{[\s\S]*?\.category-carousel-scroll \.favorite-btn-mobile \{[\s\S]*?right: 10px !important;[\s\S]*?}\s*}/g, '');

console.log('✅ Anciens styles supprimés');

// Ajouter le nouveau CSS propre et définitif
const newStyles = `

/* ========================================
   BOUTON FAVORIS - CORRECTION DÉFINITIVE
   ======================================== */

/* Desktop - Position par défaut */
.favorite-btn-mobile {
  position: absolute !important;
  top: 12px !important;
  right: 12px !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  border: 1px solid rgba(255,255,255,0.5) !important;
  background: rgba(255,255,255,0.9) !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  transition: all 0.2s ease !important;
  z-index: 30 !important;
}

/* État actif (favori ajouté) */
.favorite-btn-mobile[style*="background: rgb(254, 226, 226)"],
.favorite-btn-mobile[style*="background: #fee2e2"] {
  background: #fee2e2 !important;
}

/* Icône du bouton */
.favorite-btn-mobile i {
  font-size: 16px !important;
  transition: transform 0.2s ease !important;
}

/* Hover effect */
.favorite-btn-mobile:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
}

.favorite-btn-mobile:hover i {
  transform: scale(1.1) !important;
}

/* Mobile - Ajustements spécifiques */
@media (max-width: 768px) {
  .favorite-btn-mobile {
    top: 10px !important;
    right: 10px !important;
    width: 36px !important;
    height: 36px !important;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
    z-index: 40 !important;
  }
  
  .favorite-btn-mobile i {
    font-size: 14px !important;
  }
  
  /* Assurer la visibilité dans les carousels */
  .product-card .favorite-btn-mobile,
  .carousel-container .favorite-btn-mobile,
  .category-carousel-scroll .favorite-btn-mobile {
    right: 10px !important;
    top: 10px !important;
  }
}

/* Très petits écrans */
@media (max-width: 480px) {
  .favorite-btn-mobile {
    top: 8px !important;
    right: 8px !important;
    width: 34px !important;
    height: 34px !important;
  }
  
  .favorite-btn-mobile i {
    font-size: 13px !important;
  }
}

/* S'assurer que le bouton est toujours au-dessus */
.product-card {
  position: relative !important;
}

.product-card > div:first-child {
  position: relative !important;
}
`;

// Ajouter les nouveaux styles à la fin
content += newStyles;

fs.writeFileSync(globalsCssPath, content, 'utf8');
console.log('✅ Nouveaux styles CSS appliqués');

console.log('\n✨ Correction terminée!');
console.log('\n📱 Styles appliqués:');
console.log('   • Position fixe: top: 10px, right: 10px (mobile)');
console.log('   • Taille: 36x36px (mobile), 34x34px (très petit écran)');
console.log('   • Z-index élevé: 40 pour être toujours visible');
console.log('   • Ombre améliorée pour contraste');
console.log('   • Effet hover avec animation');
console.log('\n🎯 Le bouton favoris sera maintenant:');
console.log('   ✓ Toujours visible dans les cartes');
console.log('   ✓ Bien positionné à droite');
console.log('   ✓ Facile à cliquer');
console.log('   ✓ Cohérent sur toutes les pages');
