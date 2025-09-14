import { HeaderData, LanguageConfig } from '../../types';
import { generateHeader } from '../../utils/template-engine';
import { getLanguageById } from '../../utils/language-configs';

export class HeaderPreview {
  private container: HTMLElement;
  private headerData: HeaderData;
  private languageConfig: LanguageConfig | null;
  private isVisible: boolean;

  constructor(container: HTMLElement) {
    this.container = container;
    this.headerData = this.getDefaultHeaderData();
    this.languageConfig = null;
    this.isVisible = true;
    this.initialize();
  }

  private getDefaultHeaderData(): HeaderData {
    return {
      fileName: '',
      project: '',
      author: '',
      creationDate: '',
      lastUpdated: '',
      version: '1.0.0',
      description: '',
      dependencies: '',
      license: 'MIT',
      status: 'Development',
      language: 'javascript',
      usage: '',
      notes: '',
      todo: '',
      headerType: 'simple'
    };
  }

  private initialize(): void {
    this.render();
    this.bindEvents();
  }

  public updateHeaderData(data: HeaderData): void {
    this.headerData = { ...data };
    this.languageConfig = getLanguageById(data.language) || null;
    this.updatePreview();
  }

  public updateLanguage(language: string): void {
    this.headerData.language = language;
    this.languageConfig = getLanguageById(language) || null;
    this.updatePreview();
  }

  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;
    this.updateVisibility();
  }

  public setVisibility(visible: boolean): void {
    this.isVisible = visible;
    this.updateVisibility();
  }

  public getPreviewContent(): string {
    if (!this.languageConfig) {
      return 'Select a language to see preview';
    }

    try {
      return generateHeader(this.headerData, this.languageConfig);
    } catch (error) {
      return `Error generating preview: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  public copyPreview(): void {
    const content = this.getPreviewContent();
    if (content && content !== 'Select a language to see preview') {
      navigator.clipboard.writeText(content).then(() => {
        this.showCopySuccess();
      }).catch(() => {
        this.showCopyError();
      });
    }
  }

  public downloadPreview(): void {
    const content = this.getPreviewContent();
    if (content && content !== 'Select a language to see preview') {
      const filename = this.getFilename();
      this.downloadFile(content, filename);
    }
  }

  public getPreviewStats(): { lines: number; characters: number; words: number } {
    const content = this.getPreviewContent();
    const lines = content.split('\n').length;
    const characters = content.length;
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    
    return { lines, characters, words };
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="header-preview ${this.isVisible ? 'visible' : 'hidden'}">
        <div class="preview-header">
          <h3>Header Preview</h3>
          <div class="preview-actions">
            <button type="button" class="btn btn-sm btn-secondary" id="copy-preview" title="Copy to clipboard">
              <span class="icon">📋</span>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" id="download-preview" title="Download as file">
              <span class="icon">💾</span>
            </button>
            <button type="button" class="btn btn-sm btn-secondary" id="toggle-preview" title="Toggle preview">
              <span class="icon">👁️</span>
            </button>
          </div>
        </div>
        
        <div class="preview-content">
          <div class="preview-stats">
            <span class="stat-item">
              <span class="stat-label">Lines:</span>
              <span class="stat-value" id="preview-lines">0</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">Characters:</span>
              <span class="stat-value" id="preview-characters">0</span>
            </span>
            <span class="stat-item">
              <span class="stat-label">Words:</span>
              <span class="stat-value" id="preview-words">0</span>
            </span>
          </div>
          
          <div class="preview-code">
            <pre><code id="preview-text">Select a language to see preview</code></pre>
          </div>
        </div>
        
        <div class="preview-footer">
          <div class="preview-info">
            <span class="language-info" id="language-info">No language selected</span>
            <span class="template-info" id="template-info"></span>
          </div>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    const copyBtn = this.container.querySelector('#copy-preview') as HTMLButtonElement;
    const downloadBtn = this.container.querySelector('#download-preview') as HTMLButtonElement;
    const toggleBtn = this.container.querySelector('#toggle-preview') as HTMLButtonElement;

    copyBtn?.addEventListener('click', () => this.copyPreview());
    downloadBtn?.addEventListener('click', () => this.downloadPreview());
    toggleBtn?.addEventListener('click', () => this.toggleVisibility());
  }

  private updatePreview(): void {
    const previewText = this.container.querySelector('#preview-text') as HTMLElement;
    const languageInfo = this.container.querySelector('#language-info') as HTMLElement;
    const templateInfo = this.container.querySelector('#template-info') as HTMLElement;

    if (previewText) {
      const content = this.getPreviewContent();
      previewText.textContent = content;
      
      // Add syntax highlighting if available
      this.applySyntaxHighlighting(previewText, content);
    }

    if (languageInfo) {
      languageInfo.textContent = this.languageConfig ? this.languageConfig.name : 'No language selected';
    }

    if (templateInfo) {
      templateInfo.textContent = this.languageConfig ? 
        `Template: ${this.languageConfig.commentStart}...` : '';
    }

    this.updateStats();
  }

  private updateStats(): void {
    const stats = this.getPreviewStats();
    
    const linesElement = this.container.querySelector('#preview-lines') as HTMLElement;
    const charactersElement = this.container.querySelector('#preview-characters') as HTMLElement;
    const wordsElement = this.container.querySelector('#preview-words') as HTMLElement;

    if (linesElement) linesElement.textContent = stats.lines.toString();
    if (charactersElement) charactersElement.textContent = stats.characters.toString();
    if (wordsElement) wordsElement.textContent = stats.words.toString();
  }

  private updateVisibility(): void {
    const previewElement = this.container.querySelector('.header-preview') as HTMLElement;
    const toggleBtn = this.container.querySelector('#toggle-preview') as HTMLButtonElement;
    
    if (previewElement) {
      previewElement.classList.toggle('visible', this.isVisible);
      previewElement.classList.toggle('hidden', !this.isVisible);
    }

    if (toggleBtn) {
      const icon = toggleBtn.querySelector('.icon') as HTMLElement;
      if (icon) {
        icon.textContent = this.isVisible ? '👁️' : '👁️‍🗨️';
      }
      toggleBtn.title = this.isVisible ? 'Hide preview' : 'Show preview';
    }
  }

  private applySyntaxHighlighting(element: HTMLElement, content: string): void {
    // Basic syntax highlighting based on language
    if (!this.languageConfig) return;

    const commentStart = this.languageConfig.commentStart;
    const commentEnd = this.languageConfig.commentEnd || '';
    const commentLine = this.languageConfig.commentLine;

    // Simple highlighting for comments
    let highlightedContent = content;
    
    if (commentLine) {
      const commentRegex = new RegExp(`(${this.escapeRegex(commentLine)}.*$)`, 'gm');
      highlightedContent = highlightedContent.replace(commentRegex, '<span class="comment">$1</span>');
    }

    if (commentStart && commentEnd) {
      const blockCommentRegex = new RegExp(`(${this.escapeRegex(commentStart)}[\\s\\S]*?${this.escapeRegex(commentEnd)})`, 'g');
      highlightedContent = highlightedContent.replace(blockCommentRegex, '<span class="comment">$1</span>');
    }

    // Update the content if highlighting was applied
    if (highlightedContent !== content) {
      element.innerHTML = highlightedContent;
    }
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private getFilename(): string {
    if (this.headerData.fileName) {
      return this.headerData.fileName;
    }

    const extension = this.languageConfig?.extension || '.txt';
    return `header${extension}`;
  }

  private downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    this.showDownloadSuccess(filename);
  }

  private showCopySuccess(): void {
    this.showMessage('Preview copied to clipboard!', 'success');
  }

  private showCopyError(): void {
    this.showMessage('Failed to copy preview', 'error');
  }

  private showDownloadSuccess(filename: string): void {
    this.showMessage(`Preview downloaded as ${filename}`, 'success');
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

  public destroy(): void {
    // Clean up any event listeners or resources
    this.container.innerHTML = '';
  }

  public resize(): void {
    // Handle resize events if needed
    this.updatePreview();
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

  public isPreviewVisible(): boolean {
    return this.isVisible;
  }

  public hasValidData(): boolean {
    return !!(this.headerData.fileName && this.headerData.project && this.headerData.author);
  }

  public getValidationErrors(): string[] {
    const errors: string[] = [];
    
    if (!this.headerData.fileName) errors.push('File name is required');
    if (!this.headerData.project) errors.push('Project name is required');
    if (!this.headerData.author) errors.push('Author is required');
    if (!this.headerData.version) errors.push('Version is required');
    if (!this.headerData.language) errors.push('Language is required');
    if (!this.headerData.license) errors.push('License is required');
    if (!this.headerData.status) errors.push('Status is required');
    // Platform validation - now optional
    // if (this.headerData.platform.length === 0) errors.push('At least one platform must be selected');
    
    return errors;
  }
}
