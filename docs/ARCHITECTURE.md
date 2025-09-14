# HeadForge Architecture

## Overview

HeadForge is a modern browser extension built with TypeScript, following a modular architecture that ensures maintainability, scalability, and cross-browser compatibility.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HeadForge Extension                      │
├─────────────────────────────────────────────────────────────┤
│  Popup UI          │  Options Page    │  Background Script  │
│  - Form Interface  │  - Settings      │  - Service Worker   │
│  - Preview         │  - Preferences   │  - Message Handler  │
│  - Export Options  │  - Theme Config  │  - Storage Manager  │
├─────────────────────────────────────────────────────────────┤
│  Content Scripts   │  Utils           │  Types              │
│  - Editor Insert   │  - Template      │  - Interfaces       │
│  - Page Detection  │  - Validation    │  - Enums            │
│  - DOM Manipulation│  - Date Utils    │  - Constants        │
├─────────────────────────────────────────────────────────────┤
│  Storage           │  Themes          │  Assets             │
│  - Local Storage   │  - Light/Dark    │  - Icons            │
│  - Settings        │  - CSS Variables │  - Images           │
│  - Preferences     │  - Animations    │  - Fonts            │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Popup Interface (`src/popup/`)

The main user interface for the extension.

**Files:**
- `popup.html` - HTML structure
- `popup.css` - Styling and layout
- `popup.ts` - Main logic and event handling

**Responsibilities:**
- Form input handling
- Real-time preview generation
- Export functionality (copy, download, insert)
- Theme switching
- User interaction management

**Key Features:**
- Responsive design (400px width, 600px height)
- Form validation with real-time feedback
- Keyboard shortcuts support
- Accessibility compliance (WCAG 2.1)

### 2. Options Page (`src/options/`)

Settings and preferences management interface.

**Files:**
- `options.html` - HTML structure
- `options.css` - Styling
- `options.ts` - Settings logic
- `pages/` - Individual settings pages

**Responsibilities:**
- User preferences management
- Theme configuration
- Default values setup
- Settings import/export
- Advanced configuration

### 3. Background Script (`src/background/`)

Service worker for background operations.

**Files:**
- `background.ts` - Main service worker
- `messaging.ts` - Message handling
- `storage.ts` - Storage operations

**Responsibilities:**
- Extension lifecycle management
- Message routing between components
- Storage operations
- Background tasks
- Cross-tab communication

### 4. Content Scripts (`src/content/`)

Scripts injected into web pages for editor integration.

**Files:**
- `content-script.ts` - Main content script
- `injection.ts` - Code injection logic

**Responsibilities:**
- Editor detection and integration
- Direct code insertion
- Page context awareness
- DOM manipulation

### 5. Utilities (`src/utils/`)

Core functionality and helper functions.

**Files:**
- `template-engine.ts` - Header generation logic
- `language-configs.ts` - Language-specific configurations
- `validation.ts` - Input validation
- `date-utils.ts` - Date handling
- `clipboard.ts` - Clipboard operations
- `file-utils.ts` - File operations
- `constants.ts` - Application constants

**Responsibilities:**
- Header template processing
- Language-specific formatting
- Data validation and sanitization
- Utility functions
- Constants and configuration

### 6. Types (`src/types/`)

TypeScript type definitions.

**Files:**
- `index.ts` - Main type definitions
- `browser.ts` - Browser API types
- `language.ts` - Language-related types
- `storage.ts` - Storage types
- `template.ts` - Template types

**Responsibilities:**
- Type safety
- Interface definitions
- Enum definitions
- Type validation

### 7. Styles (`src/styles/`)

CSS and styling system.

**Files:**
- `globals.css` - Global styles and resets
- `themes.css` - Theme definitions
- `components.css` - Component styles
- `animations.css` - Animation definitions
- `variables.css` - CSS custom properties

**Responsibilities:**
- Visual design system
- Theme management
- Responsive design
- Animation system
- Accessibility styling

## Data Flow

### 1. Header Generation Flow

```
User Input → Validation → Template Processing → Preview → Export
     ↓           ↓              ↓              ↓         ↓
  Form Data → Validation → Language Config → Display → Clipboard/File
```

### 2. Settings Management Flow

```
User Changes → Validation → Storage → Background Sync → UI Update
     ↓            ↓           ↓           ↓              ↓
  Settings → Validation → Local Storage → Service Worker → Options Page
```

### 3. Theme Management Flow

```
Theme Toggle → CSS Variables → Storage → Background Sync → UI Update
     ↓             ↓            ↓           ↓              ↓
  User Action → Theme CSS → Local Storage → Service Worker → All Components
```

## Storage Architecture

### Local Storage Structure

```typescript
interface StorageData {
  settings: ExtensionSettings;
  preferences: UserPreferences;
  lastValues: HeaderData;
  theme: Theme;
  language: string;
  license: string;
  status: string;
}
```

### Storage Operations

- **Read**: `chrome.storage.local.get()`
- **Write**: `chrome.storage.local.set()`
- **Clear**: `chrome.storage.local.clear()`
- **Listen**: `chrome.storage.onChanged`

## Message System

### Message Types

```typescript
enum MessageType {
  GENERATE_HEADER = 'GENERATE_HEADER',
  COPY_CLIPBOARD = 'COPY_CLIPBOARD',
  SAVE_FILE = 'SAVE_FILE',
  INSERT_EDITOR = 'INSERT_EDITOR',
  GET_SETTINGS = 'GET_SETTINGS',
  SAVE_SETTINGS = 'SAVE_SETTINGS',
  THEME_CHANGE = 'THEME_CHANGE'
}
```

### Message Flow

```
Popup → Background → Content Script
  ↓         ↓            ↓
Request → Processing → Response
```

## Build System

### Webpack Configuration

- **Base Config**: Common configuration for all browsers
- **Dev Config**: Development-specific settings with hot reload
- **Prod Config**: Production optimizations and minification

### Browser-Specific Builds

- **Chrome**: Manifest V3, Chrome-specific APIs
- **Firefox**: WebExtension API, Firefox-specific features
- **Edge**: Manifest V3, Edge-specific optimizations

### Build Process

```
Source Code → TypeScript Compilation → Webpack Bundling → Browser-Specific Output
     ↓              ↓                      ↓                    ↓
  .ts/.tsx → JavaScript → Bundled Files → Chrome/Firefox/Edge
```

## Testing Architecture

### Test Structure

```
tests/
├── unit/           # Unit tests for individual functions
├── integration/    # Integration tests for component interaction
├── e2e/           # End-to-end user journey tests
└── fixtures/      # Test data and mock files
```

### Test Types

- **Unit Tests**: Individual function testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Complete user workflow testing
- **Performance Tests**: Load time and memory usage
- **Accessibility Tests**: WCAG compliance testing

## Security Architecture

### Content Security Policy (CSP)

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### Security Measures

- **Input Validation**: All user inputs are validated and sanitized
- **XSS Prevention**: No inline scripts or eval() usage
- **Permission Minimization**: Only necessary permissions requested
- **Data Privacy**: No external data transmission
- **Secure Storage**: Local storage only, no cloud sync

## Performance Architecture

### Optimization Strategies

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Separate bundles for different features
- **Caching**: Template and configuration caching
- **Minification**: Production builds are minified
- **Tree Shaking**: Unused code elimination

### Performance Targets

- **Load Time**: < 100ms
- **Header Generation**: < 50ms
- **Memory Usage**: < 10MB
- **Bundle Size**: < 500KB

## Cross-Browser Compatibility

### Browser Support Matrix

| Feature | Chrome | Firefox | Edge | Brave |
|---------|--------|---------|------|-------|
| Manifest V3 | ✅ | ❌ | ✅ | ✅ |
| WebExtension API | ❌ | ✅ | ❌ | ❌ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Storage API | ✅ | ✅ | ✅ | ✅ |
| Clipboard API | ✅ | ✅ | ✅ | ✅ |

### Compatibility Layer

- **Polyfills**: Browser-specific polyfills
- **Feature Detection**: Runtime feature detection
- **Fallbacks**: Graceful degradation for unsupported features
- **Unified API**: Common interface across browsers

## Deployment Architecture

### CI/CD Pipeline

```
Code Push → GitHub Actions → Build → Test → Package → Deploy
     ↓           ↓            ↓       ↓        ↓         ↓
  Repository → Workflows → Webpack → Jest → ZIP → Store
```

### Release Process

1. **Development**: Feature development and testing
2. **Staging**: Pre-release testing and validation
3. **Production**: Store submission and release
4. **Monitoring**: Post-release monitoring and feedback

## Monitoring and Analytics

### Performance Monitoring

- **Load Time Tracking**: Extension startup performance
- **Memory Usage**: Runtime memory consumption
- **Error Tracking**: Exception and error logging
- **User Metrics**: Usage patterns and preferences

### Privacy-Compliant Analytics

- **Local Analytics**: No external data transmission
- **Aggregate Data**: Anonymous usage statistics
- **User Consent**: Opt-in analytics only
- **Data Retention**: Limited data retention periods

## Future Architecture Considerations

### Scalability

- **Plugin System**: Extensible language support
- **Template Engine**: Custom template support
- **API Integration**: External service integration
- **Cloud Sync**: Optional cloud synchronization

### Maintainability

- **Modular Design**: Clear separation of concerns
- **Documentation**: Comprehensive API documentation
- **Testing**: High test coverage
- **Code Quality**: ESLint, Prettier, TypeScript

### Extensibility

- **Custom Languages**: User-defined language support
- **Template Library**: Community template sharing
- **Plugin API**: Third-party plugin support
- **Theme System**: Custom theme creation
