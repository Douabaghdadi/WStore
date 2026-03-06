const fs = require('fs');
const path = require('path');

console.log('🎯 Décalage des icônes de favoris vers la gauche...\n');

// Fichier ProductCard.tsx
const productCardPath = path.join(__dirname, 'frontend/app/components/ProductCard.tsx');

try {
  let content = fs.readFileSync(productCardPath, 'utf8');
  
  // Modifier le positionnement du bouton favoris
  // Changer de right: '12px' à right: '20px' pour plus d'espace à droite
  // et ajouter un décalage vers la gauche
  content = content.replace(
    /\/\* Favorite Button \*\/\s+<button[^>]*style=\{\{[^}]*position: 'absolute',[^}]*top: '12px',[^}]*right: '12px',/,
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
          style={{
            position: 'absolute',
            top: '12px',
            right: '20px',`
  );
  
  fs.writeFileSync(productCardPath, content, 'utf8');
  console.log('✅ ProductCard.tsx - Icône favoris décalée vers la gauche');
  
} catch (error) {
  console.error('❌ Erreur ProductCard.tsx:', error.message);
}

// Ajouter des styles CSS globaux pour un meilleur contrôle
const globalCssPath = path.join(__dirname, 'frontend/app/globals.css');

try {
  let cssContent = fs.readFileSync(globalCssPath, 'utf8');
  
  // Vérifier si les styles existent déjà
  if (!cssContent.includes('/* Ajustement icônes favoris carousels */')) {
    const favorisStyles = `

/* Ajustement icônes favoris carousels */
.product-card button[style*="position: absolute"][style*="top: 12px"] {
  right: 20px !important;
}

/* Mobile - décalage plus prononcé */
@media (max-width: 768px) {
  .product-card button[style*="position: absolute"][style*="top: 12px"] {
    right: 24px !important;
    top: 10px !important;
  }
  
  /* Assurer que l'icône ne chevauche pas le badge de réduction */
  .product-card span[style*="position: absolute"][style*="left: 12px"] {
    left: 10px !important;
  }
}

/* Carousels spécifiques */
.accessories-carousel .product-card button[style*="position: absolute"],
.smartphones-carousel .product-card button[style*="position: absolute"],
.nouveautes-carousel .product-card button[style*="position: absolute"] {
  right: 22px !important;
}
`;
    
    fs.appendFileSync(globalCssPath, favorisStyles, 'utf8');
    console.log('✅ globals.css - Styles de décalage ajoutés');
  } else {
    console.log('ℹ️  globals.css - Styles déjà présents');
  }
  
} catch (error) {
  console.error('❌ Erreur globals.css:', error.message);
}

console.log('\n✨ Décalage des icônes de favoris terminé!');
console.log('📱 Les icônes sont maintenant décalées vers la gauche dans tous les carousels');
