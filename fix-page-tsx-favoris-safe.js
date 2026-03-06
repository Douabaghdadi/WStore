const fs = require('fs');
const path = require('path');

console.log('🔧 Correction SÉCURISÉE - Boutons favoris page d\'accueil\n');

const pageHomePath = path.join(__dirname, 'frontend/app/(public)/page.tsx');
let content = fs.readFileSync(pageHomePath, 'utf8');

console.log('📄 Traitement de frontend/app/(public)/page.tsx...');

// Compter les occurrences avant
const beforeMatches = content.match(/bottom: '12px',\s*right: '12px',/g);
const beforeCount = beforeMatches ? beforeMatches.length : 0;
console.log(`   Trouvé ${beforeCount} boutons favoris avec bottom: '12px'`);

// Remplacer TOUTES les occurrences de manière sûre
// On remplace le pattern complet pour éviter les erreurs
let replacements = 0;

// Pattern 1: bottom: '12px', right: '12px',
content = content.replace(
  /bottom: '12px',(\s*)right: '12px',/g,
  (match, whitespace) => {
    replacements++;
    return `top: '10px',${whitespace}right: '10px',`;
  }
);

// Aussi améliorer le boxShadow et ajouter backdrop-filter
content = content.replace(
  /boxShadow: '0 2px 10px rgba\(0,0,0,0\.1\)',(\s*)transition: 'all 0\.2s ease'/g,
  (match, whitespace) => {
    return `boxShadow: '0 2px 10px rgba(0,0,0,0.15)',${whitespace}backdropFilter: 'blur(8px)',${whitespace}WebkitBackdropFilter: 'blur(8px)',${whitespace}transition: 'all 0.2s ease',${whitespace}zIndex: 20`;
  }
);

fs.writeFileSync(pageHomePath, content, 'utf8');

console.log(`   ✅ ${replacements} boutons favoris corrigés`);
console.log('\n✨ Correction terminée avec succès!');
console.log('\n📱 Changements appliqués:');
console.log('   • Position: bottom: 12px → top: 10px');
console.log('   • Position: right: 12px → right: 10px');
console.log('   • Ajout backdrop-filter pour effet moderne');
console.log('   • Z-index: 20 pour visibilité garantie');
console.log('\n🎯 Résultat:');
console.log('   • Boutons favoris maintenant en HAUT à droite');
console.log('   • Visible dans les 3 carousels (Accessoires, Smartphones, Nouveautés)');
