import { updateChecker, UpdateInfo } from '../../utils/update-checker';

export class UpdateCheckerUI {
  private container: HTMLElement;
  private updateButton: HTMLButtonElement | null = null;
  private updateNotification: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.initialize();
  }

  private initialize(): void {
    this.createUpdateButton();
    this.bindEvents();
    this.checkForUpdatesOnLoad();
  }

  private createUpdateButton(): void {
    // Create a subtle update button in the bottom right
    this.updateButton = document.createElement('button');
    this.updateButton.className = 'update-checker-btn';
    this.updateButton.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3 4-3 9-3 9 1.34 9 3z"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        <path d="M12 1v6"/>
        <path d="M9 4l3-3 3 3"/>
      </svg>
    `;
    this.updateButton.title = 'Check for updates';
    
    // Position it in the bottom right corner
    this.updateButton.style.cssText = `
      position: fixed;
      bottom: 8px;
      right: 8px;
      width: 24px;
      height: 24px;
      border: none;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      z-index: 1000;
      opacity: 0.6;
    `;

    // Add hover effects
    this.updateButton.addEventListener('mouseenter', () => {
      if (this.updateButton) {
        this.updateButton.style.opacity = '1';
        this.updateButton.style.background = 'rgba(0, 0, 0, 0.2)';
        this.updateButton.style.transform = 'scale(1.1)';
      }
    });

    this.updateButton.addEventListener('mouseleave', () => {
      if (this.updateButton) {
        this.updateButton.style.opacity = '0.6';
        this.updateButton.style.background = 'rgba(0, 0, 0, 0.1)';
        this.updateButton.style.transform = 'scale(1)';
      }
    });

    this.container.appendChild(this.updateButton);
  }

  private bindEvents(): void {
    if (this.updateButton) {
      this.updateButton.addEventListener('click', () => {
        this.checkForUpdates();
      });
    }
  }

  private async checkForUpdatesOnLoad(): Promise<void> {
    // Check for updates on load if enough time has passed
    if (updateChecker.shouldCheckForUpdates()) {
      await this.checkForUpdates(true);
    } else {
      // Show cached update info if available
      const updateInfo = updateChecker.getUpdateInfo();
      if (updateInfo?.isNewer) {
        this.showUpdateAvailable(updateInfo);
      }
    }
  }

  private async checkForUpdates(silent: boolean = false): Promise<void> {
    if (!this.updateButton) return;

    // Show loading state
    this.updateButton.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
    `;
    this.updateButton.style.animation = 'spin 1s linear infinite';

    try {
      const updateInfo = await updateChecker.checkForUpdates();
      
      if (updateInfo?.isNewer) {
        this.showUpdateAvailable(updateInfo);
        if (!silent) {
          this.showNotification('Update available!', 'success');
        }
      } else if (!silent) {
        this.showNotification('You are up to date!', 'info');
      }
    } catch (error) {
      console.error('Update check failed:', error);
      if (!silent) {
        this.showNotification('Failed to check for updates', 'error');
      }
    } finally {
      // Reset button state
      if (this.updateButton) {
        this.updateButton.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3 4-3 9-3 9 1.34 9 3z"/>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            <path d="M12 1v6"/>
            <path d="M9 4l3-3 3 3"/>
          </svg>
        `;
        this.updateButton.style.animation = '';
      }
    }
  }

  private showUpdateAvailable(updateInfo: UpdateInfo): void {
    if (!this.updateButton) return;

    // Change button appearance to indicate update available
    this.updateButton.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
        <path d="M16 4l4 4-4 4"/>
      </svg>
    `;
    this.updateButton.style.background = 'rgba(34, 197, 94, 0.2)';
    this.updateButton.style.color = '#22c55e';
    this.updateButton.title = `Update available: v${updateInfo.version}`;

    // Add click handler to open update page
    this.updateButton.onclick = () => {
      chrome.tabs.create({ url: updateInfo.downloadUrl });
    };
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    // Remove existing notification
    if (this.updateNotification) {
      this.updateNotification.remove();
    }

    // Create notification
    this.updateNotification = document.createElement('div');
    this.updateNotification.className = `update-notification update-notification-${type}`;
    this.updateNotification.textContent = message;
    
    this.updateNotification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      z-index: 1001;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `;

    // Set background color based on type
    switch (type) {
      case 'success':
        this.updateNotification.style.background = '#22c55e';
        break;
      case 'error':
        this.updateNotification.style.background = '#ef4444';
        break;
      case 'info':
        this.updateNotification.style.background = '#3b82f6';
        break;
    }

    document.body.appendChild(this.updateNotification);

    // Animate in
    setTimeout(() => {
      if (this.updateNotification) {
        this.updateNotification.style.opacity = '1';
        this.updateNotification.style.transform = 'translateX(0)';
      }
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
      if (this.updateNotification) {
        this.updateNotification.style.opacity = '0';
        this.updateNotification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (this.updateNotification) {
            this.updateNotification.remove();
            this.updateNotification = null;
          }
        }, 300);
      }
    }, 3000);
  }

  public destroy(): void {
    if (this.updateButton) {
      this.updateButton.remove();
      this.updateButton = null;
    }
    if (this.updateNotification) {
      this.updateNotification.remove();
      this.updateNotification = null;
    }
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .update-checker-btn:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;
document.head.appendChild(style);
