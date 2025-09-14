import { HeaderData, ValidationResult } from '../types';
export declare const ValidationUtils: {
    validateHeaderData: typeof validateHeaderData;
    isValidVersion: typeof isValidVersion;
    isValidDate: typeof isValidDate;
    isValidFileName: typeof isValidFileName;
    isValidUrl: typeof isValidUrl;
    isValidEmail: typeof isValidEmail;
    sanitizeInput: typeof sanitizeInput;
    validateFormField: typeof validateFormField;
    validateLanguage: typeof validateLanguage;
    validateLicense: typeof validateLicense;
    validateStatus: typeof validateStatus;
    getValidationSummary: typeof getValidationSummary;
    formatValidationErrors: typeof formatValidationErrors;
    formatValidationWarnings: typeof formatValidationWarnings;
};
export declare function validateHeaderData(data: HeaderData): ValidationResult;
export declare function isValidVersion(version: string): boolean;
export declare function isValidDate(dateString: string): boolean;
export declare function isValidFileName(fileName: string): boolean;
export declare function isValidUrl(url: string): boolean;
export declare function isValidEmail(email: string): boolean;
export declare function sanitizeInput(input: string): string;
export declare function validateFormField(value: string, fieldName: string, required?: boolean, minLength?: number, maxLength?: number, pattern?: RegExp): {
    isValid: boolean;
    error?: string;
};
export declare function validateLanguage(language: string): boolean;
export declare function validateLicense(license: string): boolean;
export declare function validateStatus(status: string): boolean;
export declare function getValidationSummary(result: ValidationResult): string;
export declare function formatValidationErrors(errors: string[]): string;
export declare function formatValidationWarnings(warnings: string[]): string;
//# sourceMappingURL=validation.d.ts.map