import { HeaderData } from '../../types';
export declare class HeaderPreview {
    private container;
    private headerData;
    private languageConfig;
    private isVisible;
    constructor(container: HTMLElement);
    private getDefaultHeaderData;
    private initialize;
    updateHeaderData(data: HeaderData): void;
    updateLanguage(language: string): void;
    toggleVisibility(): void;
    setVisibility(visible: boolean): void;
    getPreviewContent(): string;
    copyPreview(): void;
    downloadPreview(): void;
    getPreviewStats(): {
        lines: number;
        characters: number;
        words: number;
    };
    private render;
    private bindEvents;
    private updatePreview;
    private updateStats;
    private updateVisibility;
    private applySyntaxHighlighting;
    private escapeRegex;
    private getFilename;
    private downloadFile;
    private showCopySuccess;
    private showCopyError;
    private showDownloadSuccess;
    private showMessage;
    destroy(): void;
    resize(): void;
    getContainer(): HTMLElement;
    isPreviewVisible(): boolean;
    hasValidData(): boolean;
    getValidationErrors(): string[];
}
//# sourceMappingURL=header-preview.d.ts.map