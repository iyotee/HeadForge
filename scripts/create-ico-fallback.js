const fs = require('fs');
const path = require('path');

/**
 * Fallback script to create basic ICO files when ImageMagick is not available
 * This creates simple ICO files by copying PNG data with ICO headers
 */

const SOURCE_DIR = path.join(__dirname, '..', 'src', 'assets', 'icons');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'icons');

function createBasicIcoHeader() {
  // Basic ICO file header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);  // Reserved (must be 0)
  header.writeUInt16LE(1, 2);  // Type (1 = ICO)
  header.writeUInt16LE(1, 4);  // Number of images
  
  return header;
}

function createIconDirectoryEntry(width, height, colorCount, reserved, planes, bitCount, size, offset) {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(width, 0);        // Width
  entry.writeUInt8(height, 1);       // Height
  entry.writeUInt8(colorCount, 2);   // Color count
  entry.writeUInt8(reserved, 3);     // Reserved
  entry.writeUInt16LE(planes, 4);    // Planes
  entry.writeUInt16LE(bitCount, 6);  // Bits per pixel
  entry.writeUInt32LE(size, 8);      // Size of image data
  entry.writeUInt32LE(offset, 12);   // Offset to image data
  
  return entry;
}

function createBasicIcoFromPng(pngPath, icoPath) {
  try {
    if (!fs.existsSync(pngPath)) {
      console.warn(`PNG file not found: ${pngPath}`);
      return false;
    }

    const pngData = fs.readFileSync(pngPath);
    
    // Create ICO file structure
    const header = createBasicIcoHeader();
    const directoryEntry = createIconDirectoryEntry(
      32, 32, 0, 0, 1, 32, pngData.length, 22
    );
    
    const icoData = Buffer.concat([header, directoryEntry, pngData]);
    
    fs.writeFileSync(icoPath, icoData);
    console.log(`Created basic ICO: ${path.basename(icoPath)}`);
    return true;
  } catch (error) {
    console.error(`Failed to create ICO from ${pngPath}:`, error.message);
    return false;
  }
}

function createFavicon() {
  const faviconPng = path.join(SOURCE_DIR, 'icon-32.png');
  const faviconIco = path.join(OUTPUT_DIR, 'favicon.ico');
  
  console.log('Creating favicon.ico...');
  return createBasicIcoFromPng(faviconPng, faviconIco);
}

function createAppIcon() {
  const appIconPng = path.join(SOURCE_DIR, 'icon-256.png');
  const appIconIco = path.join(OUTPUT_DIR, 'app-icon.ico');
  
  console.log('Creating app-icon.ico...');
  return createBasicIcoFromPng(appIconPng, appIconIco);
}

function createStoreIcons() {
  const storeIcons = [
    { name: 'chrome-store-icon', source: 'icon-128.png' },
    { name: 'firefox-store-icon', source: 'icon-128.png' },
    { name: 'edge-store-icon', source: 'icon-128.png' }
  ];

  let success = true;
  
  storeIcons.forEach(icon => {
    const sourcePng = path.join(SOURCE_DIR, icon.source);
    const targetIco = path.join(OUTPUT_DIR, `${icon.name}.ico`);
    
    console.log(`Creating ${icon.name}.ico...`);
    const result = createBasicIcoFromPng(sourcePng, targetIco);
    if (!result) success = false;
  });

  return success;
}

function main() {
  console.log('🎨 Creating basic ICO files (fallback method)...\n');
  
  let allSuccess = true;
  
  // Create favicon
  if (!createFavicon()) allSuccess = false;
  
  // Create app icon
  if (!createAppIcon()) allSuccess = false;
  
  // Create store icons
  if (!createStoreIcons()) allSuccess = false;
  
  if (allSuccess) {
    console.log('\n✅ Basic ICO files created successfully!');
    console.log('\nNote: These are basic ICO files. For better quality, install ImageMagick and run:');
    console.log('node scripts/convert-to-ico.js');
  } else {
    console.log('\n⚠️  Some ICO files could not be created.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  createBasicIcoFromPng,
  createFavicon,
  createAppIcon,
  createStoreIcons
};
