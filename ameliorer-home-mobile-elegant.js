const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend', 'app', '(public)', 'page.tsx');

// Lire le fichier
let content = fs.readFileSync(filePath, 'utf8');

// Trouver et remplacer la section de styles mobile
const styleStart = content.indexOf('/* Cartes produits - Design Luxe Mobile */');
const styleEnd = content.indexOf('/* Bannières latérales - Masquer sur mobile */');

if (styleStart !== -1 && styleEnd !== -1) {
  const beforeStyles = content.substring(0, styleStart);
  const afterStyles = content.substring(styleEnd);
  
  const newStyles = `/* === CARTES PRODUITS - DESIGN ÉLÉGANT ET PROFESSIONNEL === */
        @media (max-width: 768px) {
          /* Carte principale - Design premium */
          div[style*="minWidth: '280px'"],
          .homepage-product-card {
            min-width: 280px !important;
            max-width: 280px !important;
            border-radius: 28px !important;
            box-shadow: 0 10px 35px rgba(0,0,0,0.12) !important;
            border: 1px solid rgba(0,0,0,0.08) !important;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
            overflow: hidden !important;
            background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%) !important;
          }
          
          /* Effet touch élégant sur les cartes */
          div[style*="minWidth: '280px'"]:active,
          .homepage-product-card:active {
            transform: translateY(-8px) scale(1.02) !important;
            box-shadow: 0 20px 50px rgba(0,0,0,0.18) !important;
          }
          
          /* Container image - Plus spacieux */
          div[style*="minWidth: '280px'"] > div:first-child,
          .homepage-product-card > div:first-child {
            height: 250px !important;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%) !important;
          }
          
          /* Image produit - Taille optimale */
          div[style*="minWidth: '280px'"] img,
          .homepage-product-card img {
            height: 250px !important;
            padding: 22px !important;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          
          div[style*="minWidth: '280px'"]:active img,
          .homepage-product-card:active img {
            transform: scale(1.08) !important;
          }
          
          /* Contenu de la carte - Espacement professionnel */
          div[style*="minWidth: '280px'"] > div:last-child,
          .homepage-product-card > div:last-child {
            padding: 20px !important;
          }
          
          /* Titre produit - Typographie élégante */
          div[style*="minWidth: '280px'"] h6,
          .homepage-product-card h6 {
            font-size: 15px !important;
            height: 44px !important;
            line-height: 1.5 !important;
            font-weight: 700 !important;
            letter-spacing: -0.3px !important;
            color: #1a202c !important;
            margin-bottom: 12px !important;
          }
          
          /* Prix - Design premium */
          div[style*="minWidth: '280px'"] span[style*="fontSize: '20px'"],
          .homepage-product-card span[style*="fontSize: '20px'"] {
            font-size: 22px !important;
            font-weight: 900 !important;
            letter-spacing: -0.8px !important;
          }
          
          /* Badge promo - Style luxe */
          div[style*="minWidth: '280px'"] span[style*="position: absolute"][style*="top"],
          .homepage-product-card span[style*="position: absolute"][style*="top"] {
            border-radius: 12px !important;
            padding: 8px 14px !important;
            font-size: 13px !important;
            font-weight: 900 !important;
            letter-spacing: 0.6px !important;
            box-shadow: 0 6px 16px rgba(0,0,0,0.25) !important;
            backdrop-filter: blur(8px) !important;
          }
          
          /* Badge stock - Design élégant */
          div[style*="minWidth: '280px'"] div[style*="display: inline-flex"],
          .homepage-product-card div[style*="display: inline-flex"] {
            padding: 6px 14px !important;
            border-radius: 24px !important;
            font-size: 12px !important;
            font-weight: 800 !important;
            letter-spacing: 0.4px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
          }
          
          /* Marque - Style subtil */
          div[style*="minWidth: '280px'"] p[style*="textTransform: 'uppercase'"],
          .homepage-product-card p[style*="textTransform: 'uppercase'"] {
            font-size: 12px !important;
            font-weight: 700 !important;
            letter-spacing: 1px !important;
            opacity: 0.7 !important;
          }
          
          /* Sélecteur de quantité - Design premium */
          div[style*="minWidth: '28px'"] {
            border-radius: 14px !important;
            padding: 5px !important;
            box-shadow: 0 3px 12px rgba(0,0,0,0.1) !important;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
          }
          
          div[style*="minWidth: '28px'"] button {
            width: 32px !important;
            height: 32px !important;
            font-size: 15px !important;
            border-radius: 10px !important;
            font-weight: 800 !important;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.12) !important;
          }
          
          div[style*="minWidth: '28px'"] button:active {
            transform: scale(0.88) !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15) !important;
          }
          
          div[style*="minWidth: '28px'"] span {
            min-width: 32px !important;
            font-size: 14px !important;
            font-weight: 800 !important;
          }
          
          /* Bouton ajouter au panier - Design luxe */
          button[style*="flex: 1"] {
            padding: 12px !important;
            font-size: 12px !important;
            border-radius: 14px !important;
            font-weight: 800 !important;
            letter-spacing: 0.4px !important;
            box-shadow: 0 6px 16px rgba(0,0,0,0.18) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            text-transform: uppercase !important;
          }
          
          button[style*="flex: 1"]:active {
            transform: scale(0.95) !important;
            box-shadow: 0 3px 10px rgba(0,0,0,0.25) !important;
          }
          
          /* Bouton favoris - Design élégant */
          button[style*="position: absolute"][style*="bottom: 12px"] {
            width: 44px !important;
            height: 44px !important;
            border-radius: 50% !important;
            box-shadow: 0 6px 20px rgba(0,0,0,0.18) !important;
            backdrop-filter: blur(12px) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            border: 2px solid rgba(255,255,255,0.8) !important;
          }
          
          button[style*="position: absolute"][style*="bottom: 12px"]:active {
            transform: scale(1.15) rotate(10deg) !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important;
          }
          
          button[style*="position: absolute"][style*="bottom: 12px"] i {
            font-size: 17px !important;
          }
          
          /* Scroll horizontal fluide */
          div[style*="overflowX: 'auto'"] {
            scroll-behavior: smooth !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            gap: 18px !important;
            padding: 12px 8px !important;
          }
          
          div[style*="overflowX: 'auto'"]::-webkit-scrollbar {
            display: none !important;
          }
        }
        
        /* Optimisations pour petits écrans (< 375px) */
        @media (max-width: 375px) {
          div[style*="minWidth: '280px'"],
          .homepage-product-card {
            min-width: 260px !important;
            max-width: 260px !important;
          }
        }
        
        `;
  
  content = beforeStyles + newStyles + afterStyles;
  
  // Écrire le fichier
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Améliorations appliquées avec succès!');
  console.log('📱 Les cartes sont maintenant plus élégantes et professionnelles');
  console.log('🎨 Design premium avec:');
  console.log('   - Cartes 280px (au lieu de 260px)');
  console.log('   - Images 250px (au lieu de 220px)');
  console.log('   - Ombres profondes et élégantes');
  console.log('   - Animations fluides');
  console.log('   - Typographie soignée');
  console.log('   - Boutons premium');
} else {
  console.log('❌ Section de styles non trouvée');
}
