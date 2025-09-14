import { HeaderData, ValidationResult } from '../types';
import { VALIDATION_LIMITS } from './constants';

export const ValidationUtils = {
  validateHeaderData,
  isValidVersion,
  isValidDate,
  isValidFileName,
  isValidUrl,
  isValidEmail,
  sanitizeInput,
  validateFormField,
  validateLanguage,
  validateLicense,
  validateStatus,
  getValidationSummary,
  formatValidationErrors,
  formatValidationWarnings
};

export function validateHeaderData(data: HeaderData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required field validation
  if (!data.fileName || data.fileName.trim() === '') {
    errors.push('File name is required');
  }

  if (!data.project || data.project.trim() === '') {
    errors.push('Project name is required');
  }

  if (!data.author || data.author.trim() === '') {
    errors.push('Author is required');
  }

  if (!data.version || data.version.trim() === '') {
    errors.push('Version is required');
  }

  if (!data.language || data.language.trim() === '') {
    errors.push('Language is required');
  }

  if (!data.license || data.license.trim() === '') {
    errors.push('License is required');
  }

  if (!data.status || data.status.trim() === '') {
    errors.push('Status is required');
  }


  // Length validation
  if (data.fileName && data.fileName.length > VALIDATION_LIMITS.MAX_FILENAME_LENGTH) {
    errors.push(`File name must be less than ${VALIDATION_LIMITS.MAX_FILENAME_LENGTH} characters`);
  }

  if (data.description && data.description.length > VALIDATION_LIMITS.MAX_DESCRIPTION_LENGTH) {
    errors.push(`Description must be less than ${VALIDATION_LIMITS.MAX_DESCRIPTION_LENGTH} characters`);
  }

  if (data.usage && data.usage.length > VALIDATION_LIMITS.MAX_USAGE_LENGTH) {
    errors.push(`Usage must be less than ${VALIDATION_LIMITS.MAX_USAGE_LENGTH} characters`);
  }

  if (data.notes && data.notes.length > VALIDATION_LIMITS.MAX_NOTES_LENGTH) {
    errors.push(`Notes must be less than ${VALIDATION_LIMITS.MAX_NOTES_LENGTH} characters`);
  }

  if (data.todo && data.todo.length > VALIDATION_LIMITS.MAX_TODO_LENGTH) {
    errors.push(`TODO must be less than ${VALIDATION_LIMITS.MAX_TODO_LENGTH} characters`);
  }

  if (data.dependencies && data.dependencies.length > VALIDATION_LIMITS.MAX_DEPENDENCIES_LENGTH) {
    errors.push(`Dependencies must be less than ${VALIDATION_LIMITS.MAX_DEPENDENCIES_LENGTH} characters`);
  }

  // Format validation
  if (data.version && !isValidVersion(data.version)) {
    errors.push('Version must follow semantic versioning (e.g., 1.0.0)');
  }

  if (data.creationDate && !isValidDate(data.creationDate)) {
    errors.push('Creation date must be in YYYY-MM-DD format');
  }

  if (data.lastUpdated && !isValidDate(data.lastUpdated)) {
    errors.push('Last updated date must be in YYYY-MM-DD format');
  }

  // File name validation
  if (data.fileName && !isValidFileName(data.fileName)) {
    errors.push('File name contains invalid characters');
  }

  // Warning validations
  if (data.fileName && !data.fileName.includes('.')) {
    warnings.push('File name should include an extension');
  }

  if (data.version && data.version.startsWith('0.')) {
    warnings.push('Version 0.x indicates development version');
  }

  if (data.status === 'Deprecated') {
    warnings.push('Status is set to deprecated');
  }


  if (data.description && data.description.length < 10) {
    warnings.push('Description is very short');
  }

  if (data.usage && data.usage.length < 10) {
    warnings.push('Usage instructions are very short');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function isValidVersion(version: string): boolean {
  // Semantic versioning pattern: major.minor.patch[-prerelease][+build]
  const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
  return versionPattern.test(version);
}

export function isValidDate(dateString: string): boolean {
  // Check if date is in YYYY-MM-DD format
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) {
    return false;
  }

  // Check if date is valid
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export function isValidFileName(fileName: string): boolean {
  // Check for invalid characters in file names
  const invalidChars = /[<>:"/\\|?*]/;
  return !invalidChars.test(fileName);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

export function validateFormField(
  value: string,
  fieldName: string,
  required: boolean = false,
  minLength: number = 0,
  maxLength: number = Infinity,
  pattern?: RegExp
): { isValid: boolean; error?: string } {
  // Required validation
  if (required && (!value || value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  // Skip other validations if value is empty and not required
  if (!value || value.trim() === '') {
    return { isValid: true };
  }

  // Length validation
  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  if (value.length > maxLength) {
    return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }

  // Pattern validation
  if (pattern && !pattern.test(value)) {
    return { isValid: false, error: `${fieldName} format is invalid` };
  }

  return { isValid: true };
}

export function validateLanguage(language: string): boolean {
  const validLanguages = [
    'javascript', 'typescript', 'html', 'css', 'scss', 'jsx', 'tsx', 'vue',
    'python', 'java', 'csharp', 'cpp', 'go', 'rust', 'php', 'ruby',
    'sql', 'graphql', 'dockerfile', 'yaml', 'json', 'bash', 'powershell',
    'r', 'lua', 'perl', 'haskell'
  ];
  
  return validLanguages.includes(language);
}

export function validateLicense(license: string): boolean {
  const validLicenses = [
    'MIT', 'GPL-3.0', 'Apache-2.0', 'BSD-3-Clause', 'ISC', 'Unlicense', 'Custom'
  ];
  
  return validLicenses.includes(license);
}

export function validateStatus(status: string): boolean {
  const validStatuses = [
    'Development', 'Stable', 'Beta', 'Deprecated', 'Maintenance'
  ];
  
  return validStatuses.includes(status);
}


export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return 'All validations passed';
  }
  
  const parts: string[] = [];
  
  if (result.errors.length > 0) {
    parts.push(`${result.errors.length} error(s)`);
  }
  
  if (result.warnings.length > 0) {
    parts.push(`${result.warnings.length} warning(s)`);
  }
  
  return parts.join(', ');
}

export function formatValidationErrors(errors: string[]): string {
  return errors.map((error, index) => `${index + 1}. ${error}`).join('\n');
}

export function formatValidationWarnings(warnings: string[]): string {
  return warnings.map((warning, index) => `${index + 1}. ${warning}`).join('\n');
}




