const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Build script for all browser stores (Chrome, Firefox, Edge)
 * Creates optimized packages for each store with proper manifests
 */

const STORES_DIR = path.join(__dirname, "..", "store");

// Store configurations
const STORE_CONFIGS = {
  chrome: {
    name: "Chrome Web Store",
    manifest: "manifest.json",
    sourceDir: path.join(STORES_DIR, "chrome"),
    outputDir: path.join(STORES_DIR, "chrome"),
    zipName: "headforge-chrome.zip",
  },
  firefox: {
    name: "Firefox Add-ons",
    manifest: "manifest-firefox.json",
    sourceDir: path.join(STORES_DIR, "firefox"),
    outputDir: path.join(STORES_DIR, "firefox"),
    zipName: "headforge-firefox.zip",
  },
  edge: {
    name: "Microsoft Edge Add-ons",
    manifest: "manifest-edge.json",
    sourceDir: path.join(STORES_DIR, "edge"),
    outputDir: path.join(STORES_DIR, "edge"),
    zipName: "headforge-edge.zip",
  },
};

function cleanDirectories() {
  console.log("🧹 Cleaning previous builds...");

  // Clean store directories
  for (const store of Object.keys(STORE_CONFIGS)) {
    const storeDir = path.join(STORES_DIR, store);
    if (fs.existsSync(storeDir)) {
      fs.rmSync(storeDir, { recursive: true, force: true });
    }
  }

  console.log("✅ Directories cleaned");
}

function buildWebpack() {
  console.log("🔨 Building with Webpack...");

  try {
    execSync("npm run build", { stdio: "inherit" });
    console.log("✅ Webpack build completed");
  } catch (error) {
    console.error("❌ Webpack build failed:", error.message);
    process.exit(1);
  }
}

function createStoreManifests() {
  console.log("📝 Creating store-specific manifests...");

  const baseManifest = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "src", "manifest.json"), "utf8")
  );

  // Chrome manifest (base)
  const chromeManifest = { ...baseManifest };
  fs.writeFileSync(
    path.join(STORES_DIR, "chrome", "manifest.json"),
    JSON.stringify(chromeManifest, null, 2)
  );

  // Firefox manifest (Manifest V2 compatible)
  const firefoxManifest = {
    ...baseManifest,
    manifest_version: 2,
    background: {
      scripts: ["background/background.js"],
      persistent: false,
    },
    content_scripts: baseManifest.content_scripts.map((script) => ({
      ...script,
      js: script.js.map((file) => file.replace(".ts", ".js")),
    })),
    browser_specific_settings: {
      gecko: {
        id: "headforge@satoshiba.dev",
        strict_min_version: "91.0",
      },
    },
  };

  // Remove Manifest V3 specific features
  delete firefoxManifest.host_permissions;
  delete firefoxManifest.web_accessible_resources;

  fs.writeFileSync(
    path.join(STORES_DIR, "firefox", "manifest.json"),
    JSON.stringify(firefoxManifest, null, 2)
  );

  // Edge manifest (similar to Chrome but with Edge-specific fields)
  const edgeManifest = {
    ...baseManifest,
    minimum_edge_version: "88.0.0.0",
  };

  fs.writeFileSync(
    path.join(STORES_DIR, "edge", "manifest.json"),
    JSON.stringify(edgeManifest, null, 2)
  );

  console.log("✅ Store manifests created");
}

function copyStoreFiles() {
  console.log("📦 Copying files for each store...");

  Object.entries(STORE_CONFIGS).forEach(([store, config]) => {
    const sourceDir = path.join(STORES_DIR, store);
    const targetDir = config.outputDir;

    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy all files from source to target
    copyDirectory(sourceDir, targetDir);

    console.log(`✅ ${config.name} files copied`);
  });
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createStorePackages() {
  console.log("📦 Creating store packages...");

  Object.entries(STORE_CONFIGS).forEach(([store, config]) => {
    try {
      const zipPath = path.join(STORES_DIR, config.zipName);

      // Remove existing zip
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
      }

      // Create zip file
      execSync(
        `cd "${config.outputDir}" && powershell Compress-Archive -Path * -DestinationPath "${zipPath}"`,
        { stdio: "inherit" }
      );

      console.log(`✅ ${config.name} package created: ${config.zipName}`);
    } catch (error) {
      console.error(
        `❌ Failed to create package for ${config.name}:`,
        error.message
      );
    }
  });
}

function createStoreDescriptions() {
  console.log("📝 Creating store descriptions...");

  const descriptions = {
    chrome: {
      short:
        "Generate professional code headers for multiple programming languages",
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

Open source and free to use!`,
    },
    firefox: {
      short:
        "Generate professional code headers for multiple programming languages",
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

Open source and free to use!`,
    },
    edge: {
      short:
        "Generate professional code headers for multiple programming languages",
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

Open source and free to use!`,
    },
  };

  Object.entries(descriptions).forEach(([store, desc]) => {
    const config = STORE_CONFIGS[store];
    const descPath = path.join(config.outputDir, "description.txt");

    fs.writeFileSync(descPath, desc.long);
    console.log(`✅ ${config.name} description created`);
  });
}

function generateBuildInfo() {
  console.log("📊 Generating build information...");

  const buildInfo = {
    timestamp: new Date().toISOString(),
    version: JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
    ).version,
    stores: Object.keys(STORE_CONFIGS),
    files: {},
  };

  // Count files in each store directory
  Object.entries(STORE_CONFIGS).forEach(([store, config]) => {
    const files = countFiles(config.outputDir);
    buildInfo.files[store] = files;
  });

  const buildInfoPath = path.join(STORES_DIR, "build-info.json");
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

  console.log("✅ Build information generated");
}

function countFiles(dir) {
  let count = 0;

  if (!fs.existsSync(dir)) return count;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }

  return count;
}

function main() {
  console.log("🚀 Starting HeadForge store builds...\n");

  try {
    cleanDirectories();
    buildWebpack();
    createStoreManifests();
    copyStoreFiles();
    createStoreDescriptions();
    createStorePackages();
    generateBuildInfo();

    console.log("\n🎉 All store builds completed successfully!");
    console.log("\n📦 Packages created:");
    Object.values(STORE_CONFIGS).forEach((config) => {
      console.log(`  • ${config.name}: ${config.zipName}`);
    });

    console.log("\n📁 Store directories:");
    Object.values(STORE_CONFIGS).forEach((config) => {
      console.log(`  • ${config.name}: ${config.outputDir}`);
    });
  } catch (error) {
    console.error("\n❌ Build failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  cleanDirectories,
  buildWebpack,
  createStoreManifests,
  copyStoreFiles,
  createStorePackages,
  createStoreDescriptions,
  generateBuildInfo,
};
