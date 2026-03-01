const fs = require('fs');
const path = require('path');

// Fonction pour corriger les fichiers
function fixApiUrl(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Vérifier si le fichier utilise déjà API_URL
  if (content.includes('API_URL') && !content.includes('const API_URL')) {
    // Ajouter la définition de API_URL au début du fichier (après les imports)
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Trouver la fin des imports
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') || lines[i].startsWith('import{') || lines[i].startsWith('import{')) {
        insertIndex = i + 1;
      } else if (insertIndex > 0 && lines[i].trim() === '') {
        break;
      }
    }

    // Insérer la définition de API_URL
    const apiUrlDefinition = '\nconst API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";\n';
    lines.splice(insertIndex, 0, apiUrlDefinition);
    content = lines.join('\n');
    modified = true;
  }

  // Remplacer les références à localhost
  if (content.includes('localhost:5000')) {
    content = content.replace(/localhost:5000/g, 'w-store.tn');
    modified = true;
  }

  if (content.includes('http://localhost')) {
    content = content.replace(/http:\/\/localhost:\d+/g, 'https://w-store.tn');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigé: ${filePath}`);
    return true;
  }
  return false;
}

// Parcourir tous les fichiers TypeScript/JavaScript dans frontend/app
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += walkDir(filePath);
    } else if (file.match(/\.(tsx?|jsx?)$/)) {
      if (fixApiUrl(filePath)) {
        count++;
      }
    }
  });

  return count;
}

console.log('🔧 Correction des URLs API...\n');
const count = walkDir('frontend/app');
console.log(`\n✅ ${count} fichiers corrigés!`);
