import { ValidationUtils } from '../../../src/utils/validation';
import { HeaderData } from '../../../src/types';

describe('ValidationUtils', () => {
  let sampleData: HeaderData;

  beforeEach(() => {
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

  describe('validateFileName', () => {
    it('should validate correct file names', () => {
      const validNames = [
        'test.js',
        'my-file.ts',
        'component.vue',
        'script.py',
        'file-name-with-dashes.js'
      ];

      validNames.forEach(name => {
        const result = ValidationUtils.validateFileName(name);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject invalid file names', () => {
      const invalidNames = [
        '',
        'file<name.js',
        'file:name.js',
        'file"name.js',
        'file/name.js',
        'file\\name.js',
        'file|name.js',
        'file?name.js',
        'file*name.js'
      ];

      invalidNames.forEach(name => {
        const result = ValidationUtils.validateFileName(name);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    it('should reject overly long file names', () => {
      const longName = 'x'.repeat(256);
      const result = ValidationUtils.validateFileName(longName);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });
  });

  describe('validateVersion', () => {
    it('should validate correct version formats', () => {
      const validVersions = [
        '1.0.0',
        '2.1.3',
        '0.0.1',
        '10.20.30',
        '1.0.0-alpha',
        '1.0.0-beta.1',
        '1.0.0+build.1',
        '1.0.0-alpha+build.1'
      ];

      validVersions.forEach(version => {
        const result = ValidationUtils.validateVersion(version);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject invalid version formats', () => {
      const invalidVersions = [
        '',
        '1.0',
        '1.0.0.0',
        'v1.0.0',
        '1.0.0-',
        '1.0.0+',
        '1.0.0-+',
        '1.0.0-alpha-',
        '1.0.0+build+'
      ];

      invalidVersions.forEach(version => {
        const result = ValidationUtils.validateVersion(version);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('semantic versioning');
      });
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        const result = ValidationUtils.validateEmail(email);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user@example..com'
      ];

      invalidEmails.forEach(email => {
        const result = ValidationUtils.validateEmail(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Invalid email format');
      });
    });

    it('should accept empty email (optional field)', () => {
      const result = ValidationUtils.validateEmail('');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateUrl', () => {
    it('should validate correct URL formats', () => {
      const validUrls = [
        'https://example.com',
        'http://test.org',
        'https://subdomain.example.com/path',
        'https://example.com:8080/path?query=value'
      ];

      validUrls.forEach(url => {
        const result = ValidationUtils.validateUrl(url);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject invalid URL formats', () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://example.com',
        'example.com',
        'https://',
        'https://.com'
      ];

      invalidUrls.forEach(url => {
        const result = ValidationUtils.validateUrl(url);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Invalid URL format');
      });
    });

    it('should accept empty URL (optional field)', () => {
      const result = ValidationUtils.validateUrl('');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateDate', () => {
    it('should validate correct date formats', () => {
      const validDates = [
        '2024-01-01',
        '2023-12-31',
        '2024-02-29', // Leap year
        '2024-06-15'
      ];

      validDates.forEach(date => {
        const result = ValidationUtils.validateDate(date);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject invalid date formats', () => {
      const invalidDates = [
        '2024-13-01',
        '2024-02-30',
        '2024-04-31',
        '2024/01/01',
        '01-01-2024',
        '2024-1-1',
        'invalid-date'
      ];

      invalidDates.forEach(date => {
        const result = ValidationUtils.validateDate(date);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    it('should accept empty date (optional field)', () => {
      const result = ValidationUtils.validateDate('');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateTextLength', () => {
    it('should validate text within length limits', () => {
      const shortText = 'Short text';
      const result = ValidationUtils.validateTextLength(shortText, 100, 'Test field');
      
      expect(result.isValid).toBe(true);
    });

    it('should reject text exceeding length limits', () => {
      const longText = 'x'.repeat(101);
      const result = ValidationUtils.validateTextLength(longText, 100, 'Test field');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    it('should accept empty text (optional field)', () => {
      const result = ValidationUtils.validateTextLength('', 100, 'Test field');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateRequired', () => {
    it('should validate non-empty required fields', () => {
      const result = ValidationUtils.validateRequired('test value', 'Test field');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty required fields', () => {
      const result = ValidationUtils.validateRequired('', 'Test field');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Test field is required');
    });

    it('should reject whitespace-only required fields', () => {
      const result = ValidationUtils.validateRequired('   ', 'Test field');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Test field is required');
    });
  });


  describe('validateLanguage', () => {
    it('should validate non-empty language', () => {
      const result = ValidationUtils.validateLanguage('javascript');
      expect(result.isValid).toBe(true);
    });

    it('should reject empty language', () => {
      const result = ValidationUtils.validateLanguage('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Programming language is required');
    });
  });

  describe('validateLicense', () => {
    it('should validate correct licenses', () => {
      const validLicenses = ['MIT', 'GPL-3.0', 'Apache-2.0', 'BSD-3-Clause', 'ISC', 'Unlicense', 'Custom'];

      validLicenses.forEach(license => {
        const result = ValidationUtils.validateLicense(license);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject invalid licenses', () => {
      const result = ValidationUtils.validateLicense('InvalidLicense');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid license selection');
    });

    it('should reject empty license', () => {
      const result = ValidationUtils.validateLicense('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('License is required');
    });
  });

  describe('validateStatus', () => {
    it('should validate correct statuses', () => {
      const validStatuses = ['Development', 'Stable', 'Beta', 'Deprecated', 'Maintenance'];

      validStatuses.forEach(status => {
        const result = ValidationUtils.validateStatus(status);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject invalid statuses', () => {
      const result = ValidationUtils.validateStatus('InvalidStatus');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid status selection');
    });

    it('should reject empty status', () => {
      const result = ValidationUtils.validateStatus('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Status is required');
    });
  });

  describe('validateHeaderData', () => {
    it('should validate correct header data', () => {
      const validation = ValidationUtils.validateHeaderData(sampleData);
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect multiple validation errors', () => {
      const invalidData: HeaderData = {
        ...sampleData,
        fileName: '',
        author: '',
        version: 'invalid',
        license: 'InvalidLicense',
        status: 'InvalidStatus',
        language: ''
      };
      
      const validation = ValidationUtils.validateHeaderData(invalidData);
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(5);
    });

    it('should provide warnings for long content', () => {
      const longContentData: HeaderData = {
        ...sampleData,
        description: 'x'.repeat(600),
        usage: 'x'.repeat(1200),
        notes: 'x'.repeat(600),
        todo: 'x'.repeat(600)
      };
      
      const validation = ValidationUtils.validateHeaderData(longContentData);
      
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(w => w.includes('Description'))).toBe(true);
      expect(validation.warnings.some(w => w.includes('Usage'))).toBe(true);
    });
  });

  describe('sanitizeText', () => {
    it('should sanitize text correctly', () => {
      const dirtyText = '  Text with\ttabs and\nnewlines  ';
      const sanitized = ValidationUtils.sanitizeText(dirtyText);
      
      expect(sanitized).toBe('Text with tabs and newlines');
    });

    it('should remove control characters', () => {
      const textWithControlChars = 'Text\x00with\x1Fcontrol\x7Fchars';
      const sanitized = ValidationUtils.sanitizeText(textWithControlChars);
      
      expect(sanitized).toBe('Textwithcontrolchars');
    });

    it('should handle empty text', () => {
      const sanitized = ValidationUtils.sanitizeText('');
      expect(sanitized).toBe('');
    });
  });

  describe('sanitizeHtml', () => {
    it('should sanitize HTML content', () => {
      const htmlContent = '<script>alert("xss")</script>Hello World';
      const sanitized = ValidationUtils.sanitizeHtml(htmlContent);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Hello World');
    });

    it('should handle empty HTML', () => {
      const sanitized = ValidationUtils.sanitizeHtml('');
      expect(sanitized).toBe('');
    });
  });
});
