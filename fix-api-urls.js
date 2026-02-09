const fs = require('fs');
const path = require('path');

const API_URL_REPLACEMENT = '${process.env.NEXT_PUBLIC_API_URL || "http://51.254.135.247:5000"}';

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Pattern 1: fetch('http://localhost:5000
    if (content.includes("fetch('http://localhost:5000")) {
      content = content.replace(/fetch\('http:\/\/localhost:5000/g, `fetch(\`${API_URL_REPLACEMENT}`);
      modified = true;
    }
    
    // Pattern 2: fetch("http://localhost:5000
    if (content.includes('fetch("http://localhost:5000')) {
      content = content.replace(/fetch\("http:\/\/localhost:5000/g, `fetch(\`${API_URL_REPLACEMENT}`);
      modified = true;
    }
    
    // Pattern 3: fetch(`http://localhost:5000
    if (content.includes('fetch(`http://localhost:5000')) {
      content = content.replace(/fetch\(`http:\/\/localhost:5000/g, `fetch(\`${API_URL_REPLACEMENT}`);
      modified = true;
    }
    
    // Pattern 4: src={`http://localhost:5000${
    if (content.includes('`http://localhost:5000${')) {
      content = content.replace(/`http:\/\/localhost:5000\$\{/g, `\`${API_URL_REPLACEMENT}\${`);
      modified = true;
    }
    
    // Pattern 5: : `http://localhost:5000${
    if (content.includes(': `http://localhost:5000${')) {
      content = content.replace(/: `http:\/\/localhost:5000\$\{/g, `: \`${API_URL_REPLACEMENT}\${`);
      modified = true;
    }
    
    // Pattern 6: ? product.image : `http://localhost:5000${
    if (content.includes('? product.image : `http://localhost:5000${')) {
      content = content.replace(/\? product\.image : `http:\/\/localhost:5000\$\{/g, `? product.image : \`${API_URL_REPLACEMENT}\${`);
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walkDir(filePath, callback);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      callback(filePath);
    }
  });
}

console.log('🔧 Fixing API URLs in all TypeScript files...\n');

let fixedCount = 0;
walkDir('./frontend/app', (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('localhost:5000')) {
    if (replaceInFile(filePath)) {
      fixedCount++;
    }
  }
});

console.log(`\n✅ Fixed ${fixedCount} files!`);
console.log('\n📦 Next steps:');
console.log('1. cd frontend');
console.log('2. npm run build');
console.log('3. Deploy to VPS');
