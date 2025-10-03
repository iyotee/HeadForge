import { UserPreferences, Theme } from '@/types';
import { languageConfigs } from '@/utils/language-configs';
import { DEFAULT_VALUES, STORAGE_KEYS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/utils/constants';

// Import CSS files
import '../styles/main.css';
import './options.css';

import { GeneralSettings } from './pages/general';
import { AppearanceSettings } from './pages/appearance';
import { TemplatesSettings } from './pages/templates';
import { AdvancedSettings } from './pages/advanced';

class HeadForgeOptions {
  private form!: HTMLFormElement;
  private themeToggle!: HTMLElement;
  private saveBtn!: HTMLElement;
  private cancelBtn!: HTMLElement;
  private exportBtn!: HTMLElement;
  private importBtn!: HTMLElement;
  private importFile!: HTMLInputElement;
  private resetBtn!: HTMLElement;
  private toastContainer!: HTMLElement;
  
  private userPreferences: UserPreferences = this.getDefaultPreferences();
  private hasUnsavedChanges: boolean = false;
  
  // Settings pages
  private generalSettings!: GeneralSettings;
  private appearanceSettings!: AppearanceSettings;
  private templatesSettings!: TemplatesSettings;
  private advancedSettings!: AdvancedSettings;

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.initializeSettingsPages();
    this.loadUserPreferences();
    this.setupTheme();
  }

  private initializeElements(): void {
    this.form = document.querySelector('.options-content') as HTMLFormElement;
    this.themeToggle = document.getElementById('theme-toggle') as HTMLElement;
    this.saveBtn = document.getElementById('saveSettings') as HTMLElement;
    this.cancelBtn = document.getElementById('cancelSettings') as HTMLElement;
    this.exportBtn = document.getElementById('exportSettings') as HTMLElement;
    this.importBtn = document.getElementById('importSettings') as HTMLElement;
    this.importFile = document.getElementById('importFile') as HTMLInputElement;
    this.resetBtn = document.getElementById('resetSettings') as HTMLElement;
    this.toastContainer = document.getElementById('toast-container') as HTMLElement;
  }

  private initializeSettingsPages(): void {
    // Initialize settings pages
    const generalContainer = document.getElementById('general-settings-container');
    const appearanceContainer = document.getElementById('appearance-settings-container');
    const templatesContainer = document.getElementById('templates-settings-container');
    const advancedContainer = document.getElementById('advanced-settings-container');

    if (generalContainer) {
      this.generalSettings = new GeneralSettings(generalContainer);
    }
    if (appearanceContainer) {
      this.appearanceSettings = new AppearanceSettings(appearanceContainer);
    }
    if (templatesContainer) {
      this.templatesSettings = new TemplatesSettings(templatesContainer);
    }
    if (advancedContainer) {
      this.advancedSettings = new AdvancedSettings(advancedContainer);
    }
  }

  private setupEventListeners(): void {
    // Tab navigation
    document.querySelectorAll('.options-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = (e.target as HTMLElement).dataset.tab;
        if (tab) {
          this.switchTab(tab);
        }
      });
    });

    // Form input events
    this.form.addEventListener('input', () => {
      this.hasUnsavedChanges = true;
    });

    this.form.addEventListener('change', () => {
      this.hasUnsavedChanges = true;
    });

    // Theme toggle
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Button events
    if (this.saveBtn) this.saveBtn.addEventListener('click', () => this.saveSettings());
    if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.cancelChanges());
    if (this.exportBtn) this.exportBtn.addEventListener('click', () => this.exportSettings());
    if (this.importBtn) this.importBtn.addEventListener('click', () => this.importSettings());
    if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.resetSettings());

    // File import
    if (this.importFile) {
      this.importFile.addEventListener('change', (e) => this.handleFileImport(e));
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

    // Before unload warning
    window.addEventListener('beforeunload', (e) => {
      if (this.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  private switchTab(tabName: string): void {
    // Update nav links
    document.querySelectorAll('.options-nav-link').forEach(link => {
      link.classList.remove('active');
    });
    const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }

    // Update tab content
    document.querySelectorAll('.options-section-content').forEach(content => {
      (content as HTMLElement).style.display = 'none';
    });
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
      activeTab.style.display = 'block';
    }
  }

  private populateLanguageOptions(): void {
    const languageSelect = document.getElementById('defaultLanguage') as HTMLSelectElement;
    
    // Group languages by category
    const languageArray = Object.values(languageConfigs);
    const categories = [...new Set(languageArray.map(lang => lang.category))];
    
    categories.forEach(category => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = this.capitalizeFirst(category);
      
      const categoryLanguages = languageArray.filter(lang => lang.category === category);
      categoryLanguages.forEach(language => {
        const option = document.createElement('option');
        option.value = language.id;
        option.textContent = language.name;
        optgroup.appendChild(option);
      });
      
      languageSelect.appendChild(optgroup);
    });
  }

  private setupTheme(): void {
    const body = document.body;
    body.className = `theme-${this.userPreferences.theme}`;
    
    // Update theme toggle icon
    const themeIcon = this.themeToggle.querySelector('.theme-icon') as SVGElement;
    if (this.userPreferences.theme === 'dark') {
      themeIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      `;
    } else {
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
      `;
    }
  }

  private toggleTheme(): void {
    // Toggle between light and dark themes only
    this.userPreferences.theme = this.userPreferences.theme === 'light' ? 'dark' : 'light';
    this.setupTheme();
    this.hasUnsavedChanges = true;
  }

  private async loadUserPreferences(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(STORAGE_KEYS.USER_PREFERENCES);
      if (result[STORAGE_KEYS.USER_PREFERENCES]) {
        this.userPreferences = { ...this.userPreferences, ...result[STORAGE_KEYS.USER_PREFERENCES] };
      }
      this.populateForm();
    } catch (error) {
      console.error('Error loading user preferences:', error);
      this.showToast('Failed to load settings', 'error');
    }
  }

  private populateForm(): void {
    // Populate form fields with current preferences
    const fields = [
      'defaultLanguage',
      'defaultAuthor',
      'defaultProject',
      'defaultLicense',
      'exportFormat',
      'theme'
    ];

    fields.forEach(field => {
      const element = document.getElementById(field) as HTMLInputElement | HTMLSelectElement;
      if (element && this.userPreferences[field as keyof UserPreferences]) {
        element.value = this.userPreferences[field as keyof UserPreferences] as string;
      }
    });

    // Handle checkboxes
    const checkboxes = [
      'autoFillDates',
      'rememberLastValues',
      'showPreview',
      'enableAnalytics',
      'enableBetaFeatures'
    ];

    checkboxes.forEach(checkbox => {
      const element = document.getElementById(checkbox) as HTMLInputElement;
      if (element) {
        element.checked = this.userPreferences[checkbox as keyof UserPreferences] as boolean;
      }
    });
  }

  private getFormData(): UserPreferences {
    const formData = new FormData(this.form);
    
    return {
      theme: formData.get('theme') as Theme || 'light',
      defaultLanguage: (document.getElementById('defaultLanguage') as HTMLSelectElement).value || DEFAULT_VALUES.LANGUAGE,
      defaultAuthor: (document.getElementById('defaultAuthor') as HTMLInputElement).value || DEFAULT_VALUES.AUTHOR,
      defaultProject: (document.getElementById('defaultProject') as HTMLInputElement).value || DEFAULT_VALUES.PROJECT,
      defaultLicense: (document.getElementById('defaultLicense') as HTMLSelectElement).value || DEFAULT_VALUES.LICENSE,
      autoFillDates: (document.getElementById('autoFillDates') as HTMLInputElement).checked,
      rememberLastValues: (document.getElementById('rememberLastValues') as HTMLInputElement).checked,
      exportFormat: (document.getElementById('exportFormat') as HTMLSelectElement).value as 'clipboard' | 'file' | 'insert' || DEFAULT_VALUES.EXPORT_FORMAT,
      showPreview: (document.getElementById('showPreview') as HTMLInputElement).checked,
      headerType: (document.getElementById('headerType') as HTMLSelectElement)?.value as 'simple' | 'complete' || 'simple',
      enableAnalytics: (document.getElementById('enableAnalytics') as HTMLInputElement).checked,
      enableBetaFeatures: (document.getElementById('enableBetaFeatures') as HTMLInputElement).checked
    };
  }

  private async saveSettings(): Promise<void> {
    try {
      this.userPreferences = this.getFormData();
      
      await chrome.storage.sync.set({
        [STORAGE_KEYS.USER_PREFERENCES]: this.userPreferences
      });

      this.hasUnsavedChanges = false;
      this.showToast(SUCCESS_MESSAGES.PREFERENCES_SAVED, 'success');
      
      // Update theme immediately
      this.setupTheme();
      
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showToast(ERROR_MESSAGES.SAVE_ERROR, 'error');
    }
  }

  private cancelChanges(): void {
    if (this.hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        this.loadUserPreferences();
        this.hasUnsavedChanges = false;
      }
    } else {
      window.close();
    }
  }

  private async exportSettings(): Promise<void> {
    try {
      const settings = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        preferences: this.userPreferences
      };

      const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `headforge-settings-${new Date().toISOString().split('T')[0]}.json`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      this.showToast('Settings exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting settings:', error);
      this.showToast('Failed to export settings', 'error');
    }
  }

  private importSettings(): void {
    this.importFile.click();
  }

  private async handleFileImport(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;

    try {
      const text = await file.text();
      const settings = JSON.parse(text);
      
      if (!settings.preferences) {
        throw new Error('Invalid settings file format');
      }

      // Validate settings structure
      const validPreferences = this.validateImportedSettings(settings.preferences);
      
      this.userPreferences = { ...this.userPreferences, ...validPreferences };
      this.populateForm();
      this.setupTheme();
      this.hasUnsavedChanges = true;
      
      this.showToast('Settings imported successfully', 'success');
    } catch (error) {
      console.error('Error importing settings:', error);
      this.showToast('Failed to import settings. Please check the file format.', 'error');
    } finally {
      // Reset file input
      target.value = '';
    }
  }

  private validateImportedSettings(settings: any): Partial<UserPreferences> {
    const validSettings: Partial<UserPreferences> = {};
    
    // Validate each setting
    if (typeof settings.theme === 'string' && ['light', 'dark'].includes(settings.theme)) {
      validSettings.theme = settings.theme;
    }
    
    if (typeof settings.defaultLanguage === 'string') {
      validSettings.defaultLanguage = settings.defaultLanguage;
    }
    
    if (typeof settings.defaultAuthor === 'string') {
      validSettings.defaultAuthor = settings.defaultAuthor;
    }
    
    if (typeof settings.defaultProject === 'string') {
      validSettings.defaultProject = settings.defaultProject;
    }
    
    if (typeof settings.defaultLicense === 'string') {
      validSettings.defaultLicense = settings.defaultLicense;
    }
    
    if (typeof settings.exportFormat === 'string' && ['clipboard', 'file', 'insert'].includes(settings.exportFormat)) {
      validSettings.exportFormat = settings.exportFormat;
    }
    
    if (typeof settings.autoFillDates === 'boolean') {
      validSettings.autoFillDates = settings.autoFillDates;
    }
    
    if (typeof settings.rememberLastValues === 'boolean') {
      validSettings.rememberLastValues = settings.rememberLastValues;
    }
    
    if (typeof settings.showPreview === 'boolean') {
      validSettings.showPreview = settings.showPreview;
    }
    
    if (typeof settings.enableAnalytics === 'boolean') {
      validSettings.enableAnalytics = settings.enableAnalytics;
    }
    
    if (typeof settings.enableBetaFeatures === 'boolean') {
      validSettings.enableBetaFeatures = settings.enableBetaFeatures;
    }
    
    return validSettings;
  }

  private async resetSettings(): Promise<void> {
    if (confirm('Are you sure you want to reset all settings to their default values? This action cannot be undone.')) {
      try {
        this.userPreferences = this.getDefaultPreferences();
        this.populateForm();
        this.setupTheme();
        this.hasUnsavedChanges = true;
        
        this.showToast('Settings reset to defaults', 'success');
      } catch (error) {
        console.error('Error resetting settings:', error);
        this.showToast('Failed to reset settings', 'error');
      }
    }
  }

  private handleKeyboardShortcuts(e: KeyboardEvent): void {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          this.saveSettings();
          break;
        case 'r':
          e.preventDefault();
          this.resetSettings();
          break;
      }
    }
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = this.getToastIcon(type);
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${icon}
      </svg>
      <div class="toast-content">
        <p class="toast-message">${message}</p>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    
    this.toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  }

  private getToastIcon(type: string): string {
    const icons = {
      success: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>',
      error: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
      warning: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
      info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
    };
    return icons[type as keyof typeof icons] || icons.info;
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: DEFAULT_VALUES.THEME,
      defaultLanguage: DEFAULT_VALUES.LANGUAGE,
      defaultAuthor: DEFAULT_VALUES.AUTHOR,
      defaultProject: DEFAULT_VALUES.PROJECT,
      defaultLicense: DEFAULT_VALUES.LICENSE,
      autoFillDates: true,
      rememberLastValues: true,
      exportFormat: DEFAULT_VALUES.EXPORT_FORMAT,
      showPreview: true,
      headerType: 'simple',
      enableAnalytics: false,
      enableBetaFeatures: false
    };
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize the options page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HeadForgeOptions();
});
