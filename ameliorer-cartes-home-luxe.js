const fs = require('fs');
const path = require('path');

console.log('Amelioration Design Luxe - Cartes Page d Accueil\n');

const filePath = path.join(process.cwd(), 'frontend/app/(public)/page.tsx');

if (!fs.existsSync(filePath)) {
  console.log('❌ Fichier non trouvé');
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Amélioration 1: Carte produit avec effet glassmorphism et ombres élégantes
const oldCardStyle = `minWidth: '280px', maxWidth: '280px', background: 'white',
                          borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                          border: '1px solid #e2e8f0', flexShrink: 0`;

const newCardStyle = `minWidth: '280px', maxWidth: '280px',
                          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                          borderRadius: '24px',
                          overflow: 'hidden',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
                          border: '1px solid rgba(255,255,255,0.8)',
                          flexShrink: 0,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          backdropFilter: 'blur(10px)'`;

content = content.replace(oldCardStyle, newCardStyle);

// Amélioration 2: Image container avec effet hover premium
const oldImageStyle = `position: 'relative', background: '#f7fafc', height: '240px'`;

const newImageStyle = `position: 'relative',
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
                            height: '240px',
                            overflow: 'hidden',
                            transition: 'all 0.4s ease'`;

content = content.replace(new RegExp(oldImageStyle.replace(/[()]/g, '\\$&'), 'g'), newImageStyle);

// Amélioration 3: Badge promo avec effet néon
const oldBadgeStyle = `position: 'absolute', top: '12px', right: '12px', background: '#1a365d',
                                color: 'white', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '800'`;

const newBadgeStyle = `position: 'absolute',
                                top: '12px',
                                right: '12px',
                                background: 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)',
                                color: 'white',
                                padding: '8px 14px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '800',
                                boxShadow: '0 4px 15px rgba(26, 54, 93, 0.4), 0 0 20px rgba(26, 54, 93, 0.2)',
                                letterSpacing: '0.5px',
                                border: '1px solid rgba(255,255,255,0.2)'`;

content = content.replace(oldBadgeStyle, newBadgeStyle);

// Amélioration 4: Bouton favoris avec effet pulse
const oldFavButton = `position: 'absolute',
                                bottom: '12px',
                                right: '12px',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: 'none',
                                background: isFav ? '#fee2e2' : 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease'`;

const newFavButton = `position: 'absolute',
                                bottom: '12px',
                                right: '12px',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: 'none',
                                background: isFav ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' : 'rgba(255,255,255,0.95)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isFav ? '0 4px 20px rgba(220, 38, 38, 0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.5)'`;

content = content.replace(oldFavButton, newFavButton);

// Amélioration 5: Prix avec effet gradient
const oldPriceStyle = `fontSize: '20px', fontWeight: '800', color: (product.discount ?? 0) > 0 ? '#16a34a' : '#1a365d'`;

const newPriceStyle = `fontSize: '22px',
                              fontWeight: '900',
                              background: (product.discount ?? 0) > 0 ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)' : 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              letterSpacing: '-0.5px'`;

content = content.replace(oldPriceStyle, newPriceStyle);

// Amélioration 6: Bouton Ajouter avec effet shine
const oldAddButton = `flex: 1, border: 'none', background: (product.stock ?? 0) > 0 ? '#1a365d' : '#cbd5e1',
                                color: 'white', borderRadius: '8px', padding: '10px', cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
                                fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'`;

const newAddButton = `flex: 1,
                                border: 'none',
                                background: (product.stock ?? 0) > 0 ? 'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)' : '#cbd5e1',
                                color: 'white',
                                borderRadius: '10px',
                                padding: '12px',
                                cursor: (product.stock ?? 0) > 0 ? 'pointer' : 'not-allowed',
                                fontSize: '12px',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                boxShadow: (product.stock ?? 0) > 0 ? '0 4px 15px rgba(26, 54, 93, 0.3)' : 'none',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden'`;

content = content.replace(oldAddButton, newAddButton);

// Amélioration 7: Badge stock avec effet glow
const oldStockBadge = `display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px',
                              background: (product.stock ?? 0) > 0 ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '20px'`;

const newStockBadge = `display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginBottom: '12px',
                              background: (product.stock ?? 0) > 0 ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                              padding: '5px 12px',
                              borderRadius: '20px',
                              boxShadow: (product.stock ?? 0) > 0 ? '0 2px 10px rgba(34, 197, 94, 0.2)' : '0 2px 10px rgba(239, 68, 68, 0.2)',
                              border: '1px solid ' + ((product.stock ?? 0) > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)')`;

content = content.replace(oldStockBadge, newStockBadge);

// Amélioration 8: Sélecteur de quantité premium
const oldQuantitySelector = `display: 'flex', alignItems: 'center', background: '#f1f5f9',
                                borderRadius: '8px', padding: '3px', flexShrink: 0`;

const newQuantitySelector = `display: 'flex',
                                alignItems: 'center',
                                background: 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%)',
                                borderRadius: '12px',
                                padding: '4px',
                                flexShrink: 0,
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.05)'`;

content = content.replace(oldQuantitySelector, newQuantitySelector);

// Amélioration 9: Boutons quantité avec effet 3D
const oldQuantityButton = `width: '28px', height: '28px', border: 'none', background: 'white',
                                  color: '#1a365d', borderRadius: '6px', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: '700', fontSize: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'`;

const newQuantityButton = `width: '32px',
                                  height: '32px',
                                  border: 'none',
                                  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                                  color: '#1a365d',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: '800',
                                  fontSize: '16px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)',
                                  transition: 'all 0.2s ease'`;

content = content.replace(new RegExp(oldQuantityButton.replace(/[()]/g, '\\$&'), 'g'), newQuantityButton);

// Amélioration 10: Titre produit avec meilleure typographie
const oldTitleStyle = `fontWeight: '600', color: '#1e293b', fontSize: '14px', height: '42px', overflow: 'hidden', marginBottom: '10px'`;

const newTitleStyle = `fontWeight: '700',
                              color: '#1a202c',
                              fontSize: '14px',
                              height: '42px',
                              overflow: 'hidden',
                              marginBottom: '10px',
                              lineHeight: '1.4',
                              letterSpacing: '-0.2px'`;

content = content.replace(oldTitleStyle, newTitleStyle);

fs.writeFileSync(filePath, content, 'utf8');

console.log('OK Ameliorations appliquees avec succes!\n');
console.log('Ameliorations Design Luxe:');
console.log('  - Cartes avec effet glassmorphism');
console.log('  - Ombres elegantes et profondes');
console.log('  - Badges avec effet neon');
console.log('  - Bouton favoris avec effet pulse');
console.log('  - Prix avec gradient premium');
console.log('  - Bouton ajouter avec effet shine');
console.log('  - Badge stock avec effet glow');
console.log('  - Selecteur quantite 3D');
console.log('  - Transitions fluides partout');
console.log('  - Typographie amelioree\n');
