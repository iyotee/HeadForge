import { HeaderData } from '../../types';
import { generateHeader } from '../../utils/template-engine';
import { getLanguageById } from '../../utils/language-configs';
import { copyToClipboard } from '../../utils/clipboard';
import { saveFile } from '../../utils/file-utils';

export class ExportManager {
  private onExportSuccess: (message: string) => void;
  private onExportError: (error: string) => void;

  constructor(
    onExportSuccess: (message: string) => void,
    onExportError: (error: string) => void
  ) {
    this.onExportSuccess = onExportSuccess;
    this.onExportError = onExportError;
  }

  public async copyToClipboard(data: HeaderData): Promise<void> {
    try {
      const header = this.generateHeader(data);
      await copyToClipboard(header);
      this.onExportSuccess('Header copied to clipboard!');
    } catch (error) {
      this.onExportError('Failed to copy to clipboard');
      console.error('Clipboard error:', error);
    }
  }

  public async downloadFile(data: HeaderData): Promise<void> {
    try {
      const header = this.generateHeader(data);
      const filename = this.getFilename(data);
      saveFile(header, filename);
      this.onExportSuccess(`File downloaded: ${filename}`);
    } catch (error) {
      this.onExportError('Failed to download file');
      console.error('Download error:', error);
    }
  }

  public async insertIntoEditor(data: HeaderData): Promise<void> {
    try {
      const header = this.generateHeader(data);
      
      // Send message to content script to insert into editor
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab && tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'INSERT_HEADER',
          data: header
        });
        
        this.onExportSuccess('Header inserted into editor!');
      } else {
        throw new Error('No active tab found');
      }
    } catch (error) {
      this.onExportError('Failed to insert into editor');
      console.error('Insert error:', error);
    }
  }

  public generateHeader(data: HeaderData): string {
    const languageConfig = getLanguageById(data.language);
    
    if (!languageConfig) {
      throw new Error(`Unsupported language: ${data.language}`);
    }

    return generateHeader(data, languageConfig);
  }

  public getFilename(data: HeaderData): string {
    if (data.fileName) {
      return data.fileName;
    }

    // Generate filename based on language
    const languageConfig = getLanguageById(data.language);
    const extension = languageConfig?.extension || '.txt';
    
    return `header${extension}`;
  }

  public getPreview(data: HeaderData): string {
    try {
      return this.generateHeader(data);
    } catch (error) {
      return `Error generating preview: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  public async exportAsJson(data: HeaderData): Promise<void> {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await copyToClipboard(jsonData);
      this.onExportSuccess('Data exported as JSON to clipboard!');
    } catch (error) {
      this.onExportError('Failed to export as JSON');
      console.error('JSON export error:', error);
    }
  }

  public async exportAsMarkdown(data: HeaderData): Promise<void> {
    try {
      const markdown = this.generateMarkdown(data);
      await copyToClipboard(markdown);
      this.onExportSuccess('Data exported as Markdown to clipboard!');
    } catch (error) {
      this.onExportError('Failed to export as Markdown');
      console.error('Markdown export error:', error);
    }
  }

  private generateMarkdown(data: HeaderData): string {
    return `# ${data.fileName || 'Header'}

## Project Information
- **Project**: ${data.project}
- **Author**: ${data.author}
- **Version**: ${data.version}
- **Language**: ${data.language}
- **License**: ${data.license}
- **Status**: ${data.status}

## Dates
- **Created**: ${data.creationDate}
- **Last Updated**: ${data.lastUpdated}

## Description
${data.description}

## Dependencies
${data.dependencies}

## Usage
${data.usage}

## Notes
${data.notes}

## TODO
${data.todo}

`;
  }

  public getSupportedFormats(): string[] {
    return [
      'Clipboard',
      'File Download',
      'Editor Insert',
      'JSON Export',
      'Markdown Export'
    ];
  }

  public async exportInFormat(format: string, data: HeaderData): Promise<void> {
    switch (format.toLowerCase()) {
      case 'clipboard':
        await this.copyToClipboard(data);
        break;
      case 'file download':
        await this.downloadFile(data);
        break;
      case 'editor insert':
        await this.insertIntoEditor(data);
        break;
      case 'json export':
        await this.exportAsJson(data);
        break;
      case 'markdown export':
        await this.exportAsMarkdown(data);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  public validateExportData(data: HeaderData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.fileName) {
      errors.push('File name is required');
    }

    if (!data.project) {
      errors.push('Project name is required');
    }

    if (!data.author) {
      errors.push('Author is required');
    }

    if (!data.version) {
      errors.push('Version is required');
    }

    if (!data.language) {
      errors.push('Language is required');
    }

    if (!data.license) {
      errors.push('License is required');
    }

    if (!data.status) {
      errors.push('Status is required');
    }


    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public getExportStatistics(data: HeaderData): { [key: string]: number } {
    const header = this.generateHeader(data);
    
    return {
      'Header Length': header.length,
      'Line Count': header.split('\n').length,
      'Word Count': header.split(/\s+/).length,
      'Character Count': header.replace(/\s/g, '').length
    };
  }
}
