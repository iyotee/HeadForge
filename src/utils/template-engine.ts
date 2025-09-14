import { HeaderData, LanguageConfig, TemplateVariables } from '../types';


export const templateEngine = {
  generateHeader,
  formatTemplate,
  validateTemplate,
  extractVariables
};

export function generateHeader(data: HeaderData, languageConfig: LanguageConfig): string {
  // Create template variables
  const variables: TemplateVariables = {
    fileName: data.fileName,
    project: data.project,
    author: data.author,
    creationDate: data.creationDate,
    lastUpdated: data.lastUpdated,
    version: data.version,
    description: data.description,
    dependencies: data.dependencies,
    license: data.license,
    status: data.status,
    language: data.language,
    usage: data.usage,
    notes: data.notes,
    todo: data.todo,
    commentLine: languageConfig.commentLine
  };

  // Choose template based on header type
  let template = languageConfig.template;
  if (data.headerType === 'complete') {
    if (languageConfig.templateComplete) {
      template = languageConfig.templateComplete;
    } else {
      // Generate a complete template if none exists
      template = generateCompleteTemplate(languageConfig);
    }
  }
  
  // Replace template variables
  let header = template;
  
  // Replace all {{variable}} placeholders
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    header = header.replace(new RegExp(placeholder, 'g'), value || '');
  });

  // Remove lines with empty values (except commentLine)
  header = removeEmptyLines(header);

  // Clean up empty lines and format
  header = formatHeader(header, languageConfig);

  return header;
}

function removeEmptyLines(header: string): string {
  const lines = header.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmedLine = line.trim();
    // Keep the line if it's not empty and doesn't end with just a colon (empty field)
    // Also remove lines that end with just a field name without value (like "@dependencies ")
    return trimmedLine !== '' && 
           !trimmedLine.match(/:\s*$/) && 
           !trimmedLine.match(/@\w+\s*$/);
  });
  
  return filteredLines.join('\n');
}

function formatHeader(header: string, languageConfig: LanguageConfig): string {
  const lines = header.split('\n');
  const formattedLines: string[] = [];
  
  let inCommentBlock = false;
  let commentStartFound = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const trimmedLine = line.trim();
    
    // Check if we're starting a comment block
    if (trimmedLine.includes(languageConfig.commentStart) && !commentStartFound) {
      inCommentBlock = true;
      commentStartFound = true;
    }
    
    // Check if we're ending a comment block
    if (trimmedLine.includes(languageConfig.commentEnd || '') && inCommentBlock) {
      inCommentBlock = false;
    }
    
    // Skip empty lines in comment blocks
    if (inCommentBlock && trimmedLine === '') {
      continue;
    }
    
    // Add the line
    formattedLines.push(line);
  }
  
  return formattedLines.join('\n');
}

export function validateTemplate(template: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for balanced comment markers
  const commentStartCount = (template.match(/\{\{commentStart\}\}/g) || []).length;
  const commentEndCount = (template.match(/\{\{commentEnd\}\}/g) || []).length;
  
  if (commentStartCount !== commentEndCount) {
    errors.push('Unbalanced comment markers');
  }
  
  // Check for required variables
  const requiredVariables = [
    'fileName',
    'project',
    'author',
    'version'
  ];
  
  requiredVariables.forEach(variable => {
    if (!template.includes(`{{${variable}}}`)) {
      errors.push(`Missing required variable: ${variable}`);
    }
  });
  
  // Check for invalid variables
  const validVariables = [
    'fileName', 'project', 'author', 'creationDate', 'lastUpdated',
    'version', 'description', 'dependencies', 'license', 'status',
    'language', 'usage', 'notes', 'todo'
  ];
  
  const variableMatches = template.match(/\{\{([^}]+)\}\}/g) || [];
  variableMatches.forEach(match => {
    const variable = match.replace(/\{\{|\}\}/g, '');
    if (!validVariables.includes(variable)) {
      errors.push(`Invalid variable: ${variable}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}


export function createCustomTemplate(
  languageConfig: LanguageConfig,
  variables: string[]
): string {
  let template = '';
  
  // Start comment block
  if (languageConfig.commentStart) {
    template += languageConfig.commentStart + '\n';
  }
  
  // Add variables
  variables.forEach(variable => {
    if (languageConfig.commentLine) {
      template += `${languageConfig.commentLine} {{${variable}}}\n`;
    }
  });
  
  // End comment block
  if (languageConfig.commentEnd) {
    template += languageConfig.commentEnd;
  }
  
  return template;
}

export function formatCommentBlock(
  content: string,
  languageConfig: LanguageConfig,
  maxWidth: number = 80
): string {
  const lines = content.split('\n');
  const formattedLines: string[] = [];
  
  // Start comment block
  if (languageConfig.commentStart) {
    formattedLines.push(languageConfig.commentStart);
  }
  
  // Format each line
  lines.forEach(line => {
    if (line.trim() === '') {
      formattedLines.push('');
      return;
    }
    
    // Wrap long lines
    const wrappedLines = wrapLine(line, maxWidth);
    wrappedLines.forEach(wrappedLine => {
      if (languageConfig.commentLine) {
        formattedLines.push(`${languageConfig.commentLine} ${wrappedLine}`);
      } else {
        formattedLines.push(wrappedLine);
      }
    });
  });
  
  // End comment block
  if (languageConfig.commentEnd) {
    formattedLines.push(languageConfig.commentEnd);
  }
  
  return formattedLines.join('\n');
}

function wrapLine(line: string, maxWidth: number): string[] {
  if (line.length <= maxWidth) {
    return [line];
  }
  
  const words = line.split(' ');
  const wrappedLines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if (currentLine.length + word.length + 1 <= maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        wrappedLines.push(currentLine);
      }
      currentLine = word;
    }
  });
  
  if (currentLine) {
    wrappedLines.push(currentLine);
  }
  
  return wrappedLines;
}

export function generateHeaderPreview(
  data: HeaderData,
  languageConfig: LanguageConfig,
  maxLines: number = 20
): string {
  const fullHeader = generateHeader(data, languageConfig);
  const lines = fullHeader.split('\n');
  
  if (lines.length <= maxLines) {
    return fullHeader;
  }
  
  const previewLines = lines.slice(0, maxLines);
  previewLines.push('... (truncated)');
  
  return previewLines.join('\n');
}

export function getHeaderStatistics(header: string): {
  lineCount: number;
  characterCount: number;
  wordCount: number;
  commentLineCount: number;
} {
  const lines = header.split('\n');
  const lineCount = lines.length;
  const characterCount = header.length;
  const wordCount = header.split(/\s+/).filter(word => word.length > 0).length;
  const commentLineCount = lines.filter(line => 
    line.trim().startsWith('//') || 
    line.trim().startsWith('#') || 
    line.trim().startsWith('--') ||
    line.trim().startsWith('/*') ||
    line.trim().startsWith('<!--')
  ).length;
  
  return {
    lineCount,
    characterCount,
    wordCount,
    commentLineCount
  };
}

export function formatTemplate(template: string, variables: Record<string, string>): string {
  let formatted = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    formatted = formatted.replace(new RegExp(placeholder, 'g'), value ?? '');
  });
  
  return formatted;
}

export function extractVariables(template: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = regex.exec(template)) !== null) {
    if (match[1] && !variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
}

function generateCompleteTemplate(languageConfig: LanguageConfig): string {
  const { commentLine } = languageConfig;
  
  // Determine the border character and format based on comment style
  let borderChar = '*';
  let topBorder = '';
  let bottomBorder = '';
  
  if (commentLine === '#') {
    // Python style
    borderChar = '#';
    topBorder = `"""${borderChar.repeat(60)}"""`;
    bottomBorder = `"""${borderChar.repeat(60)}"""`;
  } else if (commentLine === '--') {
    // SQL style
    borderChar = '-';
    topBorder = `/*${borderChar.repeat(60)}*/`;
    bottomBorder = `/*${borderChar.repeat(60)}*/`;
  } else if (commentLine === '<!--') {
    // HTML style
    borderChar = '-';
    topBorder = `<!${borderChar.repeat(60)}>`;
    bottomBorder = `<!${borderChar.repeat(60)}>`;
  } else {
    // Default C/Java/JavaScript style
    borderChar = '*';
    topBorder = `/*${borderChar.repeat(60)}*/`;
    bottomBorder = `/*${borderChar.repeat(60)}*/`;
  }
  
  let template = '';
  
  // Add decorative header with borders
  template += `${topBorder}\n`;
  template += `${commentLine} @author {{author}}\n`;
  template += `${commentLine} @fileName {{fileName}}\n`;
  template += `${commentLine} @projectName {{project}}\n`;
  template += `${commentLine} @version {{version}}\n`;
  template += `${commentLine} @description {{description}}\n`;
  template += `${commentLine} @created {{creationDate}}\n`;
  template += `${commentLine} @updated {{lastUpdated}}\n`;
  template += `${commentLine} @license {{license}}\n`;
  template += `${commentLine} @status {{status}}\n`;
  template += `${commentLine} @usage {{usage}}\n`;
  template += `${commentLine} @dependencies {{dependencies}}\n`;
  template += `${commentLine} @notes {{notes}}\n`;
  template += `${commentLine} @todo {{todo}}\n`;
  template += `${bottomBorder}`;
  
  return template;
}