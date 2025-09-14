export interface HeaderData {
  fileName: string;
  project: string;
  author: string;
  creationDate: string;
  lastUpdated: string;
  version: string;
  description: string;
  dependencies: string;
  license: string;
  status: string;
  language: string;
  usage: string;
  notes: string;
  todo: string;
  headerType: 'simple' | 'complete';
}

export interface LanguageConfig {
  id: string;
  name: string;
  extension: string;
  commentStart: string;
  commentEnd?: string;
  commentLine: string;
  template: string;
  templateComplete?: string;
  category: LanguageCategory;
}

export type LanguageCategory = 
  | 'web'
  | 'backend'
  | 'database'
  | 'devops'
  | 'mobile'
  | 'desktop'
  | 'other';

export interface UserPreferences {
  theme: Theme;
  defaultLanguage: string;
  defaultAuthor: string;
  defaultProject: string;
  defaultLicense: string;
  autoFillDates: boolean;
  rememberLastValues: boolean;
  exportFormat: 'clipboard' | 'file' | 'insert';
  showPreview: boolean;
  headerType: 'simple' | 'complete';
  enableAnalytics?: boolean;
  enableBetaFeatures?: boolean;
}

export interface ExportOptions {
  format: 'clipboard' | 'file' | 'insert';
  filename?: string;
  includeTimestamp?: boolean;
}

export interface TemplateEngine {
  generateHeader(data: HeaderData, language: LanguageConfig): string;
  validateData(data: HeaderData): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface BrowserAPI {
  storage: {
    local: {
      get(keys?: string | string[] | object): Promise<object>;
      set(items: object): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    };
    sync: {
      get(keys?: string | string[] | object): Promise<object>;
      set(items: object): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    };
  };
  clipboard: {
    writeText(text: string): Promise<void>;
  };
  tabs: {
    query(queryInfo: any): Promise<any[]>;
    sendMessage(tabId: number, message: any): Promise<any>;
  };
  runtime: {
    sendMessage(message: any): Promise<any>;
    onMessage: {
      addListener(callback: (message: any, sender: any, sendResponse: any) => void): void;
      removeListener(callback: (message: any, sender: any, sendResponse: any) => void): void;
    };
  };
}

export interface Message {
  type: string;
  payload?: any;
  error?: string;
}

export interface HeaderPreviewProps {
  data: HeaderData;
  language: LanguageConfig;
  className?: string;
}

export interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'select' | 'multiselect';
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  className?: string;
}

export interface ExportManagerProps {
  headerData: HeaderData;
  language: LanguageConfig;
  onExport: (options: ExportOptions) => Promise<void>;
  className?: string;
}

export interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  className?: string;
}

export type Theme = 'light' | 'dark';

export interface ExtensionSettings {
  theme: Theme;
  fontSize: 'small' | 'medium' | 'large';
  popupWidth: number;
  popupHeight: number;
  compactMode: boolean;
  showPreview: boolean;
  animations: boolean;
  highContrast: boolean;
  accentColor: string;
  debugMode: boolean;
  performanceMonitoring: boolean;
  cacheSize: number;
  maxHistory: number;
  autoSave: boolean;
  autoSaveDelay: number;
  experimentalFeatures: boolean;
  telemetry: boolean;
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  strictValidation: boolean;
  timeoutDuration: number;
  maxRetries: number;
  defaultLicense: string;
  defaultLanguage: string;
  exportFormat: 'clipboard' | 'file' | 'insert';
  autoFillDates: boolean;
  rememberLastValues: boolean;
  defaultAuthor?: string;
  defaultProject?: string;
  autoDeactivateDuration: number;
}


export interface TemplateVariables {
  fileName: string;
  project: string;
  author: string;
  creationDate: string;
  lastUpdated: string;
  version: string;
  description: string;
  dependencies: string;
  license: string;
  status: string;
  language: string;
  usage: string;
  notes: string;
  todo: string;
  commentLine: string;
}

export interface MessageResponse {
  success: boolean;
  data?: any;
  error?: string;
}


// Re-export types from specialized modules
export * from './browser';
export * from './language';
export * from './storage';
export * from './template';