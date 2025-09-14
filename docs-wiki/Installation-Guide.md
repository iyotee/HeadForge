# 📥 Installation Guide

This guide will walk you through installing HeadForge on your preferred browser.

## 🌐 Supported Browsers

HeadForge is available for:
- **Google Chrome** (Chrome Web Store)
- **Mozilla Firefox** (Firefox Add-ons)
- **Microsoft Edge** (Edge Add-ons)

## 🚀 Installation Methods

### Method 1: Browser Store (Recommended)

#### Chrome
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "HeadForge"
3. Click "Add to Chrome"
4. Confirm the installation

#### Firefox
1. Visit [Firefox Add-ons](https://addons.mozilla.org)
2. Search for "HeadForge"
3. Click "Add to Firefox"
4. Confirm the installation

#### Edge
1. Visit [Edge Add-ons](https://microsoftedge.microsoft.com/addons)
2. Search for "HeadForge"
3. Click "Get"
4. Confirm the installation

### Method 2: Manual Installation (Development)

If you want to install the development version:

1. **Download the Extension**
   - Clone the repository: `git clone https://github.com/iyotee/HeadForge.git`
   - Or download the ZIP file from GitHub

2. **Build the Extension**
   ```bash
   cd HeadForge
   npm install
   npm run build
   ```

3. **Load in Browser**

   **Chrome/Edge:**
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `store/chrome` folder

   **Firefox:**
   - Open `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` from `store/firefox`

## ✅ Verification

After installation:

1. Look for the HeadForge icon in your browser toolbar
2. Click the icon to open the extension popup
3. You should see the HeadForge interface

## 🔧 Troubleshooting

### Extension Not Appearing
- Refresh your browser
- Check if the extension is enabled in your browser's extension settings
- Try reinstalling the extension

### Build Issues
- Ensure you have Node.js installed (version 16 or higher)
- Run `npm install` to install dependencies
- Check that all build scripts complete successfully

### Permission Issues
- The extension requires minimal permissions
- Only clipboard access for copying generated headers
- No data collection or external requests

## 📱 System Requirements

- **Browser**: Chrome 88+, Firefox 85+, Edge 88+
- **Operating System**: Windows, macOS, Linux
- **Memory**: Minimal impact (< 10MB)
- **Storage**: < 5MB

## 🔄 Updates

HeadForge automatically checks for updates and notifies you when new versions are available. You can also manually check for updates using the "Check for Updates" button in the extension popup.

## 🆘 Need Help?

If you encounter any issues during installation:

1. Check our [FAQ](FAQ.md) for common solutions
2. Visit our [GitHub Issues](https://github.com/iyotee/HeadForge/issues)
3. Contact our support team

---

*Ready to start using HeadForge? Check out our [Quick Start Guide](Quick-Start.md)!*
