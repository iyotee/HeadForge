import { HeaderData, LanguageConfig } from '../types';
export declare const templateEngine: {
    generateHeader: typeof generateHeader;
    formatTemplate: typeof formatTemplate;
    validateTemplate: typeof validateTemplate;
    extractVariables: typeof extractVariables;
};
export declare function generateHeader(data: HeaderData, languageConfig: LanguageConfig): string;
export declare function validateTemplate(template: string): {
    isValid: boolean;
    errors: string[];
};
export declare function createCustomTemplate(languageConfig: LanguageConfig, variables: string[]): string;
export declare function formatCommentBlock(content: string, languageConfig: LanguageConfig, maxWidth?: number): string;
export declare function generateHeaderPreview(data: HeaderData, languageConfig: LanguageConfig, maxLines?: number): string;
export declare function getHeaderStatistics(header: string): {
    lineCount: number;
    characterCount: number;
    wordCount: number;
    commentLineCount: number;
};
export declare function formatTemplate(template: string, variables: Record<string, string>): string;
export declare function extractVariables(template: string): string[];
//# sourceMappingURL=template-engine.d.ts.map