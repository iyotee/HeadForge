import { templateEngine } from '../../../src/utils/template-engine';
import { getLanguageById } from '../../../src/utils/language-configs';

describe('TemplateEngine', () => {
  describe('generateHeader', () => {
    it('should generate a valid header', () => {
      const data = {
        fileName: 'test.js',
        project: 'Test Project',
        author: 'Test Author',
        version: '1.0.0',
        language: 'javascript',
        license: 'MIT',
        status: 'Development',
        creationDate: '2024-01-01',
        lastUpdated: '2024-01-01',
        description: 'A test file',
        dependencies: 'None',
        usage: 'Test usage',
        notes: 'Test notes',
        todo: 'Test todo'
      };

      const languageConfig = getLanguageById('javascript');
      const result = templateEngine.generateHeader(data, languageConfig);
      
      expect(result).toContain('Test Project');
      expect(result).toContain('Test Author');
      expect(result).toContain('1.0.0');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getLanguageConfig', () => {
    it('should return correct language configuration', () => {
      const jsConfig = getLanguageById('javascript');
      expect(jsConfig).toBeDefined();
      expect(jsConfig.name).toBe('JavaScript');
      expect(jsConfig.extension).toBe('.js');

      const pyConfig = getLanguageById('python');
      expect(pyConfig).toBeDefined();
      expect(pyConfig.name).toBe('Python');
      expect(pyConfig.extension).toBe('.py');
    });

    it('should return null for unknown language', () => {
      const config = getLanguageById('unknown');
      expect(config).toBeNull();
    });
  });
});
