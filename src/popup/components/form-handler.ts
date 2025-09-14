import { HeaderData, ValidationResult } from '../../types';
import { validateHeaderData } from '../../utils/validation';
import { getCurrentDate } from '../../utils/date-utils';
import { DEFAULT_HEADER_DATA } from '../../utils/constants';

export class FormHandler {
  private form: HTMLFormElement;
  private onDataChange: (data: HeaderData) => void;
  private onValidationChange: (result: ValidationResult) => void;

  constructor(
    form: HTMLFormElement,
    onDataChange: (data: HeaderData) => void,
    onValidationChange: (result: ValidationResult) => void
  ) {
    this.form = form;
    this.onDataChange = onDataChange;
    this.onValidationChange = onValidationChange;
    
    this.initializeForm();
    this.bindEvents();
  }

  private initializeForm(): void {
    // Set default values
    const currentDate = getCurrentDate();
    this.setFieldValue('creationDate', currentDate);
    this.setFieldValue('lastUpdated', currentDate);
    
    // Load saved data if available
    this.loadSavedData();
  }

  private bindEvents(): void {
    // Bind input events
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.handleInputChange());
      input.addEventListener('change', () => this.handleInputChange());
    });

    // Bind special events
    this.bindSpecialEvents();
  }

  private bindSpecialEvents(): void {
    // Auto-fill dates when creation date changes
    const creationDateInput = this.form.querySelector('#creationDate') as HTMLInputElement;
    if (creationDateInput) {
      creationDateInput.addEventListener('change', () => {
        const lastUpdatedInput = this.form.querySelector('#lastUpdated') as HTMLInputElement;
        if (lastUpdatedInput && !lastUpdatedInput.value) {
          lastUpdatedInput.value = creationDateInput.value;
        }
      });
    }

    // Auto-fill last updated when any field changes
    const autoUpdateInputs = this.form.querySelectorAll('input:not(#lastUpdated), textarea, select');
    autoUpdateInputs.forEach(input => {
      input.addEventListener('input', () => {
        const lastUpdatedInput = this.form.querySelector('#lastUpdated') as HTMLInputElement;
        if (lastUpdatedInput) {
          lastUpdatedInput.value = getCurrentDate();
        }
      });
    });
  }

  private handleInputChange(): void {
    const data = this.getFormData();
    const validation = validateHeaderData(data);
    
    this.onDataChange(data);
    this.onValidationChange(validation);
    
    // Save data if remember last values is enabled
    this.saveDataIfEnabled(data);
  }

  public getFormData(): HeaderData {
    return {
      fileName: this.getFieldValue('fileName'),
      project: this.getFieldValue('project'),
      author: this.getFieldValue('author'),
      creationDate: this.getFieldValue('creationDate'),
      lastUpdated: this.getFieldValue('lastUpdated'),
      version: this.getFieldValue('version'),
      description: this.getFieldValue('description'),
      dependencies: this.getFieldValue('dependencies'),
      license: this.getFieldValue('license'),
      status: this.getFieldValue('status'),
      language: this.getFieldValue('language'),
      usage: this.getFieldValue('usage'),
      notes: this.getFieldValue('notes'),
      todo: this.getFieldValue('todo'),
      headerType: this.getFieldValue('headerType') as 'simple' | 'complete' || 'simple'
    };
  }

  public setFormData(data: HeaderData): void {
    this.setFieldValue('fileName', data.fileName);
    this.setFieldValue('project', data.project);
    this.setFieldValue('author', data.author);
    this.setFieldValue('creationDate', data.creationDate);
    this.setFieldValue('lastUpdated', data.lastUpdated);
    this.setFieldValue('version', data.version);
    this.setFieldValue('description', data.description);
    this.setFieldValue('dependencies', data.dependencies);
    this.setFieldValue('license', data.license);
    this.setFieldValue('status', data.status);
    this.setFieldValue('language', data.language);
    this.setFieldValue('usage', data.usage);
    this.setFieldValue('notes', data.notes);
    this.setFieldValue('todo', data.todo);
  }

  public clearForm(): void {
    this.setFormData({ ...DEFAULT_HEADER_DATA });
  }

  public resetToDefaults(): void {
    this.clearForm();
    const currentDate = getCurrentDate();
    this.setFieldValue('creationDate', currentDate);
    this.setFieldValue('lastUpdated', currentDate);
  }

  private getFieldValue(fieldName: string): string {
    const field = this.form.querySelector(`#${fieldName}`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    return field ? field.value : '';
  }

  private setFieldValue(fieldName: string, value: string): void {
    const field = this.form.querySelector(`#${fieldName}`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (field) {
      field.value = value;
    }
  }


  private async loadSavedData(): Promise<void> {
    try {
      const result = await chrome.storage.local.get(['rememberLastValues', 'lastFormData']);
      
      if (result.rememberLastValues && result.lastFormData) {
        this.setFormData(result.lastFormData);
      }
    } catch (error) {
      console.warn('Could not load saved data:', error);
    }
  }

  private async saveDataIfEnabled(data: HeaderData): Promise<void> {
    try {
      const result = await chrome.storage.local.get(['rememberLastValues']);
      
      if (result.rememberLastValues) {
        await chrome.storage.local.set({ lastFormData: data });
      }
    } catch (error) {
      console.warn('Could not save data:', error);
    }
  }

  public async saveData(): Promise<void> {
    const data = this.getFormData();
    await chrome.storage.local.set({ lastFormData: data });
  }

  public async loadData(): Promise<void> {
    try {
      const result = await chrome.storage.local.get(['lastFormData']);
      if (result.lastFormData) {
        this.setFormData(result.lastFormData);
      }
    } catch (error) {
      console.warn('Could not load data:', error);
    }
  }

  public validateForm(): ValidationResult {
    const data = this.getFormData();
    return validateHeaderData(data);
  }

  public getValidationErrors(): string[] {
    const validation = this.validateForm();
    return validation.errors;
  }

  public getValidationWarnings(): string[] {
    const validation = this.validateForm();
    return validation.warnings;
  }

  public isFormValid(): boolean {
    const validation = this.validateForm();
    return validation.isValid;
  }

  public focusFirstError(): void {
    const errors = this.getValidationErrors();
    if (errors.length > 0) {
      // Find the first field with an error and focus it
      const errorField = this.form.querySelector('.form-error') as HTMLElement;
      if (errorField) {
        const input = errorField.querySelector('input, textarea, select') as HTMLElement;
        if (input) {
          input.focus();
        }
      }
    }
  }

  public getFormSummary(): { [key: string]: string } {
    const data = this.getFormData();
    return {
      'File Name': data.fileName,
      'Project': data.project,
      'Author': data.author,
      'Version': data.version,
      'Language': data.language,
      'License': data.license,
      'Status': data.status,
    };
  }
}
