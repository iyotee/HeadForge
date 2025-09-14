import { UserPreferences } from '@/types';
export declare class GeneralSettings {
    private container;
    private settings;
    constructor(container: HTMLElement);
    private getDefaultSettings;
    private render;
    private renderLanguageOptions;
    private setupEventListeners;
    private updateSetting;
    private loadSettings;
    private updateFormValues;
    getSettings(): UserPreferences;
    setSettings(settings: UserPreferences): void;
    private capitalizeFirst;
}
//# sourceMappingURL=general.d.ts.map