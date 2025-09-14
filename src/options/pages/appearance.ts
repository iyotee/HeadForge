import { ExtensionSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/utils/constants';

export class AppearanceSettings {
  private container: HTMLElement;
  private settings: ExtensionSettings;

  constructor(container: HTMLElement) {
    this.container = container;
    this.settings = this.getDefaultSettings();
    this.render();
    this.setupEventListeners();
    this.loadSettings();
  }

  private getDefaultSettings(): ExtensionSettings {
    return {
      ...DEFAULT_SETTINGS,
      theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    };
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="settings-grid">
        <div class="setting-group">
          <label for="theme-select">Theme</label>
          <select id="theme-select" class="form-input">
            <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Light</option>
            <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
          </select>
          <p class="setting-description">Choose your preferred theme or let it follow your system preference</p>
        </div>

        <div class="setting-group">
          <label for="font-size">Font Size</label>
          <select id="font-size" class="form-input">
            <option value="small" ${this.settings.fontSize === 'small' ? 'selected' : ''}>Small</option>
            <option value="medium" ${this.settings.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
            <option value="large" ${this.settings.fontSize === 'large' ? 'selected' : ''}>Large</option>
          </select>
          <p class="setting-description">Adjust the font size for better readability</p>
        </div>

        <div class="setting-group">
          <label for="popup-width">Popup Width (px)</label>
          <input type="number" id="popup-width" class="form-input" min="300" max="600" step="10" value="${this.settings.popupWidth}">
          <p class="setting-description">Width of the extension popup window</p>
        </div>

        <div class="setting-group">
          <label for="popup-height">Popup Height (px)</label>
          <input type="number" id="popup-height" class="form-input" min="400" max="800" step="10" value="${this.settings.popupHeight}">
          <p class="setting-description">Height of the extension popup window</p>
        </div>

        <div class="setting-group">
          <label for="accent-color">Accent Color</label>
          <input type="color" id="accent-color" class="form-input" value="${this.settings.accentColor}">
          <p class="setting-description">Primary color used throughout the interface</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="compact-mode" ${this.settings.compactMode ? 'checked' : ''}>
            <span class="checkmark"></span>
            Compact Mode
          </label>
          <p class="setting-description">Use a more compact layout with reduced spacing</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="animations" ${this.settings.animations ? 'checked' : ''}>
            <span class="checkmark"></span>
            Enable Animations
          </label>
          <p class="setting-description">Enable smooth transitions and animations</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="high-contrast" ${this.settings.highContrast ? 'checked' : ''}>
            <span class="checkmark"></span>
            High Contrast
          </label>
          <p class="setting-description">Increase contrast for better accessibility</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="debug-mode" ${this.settings.debugMode ? 'checked' : ''}>
            <span class="checkmark"></span>
            Debug Mode
          </label>
          <p class="setting-description">Show additional debug information and console logs</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="performance-monitoring" ${this.settings.performanceMonitoring ? 'checked' : ''}>
            <span class="checkmark"></span>
            Performance Monitoring
          </label>
          <p class="setting-description">Monitor and log performance metrics</p>
        </div>
      </div>
    `;
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
      case 'theme-select':
        this.settings.theme = input.value as 'light' | 'dark';
        break;
      case 'font-size':
        this.settings.fontSize = input.value as 'small' | 'medium' | 'large';
        break;
      case 'popup-width':
        this.settings.popupWidth = parseInt(input.value);
        break;
      case 'popup-height':
        this.settings.popupHeight = parseInt(input.value);
        break;
      case 'accent-color':
        this.settings.accentColor = input.value;
        break;
      case 'compact-mode':
        this.settings.compactMode = (input as HTMLInputElement).checked;
        break;
      case 'animations':
        this.settings.animations = (input as HTMLInputElement).checked;
        break;
      case 'high-contrast':
        this.settings.highContrast = (input as HTMLInputElement).checked;
        break;
      case 'debug-mode':
        this.settings.debugMode = (input as HTMLInputElement).checked;
        break;
      case 'performance-monitoring':
        this.settings.performanceMonitoring = (input as HTMLInputElement).checked;
        break;
    }
  }

  private async loadSettings(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(['extensionSettings']);
      if (result.extensionSettings) {
        this.settings = { ...this.settings, ...result.extensionSettings };
        this.updateFormValues();
      }
    } catch (error) {
      console.error('Error loading appearance settings:', error);
    }
  }

  private updateFormValues(): void {
    // Update form with loaded settings
    const inputs = {
      'theme-select': this.settings.theme,
      'font-size': this.settings.fontSize,
      'popup-width': this.settings.popupWidth,
      'popup-height': this.settings.popupHeight,
      'accent-color': this.settings.accentColor
    };

    Object.entries(inputs).forEach(([id, value]) => {
      const input = this.container.querySelector(`#${id}`) as HTMLInputElement | HTMLSelectElement;
      if (input) {
        input.value = value.toString();
      }
    });

    const checkboxes = {
      'compact-mode': this.settings.compactMode,
      'animations': this.settings.animations,
      'high-contrast': this.settings.highContrast,
      'debug-mode': this.settings.debugMode,
      'performance-monitoring': this.settings.performanceMonitoring
    };

    Object.entries(checkboxes).forEach(([id, value]) => {
      const checkbox = this.container.querySelector(`#${id}`) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = value;
      }
    });
  }

  public getSettings(): ExtensionSettings {
    return { ...this.settings };
  }

  public setSettings(settings: ExtensionSettings): void {
    this.settings = { ...settings };
    this.updateFormValues();
  }
}