import { LanguageConfig, LanguageCategory } from '../../types';
export declare class LanguageSelector {
    private container;
    private selectedLanguage;
    private onLanguageChange;
    private languageConfigs;
    private searchTerm;
    private selectedCategory;
    constructor(container: HTMLElement, selectedLanguage: string | undefined, onLanguageChange: (language: string) => void);
    private initialize;
    private loadLanguageConfigs;
    setSelectedLanguage(language: string): void;
    getSelectedLanguage(): string;
    getSelectedLanguageConfig(): LanguageConfig | null;
    private render;
    private renderLanguageGrid;
    private renderSelectedLanguageInfo;
    private getFilteredLanguageConfigs;
    private getLanguageIcon;
    private getCategoryLabel;
    private bindEvents;
    private selectLanguage;
    private updateSelection;
    private updateLanguageGrid;
    private updateCategoryTabs;
    private updateSelectedInfo;
    private handleKeyboardNavigation;
    private escapeHtml;
    destroy(): void;
    refresh(): void;
    getAvailableLanguages(): LanguageConfig[];
    getLanguagesByCategory(category: LanguageCategory): LanguageConfig[];
    searchLanguages(query: string): LanguageConfig[];
}
//# sourceMappingURL=language-selector.d.ts.map