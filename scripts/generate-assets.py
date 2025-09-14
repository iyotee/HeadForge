#!/usr/bin/env python3
"""
HeadForge Asset Generator
Generates icons, banners, and promotional images from the main logo
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import argparse
from pathlib import Path

class HeadForgeAssetGenerator:
    def __init__(self, logo_path="src/assets/images/logo.png"):
        self.logo_path = logo_path
        self.output_dir = Path("src/assets")
        self.store_dir = Path("store")
        
        # Ensure output directories exist
        self.output_dir.mkdir(parents=True, exist_ok=True)
        (self.output_dir / "icons").mkdir(exist_ok=True)
        (self.output_dir / "images").mkdir(exist_ok=True)
        (self.store_dir / "shared" / "promotional-images").mkdir(parents=True, exist_ok=True)
        
        # Icon sizes for browser extensions
        self.icon_sizes = [16, 32, 48, 64, 96, 128, 256, 512]
        
        # Banner sizes for store listings
        self.banner_sizes = {
            "chrome": (1280, 800),
            "firefox": (1260, 600),
            "edge": (1280, 720),
            "promotional": (1920, 1080)
        }
        
        # BEAUTIFUL Color scheme - No more ugly colors!
        self.colors = {
            "primary": "#667eea",
            "secondary": "#764ba2",
            "accent": "#f093fb",
            "success": "#22c55e",
            "warning": "#f59e0b",
            "error": "#ef4444",
            "info": "#06b6d4",
            "light": "#f8fafc",
            "dark": "#1e293b",
            "white": "#ffffff",
            "black": "#0f172a",
            "gradient_start": "#667eea",
            "gradient_mid": "#764ba2",
            "gradient_end": "#f093fb"
        }
    
    def load_logo(self):
        """Load the main logo image"""
        try:
            logo = Image.open(self.logo_path)
            return logo.convert("RGBA")
        except FileNotFoundError:
            print(f"Logo not found at {self.logo_path}")
            print("Creating a placeholder logo...")
            return self.create_placeholder_logo()
    
    def create_placeholder_logo(self):
        """Create a placeholder logo if the main logo doesn't exist"""
        size = 512
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw a simple "H" logo
        margin = size // 8
        draw.rectangle([margin, margin, size - margin, size - margin], 
                      fill=self.colors["primary"], outline=self.colors["white"], width=4)
        
        # Add "H" text
        try:
            font = ImageFont.truetype("arial.ttf", size // 3)
        except:
            font = ImageFont.load_default()
        
        text = "H"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (size - text_width) // 2
        y = (size - text_height) // 2
        
        draw.text((x, y), text, fill=self.colors["white"], font=font)
        
        return img
    
    def generate_icons(self):
        """Generate all required icon sizes"""
        print("Generating icons...")
        logo = self.load_logo()
        
        for size in self.icon_sizes:
            # Resize logo maintaining aspect ratio
            resized = logo.resize((size, size), Image.Resampling.LANCZOS)
            
            # Save as PNG
            icon_path = self.output_dir / "icons" / f"icon-{size}.png"
            resized.save(icon_path, "PNG", optimize=True)
            print(f"Generated {icon_path}")
            
            # Also create a square version with background for better visibility
            if size <= 48:
                square_img = Image.new("RGBA", (size, size), self.colors["primary"])
                square_img.paste(resized, (0, 0), resized)
                square_path = self.output_dir / "icons" / f"icon-{size}-square.png"
                square_img.save(square_path, "PNG", optimize=True)
                print(f"Generated {square_path}")
    
    def generate_svg_icon(self):
        """Generate SVG icon based on the real logo"""
        try:
            # Load the real logo
            logo = Image.open(self.logo_path)
            logo = logo.convert("RGBA")
            
            # Resize to 128x128 for SVG
            logo_resized = logo.resize((128, 128), Image.Resampling.LANCZOS)
            
            # Convert to base64 for embedding in SVG
            import base64
            from io import BytesIO
            
            buffer = BytesIO()
            logo_resized.save(buffer, format="PNG")
            logo_base64 = base64.b64encode(buffer.getvalue()).decode()
            
            svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{self.colors['primary']};stop-opacity:1" />
      <stop offset="50%" style="stop-color:{self.colors['secondary']};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{self.colors['accent']};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with gradient -->
  <rect width="128" height="128" rx="20" fill="url(#gradient)"/>
  
  <!-- Real logo embedded -->
  <image x="0" y="0" width="128" height="128" href="data:image/png;base64,{logo_base64}"/>
</svg>'''
            
        except Exception as e:
            print(f"Error loading real logo: {e}")
            print("Creating a beautiful placeholder SVG...")
            
            svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{self.colors['primary']};stop-opacity:1" />
      <stop offset="50%" style="stop-color:{self.colors['secondary']};stop-opacity:1" />
      <stop offset="100%" style="stop-color:{self.colors['accent']};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with gradient -->
  <rect width="128" height="128" rx="20" fill="url(#gradient)"/>
  
  <!-- HeadForge Logo -->
  <text x="64" y="45" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="#ffffff">Head</text>
  <text x="64" y="75" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="#ffffff">Forge</text>
  
  <!-- Decorative elements -->
  <circle cx="32" cy="32" r="3" fill="#ffffff" opacity="0.6"/>
  <circle cx="96" cy="32" r="3" fill="#ffffff" opacity="0.6"/>
  <circle cx="32" cy="96" r="3" fill="#ffffff" opacity="0.6"/>
  <circle cx="96" cy="96" r="3" fill="#ffffff" opacity="0.6"/>
</svg>'''
        
        svg_path = self.output_dir / "icons" / "icon.svg"
        with open(svg_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        print(f"Generated {svg_path}")
    
    def generate_banners(self):
        """Generate banners for different store platforms"""
        print("Generating banners...")
        logo = self.load_logo()
        
        for platform, (width, height) in self.banner_sizes.items():
            banner = self.create_banner(logo, width, height, platform)
            
            if platform == "promotional":
                banner_path = self.store_dir / "shared" / "promotional-images" / f"banner-{platform}.png"
            else:
                banner_path = self.store_dir / platform / f"banner-{platform}.png"
                banner_path.parent.mkdir(parents=True, exist_ok=True)
            
            banner.save(banner_path, "PNG", optimize=True)
            print(f"Generated {banner_path}")
    
    def create_banner(self, logo, width, height, platform):
        """Create a banner for a specific platform"""
        banner = Image.new("RGB", (width, height), self.colors["light"])
        draw = ImageDraw.Draw(banner)
        
        # Create gradient background
        self.create_gradient_background(banner, width, height)
        
        # Resize logo for banner
        logo_size = min(width, height) // 4
        logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Position logo
        logo_x = (width - logo_size) // 2
        logo_y = (height - logo_size) // 2 - 20
        
        # Create logo background circle
        circle_margin = 20
        circle_size = logo_size + circle_margin
        circle_x = logo_x - circle_margin // 2
        circle_y = logo_y - circle_margin // 2
        
        draw.ellipse([circle_x, circle_y, circle_x + circle_size, circle_y + circle_size],
                    fill=self.colors["white"], outline=self.colors["primary"], width=3)
        
        # Paste logo
        banner.paste(logo_resized, (logo_x, logo_y), logo_resized)
        
        # Add text
        self.add_banner_text(draw, width, height, platform)
        
        # Add decorative elements
        self.add_decorative_elements(draw, width, height)
        
        return banner
    
    def create_gradient_background(self, img, width, height):
        """Create a BEAUTIFUL gradient background"""
        for y in range(height):
            ratio = y / height
            # Create a beautiful multi-color gradient
            if ratio < 0.33:
                # First third: primary to secondary
                local_ratio = ratio / 0.33
                r = int(self.colors["gradient_start"][1:3], 16) * (1 - local_ratio) + int(self.colors["gradient_mid"][1:3], 16) * local_ratio
                g = int(self.colors["gradient_start"][3:5], 16) * (1 - local_ratio) + int(self.colors["gradient_mid"][3:5], 16) * local_ratio
                b = int(self.colors["gradient_start"][5:7], 16) * (1 - local_ratio) + int(self.colors["gradient_mid"][5:7], 16) * local_ratio
            elif ratio < 0.66:
                # Second third: secondary to accent
                local_ratio = (ratio - 0.33) / 0.33
                r = int(self.colors["gradient_mid"][1:3], 16) * (1 - local_ratio) + int(self.colors["gradient_end"][1:3], 16) * local_ratio
                g = int(self.colors["gradient_mid"][3:5], 16) * (1 - local_ratio) + int(self.colors["gradient_end"][3:5], 16) * local_ratio
                b = int(self.colors["gradient_mid"][5:7], 16) * (1 - local_ratio) + int(self.colors["gradient_end"][5:7], 16) * local_ratio
            else:
                # Last third: accent to primary (circular)
                local_ratio = (ratio - 0.66) / 0.34
                r = int(self.colors["gradient_end"][1:3], 16) * (1 - local_ratio) + int(self.colors["gradient_start"][1:3], 16) * local_ratio
                g = int(self.colors["gradient_end"][3:5], 16) * (1 - local_ratio) + int(self.colors["gradient_start"][3:5], 16) * local_ratio
                b = int(self.colors["gradient_end"][5:7], 16) * (1 - local_ratio) + int(self.colors["gradient_start"][5:7], 16) * local_ratio
            
            color = (int(r), int(g), int(b))
            for x in range(width):
                img.putpixel((x, y), color)
    
    def add_banner_text(self, draw, width, height, platform):
        """Add text to banner"""
        try:
            title_font = ImageFont.truetype("arial.ttf", 48)
            subtitle_font = ImageFont.truetype("arial.ttf", 24)
        except:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
        
        # Title
        title = "HeadForge"
        title_bbox = draw.textbbox((0, 0), title, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        title_x = (width - title_width) // 2
        title_y = height // 2 + 60
        
        # Add text shadow
        draw.text((title_x + 2, title_y + 2), title, fill=self.colors["black"], font=title_font)
        draw.text((title_x, title_y), title, fill=self.colors["white"], font=title_font)
        
        # Subtitle
        subtitle = "Professional Code Header Generator"
        subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
        subtitle_x = (width - subtitle_width) // 2
        subtitle_y = title_y + 60
        
        draw.text((subtitle_x + 1, subtitle_y + 1), subtitle, fill=self.colors["black"], font=subtitle_font)
        draw.text((subtitle_x, subtitle_y), subtitle, fill=self.colors["white"], font=subtitle_font)
    
    def add_decorative_elements(self, draw, width, height):
        """Add decorative elements to banner"""
        # Add some geometric shapes
        for i in range(5):
            x = (width // 6) * (i + 1)
            y = height // 8
            size = 8
            draw.ellipse([x - size, y - size, x + size, y + size], 
                        fill=self.colors["white"], outline=self.colors["primary"], width=2)
        
        for i in range(5):
            x = (width // 6) * (i + 1)
            y = height - height // 8
            size = 8
            draw.ellipse([x - size, y - size, x + size, y + size], 
                        fill=self.colors["white"], outline=self.colors["primary"], width=2)
    
    def generate_screenshots(self):
        """Generate mockup screenshots for store listings"""
        print("Generating screenshots...")
        
        # Create popup screenshot
        popup_screenshot = self.create_popup_screenshot()
        popup_path = self.store_dir / "shared" / "promotional-images" / "popup-screenshot.png"
        popup_screenshot.save(popup_path, "PNG", optimize=True)
        print(f"Generated {popup_path}")
        
        # Create options screenshot
        options_screenshot = self.create_options_screenshot()
        options_path = self.store_dir / "shared" / "promotional-images" / "options-screenshot.png"
        options_screenshot.save(options_path, "PNG", optimize=True)
        print(f"Generated {options_path}")
    
    def create_popup_screenshot(self):
        """Create a mockup of the popup interface"""
        width, height = 400, 600
        img = Image.new("RGB", (width, height), self.colors["light"])
        draw = ImageDraw.Draw(img)
        
        # Header
        header_height = 60
        draw.rectangle([0, 0, width, header_height], fill=self.colors["primary"])
        
        # Logo
        logo_size = 32
        logo_x = 20
        logo_y = (header_height - logo_size) // 2
        draw.ellipse([logo_x, logo_y, logo_x + logo_size, logo_y + logo_size], 
                    fill=self.colors["white"])
        
        # Title
        try:
            font = ImageFont.truetype("arial.ttf", 20)
        except:
            font = ImageFont.load_default()
        
        draw.text((logo_x + logo_size + 10, logo_y + 5), "HeadForge", 
                 fill=self.colors["white"], font=font)
        
        # Form fields
        y_offset = header_height + 20
        field_height = 40
        field_spacing = 10
        
        fields = ["File Name", "Project", "Author", "Version", "Language"]
        for field in fields:
            # Field background
            draw.rectangle([20, y_offset, width - 20, y_offset + field_height], 
                          fill=self.colors["white"], outline=self.colors["secondary"], width=1)
            
            # Field label
            draw.text((25, y_offset + 5), field, fill=self.colors["dark"], font=font)
            
            y_offset += field_height + field_spacing
        
        # Preview section
        preview_y = y_offset + 20
        draw.rectangle([20, preview_y, width - 20, height - 80], 
                      fill=self.colors["dark"], outline=self.colors["primary"], width=2)
        
        # Preview text
        preview_text = "/*\n * sample-file.js\n * My Project\n * @author Developer\n */"
        draw.text((25, preview_y + 10), preview_text, fill=self.colors["white"], font=font)
        
        # Buttons
        button_y = height - 60
        draw.rectangle([20, button_y, width - 20, button_y + 40], 
                      fill=self.colors["success"], outline=self.colors["success"])
        draw.text((width // 2 - 50, button_y + 10), "Generate Header", 
                 fill=self.colors["white"], font=font)
        
        return img
    
    def create_options_screenshot(self):
        """Create a mockup of the options interface"""
        width, height = 800, 600
        img = Image.new("RGB", (width, height), self.colors["light"])
        draw = ImageDraw.Draw(img)
        
        # Header
        header_height = 80
        draw.rectangle([0, 0, width, header_height], fill=self.colors["primary"])
        
        # Logo and title
        logo_size = 48
        logo_x = 20
        logo_y = (header_height - logo_size) // 2
        draw.ellipse([logo_x, logo_y, logo_x + logo_size, logo_y + logo_size], 
                    fill=self.colors["white"])
        
        try:
            title_font = ImageFont.truetype("arial.ttf", 24)
            subtitle_font = ImageFont.truetype("arial.ttf", 14)
        except:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
        
        draw.text((logo_x + logo_size + 15, logo_y), "HeadForge Settings", 
                 fill=self.colors["white"], font=title_font)
        draw.text((logo_x + logo_size + 15, logo_y + 30), "Configure your preferences", 
                 fill=self.colors["white"], font=subtitle_font)
        
        # Settings sections
        y_offset = header_height + 20
        section_height = 120
        
        sections = ["General Settings", "Behavior Settings", "Export Settings", "Theme Settings"]
        for section in sections:
            # Section background
            draw.rectangle([20, y_offset, width - 20, y_offset + section_height], 
                          fill=self.colors["white"], outline=self.colors["secondary"], width=1)
            
            # Section title
            draw.text((30, y_offset + 10), section, fill=self.colors["dark"], font=title_font)
            
            # Settings items
            item_y = y_offset + 40
            for i in range(3):
                draw.rectangle([30, item_y, width - 30, item_y + 20], 
                              fill=self.colors["light"], outline=self.colors["secondary"], width=1)
                draw.text((35, item_y + 2), f"Setting {i+1}", fill=self.colors["dark"], font=subtitle_font)
                item_y += 25
            
            y_offset += section_height + 20
        
        return img
    
    def generate_all(self):
        """Generate all assets"""
        print("HeadForge Asset Generator")
        print("=" * 40)
        
        self.generate_icons()
        self.generate_svg_icon()
        self.generate_banners()
        self.generate_screenshots()
        
        print("\nAsset generation complete!")
        print(f"Icons saved to: {self.output_dir / 'icons'}")
        print(f"Banners saved to: {self.store_dir}")
        print(f"Screenshots saved to: {self.store_dir / 'shared' / 'promotional-images'}")

def main():
    parser = argparse.ArgumentParser(description="Generate HeadForge assets")
    parser.add_argument("--logo", default="src/assets/images/logo.png", 
                       help="Path to the main logo file")
    parser.add_argument("--icons-only", action="store_true", 
                       help="Generate only icons")
    parser.add_argument("--banners-only", action="store_true", 
                       help="Generate only banners")
    parser.add_argument("--screenshots-only", action="store_true", 
                       help="Generate only screenshots")
    
    args = parser.parse_args()
    
    generator = HeadForgeAssetGenerator(args.logo)
    
    if args.icons_only:
        generator.generate_icons()
        generator.generate_svg_icon()
    elif args.banners_only:
        generator.generate_banners()
    elif args.screenshots_only:
        generator.generate_screenshots()
    else:
        generator.generate_all()

if __name__ == "__main__":
    main()
