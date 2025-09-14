export interface UpdateInfo {
    version: string;
    releaseDate: string;
    downloadUrl: string;
    changelog: string;
    isNewer: boolean;
}
export interface UpdateCheckerConfig {
    checkInterval: number;
    githubRepo: string;
    currentVersion: string;
}
export declare class UpdateChecker {
    private config;
    private lastCheck;
    private updateInfo;
    constructor(config: UpdateCheckerConfig);
    /**
     * Check for updates from GitHub releases
     */
    checkForUpdates(): Promise<UpdateInfo | null>;
    /**
     * Check if we should perform an automatic update check
     */
    shouldCheckForUpdates(): boolean;
    /**
     * Get cached update info
     */
    getUpdateInfo(): UpdateInfo | null;
    /**
     * Compare version strings (semantic versioning)
     */
    private isVersionNewer;
    /**
     * Get update status for display
     */
    getUpdateStatus(): {
        hasUpdate: boolean;
        currentVersion: string;
        latestVersion: string | null;
        lastCheck: Date | null;
    };
}
export declare const DEFAULT_UPDATE_CONFIG: UpdateCheckerConfig;
export declare const updateChecker: UpdateChecker;
//# sourceMappingURL=update-checker.d.ts.map