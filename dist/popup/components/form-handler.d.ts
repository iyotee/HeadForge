import { HeaderData, ValidationResult } from '../../types';
export declare class FormHandler {
    private form;
    private onDataChange;
    private onValidationChange;
    constructor(form: HTMLFormElement, onDataChange: (data: HeaderData) => void, onValidationChange: (result: ValidationResult) => void);
    private initializeForm;
    private bindEvents;
    private bindSpecialEvents;
    private handleInputChange;
    getFormData(): HeaderData;
    setFormData(data: HeaderData): void;
    clearForm(): void;
    resetToDefaults(): void;
    private getFieldValue;
    private setFieldValue;
    private loadSavedData;
    private saveDataIfEnabled;
    saveData(): Promise<void>;
    loadData(): Promise<void>;
    validateForm(): ValidationResult;
    getValidationErrors(): string[];
    getValidationWarnings(): string[];
    isFormValid(): boolean;
    focusFirstError(): void;
    getFormSummary(): {
        [key: string]: string;
    };
}
//# sourceMappingURL=form-handler.d.ts.map