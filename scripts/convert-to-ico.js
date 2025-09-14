const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Convert PNG icons to ICO format for Windows compatibility
 * This script uses ImageMagick or similar tools to convert PNG to ICO
 */

const ICON_SIZES = [16, 32, 48, 64, 128, 256];
const SOURCE_DIR = path.join(__dirname, '..', 'src', 'assets', 'icons');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'icons');

function checkImageMagick() {
  try {
    execSync('magick -version', { stdio: 'ignore' });
    return 'magick';
  } catch (error) {
    try {
      execSync('convert -version', { stdio: 'ignore' });
      return 'convert';
    } catch (error) {
      return null;
    }
  }
}

function convertPngToIco(pngPath, icoPath, sizes = [16, 32, 48, 64, 128, 256]) {
  const tool = checkImageMagick();
  
  if (!tool) {
    console.warn('ImageMagick not found. Please install ImageMagick to convert PNG to ICO.');
    console.warn('On Windows: choco install imagemagick');
    console.warn('On macOS: brew install imagemagick');
    console.warn('On Ubuntu: sudo apt-get install imagemagick');
    return false;
  }

  try {
    // Create ICO with multiple sizes
    const sizeArgs = sizes.map(size => `-resize ${size}x${size}`).join(' ');
    const command = `${tool} "${pngPath}" ${sizeArgs} "${icoPath}"`;
    
    console.log(`Converting ${path.basename(pngPath)} to ${path.basename(icoPath)}...`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to convert ${pngPath}:`, error.message);
    return false;
  }
}

function createFavicon() {
  const faviconPng = path.join(SOURCE_DIR, 'icon-32.png');
  const faviconIco = path.join(OUTPUT_DIR, 'favicon.ico');
  
  if (fs.existsSync(faviconPng)) {
    console.log('Creating favicon.ico...');
    return convertPngToIco(faviconPng, faviconIco, [16, 32, 48]);
  } else {
    console.warn('icon-32.png not found, cannot create favicon.ico');
    return false;
  }
}

function createAppIcon() {
  const appIconPng = path.join(SOURCE_DIR, 'icon-256.png');
  const appIconIco = path.join(OUTPUT_DIR, 'app-icon.ico');
  
  if (fs.existsSync(appIconPng)) {
    console.log('Creating app-icon.ico...');
    return convertPngToIco(appIconPng, appIconIco, [16, 32, 48, 64, 128, 256]);
  } else {
    console.warn('icon-256.png not found, cannot create app-icon.ico');
    return false;
  }
}

function createStoreIcons() {
  const storeIcons = [
    { name: 'chrome-store-icon', size: 128 },
    { name: 'firefox-store-icon', size: 128 },
    { name: 'edge-store-icon', size: 128 }
  ];

  let success = true;
  
  storeIcons.forEach(icon => {
    const sourcePng = path.join(SOURCE_DIR, `icon-${icon.size}.png`);
    const targetIco = path.join(OUTPUT_DIR, `${icon.name}.ico`);
    
    if (fs.existsSync(sourcePng)) {
      console.log(`Creating ${icon.name}.ico...`);
      const result = convertPngToIco(sourcePng, targetIco, [16, 32, 48, 64, 128, 256]);
      if (!result) success = false;
    } else {
      console.warn(`${sourcePng} not found, cannot create ${icon.name}.ico`);
      success = false;
    }
  });

  return success;
}

function main() {
  console.log('🎨 Converting PNG icons to ICO format...\n');
  
  let allSuccess = true;
  
  // Create favicon
  if (!createFavicon()) allSuccess = false;
  
  // Create app icon
  if (!createAppIcon()) allSuccess = false;
  
  // Create store icons
  if (!createStoreIcons()) allSuccess = false;
  
  if (allSuccess) {
    console.log('\n✅ All icons converted successfully!');
    console.log('\nGenerated files:');
    console.log('- favicon.ico (for web)');
    console.log('- app-icon.ico (for Windows)');
    console.log('- chrome-store-icon.ico');
    console.log('- firefox-store-icon.ico');
    console.log('- edge-store-icon.ico');
  } else {
    console.log('\n⚠️  Some conversions failed. Please check the errors above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  convertPngToIco,
  createFavicon,
  createAppIcon,
  createStoreIcons
};
