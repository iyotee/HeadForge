import { ValidationUtils } from '../../../src/utils/validation';

describe('ValidationUtils', () => {
  describe('isValidVersion', () => {
    it('should validate correct version formats', () => {
      expect(ValidationUtils.isValidVersion('1.0.0')).toBe(true);
      expect(ValidationUtils.isValidVersion('2.1.3')).toBe(true);
      expect(ValidationUtils.isValidVersion('0.1.0')).toBe(true);
      expect(ValidationUtils.isValidVersion('1.0.0-beta.1')).toBe(true);
      expect(ValidationUtils.isValidVersion('1.0.0+build.1')).toBe(true);
    });

    it('should reject invalid version formats', () => {
      expect(ValidationUtils.isValidVersion('1.0')).toBe(false);
      expect(ValidationUtils.isValidVersion('1.0.0.0')).toBe(false);
      expect(ValidationUtils.isValidVersion('v1.0.0')).toBe(false);
      expect(ValidationUtils.isValidVersion('1.0.0.')).toBe(false);
      expect(ValidationUtils.isValidVersion('')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should validate correct date formats', () => {
      expect(ValidationUtils.isValidDate('2024-01-01')).toBe(true);
      expect(ValidationUtils.isValidDate('2023-12-31')).toBe(true);
      expect(ValidationUtils.isValidDate('2024-02-29')).toBe(true); // Leap year
    });

    it('should reject invalid date formats', () => {
      expect(ValidationUtils.isValidDate('01-01-2024')).toBe(false);
      expect(ValidationUtils.isValidDate('2024/01/01')).toBe(false);
      expect(ValidationUtils.isValidDate('2024-13-01')).toBe(false);
      expect(ValidationUtils.isValidDate('2024-01-32')).toBe(false);
      expect(ValidationUtils.isValidDate('')).toBe(false);
    });
  });

  describe('isValidFileName', () => {
    it('should validate correct file names', () => {
      expect(ValidationUtils.isValidFileName('test.js')).toBe(true);
      expect(ValidationUtils.isValidFileName('my-file.ts')).toBe(true);
      expect(ValidationUtils.isValidFileName('component.vue')).toBe(true);
      expect(ValidationUtils.isValidFileName('script.py')).toBe(true);
    });

    it('should reject invalid file names', () => {
      expect(ValidationUtils.isValidFileName('file<name.js')).toBe(false);
      expect(ValidationUtils.isValidFileName('file:name.js')).toBe(false);
      expect(ValidationUtils.isValidFileName('file"name.js')).toBe(false);
      expect(ValidationUtils.isValidFileName('file/name.js')).toBe(false);
      expect(ValidationUtils.isValidFileName('file\\name.js')).toBe(false);
      expect(ValidationUtils.isValidFileName('file|name.js')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(ValidationUtils.isValidUrl('https://example.com')).toBe(true);
      expect(ValidationUtils.isValidUrl('http://example.com')).toBe(true);
      expect(ValidationUtils.isValidUrl('https://example.com/path')).toBe(true);
      expect(ValidationUtils.isValidUrl('https://example.com:8080')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(ValidationUtils.isValidUrl('not-a-url')).toBe(false);
      expect(ValidationUtils.isValidUrl('')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(ValidationUtils.isValidEmail('test@example.com')).toBe(true);
      expect(ValidationUtils.isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(ValidationUtils.isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(ValidationUtils.isValidEmail('not-an-email')).toBe(false);
      expect(ValidationUtils.isValidEmail('@example.com')).toBe(false);
      expect(ValidationUtils.isValidEmail('test@')).toBe(false);
      expect(ValidationUtils.isValidEmail('')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize dangerous characters', () => {
      expect(ValidationUtils.sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(ValidationUtils.sanitizeInput('javascript:alert("xss")')).toBe('alert("xss")');
      expect(ValidationUtils.isValidEmail('onclick="alert()"')).toBe(false);
    });

    it('should preserve safe content', () => {
      expect(ValidationUtils.sanitizeInput('Hello World')).toBe('Hello World');
      expect(ValidationUtils.sanitizeInput('  spaced  ')).toBe('spaced');
    });
  });
});
