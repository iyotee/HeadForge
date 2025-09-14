import { Message, BrowserAPI } from '@/types';
import { MESSAGE_TYPES } from '@/utils/constants';

class HeadForgeBackground {
  private browserAPI: any;

  constructor() {
    this.browserAPI = this.getBrowserAPI();
    this.setupMessageListener();
    this.setupInstallListener();
    this.setupUpdateListener();
  }

  private getBrowserAPI(): any {
    const browser = (globalThis as any).browser || chrome;
    
    return {
      storage: {
        local: {
          get: (keys?: string | string[] | object) => 
            new Promise((resolve) => browser.storage.local.get(keys, resolve)),
          set: (items: object) => 
            new Promise((resolve) => browser.storage.local.set(items, resolve)),
          remove: (keys: string | string[]) => 
            new Promise((resolve) => browser.storage.local.remove(keys, resolve)),
          clear: () => 
            new Promise((resolve) => browser.storage.local.clear(resolve))
        },
        sync: {
          get: (keys?: string | string[] | object) => 
            new Promise((resolve) => browser.storage.sync.get(keys, resolve)),
          set: (items: object) => 
            new Promise((resolve) => browser.storage.sync.set(items, resolve)),
          remove: (keys: string | string[]) => 
            new Promise((resolve) => browser.storage.sync.remove(keys, resolve)),
          clear: () => 
            new Promise((resolve) => browser.storage.sync.clear(resolve))
        }
      },
      clipboard: {
        writeText: (text: string) => 
          new Promise((resolve, reject) => {
            if (browser.clipboard && browser.clipboard.writeText) {
              browser.clipboard.writeText(text).then(resolve).catch(reject);
            } else {
              reject(new Error('Clipboard API not available'));
            }
          })
      },
      tabs: {
        query: (queryInfo: any) => 
          new Promise((resolve) => browser.tabs.query(queryInfo, resolve)),
        sendMessage: (tabId: number, message: any) => 
          new Promise((resolve, reject) => {
            browser.tabs.sendMessage(tabId, message, (response: any) => {
              if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);
              } else {
                resolve(response);
              }
            });
          })
      },
      runtime: {
        sendMessage: (message: any) => 
          new Promise((resolve, reject) => {
            browser.runtime.sendMessage(message, (response: any) => {
              if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);
              } else {
                resolve(response);
              }
            });
          }),
        onMessage: {
          addListener: (callback: (message: any, sender: any, sendResponse: any) => void) => {
            browser.runtime.onMessage.addListener(callback);
          },
          removeListener: (callback: (message: any, sender: any, sendResponse: any) => void) => {
            browser.runtime.onMessage.removeListener(callback);
          }
        },
        onInstalled: {
          addListener: (callback: (details: any) => void) => {
            browser.runtime.onInstalled.addListener(callback);
          }
        },
        onStartup: {
          addListener: (callback: () => void) => {
            browser.runtime.onStartup.addListener(callback);
          }
        }
      } as any
    };
  }

  private setupMessageListener(): void {
    this.browserAPI.runtime.onMessage.addListener((message: Message, sender: any, sendResponse: any) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async response
    });
  }

  private async handleMessage(message: Message, sender: any, sendResponse: (response?: any) => void): Promise<void> {
    try {
      let response: any;

      switch (message.type) {
        case MESSAGE_TYPES.GENERATE_HEADER:
          response = await this.handleGenerateHeader(message.payload);
          break;

        case MESSAGE_TYPES.EXPORT_HEADER:
          response = await this.handleExportHeader(message.payload);
          break;

        case MESSAGE_TYPES.SAVE_PREFERENCES:
          response = await this.handleSavePreferences(message.payload);
          break;

        case MESSAGE_TYPES.LOAD_PREFERENCES:
          response = await this.handleLoadPreferences();
          break;

        case MESSAGE_TYPES.UPDATE_THEME:
          response = await this.handleUpdateTheme(message.payload);
          break;

        case MESSAGE_TYPES.VALIDATE_DATA:
          response = await this.handleValidateData(message.payload);
          break;

        case MESSAGE_TYPES.GET_LANGUAGES:
          response = await this.handleGetLanguages();
          break;

        case MESSAGE_TYPES.GET_TEMPLATE:
          response = await this.handleGetTemplate(message.payload);
          break;

        default:
          response = { error: 'Unknown message type' };
      }

      sendResponse(response);
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  private async handleGenerateHeader(payload: any): Promise<any> {
    try {
      // Import template engine dynamically to avoid circular dependencies
      const { templateEngine } = await import('../utils/template-engine');
      const { getLanguageById } = await import('../utils/language-configs');
      
      const { headerData, languageId } = payload;
      const language = getLanguageById(languageId);
      
      if (!language) {
        throw new Error('Language not found');
      }

      const headerContent = templateEngine.generateHeader(headerData, language);
      
      return {
        success: true,
        headerContent,
        language
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async handleExportHeader(payload: any): Promise<any> {
    try {
      const { headerContent, exportOptions } = payload;
      
      switch (exportOptions.format) {
        case 'clipboard':
          await this.browserAPI.clipboard.writeText(headerContent);
          return { success: true, message: 'Header copied to clipboard' };

        case 'file':
          // File download is handled in the popup/content script
          return { success: true, message: 'File download initiated' };

        case 'insert':
          // Insert into editor is handled by content script
          return { success: true, message: 'Header insertion initiated' };

        default:
          throw new Error('Unknown export format');
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async handleSavePreferences(payload: any): Promise<any> {
    try {
      await this.browserAPI.storage.sync.set({
        userPreferences: payload
      });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async handleLoadPreferences(): Promise<any> {
    try {
      const result = await this.browserAPI.storage.sync.get('userPreferences');
      return {
        success: true,
        preferences: (result as any).userPreferences || {}
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async handleUpdateTheme(payload: any): Promise<any> {
    try {
      const { theme } = payload;
      
      // Update theme in storage
      await this.browserAPI.storage.sync.set({
        theme
      });

      // Notify all tabs about theme change
      const tabs = await this.browserAPI.tabs.query({});
      tabs.forEach((tab: any) => {
        if (tab.id) {
          this.browserAPI.tabs.sendMessage(tab.id, {
            type: 'THEME_CHANGED',
            payload: { theme }
          }).catch(() => {
            // Ignore errors for tabs that don't have content scripts
          });
        }
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async handleValidateData(payload: any): Promise<any> {
    try {
      const { ValidationUtils } = await import('../utils/validation');
      const validation = ValidationUtils.validateHeaderData(payload);
      
      return {
        success: true,
        validation
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async handleGetLanguages(): Promise<any> {
    try {
      const { languageConfigs } = await import('../utils/language-configs');
      
      return {
        success: true,
        languages: languageConfigs
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async handleGetTemplate(payload: any): Promise<any> {
    try {
      const { getLanguageById } = await import('../utils/language-configs');
      const { templateEngine } = await import('../utils/template-engine');
      
      const { languageId, headerData } = payload;
      const language = getLanguageById(languageId);
      
      if (!language) {
        throw new Error('Language not found');
      }

      const template = language.template;
      const preview = templateEngine.generateHeader(headerData, language);
      
      return {
        success: true,
        template,
        preview,
        language
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private setupInstallListener(): void {
    this.browserAPI.runtime.onInstalled.addListener((details: any) => {
      if (details.reason === 'install') {
        this.handleInstall();
      } else if (details.reason === 'update') {
        this.handleUpdate(details.previousVersion);
      }
    });
  }

  private async handleInstall(): Promise<void> {
    try {
      // Set default preferences
      const defaultPreferences = {
        theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        defaultLanguage: 'javascript',
        defaultAuthor: 'Satoshiba',
        defaultProject: 'SYNCLY - YouTube PVR Extension',
        defaultLicense: 'MIT',
        autoFillDates: true,
        rememberLastValues: true,
        exportFormat: 'clipboard',
        showPreview: true
      };

      await this.browserAPI.storage.sync.set({
        userPreferences: defaultPreferences
      });

      // Open welcome page or show notification
      console.log('HeadForge extension installed successfully');
    } catch (error) {
      console.error('Error during installation:', error);
    }
  }

  private async handleUpdate(previousVersion?: string): Promise<void> {
    try {
      console.log(`HeadForge updated from ${previousVersion} to ${chrome.runtime.getManifest().version}`);
      
      // Handle any migration logic here
      await this.migrateData(previousVersion);
    } catch (error) {
      console.error('Error during update:', error);
    }
  }

  private async migrateData(previousVersion?: string): Promise<void> {
    // Add migration logic for different versions
    if (!previousVersion) return;

    const currentVersion = chrome.runtime.getManifest().version;
    
    // Example migration logic
    if (this.isVersionLessThan(previousVersion, '1.1.0')) {
      // Migrate data from version < 1.1.0 to 1.1.0
      console.log('Migrating data for version 1.1.0');
    }
  }

  private isVersionLessThan(version1: string, version2: string): boolean {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part < v2Part) return true;
      if (v1Part > v2Part) return false;
    }
    
    return false;
  }

  private setupUpdateListener(): void {
    // Listen for extension updates
    this.browserAPI.runtime.onStartup.addListener(() => {
      console.log('HeadForge extension started');
    });
  }
}

// Initialize the background script
new HeadForgeBackground();
