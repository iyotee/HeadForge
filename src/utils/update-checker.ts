export interface UpdateInfo {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  changelog: string;
  isNewer: boolean;
}

export interface UpdateCheckerConfig {
  checkInterval: number; // in milliseconds
  githubRepo: string;
  currentVersion: string;
}

export class UpdateChecker {
  private config: UpdateCheckerConfig;
  private lastCheck: number = 0;
  private updateInfo: UpdateInfo | null = null;

  constructor(config: UpdateCheckerConfig) {
    this.config = config;
  }

  /**
   * Check for updates from GitHub releases
   */
  async checkForUpdates(): Promise<UpdateInfo | null> {
    try {
      const response = await fetch(`https://api.github.com/repos/${this.config.githubRepo}/releases/latest`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const release = await response.json();
      const latestVersion = release.tag_name.replace('v', '');
      const isNewer = this.isVersionNewer(latestVersion, this.config.currentVersion);

      this.updateInfo = {
        version: latestVersion,
        releaseDate: release.published_at,
        downloadUrl: release.html_url,
        changelog: release.body || 'No changelog available',
        isNewer
      };

      this.lastCheck = Date.now();
      return this.updateInfo;
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return null;
    }
  }

  /**
   * Check if we should perform an automatic update check
   */
  shouldCheckForUpdates(): boolean {
    const now = Date.now();
    return (now - this.lastCheck) > this.config.checkInterval;
  }

  /**
   * Get cached update info
   */
  getUpdateInfo(): UpdateInfo | null {
    return this.updateInfo;
  }

  /**
   * Compare version strings (semantic versioning)
   */
  private isVersionNewer(version1: string, version2: string): boolean {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;

      if (v1Part > v2Part) return true;
      if (v1Part < v2Part) return false;
    }

    return false;
  }

  /**
   * Get update status for display
   */
  getUpdateStatus(): {
    hasUpdate: boolean;
    currentVersion: string;
    latestVersion: string | null;
    lastCheck: Date | null;
  } {
    return {
      hasUpdate: this.updateInfo?.isNewer || false,
      currentVersion: this.config.currentVersion,
      latestVersion: this.updateInfo?.version || null,
      lastCheck: this.lastCheck ? new Date(this.lastCheck) : null
    };
  }
}

// Default configuration
export const DEFAULT_UPDATE_CONFIG: UpdateCheckerConfig = {
  checkInterval: 24 * 60 * 60 * 1000, // 24 hours
  githubRepo: 'iyotee/HeadForge',
  currentVersion: '1.2.22'
};

// Global update checker instance
export const updateChecker = new UpdateChecker(DEFAULT_UPDATE_CONFIG);
