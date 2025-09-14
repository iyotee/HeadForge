import { HeaderData } from '../../types';
export declare class ExportManager {
    private onExportSuccess;
    private onExportError;
    constructor(onExportSuccess: (message: string) => void, onExportError: (error: string) => void);
    copyToClipboard(data: HeaderData): Promise<void>;
    downloadFile(data: HeaderData): Promise<void>;
    insertIntoEditor(data: HeaderData): Promise<void>;
    generateHeader(data: HeaderData): string;
    getFilename(data: HeaderData): string;
    getPreview(data: HeaderData): string;
    exportAsJson(data: HeaderData): Promise<void>;
    exportAsMarkdown(data: HeaderData): Promise<void>;
    private generateMarkdown;
    getSupportedFormats(): string[];
    exportInFormat(format: string, data: HeaderData): Promise<void>;
    validateExportData(data: HeaderData): {
        isValid: boolean;
        errors: string[];
    };
    getExportStatistics(data: HeaderData): {
        [key: string]: number;
    };
}
//# sourceMappingURL=export-manager.d.ts.map