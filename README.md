# 🔨 HeadForge - Professional Code Header Generator

**Generate beautiful, professional code headers for multiple programming languages with ease.**

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Firefox%20%7C%20Edge%20%7C%20Brave-orange.svg)

## ✨ Features

- **25+ Programming Languages** - JavaScript, TypeScript, Python, Java, C++, HTML, CSS, and more
- **Professional Templates** - Clean, standardized header formats
- **Cross-Browser Support** - Chrome, Firefox, Edge, Brave
- **Dark/Light Theme** - Automatic theme detection
- **Export Options** - Copy to clipboard, save as file, or insert into editor
- **Customizable Fields** - Project, author, version, license, platform, and more
- **Live Preview** - See your header before generating
- **Form Validation** - Ensure all required fields are filled
- **Auto-fill Dates** - Automatic creation and update dates

## 🚀 Installation

### From Browser Stores
- **Chrome Web Store**: [Install HeadForge](https://chrome.google.com/webstore)
- **Firefox Add-ons**: [Install HeadForge](https://addons.mozilla.org/firefox)
- **Edge Add-ons**: [Install HeadForge](https://microsoftedge.microsoft.com/addons)

### Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/satoshiba/headforge/releases)
2. Extract the ZIP file
3. Open your browser's extension management page
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extracted folder

## 💻 Development

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with extension support

### Setup
```bash
# Clone the repository
git clone https://github.com/satoshiba/headforge.git
cd headforge

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Package for distribution
npm run package:all
```

### Project Structure
```
HeadForge/
├── src/
│   ├── popup/           # Extension popup
│   ├── options/         # Options page
│   ├── background/      # Background script
│   ├── content/         # Content scripts
│   ├── utils/           # Utility functions
│   ├── styles/          # CSS styles
│   └── manifest.json    # Extension manifest
├── scripts/             # Build and utility scripts
├── tests/               # Test files
├── store/               # Store assets and descriptions
└── docs/                # Documentation
```

## 🎯 Usage

1. **Click the HeadForge icon** in your browser toolbar
2. **Fill in the form fields**:
   - File Name (required)
   - Project Name (required)
   - Author (required)
   - Version (required)
   - Programming Language (required)
   - License (required)
   - Status (required)
   - Platform(s) (required)
   - Optional: Description, Usage, Notes, TODO
3. **Click "Generate"** to create your header
4. **Preview** the generated header
5. **Copy to clipboard** or **save as file**

## 🛠️ Supported Languages

| Language | Extension | Comment Style |
|----------|-----------|---------------|
| JavaScript | `.js` | `/* */` and `//` |
| TypeScript | `.ts` | `/* */` and `//` |
| Python | `.py` | `"""` and `#` |
| Java | `.java` | `/** */` and `//` |
| C++ | `.cpp` | `/* */` and `//` |
| C# | `.cs` | `/* */` and `//` |
| Go | `.go` | `/* */` and `//` |
| Rust | `.rs` | `/* */` and `//` |
| PHP | `.php` | `/* */` and `//` |
| Ruby | `.rb` | `=begin =end` and `#` |
| HTML | `.html` | `<!-- -->` |
| CSS | `.css` | `/* */` |
| SQL | `.sql` | `/* */` and `--` |
| Bash | `.sh` | `#` |
| PowerShell | `.ps1` | `<# #>` and `#` |
| And more... | | |

## 🎨 Customization

### Themes
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes for dark environments
- **Auto Theme**: Follows your system preference

### Templates
Create custom templates for your specific needs:
1. Open Options page
2. Go to Templates section
3. Add new language or modify existing templates
4. Save and use in the popup

## 📝 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Documentation

- [API Reference](docs/API_REFERENCE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Contributing Guide](docs/CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## 🐛 Bug Reports

If you find a bug, please create an issue on [GitHub Issues](https://github.com/satoshiba/headforge/issues) with:
- Browser and version
- Extension version
- Steps to reproduce
- Expected vs actual behavior

## 💡 Feature Requests

Have an idea for a new feature? Create a feature request on [GitHub Issues](https://github.com/satoshiba/headforge/issues) with the `enhancement` label.

## 📊 Stats

- **25+** Supported programming languages
- **4** Major browsers supported
- **Cross-platform** Windows, macOS, Linux
- **Lightweight** < 1MB extension size
- **Fast** Generate headers in milliseconds

## 🙏 Acknowledgments

- Icons by [Heroicons](https://heroicons.com/)
- CSS framework inspired by [Tailwind CSS](https://tailwindcss.com/)
- Built with modern web standards

---

**Made with ❤️ by Satoshiba**

[Website](https://satoshiba.dev) • [GitHub](https://github.com/satoshiba) • [Twitter](https://twitter.com/satoshiba)