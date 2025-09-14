# 🤝 Contributing to HeadForge

Thank you for your interest in contributing to HeadForge! This guide will help you get started with contributing to our open source project.

## 🎯 How to Contribute

### Code Contributions
- **Bug Fixes**: Fix existing issues
- **New Features**: Add new functionality
- **Language Support**: Add new programming languages
- **Improvements**: Enhance existing features

### Non-Code Contributions
- **Documentation**: Improve guides and documentation
- **Testing**: Test new features and report bugs
- **Design**: Improve UI/UX
- **Community**: Help other users and contributors

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Development Setup
1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/HeadForge.git
   cd HeadForge
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run build
   ```

4. **Load in Browser**
   - Chrome: Load `store/chrome` folder
   - Firefox: Load `store/firefox` folder
   - Edge: Load `store/edge` folder

## 🛠️ Development Workflow

### Making Changes
1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add tests for new features
   - Update documentation

3. **Test Your Changes**
   ```bash
   npm test
   npm run build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines
- **TypeScript**: Use TypeScript for all new code
- **Formatting**: Use Prettier for code formatting
- **Linting**: Follow ESLint rules
- **Naming**: Use descriptive, clear names
- **Comments**: Add comments for complex logic

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

### Test Structure
```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

## 🌐 Adding New Languages

### Language Configuration
Add new languages to `src/utils/language-configs.ts`:

```typescript
{
  id: 'newlanguage',
  name: 'New Language',
  extension: '.nl',
  commentLine: '//',
  commentStart: '/*',
  commentEnd: '*/',
  category: 'Programming',
  template: `// {{fileName}}
// {{project}}
// Author: {{author}}`,
  templateComplete: `/*
 * {{fileName}}
 * {{project}}
 * Author: {{author}}
 */`
}
```

### Testing New Languages
1. Add tests for the new language
2. Verify comment syntax is correct
3. Test both simple and complete templates
4. Ensure proper formatting

## 🐛 Bug Reports

### Before Reporting
1. Check if the bug is already reported
2. Try the latest version
3. Test in different browsers
4. Gather relevant information

### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- Browser: [e.g., Chrome 88]
- OS: [e.g., Windows 10]
- HeadForge Version: [e.g., 1.0.0]

**Additional Context**
Any other relevant information.
```

## ✨ Feature Requests

### Before Requesting
1. Check if the feature is already requested
2. Consider if it fits the project's scope
3. Think about implementation complexity
4. Consider user impact

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature.

**Use Case**
Why would this feature be useful?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other relevant information.
```

## 📝 Documentation

### Types of Documentation
- **Code Comments**: Explain complex logic
- **README Updates**: Update project information
- **Wiki Pages**: Improve user guides
- **API Documentation**: Document new APIs

### Documentation Guidelines
- **Clear and Concise**: Write for your audience
- **Examples**: Include code examples
- **Up-to-Date**: Keep documentation current
- **Consistent**: Follow existing style

## 🔄 Pull Request Process

### Before Submitting
1. **Test Your Changes**: Ensure everything works
2. **Update Documentation**: Update relevant docs
3. **Write Tests**: Add tests for new features
4. **Check Style**: Follow code style guidelines

### PR Template
```markdown
**Description**
Brief description of changes.

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing

**Checklist**
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process
1. **Automated Checks**: CI/CD pipeline runs
2. **Code Review**: Maintainers review code
3. **Testing**: Manual testing by reviewers
4. **Approval**: Maintainers approve changes
5. **Merge**: Changes are merged to main

## 🏆 Recognition

### Contributors
- **Code Contributors**: Listed in contributors
- **Documentation**: Recognized in docs
- **Community**: Featured in community highlights
- **Long-term**: Maintainer status consideration

### Contribution Levels
- **First-time**: Welcome and guidance
- **Regular**: Recognition and trust
- **Core**: Maintainer responsibilities
- **Lead**: Project leadership

## 📞 Getting Help

### Community Support
- **GitHub Discussions**: Ask questions
- **Issue Tracker**: Report problems
- **Community Chat**: Real-time help
- **Documentation**: Self-service help

### Maintainer Contact
- **GitHub Issues**: For project-related questions
- **Email**: For sensitive or private matters
- **Community**: For general discussions

## 📋 Code of Conduct

### Our Standards
- **Respectful**: Treat everyone with respect
- **Inclusive**: Welcome all contributors
- **Professional**: Maintain professional behavior
- **Constructive**: Provide constructive feedback

### Enforcement
- **Warning**: First offense gets a warning
- **Temporary Ban**: Repeated offenses
- **Permanent Ban**: Severe violations
- **Appeal Process**: Fair appeal process

## 🎉 Thank You!

Thank you for contributing to HeadForge! Your contributions help make this project better for everyone. Whether you're fixing bugs, adding features, or improving documentation, every contribution matters.

### Quick Links
- **Repository**: [GitHub](https://github.com/iyotee/HeadForge)
- **Issues**: [Bug Reports](https://github.com/iyotee/HeadForge/issues)
- **Discussions**: [Community](https://github.com/iyotee/HeadForge/discussions)
- **Wiki**: [Documentation](https://github.com/iyotee/HeadForge/wiki)

---

*Ready to contribute? Check out our [Quick Start Guide](Quick-Start.md) to get started!*
