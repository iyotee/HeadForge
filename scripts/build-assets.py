#!/usr/bin/env python3
"""
HeadForge Assets Builder
Builds all assets (banners, icons) for the extension
"""

import os
import sys
import subprocess
from pathlib import Path

def run_script(script_path, args=None):
    """Run a Python script and return success status"""
    try:
        cmd = [sys.executable, script_path]
        if args:
            cmd.extend(args)
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ {script_path} completed successfully")
            if result.stdout:
                print(result.stdout)
            return True
        else:
            print(f"❌ {script_path} failed")
            if result.stderr:
                print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Error running {script_path}: {e}")
        return False

def main():
    """Build all assets for the extension"""
    
    # Get the directory of this script
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    print("🚀 Building HeadForge assets...")
    print("=" * 50)
    
    # Build banners
    print("\n📸 Generating banners...")
    banner_script = script_dir / "generate-banner.py"
    if banner_script.exists():
        success = run_script(str(banner_script), ["--all"])
        if not success:
            print("❌ Banner generation failed")
            return False
    else:
        print("❌ Banner script not found")
        return False
    
    # Build icons
    print("\n🎨 Optimizing icons...")
    icon_script = script_dir / "optimize-icons.py"
    if icon_script.exists():
        success = run_script(str(icon_script))
        if not success:
            print("❌ Icon optimization failed")
            return False
    else:
        print("❌ Icon script not found")
        return False
    
    print("\n" + "=" * 50)
    print("✅ All assets built successfully!")
    print("\nGenerated files:")
    print("📸 Banners: src/assets/images/banner_*.png")
    print("🎨 Icons: src/assets/icons/icon-*.png")
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
