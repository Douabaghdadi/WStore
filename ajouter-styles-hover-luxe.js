const fs = require('fs');
const path = require('path');

console.log('Ajout des styles hover et animations luxe...\n');

const filePath = path.join(process.cwd(), 'frontend/app/(public)/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Trouver l'endroit où insérer les styles (après le return)
const returnIndex = content.indexOf('return (');

if (returnIndex === -1) {
  console.log('Erreur: return non trouve');
  process.exit(1);
}

const stylesCSS = `
      <style jsx>{\`
        /* Effet hover sur les cartes produits */
        .product-card-luxe {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .product-card-luxe:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1) !important;
        }
        
        /* Effet zoom sur l'image au hover */
        .product-image-container {
          overflow: hidden;
        }
        
        .product-image-container img {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .product-card-luxe:hover .product-image-container img {
          transform: scale(1.1);
        }
        
        /* Animation du bouton favoris */
        .fav-button-luxe {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .fav-button-luxe:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 25px rgba(220, 38, 38, 0.4) !important;
        }
        
        .fav-button-luxe:active {
          transform: scale(0.95);
        }
        
        /* Animation du bouton ajouter */
        .add-cart-button-luxe {
          position: relative;
          overflow: hidden;
        }
        
        .add-cart-button-luxe::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .add-cart-button-luxe:hover::before {
          left: 100%;
        }
        
        .add-cart-button-luxe:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26, 54, 93, 0.4) !important;
        }
        
        .add-cart-button-luxe:active {
          transform: translateY(0);
        }
        
        /* Effet sur les boutons de quantité */
        .quantity-btn-luxe {
          transition: all 0.2s ease;
        }
        
        .quantity-btn-luxe:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(26, 54, 93, 0.3) !important;
        }
        
        .quantity-btn-luxe:active {
          transform: scale(0.95);
        }
        
        /* Animation du badge promo */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 4px 15px rgba(26, 54, 93, 0.4), 0 0 20px rgba(26, 54, 93, 0.2);
          }
          50% {
            box-shadow: 0 4px 20px rgba(26, 54, 93, 0.6), 0 0 30px rgba(26, 54, 93, 0.4);
          }
        }
        
        .promo-badge-luxe {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        /* Effet shimmer sur le prix */
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .price-gradient-luxe {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        
        /* Effet glow sur le badge stock */
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 2px 10px rgba(34, 197, 94, 0.2);
          }
          50% {
            box-shadow: 0 2px 15px rgba(34, 197, 94, 0.4);
          }
        }
        
        .stock-badge-luxe {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        /* Scroll smooth pour les carrousels */
        .carousel-scroll-luxe {
          scroll-behavior: smooth;
          scrollbar-width: none;
        }
        
        .carousel-scroll-luxe::-webkit-scrollbar {
          display: none;
        }
        
        /* Boutons de navigation carrousel */
        .carousel-nav-btn {
          transition: all 0.3s ease;
        }
        
        .carousel-nav-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
        }
        
        .carousel-nav-btn:active {
          transform: scale(0.95);
        }
        
        /* Responsive mobile */
        @media (max-width: 768px) {
          .product-card-luxe:hover {
            transform: translateY(-4px) scale(1.01);
          }
        }
      \`}</style>
      `;

// Insérer les styles juste après le return
const insertPosition = content.indexOf('return (') + 'return ('.length;
content = content.slice(0, insertPosition) + '\n    <>' + stylesCSS + content.slice(insertPosition);

// Fermer le fragment à la fin
const lastReturnIndex = content.lastIndexOf('</div>\n    );');
if (lastReturnIndex !== -1) {
  content = content.slice(0, lastReturnIndex + '</div>'.length) + '\n      </>' + content.slice(lastReturnIndex + '</div>'.length);
}

fs.writeFileSync(filePath, content, 'utf8');

console.log('OK Styles hover et animations ajoutes!\n');
console.log('Effets ajoutes:');
console.log('  - Hover 3D sur les cartes');
console.log('  - Zoom image au survol');
console.log('  - Animation pulse sur favoris');
console.log('  - Effet shine sur bouton ajouter');
console.log('  - Animation glow sur badges');
console.log('  - Effet shimmer sur prix');
console.log('  - Transitions fluides partout\n');
