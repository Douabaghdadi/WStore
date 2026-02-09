const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles('frontend/app');
let count = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Remplacer fetch(' par fetch(`
    content = content.replace(/fetch\('\$\{/g, 'fetch(`${');
    
    // Remplacer les fins '} par `}
    content = content.replace(/(\$\{process\.env\.NEXT_PUBLIC_API_URL[^}]+\}[^']*?)'\)/g, '$1`)');
    
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
