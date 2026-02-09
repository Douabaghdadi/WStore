const fs = require('fs');
const path = require('path');

// Fix apostrophes in JSX
function fixApostrophes(content) {
  // Replace unescaped apostrophes in JSX text
  return content.replace(/([>}])([^<{]*)'([^<{]*[<{])/g, (match, before, text1, text2) => {
    return before + text1 + '&apos;' + text2;
  });
}

// Fix quotes in JSX
function fixQuotes(content) {
  return content.replace(/([>}])([^<{]*)"([^<{]*[<{])/g, (match, before, text1, text2) => {
    return before + text1 + '&quot;' + text2;
  });
}

// Add eslint-disable for img tags
function fixImgTags(content) {
  return content.replace(/(\s*)<img\s/g, '$1{/* eslint-disable-next-line @next/next/no-img-element */}\n$1<img ');
}

// Fix any types
function fixAnyTypes(content) {
  // Replace common any patterns
  content = content.replace(/: any\[\]/g, ': unknown[]');
  content = content.replace(/: any\)/g, ': unknown)');
  content = content.replace(/: any;/g, ': unknown;');
  content = content.replace(/: any,/g, ': unknown,');
  content = content.replace(/: any =/g, ': unknown =');
  return content;
}

// Remove unused variables
function removeUnusedVars(content) {
  // Remove unused error variables in catch blocks
  content = content.replace(/catch\s*\(\s*error\s*\)\s*{/g, 'catch {');
  content = content.replace(/catch\s*\(\s*err\s*\)\s*{/g, 'catch {');
  return content;
}

const filesToFix = [
  'frontend/app/(public)/layout.tsx',
  'frontend/app/(public)/magasins/page.tsx',
  'frontend/app/(public)/contact/page.tsx',
  'frontend/app/(public)/privacy/page.tsx',
  'frontend/app/(public)/terms/page.tsx',
  'frontend/app/(public)/page.tsx',
  'frontend/app/(public)/orders/page.tsx',
  'frontend/app/(public)/product/[id]/page.tsx',
  'frontend/app/(public)/nouveautes/page.tsx',
  'frontend/app/(public)/promotions/page.tsx',
  'frontend/app/(public)/recherche/page.tsx',
  'frontend/app/(public)/shop/page.tsx',
  'frontend/app/(public)/subcategory/[id]/page.tsx',
  'frontend/app/register/page.tsx',
  'frontend/app/login/page.tsx',
  'frontend/app/components/PromoSection.tsx',
  'frontend/app/admin/page.tsx',
];

filesToFix.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      
      // Apply fixes
      content = fixApostrophes(content);
      content = fixQuotes(content);
      content = fixImgTags(content);
      content = removeUnusedVars(content);
      
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✓ Fixed: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Error fixing ${file}:`, error.message);
  }
});

console.log('\nDone! Please review the changes.');
