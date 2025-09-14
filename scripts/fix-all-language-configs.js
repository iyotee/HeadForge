const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'utils', 'language-configs.ts');

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Define comment styles for each language
const commentStyles = {
  javascript: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  typescript: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  python: { start: '#', end: '', line: '#', template: '# {{author}} - {{fileName}}' },
  java: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  csharp: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  cpp: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  c: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  go: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  rust: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  php: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  ruby: { start: '#', end: '', line: '#', template: '# {{author}} - {{fileName}}' },
  swift: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  kotlin: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  html: { start: '<!--', end: '-->', line: '*', template: '<!-- {{author}} - {{fileName}} -->' },
  css: { start: '/*', end: '*/', line: '*', template: '/* {{author}} - {{fileName}} */' },
  scss: { start: '/*', end: '*/', line: '*', template: '/* {{author}} - {{fileName}} */' },
  jsx: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  tsx: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  sql: { start: '/*', end: '*/', line: '*', template: '-- {{author}} - {{fileName}}' },
  bash: { start: '#', end: '', line: '#', template: '# {{author}} - {{fileName}}' },
  powershell: { start: '#', end: '', line: '#', template: '# {{author}} - {{fileName}}' },
  yaml: { start: '#', end: '', line: '#', template: '# {{author}} - {{fileName}}' },
  json: { start: '/*', end: '*/', line: '*', template: '// {{author}} - {{fileName}}' },
  xml: { start: '<!--', end: '-->', line: '*', template: '<!-- {{author}} - {{fileName}} -->' },
  markdown: { start: '<!--', end: '-->', line: '#', template: '<!-- {{author}} - {{fileName}} -->' }
};

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

// Fix each language configuration
Object.entries(commentStyles).forEach(([lang, style]) => {
  const category = categories[lang];
  
  // Create the complete language configuration
  const langConfig = `  ${lang}: {
    id: '${lang}',
    name: '${lang.charAt(0).toUpperCase() + lang.slice(1)}',
    extension: '.${lang === 'csharp' ? 'cs' : lang === 'cpp' ? 'cpp' : lang === 'c' ? 'c' : lang === 'tsx' ? 'tsx' : lang === 'jsx' ? 'jsx' : lang === 'scss' ? 'scss' : lang === 'yaml' ? 'yml' : lang === 'markdown' ? 'md' : lang === 'powershell' ? 'ps1' : lang === 'bash' ? 'sh' : lang}',
    commentStart: '${style.start}',
    commentEnd: '${style.end}',
    commentLine: '${style.line}',
    template: '${style.template}',
    templateComplete: \`${getTemplateComplete(lang, style)}\`,
    category: '${category}'
  }`;

  // Replace the language configuration in the content
  const langPattern = new RegExp(`\\s+${lang}:\\s*{[\\s\\S]*?\\s+},`, 'g');
  content = content.replace(langPattern, langConfig + ',');
});

// Helper function to generate templateComplete
function getTemplateComplete(lang, style) {
  if (lang === 'python') {
    return `"""
@author {{author}}
@fileName {{fileName}}
@projectName {{projectName}}
@version {{version}}
@description {{description}}
@created {{created}}
@updated {{updated}}
@license {{license}}
@status {{status}}
@usage {{usage}}
@dependencies {{dependencies}}
@notes {{notes}}
@todo {{todo}}
"""`;
  } else if (lang === 'ruby') {
    return `=begin
@author {{author}}
@fileName {{fileName}}
@projectName {{projectName}}
@version {{version}}
@description {{description}}
@created {{created}}
@updated {{updated}}
@license {{license}}
@status {{status}}
@usage {{usage}}
@dependencies {{dependencies}}
@notes {{notes}}
@todo {{todo}}
=end`;
  } else if (lang === 'bash') {
    return `#!/bin/bash
# @author {{author}}
# @fileName {{fileName}}
# @projectName {{projectName}}
# @version {{version}}
# @description {{description}}
# @created {{created}}
# @updated {{updated}}
# @license {{license}}
# @status {{status}}
# @usage {{usage}}
# @dependencies {{dependencies}}
# @notes {{notes}}
# @todo {{todo}}`;
  } else if (lang === 'powershell' || lang === 'yaml') {
    return `# @author {{author}}
# @fileName {{fileName}}
# @projectName {{projectName}}
# @version {{version}}
# @description {{description}}
# @created {{created}}
# @updated {{updated}}
# @license {{license}}
# @status {{status}}
# @usage {{usage}}
# @dependencies {{dependencies}}
# @notes {{notes}}
# @todo {{todo}}`;
  } else if (lang === 'html' || lang === 'xml' || lang === 'markdown') {
    return `<!--
@author {{author}}
@fileName {{fileName}}
@projectName {{projectName}}
@version {{version}}
@description {{description}}
@created {{created}}
@updated {{updated}}
@license {{license}}
@status {{status}}
@usage {{usage}}
@dependencies {{dependencies}}
@notes {{notes}}
@todo {{todo}}
-->`;
  } else {
    return `/**
 * @author {{author}}
 * @fileName {{fileName}}
 * @projectName {{projectName}}
 * @version {{version}}
 * @description {{description}}
 * @created {{created}}
 * @updated {{updated}}
 * @license {{license}}
 * @status {{status}}
 * @usage {{usage}}
 * @dependencies {{dependencies}}
 * @notes {{notes}}
 * @todo {{todo}}
 */`;
  }
}

// Write the file back
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ All language configurations fixed successfully!');
