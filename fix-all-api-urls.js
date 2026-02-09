const fs = require('fs');
const path = require('path');

const API_URL_IMPORT = `import { API_URL } from '@/lib/api';\n`;

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

  // Vérifier si le fichier contient localhost:5000
  if (content.includes('localhost:5000')) {
    console.log(`📝 Correction: ${path.relative(process.cwd(), filePath)}`);

    // Remplacer toutes les occurrences
    const patterns = [
      { from: /"http:\/\/localhost:5000/g, to: '`${API_URL}' },
      { from: /'http:\/\/localhost:5000/g, to: '`${API_URL}' },
      { from: /`http:\/\/localhost:5000/g, to: '`${API_URL}' },
    ];

    patterns.forEach(({ from, to }) => {
      if (content.match(from)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    // Ajouter l'import si nécessaire et si modifié
    if (modified && !content.includes("from '@/lib/api'") && !content.includes('from "../lib/api"')) {
      // Trouver la position après les imports existants
      const importMatch = content.match(/^(import .+;\n)+/m);
      if (importMatch) {
        const lastImportEnd = importMatch[0].length;
        content = content.slice(0, lastImportEnd) + API_URL_IMPORT + content.slice(lastImportEnd);
      } else {
        // Ajouter au début si pas d'imports
        const useClientMatch = content.match(/^"use client";\n/);
        if (useClientMatch) {
          content = content.replace(/^"use client";\n/, `"use client";\n${API_URL_IMPORT}`);
        } else {
          content = API_URL_IMPORT + content;
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
  }

  return false;
}

console.log('🔧 Correction des URLs API...\n');

const frontendPath = path.join(__dirname, 'frontend', 'app');
const files = getAllFiles(frontendPath);

let count = 0;
files.forEach(file => {
  if (fixFile(file)) {
    count++;
  }
});

console.log(`\n✅ ${count} fichiers corrigés!`);
console.log('\n📦 Prochaines étapes:');
console.log('1. cd frontend');
console.log('2. npm run build');
console.log('3. Déployer sur le VPS');
