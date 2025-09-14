#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔧 Creating .crx files for direct installation...\n");

const STORES_DIR = path.join(__dirname, "..", "store");
const RELEASE_DIR = path.join(__dirname, "..", "release-packages");

// Ensure release directory exists
if (!fs.existsSync(RELEASE_DIR)) {
  fs.mkdirSync(RELEASE_DIR, { recursive: true });
}

// Function to create .crx/.xpi file for direct installation
function createInstallFile(browser, sourceDir, outputPath) {
  try {
    if (browser === 'firefox') {
      console.log(`📦 Creating .xpi for ${browser}...`);
      // Firefox uses .xpi which is essentially a ZIP file
      execSync(`cd "${sourceDir}" && zip -r "${outputPath}" . -x "*.DS_Store" "*.git*"`, { stdio: 'inherit' });
      console.log(`✅ Created ${path.basename(outputPath)}`);
    } else {
      console.log(`📦 Creating .crx for ${browser}...`);
      
      // Check if Chrome is available for packaging
      const chromePath = process.platform === 'win32' 
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : process.platform === 'darwin'
        ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        : '/usr/bin/google-chrome';
      
      if (!fs.existsSync(chromePath)) {
        console.log(`⚠️  Chrome not found at ${chromePath}, creating ZIP instead`);
        // Fallback to ZIP if Chrome not available
        execSync(`cd "${sourceDir}" && zip -r "${outputPath.replace('.crx', '.zip')}" . -x "*.DS_Store" "*.git*"`, { stdio: 'inherit' });
        return;
      }
      
      // Use Chrome to create .crx file
      const tempKeyPath = path.join(__dirname, "..", "temp-key.pem");
      
      // Generate a temporary key if it doesn't exist
      if (!fs.existsSync(tempKeyPath)) {
        execSync(`openssl genrsa -out "${tempKeyPath}" 2048`, { stdio: 'inherit' });
      }
      
      // Create .crx file using Chrome
      execSync(`"${chromePath}" --pack-extension="${sourceDir}" --pack-extension-key="${tempKeyPath}"`, { stdio: 'inherit' });
      
      // Move the generated .crx file to release directory
      const generatedCrx = path.join(path.dirname(sourceDir), `${path.basename(sourceDir)}.crx`);
      if (fs.existsSync(generatedCrx)) {
        fs.renameSync(generatedCrx, outputPath);
        console.log(`✅ Created ${path.basename(outputPath)}`);
      } else {
        console.log(`⚠️  .crx file not generated, creating ZIP instead`);
        execSync(`cd "${sourceDir}" && zip -r "${outputPath.replace('.crx', '.zip')}" . -x "*.DS_Store" "*.git*"`, { stdio: 'inherit' });
      }
    }
    
  } catch (error) {
    console.log(`⚠️  Error creating install file for ${browser}: ${error.message}`);
    console.log(`📦 Creating ZIP fallback...`);
    execSync(`cd "${sourceDir}" && zip -r "${outputPath.replace(/\.(crx|xpi)$/, '.zip')}" . -x "*.DS_Store" "*.git*"`, { stdio: 'inherit' });
  }
}

// Create install files for each browser
const browsers = [
  { name: 'chrome', ext: 'crx' },
  { name: 'firefox', ext: 'xpi' },
  { name: 'edge', ext: 'crx' }
];

browsers.forEach(browser => {
  const sourceDir = path.join(STORES_DIR, browser.name);
  const installPath = path.join(RELEASE_DIR, `headforge-${browser.name}.${browser.ext}`);
  
  if (fs.existsSync(sourceDir)) {
    createInstallFile(browser.name, sourceDir, installPath);
  } else {
    console.log(`❌ Source directory not found: ${sourceDir}`);
  }
});

console.log("\n🎉 Install files created for direct installation!");
console.log("📁 Files location:", RELEASE_DIR);
console.log("\n📋 Installation instructions:");
console.log("• Chrome: Drag and drop .crx file to chrome://extensions/");
console.log("• Edge: Drag and drop .crx file to edge://extensions/");
console.log("• Firefox: Drag and drop .xpi file to about:addons");
console.log("• Users can install directly without going to stores");
