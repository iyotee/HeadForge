export const FileUtils = {
  saveFile,
  saveFileAsBlob,
  readFile,
  getFileExtension,
  isValidFileName,
  sanitizeFileName,
  createBlob,
  downloadBlob,
  getFileSize,
  formatFileSize
};

export function saveFile(content: string, filename: string): void {
  try {
    // Create a blob with the content
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to save file:', error);
    throw new Error('Failed to save file');
  }
}

export function saveFileAsBlob(blob: Blob, filename: string): void {
  try {
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to save file:', error);
    throw new Error('Failed to save file');
  }
}

export function saveJsonFile(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  saveFileAsBlob(blob, filename);
}

export function saveCsvFile(data: any[], filename: string): void {
  if (data.length === 0) {
    throw new Error('No data to export');
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  saveFileAsBlob(blob, filename);
}

export function saveHtmlFile(html: string, filename: string): void {
  const blob = new Blob([html], { type: 'text/html' });
  saveFileAsBlob(blob, filename);
}

export function saveMarkdownFile(markdown: string, filename: string): void {
  const blob = new Blob([markdown], { type: 'text/markdown' });
  saveFileAsBlob(blob, filename);
}

export function saveXmlFile(xml: string, filename: string): void {
  const blob = new Blob([xml], { type: 'application/xml' });
  saveFileAsBlob(blob, filename);
}

export function saveYamlFile(yaml: string, filename: string): void {
  const blob = new Blob([yaml], { type: 'text/yaml' });
  saveFileAsBlob(blob, filename);
}

export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result instanceof ArrayBuffer) {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as ArrayBuffer'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as DataURL'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

export function createFileInput(
  accept: string = '*/*',
  multiple: boolean = false
): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.multiple = multiple;
  input.style.display = 'none';
  
  return input;
}

export function selectFile(
  accept: string = '*/*',
  multiple: boolean = false
): Promise<FileList | null> {
  return new Promise((resolve) => {
    const input = createFileInput(accept, multiple);
    
    input.addEventListener('change', () => {
      resolve(input.files);
    });
    
    input.addEventListener('cancel', () => {
      resolve(null);
    });
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
}

export function selectTextFile(): Promise<File | null> {
  return selectFile('text/*', false).then(files => files?.[0] || null);
}

export function selectJsonFile(): Promise<File | null> {
  return selectFile('application/json', false).then(files => files?.[0] || null);
}

export function selectImageFile(): Promise<File | null> {
  return selectFile('image/*', false).then(files => files?.[0] || null);
}

export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1).toLowerCase() : '';
}

export function getFileNameWithoutExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
}

export function getFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function getFileType(filename: string): string {
  const extension = getFileExtension(filename);
  
  const typeMap: Record<string, string> = {
    // Text files
    'txt': 'text/plain',
    'md': 'text/markdown',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'ts': 'text/typescript',
    'json': 'application/json',
    'xml': 'application/xml',
    'csv': 'text/csv',
    'yaml': 'text/yaml',
    'yml': 'text/yaml',
    
    // Code files
    'py': 'text/x-python',
    'java': 'text/x-java',
    'cpp': 'text/x-c++',
    'c': 'text/x-c',
    'cs': 'text/x-csharp',
    'php': 'text/x-php',
    'rb': 'text/x-ruby',
    'go': 'text/x-go',
    'rs': 'text/x-rust',
    'sql': 'text/x-sql',
    
    // Image files
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
    
    // Archive files
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip'
  };
  
  return typeMap[extension] || 'application/octet-stream';
}

export function isValidFileName(filename: string): boolean {
  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(filename)) {
    return false;
  }
  
  // Check for reserved names (Windows)
  const reservedNames = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
    'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
  ];
  
  const nameWithoutExt = getFileNameWithoutExtension(filename).toUpperCase();
  if (reservedNames.includes(nameWithoutExt)) {
    return false;
  }
  
  // Check length
  if (filename.length > 255) {
    return false;
  }
  
  return true;
}

export function sanitizeFileName(filename: string): string {
  // Remove invalid characters
  let sanitized = filename.replace(/[<>:"/\\|?*]/g, '');
  
  // Remove leading/trailing spaces and dots
  sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');
  
  // Replace multiple spaces with single space
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  // Limit length
  if (sanitized.length > 255) {
    const extension = getFileExtension(filename);
    const nameWithoutExt = getFileNameWithoutExtension(sanitized);
    const maxNameLength = 255 - extension.length - 1; // -1 for the dot
    sanitized = nameWithoutExt.substring(0, maxNameLength) + '.' + extension;
  }
  
  return sanitized;
}

export function generateUniqueFileName(filename: string): string {
  const extension = getFileExtension(filename);
  const nameWithoutExt = getFileNameWithoutExtension(filename);
  
  let counter = 1;
  let newFilename = filename;
  
  while (counter < 1000) { // Prevent infinite loop
    newFilename = `${nameWithoutExt}_${counter}.${extension}`;
    counter++;
    
    // In a real application, you would check if the file exists
    // For now, we'll just return the generated name
    break;
  }
  
  return newFilename;
}

export function createBlob(content: string, type: string = 'text/plain'): Blob {
  return new Blob([content], { type });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}