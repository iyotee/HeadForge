#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Creating HeadForge Release...\n");

// Get current version from package.json
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const currentVersion = packageJson.version;

console.log(`📦 Current version: ${currentVersion}`);

// Create new tag
const newVersion = process.argv[2] || "patch";
let newTag;

if (newVersion === "patch") {
  const [major, minor, patch] = currentVersion.split(".").map(Number);
  newTag = `v${major}.${minor}.${patch + 1}`;
} else if (newVersion === "minor") {
  const [major, minor] = currentVersion.split(".").map(Number);
  newTag = `v${major}.${minor + 1}.0`;
} else if (newVersion === "major") {
  const [major] = currentVersion.split(".").map(Number);
  newTag = `v${major + 1}.0.0`;
} else {
  newTag = newVersion.startsWith("v") ? newVersion : `v${newVersion}`;
}

console.log(`🏷️  Creating tag: ${newTag}`);

try {
  // Create tag only (don't push automatically)
  execSync(`git tag ${newTag}`, { stdio: "inherit" });

  console.log(`\n✅ Tag ${newTag} created successfully!`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Push the tag manually: git push origin ${newTag}`);
  console.log(`   2. This will trigger the release workflow`);
  console.log(
    `   3. Check GitHub Actions: https://github.com/iyotee/HeadForge/actions`
  );
  console.log(
    `   4. Wait for release: https://github.com/iyotee/HeadForge/releases`
  );
  console.log(`\n🎯 This prevents conflicts between CI and Release workflows!`);
} catch (error) {
  console.error("❌ Error creating release:", error.message);
  process.exit(1);
}
