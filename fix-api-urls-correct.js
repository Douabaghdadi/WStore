const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.next')) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else if (filePath.match(/\.(tsx?|jsx?)$/)) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Vérifier si le fichier contient des URLs mal formées
  if (content.includes('`${API_URL}/api/') && content.match(/`\$\{API_URL\}\/api\/[^`]*"/)) {
    console.log(`📝 Correction: ${path.relative(process.cwd(), filePath)}`);

    // Corriger les template literals mal formés
    // Pattern: `${API_URL}/api/something" -> `${API_URL}/api/something`
    content = content.replace(/`\$\{API_URL\}(\/api\/[^`"]*?)"/g, '`${API_URL}$1`');
    
    // Ajouter l'import si nécessaire
    if (!content.includes("from '@/lib/api'") && !content.includes('from "../lib/api"') && !content.includes('from "../../lib/api"')) {
      // Trouver la position après "use client" si présent
      const useClientMatch = content.match(/^"use client";\n/);
      if (useClientMatch) {
        content = content.replace(/^"use client";\n/, `"use client";\nimport { API_URL } from '@/lib/api';\n`);
      } else {
        // Ajouter au début
        content = `import { API_URL } from '@/lib/api';\n` + content;
      }
    }

    modified = true;
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

console.log('🔧 Correction des template literals mal formés...\n');

const frontendPath = path.join(__dirname, 'frontend', 'app');
const files = getAllFiles(frontendPath);

let count = 0;
files.forEach(file => {
  if (fixFile(file)) {
    count++;
  }
});

console.log(`\n✅ ${count} fichiers corrigés!`);
