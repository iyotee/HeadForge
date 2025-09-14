#!/usr/bin/env python3
"""
HeadForge Banner Generator
Creates a banner image from the logo for the extension header
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont
import argparse

def create_banner(logo_path, output_path, width=600, height=100, background_color=(255, 255, 255, 0)):
    """
    Create a banner image from the logo
    
    Args:
        logo_path (str): Path to the logo image
        output_path (str): Path where to save the banner
        width (int): Banner width in pixels
        height (int): Banner height in pixels
        background_color (tuple): Background color (R, G, B, A)
    """
    
    # Check if logo exists
    if not os.path.exists(logo_path):
        print(f"Error: Logo file not found at {logo_path}")
        return False
    
    try:
        # Open the logo
        logo = Image.open(logo_path)
        
        # Convert to RGBA if not already
        if logo.mode != 'RGBA':
            logo = logo.convert('RGBA')
        
        # Calculate logo size (keep aspect ratio, fit within banner)
        logo_max_width = width - 60  # 30px margin on each side
        logo_max_height = height - 20  # 10px margin on top and bottom
        
        # Calculate scaling factor
        scale_w = logo_max_width / logo.width
        scale_h = logo_max_height / logo.height
        scale = min(scale_w, scale_h)
        
        # Resize logo
        new_width = int(logo.width * scale)
        new_height = int(logo.height * scale)
        logo = logo.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Create banner canvas
        banner = Image.new('RGBA', (width, height), background_color)
        
        # Calculate logo position (centered)
        logo_x = (width - new_width) // 2
        logo_y = (height - new_height) // 2
        
        # Paste logo onto banner
        banner.paste(logo, (logo_x, logo_y), logo)
        
        # Save the banner
        banner.save(output_path, 'PNG')
        print(f"Banner created successfully: {output_path}")
        print(f"Banner dimensions: {width}x{height}")
        print(f"Logo dimensions: {new_width}x{new_height}")
        
        return True
        
    except Exception as e:
        print(f"Error creating banner: {e}")
        return False

def create_dark_banner(logo_path, output_path, width=600, height=100):
    """
    Create a dark theme banner (transparent background)
    """
    return create_banner(logo_path, output_path, width, height, (255, 255, 255, 0))

def create_light_banner(logo_path, output_path, width=600, height=100):
    """
    Create a light theme banner (transparent background)
    """
    return create_banner(logo_path, output_path, width, height, (255, 255, 255, 0))

def create_transparent_banner(logo_path, output_path, width=600, height=100):
    """
    Create a transparent banner
    """
    return create_banner(logo_path, output_path, width, height, (255, 255, 255, 0))

def main():
    parser = argparse.ArgumentParser(description='Generate banner from logo for HeadForge extension')
    parser.add_argument('--logo', default='src/assets/images/banner.png', 
                       help='Path to logo image (default: src/assets/images/banner.png)')
    parser.add_argument('--output', default='src/assets/images/banner.png',
                       help='Output path for banner (default: src/assets/images/banner.png)')
    parser.add_argument('--width', type=int, default=600,
                       help='Banner width in pixels (default: 600)')
    parser.add_argument('--height', type=int, default=100,
                       help='Banner height in pixels (default: 100)')
    parser.add_argument('--theme', choices=['light', 'dark', 'transparent'], default='transparent',
                       help='Banner theme (default: transparent)')
    parser.add_argument('--all', action='store_true',
                       help='Generate all theme variants')
    
    args = parser.parse_args()
    
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # Make paths absolute
    logo_path = os.path.join(project_root, args.logo)
    output_path = os.path.join(project_root, args.output)
    
    if args.all:
        # Generate all variants
        base_name = os.path.splitext(output_path)[0]
        extensions = ['_light.png', '_dark.png', '_transparent.png']
        themes = ['light', 'dark', 'transparent']
        
        for theme, ext in zip(themes, extensions):
            theme_output = base_name + ext
            print(f"\nGenerating {theme} banner...")
            
            if theme == 'light':
                create_light_banner(logo_path, theme_output, args.width, args.height)
            elif theme == 'dark':
                create_dark_banner(logo_path, theme_output, args.width, args.height)
            else:  # transparent
                create_transparent_banner(logo_path, theme_output, args.width, args.height)
    else:
        # Generate single banner
        print(f"Generating {args.theme} banner...")
        
        if args.theme == 'light':
            create_light_banner(logo_path, output_path, args.width, args.height)
        elif args.theme == 'dark':
            create_dark_banner(logo_path, output_path, args.width, args.height)
        else:  # transparent
            create_transparent_banner(logo_path, output_path, args.width, args.height)

if __name__ == '__main__':
    main()
