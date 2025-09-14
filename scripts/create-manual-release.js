#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

console.log("🚀 Creating manual release from tag...\n");

// Get the latest tag
const latestTag = execSync("git describe --tags --abbrev=0", { encoding: "utf8" }).trim();
console.log(`📦 Latest tag: ${latestTag}`);

// Check if release already exists
try {
  const releases = execSync(`gh release list --limit 10`, { encoding: "utf8" });
  if (releases.includes(latestTag)) {
    console.log(`❌ Release ${latestTag} already exists!`);
    console.log("📋 Existing releases:");
    console.log(releases);
    process.exit(1);
  }
} catch (error) {
  console.log("ℹ️  No existing releases found or gh CLI not available");
}

// Create release with GitHub CLI
try {
  console.log(`🏷️  Creating release ${latestTag}...`);
  
  const releaseNotes = `## What's New in ${latestTag}

### 🚀 Features
- Enhanced code header generation
- Support for 25+ programming languages
- Direct browser installation (.crx/.xpi files)
- Store submission packages (.zip files)

### 📦 Downloads

**For Direct Installation (Recommended for Users):**
- **Chrome**: Download \`headforge-chrome.crx\` and drag to chrome://extensions/
- **Edge**: Download \`headforge-edge.crx\` and drag to edge://extensions/
- **Firefox**: Download \`headforge-firefox.xpi\` and drag to about:addons

**For Store Submission (Developers/Partners):**
- **Chrome Web Store**: Use \`headforge-chrome.zip\`
- **Firefox Add-ons**: Use \`headforge-firefox.zip\`
- **Microsoft Edge**: Use \`headforge-edge.zip\`

### 📋 Installation Instructions

**Direct Installation (.crx/.xpi files):**
1. Download the install file for your browser (.crx for Chrome/Edge, .xpi for Firefox)
2. Open your browser's extension page:
   - Chrome: chrome://extensions/
   - Edge: edge://extensions/
   - Firefox: about:addons
3. Drag and drop the file onto the page
4. Click "Add extension" when prompted

**Developer Installation (.zip files):**
1. Download the ZIP file for your browser
2. Extract the ZIP file
3. Open your browser's extension management page
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extracted folder

### 🔧 Development
- Source code: [GitHub Repository](https://github.com/iyotee/HeadForge)
- Issues: [Report a bug](https://github.com/iyotee/HeadForge/issues)
- Documentation: [Wiki](https://github.com/iyotee/HeadForge/wiki)

---

**Full Changelog**: https://github.com/iyotee/HeadForge/compare/${latestTag}...HEAD`;

  // Create release
  execSync(`gh release create ${latestTag} --title "HeadForge ${latestTag}" --notes "${releaseNotes}"`, { 
    stdio: "inherit" 
  });
  
  console.log(`\n✅ Release ${latestTag} created successfully!`);
  console.log(`🔗 View release: https://github.com/iyotee/HeadForge/releases/tag/${latestTag}`);
  
} catch (error) {
  console.error("❌ Error creating release:", error.message);
  console.log("\n📋 Alternative: Create release manually on GitHub:");
  console.log("1. Go to: https://github.com/iyotee/HeadForge/releases");
  console.log("2. Click 'Create a new release'");
  console.log(`3. Choose tag: ${latestTag}`);
  console.log("4. Add release notes and create");
  process.exit(1);
}
