// Template type definitions for header generation

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'date' | 'array' | 'boolean' | 'number';
  required: boolean;
  defaultValue?: any;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
  format?: {
    date?: string;
    array?: {
      separator: string;
      prefix?: string;
      suffix?: string;
    };
    string?: {
      case?: 'lower' | 'upper' | 'title' | 'camel' | 'pascal' | 'kebab' | 'snake';
      trim?: boolean;
      escape?: boolean;
    };
  };
}

export interface TemplateEngine {
  generateHeader(data: HeaderData, language: LanguageConfig): string;
  validateData(data: HeaderData): ValidationResult;
  getVariables(template: string): string[];
  parseTemplate(template: string): ParsedTemplate;
  renderTemplate(parsedTemplate: ParsedTemplate, data: HeaderData): string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

export interface ParsedTemplate {
  content: string;
  variables: TemplateVariable[];
  blocks: TemplateBlock[];
  metadata: TemplateMetadata;
}

export interface TemplateBlock {
  type: 'text' | 'variable' | 'conditional' | 'loop' | 'comment';
  content: string;
  start: number;
  end: number;
  children?: TemplateBlock[];
  condition?: string;
  variable?: string;
  format?: string;
}

export interface TemplateMetadata {
  name: string;
  description?: string;
  version: string;
  author?: string;
  language: string;
  category: string;
  tags: string[];
  variables: string[];
  dependencies?: string[];
  compatibility?: {
    minVersion?: string;
    maxVersion?: string;
    platforms?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface TemplateProcessor {
  process(template: string, data: HeaderData): string;
  validate(template: string): ValidationResult;
  optimize(template: string): string;
  minify(template: string): string;
  beautify(template: string): string;
}

export interface TemplateRenderer {
  render(template: string, data: HeaderData, options?: RenderOptions): string;
  renderBlock(block: TemplateBlock, data: HeaderData, options?: RenderOptions): string;
  renderVariable(variable: string, data: HeaderData, options?: RenderOptions): string;
  renderConditional(condition: string, data: HeaderData, options?: RenderOptions): string;
  renderLoop(loop: string, data: HeaderData, options?: RenderOptions): string;
}

export interface RenderOptions {
  encoding?: 'utf8' | 'ascii' | 'base64';
  lineEnding?: 'lf' | 'crlf' | 'cr';
  indentation?: number;
  maxLineLength?: number;
  preserveWhitespace?: boolean;
  escapeHtml?: boolean;
  escapeXml?: boolean;
  formatDates?: boolean;
  formatArrays?: boolean;
  customFormatters?: { [key: string]: (value: any) => string };
}

export interface TemplateCompiler {
  compile(template: string): CompiledTemplate;
  validate(template: string): ValidationResult;
  optimize(template: string): string;
  getDependencies(template: string): string[];
  getVariables(template: string): string[];
}

export interface CompiledTemplate {
  source: string;
  compiled: string;
  variables: string[];
  dependencies: string[];
  metadata: TemplateMetadata;
  render: (data: HeaderData) => string;
}

export interface TemplateCache {
  get(key: string): CompiledTemplate | null;
  set(key: string, template: CompiledTemplate): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
  size(): number;
  keys(): string[];
}

export interface TemplateRegistry {
  register(template: TemplateDefinition): void;
  unregister(id: string): void;
  get(id: string): TemplateDefinition | null;
  getAll(): TemplateDefinition[];
  getByLanguage(language: string): TemplateDefinition[];
  getByCategory(category: string): TemplateDefinition[];
  search(query: string): TemplateDefinition[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description?: string;
  language: string;
  category: string;
  content: string;
  variables: TemplateVariable[];
  metadata: TemplateMetadata;
  isDefault: boolean;
  isCustom: boolean;
  isPublic: boolean;
  tags: string[];
  usage: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  author?: string;
  version: string;
}

export interface TemplateLibrary {
  templates: TemplateDefinition[];
  categories: TemplateCategory[];
  languages: string[];
  tags: string[];
  search(query: string, filters?: TemplateFilters): TemplateDefinition[];
  getPopular(): TemplateDefinition[];
  getRecent(): TemplateDefinition[];
  getByAuthor(author: string): TemplateDefinition[];
}

export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parent?: string;
  children?: string[];
  templates: string[];
}

export interface TemplateFilters {
  language?: string;
  category?: string;
  tags?: string[];
  author?: string;
  isDefault?: boolean;
  isCustom?: boolean;
  isPublic?: boolean;
  minRating?: number;
  minUsage?: number;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TemplateSearchOptions {
  query?: string;
  filters?: TemplateFilters;
  sortBy?: 'name' | 'usage' | 'rating' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface TemplateSearchResult {
  templates: TemplateDefinition[];
  total: number;
  hasMore: boolean;
  suggestions?: string[];
  facets?: {
    languages: { [key: string]: number };
    categories: { [key: string]: number };
    tags: { [key: string]: number };
    authors: { [key: string]: number };
  };
}

export interface TemplateImport {
  source: string;
  format: 'json' | 'yaml' | 'xml' | 'csv';
  data: any;
  validate(): ValidationResult;
  parse(): TemplateDefinition[];
  import(): Promise<void>;
}

export interface TemplateExport {
  templates: TemplateDefinition[];
  format: 'json' | 'yaml' | 'xml' | 'csv';
  options?: {
    includeMetadata?: boolean;
    includeVariables?: boolean;
    includeUsage?: boolean;
    compress?: boolean;
  };
  export(): string;
  download(filename?: string): void;
}

export interface TemplateValidator {
  validate(template: string): ValidationResult;
  validateVariable(variable: string, value: any): string | null;
  validateSyntax(template: string): ValidationResult;
  validateSemantics(template: string): ValidationResult;
  validatePerformance(template: string): ValidationResult;
}

export interface TemplateOptimizer {
  optimize(template: string): string;
  minify(template: string): string;
  beautify(template: string): string;
  compress(template: string): string;
  decompress(template: string): string;
  analyze(template: string): TemplateAnalysis;
}

export interface TemplateAnalysis {
  size: number;
  complexity: number;
  variables: number;
  blocks: number;
  performance: {
    renderTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  quality: {
    readability: number;
    maintainability: number;
    reusability: number;
  };
  suggestions: string[];
}

export interface TemplateFormatter {
  format(template: string, options?: FormatOptions): string;
  formatVariable(variable: string, value: any, options?: FormatOptions): string;
  formatDate(date: string, format?: string): string;
  formatArray(array: any[], options?: ArrayFormatOptions): string;
  formatString(str: string, options?: StringFormatOptions): string;
}

export interface FormatOptions {
  indentation?: number;
  lineEnding?: 'lf' | 'crlf' | 'cr';
  maxLineLength?: number;
  preserveWhitespace?: boolean;
  escapeHtml?: boolean;
  escapeXml?: boolean;
}

export interface ArrayFormatOptions {
  separator?: string;
  prefix?: string;
  suffix?: string;
  itemPrefix?: string;
  itemSuffix?: string;
  maxItems?: number;
  truncate?: boolean;
}

export interface StringFormatOptions {
  case?: 'lower' | 'upper' | 'title' | 'camel' | 'pascal' | 'kebab' | 'snake';
  trim?: boolean;
  escape?: boolean;
  maxLength?: number;
  truncate?: boolean;
}

// Re-export types from other modules for convenience
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
}

export interface LanguageConfig {
  id: string;
  name: string;
  extension: string;
  commentStart: string;
  commentEnd?: string;
  commentLine: string;
  template: string;
  category: string;
}
