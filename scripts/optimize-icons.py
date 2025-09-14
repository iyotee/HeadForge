#!/usr/bin/env python3
"""
HeadForge Icon Optimizer
Optimizes and resizes icons for the extension
"""

import os
import sys
from PIL import Image
import argparse

def optimize_icon(input_path, output_path, size):
    """
    Optimize and resize an icon
    
    Args:
        input_path (str): Path to input icon
        output_path (str): Path to output icon
        size (tuple): Target size (width, height)
    """
    
    if not os.path.exists(input_path):
        print(f"Error: Input file not found at {input_path}")
        return False
    
    try:
        # Open the image
        img = Image.open(input_path)
        
        # Convert to RGBA if not already
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Resize with high quality
        img_resized = img.resize(size, Image.Resampling.LANCZOS)
        
        # Save as PNG
        img_resized.save(output_path, 'PNG', optimize=True)
        print(f"Optimized icon: {output_path} ({size[0]}x{size[1]})")
        
        return True
        
    except Exception as e:
        print(f"Error optimizing icon: {e}")
        return False

def create_all_icon_sizes(source_icon, output_dir):
    """
    Create all required icon sizes from a source icon
    
    Args:
        source_icon (str): Path to source icon
        output_dir (str): Output directory for icons
    """
    
    # Required icon sizes for Chrome extension
    icon_sizes = {
        'icon-16.png': (16, 16),
        'icon-32.png': (32, 32),
        'icon-48.png': (48, 48),
        'icon-128.png': (128, 128),
        'icon-256.png': (256, 256),
        'icon-512.png': (512, 512)
    }
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    success_count = 0
    
    for filename, size in icon_sizes.items():
        output_path = os.path.join(output_dir, filename)
        if optimize_icon(source_icon, output_path, size):
            success_count += 1
    
    print(f"\nSuccessfully created {success_count}/{len(icon_sizes)} icons")
    return success_count == len(icon_sizes)

def main():
    parser = argparse.ArgumentParser(description='Optimize icons for HeadForge extension')
    parser.add_argument('--source', default='src/assets/images/logo.png',
                       help='Source icon file (default: src/assets/images/logo.png)')
    parser.add_argument('--output-dir', default='src/assets/icons',
                       help='Output directory for icons (default: src/assets/icons)')
    parser.add_argument('--size', type=int, nargs=2, metavar=('WIDTH', 'HEIGHT'),
                       help='Create single icon with specific size')
    parser.add_argument('--output', help='Output file for single icon')
    
    args = parser.parse_args()
    
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # Make paths absolute
    source_path = os.path.join(project_root, args.source)
    output_dir = os.path.join(project_root, args.output_dir)
    
    if args.size and args.output:
        # Create single icon
        output_path = os.path.join(project_root, args.output)
        success = optimize_icon(source_path, output_path, tuple(args.size))
        sys.exit(0 if success else 1)
    else:
        # Create all icon sizes
        success = create_all_icon_sizes(source_path, output_dir)
        sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
