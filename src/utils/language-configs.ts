import { LanguageConfig } from '@/types';

export interface LanguageConfigs {
  [key: string]: LanguageConfig;
}

export const languageConfigs: LanguageConfigs = {
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    extension: '.js',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'web'
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    extension: '.ts',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'web'
  },
  python: {
    id: 'python',
    name: 'Python',
    extension: '.py',
    commentStart: '#',
    commentEnd: '',
    commentLine: '#',
    template: '# {{author}} - {{fileName}}',
    templateComplete: `"""
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
"""`,
    category: 'backend'
  },
  java: {
    id: 'java',
    name: 'Java',
    extension: '.java',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'backend'
  },
  csharp: {
    id: 'csharp',
    name: 'C#',
    extension: '.cs',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'backend'
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    extension: '.cpp',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'backend'
  },
  c: {
    id: 'c',
    name: 'C',
    extension: '.c',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'backend'
  },
  go: {
    id: 'go',
    name: 'Go',
    extension: '.go',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'backend'
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    extension: '.rs',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'backend'
  },
  php: {
    id: 'php',
    name: 'PHP',
    extension: '.php',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'backend'
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby',
    extension: '.rb',
    commentStart: '#',
    commentEnd: '',
    commentLine: '#',
    template: '# {{author}} - {{fileName}}',
    templateComplete: `=begin
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
=end`,
    category: 'backend'
  },
  swift: {
    id: 'swift',
    name: 'Swift',
    extension: '.swift',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'mobile'
  },
  kotlin: {
    id: 'kotlin',
    name: 'Kotlin',
    extension: '.kt',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'mobile'
  },
  html: {
    id: 'html',
    name: 'HTML',
    extension: '.html',
    commentStart: '<!--',
    commentEnd: '-->',
    commentLine: '*',
    template: '<!-- {{author}} - {{fileName}} -->',
    templateComplete: `<!--
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
-->`,
    category: 'web'
  },
  css: {
    id: 'css',
    name: 'CSS',
    extension: '.css',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '/* {{author}} - {{fileName}} */',
    templateComplete: `/**
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
 */`,
    category: 'web'
  },
  scss: {
    id: 'scss',
    name: 'SCSS',
    extension: '.scss',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '/* {{author}} - {{fileName}} */',
    templateComplete: `/**
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
 */`,
    category: 'web'
  },
  jsx: {
    id: 'jsx',
    name: 'JSX',
    extension: '.jsx',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'web'
  },
  tsx: {
    id: 'tsx',
    name: 'TSX',
    extension: '.tsx',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'web'
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    extension: '.sql',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '-- {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'database'
  },
  bash: {
    id: 'bash',
    name: 'Bash',
    extension: '.sh',
    commentStart: '#',
    commentEnd: '',
    commentLine: '#',
    template: '# {{author}} - {{fileName}}',
    templateComplete: `#!/bin/bash
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
# @todo {{todo}}`,
    category: 'devops'
  },
  powershell: {
    id: 'powershell',
    name: 'PowerShell',
    extension: '.ps1',
    commentStart: '#',
    commentEnd: '',
    commentLine: '#',
    template: '# {{author}} - {{fileName}}',
    templateComplete: `# @author {{author}}
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
# @todo {{todo}}`,
    category: 'devops'
  },
  yaml: {
    id: 'yaml',
    name: 'YAML',
    extension: '.yml',
    commentStart: '#',
    commentEnd: '',
    commentLine: '#',
    template: '# {{author}} - {{fileName}}',
    templateComplete: `# @author {{author}}
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
# @todo {{todo}}`,
    category: 'devops'
  },
  json: {
    id: 'json',
    name: 'JSON',
    extension: '.json',
    commentStart: '/*',
    commentEnd: '*/',
    commentLine: '*',
    template: '// {{author}} - {{fileName}}',
    templateComplete: `/**
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
 */`,
    category: 'other'
  },
  xml: {
    id: 'xml',
    name: 'XML',
    extension: '.xml',
    commentStart: '<!--',
    commentEnd: '-->',
    commentLine: '*',
    template: '<!-- {{author}} - {{fileName}} -->',
    templateComplete: `<!--
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
-->`,
    category: 'other'
  },
  markdown: {
    id: 'markdown',
    name: 'Markdown',
    extension: '.md',
    commentStart: '<!--',
    commentEnd: '-->',
    commentLine: '#',
    template: '<!-- {{author}} - {{fileName}} -->',
    templateComplete: `<!--
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
-->`,
    category: 'other'
  }
};

export function getLanguageById(id: string): LanguageConfig | null {
  return languageConfigs[id] || null;
}

export function getAllLanguages(): LanguageConfig[] {
  return Object.values(languageConfigs);
}

export function getLanguageByExtension(extension: string): LanguageConfig | null {
  return Object.values(languageConfigs).find(lang => lang.extension === extension) || null;
}

export function searchLanguages(query: string): LanguageConfig[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(languageConfigs).filter(lang => 
    lang.name.toLowerCase().includes(lowerQuery) ||
    lang.id.toLowerCase().includes(lowerQuery) ||
    lang.extension.toLowerCase().includes(lowerQuery)
  );
}