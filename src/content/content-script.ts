import { Message } from '@/types';
import { MESSAGE_TYPES } from '@/utils/constants';

class HeadForgeContentScript {
  private isActive: boolean = false;
  private currentEditor: HTMLElement | null = null;

  constructor() {
    this.setupMessageListener();
    this.detectEditors();
    this.setupKeyboardShortcuts();
  }

  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async response
    });
  }

  private async handleMessage(message: Message, sender: any, sendResponse: (response?: any) => void): Promise<void> {
    try {
      let response: any;

      switch (message.type) {
        case 'INSERT_HEADER':
          response = await this.handleInsertHeader(message.payload);
          break;

        case 'THEME_CHANGED':
          response = await this.handleThemeChanged(message.payload);
          break;

        case 'DETECT_EDITOR':
          response = await this.detectCurrentEditor();
          break;

        default:
          response = { error: 'Unknown message type' };
      }

      sendResponse(response);
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  private async handleInsertHeader(payload: any): Promise<any> {
    try {
      const { headerContent, language } = payload;
      
      if (!this.currentEditor) {
        throw new Error('No active editor detected');
      }

      // Insert header at the beginning of the editor
      this.insertTextAtCursor(headerContent);
      
      return {
        success: true,
        message: 'Header inserted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async handleThemeChanged(payload: any): Promise<any> {
    try {
      const { theme } = payload;
      
      // Update theme for any injected UI elements
      document.documentElement.setAttribute('data-headforge-theme', theme);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async detectCurrentEditor(): Promise<any> {
    try {
      const editor = this.findActiveEditor();
      
      return {
        success: true,
        editor: editor ? {
          type: this.getEditorType(editor),
          element: editor.tagName,
          id: editor.id,
          className: editor.className
        } : null
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private detectEditors(): void {
    // Common editor selectors
    const editorSelectors = [
      // CodeMirror
      '.CodeMirror',
      '.cm-editor',
      
      // Monaco Editor
      '.monaco-editor',
      
      // Ace Editor
      '.ace_editor',
      
      // Prism.js
      'pre[class*="language-"]',
      
      // Generic code editors
      'textarea[data-editor]',
      'textarea[class*="editor"]',
      
      // VS Code Web
      '.monaco-editor .view-lines',
      
      // GitHub
      '.blob-code-inner',
      '.blob-code',
      
      // GitLab
      '.file-content',
      
      // Stack Overflow
      'pre code',
      
      // Generic textareas
      'textarea',
      
      // Contenteditable
      '[contenteditable="true"]'
    ];

    // Use MutationObserver to detect dynamically added editors
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check if the added element is an editor
            if (this.isEditor(element)) {
              this.setupEditor(element as HTMLElement);
            }
            
            // Check if the added element contains editors
            editorSelectors.forEach(selector => {
              const editors = element.querySelectorAll(selector);
              editors.forEach(editor => {
                this.setupEditor(editor as HTMLElement);
              });
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Setup existing editors
    editorSelectors.forEach(selector => {
      const editors = document.querySelectorAll(selector);
      editors.forEach(editor => {
        this.setupEditor(editor as HTMLElement);
      });
    });
  }

  private setupEditor(editor: HTMLElement): void {
    // Add focus listener to track active editor
    editor.addEventListener('focus', () => {
      this.currentEditor = editor;
      this.isActive = true;
    });

    editor.addEventListener('blur', () => {
      this.isActive = false;
    });

    // Add click listener for click-to-focus
    editor.addEventListener('click', () => {
      this.currentEditor = editor;
      this.isActive = true;
    });

    // Add keyboard listener for keyboard navigation
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' || e.key === 'Enter') {
        this.currentEditor = editor;
        this.isActive = true;
      }
    });
  }

  private isEditor(element: Element): boolean {
    const editorTypes = [
      'textarea',
      'pre',
      'code',
      'div[contenteditable="true"]'
    ];

    // Check tag name
    if (editorTypes.includes(element.tagName.toLowerCase())) {
      return true;
    }

    // Check for editor-specific classes
    const editorClasses = [
      'CodeMirror',
      'cm-editor',
      'monaco-editor',
      'ace_editor',
      'blob-code',
      'file-content'
    ];

    return editorClasses.some(className => 
      element.classList.contains(className) || 
      element.className.includes(className)
    );
  }

  private findActiveEditor(): HTMLElement | null {
    // First, try to find the currently focused element
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && this.isEditor(activeElement)) {
      return activeElement;
    }

    // Then, try to find the last focused editor
    if (this.currentEditor && this.isEditor(this.currentEditor)) {
      return this.currentEditor;
    }

    // Finally, try to find any visible editor
    const editorSelectors = [
      '.CodeMirror',
      '.cm-editor',
      '.monaco-editor',
      '.ace_editor',
      'textarea',
      '[contenteditable="true"]'
    ];

    for (const selector of editorSelectors) {
      const editors = document.querySelectorAll(selector);
      for (const editor of editors) {
        if (this.isEditor(editor) && this.isElementVisible(editor as HTMLElement)) {
          return editor as HTMLElement;
        }
      }
    }

    return null;
  }

  private isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && 
           rect.top >= 0 && rect.left >= 0 &&
           rect.bottom <= window.innerHeight && 
           rect.right <= window.innerWidth;
  }

  private getEditorType(editor: HTMLElement): string {
    if (editor.classList.contains('CodeMirror') || editor.classList.contains('cm-editor')) {
      return 'codemirror';
    }
    if (editor.classList.contains('monaco-editor')) {
      return 'monaco';
    }
    if (editor.classList.contains('ace_editor')) {
      return 'ace';
    }
    if (editor.tagName.toLowerCase() === 'textarea') {
      return 'textarea';
    }
    if (editor.contentEditable === 'true') {
      return 'contenteditable';
    }
    return 'unknown';
  }

  private insertTextAtCursor(text: string): void {
    if (!this.currentEditor) return;

    const editorType = this.getEditorType(this.currentEditor);

    switch (editorType) {
      case 'codemirror':
        this.insertIntoCodeMirror(text);
        break;
      case 'monaco':
        this.insertIntoMonaco(text);
        break;
      case 'ace':
        this.insertIntoAce(text);
        break;
      case 'textarea':
        this.insertIntoTextarea(text);
        break;
      case 'contenteditable':
        this.insertIntoContentEditable(text);
        break;
      default:
        this.insertIntoGeneric(text);
    }
  }

  private insertIntoCodeMirror(text: string): void {
    // CodeMirror API
    const cm = (this.currentEditor as any).CodeMirror;
    if (cm) {
      const cursor = cm.getCursor();
      cm.replaceRange(text + '\n', cursor);
      cm.focus();
    }
  }

  private insertIntoMonaco(text: string): void {
    // Monaco Editor API
    const editor = (this.currentEditor as any).__monacoEditor;
    if (editor) {
      const position = editor.getPosition();
      editor.executeEdits('headforge-insert', [{
        range: {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        },
        text: text + '\n',
        forceMoveMarkers: true
      }]);
      editor.focus();
    }
  }

  private insertIntoAce(text: string): void {
    // Ace Editor API
    const editor = (this.currentEditor as any).env?.editor;
    if (editor) {
      const cursor = editor.getCursorPosition();
      editor.session.insert(cursor, text + '\n');
      editor.focus();
    }
  }

  private insertIntoTextarea(text: string): void {
    const textarea = this.currentEditor as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    
    textarea.value = value.substring(0, start) + text + '\n' + value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + text.length + 1;
    textarea.focus();
    
    // Trigger input event
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private insertIntoContentEditable(text: string): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const textNode = document.createTextNode(text + '\n');
      range.insertNode(textNode);
      
      // Move cursor after inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  private insertIntoGeneric(text: string): void {
    // Fallback method
    if (this.currentEditor && this.currentEditor.contentEditable === 'true') {
      this.insertIntoContentEditable(text);
    } else {
      // Try to insert as if it's a textarea
      this.insertIntoTextarea(text);
    }
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Check for HeadForge shortcuts (Ctrl/Cmd + Shift + H)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        this.openHeadForgePopup();
      }
    });
  }

  private openHeadForgePopup(): void {
    // Send message to background script to open popup
    chrome.runtime.sendMessage({
      type: 'OPEN_POPUP'
    });
  }

}

// Initialize the content script
new HeadForgeContentScript();
