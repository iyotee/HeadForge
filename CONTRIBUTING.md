# 🤝 Contributing to HeadForge

Thank you for your interest in contributing to HeadForge! We welcome contributions from the community and appreciate your help in making HeadForge better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)
- [Community Guidelines](#community-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@headforge.dev](mailto:conduct@headforge.dev).

## 🚀 Getting Started

### Prerequisites
- **Node.js** (Version 18 or higher)
- **npm** (Version 8 or higher)
- **Git** (Latest version)
- **Browser** (Chrome, Firefox, or Edge for testing)

### Quick Start
```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/HeadForge.git
cd HeadForge

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 How to Contribute

### 🐛 Bug Reports
When reporting bugs, please include:
- **Clear Description** - What happened vs what you expected
- **Steps to Reproduce** - Detailed steps to reproduce the issue
- **Environment** - Browser version, OS, extension version
- **Screenshots** - If applicable, include screenshots
- **Console Logs** - Any error messages or console output

### ✨ Feature Requests
For feature requests, please provide:
- **Use Case** - Why would this feature be useful?
- **Detailed Description** - How should the feature work?
- **Examples** - Mockups or examples if possible
- **Alternatives** - Any alternative solutions you've considered

### 💻 Code Contributions
We welcome code contributions! Please:
- **Check Issues** - Look for existing issues or create new ones
- **Fork Repository** - Create your own fork
- **Create Branch** - Use descriptive branch names
- **Follow Standards** - Adhere to our coding standards
- **Test Changes** - Ensure all tests pass
- **Submit PR** - Create a pull request with detailed description

### 📚 Documentation
Help improve our documentation:
- **Fix Typos** - Correct spelling and grammar errors
- **Clarify Instructions** - Make instructions clearer
- **Add Examples** - Include practical examples
- **Update Content** - Keep documentation current

## 🛠️ Development Setup

### Project Structure
```
HeadForge/
├── src/                    # Source code
│   ├── background/         # Background scripts
│   ├── content/           # Content scripts
│   ├── popup/             # Extension popup
│   ├── options/           # Options page
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   └── styles/            # CSS styles
├── config/                # Configuration files
├── scripts/               # Build and utility scripts
├── tests/                 # Test files
├── docs/                  # Documentation
├── docs-wiki/             # GitHub wiki content
└── store/                 # Built extensions
```

### Available Scripts
```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run build:stores     # Build store packages

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # Run TypeScript type checking

# Utilities
npm run clean            # Clean build directories
npm run validate         # Validate builds
npm run format           # Format code with Prettier
```

### Environment Setup
1. **Clone Repository** - Fork and clone the repository
2. **Install Dependencies** - Run `npm install`
3. **Start Development** - Run `npm run dev`
4. **Load Extension** - Load the extension in your browser
5. **Make Changes** - Edit code and see changes in real-time

## 📏 Coding Standards

### TypeScript
- **Strict Mode** - Use strict TypeScript settings
- **Type Safety** - Define proper types for all functions
- **Interfaces** - Use interfaces for object shapes
- **Enums** - Use enums for constants
- **No Any** - Avoid using `any` type

### Code Style
- **Prettier** - Use Prettier for code formatting
- **ESLint** - Follow ESLint rules and fix warnings
- **Naming** - Use descriptive variable and function names
- **Comments** - Add JSDoc comments for public functions
- **Consistency** - Follow existing code patterns

### File Organization
- **Modular Structure** - Keep files focused and small
- **Consistent Naming** - Use kebab-case for files, camelCase for variables
- **Proper Imports** - Use relative imports for local files
- **Export Structure** - Use named exports when possible

### Git Conventions
- **Commit Messages** - Use conventional commit format
- **Branch Names** - Use descriptive branch names (feature/, bugfix/, etc.)
- **Pull Requests** - Use descriptive titles and descriptions
- **Code Review** - Respond to feedback promptly

## 🧪 Testing

### Test Structure
- **Unit Tests** - Test individual functions and components
- **Integration Tests** - Test component interactions
- **E2E Tests** - Test complete user workflows
- **Accessibility Tests** - Ensure accessibility compliance

### Writing Tests
```typescript
// Example test structure
describe('HeaderGenerator', () => {
  it('should generate simple header', () => {
    // Arrange
    const input = { project: 'Test', author: 'Developer' };
    
    // Act
    const result = generateHeader(input);
    
    // Assert
    expect(result).toContain('Test');
    expect(result).toContain('Developer');
  });
});
```

### Test Guidelines
- **Coverage** - Aim for high test coverage
- **Descriptive Names** - Use clear test descriptions
- **Arrange-Act-Assert** - Follow AAA pattern
- **Mock Dependencies** - Mock external dependencies
- **Edge Cases** - Test edge cases and error conditions

## 🔄 Pull Request Process

### Before Submitting
1. **Fork Repository** - Create your own fork
2. **Create Branch** - Use descriptive branch names
3. **Make Changes** - Implement your changes
4. **Test Changes** - Ensure all tests pass
5. **Update Docs** - Update documentation if needed
6. **Check CI** - Ensure CI/CD pipeline passes

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed
- [ ] Cross-browser testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] CI/CD pipeline passes
```

### Review Process
1. **Automated Checks** - CI/CD pipeline runs automatically
2. **Code Review** - Maintainers review the code
3. **Testing** - Changes are tested thoroughly
4. **Approval** - PR is approved and merged

## 🚀 Release Process

### Version Numbering
- **Semantic Versioning** - Follow semver (MAJOR.MINOR.PATCH)
- **Changelog** - Update CHANGELOG.md for each release
- **Git Tags** - Create git tags for releases
- **Release Notes** - Write comprehensive release notes

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Git tag created
- [ ] Release published
- [ ] Store packages built
- [ ] Announcement made

## 👥 Community Guidelines

### Communication
- **Be Respectful** - Treat everyone with respect
- **Be Constructive** - Provide constructive feedback
- **Be Patient** - Remember that everyone is learning
- **Be Helpful** - Help others when you can

### Getting Help
- **GitHub Discussions** - Ask questions and get help
- **Issues** - Report problems and request features
- **Wiki** - Check comprehensive documentation
- **Code Review** - Get feedback on your contributions

### Recognition
- **Contributors** - All contributors are recognized
- **Maintainers** - Core maintainers are listed
- **Community** - Community members are valued
- **Feedback** - We appreciate all feedback

## 🎯 Areas for Contribution

### High Priority
- **New Language Support** - Add support for additional programming languages
- **Template Improvements** - Enhance existing templates
- **Performance Optimization** - Improve extension performance
- **Accessibility** - Improve accessibility features

### Medium Priority
- **UI/UX Improvements** - Enhance user interface
- **Testing Coverage** - Increase test coverage
- **Documentation** - Improve documentation quality
- **Internationalization** - Add multi-language support

### Low Priority
- **Code Refactoring** - Improve code structure
- **Build Optimization** - Optimize build process
- **Developer Tools** - Add development utilities
- **Analytics** - Add usage analytics (privacy-friendly)

## 📞 Contact

### Maintainers
- **@iyotee** - Project maintainer
- **Response Time** - Usually within 24-48 hours
- **Guidance** - Happy to help with contributions
- **Feedback** - Constructive feedback provided

### Community
- **GitHub Discussions** - [Join discussions](https://github.com/iyotee/HeadForge/discussions)
- **Issues** - [Report issues](https://github.com/iyotee/HeadForge/issues)
- **Wiki** - [Check documentation](https://github.com/iyotee/HeadForge/wiki)
- **Email** - [Contact us](mailto:contributors@headforge.dev)

## 📄 License

By contributing to HeadForge, you agree that your contributions will be licensed under the GNU General Public License v3.0.

---

**Thank you for contributing to HeadForge! 🎉**

Your contributions help make HeadForge better for developers worldwide. We appreciate your time and effort in improving this project.