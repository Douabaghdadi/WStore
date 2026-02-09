import os
import re

def fix_template_literals(file_path):
    """Corrige les template literals dans un fichier"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Remplacer fetch(" par fetch(`
        content = re.sub(r'fetch\("\$\{', r'fetch(`${', content)
        
        # Remplacer les fins de template mal fermées
        # Pattern: ${...}...") par ${...}...`)
        content = re.sub(r'(\$\{process\.env\.NEXT_PUBLIC_API_URL[^}]+\}[^"]*?)"\)', r'\1`)', content)
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Erreur avec {file_path}: {e}")
        return False

def find_and_fix_tsx_files(root_dir):
    """Trouve et corrige tous les fichiers .tsx"""
    fixed_count = 0
    
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                file_path = os.path.join(root, file)
                if fix_template_literals(file_path):
                    print(f"✓ Corrigé: {file_path}")
                    fixed_count += 1
    
    return fixed_count

if __name__ == "__main__":
    frontend_dir = "frontend/app"
    print(f"Recherche et correction des fichiers dans {frontend_dir}...")
    count = find_and_fix_tsx_files(frontend_dir)
    print(f"\n✅ {count} fichiers corrigés!")
