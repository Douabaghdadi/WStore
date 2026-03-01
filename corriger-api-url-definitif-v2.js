const fs = require('fs');
const path = require('path');

// Fonction pour corriger les fichiers
function fixApiUrl(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Supprimer les imports incorrects de API_URL
  if (content.includes("import { API_URL } from")) {
    content = content.replace(/import\s*{\s*API_URL\s*}\s*from\s*['"][^'"]+['"]\s*;?\s*\n?/g, '');
    modified = true;
  }

  // Vérifier si le fichier utilise API_URL
  if (content.includes('API_URL') && !content.includes('const API_URL')) {
    // Ajouter la définition de API_URL au début du fichier (après les imports)
    const lines = content.split('\n');
    let insertIndex = 0;
    let lastImportIndex = -1;
    
    // Trouver la dernière ligne d'import
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    // Insérer après le dernier import
    if (lastImportIndex >= 0) {
      insertIndex = lastImportIndex + 1;
      // Sauter les lignes vides après les imports
      while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
        insertIndex++;
      }
    }

    // Insérer la définition de API_URL
    const apiUrlDefinition = '\nconst API_URL = process.env.NEXT_PUBLIC_API_URL || "https://w-store.tn";\n';
    lines.splice(insertIndex, 0, apiUrlDefinition);
    content = lines.join('\n');
    modified = true;
  }

  // Supprimer les définitions dupliquées de API_URL
  const apiUrlRegex = /const API_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| "https:\/\/w-store\.tn";\s*\n?/g;
  const matches = content.match(apiUrlRegex);
  if (matches && matches.length > 1) {
    // Garder seulement la première occurrence
    let first = true;
    content = content.replace(apiUrlRegex, (match) => {
      if (first) {
        first = false;
        return match;
      }
      return '';
    });
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

  // Remplacer process.env.NEXT_PUBLIC_API_URL || 'https://w-store.tn' par API_URL
  if (content.includes("process.env.NEXT_PUBLIC_API_URL || 'https://w-store.tn'")) {
    content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL \|\| 'https:\/\/w-store\.tn'/g, 'API_URL');
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

console.log('🔧 Correction des URLs API (Version 2)...\n');
const count = walkDir('frontend/app');
console.log(`\n✅ ${count} fichiers corrigés!`);
