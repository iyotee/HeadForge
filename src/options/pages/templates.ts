// import { LanguageConfig } from '@/types';
import { languageConfigs } from '@/utils/language-configs';

export class TemplatesSettings {
  private container: HTMLElement;
  private customTemplates: Map<string, string> = new Map();

  constructor(container: HTMLElement) {
    this.container = container;
    this.loadCustomTemplates();
    this.render();
    this.setupEventListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="templates-settings">
        <div class="setting-group">
          <h3>Built-in Languages</h3>
          <p class="setting-description">Manage built-in programming language templates</p>
          <div class="languages-grid">
            ${this.renderBuiltInLanguages()}
          </div>
        </div>

        <div class="setting-group">
          <h3>Custom Templates</h3>
          <p class="setting-description">Add or modify custom header templates</p>
          <div class="custom-templates-container">
            <div class="add-template-section">
              <input type="text" id="new-template-language" class="form-input" placeholder="Language name (e.g., Python, Go)">
              <button id="add-template-btn" class="btn btn-primary">Add Template</button>
            </div>
            <div id="custom-templates-list" class="custom-templates-list">
              ${this.renderCustomTemplates()}
            </div>
          </div>
        </div>

        <div class="setting-group">
          <h3>Template Actions</h3>
          <div class="template-actions">
            <button id="export-templates" class="btn btn-secondary">Export Templates</button>
            <button id="import-templates" class="btn btn-secondary">Import Templates</button>
            <button id="reset-templates" class="btn btn-danger">Reset to Defaults</button>
          </div>
        </div>
      </div>
    `;
  }

  private renderBuiltInLanguages(): string {
    const languages = Object.values(languageConfigs);
    const categories = [...new Set(languages.map(lang => lang.category))];
    
    let html = '';
    categories.forEach(category => {
      html += `<div class="language-category">`;
      html += `<h4>${this.capitalizeFirst(category)}</h4>`;
      
      const categoryLanguages = languages.filter(lang => lang.category === category);
      categoryLanguages.forEach(language => {
        html += `
          <div class="language-item" data-language="${language.id}">
            <div class="language-info">
              <strong>${language.name}</strong>
              <span class="language-extensions">${language.extension}</span>
            </div>
            <div class="language-actions">
              <button class="btn btn-sm btn-outline edit-template" data-language="${language.id}">
                Edit
              </button>
              <button class="btn btn-sm btn-outline preview-template" data-language="${language.id}">
                Preview
              </button>
            </div>
          </div>
        `;
      });
      
      html += `</div>`;
    });
    
    return html;
  }

  private renderCustomTemplates(): string {
    if (this.customTemplates.size === 0) {
      return '<p class="no-templates">No custom templates yet. Add one above!</p>';
    }

    let html = '';
    this.customTemplates.forEach((template, language) => {
      html += `
        <div class="custom-template-item" data-language="${language}">
          <div class="template-header">
            <strong>${language}</strong>
            <div class="template-actions">
              <button class="btn btn-sm btn-outline edit-custom-template" data-language="${language}">
                Edit
              </button>
              <button class="btn btn-sm btn-outline preview-custom-template" data-language="${language}">
                Preview
              </button>
              <button class="btn btn-sm btn-danger delete-custom-template" data-language="${language}">
                Delete
              </button>
            </div>
          </div>
          <div class="template-preview">
            <pre><code>${this.escapeHtml(template.substring(0, 200))}${template.length > 200 ? '...' : ''}</code></pre>
          </div>
        </div>
      `;
    });

    return html;
  }

  private setupEventListeners(): void {
    // Add template button
    const addBtn = this.container.querySelector('#add-template-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addCustomTemplate());
    }

    // Built-in template actions
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.classList.contains('edit-template')) {
        const language = target.dataset.language;
        if (language) this.editBuiltInTemplate(language);
      }
      
      if (target.classList.contains('preview-template')) {
        const language = target.dataset.language;
        if (language) this.previewBuiltInTemplate(language);
      }

      if (target.classList.contains('edit-custom-template')) {
        const language = target.dataset.language;
        if (language) this.editCustomTemplate(language);
      }
      
      if (target.classList.contains('preview-custom-template')) {
        const language = target.dataset.language;
        if (language) this.previewCustomTemplate(language);
      }

      if (target.classList.contains('delete-custom-template')) {
        const language = target.dataset.language;
        if (language) this.deleteCustomTemplate(language);
      }
    });

    // Template actions
    const exportBtn = this.container.querySelector('#export-templates');
    const importBtn = this.container.querySelector('#import-templates');
    const resetBtn = this.container.querySelector('#reset-templates');

    if (exportBtn) exportBtn.addEventListener('click', () => this.exportTemplates());
    if (importBtn) importBtn.addEventListener('click', () => this.importTemplates());
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetTemplates());
  }

  private addCustomTemplate(): void {
    const languageInput = this.container.querySelector('#new-template-language') as HTMLInputElement;
    const language = languageInput.value.trim();
    
    if (!language) {
      alert('Please enter a language name');
      return;
    }

    if (this.customTemplates.has(language) || languageConfigs[language]) {
      alert('A template for this language already exists');
      return;
    }

    const template = this.getDefaultTemplate(language);
    this.customTemplates.set(language, template);
    this.saveCustomTemplates();
    this.render();
    this.setupEventListeners();
    
    languageInput.value = '';
    this.showToast(`Template for ${language} added successfully`, 'success');
  }

  private editBuiltInTemplate(languageId: string): void {
    const language = languageConfigs[languageId];
    if (!language) return;

    this.openTemplateEditor(language.name, language.template, languageId, false);
  }

  private editCustomTemplate(language: string): void {
    const template = this.customTemplates.get(language);
    if (!template) return;

    this.openTemplateEditor(language, template, language, true);
  }

  private previewBuiltInTemplate(languageId: string): void {
    const language = languageConfigs[languageId];
    if (!language) return;

    this.openTemplatePreview(language.name, language.template);
  }

  private previewCustomTemplate(language: string): void {
    const template = this.customTemplates.get(language);
    if (!template) return;

    this.openTemplatePreview(language, template);
  }

  private deleteCustomTemplate(language: string): void {
    if (confirm(`Are you sure you want to delete the template for ${language}?`)) {
      this.customTemplates.delete(language);
      this.saveCustomTemplates();
      this.render();
      this.setupEventListeners();
      this.showToast(`Template for ${language} deleted`, 'info');
    }
  }

  private openTemplateEditor(languageName: string, template: string, languageId: string, isCustom: boolean): void {
    // Create modal for template editing
    const modal = document.createElement('div');
    modal.className = 'template-editor-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit ${languageName} Template</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <textarea id="template-editor" class="template-textarea" placeholder="Enter your template here...">${this.escapeHtml(template)}</textarea>
          <div class="template-variables">
            <h4>Available Variables:</h4>
            <ul>
              <li><code>{{fileName}}</code> - File name</li>
              <li><code>{{project}}</code> - Project name</li>
              <li><code>{{author}}</code> - Author name</li>
              <li><code>{{description}}</code> - File description</li>
              <li><code>{{creationDate}}</code> - Creation date</li>
              <li><code>{{lastUpdated}}</code> - Last updated date</li>
              <li><code>{{license}}</code> - License</li>
              <li><code>{{version}}</code> - Version</li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-cancel">Cancel</button>
          <button class="btn btn-primary modal-save">Save Template</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners for modal
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const saveBtn = modal.querySelector('.modal-save');

    const closeModal = () => {
      document.body.removeChild(modal);
    };

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    
    saveBtn?.addEventListener('click', () => {
      const textarea = modal.querySelector('#template-editor') as HTMLTextAreaElement;
      const newTemplate = textarea.value;
      
      if (isCustom) {
        this.customTemplates.set(languageId, newTemplate);
        this.saveCustomTemplates();
      } else {
        // For built-in templates, we would need to implement a different approach
        // For now, we'll just show a message
        this.showToast('Built-in templates cannot be modified directly. Consider creating a custom template instead.', 'warning');
      }
      
      closeModal();
      this.render();
      this.setupEventListeners();
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  private openTemplatePreview(languageName: string, template: string): void {
    const modal = document.createElement('div');
    modal.className = 'template-preview-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${languageName} Template Preview</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <pre><code>${this.escapeHtml(template)}</code></pre>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary modal-close">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  private exportTemplates(): void {
    const exportData = {
      customTemplates: Object.fromEntries(this.customTemplates),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `headforge-templates-${new Date().toISOString().split('T')[0]}.json`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    this.showToast('Templates exported successfully', 'success');
  }

  private importTemplates(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.customTemplates) {
            this.customTemplates = new Map(Object.entries(data.customTemplates));
            this.saveCustomTemplates();
            this.render();
            this.setupEventListeners();
            this.showToast('Templates imported successfully', 'success');
          }
        } catch (error) {
          this.showToast('Failed to import templates. Please check the file format.', 'error');
        }
      };
      reader.readAsText(file);
    });
    
    input.click();
  }

  private resetTemplates(): void {
    if (confirm('Are you sure you want to reset all custom templates? This action cannot be undone.')) {
      this.customTemplates.clear();
      this.saveCustomTemplates();
      this.render();
      this.setupEventListeners();
      this.showToast('Custom templates reset successfully', 'info');
    }
  }

  private getDefaultTemplate(language: string): string {
    return `/**
 * @fileoverview ${language} file template
 * @author Your Name
 * @created ${new Date().toLocaleDateString()}
 */

// Your code here
`;
  }

  private async loadCustomTemplates(): Promise<void> {
    try {
      const result = await chrome.storage.sync.get(['customTemplates']);
      if (result.customTemplates) {
        this.customTemplates = new Map(Object.entries(result.customTemplates));
      }
    } catch (error) {
      console.error('Error loading custom templates:', error);
    }
  }

  private async saveCustomTemplates(): Promise<void> {
    try {
      await chrome.storage.sync.set({
        customTemplates: Object.fromEntries(this.customTemplates)
      });
    } catch (error) {
      console.error('Error saving custom templates:', error);
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      color: white;
      z-index: 10000;
      font-weight: 500;
    `;
    
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    
    toast.style.backgroundColor = colors[type];
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }
}