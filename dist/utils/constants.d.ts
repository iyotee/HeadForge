export declare const EXTENSION_NAME = "HeadForge";
export declare const EXTENSION_VERSION = "1.0.0";
export declare const EXTENSION_AUTHOR = "Satoshiba";
export declare const STORAGE_KEYS: {
    readonly USER_PREFERENCES: "headforge_user_preferences";
    readonly LAST_HEADER_DATA: "headforge_last_header_data";
    readonly TEMPLATE_CUSTOMIZATIONS: "headforge_template_customizations";
    readonly EXPORT_HISTORY: "headforge_export_history";
    readonly THEME_SETTINGS: "headforge_theme_settings";
};
export declare const DEFAULT_VALUES: {
    readonly AUTHOR: "Satoshiba";
    readonly PROJECT: "SYNCLY - YouTube PVR Extension";
    readonly VERSION: "1.0.0";
    readonly LICENSE: "MIT";
    readonly STATUS: "Development";
    readonly PLATFORM: readonly ["Chrome", "Firefox", "Edge", "Brave"];
    readonly LANGUAGE: "javascript";
    readonly THEME: "light";
    readonly EXPORT_FORMAT: "clipboard";
};
export declare const LICENSE_OPTIONS: readonly [{
    readonly value: "MIT";
    readonly label: "MIT License";
}, {
    readonly value: "GPL-3.0";
    readonly label: "GNU General Public License v3.0";
}, {
    readonly value: "Apache-2.0";
    readonly label: "Apache License 2.0";
}, {
    readonly value: "BSD-3-Clause";
    readonly label: "BSD 3-Clause License";
}, {
    readonly value: "ISC";
    readonly label: "ISC License";
}, {
    readonly value: "Unlicense";
    readonly label: "The Unlicense";
}, {
    readonly value: "Custom";
    readonly label: "Custom License";
}];
export declare const STATUS_OPTIONS: readonly [{
    readonly value: "Development";
    readonly label: "Development";
}, {
    readonly value: "Stable";
    readonly label: "Stable";
}, {
    readonly value: "Beta";
    readonly label: "Beta";
}, {
    readonly value: "Deprecated";
    readonly label: "Deprecated";
}, {
    readonly value: "Maintenance";
    readonly label: "Maintenance";
}];
export declare const PLATFORM_OPTIONS: readonly [{
    readonly value: "Chrome";
    readonly label: "Chrome";
}, {
    readonly value: "Firefox";
    readonly label: "Firefox";
}, {
    readonly value: "Edge";
    readonly label: "Edge";
}, {
    readonly value: "Brave";
    readonly label: "Brave";
}];
export declare const EXPORT_FORMAT_OPTIONS: readonly [{
    readonly value: "clipboard";
    readonly label: "Copy to Clipboard";
}, {
    readonly value: "file";
    readonly label: "Save as File";
}, {
    readonly value: "insert";
    readonly label: "Insert into Editor";
}];
export declare const UI_CONSTANTS: {
    readonly POPUP_WIDTH: 400;
    readonly POPUP_HEIGHT: 600;
    readonly MAX_PREVIEW_LINES: 20;
    readonly ANIMATION_DURATION: 300;
    readonly DEBOUNCE_DELAY: 500;
};
export declare const VALIDATION_LIMITS: {
    readonly MAX_FILENAME_LENGTH: 255;
    readonly MAX_DESCRIPTION_LENGTH: 1000;
    readonly MAX_USAGE_LENGTH: 2000;
    readonly MAX_NOTES_LENGTH: 1000;
    readonly MAX_TODO_LENGTH: 1000;
    readonly MAX_DEPENDENCIES_LENGTH: 500;
};
export declare const FILE_EXTENSIONS: {
    readonly javascript: ".js";
    readonly typescript: ".ts";
    readonly html: ".html";
    readonly css: ".css";
    readonly scss: ".scss";
    readonly jsx: ".jsx";
    readonly tsx: ".tsx";
    readonly vue: ".vue";
    readonly python: ".py";
    readonly java: ".java";
    readonly csharp: ".cs";
    readonly cpp: ".cpp";
    readonly c: ".c";
    readonly go: ".go";
    readonly rust: ".rs";
    readonly php: ".php";
    readonly ruby: ".rb";
    readonly nodejs: ".js";
    readonly kotlin: ".kt";
    readonly swift: ".swift";
    readonly sql: ".sql";
    readonly graphql: ".graphql";
    readonly dockerfile: "Dockerfile";
    readonly yaml: ".yml";
    readonly json: ".json";
    readonly bash: ".sh";
    readonly powershell: ".ps1";
    readonly r: ".r";
    readonly lua: ".lua";
    readonly perl: ".pl";
    readonly haskell: ".hs";
};
export declare const MESSAGE_TYPES: {
    readonly GENERATE_HEADER: "GENERATE_HEADER";
    readonly EXPORT_HEADER: "EXPORT_HEADER";
    readonly SAVE_PREFERENCES: "SAVE_PREFERENCES";
    readonly LOAD_PREFERENCES: "LOAD_PREFERENCES";
    readonly UPDATE_THEME: "UPDATE_THEME";
    readonly VALIDATE_DATA: "VALIDATE_DATA";
    readonly GET_LANGUAGES: "GET_LANGUAGES";
    readonly GET_TEMPLATE: "GET_TEMPLATE";
};
export declare const ERROR_MESSAGES: {
    readonly GENERIC_ERROR: "An unexpected error occurred";
    readonly VALIDATION_ERROR: "Please check your input and try again";
    readonly EXPORT_ERROR: "Failed to export header";
    readonly SAVE_ERROR: "Failed to save preferences";
    readonly LOAD_ERROR: "Failed to load preferences";
    readonly NETWORK_ERROR: "Network error occurred";
    readonly PERMISSION_ERROR: "Permission denied";
    readonly STORAGE_ERROR: "Storage error occurred";
};
export declare const SUCCESS_MESSAGES: {
    readonly HEADER_GENERATED: "Header generated successfully";
    readonly HEADER_COPIED: "Header copied to clipboard";
    readonly HEADER_SAVED: "Header saved successfully";
    readonly PREFERENCES_SAVED: "Preferences saved successfully";
    readonly EXPORT_SUCCESS: "Export completed successfully";
};
export declare const CSS_CLASSES: {
    readonly THEME_LIGHT: "theme-light";
    readonly THEME_DARK: "theme-dark";
    readonly ANIMATION_FADE_IN: "fade-in";
    readonly ANIMATION_SLIDE_UP: "slide-up";
    readonly ANIMATION_BOUNCE: "bounce";
    readonly LOADING: "loading";
    readonly ERROR: "error";
    readonly SUCCESS: "success";
    readonly WARNING: "warning";
};
export declare const KEYBOARD_SHORTCUTS: {
    readonly GENERATE: "Ctrl+Enter";
    readonly COPY: "Ctrl+C";
    readonly SAVE: "Ctrl+S";
    readonly NEW: "Ctrl+N";
    readonly PREVIEW: "Ctrl+P";
};
export declare const API_ENDPOINTS: {
    readonly TEMPLATES: "/api/templates";
    readonly LANGUAGES: "/api/languages";
    readonly VALIDATE: "/api/validate";
    readonly EXPORT: "/api/export";
};
export declare const FEATURE_FLAGS: {
    readonly ENABLE_CLOUD_SYNC: false;
    readonly ENABLE_TEAM_TEMPLATES: false;
    readonly ENABLE_ANALYTICS: false;
    readonly ENABLE_BETA_FEATURES: false;
};
export declare const DEFAULT_SETTINGS: {
    readonly theme: "dark" | "light";
    readonly fontSize: "medium";
    readonly popupWidth: 400;
    readonly popupHeight: 600;
    readonly compactMode: false;
    readonly showPreview: true;
    readonly animations: true;
    readonly highContrast: false;
    readonly accentColor: "#007bff";
    readonly debugMode: false;
    readonly performanceMonitoring: false;
    readonly cacheSize: 10;
    readonly maxHistory: 100;
    readonly autoSave: true;
    readonly autoSaveDelay: 1000;
    readonly experimentalFeatures: false;
    readonly telemetry: false;
    readonly updateFrequency: "weekly";
    readonly backupFrequency: "monthly";
    readonly strictValidation: false;
    readonly timeoutDuration: 5000;
    readonly maxRetries: 3;
    readonly defaultLicense: "MIT";
    readonly defaultLanguage: "javascript";
    readonly exportFormat: "clipboard";
    readonly autoFillDates: true;
    readonly rememberLastValues: true;
    readonly defaultAuthor: "";
    readonly defaultProject: "";
    readonly autoDeactivateDuration: 180000;
};
export declare const DEFAULT_HEADER_DATA: {
    readonly fileName: "";
    readonly project: "";
    readonly author: "";
    readonly creationDate: "";
    readonly lastUpdated: "";
    readonly version: "1.0.0";
    readonly description: "";
    readonly dependencies: "";
    readonly license: "MIT";
    readonly status: "Development";
    readonly language: "javascript";
    readonly usage: "";
    readonly notes: "";
    readonly todo: "";
    readonly headerType: "simple";
};
export declare const LICENSES: readonly ["MIT", "GPL-3.0", "Apache-2.0", "BSD-3-Clause", "ISC", "Unlicense", "Custom"];
export declare const PLATFORMS: readonly ["Chrome", "Firefox", "Edge", "Brave"];
export declare const EXPORT_OPTIONS: readonly ["clipboard", "file", "insert"];
//# sourceMappingURL=constants.d.ts.map