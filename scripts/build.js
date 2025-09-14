const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

class HeadForgeBuilder {
  constructor() {
    this.rootDir = path.join(__dirname, "..");
    this.distDir = path.join(this.rootDir, "store");
    this.configDir = path.join(this.rootDir, "config");
  }

  async build() {
    console.log("🚀 Starting HeadForge build process...");
    console.log("=".repeat(50));

    try {
      // Clean previous builds
      await this.clean();

      // Build for all browsers
      await this.buildForBrowsers();

      // Validate builds
      await this.validateBuilds();

      // Generate assets
      await this.generateAssets();

      console.log("\n✅ Build completed successfully!");
      console.log(`📦 Output directory: ${this.distDir}`);
    } catch (error) {
      console.error("❌ Build failed:", error.message);
      process.exit(1);
    }
  }

  async clean() {
    console.log("🧹 Cleaning previous builds...");

    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true, force: true });
    }

    // Create dist directory structure
    fs.mkdirSync(this.distDir, { recursive: true });
    fs.mkdirSync(path.join(this.distDir, "chrome"), { recursive: true });
    fs.mkdirSync(path.join(this.distDir, "firefox"), { recursive: true });
    fs.mkdirSync(path.join(this.distDir, "edge"), { recursive: true });
    fs.mkdirSync(path.join(this.distDir, "universal"), { recursive: true });
  }

  async buildForBrowsers() {
    const browsers = ["chrome", "firefox", "edge"];

    for (const browser of browsers) {
      console.log(`\n🔨 Building for ${browser}...`);

        try {
          // Load webpack config
          const configPath = path.join(this.configDir, "webpack.prod.js");
          const config = require(configPath);

          // Set browser-specific environment
          process.env.BROWSER = browser;

          // Modify config to output to browser-specific directory
          config.output.path = path.join(this.distDir, browser);

          // Run webpack build
          await this.runWebpack(config, browser);

        console.log(`✅ ${browser} build completed`);
      } catch (error) {
        console.error(`❌ ${browser} build failed:`, error.message);
        throw error;
      }
    }
  }

  async runWebpack(config, browser) {
    return new Promise((resolve, reject) => {
      const compiler = webpack(config);

      compiler.run((err, stats) => {
        if (err) {
          reject(err);
          return;
        }

        if (stats.hasErrors()) {
          console.error("Webpack errors:", stats.toJson().errors);
          reject(new Error("Webpack build failed"));
          return;
        }

        if (stats.hasWarnings()) {
          console.warn("Webpack warnings:", stats.toJson().warnings);
        }

        // Copy browser-specific files (manifest, assets, icons)
        this.copyBrowserFiles(browser);

        resolve();
      });
    });
  }

  copyBrowserFiles(browser) {
    const srcDir = path.join(this.rootDir, "src");
    const browserDistDir = path.join(this.distDir, browser);

    // Ensure browser dist directory exists
    fs.mkdirSync(browserDistDir, { recursive: true });

    // Copy manifest
    const manifestSrc = path.join(srcDir, "manifest.json");
    const manifestDest = path.join(browserDistDir, "manifest.json");
    fs.copyFileSync(manifestSrc, manifestDest);

    // Copy assets
    const assetsSrc = path.join(srcDir, "assets");
    const assetsDest = path.join(browserDistDir, "assets");
    if (fs.existsSync(assetsSrc)) {
      this.copyDirectory(assetsSrc, assetsDest);
    }

    // Copy icons
    const iconsSrc = path.join(srcDir, "assets", "icons");
    const iconsDest = path.join(browserDistDir, "icons");
    if (fs.existsSync(iconsSrc)) {
      this.copyDirectory(iconsSrc, iconsDest);
    }

    // Webpack now generates directly in store/, so no need to copy from dist/
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  async validateBuilds() {
    console.log("\n🔍 Validating builds...");

    const browsers = ["chrome", "firefox", "edge"];

    for (const browser of browsers) {
      const browserDistDir = path.join(this.distDir, browser);

      // Check if required files exist
      const requiredFiles = [
        "manifest.json",
        "popup/popup.html",
        "popup/popup.js",
        "background/background.js",
        "options/options.html",
        "options/options.js",
      ];

      for (const file of requiredFiles) {
        const filePath = path.join(browserDistDir, file);
        if (!fs.existsSync(filePath)) {
          throw new Error(`Missing required file: ${browser}/${file}`);
        }
      }

      // Validate manifest
      const manifestPath = path.join(browserDistDir, "manifest.json");
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

      if (!manifest.name || !manifest.version || !manifest.manifest_version) {
        throw new Error(`Invalid manifest: ${browser}/manifest.json`);
      }

      console.log(`✅ ${browser} build validated`);
    }
  }

  async generateAssets() {
    console.log("\n🎨 Generating assets...");

    try {
      // Run Python asset generator
      const pythonScript = path.join(__dirname, "generate-assets.py");
      if (fs.existsSync(pythonScript)) {
        execSync(`python "${pythonScript}"`, { stdio: "inherit" });
      }

      console.log("✅ Assets generated");
    } catch (error) {
      console.warn("⚠️  Asset generation failed:", error.message);
      console.log("Continuing without custom assets...");
    }
  }

  async buildUniversal() {
    console.log("\n🌐 Building universal package...");

    const universalDir = path.join(this.distDir, "universal");

    // Copy Chrome build as base
    const chromeDir = path.join(this.distDir, "chrome");
    this.copyDirectory(chromeDir, universalDir);

    // Modify manifest for universal compatibility
    const manifestPath = path.join(universalDir, "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    // Remove browser-specific features
    delete manifest.minimum_chrome_version;
    delete manifest.minimum_edge_version;

    // Add universal compatibility notes
    manifest.description += " (Universal Build)";

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log("✅ Universal build completed");
  }

  async buildProduction() {
    console.log("🏭 Building production version...");

    // Set production environment
    process.env.NODE_ENV = "production";

    // Build for all browsers
    await this.build();

    // Build universal package
    await this.buildUniversal();

    // Run tests
    await this.runTests();

    console.log("\n🎉 Production build completed!");
  }

  async runTests() {
    console.log("\n🧪 Running tests...");

    try {
      execSync("npm test", { stdio: "inherit" });
      console.log("✅ Tests passed");
    } catch (error) {
      console.error("❌ Tests failed:", error.message);
      throw error;
    }
  }

  async buildDevelopment() {
    console.log("🔧 Building development version...");

    // Set development environment
    process.env.NODE_ENV = "development";

    // Clean and build
    await this.clean();

    // Build only for Chrome in development
    const configPath = path.join(this.configDir, "webpack.dev.js");
    const config = require(configPath);

    process.env.BROWSER = "chrome";
    await this.runWebpack(config, "chrome");

    console.log("✅ Development build completed");
  }
}

// CLI usage
if (require.main === module) {
  const builder = new HeadForgeBuilder();
  const command = process.argv[2];

  switch (command) {
    case "dev":
      builder.buildDevelopment();
      break;
    case "prod":
      builder.buildProduction();
      break;
    case "universal":
      builder.buildUniversal();
      break;
    default:
      builder.build();
  }
}

module.exports = HeadForgeBuilder;
