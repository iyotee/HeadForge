import { HeaderTemplateEngine } from '../../../src/utils/template-engine';
import { languageConfigs, getLanguageById } from '../../../src/utils/language-configs';
import { HeaderData } from '../../../src/types';

describe('HeaderTemplateEngine', () => {
  let templateEngine: HeaderTemplateEngine;
  let sampleData: HeaderData;

  beforeEach(() => {
    templateEngine = HeaderTemplateEngine.getInstance();
    sampleData = {
      fileName: 'test-file.js',
      project: 'Test Project',
      author: 'Test Author',
      creationDate: '2024-01-01',
      lastUpdated: '2024-01-01',
      version: '1.0.0',
      description: 'A test file',
      dependencies: 'None',
      license: 'MIT',
      status: 'Development',
      language: 'javascript',
      usage: 'Test usage',
      notes: 'Test notes',
      todo: 'Test todo'
    };
  });

  describe('generateHeader', () => {
    it('should generate a valid header for JavaScript', () => {
      const language = getLanguageById('javascript');
      expect(language).toBeDefined();
      
      const header = templateEngine.generateHeader(sampleData, language!);
      
      expect(header).toBeValidHeader();
      expect(header).toContain('test-file.js');
      expect(header).toContain('Test Project');
      expect(header).toContain('Test Author');
      expect(header).toContain('1.0.0');
    });

    it('should generate a valid header for Python', () => {
      const language = getLanguageById('python');
      expect(language).toBeDefined();
      
      const header = templateEngine.generateHeader(sampleData, language!);
      
      expect(header).toBeValidHeader();
      expect(header).toContain('test-file.js');
      expect(header).toContain('Test Project');
      expect(header).toContain('Test Author');
    });

    it('should generate a valid header for HTML', () => {
      const language = getLanguageById('html');
      expect(language).toBeDefined();
      
      const header = templateEngine.generateHeader(sampleData, language!);
      
      expect(header).toBeValidHeader();
      expect(header).toContain('<!--');
      expect(header).toContain('-->');
    });

    it('should handle empty or missing data gracefully', () => {
      const language = getLanguageById('javascript');
      const emptyData: HeaderData = {
        fileName: '',
        project: '',
        author: '',
        creationDate: '',
        lastUpdated: '',
        version: '',
        description: '',
        dependencies: '',
        license: '',
        status: '',
        language: '',
        usage: '',
        notes: '',
        todo: ''
      };
      
      expect(() => {
        templateEngine.generateHeader(emptyData, language!);
      }).not.toThrow();
    });

    it('should escape special characters appropriately', () => {
      const language = getLanguageById('html');
      const dataWithSpecialChars: HeaderData = {
        ...sampleData,
        description: 'This contains -- special characters',
        fileName: 'test-file.html'
      };
      
      const header = templateEngine.generateHeader(dataWithSpecialChars, language!);
      
      expect(header).not.toContain('--');
      expect(header).toContain('&#45;&#45;');
    });
  });

  describe('validateData', () => {
    it('should validate correct data successfully', () => {
      const validation = templateEngine.validateData(sampleData);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const invalidData: HeaderData = {
        ...sampleData,
        fileName: '',
        author: '',
        version: ''
      };
      
      const validation = templateEngine.validateData(invalidData);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('File name is required');
      expect(validation.errors).toContain('Author is required');
      expect(validation.errors).toContain('Version is required');
    });

    it('should validate version format', () => {
      const invalidVersionData: HeaderData = {
        ...sampleData,
        version: 'invalid-version'
      };
      
      const validation = templateEngine.validateData(invalidVersionData);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Version must follow semantic versioning (e.g., 1.0.0)');
    });

    it('should validate date format', () => {
      const invalidDateData: HeaderData = {
        ...sampleData,
        creationDate: 'invalid-date',
        lastUpdated: '2024-13-01'
      };
      
      const validation = templateEngine.validateData(invalidDateData);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Creation date must be in YYYY-MM-DD format');
      expect(validation.errors).toContain('Last updated date must be in YYYY-MM-DD format');
    });

    it('should provide warnings for long content', () => {
      const longContentData: HeaderData = {
        ...sampleData,
        description: 'x'.repeat(600),
        usage: 'x'.repeat(1200)
      };
      
      const validation = templateEngine.validateData(longContentData);
      
      expect(validation.warnings).toContain('Description is quite long, consider shortening it');
      expect(validation.warnings).toContain('Usage instructions are quite long, consider shortening them');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = templateEngine.formatDate(date);
      
      expect(formatted).toBe('2024-01-15');
    });
  });

  describe('getCurrentDate', () => {
    it('should return current date in correct format', () => {
      const currentDate = templateEngine.getCurrentDate();
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      
      expect(currentDate).toMatch(dateRegex);
    });
  });

  describe('generatePreview', () => {
    it('should generate a preview with limited lines', () => {
      const language = getLanguageById('javascript');
      const preview = templateEngine.generatePreview(sampleData, language!, 5);
      
      const lines = preview.split('\n');
      expect(lines.length).toBeLessThanOrEqual(6); // 5 lines + potential truncation indicator
    });

    it('should not truncate short headers', () => {
      const language = getLanguageById('javascript');
      const preview = templateEngine.generatePreview(sampleData, language!, 50);
      
      expect(preview).not.toContain('... (truncated)');
    });
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = HeaderTemplateEngine.getInstance();
      const instance2 = HeaderTemplateEngine.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });
});
