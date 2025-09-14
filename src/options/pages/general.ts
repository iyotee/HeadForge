import { UserPreferences } from '@/types';
import { languageConfigs } from '@/utils/language-configs';
import { DEFAULT_VALUES, STORAGE_KEYS } from '@/utils/constants';

export class GeneralSettings {
  private container: HTMLElement;
  private settings: UserPreferences;

  constructor(container: HTMLElement) {
    this.container = container;
    this.settings = this.getDefaultSettings();
    this.render();
    this.setupEventListeners();
    this.loadSettings();
  }

  private getDefaultSettings(): UserPreferences {
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

  private render(): void {
    this.container.innerHTML = `
      <div class="settings-grid">
        <div class="setting-group">
          <label for="default-author">Default Author</label>
          <input type="text" id="default-author" class="form-input" placeholder="Your Name" value="${this.settings.defaultAuthor}">
          <p class="setting-description">Default author name for new headers</p>
        </div>

        <div class="setting-group">
          <label for="default-project">Default Project</label>
          <input type="text" id="default-project" class="form-input" placeholder="Project Name" value="${this.settings.defaultProject}">
          <p class="setting-description">Default project name for new headers</p>
        </div>

        <div class="setting-group">
          <label for="default-language">Default Language</label>
          <select id="default-language" class="form-input">
            ${this.renderLanguageOptions()}
          </select>
          <p class="setting-description">Default programming language for new headers</p>
        </div>

        <div class="setting-group">
          <label for="default-license">Default License</label>
          <select id="default-license" class="form-input">
            <option value="MIT" ${this.settings.defaultLicense === 'MIT' ? 'selected' : ''}>MIT</option>
            <option value="Apache-2.0" ${this.settings.defaultLicense === 'Apache-2.0' ? 'selected' : ''}>Apache 2.0</option>
            <option value="GPL-3.0" ${this.settings.defaultLicense === 'GPL-3.0' ? 'selected' : ''}>GPL 3.0</option>
            <option value="BSD-3-Clause" ${this.settings.defaultLicense === 'BSD-3-Clause' ? 'selected' : ''}>BSD 3-Clause</option>
            <option value="ISC" ${this.settings.defaultLicense === 'ISC' ? 'selected' : ''}>ISC</option>
            <option value="Unlicense" ${this.settings.defaultLicense === 'Unlicense' ? 'selected' : ''}>Unlicense</option>
          </select>
          <p class="setting-description">Default license for new headers</p>
        </div>

        <div class="setting-group">
          <label for="export-format">Export Format</label>
          <select id="export-format" class="form-input">
            <option value="clipboard" ${this.settings.exportFormat === 'clipboard' ? 'selected' : ''}>Copy to Clipboard</option>
            <option value="file" ${this.settings.exportFormat === 'file' ? 'selected' : ''}>Download File</option>
            <option value="insert" ${this.settings.exportFormat === 'insert' ? 'selected' : ''}>Insert into Editor</option>
          </select>
          <p class="setting-description">Default export method for generated headers</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="auto-fill-dates" ${this.settings.autoFillDates ? 'checked' : ''}>
            <span class="checkmark"></span>
            Auto-fill Dates
          </label>
          <p class="setting-description">Automatically fill creation and update dates</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="remember-last-values" ${this.settings.rememberLastValues ? 'checked' : ''}>
            <span class="checkmark"></span>
            Remember Last Values
          </label>
          <p class="setting-description">Remember form values between sessions</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="show-preview" ${this.settings.showPreview ? 'checked' : ''}>
            <span class="checkmark"></span>
            Show Preview
          </label>
          <p class="setting-description">Show live preview of generated headers</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="enable-analytics" ${this.settings.enableAnalytics ? 'checked' : ''}>
            <span class="checkmark"></span>
            Enable Analytics
          </label>
          <p class="setting-description">Help improve HeadForge by sharing anonymous usage data</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="enable-beta-features" ${this.settings.enableBetaFeatures ? 'checked' : ''}>
            <span class="checkmark"></span>
            Enable Beta Features
          </label>
          <p class="setting-description">Access experimental features (may be unstable)</p>
        </div>
      </div>
    `;
  }

  private renderLanguageOptions(): string {
    const languageArray = Object.values(languageConfigs);
    const categories = [...new Set(languageArray.map(lang => lang.category))];
    
    let options = '';
    categories.forEach(category => {
      options += `<optgroup label="${this.capitalizeFirst(category)}">`;
      const categoryLanguages = languageArray.filter(lang => lang.category === category);
      categoryLanguages.forEach(language => {
        const selected = this.settings.defaultLanguage === language.id ? 'selected' : '';
        options += `<option value="${language.id}" ${selected}>${language.name}</option>`;
      });
      options += '</optgroup>';
    });
    
    return options;
  }

  private setupEventListeners(): void {
    // Input changes
    this.container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      this.updateSetting(target);
    });

    this.container.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      this.updateSetting(target);
    });
  }

  private updateSetting(input: HTMLInputElement | HTMLSelectElement): void {
    const id = input.id;
    
    switch (id) {
      case 'default-author':
        this.settings.defaultAuthor = input.value;
        break;
      case 'default-project':
        this.settings.defaultProject = input.value;
        break;
      case 'default-language':
        this.settings.defaultLanguage = input.value;
        break;
      case 'default-license':
        this.settings.defaultLicense = input.value;
        break;
      case 'export-format':
        this.settings.exportFormat = input.value as 'clipboard' | 'file' | 'insert';
        break;
      case 'auto-fill-dates':
        this.settings.autoFillDates = (input as HTMLInputElement).checked;
        break;
      case 'remember-last-values':
        this.settings.rememberLastValues = (input as HTMLInputElement).checked;
        break;
      case 'show-preview':
        this.settings.showPreview = (input as HTMLInputElement).checked;
        break;
      case 'enable-analytics':
        this.settings.enableAnalytics = (input as HTMLInputElement).checked;
        break;
      case 'enable-beta-features':
        this.settings.enableBetaFeatures = (input as HTMLInputElement).checked;
        break;
    }
  }

  private async loadSettings(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(STORAGE_KEYS.USER_PREFERENCES);
      if (result[STORAGE_KEYS.USER_PREFERENCES]) {
        this.settings = { ...this.settings, ...result[STORAGE_KEYS.USER_PREFERENCES] };
        this.updateFormValues();
      }
    } catch (error) {
      console.error('Error loading general settings:', error);
    }
  }

  private updateFormValues(): void {
    // Update form with loaded settings
    const inputs = {
      'default-author': this.settings.defaultAuthor,
      'default-project': this.settings.defaultProject,
      'default-language': this.settings.defaultLanguage,
      'default-license': this.settings.defaultLicense,
      'export-format': this.settings.exportFormat
    };

    Object.entries(inputs).forEach(([id, value]) => {
      const input = this.container.querySelector(`#${id}`) as HTMLInputElement | HTMLSelectElement;
      if (input) {
        input.value = value;
      }
    });

    const checkboxes = {
      'auto-fill-dates': this.settings.autoFillDates,
      'remember-last-values': this.settings.rememberLastValues,
      'show-preview': this.settings.showPreview,
      'enable-analytics': this.settings.enableAnalytics,
      'enable-beta-features': this.settings.enableBetaFeatures
    };

    Object.entries(checkboxes).forEach(([id, value]) => {
      const checkbox = this.container.querySelector(`#${id}`) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = value ?? false;
      }
    });
  }

  public getSettings(): UserPreferences {
    return { ...this.settings };
  }

  public setSettings(settings: UserPreferences): void {
    this.settings = { ...settings };
    this.updateFormValues();
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}