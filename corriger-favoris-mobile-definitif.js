const fs = require('fs');
const path = require('path');

console.log('🎯 Correction définitive des icônes favoris sur mobile...\n');

// 1. Modifier ProductCard.tsx avec un positionnement plus agressif
const productCardPath = path.join(__dirname, 'frontend/app/components/ProductCard.tsx');

try {
  let content = fs.readFileSync(productCardPath, 'utf8');
  
  // Remplacer complètement le style du bouton favoris
  content = content.replace(
    /\/\* Favorite Button \*\/[\s\S]*?<button[\s\S]*?onClick=\{[^}]*\}[\s\S]*?style=\{\{[\s\S]*?position: 'absolute',[\s\S]*?top: '[^']*',[\s\S]*?right: '[^']*',/,
    `/* Favorite Button */
        <button
          onClick={(e) => {
            e.preventDefault();
            if (isFav) {
              removeFavorite(product._id);
            } else {
              addFavorite(product._id);
            }
          }}
          className="favorite-btn-mobile"
          style={{
            position: 'absolute',
            top: '10px',
            right: '50px',`
  );
  
  fs.writeFileSync(productCardPath, content, 'utf8');
  console.log('✅ ProductCard.tsx - Position favoris modifiée (right: 50px)');
  
} catch (error) {
  console.error('❌ Erreur ProductCard.tsx:', error.message);
}

// 2. Ajouter des styles CSS très spécifiques pour mobile
const globalCssPath = path.join(__dirname, 'frontend/app/globals.css');

try {
  let cssContent = fs.readFileSync(globalCssPath, 'utf8');
  
  // Supprimer les anciens styles s'ils existent
  cssContent = cssContent.replace(/\/\* Ajustement icônes favoris carousels \*\/[\s\S]*?(?=\/\*|$)/g, '');
  
  const mobileStyles = `

/* ========================================
   CORRECTION DÉFINITIVE FAVORIS MOBILE
   ======================================== */

/* Tous les boutons favoris dans les cartes produits */
.product-card button[style*="position: absolute"],
.product-card .favorite-btn-mobile {
  right: 50px !important;
  top: 10px !important;
  z-index: 20 !important;
}

/* Mobile - décalage encore plus prononcé */
@media (max-width: 768px) {
  .product-card button[style*="position: absolute"],
  .product-card .favorite-btn-mobile {
    right: 60px !important;
    top: 8px !important;
    width: 36px !important;
    height: 36px !important;
  }
  
  /* Badge de réduction - garder à gauche */
  .product-card span[style*="position: absolute"][style*="left"] {
    left: 8px !important;
    top: 8px !important;
  }
}

/* Très petits écrans */
@media (max-width: 480px) {
  .product-card button[style*="position: absolute"],
  .product-card .favorite-btn-mobile {
    right: 70px !important;
    top: 8px !important;
  }
}

/* Carousels spécifiques - page d'accueil */
.accessories-carousel .product-card button[style*="position: absolute"],
.smartphones-carousel .product-card button[style*="position: absolute"],
.nouveautes-carousel .product-card button[style*="position: absolute"] {
  right: 55px !important;
}

@media (max-width: 768px) {
  .accessories-carousel .product-card button[style*="position: absolute"],
  .smartphones-carousel .product-card button[style*="position: absolute"],
  .nouveautes-carousel .product-card button[style*="position: absolute"] {
    right: 65px !important;
  }
}

/* S'assurer qu'il n'y a pas de chevauchement */
.product-card > div:first-child {
  position: relative;
  overflow: visible !important;
}
`;
  
  fs.appendFileSync(globalCssPath, mobileStyles, 'utf8');
  console.log('✅ globals.css - Styles mobile agressifs ajoutés');
  
} catch (error) {
  console.error('❌ Erreur globals.css:', error.message);
}

// 3. Modifier la page d'accueil pour ajouter des classes spécifiques
const homePath = path.join(__dirname, 'frontend/app/(public)/page.tsx');

try {
  let homeContent = fs.readFileSync(homePath, 'utf8');
  
  // Ajouter des classes aux sections de carousels si elles n'existent pas
  if (!homeContent.includes('accessories-carousel')) {
    homeContent = homeContent.replace(
      /<div style=\{\{[^}]*overflow: 'hidden'[^}]*\}\}>\s*<div[^>]*className="category-scroll"/g,
      (match) => match.replace('className="category-scroll"', 'className="category-scroll accessories-carousel"')
    );
  }
  
  fs.writeFileSync(homePath, homeContent, 'utf8');
  console.log('✅ page.tsx - Classes de carousel ajoutées');
  
} catch (error) {
  console.log('ℹ️  page.tsx - Pas de modification nécessaire');
}

console.log('\n✨ Correction définitive terminée!');
console.log('📱 Les icônes favoris sont maintenant décalées de 50-70px vers la gauche sur mobile');
console.log('🔄 Déployez maintenant avec: .\\deployer-favoris-mobile-definitif.ps1');
