export interface StorageArea {
    get(keys?: string | string[] | object | null): Promise<object>;
    set(items: object): Promise<void>;
    remove(keys: string | string[]): Promise<void>;
    clear(): Promise<void>;
    getBytesInUse(callback?: (bytesInUse: number) => void): Promise<number>;
    getBytesInUse(keys: string | string[] | null, callback?: (bytesInUse: number) => void): Promise<number>;
}
export interface StorageChange {
    newValue?: any;
    oldValue?: any;
}
export interface StorageChangeEvent {
    (changes: {
        [key: string]: StorageChange;
    }, areaName: string): void;
}
export interface StorageManager {
    local: StorageArea;
    sync: StorageArea;
    managed: StorageArea;
    onChanged: {
        addListener(callback: StorageChangeEvent): void;
        removeListener(callback: StorageChangeEvent): void;
        hasListener(callback: StorageChangeEvent): boolean;
        hasListeners(): boolean;
    };
}
export interface UserPreferences {
    theme: 'light' | 'dark';
    defaultLanguage: string;
    defaultAuthor: string;
    defaultProject: string;
    defaultLicense: string;
    autoFillDates: boolean;
    rememberLastValues: boolean;
    exportFormat: 'clipboard' | 'file' | 'insert';
    showPreview: boolean;
    compactMode: boolean;
    animations: boolean;
    highContrast: boolean;
    accentColor: string;
    fontSize: 'small' | 'medium' | 'large';
    popupWidth: number;
    popupHeight: number;
}
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
export interface TemplateData {
    id: string;
    name: string;
    language: string;
    content: string;
    variables: string[];
    isDefault: boolean;
    isCustom: boolean;
    createdAt: string;
    updatedAt: string;
    usageCount: number;
    lastUsed?: string;
}
export interface ExportHistory {
    id: string;
    timestamp: string;
    headerData: HeaderData;
    language: string;
    exportFormat: string;
    success: boolean;
    errorMessage?: string;
    fileSize?: number;
}
export interface CacheData {
    [key: string]: {
        value: any;
        timestamp: number;
        ttl: number;
    };
}
export interface SessionData {
    currentFormData: HeaderData;
    lastLanguage: string;
    lastTemplate: string;
    sessionStart: string;
    lastActivity: string;
    formChanges: number;
    exportsCount: number;
}
export interface AnalyticsData {
    totalUsage: number;
    languageUsage: {
        [language: string]: number;
    };
    exportFormatUsage: {
        [format: string]: number;
    };
    errorCount: number;
    lastUsed: string;
    installationDate: string;
    version: string;
}
export interface BackupData {
    version: string;
    timestamp: string;
    userPreferences: UserPreferences;
    templates: TemplateData[];
    exportHistory: ExportHistory[];
    analytics: AnalyticsData;
}
export interface StorageKeys {
    USER_PREFERENCES: 'headforge_user_preferences';
    LAST_HEADER_DATA: 'headforge_last_header_data';
    TEMPLATE_CUSTOMIZATIONS: 'headforge_template_customizations';
    EXPORT_HISTORY: 'headforge_export_history';
    THEME_SETTINGS: 'headforge_theme_settings';
    CACHE_DATA: 'headforge_cache_data';
    SESSION_DATA: 'headforge_session_data';
    ANALYTICS_DATA: 'headforge_analytics_data';
    BACKUP_DATA: 'headforge_backup_data';
    EXTENSION_SETTINGS: 'extensionSettings';
    LAST_FORM_DATA: 'lastFormData';
    REMEMBER_LAST_VALUES: 'rememberLastValues';
}
export interface StorageManagerInterface {
    getUserPreferences(): Promise<UserPreferences>;
    setUserPreferences(preferences: UserPreferences): Promise<void>;
    updateUserPreferences(updates: Partial<UserPreferences>): Promise<void>;
    getLastHeaderData(): Promise<HeaderData | null>;
    setLastHeaderData(data: HeaderData): Promise<void>;
    clearLastHeaderData(): Promise<void>;
    getTemplates(): Promise<TemplateData[]>;
    getTemplate(id: string): Promise<TemplateData | null>;
    setTemplate(template: TemplateData): Promise<void>;
    updateTemplate(id: string, updates: Partial<TemplateData>): Promise<void>;
    deleteTemplate(id: string): Promise<void>;
    clearTemplates(): Promise<void>;
    getExportHistory(): Promise<ExportHistory[]>;
    addExportHistory(entry: ExportHistory): Promise<void>;
    clearExportHistory(): Promise<void>;
    getExportHistoryByDateRange(startDate: string, endDate: string): Promise<ExportHistory[]>;
    getCacheData(key: string): Promise<any>;
    setCacheData(key: string, value: any, ttl?: number): Promise<void>;
    clearCacheData(key?: string): Promise<void>;
    isCacheValid(key: string): Promise<boolean>;
    getSessionData(): Promise<SessionData | null>;
    updateSessionData(updates: Partial<SessionData>): Promise<void>;
    clearSessionData(): Promise<void>;
    getAnalyticsData(): Promise<AnalyticsData>;
    updateAnalyticsData(updates: Partial<AnalyticsData>): Promise<void>;
    incrementUsage(language: string, format: string): Promise<void>;
    recordError(error: string): Promise<void>;
    createBackup(): Promise<BackupData>;
    restoreBackup(backup: BackupData): Promise<void>;
    exportBackup(): Promise<string>;
    importBackup(backupString: string): Promise<void>;
    clearAllData(): Promise<void>;
    getStorageUsage(): Promise<{
        used: number;
        available: number;
        total: number;
    }>;
    isStorageAvailable(): Promise<boolean>;
}
export interface StorageError {
    code: string;
    message: string;
    details?: any;
}
export interface StorageOptions {
    area: 'local' | 'sync' | 'managed';
    compression?: boolean;
    encryption?: boolean;
    backup?: boolean;
    sync?: boolean;
}
export interface StorageEvent {
    type: 'change' | 'error' | 'quota_exceeded';
    key: string;
    oldValue?: any;
    newValue?: any;
    error?: StorageError;
}
export interface StorageListener {
    (event: StorageEvent): void;
}
export interface StorageSubscription {
    unsubscribe(): void;
}
export interface StorageService {
    get<T>(key: string, area?: 'local' | 'sync' | 'managed'): Promise<T | null>;
    set<T>(key: string, value: T, area?: 'local' | 'sync' | 'managed'): Promise<void>;
    remove(key: string, area?: 'local' | 'sync' | 'managed'): Promise<void>;
    clear(area?: 'local' | 'sync' | 'managed'): Promise<void>;
    getMultiple<T>(keys: string[], area?: 'local' | 'sync' | 'managed'): Promise<{
        [key: string]: T;
    }>;
    setMultiple<T>(items: {
        [key: string]: T;
    }, area?: 'local' | 'sync' | 'managed'): Promise<void>;
    removeMultiple(keys: string[], area?: 'local' | 'sync' | 'managed'): Promise<void>;
    onChanged(listener: StorageListener): StorageSubscription;
    getBytesInUse(keys?: string[], area?: 'local' | 'sync' | 'managed'): Promise<number>;
    isAvailable(area?: 'local' | 'sync' | 'managed'): Promise<boolean>;
    getQuota(area?: 'local' | 'sync' | 'managed'): Promise<{
        used: number;
        available: number;
        total: number;
    }>;
}
//# sourceMappingURL=storage.d.ts.map