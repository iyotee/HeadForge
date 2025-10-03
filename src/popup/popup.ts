import { HeaderData, LanguageConfig, UserPreferences, Theme } from '@/types';
import { languageConfigs, getLanguageById } from '@/utils/language-configs';
import { templateEngine } from '@/utils/template-engine';
import { DateUtils } from '@/utils/date-utils';
import { ValidationUtils } from '@/utils/validation';
import { ClipboardUtils } from '@/utils/clipboard';
import { FileUtils } from '@/utils/file-utils';
import { UpdateCheckerUI } from './components/update-checker';

// Import CSS files
import '../styles/main.css';
import './popup.css';
import { 
  DEFAULT_VALUES, 
  STORAGE_KEYS, 
  ERROR_MESSAGES 
} from '@/utils/constants';

export class HeadForgePopup {
  private form!: HTMLFormElement;
  // Preview elements removed
  private themeToggle!: HTMLElement;
  private headerBanner!: HTMLImageElement;
  private settingsBtn!: HTMLElement;
  private generateBtn!: HTMLElement;
  private clearBtn!: HTMLElement;
  private copyBtn!: HTMLElement;
  private downloadBtn!: HTMLElement;
  // Insert button removed
  private loadingOverlay!: HTMLElement;
  private toastContainer!: HTMLElement;
  
  private currentLanguage: LanguageConfig | null = null;
  private userPreferences: UserPreferences = this.getDefaultPreferences();
  private isCopying: boolean = false;
  private isDownloading: boolean = false;
  private updateChecker: UpdateCheckerUI | null = null;
  private devModeClicks: number = 0;
  private isDevMode: boolean = false;
  private randomButton!: HTMLElement;
  private headerContainer!: HTMLElement;
  private autoDeactivateTimer: NodeJS.Timeout | null = null;
  private autoDeactivateDuration: number = 3 * 60 * 1000; // Default 3 minutes in milliseconds
  private isAutoDeactivateActive: boolean = false;
  private timerDisplay!: HTMLElement;
  private timerText!: HTMLElement;
  private countdownInterval: NodeJS.Timeout | null = null;
  private timerCloseBtn!: HTMLElement;
  
  // Options modal elements
  private optionsModal!: HTMLElement;
  private optionsModalOverlay!: HTMLElement;
  private closeOptionsModalBtn!: HTMLElement;
  private cancelOptionsBtn!: HTMLElement;
  private saveOptionsBtn!: HTMLElement;
  private optionsNavBtns!: NodeListOf<HTMLElement>;
  private optionsTabs!: NodeListOf<HTMLElement>;
  private importFileInput!: HTMLInputElement;

  constructor() {
    this.initializeElements();
    this.setupEventListeners();
    this.loadUserPreferences();
    this.populateLanguageOptions();
    this.setupTheme();
    this.loadLastFormData();
    this.initializeUpdateChecker();
    this.updatePreview();
  }

  private initializeElements(): void {
    this.form = document.getElementById('header-form') as HTMLFormElement;
    // Preview elements removed - no longer needed
    this.themeToggle = document.getElementById('theme-toggle') as HTMLElement;
    this.settingsBtn = document.getElementById('settings-btn') as HTMLElement;
    this.randomButton = document.getElementById('random-data') as HTMLElement;
    this.headerContainer = document.getElementById('header-container') as HTMLElement;
    this.generateBtn = document.getElementById('generate-header') as HTMLElement;
    this.clearBtn = document.getElementById('clear-form') as HTMLElement;
    this.copyBtn = document.getElementById('copy-clipboard') as HTMLElement;
    this.downloadBtn = document.getElementById('download-file') as HTMLElement;
    this.loadingOverlay = document.getElementById('loading-overlay') as HTMLElement;
    this.toastContainer = document.getElementById('toast-container') as HTMLElement;
    this.headerBanner = document.getElementById('header-banner') as HTMLImageElement;
    this.timerDisplay = document.getElementById('auto-deactivate-timer') as HTMLElement;
    this.timerText = this.timerDisplay?.querySelector('.timer-text') as HTMLElement;
    this.timerCloseBtn = document.getElementById('close-dev-mode') as HTMLElement;
    
    // Initialize options modal elements
    this.optionsModal = document.getElementById('options-modal') as HTMLElement;
    this.optionsModalOverlay = this.optionsModal?.querySelector('.options-modal-overlay') as HTMLElement;
    this.closeOptionsModalBtn = document.getElementById('close-options-modal') as HTMLElement;
    this.cancelOptionsBtn = document.getElementById('cancel-options') as HTMLElement;
    this.saveOptionsBtn = document.getElementById('save-options') as HTMLElement;
    this.optionsNavBtns = document.querySelectorAll('.options-modal-nav-btn') as NodeListOf<HTMLElement>;
    this.optionsTabs = document.querySelectorAll('.options-modal-tab') as NodeListOf<HTMLElement>;
    this.importFileInput = document.getElementById('import-file') as HTMLInputElement;
  }

  private setupEventListeners(): void {
    // Form input events
    this.form.addEventListener('input', this.debounce(() => {
      this.updatePreview();
      this.saveFormData();
      this.resetAutoDeactivateTimer();
    }, 300));

    this.form.addEventListener('change', () => {
      this.updatePreview();
      this.saveFormData();
      this.resetAutoDeactivateTimer();
    });

    // Language selection
    const languageSelect = document.getElementById('language') as HTMLSelectElement;
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        this.currentLanguage = getLanguageById(target.value) ?? null;
        this.updatePreview();
        this.resetAutoDeactivateTimer();
      });
    }

    // Auto-fill dates
    const creationDateInput = document.getElementById('creationDate') as HTMLInputElement;
    const lastUpdatedInput = document.getElementById('lastUpdated') as HTMLInputElement;
    
    if (creationDateInput && !creationDateInput.value) {
      creationDateInput.value = DateUtils.getCurrentDate();
    }
    if (lastUpdatedInput && !lastUpdatedInput.value) {
      lastUpdatedInput.value = DateUtils.getCurrentDate();
    }

    // Button events
    if (this.generateBtn) this.generateBtn.addEventListener('click', () => {
      this.generateHeader();
      this.resetAutoDeactivateTimer();
    });
    if (this.clearBtn) this.clearBtn.addEventListener('click', () => {
      this.clearForm();
      this.resetAutoDeactivateTimer();
    });
    if (this.copyBtn) this.copyBtn.addEventListener('click', () => {
      this.copyToClipboard();
      this.resetAutoDeactivateTimer();
    });
    if (this.downloadBtn) this.downloadBtn.addEventListener('click', () => {
      this.downloadFile();
      this.resetAutoDeactivateTimer();
    });
    // Insert button removed
    
    // Theme toggle
    if (this.themeToggle) this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
      this.resetAutoDeactivateTimer();
    });
    
    // Settings button
    if (this.settingsBtn) this.settingsBtn.addEventListener('click', () => {
      this.openSettings();
      this.resetAutoDeactivateTimer();
    });

    // Dev mode activation (click 10 times on "Ready to generate" text)
    const statusText = document.getElementById('status-text');
    if (statusText) {
      statusText.addEventListener('click', () => {
        this.handleDevModeClick();
      });
    }

    // Random data button
    if (this.randomButton) {
      this.randomButton.addEventListener('click', () => this.generateRandomData());
    }

    // Preview toggle functionality removed - no longer needed

    // Timer close button
    if (this.timerCloseBtn) {
      this.timerCloseBtn.addEventListener('click', () => {
        this.deactivateDevMode();
      });
    }

    // Options modal events
    if (this.closeOptionsModalBtn) {
      this.closeOptionsModalBtn.addEventListener('click', () => this.closeOptionsModal());
    }
    if (this.optionsModalOverlay) {
      this.optionsModalOverlay.addEventListener('click', () => this.closeOptionsModal());
    }
    if (this.cancelOptionsBtn) {
      this.cancelOptionsBtn.addEventListener('click', () => this.closeOptionsModal());
    }
    if (this.saveOptionsBtn) {
      this.saveOptionsBtn.addEventListener('click', () => this.saveOptions());
    }
    
    // Options modal navigation
    this.optionsNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        if (tabName) {
          this.switchOptionsTab(tabName);
        }
      });
    });
    
    // Options modal advanced actions
    const exportBtn = document.getElementById('export-settings');
    const importBtn = document.getElementById('import-settings');
    const resetBtn = document.getElementById('reset-settings');
    
    if (exportBtn) exportBtn.addEventListener('click', () => this.exportSettings());
    if (importBtn) importBtn.addEventListener('click', () => this.importSettings());
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetSettings());
    if (this.importFileInput) {
      this.importFileInput.addEventListener('change', (e) => this.handleImportFile(e));
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  private populateLanguageOptions(): void {
    const languageSelect = document.getElementById('language') as HTMLSelectElement;
    
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

    // Set default language
    if (this.userPreferences.defaultLanguage) {
      languageSelect.value = this.userPreferences.defaultLanguage;
      this.currentLanguage = getLanguageById(this.userPreferences.defaultLanguage) ?? null;
    } else {
      languageSelect.value = DEFAULT_VALUES.LANGUAGE;
      this.currentLanguage = getLanguageById(DEFAULT_VALUES.LANGUAGE) ?? null;
    }
  }

  private setupTheme(): void {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('dark-mode');
    
    // Apply new theme class
    if (this.userPreferences.theme === 'dark') {
      body.classList.add('dark-mode');
    }
    // For 'light' theme, we don't add any class (uses default CSS)
    
    // Update banner based on theme
    this.updateBanner();
    
    // Update theme toggle icon
    this.updateThemeIcon();
  }

  private updateBanner(): void {
    if (!this.headerBanner) return;
    
    // Use the same banner for all themes since it's transparent
    this.headerBanner.src = '../assets/images/banner_final.png';
  }

  private toggleTheme(): void {
    // Add transition animation class
    this.themeToggle.classList.add('theme-transitioning');
    
    // Toggle between light and dark themes only
    this.userPreferences.theme = this.userPreferences.theme === 'light' ? 'dark' : 'light';
    
    // Update theme icon with animation
    this.updateThemeIcon();
    
    // Apply theme with smooth transition
    setTimeout(() => {
      this.setupTheme();
      this.saveUserPreferences();
      
      // Remove transition class after animation completes
      setTimeout(() => {
        this.themeToggle.classList.remove('theme-transitioning');
      }, 300);
    }, 50);
  }

  private updateThemeIcon(): void {
    const themeIcon = this.themeToggle.querySelector('.theme-icon') as HTMLElement;
    if (!themeIcon) return;

    // Add subtle icon transition animation
    themeIcon.style.transform = 'scale(0.9) rotate(90deg)';
    themeIcon.style.opacity = '0.6';
    
    setTimeout(() => {
      // Update icon based on theme - only light and dark
      if (this.userPreferences.theme === 'light') {
        themeIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        `;
      } else {
        themeIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        `;
      }
      
      // Restore icon appearance
      themeIcon.style.transform = 'scale(1) rotate(0deg)';
      themeIcon.style.opacity = '1';
    }, 150);
  }

  private updatePreview(): void {
    // Preview functionality removed - no longer needed
    // This method is kept for compatibility but does nothing
  }

  private initializeUpdateChecker(): void {
    try {
      this.updateChecker = new UpdateCheckerUI(document.body);
    } catch (error) {
      console.warn('Failed to initialize update checker:', error);
    }
  }

  private getFormData(): HeaderData {
    const formData = new FormData(this.form);

    return {
      fileName: formData.get('fileName') as string || '',
      project: formData.get('project') as string || '',
      author: formData.get('author') as string || '',
      creationDate: formData.get('creationDate') as string || '',
      lastUpdated: formData.get('lastUpdated') as string || '',
      version: formData.get('version') as string || '',
      description: formData.get('description') as string || '',
      dependencies: '', // Not implemented in UI yet
      license: formData.get('license') as string || '',
      status: formData.get('status') as string || '',
      language: formData.get('language') as string || '',
      usage: formData.get('usage') as string || '',
      notes: formData.get('notes') as string || '',
      todo: formData.get('todo') as string || '',
      headerType: (formData.get('headerType') as 'simple' | 'complete') || 'simple'
    };
  }

  private async generateHeader(): Promise<void> {
    if (!this.currentLanguage) {
      this.showToast('Please select a programming language', 'error');
      return;
    }

    try {
      this.showLoading(true);
      
      const formData = this.getFormData();
      const validation = ValidationUtils.validateHeaderData(formData);
      
      if (!validation.isValid) {
        this.showValidationErrors(validation.errors);
        return;
      }

      // Preview functionality removed
      
      // Enable copy and download buttons
      if (this.copyBtn) {
        this.copyBtn.removeAttribute('disabled');
        this.copyBtn.classList.remove('disabled');
      }
      if (this.downloadBtn) {
        this.downloadBtn.removeAttribute('disabled');
        this.downloadBtn.classList.remove('disabled');
      }
      
      // Auto-copy to clipboard
      await this.copyToClipboard();
      
    } catch (error) {
      this.showToast(ERROR_MESSAGES.GENERIC_ERROR, 'error');
      console.error('Error generating header:', error);
    } finally {
      this.showLoading(false);
    }
  }

  private async copyToClipboard(): Promise<void> {
    if (!this.currentLanguage) {
      this.showToast('Please select a programming language', 'error');
      return;
    }

    // Prevent multiple simultaneous calls
    if (this.isCopying) {
      console.log('Copy already in progress, skipping...');
      return;
    }
    this.isCopying = true;

    try {
      const formData = this.getFormData();
      const headerContent = templateEngine.generateHeader(formData, this.currentLanguage!);
      
      // Debug: Log the content being copied
      console.log('Copying to clipboard:', {
        content: headerContent,
        length: headerContent.length,
        language: this.currentLanguage.name,
        isExtension: typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id
      });
      
      if (!headerContent || headerContent.trim().length === 0) {
        throw new Error('Generated header content is empty');
      }
      
      console.log('Attempting to copy to clipboard...');
      await ClipboardUtils.copyToClipboard(headerContent);
      console.log('Successfully copied to clipboard!');
      this.showToast(`Header copied to clipboard (${headerContent.length} characters)`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error copying to clipboard:', {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        clipboardSupported: !!navigator.clipboard,
        isSecureContext: window.isSecureContext,
        isExtension: typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id
      });
      this.showToast(`Failed to copy to clipboard: ${errorMessage}`, 'error');
    } finally {
      this.isCopying = false;
    }
  }

  private downloadFile(): void {
    if (!this.currentLanguage) {
      this.showToast('Please select a programming language', 'error');
      return;
    }

    // Prevent multiple simultaneous calls
    if (this.isDownloading) {
      return;
    }
    this.isDownloading = true;

    try {
      const formData = this.getFormData();
      const headerContent = templateEngine.generateHeader(formData, this.currentLanguage!);
      
      // Ensure filename has proper extension
      let filename = formData.fileName || 'header';
      if (!filename.includes('.')) {
        filename = `${filename}${this.currentLanguage.extension}`;
      }
      
      FileUtils.saveFile(headerContent, filename);
      this.showToast(`File "${filename}" downloaded successfully`, 'success');
    } catch (error) {
      this.showToast('Failed to download file', 'error');
      console.error('Error downloading file:', error);
    } finally {
      this.isDownloading = false;
    }
  }

  // insertIntoEditor function removed - no longer needed

  private clearForm(): void {
    this.showCustomConfirm(
      'Are you sure you want to clear all form data?',
      () => {
        this.form.reset();
        
        // Reset dates to current date
        const creationDateInput = document.getElementById('creationDate') as HTMLInputElement;
        const lastUpdatedInput = document.getElementById('lastUpdated') as HTMLInputElement;
        creationDateInput.value = DateUtils.getCurrentDate();
        lastUpdatedInput.value = DateUtils.getCurrentDate();
        
        // Reset language to default
        const languageSelect = document.getElementById('language') as HTMLSelectElement;
        languageSelect.value = this.userPreferences.defaultLanguage || DEFAULT_VALUES.LANGUAGE;
        this.currentLanguage = getLanguageById(languageSelect.value) ?? null;
        
        // Disable copy and download buttons
        if (this.copyBtn) {
          this.copyBtn.setAttribute('disabled', 'disabled');
          this.copyBtn.classList.add('disabled');
        }
        if (this.downloadBtn) {
          this.downloadBtn.setAttribute('disabled', 'disabled');
          this.downloadBtn.classList.add('disabled');
        }
        
        this.updatePreview();
        this.saveFormData();
        this.showToast('Form cleared successfully', 'success');
      }
    );
  }

  // togglePreview function removed - no longer needed

  private openSettings(): void {
    this.showOptionsModal();
  }

  private handleKeyboardShortcuts(e: KeyboardEvent): void {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          this.generateHeader();
          break;
        case 'c':
          if (e.shiftKey) {
            e.preventDefault();
            this.copyToClipboard();
          }
          break;
        case 's':
          e.preventDefault();
          this.downloadFile();
          break;
        case 'n':
          e.preventDefault();
          this.clearForm();
          break;
      }
    }
  }

  private showValidationErrors(errors: string[]): void {
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(error => {
      error.classList.remove('show');
    });

    // Show only the first error to avoid multiple toasts
    if (errors.length > 0 && errors[0]) {
      this.showToast(errors[0], 'error');
    }
  }

  private showLoading(show: boolean): void {
    this.loadingOverlay.classList.toggle('hidden', !show);
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    // Clear any existing toasts with the same message to prevent duplicates
    this.clearDuplicateToasts(message);

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

  private clearDuplicateToasts(message: string): void {
    const existingToasts = this.toastContainer.querySelectorAll('.toast');
    existingToasts.forEach(toast => {
      const messageElement = toast.querySelector('.toast-message');
      if (messageElement && messageElement.textContent === message) {
        toast.remove();
      }
    });
  }

  private showCustomConfirm(message: string, onConfirm: () => void): void {
    const modal = document.getElementById('custom-confirm-modal');
    const messageElement = document.querySelector('.custom-confirm-message');
    const cancelBtn = document.getElementById('confirm-cancel');
    const okBtn = document.getElementById('confirm-ok');

    if (!modal || !messageElement || !cancelBtn || !okBtn) return;

    // Set the message
    messageElement.textContent = message;

    // Show the modal
    modal.style.display = 'flex';

    // Handle cancel button
    const handleCancel = () => {
      modal.style.display = 'none';
      cancelBtn.removeEventListener('click', handleCancel);
      okBtn.removeEventListener('click', handleOk);
    };

    // Handle confirm button
    const handleOk = () => {
      modal.style.display = 'none';
      onConfirm();
      cancelBtn.removeEventListener('click', handleCancel);
      okBtn.removeEventListener('click', handleOk);
    };

    // Add event listeners
    cancelBtn.addEventListener('click', handleCancel);
    okBtn.addEventListener('click', handleOk);

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Handle overlay click
    const overlay = modal.querySelector('.custom-confirm-overlay');
    if (overlay) {
      const handleOverlayClick = () => {
        handleCancel();
        overlay.removeEventListener('click', handleOverlayClick);
      };
      overlay.addEventListener('click', handleOverlayClick);
    }
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

  private async loadUserPreferences(): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        const result = await chrome.storage.sync.get(STORAGE_KEYS.USER_PREFERENCES);
        if (result[STORAGE_KEYS.USER_PREFERENCES]) {
          this.userPreferences = { ...this.userPreferences, ...result[STORAGE_KEYS.USER_PREFERENCES] };
        }
        
        // Load auto-deactivate duration from settings
        const settings = await chrome.storage.sync.get(['extensionSettings']);
        if (settings.extensionSettings?.autoDeactivateDuration) {
          this.autoDeactivateDuration = settings.extensionSettings.autoDeactivateDuration;
        }
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  }

  private async saveUserPreferences(): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        await chrome.storage.sync.set({
          [STORAGE_KEYS.USER_PREFERENCES]: this.userPreferences
        });
      }
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }

  private async loadLastFormData(): Promise<void> {
    if (!this.userPreferences.rememberLastValues) return;

    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const result = await chrome.storage.local.get(STORAGE_KEYS.LAST_HEADER_DATA);
        if (result[STORAGE_KEYS.LAST_HEADER_DATA]) {
          const data = result[STORAGE_KEYS.LAST_HEADER_DATA];
          this.populateForm(data);
        }
      }
    } catch (error) {
      console.error('Error loading last form data:', error);
    }
  }

  private async saveFormData(): Promise<void> {
    if (!this.userPreferences.rememberLastValues) return;

    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const formData = this.getFormData();
        await chrome.storage.local.set({
          [STORAGE_KEYS.LAST_HEADER_DATA]: formData
        });
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }

  private populateForm(data: HeaderData): void {
    // Populate form fields with saved data
    Object.entries(data).forEach(([key, value]) => {
      const element = document.getElementById(key) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (element && value) {
        element.value = value as string;
      }
    });

    // Update current language
    if (data.language) {
      this.currentLanguage = getLanguageById(data.language) ?? null;
    }
  }

  private getDefaultPreferences(): UserPreferences {
    // Detect system theme preference
    const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    return {
      theme: systemTheme,
      defaultLanguage: DEFAULT_VALUES.LANGUAGE,
      defaultAuthor: DEFAULT_VALUES.AUTHOR,
      defaultProject: DEFAULT_VALUES.PROJECT,
      defaultLicense: DEFAULT_VALUES.LICENSE,
      autoFillDates: true,
      rememberLastValues: true,
      exportFormat: DEFAULT_VALUES.EXPORT_FORMAT,
      showPreview: true,
      headerType: 'simple'
    };
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    }) as T;
  }

  // Dev Mode Methods
  private handleDevModeClick(): void {
    this.devModeClicks++;
    
    if (this.devModeClicks >= 10) {
      if (this.isDevMode) {
        this.deactivateDevMode();
      } else {
        this.activateDevMode();
      }
      this.devModeClicks = 0;
    } else if (this.devModeClicks === 1) {
      // Reset counter after 3 seconds if not enough clicks
      setTimeout(() => {
        this.devModeClicks = 0;
      }, 3000);
    }
  }

  private activateDevMode(): void {
    this.isDevMode = true;
    document.body.classList.add('dev-mode-active');
    
    if (this.randomButton) {
      this.randomButton.style.display = 'flex';
    }
    
    this.startAutoDeactivateTimer();
    this.showToast('🔧 Dev Mode Activated! Random button is now available. Click the × on the timer to exit early.', 'success');
  }

  private deactivateDevMode(): void {
    this.isDevMode = false;
    document.body.classList.remove('dev-mode-active');
    
    if (this.randomButton) {
      this.randomButton.style.display = 'none';
    }
    
    this.stopAutoDeactivateTimer();
    this.showToast('🔧 Dev Mode Deactivated! Click 10 times on "Ready to generate" to reactivate.', 'info');
  }

  // Auto-Deactivation Methods
  private startAutoDeactivateTimer(): void {
    if (this.autoDeactivateTimer) {
      clearTimeout(this.autoDeactivateTimer);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    this.isAutoDeactivateActive = true;
    this.showTimerDisplay();
    
    let remainingTime = this.autoDeactivateDuration;
    
    // Update display every second
    this.countdownInterval = setInterval(() => {
      remainingTime -= 1000;
      this.updateTimerDisplay(remainingTime);
      
      if (remainingTime <= 0) {
        clearInterval(this.countdownInterval!);
        this.countdownInterval = null;
      }
    }, 1000);
    
    this.autoDeactivateTimer = setTimeout(() => {
      this.deactivateDevMode();
    }, this.autoDeactivateDuration);
  }

  private stopAutoDeactivateTimer(): void {
    if (this.autoDeactivateTimer) {
      clearTimeout(this.autoDeactivateTimer);
      this.autoDeactivateTimer = null;
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.isAutoDeactivateActive = false;
    this.hideTimerDisplay();
  }

  private resetAutoDeactivateTimer(): void {
    if (this.isAutoDeactivateActive && this.isDevMode) {
      this.startAutoDeactivateTimer();
    }
  }

  private showTimerDisplay(): void {
    if (this.timerDisplay) {
      this.timerDisplay.style.display = 'flex';
    }
  }

  private hideTimerDisplay(): void {
    if (this.timerDisplay) {
      this.timerDisplay.style.display = 'none';
    }
  }

  private updateTimerDisplay(remainingTime: number): void {
    if (this.timerText) {
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      this.timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  private generateRandomData(): void {
    const randomData = {
      fileName: this.getRandomFileName(),
      project: this.getRandomProjectName(),
      author: this.getRandomAuthor(),
      version: this.getRandomVersion(),
      description: this.getRandomDescription(),
      creationDate: this.getRandomDate(),
      lastUpdated: this.getRandomDate(),
      license: this.getRandomLicense(),
      status: this.getRandomStatus(),
      usage: this.getRandomUsage(),
      dependencies: this.getRandomDependencies(),
      notes: this.getRandomNotes(),
      todo: this.getRandomTodo()
    };

    // Fill all form fields
    Object.entries(randomData).forEach(([key, value]) => {
      const element = document.getElementById(key) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      if (element) {
        if (element.type === 'checkbox') {
          (element as HTMLInputElement).checked = Boolean(value);
        } else {
          element.value = String(value || '');
          // Trigger change event to ensure form validation and preview update
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else {
        console.warn(`Element with id "${key}" not found`);
      }
    });

    // Update language to a random one
    const languages = Object.keys(languageConfigs);
    const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
    const languageSelect = document.getElementById('language') as HTMLSelectElement;
    if (languageSelect && randomLanguage) {
      languageSelect.value = randomLanguage;
      this.currentLanguage = getLanguageById(randomLanguage) ?? null;
      // Trigger change event for language selection
      languageSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Update header type randomly
    const headerTypeSelect = document.getElementById('headerType') as HTMLSelectElement;
    if (headerTypeSelect) {
      headerTypeSelect.value = Math.random() > 0.5 ? 'complete' : 'simple';
    }

    this.updatePreview();
    this.saveFormData();
    this.resetAutoDeactivateTimer();
    this.showToast('🎲 Random data generated!', 'success');
  }

  // Random data generators
  private getRandomFileName(): string {
    const extensions = ['.js', '.ts', '.py', '.java', '.cpp', '.html', '.css', '.php', '.rb', '.go'];
    const names = ['main', 'app', 'index', 'utils', 'helper', 'service', 'controller', 'model', 'view', 'config'];
    const name = names[Math.floor(Math.random() * names.length)] || 'main';
    const ext = extensions[Math.floor(Math.random() * extensions.length)] || '.js';
    return `${name}${ext}`;
  }

  private getRandomProjectName(): string {
    const adjectives = ['Awesome', 'Amazing', 'Incredible', 'Fantastic', 'Brilliant', 'Epic', 'Super', 'Ultimate', 'Pro', 'Advanced'];
    const nouns = ['Project', 'App', 'Tool', 'System', 'Framework', 'Library', 'Engine', 'Platform', 'Solution', 'Application'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)] || 'Awesome';
    const noun = nouns[Math.floor(Math.random() * nouns.length)] || 'Project';
    return `${adj} ${noun} ${Math.floor(Math.random() * 1000)}`;
  }

  private getRandomAuthor(): string {
    const firstNames = ['Alex', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Sage', 'River'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)] || 'John';
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)] || 'Doe';
    return `${firstName} ${lastName}`;
  }

  private getRandomVersion(): string {
    const major = Math.floor(Math.random() * 5) + 1;
    const minor = Math.floor(Math.random() * 20);
    const patch = Math.floor(Math.random() * 100);
    return `${major}.${minor}.${patch}`;
  }

  private getRandomDescription(): string {
    const descriptions = [
      'A powerful and efficient solution for modern development',
      'An innovative tool that revolutionizes the way we work',
      'A comprehensive system designed for optimal performance',
      'A cutting-edge application with advanced features',
      'A robust framework built for scalability and reliability',
      'A user-friendly interface with intuitive design',
      'A high-performance engine optimized for speed',
      'A flexible platform that adapts to your needs'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)] || 'A powerful and efficient solution for modern development';
  }

  private getRandomDate(): string {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    const dateString = randomDate.toISOString().split('T')[0];
    return dateString as string;
  }

  private getRandomLicense(): string {
    const licenses = ['MIT', 'GPL-3.0', 'Apache-2.0', 'BSD-3-Clause', 'ISC', 'Unlicense', 'Custom'];
    return licenses[Math.floor(Math.random() * licenses.length)] || 'MIT';
  }

  private getRandomStatus(): string {
    const statuses = ['Development', 'Stable', 'Beta', 'Deprecated'];
    return statuses[Math.floor(Math.random() * statuses.length)] || 'Development';
  }


  private getRandomUsage(): string {
    const usages = [
      'npm install && npm start',
      'python main.py',
      'java -jar app.jar',
      'g++ -o app main.cpp && ./app',
      'node index.js',
      'docker run -p 3000:3000 app',
      'git clone && cd project && make install'
    ];
    return usages[Math.floor(Math.random() * usages.length)] || 'npm install && npm start';
  }

  private getRandomDependencies(): string {
    const dependencies = [
      'react, express, mongoose',
      'vue, axios, lodash',
      'angular, rxjs, typescript',
      'jquery, bootstrap, moment',
      'lodash, moment, axios',
      'express, cors, helmet',
      'react-router, redux, styled-components'
    ];
    return dependencies[Math.floor(Math.random() * dependencies.length)] || 'react, express, mongoose';
  }

  private getRandomNotes(): string {
    const notes = [
      'This is a development version with experimental features',
      'Performance optimized for large datasets',
      'Includes comprehensive error handling',
      'Built with modern best practices',
      'Fully documented with JSDoc comments',
      'Tested on multiple browsers and devices',
      'Follows semantic versioning guidelines'
    ];
    return notes[Math.floor(Math.random() * notes.length)] || 'This is a development version with experimental features';
  }

  private getRandomTodo(): string {
    const todos = [
      'Add unit tests for all functions',
      'Implement error logging system',
      'Optimize database queries',
      'Add user authentication',
      'Create API documentation',
      'Implement caching mechanism',
      'Add internationalization support',
      'Refactor legacy code',
      'Add performance monitoring',
      'Implement CI/CD pipeline'
    ];
    return todos[Math.floor(Math.random() * todos.length)] || 'Add unit tests for all functions';
  }

  // Options Modal Methods
  private showOptionsModal(): void {
    if (this.optionsModal) {
      this.loadOptionsData();
      this.optionsModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  private closeOptionsModal(): void {
    if (this.optionsModal) {
      this.optionsModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  private switchOptionsTab(tabName: string): void {
    // Update nav buttons
    this.optionsNavBtns.forEach(btn => {
      btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // Update tab content
    this.optionsTabs.forEach(tab => {
      tab.classList.remove('active');
    });
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
      activeTab.classList.add('active');
    }
  }

  private loadOptionsData(): void {
    // Load current preferences into the modal form
    const fields = [
      'defaultLanguage',
      'defaultAuthor', 
      'defaultProject',
      'defaultLicense',
      'autoFillDates',
      'rememberLastValues',
      'showPreview',
      'enableAnalytics',
      'enableBetaFeatures'
    ];

    fields.forEach(field => {
      const element = document.getElementById(field) as HTMLInputElement | HTMLSelectElement;
      if (element) {
        if (element.type === 'checkbox') {
          (element as HTMLInputElement).checked = this.userPreferences[field as keyof UserPreferences] as boolean;
        } else if (element.tagName === 'SELECT') {
          element.value = this.userPreferences[field as keyof UserPreferences] as string;
        } else {
          element.value = this.userPreferences[field as keyof UserPreferences] as string;
        }
      }
    });

    // Set theme radio buttons
    const themeRadios = document.querySelectorAll('input[name="theme"]') as NodeListOf<HTMLInputElement>;
    themeRadios.forEach(radio => {
      radio.checked = radio.value === this.userPreferences.theme;
    });
  }

  private async saveOptions(): Promise<void> {
    try {
      // Get form data from modal
      const formData = this.getOptionsFormData();
      
      // Update user preferences
      this.userPreferences = { ...this.userPreferences, ...formData };
      
      // Save to storage
      await this.saveUserPreferences();
      
      // Apply theme changes immediately
      this.setupTheme();
      
      // Close modal
      this.closeOptionsModal();
      
      this.showToast('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Error saving options:', error);
      this.showToast('Failed to save settings', 'error');
    }
  }

  private getOptionsFormData(): Partial<UserPreferences> {
    return {
      theme: (document.querySelector('input[name="theme"]:checked') as HTMLInputElement)?.value as Theme || 'light',
      defaultLanguage: (document.getElementById('defaultLanguage') as HTMLSelectElement)?.value || DEFAULT_VALUES.LANGUAGE,
      defaultAuthor: (document.getElementById('defaultAuthor') as HTMLInputElement)?.value || DEFAULT_VALUES.AUTHOR,
      defaultProject: (document.getElementById('defaultProject') as HTMLInputElement)?.value || DEFAULT_VALUES.PROJECT,
      defaultLicense: (document.getElementById('defaultLicense') as HTMLSelectElement)?.value || DEFAULT_VALUES.LICENSE,
      autoFillDates: (document.getElementById('autoFillDates') as HTMLInputElement)?.checked || true,
      rememberLastValues: (document.getElementById('rememberLastValues') as HTMLInputElement)?.checked || true,
      showPreview: (document.getElementById('showPreview') as HTMLInputElement)?.checked || true,
      enableAnalytics: (document.getElementById('enableAnalytics') as HTMLInputElement)?.checked || false,
      enableBetaFeatures: (document.getElementById('enableBetaFeatures') as HTMLInputElement)?.checked || false
    };
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
    this.importFileInput.click();
  }

  private async handleImportFile(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;

    try {
      const text = await file.text();
      const settings = JSON.parse(text);
      
      if (!settings.preferences) {
        throw new Error('Invalid settings file format');
      }

      // Validate and apply settings
      const validPreferences = this.validateImportedSettings(settings.preferences);
      this.userPreferences = { ...this.userPreferences, ...validPreferences };
      
      // Update the modal form
      this.loadOptionsData();
      
      this.showToast('Settings imported successfully', 'success');
    } catch (error) {
      console.error('Error importing settings:', error);
      this.showToast('Failed to import settings. Please check the file format.', 'error');
    } finally {
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
    this.showCustomConfirm(
      'Are you sure you want to reset all settings to their default values? This action cannot be undone.',
      () => {
        try {
          this.userPreferences = this.getDefaultPreferences();
          this.loadOptionsData();
          this.showToast('Settings reset to defaults', 'success');
        } catch (error) {
          console.error('Error resetting settings:', error);
          this.showToast('Failed to reset settings', 'error');
        }
      }
    );
  }

  public destroy(): void {
    if (this.updateChecker) {
      this.updateChecker.destroy();
      this.updateChecker = null;
    }
  }

}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HeadForgePopup();
});
"// Force recompile" 
