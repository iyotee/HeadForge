import { LanguageConfig } from '@/types';
export interface LanguageConfigs {
    [key: string]: LanguageConfig;
}
export declare const languageConfigs: LanguageConfigs;
export declare function getLanguageById(id: string): LanguageConfig | null;
export declare function getAllLanguages(): LanguageConfig[];
export declare function getLanguageByExtension(extension: string): LanguageConfig | null;
export declare function searchLanguages(query: string): LanguageConfig[];
//# sourceMappingURL=language-configs.d.ts.map