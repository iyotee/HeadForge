# HeadForge Scripts

This directory contains Python scripts for building and managing HeadForge assets.

## Scripts

### 🚀 `build-assets.py`
Main build script that generates all assets for the extension.

```bash
python scripts/build-assets.py
```

**What it does:**
- Generates all banner variants (light, dark, transparent)
- Optimizes all icon sizes
- Provides build status and file locations

### 📸 `generate-banner.py`
Generates banner images from the logo for the extension header.

```bash
# Generate all variants
python scripts/generate-banner.py --all

# Generate specific theme
python scripts/generate-banner.py --theme light
python scripts/generate-banner.py --theme dark
python scripts/generate-banner.py --theme transparent

# Custom dimensions
python scripts/generate-banner.py --width 500 --height 100
```

**Options:**
- `--logo`: Path to logo image (default: `src/assets/images/banner.png`)
- `--output`: Output path for banner (default: `src/assets/images/banner.png`)
- `--width`: Banner width in pixels (default: 600)
- `--height`: Banner height in pixels (default: 100)
- `--theme`: Banner theme - light, dark, or transparent (default: transparent)
- `--all`: Generate all theme variants

### 🎨 `optimize-icons.py`
Optimizes and resizes icons for the extension.

```bash
# Generate all icon sizes
python scripts/optimize-icons.py

# Generate specific size
python scripts/optimize-icons.py --size 32 32 --output src/assets/icons/icon-32.png
```

**Options:**
- `--source`: Source icon file (default: `src/assets/images/banner.png`)
- `--output-dir`: Output directory for icons (default: `src/assets/icons`)
- `--size`: Create single icon with specific size (width height)
- `--output`: Output file for single icon

## Generated Assets

### Banners
- `banner.png` - Transparent banner (works for all themes)

### Icons
- `icon-16.png` - 16x16 icon
- `icon-32.png` - 32x32 icon
- `icon-48.png` - 48x48 icon
- `icon-128.png` - 128x128 icon
- `icon-256.png` - 256x256 icon
- `icon-512.png` - 512x512 icon

## Requirements

- Python 3.7+
- Pillow (PIL) library

Install requirements:
```bash
pip install Pillow
```

## Usage in Extension

The generated assets are automatically used by the extension:

- **Banners**: Used in the popup header with transparent background
- **Icons**: Used in the browser extension manifest and favicon
- **Favicon**: Added to options page for better user experience

## Development Workflow

1. Update the source logo (`src/assets/images/logo.png`)
2. Run `python scripts/build-assets.py` to regenerate all assets
3. Test the extension with new assets
4. Commit changes to version control
