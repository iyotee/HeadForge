import { ExtensionSettings } from '../../types';
import { DEFAULT_SETTINGS } from '../../utils/constants';

export class AdvancedSettings {
  private container: HTMLElement;
  private settings: ExtensionSettings;

  constructor(container: HTMLElement) {
    this.container = container;
    this.settings = { ...DEFAULT_SETTINGS };
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.loadSettings();
    this.render();
    this.bindEvents();
  }

  private async loadSettings(): Promise<void> {
    try {
      const result = await chrome.storage.local.get(['extensionSettings']);
      if (result.extensionSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...result.extensionSettings };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  private async saveSettings(): Promise<void> {
    try {
      await chrome.storage.local.set({ extensionSettings: this.settings });
      this.showSuccessMessage('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      this.showErrorMessage('Failed to save settings');
    }
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="settings-section">
        <h2>Advanced Settings</h2>
        
        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="debug-mode" ${this.settings.debugMode ? 'checked' : ''}>
            <span class="checkmark"></span>
            Debug Mode
          </label>
          <p class="setting-description">Enable debug logging and additional console output.</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="performance-monitoring" ${this.settings.performanceMonitoring ? 'checked' : ''}>
            <span class="checkmark"></span>
            Performance Monitoring
          </label>
          <p class="setting-description">Monitor and log performance metrics.</p>
        </div>

        <div class="setting-group">
          <label for="cache-size">Cache Size (MB)</label>
          <input type="number" id="cache-size" class="form-input" min="1" max="100" value="${this.settings.cacheSize}">
          <p class="setting-description">Maximum cache size for storing generated headers.</p>
        </div>

        <div class="setting-group">
          <label for="max-history">Max History Items</label>
          <input type="number" id="max-history" class="form-input" min="10" max="1000" value="${this.settings.maxHistory}">
          <p class="setting-description">Maximum number of history items to keep.</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="auto-save" ${this.settings.autoSave ? 'checked' : ''}>
            <span class="checkmark"></span>
            Auto Save
          </label>
          <p class="setting-description">Automatically save form data as you type.</p>
        </div>

        <div class="setting-group">
          <label for="auto-save-delay">Auto Save Delay (ms)</label>
          <input type="number" id="auto-save-delay" class="form-input" min="500" max="10000" step="500" value="${this.settings.autoSaveDelay}">
          <p class="setting-description">Delay before auto-saving form data.</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="experimental-features" ${this.settings.experimentalFeatures ? 'checked' : ''}>
            <span class="checkmark"></span>
            Experimental Features
          </label>
          <p class="setting-description">Enable experimental and beta features.</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="telemetry" ${this.settings.telemetry ? 'checked' : ''}>
            <span class="checkmark"></span>
            Anonymous Usage Analytics
          </label>
          <p class="setting-description">Help improve HeadForge by sharing anonymous usage data.</p>
        </div>

        <div class="setting-group">
          <label for="update-frequency">Update Check Frequency</label>
          <select id="update-frequency" class="form-select">
            <option value="daily" ${this.settings.updateFrequency === 'daily' ? 'selected' : ''}>Daily</option>
            <option value="weekly" ${this.settings.updateFrequency === 'weekly' ? 'selected' : ''}>Weekly</option>
            <option value="monthly" ${this.settings.updateFrequency === 'monthly' ? 'selected' : ''}>Monthly</option>
            <option value="never" ${this.settings.updateFrequency === 'never' ? 'selected' : ''}>Never</option>
          </select>
          <p class="setting-description">How often to check for extension updates.</p>
        </div>

        <div class="setting-group">
          <label for="backup-frequency">Backup Frequency</label>
          <select id="backup-frequency" class="form-select">
            <option value="daily" ${this.settings.backupFrequency === 'daily' ? 'selected' : ''}>Daily</option>
            <option value="weekly" ${this.settings.backupFrequency === 'weekly' ? 'selected' : ''}>Weekly</option>
            <option value="monthly" ${this.settings.backupFrequency === 'monthly' ? 'selected' : ''}>Monthly</option>
            <option value="never" ${this.settings.backupFrequency === 'never' ? 'selected' : ''}>Never</option>
          </select>
          <p class="setting-description">How often to backup your settings and data.</p>
        </div>

        <div class="setting-group">
          <label class="form-checkbox">
            <input type="checkbox" id="strict-validation" ${this.settings.strictValidation ? 'checked' : ''}>
            <span class="checkmark"></span>
            Strict Validation
          </label>
          <p class="setting-description">Enable strict validation for all form inputs.</p>
        </div>

        <div class="setting-group">
          <label for="timeout-duration">Request Timeout (ms)</label>
          <input type="number" id="timeout-duration" class="form-input" min="1000" max="30000" step="1000" value="${this.settings.timeoutDuration}">
          <p class="setting-description">Timeout duration for extension operations.</p>
        </div>

        <div class="setting-group">
          <label for="max-retries">Max Retries</label>
          <input type="number" id="max-retries" class="form-input" min="0" max="10" value="${this.settings.maxRetries}">
          <p class="setting-description">Maximum number of retries for failed operations.</p>
        </div>

        <div class="setting-group">
          <label for="auto-deactivate-duration">Dev Mode Auto-Deactivation (minutes)</label>
          <input type="number" id="auto-deactivate-duration" class="form-input" min="1" max="60" value="${this.settings.autoDeactivateDuration / 60000}">
          <p class="setting-description">How long before Dev Mode automatically deactivates (1-60 minutes).</p>
        </div>

        <div class="setting-actions">
          <button type="button" id="clear-cache" class="btn btn-warning">Clear Cache</button>
          <button type="button" id="clear-history" class="btn btn-warning">Clear History</button>
          <button type="button" id="export-settings" class="btn btn-secondary">Export Settings</button>
          <button type="button" id="import-settings" class="btn btn-secondary">Import Settings</button>
          <button type="button" id="reset-advanced" class="btn btn-danger">Reset to Defaults</button>
          <button type="button" id="save-advanced" class="btn btn-primary">Save Settings</button>
        </div>

        <div class="danger-zone">
          <h3>Danger Zone</h3>
          <p>These actions cannot be undone. Please proceed with caution.</p>
          
          <div class="setting-actions">
            <button type="button" id="reset-all-data" class="btn btn-danger">Reset All Data</button>
            <button type="button" id="uninstall-extension" class="btn btn-danger">Uninstall Extension</button>
          </div>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    // Checkboxes
    const checkboxes = this.container.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        this.updateCheckboxSetting(target);
      });
    });

    // Number inputs
    const numberInputs = this.container.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        this.updateNumberSetting(target);
      });
    });

    // Select inputs
    const selectInputs = this.container.querySelectorAll('select');
    selectInputs.forEach(select => {
      select.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        this.updateSelectSetting(target);
      });
    });

    // Action buttons
    this.bindActionButtons();
  }

  private updateCheckboxSetting(checkbox: HTMLInputElement): void {
    const id = checkbox.id;
    
    switch (id) {
      case 'debug-mode':
        this.settings.debugMode = checkbox.checked;
        break;
      case 'performance-monitoring':
        this.settings.performanceMonitoring = checkbox.checked;
        break;
      case 'auto-save':
        this.settings.autoSave = checkbox.checked;
        break;
      case 'experimental-features':
        this.settings.experimentalFeatures = checkbox.checked;
        break;
      case 'telemetry':
        this.settings.telemetry = checkbox.checked;
        break;
      case 'strict-validation':
        this.settings.strictValidation = checkbox.checked;
        break;
    }
  }

  private updateNumberSetting(input: HTMLInputElement): void {
    const id = input.id;
    const value = parseInt(input.value);
    
    switch (id) {
      case 'cache-size':
        this.settings.cacheSize = value;
        break;
      case 'max-history':
        this.settings.maxHistory = value;
        break;
      case 'auto-save-delay':
        this.settings.autoSaveDelay = value;
        break;
      case 'timeout-duration':
        this.settings.timeoutDuration = value;
        break;
      case 'max-retries':
        this.settings.maxRetries = value;
        break;
      case 'auto-deactivate-duration':
        this.settings.autoDeactivateDuration = value * 60000; // Convert minutes to milliseconds
        break;
    }
  }

  private updateSelectSetting(select: HTMLSelectElement): void {
    const id = select.id;
    const value = select.value;
    
    switch (id) {
      case 'update-frequency':
        this.settings.updateFrequency = value as 'daily' | 'weekly' | 'monthly' | 'never';
        break;
      case 'backup-frequency':
        this.settings.backupFrequency = value as 'daily' | 'weekly' | 'monthly' | 'never';
        break;
    }
  }

  private bindActionButtons(): void {
    // Clear cache
    const clearCacheBtn = this.container.querySelector('#clear-cache') as HTMLButtonElement;
    clearCacheBtn?.addEventListener('click', () => this.clearCache());

    // Clear history
    const clearHistoryBtn = this.container.querySelector('#clear-history') as HTMLButtonElement;
    clearHistoryBtn?.addEventListener('click', () => this.clearHistory());

    // Export settings
    const exportBtn = this.container.querySelector('#export-settings') as HTMLButtonElement;
    exportBtn?.addEventListener('click', () => this.exportSettings());

    // Import settings
    const importBtn = this.container.querySelector('#import-settings') as HTMLButtonElement;
    importBtn?.addEventListener('click', () => this.importSettings());

    // Reset advanced
    const resetBtn = this.container.querySelector('#reset-advanced') as HTMLButtonElement;
    resetBtn?.addEventListener('click', () => this.resetToDefaults());

    // Save advanced
    const saveBtn = this.container.querySelector('#save-advanced') as HTMLButtonElement;
    saveBtn?.addEventListener('click', () => this.saveSettings());

    // Danger zone buttons
    const resetAllBtn = this.container.querySelector('#reset-all-data') as HTMLButtonElement;
    resetAllBtn?.addEventListener('click', () => this.resetAllData());

    const uninstallBtn = this.container.querySelector('#uninstall-extension') as HTMLButtonElement;
    uninstallBtn?.addEventListener('click', () => this.uninstallExtension());
  }

  private async clearCache(): Promise<void> {
    if (confirm('Are you sure you want to clear the cache? This will remove all cached data.')) {
      try {
        await chrome.storage.local.remove(['cache', 'generatedHeaders']);
        this.showSuccessMessage('Cache cleared successfully!');
      } catch (error) {
        this.showErrorMessage('Failed to clear cache');
      }
    }
  }

  private async clearHistory(): Promise<void> {
    if (confirm('Are you sure you want to clear the history? This will remove all history items.')) {
      try {
        await chrome.storage.local.remove(['history', 'lastFormData']);
        this.showSuccessMessage('History cleared successfully!');
      } catch (error) {
        this.showErrorMessage('Failed to clear history');
      }
    }
  }

  private async exportSettings(): Promise<void> {
    try {
      const settings = await chrome.storage.local.get(null);
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'headforge-settings.json';
      link.click();
      
      URL.revokeObjectURL(url);
      this.showSuccessMessage('Settings exported successfully!');
    } catch (error) {
      this.showErrorMessage('Failed to export settings');
    }
  }

  private async importSettings(): Promise<void> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const settings = JSON.parse(text);
          
          if (confirm('Are you sure you want to import these settings? This will overwrite your current settings.')) {
            await chrome.storage.local.clear();
            await chrome.storage.local.set(settings);
            this.showSuccessMessage('Settings imported successfully!');
            location.reload();
          }
        } catch (error) {
          this.showErrorMessage('Failed to import settings. Please check the file format.');
        }
      }
    };
    
    input.click();
  }

  private async resetToDefaults(): Promise<void> {
    if (confirm('Are you sure you want to reset advanced settings to defaults?')) {
      this.settings = { ...DEFAULT_SETTINGS };
      this.render();
      this.bindEvents();
      await this.saveSettings();
    }
  }

  private async resetAllData(): Promise<void> {
    if (confirm('Are you sure you want to reset ALL data? This will remove all settings, history, and cache. This action cannot be undone.')) {
      if (confirm('This is your final warning. All data will be permanently deleted.')) {
        try {
          await chrome.storage.local.clear();
          this.showSuccessMessage('All data reset successfully!');
          location.reload();
        } catch (error) {
          this.showErrorMessage('Failed to reset data');
        }
      }
    }
  }

  private async uninstallExtension(): Promise<void> {
    if (confirm('Are you sure you want to uninstall the extension? This will remove all data and the extension will be disabled.')) {
      if (confirm('This is your final warning. The extension will be uninstalled.')) {
        try {
          await chrome.management.uninstallSelf();
        } catch (error) {
          this.showErrorMessage('Failed to uninstall extension');
        }
      }
    }
  }

  private showSuccessMessage(message: string): void {
    this.showMessage(message, 'success');
  }

  private showErrorMessage(message: string): void {
    this.showMessage(message, 'error');
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    const messageDiv = document.createElement('div');
    messageDiv.className = `toast toast-${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
}
