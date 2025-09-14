import { ExtensionSettings } from '@/types';
export declare class AppearanceSettings {
    private container;
    private settings;
    constructor(container: HTMLElement);
    private getDefaultSettings;
    private render;
    private setupEventListeners;
    private updateSetting;
    private loadSettings;
    private updateFormValues;
    getSettings(): ExtensionSettings;
    setSettings(settings: ExtensionSettings): void;
}
//# sourceMappingURL=appearance.d.ts.map