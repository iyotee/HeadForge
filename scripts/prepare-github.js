const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to prepare the project for GitHub repository
 * Creates necessary files and initializes git repository
 */

const PROJECT_ROOT = path.join(__dirname, '..');

function createGitIgnore() {
  console.log('📝 Creating .gitignore...');
  
  const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
# dist/ (no longer used, using store/ instead)
packages/
store/
*.zip

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores
store/
*.zip

# Temporary files
tmp/
temp/
`;

  fs.writeFileSync(path.join(PROJECT_ROOT, '.gitignore'), gitignoreContent);
  console.log('✅ .gitignore created');
}

function createGitAttributes() {
  console.log('📝 Creating .gitattributes...');
  
  const gitattributesContent = `# Auto detect text files and perform LF normalization
* text=auto

# Source code
*.js text eol=lf
*.ts text eol=lf
*.jsx text eol=lf
*.tsx text eol=lf
*.json text eol=lf
*.css text eol=lf
*.scss text eol=lf
*.html text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# Images
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.svg text

# Archives
*.zip binary
*.tar.gz binary
*.rar binary

# Executables
*.exe binary
*.dll binary
*.so binary
*.dylib binary
`;

  fs.writeFileSync(path.join(PROJECT_ROOT, '.gitattributes'), gitattributesContent);
  console.log('✅ .gitattributes created');
}

function createContributingGuide() {
  console.log('📝 Creating CONTRIBUTING.md...');
  
  const contributingContent = `# Contributing to HeadForge

Thank you for your interest in contributing to HeadForge! This document provides guidelines and information for contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: \`git clone https://github.com/your-username/headforge.git\`
3. Install dependencies: \`npm install\`
4. Create a new branch: \`git checkout -b feature/your-feature-name\`

## Development

### Prerequisites
- Node.js 18 or higher
- npm 8 or higher

### Available Scripts
- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run test\` - Run tests
- \`npm run lint\` - Run linter
- \`npm run format\` - Format code

### Project Structure
\`\`\`
src/
├── background/     # Background script
├── content/        # Content scripts
├── popup/          # Popup UI
├── options/        # Options page
├── utils/          # Utility functions
├── types/          # TypeScript types
└── styles/         # CSS styles
\`\`\`

## Code Style

- Use TypeScript for all new code
- Follow existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## Submitting Changes

1. Make your changes
2. Run tests: \`npm test\`
3. Run linter: \`npm run lint\`
4. Commit your changes: \`git commit -m "Add feature: description"\`
5. Push to your fork: \`git push origin feature/your-feature-name\`
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
`;

  fs.writeFileSync(path.join(PROJECT_ROOT, 'CONTRIBUTING.md'), contributingContent);
  console.log('✅ CONTRIBUTING.md created');
}

function createChangelog() {
  console.log('📝 Creating CHANGELOG.md...');
  
  const changelogContent = `# Changelog

All notable changes to HeadForge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release
- Support for 20+ programming languages
- Simple and complete header templates
- Dark/Light theme support
- Copy to clipboard functionality
- Export to file functionality
- Auto-update checker
- Cross-browser compatibility (Chrome, Firefox, Edge)

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## [1.0.0] - 2024-01-XX

### Added
- Initial release of HeadForge
- Core functionality for generating code headers
- Multi-language support
- Template system
- User preferences
- Export capabilities
- Update notification system
`;

  fs.writeFileSync(path.join(PROJECT_ROOT, 'CHANGELOG.md'), changelogContent);
  console.log('✅ CHANGELOG.md created');
}

function updatePackageJson() {
  console.log('📝 Updating package.json...');
  
  const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add repository information
  packageJson.repository = {
    type: 'git',
    url: 'https://github.com/satoshiba/headforge.git'
  };
  
  // Add homepage
  packageJson.homepage = 'https://github.com/satoshiba/headforge#readme';
  
  // Add bugs
  packageJson.bugs = {
    url: 'https://github.com/satoshiba/headforge/issues'
  };
  
  // Add keywords
  packageJson.keywords = [
    'browser-extension',
    'code-header',
    'developer-tools',
    'documentation',
    'programming',
    'chrome-extension',
    'firefox-addon',
    'edge-extension'
  ];
  
  // Add scripts for GitHub
  packageJson.scripts = {
    ...packageJson.scripts,
    'prepare-github': 'node scripts/prepare-github.js',
    'release': 'npm run build && node scripts/build-stores.js'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json updated');
}

function initializeGit() {
  console.log('🔧 Initializing Git repository...');
  
  try {
    // Check if git is already initialized
    execSync('git status', { stdio: 'ignore', cwd: PROJECT_ROOT });
    console.log('✅ Git repository already initialized');
  } catch (error) {
    // Initialize git repository
    execSync('git init', { cwd: PROJECT_ROOT });
    console.log('✅ Git repository initialized');
  }
  
  // Add all files
  execSync('git add .', { cwd: PROJECT_ROOT });
  console.log('✅ Files added to git');
  
  // Create initial commit
  try {
    execSync('git commit -m "Initial commit: HeadForge v1.0.0"', { cwd: PROJECT_ROOT });
    console.log('✅ Initial commit created');
  } catch (error) {
    console.log('⚠️  No changes to commit or commit already exists');
  }
}

function createStoreDescriptions() {
  console.log('📝 Creating store descriptions...');
  
  const storeDir = path.join(PROJECT_ROOT, 'store');
  if (!fs.existsSync(storeDir)) {
    fs.mkdirSync(storeDir, { recursive: true });
  }
  
  const descriptions = {
    chrome: {
      short: 'Generate professional code headers for multiple programming languages',
      long: `HeadForge is a powerful browser extension that helps developers create professional, standardized code headers for their projects.

Features:
• Support for 20+ programming languages
• Customizable templates (simple and complete)
• Auto-fill with project information
• Copy to clipboard or download as file
• Dark/Light theme support
• Export in multiple formats

Perfect for:
• Software developers
• Code documentation
• Project standardization
• Team collaboration

Languages supported: JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, HTML, CSS, and more.

Open source and free to use!`
    },
    firefox: {
      short: 'Generate professional code headers for multiple programming languages',
      long: `HeadForge is a powerful browser extension that helps developers create professional, standardized code headers for their projects.

Features:
• Support for 20+ programming languages
• Customizable templates (simple and complete)
• Auto-fill with project information
• Copy to clipboard or download as file
• Dark/Light theme support
• Export in multiple formats

Perfect for:
• Software developers
• Code documentation
• Project standardization
• Team collaboration

Languages supported: JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, HTML, CSS, and more.

Open source and free to use!`
    },
    edge: {
      short: 'Generate professional code headers for multiple programming languages',
      long: `HeadForge is a powerful browser extension that helps developers create professional, standardized code headers for their projects.

Features:
• Support for 20+ programming languages
• Customizable templates (simple and complete)
• Auto-fill with project information
• Copy to clipboard or download as file
• Dark/Light theme support
• Export in multiple formats

Perfect for:
• Software developers
• Code documentation
• Project standardization
• Team collaboration

Languages supported: JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, HTML, CSS, and more.

Open source and free to use!`
    }
  };
  
  Object.entries(descriptions).forEach(([store, desc]) => {
    const storeDir = path.join(PROJECT_ROOT, 'store', store);
    if (!fs.existsSync(storeDir)) {
      fs.mkdirSync(storeDir, { recursive: true });
    }
    
    const descPath = path.join(storeDir, 'description.txt');
    fs.writeFileSync(descPath, desc.long);
    console.log(`✅ ${store} store description created`);
  });
}

function main() {
  console.log('🚀 Preparing HeadForge for GitHub...\n');
  
  try {
    createGitIgnore();
    createGitAttributes();
    createContributingGuide();
    createChangelog();
    updatePackageJson();
    createStoreDescriptions();
    initializeGit();
    
    console.log('\n🎉 GitHub preparation completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Create a new repository on GitHub: https://github.com/satoshiba/headforge');
    console.log('2. Add the remote: git remote add origin https://github.com/satoshiba/headforge.git');
    console.log('3. Push the code: git push -u origin master');
    console.log('4. Create your first release tag: git tag v1.0.0 && git push origin v1.0.0');
    
  } catch (error) {
    console.error('\n❌ Error preparing for GitHub:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  createGitIgnore,
  createGitAttributes,
  createContributingGuide,
  createChangelog,
  updatePackageJson,
  initializeGit,
  createStoreDescriptions
};
