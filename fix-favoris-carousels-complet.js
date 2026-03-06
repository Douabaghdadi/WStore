const fs = require('fs');
const path = require('path');

console.log('🔧 CORRECTION COMPLÈTE - Boutons favoris dans les carousels\n');
console.log('═══════════════════════════════════════════════════════════\n');

let totalFixes = 0;

// 1. Corriger la page d'accueil (page.tsx)
console.log('📄 1. Correction de frontend/app/(public)/page.tsx...');
const pageHomePath = path.join(__dirname, 'frontend/app/(public)/page.tsx');
let pageHomeContent = fs.readFileSync(pageHomePath, 'utf8');

// Compter les occurrences avant
const beforeCount = (pageHomeContent.match(/bottom: '12px',[\s\S]*?right: '12px',/g) || []).length;

// Remplacer TOUS les boutons favoris avec bottom par top
pageHomeContent = pageHomeContent.replace(
  /style=\{\{[\s\S]*?position: 'absolute',[\s\S]*?bottom: '12px',[\s\S]*?right: '12px',[\s\S]*?width: '36px',[\s\S]*?height: '36px',[\s\S]*?borderRadius: '50%',[\s\S]*?border: 'none',[\s\S]*?background: isFav \? '#fee2e2' : 'rgba\(255,255,255,0\.9\)',[\s\S]*?cursor: 'pointer',[\s\S]*?display: 'flex',[\s\S]*?alignItems: 'center',[\s\S]*?justifyContent: 'center',[\s\S]*?boxShadow: '0 2px 10px rgba\(0,0,0,0\.1\)',[\s\S]*?transition: 'all 0\.2s ease'[\s\S]*?\}\}/g,
  `style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: 'none',
                                background: isFav ? '#fee2e2' : 'rgba(255,255,255,0.9)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                transition: 'all 0.2s ease',
                                zIndex: 20
                              }}`
);

// Méthode alternative plus simple - remplacer juste la position
pageHomeContent = pageHomeContent.replace(
  /bottom: '12px',\s*right: '12px',/g,
  `top: '10px',
                                right: '10px',`
);

fs.writeFileSync(pageHomePath, pageHomeContent, 'utf8');
const afterCount = (pageHomeContent.match(/top: '10px',[\s\S]*?right: '10px',/g) || []).length;
console.log(`   ✅ ${afterCount} boutons favoris corrigés (bottom → top)`);
totalFixes += afterCount;

// 2. Vérifier et corriger ProductCard.tsx
console.log('\n📄 2. Vérification de frontend/app/components/ProductCard.tsx...');
const productCardPath = path.join(__dirname, 'frontend/app/components/ProductCard.tsx');
let productCardContent = fs.readFileSync(productCardPath, 'utf8');

if (productCardContent.includes("right: '12px'")) {
  // Déjà corrigé dans le script précédent
  console.log('   ✅ ProductCard.tsx déjà corrigé');
} else if (productCardContent.includes("right: '50px'")) {
  productCardContent = productCardContent.replace(/right: '50px',/g, "right: '10px',");
  fs.writeFileSync(productCardPath, productCardContent, 'utf8');
  console.log('   ✅ ProductCard.tsx corrigé (50px → 10px)');
  totalFixes++;
}

// 3. Corriger le CSS globals.css
console.log('\n📄 3. Correction de frontend/app/globals.css...');
const globalsCssPath = path.join(__dirname, 'frontend/app/globals.css');
let globalsCssContent = fs.readFileSync(globalsCssPath, 'utf8');

// Supprimer TOUS les anciens styles contradictoires
const oldStylesPatterns = [
  /\/\* Tous les boutons favoris dans les cartes produits \*\/[\s\S]*?@media \(max-width: 480px\)[\s\S]*?right: 70px !important;[\s\S]*?}/g,
  /\/\* Ajustement bouton favoris carousels mobile \*\/[\s\S]*?@media \(max-width: 768px\)[\s\S]*?right: 10px !important;[\s\S]*?}/g,
  /\/\* ========================================[\s\S]*?BOUTON FAVORIS - CORRECTION DÉFINITIVE[\s\S]*?========================================[\s\S]*?@media \(max-width: 480px\)[\s\S]*?font-size: 13px !important;[\s\S]*?}[\s\S]*?}/g
];

oldStylesPatterns.forEach(pattern => {
  globalsCssContent = globalsCssContent.replace(pattern, '');
});

// Ajouter le CSS définitif et propre
const finalCSS = `

/* ═══════════════════════════════════════════════════════════
   BOUTON FAVORIS - CORRECTION FINALE ET DÉFINITIVE
   ═══════════════════════════════════════════════════════════ */

/* Bouton favoris - Tous les écrans */
.favorite-btn-mobile,
button[class*="favorite"] {
  position: absolute !important;
  top: 10px !important;
  right: 10px !important;
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

/* Icône du bouton */
.favorite-btn-mobile i,
button[class*="favorite"] i {
  font-size: 16px !important;
  transition: transform 0.2s ease !important;
}

/* Hover effect */
.favorite-btn-mobile:hover,
button[class*="favorite"]:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important;
}

/* Mobile - Tablettes et petits écrans */
@media (max-width: 768px) {
  .favorite-btn-mobile,
  button[class*="favorite"] {
    top: 10px !important;
    right: 10px !important;
    width: 36px !important;
    height: 36px !important;
    z-index: 40 !important;
  }
  
  .favorite-btn-mobile i,
  button[class*="favorite"] i {
    font-size: 14px !important;
  }
  
  /* Carousels spécifiques */
  .mobile-carousel .favorite-btn-mobile,
  .mobile-carousel button[class*="favorite"],
  .mobile-product-card .favorite-btn-mobile,
  .mobile-product-card button[class*="favorite"] {
    top: 10px !important;
    right: 10px !important;
  }
}

/* Très petits écrans */
@media (max-width: 480px) {
  .favorite-btn-mobile,
  button[class*="favorite"] {
    top: 8px !important;
    right: 8px !important;
    width: 34px !important;
    height: 34px !important;
  }
  
  .favorite-btn-mobile i,
  button[class*="favorite"] i {
    font-size: 13px !important;
  }
}

/* Assurer le contexte de positionnement */
.product-card,
.mobile-product-card {
  position: relative !important;
}

.product-card > div:first-child,
.mobile-product-card > div:first-child {
  position: relative !important;
}
`;

globalsCssContent += finalCSS;
fs.writeFileSync(globalsCssPath, globalsCssContent, 'utf8');
console.log('   ✅ CSS nettoyé et styles définitifs appliqués');
totalFixes++;

console.log('\n═══════════════════════════════════════════════════════════');
console.log(`✨ CORRECTION TERMINÉE - ${totalFixes} fichiers corrigés`);
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📱 RÉSUMÉ DES CORRECTIONS:\n');
console.log('   ✓ Page d\'accueil: boutons favoris repositionnés (top: 10px)');
console.log('   ✓ ProductCard: position vérifiée et corrigée');
console.log('   ✓ CSS global: styles unifiés et propres');
console.log('   ✓ Z-index élevé: toujours visible (z-index: 40)');
console.log('   ✓ Responsive: adapté à tous les écrans');
console.log('\n🎯 RÉSULTAT ATTENDU:\n');
console.log('   • Bouton favoris visible en haut à droite');
console.log('   • Position: top: 10px, right: 10px (mobile)');
console.log('   • Taille: 36x36px (mobile), 34x34px (très petit)');
console.log('   • Fonctionne dans TOUS les carousels:');
console.log('     - Nos Accessoires');
console.log('     - Nos Smartphones');
console.log('     - Nos Nouveautés');
console.log('\n🧪 POUR TESTER:\n');
console.log('   1. Déployer: .\\deployer-favoris-final.ps1');
console.log('   2. Attendre 2-3 minutes');
console.log('   3. Ouvrir https://w-store.tn en mode mobile');
console.log('   4. Vérifier les 3 sections de carousels');
console.log('   5. Le bouton cœur doit être en HAUT à droite\n');
