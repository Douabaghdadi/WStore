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
  
  // Vérifier si le fichier utilise useSearchParams et n'a pas déjà Suspense dans export default
  if (content.includes('useSearchParams') && 
      content.includes('export default function') &&
      !content.match(/export default function \w+\(\) \{[\s\S]*?<Suspense/)) {
    
    console.log(`📝 Ajout Suspense: ${path.relative(process.cwd(), filePath)}`);
    
    // Ajouter Suspense à l'import si nécessaire
    if (!content.includes('Suspense')) {
      content = content.replace(
        /from ['"]react['"]/,
        (match) => {
          if (content.match(/import \{[^}]*\} from ['"]react['"]/)) {
            return match.replace(/\{([^}]*)\}/, (m, imports) => {
              return `{ ${imports.trim()}, Suspense }`;
            });
          }
          return match;
        }
      );
    }
    
    // Trouver le nom de la fonction export default
    const exportMatch = content.match(/export default function (\w+)\(\)/);
    if (!exportMatch) return false;
    
    const functionName = exportMatch[1];
    const contentFunctionName = functionName.replace('Page', 'Content');
    
    // Remplacer export default function par function
    content = content.replace(
      `export default function ${functionName}()`,
      `function ${contentFunctionName}()`
    );
    
    // Ajouter export default avec Suspense à la fin
    content += `\n\nexport default function ${functionName}() {
  return (
    <Suspense fallback={
      <div style={{ marginTop: "160px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner-border" style={{ color: "#c53030" }} role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    }>
      <${contentFunctionName} />
    </Suspense>
  );
}\n`;
    
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

console.log('🔧 Ajout de Suspense aux pages avec useSearchParams...\n');

const frontendPath = path.join(__dirname, 'frontend', 'app');
const files = getAllFiles(frontendPath);

let count = 0;
files.forEach(file => {
  if (fixFile(file)) {
    count++;
  }
});

console.log(`\n✅ ${count} fichiers modifiés!`);
