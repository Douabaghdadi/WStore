const fs = require('fs');
const path = require('path');

const files = [
  'frontend/app/admin/brands/new/page.tsx',
  'frontend/app/admin/brands/page.tsx',
  'frontend/app/admin/categories/new/page.tsx',
  'frontend/app/admin/categories/page.tsx',
  'frontend/app/admin/messages/page.tsx',
  'frontend/app/admin/orders/page.tsx',
  'frontend/app/admin/page.tsx',
  'frontend/app/admin/products/[id]/page.tsx',
  'frontend/app/admin/products/new/page.tsx',
  'frontend/app/admin/products/page.tsx',
  'frontend/app/admin/search/page.tsx',
  'frontend/app/admin/subcategories/[id]/page.tsx',
  'frontend/app/admin/subcategories/new/page.tsx',
  'frontend/app/admin/subcategories/page.tsx',
  'frontend/app/admin/users/new/page.tsx',
  'frontend/app/admin/users/page.tsx',
  'frontend/app/client/favorites/page.tsx',
  'frontend/app/client/orders/page.tsx',
  'frontend/app/client/page.tsx',
  'frontend/app/client/profile/page.tsx',
  'frontend/app/components/ProductReviews.tsx',
  'frontend/app/forgot-password/page.tsx',
  'frontend/app/login/page.tsx',
  'frontend/app/register/page.tsx',
  'frontend/app/reset-password/page.tsx'
];

let count = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Remplacer tous les fetch(" par fetch(`
    content = content.replace(/fetch\("\$/g, 'fetch(`$');
    
    // Remplacer toutes les fins "} par `}
    content = content.replace(/(\$\{process\.env\.NEXT_PUBLIC_API_URL[^}]+\}[^"]*?)"\)/g, '$1`)');
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✓ Corrigé: ${file}`);
      count++;
    }
  } catch (err) {
    console.error(`✗ Erreur avec ${file}:`, err.message);
  }
});

console.log(`\n✅ ${count} fichiers corrigés!`);
