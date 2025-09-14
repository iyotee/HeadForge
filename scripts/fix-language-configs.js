const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'utils', 'language-configs.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Define categories for each language
const categories = {
  javascript: 'web',
  typescript: 'web',
  python: 'backend',
  java: 'backend',
  csharp: 'backend',
  cpp: 'backend',
  c: 'backend',
  go: 'backend',
  rust: 'backend',
  php: 'backend',
  ruby: 'backend',
  swift: 'mobile',
  kotlin: 'mobile',
  html: 'web',
  css: 'web',
  scss: 'web',
  jsx: 'web',
  tsx: 'web',
  sql: 'database',
  bash: 'devops',
  powershell: 'devops',
  yaml: 'devops',
  json: 'other',
  xml: 'other',
  markdown: 'other'
};

// Add categories to each language
Object.entries(categories).forEach(([lang, category]) => {
  // Find the language block and add category before the closing brace
  const langPattern = new RegExp(`(\\s+${lang}:\\s*{[\\s\\S]*?)(\\s+}\\s*,)`, 'g');
  content = content.replace(langPattern, (match, langBlock, closing) => {
    // Check if category is already present
    if (langBlock.includes('category:')) {
      return match;
    }
    
    // Add category before the closing brace
    return langBlock + `\n    category: '${category}'` + closing;
  });
});

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Language categories added successfully!');
