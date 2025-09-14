# Contributing to HeadForge

Thank you for your interest in contributing to HeadForge! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/headforge.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development

### Prerequisites
- Node.js 18 or higher
- npm 8 or higher

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code

### Project Structure
```
src/
├── background/     # Background script
├── content/        # Content scripts
├── popup/          # Popup UI
├── options/        # Options page
├── utils/          # Utility functions
├── types/          # TypeScript types
└── styles/         # CSS styles
```

## Code Style

- Use TypeScript for all new code
- Follow existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## Submitting Changes

1. Make your changes
2. Run tests: `npm test`
3. Run linter: `npm run lint`
4. Commit your changes: `git commit -m "Add feature: description"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Pull Request Guidelines

- Provide a clear description of your changes
- Reference any related issues
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused and atomic

## Bug Reports

When reporting bugs, please include:
- Browser and version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Feature Requests

For feature requests, please:
- Check existing issues first
- Provide a clear description
- Explain the use case
- Consider implementation complexity

## License

By contributing to HeadForge, you agree that your contributions will be licensed under the GNU General Public License v3.0.
