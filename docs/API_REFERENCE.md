# HeadForge API Reference

## Overview

HeadForge provides a comprehensive API for generating professional code headers across multiple programming languages. This document covers all available functions, types, and interfaces.

## Core API

### `generateHeader(data: HeaderData, language: string): string`

Generates a code header for the specified language and data.

**Parameters:**
- `data: HeaderData` - The header data object
- `language: string` - The programming language identifier

**Returns:**
- `string` - The generated header code

**Example:**
```typescript
import { generateHeader } from './utils/template-engine';

const headerData = {
  fileName: 'user-service.js',
  project: 'E-commerce Platform',
  author: 'John Doe',
  version: '1.0.0',
  description: 'User management service',
  // ... other fields
};

const header = generateHeader(headerData, 'javascript');
console.log(header);
```

### `getLanguageConfig(language: string): LanguageConfig | undefined`

Retrieves the configuration for a specific programming language.

**Parameters:**
- `language: string` - The language identifier

**Returns:**
- `LanguageConfig | undefined` - The language configuration or undefined if not found

**Example:**
```typescript
import { getLanguageConfig } from './utils/language-configs';

const config = getLanguageConfig('python');
if (config) {
  console.log('Comment style:', config.commentStyle);
  console.log('Template:', config.template);
}
```

### `validateHeaderData(data: HeaderData): ValidationResult`

Validates the header data object.

**Parameters:**
- `data: HeaderData` - The header data to validate

**Returns:**
- `ValidationResult` - The validation result with errors and warnings

**Example:**
```typescript
import { validateHeaderData } from './utils/validation';

const result = validateHeaderData(headerData);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

## Data Types

### `HeaderData`

Interface for header data:

```typescript
interface HeaderData {
  fileName: string;
  project: string;
  author: string;
  creationDate: string;
  lastUpdated: string;
  version: string;
  description: string;
  dependencies: string;
  license: string;
  status: string;
  platform: string[];
  language: string;
  usage: string;
  notes: string;
  todo: string;
}
```

### `LanguageConfig`

Interface for language configuration:

```typescript
interface LanguageConfig {
  commentStyle: 'singleLine' | 'multiLine' | 'docBlock';
  template: string;
  fileExtension: string;
  keywords: string[];
}
```

### `ValidationResult`

Interface for validation results:

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

## Utility Functions

### `copyToClipboard(text: string): Promise<void>`

Copies text to the clipboard.

**Parameters:**
- `text: string` - The text to copy

**Returns:**
- `Promise<void>` - Resolves when copy is complete

**Example:**
```typescript
import { copyToClipboard } from './utils/clipboard';

await copyToClipboard('Hello, World!');
```

### `saveFile(content: string, filename: string): void`

Saves content to a file.

**Parameters:**
- `content: string` - The file content
- `filename: string` - The filename

**Example:**
```typescript
import { saveFile } from './utils/file-utils';

saveFile(header, 'my-header.js');
```

### `getCurrentDate(): string`

Gets the current date in YYYY-MM-DD format.

**Returns:**
- `string` - The current date

**Example:**
```typescript
import { getCurrentDate } from './utils/date-utils';

const today = getCurrentDate();
console.log(today); // "2025-01-15"
```

## Storage API

### `getSettings(): Promise<ExtensionSettings>`

Retrieves extension settings from storage.

**Returns:**
- `Promise<ExtensionSettings>` - The extension settings

**Example:**
```typescript
import { getSettings } from './background/storage';

const settings = await getSettings();
console.log('Theme:', settings.theme);
```

### `saveSettings(settings: ExtensionSettings): Promise<void>`

Saves extension settings to storage.

**Parameters:**
- `settings: ExtensionSettings` - The settings to save

**Example:**
```typescript
import { saveSettings } from './background/storage';

await saveSettings({
  theme: 'dark',
  defaultLanguage: 'javascript',
  rememberLastValues: true,
  // ... other settings
});
```

## Event System

### `onMessage(callback: (message: Message) => void): void`

Registers a message listener.

**Parameters:**
- `callback: (message: Message) => void` - The message handler

**Example:**
```typescript
import { onMessage } from './background/messaging';

onMessage((message) => {
  if (message.type === 'GENERATE_HEADER') {
    // Handle header generation
  }
});
```

### `sendMessage(message: Message): Promise<MessageResponse>`

Sends a message to the background script.

**Parameters:**
- `message: Message` - The message to send

**Returns:**
- `Promise<MessageResponse>` - The response

**Example:**
```typescript
import { sendMessage } from './background/messaging';

const response = await sendMessage({
  type: 'GENERATE_HEADER',
  data: headerData
});
```

## Theme API

### `getTheme(): Theme`

Gets the current theme.

**Returns:**
- `Theme` - The current theme

**Example:**
```typescript
import { getTheme } from './styles/themes';

const theme = getTheme();
console.log('Current theme:', theme);
```

### `setTheme(theme: Theme): void`

Sets the theme.

**Parameters:**
- `theme: Theme` - The theme to set

**Example:**
```typescript
import { setTheme } from './styles/themes';

setTheme('dark');
```

## Language Support

### Supported Languages

HeadForge supports the following programming languages:

#### Web Technologies
- JavaScript
- TypeScript
- HTML
- CSS
- SCSS
- SASS
- Less
- React JSX/TSX
- Vue.js
- Angular
- Svelte

#### Backend Languages
- Python
- Java
- C#
- C++
- C
- Go
- Rust
- PHP
- Ruby
- Node.js
- Kotlin
- Scala
- Swift
- Objective-C
- Dart

#### Database & Query Languages
- SQL
- PostgreSQL
- MySQL
- MongoDB
- GraphQL
- HQL

#### DevOps & Config
- Docker
- YAML
- JSON
- XML
- Bash/Shell
- PowerShell
- Batch

#### Others
- R
- MATLAB
- Lua
- Perl
- Haskell
- Elixir
- Assembly
- VHDL
- Verilog

## Error Handling

### `HeadForgeError`

Custom error class for HeadForge-specific errors:

```typescript
class HeadForgeError extends Error {
  constructor(message: string, code: string) {
    super(message);
    this.name = 'HeadForgeError';
    this.code = code;
  }
}
```

### Error Codes

- `INVALID_LANGUAGE` - Invalid programming language
- `VALIDATION_ERROR` - Data validation failed
- `TEMPLATE_ERROR` - Template generation failed
- `STORAGE_ERROR` - Storage operation failed
- `CLIPBOARD_ERROR` - Clipboard operation failed

## Examples

### Basic Header Generation

```typescript
import { generateHeader, getLanguageConfig } from './utils/template-engine';

const headerData = {
  fileName: 'api-client.js',
  project: 'My Project',
  author: 'Developer',
  version: '1.0.0',
  description: 'API client for external services',
  dependencies: 'axios, lodash',
  license: 'MIT',
  status: 'Development',
  platform: ['Chrome', 'Firefox'],
  language: 'javascript',
  usage: 'Import and use the ApiClient class',
  notes: 'Handles authentication and rate limiting',
  todo: 'Add retry logic, Implement caching'
};

const header = generateHeader(headerData, 'javascript');
console.log(header);
```

### Custom Language Support

```typescript
import { languageConfigs } from './utils/language-configs';

// Add custom language
languageConfigs['custom-lang'] = {
  commentStyle: 'multiLine',
  template: `/*
 * {{fileName}}
 * {{project}}
 * @author {{author}}
 * @version {{version}}
 * @description {{description}}
 */`,
  fileExtension: '.custom',
  keywords: ['custom', 'language']
};
```

### Settings Management

```typescript
import { getSettings, saveSettings } from './background/storage';

// Get current settings
const settings = await getSettings();

// Update settings
settings.theme = 'dark';
settings.defaultLanguage = 'python';
settings.rememberLastValues = true;

// Save settings
await saveSettings(settings);
```

## Browser Compatibility

HeadForge is compatible with:
- Chrome 88+
- Firefox 85+
- Edge 88+
- Brave (Chromium-based)

## Performance

- Header generation: < 50ms
- Language switching: < 30ms
- Theme switching: < 20ms
- Memory usage: < 10MB

## Security

- No external API calls
- Local data storage only
- Content Security Policy (CSP) compliant
- Input validation and sanitization
- No data collection or tracking
