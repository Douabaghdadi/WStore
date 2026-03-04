const fs = require('fs');
const path = require('path');

console.log('Application des classes CSS luxe aux elements...\n');

const filePath = path.join(process.cwd(), 'frontend/app/(public)/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Ajouter className aux cartes produits
content = content.replace(
  /<div key=\{product\._id\} style=\{\{/g,
  '<div key={product._id} className="product-card-luxe" style={{'
);

// 2. Ajouter className au container d'image
content = content.replace(
  /<div style=\{\{ position: 'relative',\s+background: 'linear-gradient\(135deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%\)',/g,
  '<div className="product-image-container" style={{ position: \'relative\', background: \'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)\','
);

// 3. Ajouter className au badge promo
content = content.replace(
  /<span style=\{\{ position: 'absolute',\s+top: '12px',\s+right: '12px',\s+background: 'linear-gradient\(135deg, #1a365d 0%, #2d4a7c 100%\)',/g,
  '<span className="promo-badge-luxe" style={{ position: \'absolute\', top: \'12px\', right: \'12px\', background: \'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)\','
);

// 4. Ajouter className au bouton favoris
content = content.replace(
  /<button\s+onClick=\{\(e\) => \{\s+e\.preventDefault\(\);\s+if \(isFav\) \{\s+removeFavorite\(product\._id\);\s+\} else \{\s+addFavorite\(product\._id\);\s+\}\s+\}\}\s+style=\{\{/g,
  `<button
                              onClick={(e) => {
                                e.preventDefault();
                                if (isFav) {
                                  removeFavorite(product._id);
                                } else {
                                  addFavorite(product._id);
                                }
                              }}
                              className="fav-button-luxe"
                              style={{`
);

// 5. Ajouter className au badge stock
content = content.replace(
  /<div style=\{\{ display: 'inline-flex',\s+alignItems: 'center',\s+gap: '6px',\s+marginBottom: '12px',\s+background: \(product\.stock \?\? 0\) > 0 \? 'linear-gradient\(135deg, #dcfce7 0%, #bbf7d0 100%\)' : 'linear-gradient\(135deg, #fee2e2 0%, #fecaca 100%\)',/g,
  '<div className="stock-badge-luxe" style={{ display: \'inline-flex\', alignItems: \'center\', gap: \'6px\', marginBottom: \'12px\', background: (product.stock ?? 0) > 0 ? \'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)\' : \'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)\','
);

// 6. Ajouter className au prix
content = content.replace(
  /<span style=\{\{ fontSize: '22px',\s+fontWeight: '900',\s+background: \(product\.discount \?\? 0\) > 0 \? 'linear-gradient\(135deg, #16a34a 0%, #22c55e 100%\)' : 'linear-gradient\(135deg, #1a365d 0%, #2d4a7c 100%\)',/g,
  '<span className="price-gradient-luxe" style={{ fontSize: \'22px\', fontWeight: \'900\', background: (product.discount ?? 0) > 0 ? \'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)\' : \'linear-gradient(135deg, #1a365d 0%, #2d4a7c 100%)\','
);

// 7. Ajouter className aux boutons de quantité
content = content.replace(
  /<button onClick=\{\(\) => handleQuantityChange\(product\._id, -1\)\} style=\{\{/g,
  '<button onClick={() => handleQuantityChange(product._id, -1)} className="quantity-btn-luxe" style={{'
);

content = content.replace(
  /<button onClick=\{\(\) => handleQuantityChange\(product\._id, 1\)\} style=\{\{/g,
  '<button onClick={() => handleQuantityChange(product._id, 1)} className="quantity-btn-luxe" style={{'
);

// 8. Ajouter className au bouton ajouter
content = content.replace(
  /<button onClick=\{\(\) => handleAddToCart\(product\)\} disabled=\{\(product\.stock \?\? 0\) === 0\} style=\{\{/g,
  '<button onClick={() => handleAddToCart(product)} disabled={(product.stock ?? 0) === 0} className="add-cart-button-luxe" style={{'
);

// 9. Ajouter className aux carrousels
content = content.replace(
  /<div ref=\{accessoiresScrollRef\} style=\{\{ display: 'flex', gap: '20px', overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 5px' \}\}>/g,
  '<div ref={accessoiresScrollRef} className="carousel-scroll-luxe" style={{ display: \'flex\', gap: \'20px\', overflowX: \'auto\', scrollbarWidth: \'none\', padding: \'10px 5px\' }}>'
);

content = content.replace(
  /<div ref=\{smartphonesScrollRef\} style=\{\{ display: 'flex', gap: '20px', overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 5px' \}\}>/g,
  '<div ref={smartphonesScrollRef} className="carousel-scroll-luxe" style={{ display: \'flex\', gap: \'20px\', overflowX: \'auto\', scrollbarWidth: \'none\', padding: \'10px 5px\' }}>'
);

content = content.replace(
  /<div ref=\{nouveautesScrollRef\} style=\{\{ display: 'flex', gap: '20px', overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 5px' \}\}>/g,
  '<div ref={nouveautesScrollRef} className="carousel-scroll-luxe" style={{ display: \'flex\', gap: \'20px\', overflowX: \'auto\', scrollbarWidth: \'none\', padding: \'10px 5px\' }}>'
);

// 10. Ajouter className aux boutons de navigation carrousel
content = content.replace(
  /<button onClick=\{\(\) => scroll(Accessoires|Smartphones|Nouveautes)\('(left|right)'\)\} style=\{\{/g,
  (match, section, direction) => `<button onClick={() => scroll${section}('${direction}')} className="carousel-nav-btn" style={{`
);

fs.writeFileSync(filePath, content, 'utf8');

console.log('OK Classes CSS appliquees!\n');
console.log('Elements mis a jour:');
console.log('  - Cartes produits');
console.log('  - Containers images');
console.log('  - Badges promo');
console.log('  - Boutons favoris');
console.log('  - Badges stock');
console.log('  - Prix');
console.log('  - Boutons quantite');
console.log('  - Boutons ajouter');
console.log('  - Carrousels');
console.log('  - Boutons navigation\n');
