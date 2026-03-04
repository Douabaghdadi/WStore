const fs = require('fs');
const path = require('path');

console.log('Amelioration Design Luxe - Version Safe\n');

const filePath = path.join(process.cwd(), 'frontend/app/(public)/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Ajouter uniquement les styles CSS à la fin du fichier, avant le dernier }
const stylesCSS = `
      <style jsx global>{\`
        /* Cartes produits luxe */
        .product-card-home {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .product-card-home:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1) !important;
        }
        
        /* Zoom image au hover */
        .product-card-home:hover img {
          transform: scale(1.1) !important;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        /* Boutons avec effet */
        button[style*="shopping-cart"]:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(26, 54, 93, 0.4) !important;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .product-card-home:hover {
            transform: translateY(-4px) scale(1.01) !important;
          }
        }
      \`}</style>
`;

// Trouver le dernier return et ajouter les styles
const lastExportIndex = content.lastIndexOf('export default function Home()');
if (lastExportIndex !== -1) {
  // Trouver le return après export
  const returnIndex = content.indexOf('return (', lastExportIndex);
  if (returnIndex !== -1) {
    const insertPos = returnIndex + 'return ('.length;
    content = content.slice(0, insertPos) + '\n    <>' + stylesCSS + '\n' + content.slice(insertPos);
    
    // Fermer le fragment avant la dernière accolade de la fonction
    const lastClosingBrace = content.lastIndexOf('  );');
    if (lastClosingBrace !== -1) {
      content = content.slice(0, lastClosingBrace) + '    </>\n' + content.slice(lastClosingBrace);
    }
  }
}

fs.writeFileSync(filePath, content, 'utf8');

console.log('OK Styles CSS ajoutes avec succes!\n');
console.log('Effets ajoutes:');
console.log('  - Hover 3D sur les cartes');
console.log('  - Zoom image au survol');
console.log('  - Effet sur les boutons');
console.log('  - Responsive mobile\n');
console.log('Pour activer les effets, ajoutez className="product-card-home" aux cartes produits\n');
