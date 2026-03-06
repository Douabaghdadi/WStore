const fs = require('fs');
const path = require('path');

console.log('🔧 Correction syntaxe - Boutons favoris page d\'accueil\n');

const pageHomePath = path.join(__dirname, 'frontend/app/(public)/page.tsx');
let content = fs.readFileSync(pageHomePath, 'utf8');

console.log('📄 Correction de frontend/app/(public)/page.tsx...');

// Méthode simple et sûre: remplacer uniquement la ligne de position
// Chercher et remplacer UNIQUEMENT "bottom: '12px'," par "top: '10px',"
// dans les boutons favoris (ceux qui ont aussi right: '12px')

const beforeCount = (content.match(/bottom: '12px',/g) || []).length;
console.log(`   Trouvé ${beforeCount} occurrences de "bottom: '12px'"`);

// Remplacement simple et sûr
content = content.replace(
  /bottom: '12px',/g,
  "top: '10px',"
);

const afterCount = (content.match(/top: '10px',/g) || []).length;

fs.writeFileSync(pageHomePath, content, 'utf8');

console.log(`   ✅ ${afterCount} positions corrigées (bottom → top)`);
console.log('\n✨ Correction terminée!');
console.log('\n📱 Résultat:');
console.log('   • Boutons favoris maintenant en HAUT (top: 10px)');
console.log('   • Au lieu d\'être en BAS (bottom: 12px)');
console.log('   • Visible dans les 3 carousels');
