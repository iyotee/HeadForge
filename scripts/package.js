const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class ExtensionPackager {
  constructor() {
    this.distDir = path.join(__dirname, '../dist');
    this.packagesDir = path.join(__dirname, '../packages');
    this.browsers = ['chrome', 'firefox', 'edge'];
  }

  async packageExtension(browser) {
    console.log(`Packaging extension for ${browser}...`);
    
    const browserDistDir = path.join(this.distDir, browser);
    const packagePath = path.join(this.packagesDir, `headforge-${browser}-v${this.getVersion()}.zip`);
    
    // Ensure packages directory exists
    if (!fs.existsSync(this.packagesDir)) {
      fs.mkdirSync(this.packagesDir, { recursive: true });
    }
    
    // Create browser-specific manifest
    await this.createBrowserManifest(browser);
    
    // Create zip file
    await this.createZipFile(browserDistDir, packagePath);
    
    console.log(`✅ Package created: ${packagePath}`);
    return packagePath;
  }

  async createBrowserManifest(browser) {
    const baseManifestPath = path.join(this.distDir, 'manifest.json');
    const browserManifestPath = path.join(this.distDir, browser, 'manifest.json');
    
    let manifest = JSON.parse(fs.readFileSync(baseManifestPath, 'utf8'));
    
    // Browser-specific modifications
    switch (browser) {
      case 'firefox':
        // Firefox specific modifications
        manifest = this.adaptForFirefox(manifest);
        break;
      case 'edge':
        // Edge specific modifications
        manifest = this.adaptForEdge(manifest);
        break;
      case 'chrome':
        // Chrome specific modifications
        manifest = this.adaptForChrome(manifest);
        break;
    }
    
    // Write browser-specific manifest
    fs.writeFileSync(browserManifestPath, JSON.stringify(manifest, null, 2));
  }

  adaptForFirefox(manifest) {
    // Firefox uses manifest v2 for now
    manifest.manifest_version = 2;
    
    // Convert service worker to background script
    if (manifest.background?.service_worker) {
      manifest.background = {
        scripts: [manifest.background.service_worker.replace('.js', '.js')],
        persistent: false
      };
    }
    
    // Firefox specific permissions
    manifest.permissions = manifest.permissions || [];
    if (!manifest.permissions.includes('activeTab')) {
      manifest.permissions.push('activeTab');
    }
    
    // Remove host_permissions (not supported in v2)
    if (manifest.host_permissions) {
      manifest.permissions = manifest.permissions.concat(manifest.host_permissions);
      delete manifest.host_permissions;
    }
    
    return manifest;
  }

  adaptForEdge(manifest) {
    // Edge uses manifest v3 like Chrome
    // Add Edge-specific properties
    manifest.minimum_edge_version = "88";
    
    return manifest;
  }

  adaptForChrome(manifest) {
    // Chrome uses manifest v3
    // Add Chrome-specific properties
    manifest.minimum_chrome_version = "88";
    
    return manifest;
  }

  async createZipFile(sourceDir, outputPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => {
        console.log(`Archive created: ${archive.pointer()} total bytes`);
        resolve();
      });
      
      archive.on('error', (err) => {
        reject(err);
      });
      
      archive.pipe(output);
      
      // Add all files from source directory
      archive.directory(sourceDir, false);
      
      archive.finalize();
    });
  }

  getVersion() {
    const packageJsonPath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  }

  async packageAll() {
    console.log('🚀 Starting extension packaging...');
    console.log('=' * 50);
    
    const packages = [];
    
    for (const browser of this.browsers) {
      try {
        const packagePath = await this.packageExtension(browser);
        packages.push(packagePath);
      } catch (error) {
        console.error(`❌ Failed to package ${browser}:`, error.message);
      }
    }
    
    console.log('\n📦 Packaging Summary:');
    console.log('=' * 30);
    packages.forEach(pkg => {
      const stats = fs.statSync(pkg);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ ${path.basename(pkg)} (${sizeKB} KB)`);
    });
    
    // Create release notes
    await this.createReleaseNotes(packages);
    
    console.log('\n🎉 All packages created successfully!');
    return packages;
  }

  async createReleaseNotes(packages) {
    const version = this.getVersion();
    const releaseNotesPath = path.join(this.packagesDir, `release-notes-v${version}.md`);
    
    const releaseNotes = `# HeadForge v${version} Release Notes

## 📦 Packages

${packages.map(pkg => `- \`${path.basename(pkg)}\``).join('\n')}

## 🚀 Installation

### Chrome/Edge
1. Download the Chrome package
2. Open Chrome/Edge and go to Extensions (chrome://extensions or edge://extensions)
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extracted folder

### Firefox
1. Download the Firefox package
2. Open Firefox and go to about:debugging
3. Click "This Firefox"
4. Click "Load Temporary Add-on" and select the manifest.json file

## 🔧 Development

For development builds, use:
\`\`\`bash
npm run dev
\`\`\`

## 📋 Features

- ✅ 25+ Programming Languages Support
- ✅ Cross-browser Compatibility
- ✅ Modern UI with Theme Support
- ✅ Real-time Header Preview
- ✅ Export Options (Clipboard, File, Insert)
- ✅ User Preferences Management
- ✅ Input Validation
- ✅ Keyboard Shortcuts

## 🐛 Bug Reports

Please report issues at: https://github.com/iyotee/HeadForge/issues

## 📄 License

GPL-3.0 - See LICENSE file for details
`;

    fs.writeFileSync(releaseNotesPath, releaseNotes);
    console.log(`📝 Release notes created: ${releaseNotesPath}`);
  }
}

// CLI usage
if (require.main === module) {
  const browser = process.argv[2];
  const packager = new ExtensionPackager();
  
  if (browser && packager.browsers.includes(browser)) {
    packager.packageExtension(browser);
  } else if (browser === 'all' || !browser) {
    packager.packageAll();
  } else {
    console.error(`Invalid browser: ${browser}`);
    console.error(`Available browsers: ${packager.browsers.join(', ')}, all`);
    process.exit(1);
  }
}

module.exports = ExtensionPackager;
