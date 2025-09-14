const fs = require('fs');
const path = require('path');

class ManifestValidator {
  constructor() {
    this.manifestPath = path.join(__dirname, '../dist/manifest.json');
    this.errors = [];
    this.warnings = [];
  }

  validate() {
    console.log('🔍 Validating extension manifest...');
    
    if (!fs.existsSync(this.manifestPath)) {
      this.errors.push('Manifest file not found');
      return this.getResults();
    }

    try {
      const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
      
      this.validateBasicStructure(manifest);
      this.validatePermissions(manifest);
      this.validateContentSecurityPolicy(manifest);
      this.validateIcons(manifest);
      this.validateAction(manifest);
      this.validateBackground(manifest);
      this.validateContentScripts(manifest);
      this.validateWebAccessibleResources(manifest);
      
    } catch (error) {
      this.errors.push(`Invalid JSON: ${error.message}`);
    }

    return this.getResults();
  }

  validateBasicStructure(manifest) {
    const requiredFields = [
      'manifest_version',
      'name',
      'version',
      'description'
    ];

    requiredFields.forEach(field => {
      if (!manifest[field]) {
        this.errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate manifest version
    if (manifest.manifest_version && ![2, 3].includes(manifest.manifest_version)) {
      this.errors.push('Invalid manifest_version. Must be 2 or 3');
    }

    // Validate version format
    if (manifest.version && !/^\d+\.\d+\.\d+/.test(manifest.version)) {
      this.warnings.push('Version should follow semantic versioning (e.g., 1.0.0)');
    }
  }

  validatePermissions(manifest) {
    const permissions = manifest.permissions || [];
    const optionalPermissions = manifest.optional_permissions || [];
    const hostPermissions = manifest.host_permissions || [];

    // Check for dangerous permissions
    const dangerousPermissions = [
      'tabs',
      'activeTab',
      'storage',
      'clipboardWrite',
      'notifications',
      'geolocation',
      'camera',
      'microphone'
    ];

    const usedPermissions = [...permissions, ...optionalPermissions];
    
    usedPermissions.forEach(permission => {
      if (dangerousPermissions.includes(permission)) {
        this.warnings.push(`Potentially sensitive permission: ${permission}`);
      }
    });

    // Check for unnecessary permissions
    const unnecessaryPermissions = [
      'unlimitedStorage',
      'system.cpu',
      'system.memory',
      'system.storage'
    ];

    usedPermissions.forEach(permission => {
      if (unnecessaryPermissions.includes(permission)) {
        this.warnings.push(`Potentially unnecessary permission: ${permission}`);
      }
    });

    // Validate host permissions
    hostPermissions.forEach(host => {
      if (host === '<all_urls>') {
        this.warnings.push('Broad host permission <all_urls> detected - consider restricting');
      }
    });
  }

  validateContentSecurityPolicy(manifest) {
    const csp = manifest.content_security_policy;
    
    if (!csp) {
      this.warnings.push('No Content Security Policy defined');
      return;
    }

    // Check for unsafe directives
    if (csp.includes("'unsafe-inline'")) {
      this.warnings.push("CSP contains 'unsafe-inline' - consider removing");
    }

    if (csp.includes("'unsafe-eval'")) {
      this.errors.push("CSP contains 'unsafe-eval' - this is a security risk");
    }

    // Validate CSP format
    if (typeof csp === 'object') {
      Object.keys(csp).forEach(key => {
        if (!['extension_pages', 'sandbox'].includes(key)) {
          this.warnings.push(`Unknown CSP key: ${key}`);
        }
      });
    }
  }

  validateIcons(manifest) {
    const icons = manifest.icons;
    
    if (!icons) {
      this.warnings.push('No icons defined');
      return;
    }

    const requiredSizes = [16, 32, 48, 128];
    const providedSizes = Object.keys(icons).map(size => parseInt(size));

    requiredSizes.forEach(size => {
      if (!providedSizes.includes(size)) {
        this.warnings.push(`Missing icon size: ${size}x${size}`);
      }
    });

    // Check if icon files exist
    Object.values(icons).forEach(iconPath => {
      const fullPath = path.join(__dirname, '../dist', iconPath);
      if (!fs.existsSync(fullPath)) {
        this.errors.push(`Icon file not found: ${iconPath}`);
      }
    });
  }

  validateAction(manifest) {
    const action = manifest.action;
    
    if (!action) {
      this.warnings.push('No action defined - extension may not be accessible');
      return;
    }

    if (!action.default_popup) {
      this.warnings.push('No default_popup defined - users cannot access extension');
    }

    // Check if popup file exists
    if (action.default_popup) {
      const popupPath = path.join(__dirname, '../dist', action.default_popup);
      if (!fs.existsSync(popupPath)) {
        this.errors.push(`Popup file not found: ${action.default_popup}`);
      }
    }
  }

  validateBackground(manifest) {
    const background = manifest.background;
    
    if (!background) {
      this.warnings.push('No background script defined');
      return;
    }

    if (manifest.manifest_version === 3) {
      if (!background.service_worker) {
        this.errors.push('Manifest v3 requires service_worker in background');
      } else {
        const workerPath = path.join(__dirname, '../dist', background.service_worker);
        if (!fs.existsSync(workerPath)) {
          this.errors.push(`Background service worker not found: ${background.service_worker}`);
        }
      }
    } else if (manifest.manifest_version === 2) {
      if (!background.scripts) {
        this.errors.push('Manifest v2 requires scripts in background');
      } else {
        background.scripts.forEach(script => {
          const scriptPath = path.join(__dirname, '../dist', script);
          if (!fs.existsSync(scriptPath)) {
            this.errors.push(`Background script not found: ${script}`);
          }
        });
      }
    }
  }

  validateContentScripts(manifest) {
    const contentScripts = manifest.content_scripts;
    
    if (!contentScripts) {
      return; // Content scripts are optional
    }

    contentScripts.forEach((script, index) => {
      if (!script.matches) {
        this.errors.push(`Content script ${index}: No matches defined`);
      }

      if (!script.js && !script.css) {
        this.errors.push(`Content script ${index}: No js or css files defined`);
      }

      // Check if script files exist
      if (script.js) {
        script.js.forEach(jsFile => {
          const jsPath = path.join(__dirname, '../dist', jsFile);
          if (!fs.existsSync(jsPath)) {
            this.errors.push(`Content script file not found: ${jsFile}`);
          }
        });
      }

      if (script.css) {
        script.css.forEach(cssFile => {
          const cssPath = path.join(__dirname, '../dist', cssFile);
          if (!fs.existsSync(cssPath)) {
            this.errors.push(`Content script CSS file not found: ${cssFile}`);
          }
        });
      }
    });
  }

  validateWebAccessibleResources(manifest) {
    const resources = manifest.web_accessible_resources;
    
    if (!resources) {
      return; // Web accessible resources are optional
    }

    resources.forEach((resource, index) => {
      if (!resource.resources) {
        this.errors.push(`Web accessible resource ${index}: No resources defined`);
      }

      if (!resource.matches) {
        this.errors.push(`Web accessible resource ${index}: No matches defined`);
      }

      // Check if resource files exist
      if (resource.resources) {
        resource.resources.forEach(resourceFile => {
          const resourcePath = path.join(__dirname, '../dist', resourceFile);
          if (!fs.existsSync(resourcePath)) {
            this.errors.push(`Web accessible resource not found: ${resourceFile}`);
          }
        });
      }
    });
  }

  getResults() {
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  printResults() {
    const results = this.validate();
    
    console.log('\n📋 Manifest Validation Results');
    console.log('=' * 40);
    
    if (results.valid) {
      console.log('✅ Manifest is valid!');
    } else {
      console.log('❌ Manifest has errors:');
      results.errors.forEach(error => {
        console.log(`  • ${error}`);
      });
    }
    
    if (results.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      results.warnings.forEach(warning => {
        console.log(`  • ${warning}`);
      });
    }
    
    console.log(`\nSummary: ${results.errors.length} errors, ${results.warnings.length} warnings`);
    
    return results.valid;
  }
}

// CLI usage
if (require.main === module) {
  const validator = new ManifestValidator();
  const isValid = validator.printResults();
  process.exit(isValid ? 0 : 1);
}

module.exports = ManifestValidator;
