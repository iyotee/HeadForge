export async function copyToClipboard(text: string): Promise<void> {
  try {
    // For extensions, try the fallback method first as it's more reliable
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
      // We're in a browser extension context
      await fallbackCopyToClipboard(text);
      return;
    }
    
    // Use the modern Clipboard API if available and in secure context
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (clipboardError) {
        console.warn('Clipboard API failed, trying fallback:', clipboardError);
        // Fall through to fallback method
      }
    }
    
    // Fallback for older browsers or non-secure contexts
    await fallbackCopyToClipboard(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw new Error(`Failed to copy to clipboard: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function fallbackCopyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Style the textarea to be invisible but still functional
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.style.zIndex = '-1000';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    try {
      // Select and copy the text
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length); // Select all text
      
      // Use execCommand for copying (more reliable in extensions)
      const successful = document.execCommand('copy');
      
      if (successful) {
        resolve();
      } else {
        reject(new Error('execCommand copy failed'));
      }
    } catch (error) {
      reject(new Error(`Copy failed: ${error instanceof Error ? error.message : String(error)}`));
    } finally {
      // Clean up
      if (document.body.contains(textArea)) {
        document.body.removeChild(textArea);
      }
    }
  });
}

export async function readFromClipboard(): Promise<string> {
  try {
    // Use the modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      const text = await navigator.clipboard.readText();
      return text;
    }
    
    throw new Error('Clipboard API not available');
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    throw new Error('Failed to read from clipboard');
  }
}

export const ClipboardUtils = {
  copyToClipboard,
  readFromClipboard,
  copyImageToClipboard,
  isClipboardSupported,
  isClipboardReadSupported,
  isClipboardWriteSupported
};

export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard && window.isSecureContext);
}

export function isClipboardReadSupported(): boolean {
  return !!(navigator.clipboard && typeof navigator.clipboard.readText === 'function' && window.isSecureContext);
}

export function isClipboardWriteSupported(): boolean {
  return !!(navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext);
}

export async function copyImageToClipboard(imageBlob: Blob): Promise<void> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      const clipboardItem = new ClipboardItem({
        [imageBlob.type]: imageBlob
      });
      
      await navigator.clipboard.write([clipboardItem]);
    } else {
      throw new Error('Clipboard API not available for images');
    }
  } catch (error) {
    console.error('Failed to copy image to clipboard:', error);
    throw new Error('Failed to copy image to clipboard');
  }
}

export async function copyHtmlToClipboard(html: string, plainText?: string): Promise<void> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plainText || html], { type: 'text/plain' })
      });
      
      await navigator.clipboard.write([clipboardItem]);
    } else {
      // Fallback to plain text
      await copyToClipboard(plainText || html);
    }
  } catch (error) {
    console.error('Failed to copy HTML to clipboard:', error);
    throw new Error('Failed to copy HTML to clipboard');
  }
}

export function getClipboardPermission(): Promise<PermissionState> {
  return navigator.permissions.query({ name: 'clipboard-write' as PermissionName })
    .then(result => result.state)
    .catch(() => 'denied' as PermissionState);
}

export function requestClipboardPermission(): Promise<boolean> {
  return getClipboardPermission()
    .then(state => state === 'granted')
    .catch(() => false);
}

export async function copyWithNotification(text: string, notificationText?: string): Promise<void> {
  try {
    await copyToClipboard(text);
    
    // Show notification if available
    if (notificationText && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('HeadForge', {
          body: notificationText,
          icon: '/icons/icon-48.png'
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('HeadForge', {
            body: notificationText,
            icon: '/icons/icon-48.png'
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to copy with notification:', error);
    throw error;
  }
}

export function createCopyButton(
  text: string,
  buttonText: string = 'Copy',
  onSuccess?: () => void,
  onError?: (error: Error) => void
): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.className = 'copy-button';
  
  button.addEventListener('click', async () => {
    try {
      await copyToClipboard(text);
      button.textContent = 'Copied!';
      button.classList.add('copied');
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset button after 2 seconds
      setTimeout(() => {
        button.textContent = buttonText;
        button.classList.remove('copied');
      }, 2000);
    } catch (error) {
      button.textContent = 'Failed';
      button.classList.add('error');
      
      if (onError) {
        onError(error as Error);
      }
      
      // Reset button after 2 seconds
      setTimeout(() => {
        button.textContent = buttonText;
        button.classList.remove('error');
      }, 2000);
    }
  });
  
  return button;
}

export function createCopyableElement(
  text: string,
  elementType: keyof HTMLElementTagNameMap = 'div'
): HTMLElement {
  const element = document.createElement(elementType);
  element.textContent = text;
  element.className = 'copyable';
  element.title = 'Click to copy';
  
  element.addEventListener('click', async () => {
    try {
      await copyToClipboard(text);
      element.classList.add('copied');
      
      // Reset after 2 seconds
      setTimeout(() => {
        element.classList.remove('copied');
      }, 2000);
    } catch (error) {
      element.classList.add('error');
      
      // Reset after 2 seconds
      setTimeout(() => {
        element.classList.remove('error');
      }, 2000);
    }
  });
  
  return element;
}

export function addCopyToClipboardListener(
  element: HTMLElement,
  getText: () => string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): void {
  element.addEventListener('click', async () => {
    try {
      const text = getText();
      await copyToClipboard(text);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  });
}

export function getClipboardInfo(): {
  supported: boolean;
  readSupported: boolean;
  writeSupported: boolean;
  permission: PermissionState | 'unknown';
} {
  return {
    supported: isClipboardSupported(),
    readSupported: isClipboardReadSupported(),
    writeSupported: isClipboardWriteSupported(),
    permission: 'unknown' as PermissionState
  };
}

export async function getClipboardInfoAsync(): Promise<{
  supported: boolean;
  readSupported: boolean;
  writeSupported: boolean;
  permission: PermissionState;
}> {
  const permission = await getClipboardPermission();
  
  return {
    supported: isClipboardSupported(),
    readSupported: isClipboardReadSupported(),
    writeSupported: isClipboardWriteSupported(),
    permission
  };
}