// Test setup file
// This file is run before all tests

// Mock browser APIs for testing
global.chrome = {
  runtime: {
    getURL: (path: string) => `chrome-extension://test-id/${path}`,
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    sendMessage: jest.fn(),
  },
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    },
    sync: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
    },
  },
  tabs: {
    create: jest.fn(),
    query: jest.fn(),
  },
} as any;

// Mock fetch for update checker
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set up test environment
process.env.NODE_ENV = 'test';