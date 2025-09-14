# 🏪 Store Setup Guide

This guide explains how to set up automatic submission to browser extension stores according to official requirements.

## 📋 Prerequisites

Before setting up automatic submission, ensure your extension meets all store requirements:

### ✅ Manifest Requirements
- **Manifest V3** compliant
- **No deprecated fields** (`author` field removed)
- **Proper permissions** (minimal required permissions)
- **Valid icons** (16x16, 32x32, 48x48, 128x128)
- **Descriptive content** (name, description, short_name)

### ✅ Store-Specific Requirements

#### Chrome Web Store
- **Developer Account**: $5 one-time fee
- **Review Process**: 1-3 business days
- **Policies**: [Chrome Web Store Developer Policy](https://developer.chrome.com/docs/webstore/program-policies/)

#### Firefox Add-ons
- **Developer Account**: Free
- **Review Process**: 1-7 business days
- **Policies**: [Mozilla Add-on Policies](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/AMO/Policy)

#### Microsoft Edge Add-ons
- **Developer Account**: Free via Partner Center
- **Review Process**: Up to 7 business days
- **Policies**: [Microsoft Edge Extension Policies](https://learn.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension)

## 🔑 Required Secrets

Add these secrets to your GitHub repository settings:

### Chrome Web Store
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable Chrome Web Store API
3. Create OAuth 2.0 credentials
4. Add these secrets to GitHub:
   - `CHROME_EXTENSION_ID`: Your extension ID from Chrome Web Store
   - `CHROME_CLIENT_ID`: OAuth client ID
   - `CHROME_CLIENT_SECRET`: OAuth client secret
   - `CHROME_REFRESH_TOKEN`: OAuth refresh token

### Firefox Add-ons
1. Go to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
2. Create API credentials
3. Add these secrets to GitHub:
   - `FIREFOX_API_KEY`: Your API key
   - `FIREFOX_API_SECRET`: Your API secret

### Microsoft Edge Add-ons
1. Go to [Partner Center](https://partner.microsoft.com/dashboard)
2. Create an app registration
3. Add these secrets to GitHub:
   - `EDGE_PRODUCT_ID`: Your product ID
   - `EDGE_CLIENT_ID`: App registration client ID
   - `EDGE_CLIENT_SECRET`: App registration client secret
   - `EDGE_ACCESS_TOKEN_URL`: OAuth token URL

## 🚀 How It Works

1. **Release Created**: When you create a release, the workflow automatically triggers
2. **Build & Package**: Extension is built for all browsers
3. **Store Submission**: Packages are automatically submitted to each store
4. **Auto-Update**: Users receive updates automatically through their browser

## 📋 Manual Submission

If you prefer manual submission:

```bash
# Build packages
npm run build
node scripts/build-stores.js

# Submit manually to stores
# Chrome: Upload store/headforge-chrome.zip to Chrome Web Store
# Firefox: Upload store/headforge-firefox.zip to Firefox Add-ons
# Edge: Upload store/headforge-edge.zip to Microsoft Edge Add-ons
```

## 🔄 Update Process

1. Make changes to your code
2. Create a new release: `npm run create-release`
3. GitHub Actions automatically:
   - Builds the extension
   - Creates packages
   - Submits to stores
   - Users get automatic updates

## 📱 User Experience

Once submitted to stores:
- Users install from official stores
- Updates happen automatically
- No manual downloads required
- Professional installation experience

## 🛠️ Development

For development/testing:
- Use `npm run build` to create local packages
- Load unpacked extensions in developer mode
- Test before submitting to stores

## 📞 Support

- [Chrome Web Store Developer Guide](https://developer.chrome.com/docs/webstore/)
- [Firefox Add-ons Developer Guide](https://extensionworkshop.com/)
- [Microsoft Edge Extensions Guide](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/)
