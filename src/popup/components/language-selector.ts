import { LanguageConfig, LanguageCategory } from '../../types';
import { getAllLanguages } from '../../utils/language-configs';

export class LanguageSelector {
  private container: HTMLElement;
  private selectedLanguage: string;
  private onLanguageChange: (language: string) => void;
  private languageConfigs: LanguageConfig[];
  private searchTerm: string;
  private selectedCategory: LanguageCategory | 'all';

  constructor(
    container: HTMLElement,
    selectedLanguage: string = 'javascript',
    onLanguageChange: (language: string) => void
  ) {
    this.container = container;
    this.selectedLanguage = selectedLanguage;
    this.onLanguageChange = onLanguageChange;
    this.languageConfigs = [];
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.loadLanguageConfigs();
    this.render();
    this.bindEvents();
  }

  private async loadLanguageConfigs(): Promise<void> {
    try {
      this.languageConfigs = getAllLanguages();
    } catch (error) {
      console.error('Failed to load language configs:', error);
      this.languageConfigs = [];
    }
  }

  public setSelectedLanguage(language: string): void {
    this.selectedLanguage = language;
    this.updateSelection();
  }

  public getSelectedLanguage(): string {
    return this.selectedLanguage;
  }

  public getSelectedLanguageConfig(): LanguageConfig | null {
    return this.languageConfigs.find(config => config.id === this.selectedLanguage) || null;
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="language-selector">
        <div class="selector-header">
          <h3>Programming Language</h3>
          <div class="selector-search">
            <input type="text" id="language-search" class="form-input" placeholder="Search languages..." value="${this.searchTerm}">
            <span class="search-icon">🔍</span>
          </div>
        </div>
        
        <div class="category-filter">
          <div class="category-tabs">
            <button type="button" class="category-tab ${this.selectedCategory === 'all' ? 'active' : ''}" data-category="all">
              All
            </button>
            <button type="button" class="category-tab ${this.selectedCategory === 'web' ? 'active' : ''}" data-category="web">
              Web
            </button>
            <button type="button" class="category-tab ${this.selectedCategory === 'backend' ? 'active' : ''}" data-category="backend">
              Backend
            </button>
            <button type="button" class="category-tab ${this.selectedCategory === 'mobile' ? 'active' : ''}" data-category="mobile">
              Mobile
            </button>
            <button type="button" class="category-tab ${this.selectedCategory === 'desktop' ? 'active' : ''}" data-category="desktop">
              Desktop
            </button>
            <button type="button" class="category-tab ${this.selectedCategory === 'other' ? 'active' : ''}" data-category="other">
              Other
            </button>
          </div>
        </div>
        
        <div class="language-grid" id="language-grid">
          ${this.renderLanguageGrid()}
        </div>
        
        <div class="selected-language-info" id="selected-info">
          ${this.renderSelectedLanguageInfo()}
        </div>
      </div>
    `;
  }

  private renderLanguageGrid(): string {
    const filteredConfigs = this.getFilteredLanguageConfigs();
    
    if (filteredConfigs.length === 0) {
      return `
        <div class="no-languages">
          <p>No languages found matching your criteria.</p>
        </div>
      `;
    }

    return filteredConfigs.map(config => `
      <div class="language-card ${config.id === this.selectedLanguage ? 'selected' : ''}" 
           data-language="${config.id}" 
           title="${config.name}">
        <div class="language-icon">
          ${this.getLanguageIcon(config.id)}
        </div>
        <div class="language-info">
          <h4 class="language-name">${config.name}</h4>
          <p class="language-extension">${config.extension}</p>
          <span class="language-category">${this.getCategoryLabel(config.category)}</span>
        </div>
        <div class="language-preview">
          <code class="comment-preview">${config.commentLine} Sample comment</code>
        </div>
      </div>
    `).join('');
  }

  private renderSelectedLanguageInfo(): string {
    const config = this.getSelectedLanguageConfig();
    
    if (!config) {
      return `
        <div class="no-selection">
          <p>Select a language to see details</p>
        </div>
      `;
    }

    return `
      <div class="selected-details">
        <h4>${config.name}</h4>
        <div class="detail-item">
          <span class="detail-label">File Extension:</span>
          <span class="detail-value">${config.extension}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Category:</span>
          <span class="detail-value">${this.getCategoryLabel(config.category)}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Comment Style:</span>
          <span class="detail-value">${config.commentLine}</span>
        </div>
        ${config.commentEnd ? `
          <div class="detail-item">
            <span class="detail-label">Block Comments:</span>
            <span class="detail-value">${config.commentStart} ... ${config.commentEnd}</span>
          </div>
        ` : ''}
        <div class="template-preview">
          <h5>Template Preview:</h5>
          <pre><code>${this.escapeHtml(config.template.substring(0, 200))}${config.template.length > 200 ? '...' : ''}</code></pre>
        </div>
      </div>
    `;
  }

  private getFilteredLanguageConfigs(): LanguageConfig[] {
    let filtered = this.languageConfigs;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(config => config.category === this.selectedCategory);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(config => 
        config.name.toLowerCase().includes(term) ||
        config.id.toLowerCase().includes(term) ||
        config.extension.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  private getLanguageIcon(languageId: string): string {
    const icons: { [key: string]: string } = {
      javascript: '🟨',
      typescript: '🔷',
      html: '🌐',
      css: '🎨',
      python: '🐍',
      java: '☕',
      csharp: '🔷',
      cpp: '⚙️',
      c: '⚙️',
      go: '🐹',
      rust: '🦀',
      php: '🐘',
      ruby: '💎',
      swift: '🦉',
      kotlin: '🟣',
      nodejs: '🟢',
      react: '⚛️',
      vue: '💚',
      angular: '🔴',
      sql: '🗄️',
      bash: '🐚',
      powershell: '💙',
      dockerfile: '🐳',
      yaml: '📄',
      json: '📋',
      xml: '📄',
      markdown: '📝'
    };

    return icons[languageId] || '📄';
  }

  private getCategoryLabel(category: LanguageCategory): string {
    const labels: { [key in LanguageCategory]: string } = {
      web: 'Web Development',
      backend: 'Backend',
      database: 'Database',
      devops: 'DevOps',
      mobile: 'Mobile',
      desktop: 'Desktop',
      other: 'Other'
    };

    return labels[category] || 'Other';
  }

  private bindEvents(): void {
    // Search input
    const searchInput = this.container.querySelector('#language-search') as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.searchTerm = target.value;
      this.updateLanguageGrid();
    });

    // Category tabs
    const categoryTabs = this.container.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const category = target.dataset.category as LanguageCategory | 'all';
        this.selectedCategory = category;
        this.updateCategoryTabs();
        this.updateLanguageGrid();
      });
    });

    // Language cards
    const languageGrid = this.container.querySelector('#language-grid');
    languageGrid?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const languageCard = target.closest('.language-card') as HTMLElement;
      
      if (languageCard) {
        const language = languageCard.dataset.language;
        if (language) {
          this.selectLanguage(language);
        }
      }
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  private selectLanguage(language: string): void {
    this.selectedLanguage = language;
    this.updateSelection();
    this.updateSelectedInfo();
    this.onLanguageChange(language);
  }

  private updateSelection(): void {
    const languageCards = this.container.querySelectorAll('.language-card');
    languageCards.forEach(card => {
      const language = card.getAttribute('data-language');
      if (language === this.selectedLanguage) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  }

  private updateLanguageGrid(): void {
    const languageGrid = this.container.querySelector('#language-grid') as HTMLElement;
    if (languageGrid) {
      languageGrid.innerHTML = this.renderLanguageGrid();
    }
  }

  private updateCategoryTabs(): void {
    const categoryTabs = this.container.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
      const category = tab.getAttribute('data-category');
      if (category === this.selectedCategory) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  private updateSelectedInfo(): void {
    const selectedInfo = this.container.querySelector('#selected-info') as HTMLElement;
    if (selectedInfo) {
      selectedInfo.innerHTML = this.renderSelectedLanguageInfo();
    }
  }

  private handleKeyboardNavigation(e: KeyboardEvent): void {
    const languageCards = Array.from(this.container.querySelectorAll('.language-card')) as HTMLElement[];
    const currentIndex = languageCards.findIndex(card => card.classList.contains('selected'));
    
    if (currentIndex === -1) return;

    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(0, currentIndex - 3); // Assuming 3 columns
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(languageCards.length - 1, currentIndex + 3);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(languageCards.length - 1, currentIndex + 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const selectedCard = languageCards[currentIndex];
        if (selectedCard) {
          const language = selectedCard.getAttribute('data-language');
          if (language) {
            this.selectLanguage(language);
          }
        }
        return;
    }

    if (newIndex !== currentIndex && languageCards[newIndex]) {
      const language = languageCards[newIndex]?.getAttribute('data-language');
      if (language) {
        this.selectLanguage(language);
      }
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  public destroy(): void {
    this.container.innerHTML = '';
  }

  public refresh(): void {
    this.initialize();
  }

  public getAvailableLanguages(): LanguageConfig[] {
    return [...this.languageConfigs];
  }

  public getLanguagesByCategory(category: LanguageCategory): LanguageConfig[] {
    return this.languageConfigs.filter(config => config.category === category);
  }

  public searchLanguages(query: string): LanguageConfig[] {
    const term = query.toLowerCase();
    return this.languageConfigs.filter(config => 
      config.name.toLowerCase().includes(term) ||
      config.id.toLowerCase().includes(term) ||
      config.extension.toLowerCase().includes(term)
    );
  }
}
