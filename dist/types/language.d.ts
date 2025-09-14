export type LanguageCategory = 'web' | 'backend' | 'database' | 'devops' | 'mobile' | 'desktop' | 'other';
export interface LanguageConfig {
    id: string;
    name: string;
    extension: string;
    commentStart: string;
    commentEnd?: string;
    commentLine: string;
    template: string;
    category: LanguageCategory;
    fileExtension?: string;
    mimeType?: string;
    aliases?: string[];
    keywords?: string[];
    description?: string;
}
export interface LanguageTemplate {
    id: string;
    name: string;
    language: string;
    content: string;
    variables: string[];
    isDefault: boolean;
    isCustom: boolean;
    createdAt?: string;
    updatedAt?: string;
}
export interface LanguageVariable {
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
}
export interface LanguageSyntax {
    language: string;
    commentStyles: {
        line: string;
        block?: {
            start: string;
            end: string;
        };
    };
    stringDelimiters: string[];
    escapeCharacters: string[];
    keywords: string[];
    operators: string[];
    brackets: {
        open: string;
        close: string;
    }[];
}
export interface LanguageHighlighting {
    language: string;
    rules: {
        pattern: RegExp;
        style: string;
        group?: number;
    }[];
    keywords: {
        [key: string]: string;
    };
    comments: {
        line: RegExp;
        block?: {
            start: RegExp;
            end: RegExp;
        };
    };
}
export interface LanguageValidation {
    language: string;
    rules: {
        requiredFields: string[];
        optionalFields: string[];
        fieldValidation: {
            [fieldName: string]: {
                pattern?: RegExp;
                minLength?: number;
                maxLength?: number;
                custom?: (value: string) => string | null;
            };
        };
    };
}
export interface LanguageExport {
    language: string;
    formats: {
        [formatName: string]: {
            extension: string;
            mimeType: string;
            template: string;
        };
    };
}
export interface LanguageImport {
    language: string;
    supportedFormats: string[];
    parsers: {
        [formatName: string]: (content: string) => LanguageConfig;
    };
}
export interface LanguageMetadata {
    language: string;
    version: string;
    author?: string;
    description?: string;
    homepage?: string;
    license?: string;
    tags?: string[];
    dependencies?: string[];
    compatibility?: {
        minVersion?: string;
        maxVersion?: string;
        platforms?: string[];
    };
}
export interface LanguageRegistry {
    languages: LanguageConfig[];
    categories: {
        [category in LanguageCategory]: {
            name: string;
            description: string;
            icon?: string;
            color?: string;
        };
    };
    templates: LanguageTemplate[];
    variables: LanguageVariable[];
    syntax: LanguageSyntax[];
    highlighting: LanguageHighlighting[];
    validation: LanguageValidation[];
    exports: LanguageExport[];
    imports: LanguageImport[];
    metadata: LanguageMetadata[];
}
export interface LanguageSearchOptions {
    query?: string;
    category?: LanguageCategory;
    tags?: string[];
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'category' | 'popularity' | 'relevance';
    sortOrder?: 'asc' | 'desc';
}
export interface LanguageSearchResult {
    languages: LanguageConfig[];
    total: number;
    hasMore: boolean;
    suggestions?: string[];
}
export interface LanguageFilter {
    category?: LanguageCategory;
    hasTemplates?: boolean;
    isCustom?: boolean;
    isDefault?: boolean;
    tags?: string[];
    minTemplateCount?: number;
    maxTemplateCount?: number;
}
export interface LanguageSort {
    field: 'name' | 'category' | 'templateCount' | 'lastUsed' | 'createdAt';
    order: 'asc' | 'desc';
}
export interface LanguagePreferences {
    defaultLanguage: string;
    favoriteLanguages: string[];
    recentLanguages: string[];
    hiddenLanguages: string[];
    customLanguages: LanguageConfig[];
    templatePreferences: {
        [languageId: string]: {
            defaultTemplate?: string;
            customTemplates?: string[];
            variables?: {
                [variableName: string]: any;
            };
        };
    };
}
export interface LanguageUsage {
    language: string;
    usageCount: number;
    lastUsed: string;
    averageUsageTime: number;
    successRate: number;
    errorCount: number;
    favoriteTemplates: string[];
}
export interface LanguageAnalytics {
    totalLanguages: number;
    totalTemplates: number;
    mostUsedLanguages: LanguageUsage[];
    categoryDistribution: {
        [category in LanguageCategory]: number;
    };
    templateStatistics: {
        totalTemplates: number;
        customTemplates: number;
        defaultTemplates: number;
        averageTemplatesPerLanguage: number;
    };
    usageStatistics: {
        totalUsage: number;
        averageUsagePerLanguage: number;
        peakUsageTime: string;
        mostActiveDay: string;
    };
}
//# sourceMappingURL=language.d.ts.map