#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔍 Validating HeadForge for store requirements...\n");

// Read manifest
const manifestPath = path.join(__dirname, "../src/manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

let errors = [];
let warnings = [];

// Manifest V3 Requirements
console.log("📋 Checking Manifest V3 compliance...");

// Check manifest version
if (manifest.manifest_version !== 3) {
  errors.push("❌ Manifest version must be 3");
} else {
  console.log("✅ Manifest version is 3");
}

// Check required fields
const requiredFields = ["name", "version", "description"];
requiredFields.forEach((field) => {
  if (!manifest[field]) {
    errors.push(`❌ Missing required field: ${field}`);
  } else {
    console.log(`✅ ${field}: ${manifest[field]}`);
  }
});

// Check deprecated fields
const deprecatedFields = ["author", "homepage_url"];
deprecatedFields.forEach((field) => {
  if (manifest[field]) {
    warnings.push(`⚠️  Deprecated field found: ${field} (should be removed)`);
  }
});

// Check icons
if (!manifest.icons) {
  errors.push("❌ Missing icons");
} else {
  const requiredSizes = [16, 32, 48, 128];
  requiredSizes.forEach((size) => {
    if (!manifest.icons[size]) {
      errors.push(`❌ Missing icon size: ${size}x${size}`);
    } else {
      console.log(`✅ Icon ${size}x${size}: ${manifest.icons[size]}`);
    }
  });
}

// Check permissions
if (manifest.permissions) {
  const dangerousPermissions = ["tabs", "bookmarks", "history", "downloads"];
  manifest.permissions.forEach((permission) => {
    if (dangerousPermissions.includes(permission)) {
      warnings.push(`⚠️  Potentially dangerous permission: ${permission}`);
    }
  });
  console.log(`✅ Permissions: ${manifest.permissions.join(", ")}`);
}

// Check host_permissions
if (manifest.host_permissions) {
  if (manifest.host_permissions.includes("<all_urls>")) {
    warnings.push("⚠️  <all_urls> permission may be rejected by stores");
  }
  console.log(`✅ Host permissions: ${manifest.host_permissions.join(", ")}`);
}

// Check content scripts
if (manifest.content_scripts) {
  manifest.content_scripts.forEach((script, index) => {
    if (script.matches && script.matches.includes("<all_urls>")) {
      warnings.push(
        `⚠️  Content script ${index} uses <all_urls> which may be rejected`
      );
    }
  });
}

// Check description length
if (manifest.description && manifest.description.length < 10) {
  warnings.push(
    "⚠️  Description is too short (should be at least 10 characters)"
  );
}

if (manifest.description && manifest.description.length > 132) {
  warnings.push(
    "⚠️  Description is too long (should be less than 132 characters)"
  );
}

// Check version format
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(manifest.version)) {
  errors.push("❌ Version must be in format X.Y.Z (e.g., 1.0.0)");
} else {
  console.log(`✅ Version format: ${manifest.version}`);
}

// Check file paths
console.log("\n📁 Checking file paths...");
const checkFileExists = (filePath) => {
  const fullPath = path.join(__dirname, "../src", filePath);
  return fs.existsSync(fullPath);
};

// Check background script
if (manifest.background && manifest.background.service_worker) {
  // Check for TypeScript source file
  const tsFile = manifest.background.service_worker.replace(".js", ".ts");
  if (checkFileExists(tsFile)) {
    console.log(`✅ Background script source: ${tsFile}`);
  } else {
    errors.push(`❌ Background script source not found: ${tsFile}`);
  }
}

// Check popup
if (manifest.action && manifest.action.default_popup) {
  if (checkFileExists(manifest.action.default_popup)) {
    console.log(`✅ Popup: ${manifest.action.default_popup}`);
  } else {
    errors.push(`❌ Popup not found: ${manifest.action.default_popup}`);
  }
}

// Check options page
if (manifest.options_page) {
  if (checkFileExists(manifest.options_page)) {
    console.log(`✅ Options page: ${manifest.options_page}`);
  } else {
    errors.push(`❌ Options page not found: ${manifest.options_page}`);
  }
}

// Check content scripts
if (manifest.content_scripts) {
  manifest.content_scripts.forEach((script, index) => {
    if (script.js) {
      script.js.forEach((jsFile) => {
        // Check for TypeScript source file
        const tsFile = jsFile.replace(".js", ".ts");
        if (checkFileExists(tsFile)) {
          console.log(`✅ Content script ${index} source: ${tsFile}`);
        } else {
          errors.push(`❌ Content script source not found: ${tsFile}`);
        }
      });
    }
  });
}

// Summary
console.log("\n📊 Validation Summary:");
console.log("=".repeat(50));

if (errors.length === 0 && warnings.length === 0) {
  console.log("🎉 All checks passed! Extension is ready for store submission.");
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log("\n❌ ERRORS (must be fixed):");
    errors.forEach((error) => console.log(`  ${error}`));
  }

  if (warnings.length > 0) {
    console.log("\n⚠️  WARNINGS (should be reviewed):");
    warnings.forEach((warning) => console.log(`  ${warning}`));
  }

  console.log("\n📋 Next steps:");
  console.log("  1. Fix all errors before submitting to stores");
  console.log("  2. Review warnings and address if necessary");
  console.log("  3. Test extension thoroughly on target browsers");
  console.log("  4. Follow store-specific submission guidelines");

  process.exit(errors.length > 0 ? 1 : 0);
}
