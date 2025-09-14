// Jest setup file for HeadForge tests

// Mock Chrome APIs
const mockChrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    },
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    }
  },
  clipboard: {
    writeText: jest.fn()
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  },
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    onInstalled: {
      addListener: jest.fn()
    },
    onStartup: {
      addListener: jest.fn()
    },
    openOptionsPage: jest.fn(),
    getManifest: jest.fn(() => ({ version: '1.0.0' }))
  }
};

// Mock global Chrome object
(global as any).chrome = mockChrome;

// Mock browser object for webextension-polyfill
(global as any).browser = mockChrome;

// Mock DOM APIs that might not be available in Jest
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock URL.createObjectURL and URL.revokeObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(() => 'mock-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: jest.fn(),
});

// Mock document.execCommand for clipboard fallback
Object.defineProperty(document, 'execCommand', {
  writable: true,
  value: jest.fn(() => true),
});

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('mock text'))
  },
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup test environment
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Reset Chrome API mocks
  Object.keys(mockChrome).forEach(key => {
    const api = (mockChrome as any)[key];
    if (typeof api === 'object') {
      Object.keys(api).forEach(method => {
        if (typeof api[method] === 'function') {
          api[method].mockClear();
        }
      });
    }
  });
});

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidHeader(): R;
      toHaveValidLanguage(): R;
    }
  }
}

// Custom Jest matchers
expect.extend({
  toBeValidHeader(received: string) {
    const hasCommentStart = received.includes('/*') || received.includes('<!--') || received.includes('#');
    const hasFileName = received.includes('FILE') || received.includes('file');
    const hasAuthor = received.includes('AUTHOR') || received.includes('author');
    
    const pass = hasCommentStart && hasFileName && hasAuthor;
    
    return {
      message: () => `expected ${received} to be a valid header`,
      pass,
    };
  },
  
  toHaveValidLanguage(received: any) {
    const hasId = typeof received.id === 'string' && received.id.length > 0;
    const hasName = typeof received.name === 'string' && received.name.length > 0;
    const hasExtension = typeof received.extension === 'string' && received.extension.length > 0;
    const hasTemplate = typeof received.template === 'string' && received.template.length > 0;
    
    const pass = hasId && hasName && hasExtension && hasTemplate;
    
    return {
      message: () => `expected ${received} to be a valid language configuration`,
      pass,
    };
  },
});
