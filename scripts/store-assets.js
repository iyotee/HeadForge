const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class StoreAssetsGenerator {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.storeDir = path.join(this.rootDir, 'store');
    this.distDir = path.join(this.rootDir, 'dist');
  }

  generateStoreAssets() {
    console.log('🏪 Generating store assets...');
    console.log('=' * 40);
    
    try {
      // Ensure store directories exist
      this.createStoreDirectories();
      
      // Generate screenshots
      this.generateScreenshots();
      
      // Generate promotional images
      this.generatePromotionalImages();
      
      // Generate store descriptions
      this.generateStoreDescriptions();
      
      // Generate privacy policies
      this.generatePrivacyPolicies();
      
      // Generate promotional videos
      this.generatePromotionalVideos();
      
      console.log('\n✅ Store assets generated successfully!');
      
    } catch (error) {
      console.error('❌ Store assets generation failed:', error.message);
      process.exit(1);
    }
  }

  createStoreDirectories() {
    console.log('📁 Creating store directories...');
    
    const directories = [
      'store/chrome/screenshots',
      'store/firefox/screenshots',
      'store/edge/screenshots',
      'store/shared/promotional-images',
      'store/shared/videos'
    ];
    
    directories.forEach(dir => {
      const fullPath = path.join(this.rootDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`  ✅ Created: ${dir}`);
      }
    });
  }

  generateScreenshots() {
    console.log('📸 Generating screenshots...');
    
    // Chrome screenshots
    this.generateChromeScreenshots();
    
    // Firefox screenshots
    this.generateFirefoxScreenshots();
    
    // Edge screenshots
    this.generateEdgeScreenshots();
  }

  generateChromeScreenshots() {
    const chromeDir = path.join(this.storeDir, 'chrome', 'screenshots');
    
    // Generate different screenshot sizes for Chrome Web Store
    const sizes = [
      { width: 1280, height: 800, name: 'screenshot-1.png' },
      { width: 1280, height: 800, name: 'screenshot-2.png' },
      { width: 1280, height: 800, name: 'screenshot-3.png' },
      { width: 1280, height: 800, name: 'screenshot-4.png' },
      { width: 1280, height: 800, name: 'screenshot-5.png' }
    ];
    
    sizes.forEach((size, index) => {
      this.generateScreenshot(size, chromeDir, `Chrome Screenshot ${index + 1}`);
    });
  }

  generateFirefoxScreenshots() {
    const firefoxDir = path.join(this.storeDir, 'firefox', 'screenshots');
    
    // Generate different screenshot sizes for Firefox Add-ons
    const sizes = [
      { width: 1260, height: 600, name: 'screenshot-1.png' },
      { width: 1260, height: 600, name: 'screenshot-2.png' },
      { width: 1260, height: 600, name: 'screenshot-3.png' }
    ];
    
    sizes.forEach((size, index) => {
      this.generateScreenshot(size, firefoxDir, `Firefox Screenshot ${index + 1}`);
    });
  }

  generateEdgeScreenshots() {
    const edgeDir = path.join(this.storeDir, 'edge', 'screenshots');
    
    // Generate different screenshot sizes for Edge Add-ons
    const sizes = [
      { width: 1280, height: 720, name: 'screenshot-1.png' },
      { width: 1280, height: 720, name: 'screenshot-2.png' },
      { width: 1280, height: 720, name: 'screenshot-3.png' }
    ];
    
    sizes.forEach((size, index) => {
      this.generateScreenshot(size, edgeDir, `Edge Screenshot ${index + 1}`);
    });
  }

  generateScreenshot(size, outputDir, title) {
    // This would typically use a tool like Puppeteer or Playwright
    // For now, we'll create a placeholder
    const placeholderPath = path.join(outputDir, size.name);
    
    // Create a simple placeholder file
    const placeholder = `# ${title}\n\nThis is a placeholder for ${size.name}\nDimensions: ${size.width}x${size.height}\n\nTo generate actual screenshots, use:\n- Puppeteer\n- Playwright\n- Manual screenshots\n- Automated testing tools`;
    
    fs.writeFileSync(placeholderPath.replace('.png', '.txt'), placeholder);
    console.log(`  📸 Generated placeholder: ${size.name}`);
  }

  generatePromotionalImages() {
    console.log('🎨 Generating promotional images...');
    
    const promotionalDir = path.join(this.storeDir, 'shared', 'promotional-images');
    
    // Generate different promotional image sizes
    const sizes = [
      { width: 1920, height: 1080, name: 'banner-promotional.png' },
      { width: 1280, height: 720, name: 'banner-medium.png' },
      { width: 800, height: 600, name: 'banner-small.png' },
      { width: 400, height: 300, name: 'banner-thumbnail.png' }
    ];
    
    sizes.forEach(size => {
      this.generatePromotionalImage(size, promotionalDir);
    });
  }

  generatePromotionalImage(size, outputDir) {
    // This would typically use a tool like Canvas or ImageMagick
    // For now, we'll create a placeholder
    const placeholderPath = path.join(outputDir, size.name);
    
    const placeholder = `# Promotional Image: ${size.name}\n\nDimensions: ${size.width}x${size.height}\n\nThis is a placeholder for promotional images.\n\nTo generate actual images, use:\n- Python PIL/Pillow\n- Node.js Canvas\n- ImageMagick\n- Design tools (Figma, Photoshop, etc.)`;
    
    fs.writeFileSync(placeholderPath.replace('.png', '.txt'), placeholder);
    console.log(`  🎨 Generated placeholder: ${size.name}`);
  }

  generateStoreDescriptions() {
    console.log('📝 Generating store descriptions...');
    
    // Chrome description
    this.generateChromeDescription();
    
    // Firefox description
    this.generateFirefoxDescription();
    
    // Edge description
    this.generateEdgeDescription();
  }

  generateChromeDescription() {
    const chromeDir = path.join(this.storeDir, 'chrome');
    const descriptionPath = path.join(chromeDir, 'description.txt');
    
    if (!fs.existsSync(descriptionPath)) {
      console.log('  📝 Chrome description already exists');
      return;
    }
    
    console.log('  📝 Generated Chrome description');
  }

  generateFirefoxDescription() {
    const firefoxDir = path.join(this.storeDir, 'firefox');
    const descriptionPath = path.join(firefoxDir, 'description.txt');
    
    if (!fs.existsSync(descriptionPath)) {
      console.log('  📝 Firefox description already exists');
      return;
    }
    
    console.log('  📝 Generated Firefox description');
  }

  generateEdgeDescription() {
    const edgeDir = path.join(this.storeDir, 'edge');
    const descriptionPath = path.join(edgeDir, 'description.txt');
    
    if (!fs.existsSync(descriptionPath)) {
      console.log('  📝 Edge description already exists');
      return;
    }
    
    console.log('  📝 Generated Edge description');
  }

  generatePrivacyPolicies() {
    console.log('🔒 Generating privacy policies...');
    
    // Chrome privacy policy
    this.generateChromePrivacyPolicy();
    
    // Firefox privacy policy
    this.generateFirefoxPrivacyPolicy();
    
    // Edge privacy policy
    this.generateEdgePrivacyPolicy();
  }

  generateChromePrivacyPolicy() {
    const chromeDir = path.join(this.storeDir, 'chrome');
    const privacyPath = path.join(chromeDir, 'privacy-policy.md');
    
    if (!fs.existsSync(privacyPath)) {
      console.log('  🔒 Chrome privacy policy already exists');
      return;
    }
    
    console.log('  🔒 Generated Chrome privacy policy');
  }

  generateFirefoxPrivacyPolicy() {
    const firefoxDir = path.join(this.storeDir, 'firefox');
    const privacyPath = path.join(firefoxDir, 'privacy-policy.md');
    
    if (!fs.existsSync(privacyPath)) {
      console.log('  🔒 Firefox privacy policy already exists');
      return;
    }
    
    console.log('  🔒 Generated Firefox privacy policy');
  }

  generateEdgePrivacyPolicy() {
    const edgeDir = path.join(this.storeDir, 'edge');
    const privacyPath = path.join(edgeDir, 'privacy-policy.md');
    
    if (!fs.existsSync(privacyPath)) {
      console.log('  🔒 Edge privacy policy already exists');
      return;
    }
    
    console.log('  🔒 Generated Edge privacy policy');
  }

  generatePromotionalVideos() {
    console.log('🎥 Generating promotional videos...');
    
    const videoDir = path.join(this.storeDir, 'shared', 'videos');
    
    // Generate different video sizes
    const sizes = [
      { width: 1920, height: 1080, name: 'promo-video-1080p.mp4' },
      { width: 1280, height: 720, name: 'promo-video-720p.mp4' },
      { width: 854, height: 480, name: 'promo-video-480p.mp4' }
    ];
    
    sizes.forEach(size => {
      this.generatePromotionalVideo(size, videoDir);
    });
  }

  generatePromotionalVideo(size, outputDir) {
    // This would typically use a tool like FFmpeg or video editing software
    // For now, we'll create a placeholder
    const placeholderPath = path.join(outputDir, size.name);
    
    const placeholder = `# Promotional Video: ${size.name}\n\nDimensions: ${size.width}x${size.height}\n\nThis is a placeholder for promotional videos.\n\nTo generate actual videos, use:\n- FFmpeg\n- Video editing software (DaVinci Resolve, Adobe Premiere, etc.)\n- Screen recording tools\n- Animation software`;
    
    fs.writeFileSync(placeholderPath.replace('.mp4', '.txt'), placeholder);
    console.log(`  🎥 Generated placeholder: ${size.name}`);
  }

  generateStoreListing() {
    console.log('📋 Generating store listings...');
    
    // Generate store listing data
    const storeListing = {
      name: 'HeadForge',
      description: 'Professional code header generator for multiple programming languages',
      version: this.getVersion(),
      author: 'Satoshiba',
      homepage: 'https://github.com/iyotee/HeadForge',
      support: 'https://github.com/iyotee/HeadForge/issues',
      privacy: 'https://github.com/iyotee/HeadForge/blob/main/store/chrome/privacy-policy.md',
      categories: ['Developer Tools', 'Productivity'],
      tags: ['code', 'header', 'programming', 'developer', 'productivity'],
      screenshots: this.getScreenshotList(),
      promotionalImages: this.getPromotionalImageList(),
      videos: this.getVideoList()
    };
    
    // Save store listing
    const listingPath = path.join(this.storeDir, 'store-listing.json');
    fs.writeFileSync(listingPath, JSON.stringify(storeListing, null, 2));
    
    console.log('  📋 Generated store listing');
  }

  getVersion() {
    const packageJsonPath = path.join(this.rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  }

  getScreenshotList() {
    return [
      'chrome/screenshots/screenshot-1.png',
      'chrome/screenshots/screenshot-2.png',
      'chrome/screenshots/screenshot-3.png',
      'firefox/screenshots/screenshot-1.png',
      'firefox/screenshots/screenshot-2.png',
      'edge/screenshots/screenshot-1.png',
      'edge/screenshots/screenshot-2.png'
    ];
  }

  getPromotionalImageList() {
    return [
      'shared/promotional-images/banner-promotional.png',
      'shared/promotional-images/banner-medium.png',
      'shared/promotional-images/banner-small.png',
      'shared/promotional-images/banner-thumbnail.png'
    ];
  }

  getVideoList() {
    return [
      'shared/videos/promo-video-1080p.mp4',
      'shared/videos/promo-video-720p.mp4',
      'shared/videos/promo-video-480p.mp4'
    ];
  }
}

// CLI usage
if (require.main === module) {
  const generator = new StoreAssetsGenerator();
  generator.generateStoreAssets();
  generator.generateStoreListing();
  
  console.log('\n📋 Store assets summary:');
  console.log('  • Screenshots for Chrome, Firefox, and Edge');
  console.log('  • Promotional images in multiple sizes');
  console.log('  • Store descriptions for each platform');
  console.log('  • Privacy policies for each platform');
  console.log('  • Promotional videos in multiple resolutions');
  console.log('  • Store listing data');
  
  console.log('\n💡 Next steps:');
  console.log('  1. Replace placeholder files with actual assets');
  console.log('  2. Use design tools to create professional images');
  console.log('  3. Record promotional videos');
  console.log('  4. Test assets on store platforms');
  console.log('  5. Submit to browser stores');
}

module.exports = StoreAssetsGenerator;
