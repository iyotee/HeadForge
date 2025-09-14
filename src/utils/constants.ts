export const EXTENSION_NAME = 'HeadForge';
export const EXTENSION_VERSION = '1.0.0';
export const EXTENSION_AUTHOR = 'Satoshiba';

// Storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'headforge_user_preferences',
  LAST_HEADER_DATA: 'headforge_last_header_data',
  TEMPLATE_CUSTOMIZATIONS: 'headforge_template_customizations',
  EXPORT_HISTORY: 'headforge_export_history',
  THEME_SETTINGS: 'headforge_theme_settings'
} as const;

// Default values
export const DEFAULT_VALUES = {
  AUTHOR: 'Satoshiba',
  PROJECT: 'SYNCLY - YouTube PVR Extension',
  VERSION: '1.0.0',
  LICENSE: 'MIT',
  STATUS: 'Development',
  PLATFORM: ['Chrome', 'Firefox', 'Edge', 'Brave'],
  LANGUAGE: 'javascript',
  THEME: 'light' as const,
  EXPORT_FORMAT: 'clipboard' as const
} as const;

// License options
export const LICENSE_OPTIONS = [
  { value: 'MIT', label: 'MIT License' },
  { value: 'GPL-3.0', label: 'GNU General Public License v3.0' },
  { value: 'Apache-2.0', label: 'Apache License 2.0' },
  { value: 'BSD-3-Clause', label: 'BSD 3-Clause License' },
  { value: 'ISC', label: 'ISC License' },
  { value: 'Unlicense', label: 'The Unlicense' },
  { value: 'Custom', label: 'Custom License' }
] as const;

// Status options
export const STATUS_OPTIONS = [
  { value: 'Development', label: 'Development' },
  { value: 'Stable', label: 'Stable' },
  { value: 'Beta', label: 'Beta' },
  { value: 'Deprecated', label: 'Deprecated' },
  { value: 'Maintenance', label: 'Maintenance' }
] as const;

// Platform options
export const PLATFORM_OPTIONS = [
  { value: 'Chrome', label: 'Chrome' },
  { value: 'Firefox', label: 'Firefox' },
  { value: 'Edge', label: 'Edge' },
  { value: 'Brave', label: 'Brave' }
] as const;


// Export format options
export const EXPORT_FORMAT_OPTIONS = [
  { value: 'clipboard', label: 'Copy to Clipboard' },
  { value: 'file', label: 'Save as File' },
  { value: 'insert', label: 'Insert into Editor' }
] as const;

// UI Constants
export const UI_CONSTANTS = {
  POPUP_WIDTH: 400,
  POPUP_HEIGHT: 600,
  MAX_PREVIEW_LINES: 20,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500
} as const;

// Validation limits
export const VALIDATION_LIMITS = {
  MAX_FILENAME_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_USAGE_LENGTH: 2000,
  MAX_NOTES_LENGTH: 1000,
  MAX_TODO_LENGTH: 1000,
  MAX_DEPENDENCIES_LENGTH: 500
} as const;

// File extensions mapping
export const FILE_EXTENSIONS = {
  javascript: '.js',
  typescript: '.ts',
  html: '.html',
  css: '.css',
  scss: '.scss',
  jsx: '.jsx',
  tsx: '.tsx',
  vue: '.vue',
  python: '.py',
  java: '.java',
  csharp: '.cs',
  cpp: '.cpp',
  c: '.c',
  go: '.go',
  rust: '.rs',
  php: '.php',
  ruby: '.rb',
  nodejs: '.js',
  kotlin: '.kt',
  swift: '.swift',
  sql: '.sql',
  graphql: '.graphql',
  dockerfile: 'Dockerfile',
  yaml: '.yml',
  json: '.json',
  bash: '.sh',
  powershell: '.ps1',
  r: '.r',
  lua: '.lua',
  perl: '.pl',
  haskell: '.hs'
} as const;

// Message types for communication between components
export const MESSAGE_TYPES = {
  GENERATE_HEADER: 'GENERATE_HEADER',
  EXPORT_HEADER: 'EXPORT_HEADER',
  SAVE_PREFERENCES: 'SAVE_PREFERENCES',
  LOAD_PREFERENCES: 'LOAD_PREFERENCES',
  UPDATE_THEME: 'UPDATE_THEME',
  VALIDATE_DATA: 'VALIDATE_DATA',
  GET_LANGUAGES: 'GET_LANGUAGES',
  GET_TEMPLATE: 'GET_TEMPLATE'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC_ERROR: 'An unexpected error occurred',
  VALIDATION_ERROR: 'Please check your input and try again',
  EXPORT_ERROR: 'Failed to export header',
  SAVE_ERROR: 'Failed to save preferences',
  LOAD_ERROR: 'Failed to load preferences',
  NETWORK_ERROR: 'Network error occurred',
  PERMISSION_ERROR: 'Permission denied',
  STORAGE_ERROR: 'Storage error occurred'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  HEADER_GENERATED: 'Header generated successfully',
  HEADER_COPIED: 'Header copied to clipboard',
  HEADER_SAVED: 'Header saved successfully',
  PREFERENCES_SAVED: 'Preferences saved successfully',
  EXPORT_SUCCESS: 'Export completed successfully'
} as const;

// CSS class names
export const CSS_CLASSES = {
  THEME_LIGHT: 'theme-light',
  THEME_DARK: 'theme-dark',
  // THEME_AUTO removed - only light and dark themes now
  ANIMATION_FADE_IN: 'fade-in',
  ANIMATION_SLIDE_UP: 'slide-up',
  ANIMATION_BOUNCE: 'bounce',
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning'
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  GENERATE: 'Ctrl+Enter',
  COPY: 'Ctrl+C',
  SAVE: 'Ctrl+S',
  NEW: 'Ctrl+N',
  PREVIEW: 'Ctrl+P'
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  TEMPLATES: '/api/templates',
  LANGUAGES: '/api/languages',
  VALIDATE: '/api/validate',
  EXPORT: '/api/export'
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_CLOUD_SYNC: false,
  ENABLE_TEAM_TEMPLATES: false,
  ENABLE_ANALYTICS: false,
  ENABLE_BETA_FEATURES: false
} as const;

// Default settings
// Function to detect system theme preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // fallback
};

export const DEFAULT_SETTINGS = {
  theme: getSystemTheme(),
  fontSize: 'medium' as const,
  popupWidth: 400,
  popupHeight: 600,
  compactMode: false,
  showPreview: true,
  animations: true,
  highContrast: false,
  accentColor: '#007bff',
  debugMode: false,
  performanceMonitoring: false,
  cacheSize: 10,
  maxHistory: 100,
  autoSave: true,
  autoSaveDelay: 1000,
  experimentalFeatures: false,
  telemetry: false,
  updateFrequency: 'weekly' as const,
  backupFrequency: 'monthly' as const,
  strictValidation: false,
  timeoutDuration: 5000,
  maxRetries: 3,
  defaultLicense: 'MIT',
  defaultLanguage: 'javascript',
  exportFormat: 'clipboard' as const,
  autoFillDates: true,
  rememberLastValues: true,
  defaultAuthor: '',
  defaultProject: '',
  autoDeactivateDuration: 180000 // 3 minutes in milliseconds
} as const;

// Default header data
export const DEFAULT_HEADER_DATA = {
  fileName: '',
  project: '',
  author: '',
  creationDate: '',
  lastUpdated: '',
  version: '1.0.0',
  description: '',
  dependencies: '',
  license: 'MIT',
  status: 'Development',
  language: 'javascript',
  usage: '',
  notes: '',
  todo: '',
  headerType: 'simple' as const
} as const;

// Licenses
export const LICENSES = [
  'MIT',
  'GPL-3.0',
  'Apache-2.0',
  'BSD-3-Clause',
  'ISC',
  'Unlicense',
  'Custom'
] as const;


// Platforms
export const PLATFORMS = [
  'Chrome',
  'Firefox',
  'Edge',
  'Brave'
] as const;

// Export options
export const EXPORT_OPTIONS = [
  'clipboard',
  'file',
  'insert'
] as const;
