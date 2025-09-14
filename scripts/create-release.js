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
  // Create and push tag
  execSync(`git tag ${newTag}`, { stdio: "inherit" });
  execSync(`git push origin ${newTag}`, { stdio: "inherit" });

  console.log(`\n✅ Tag ${newTag} created and pushed successfully!`);
  console.log(`\n🎉 GitHub Actions will now:`);
  console.log(`   • Build the extension for all browsers`);
  console.log(`   • Create store packages (Chrome, Firefox, Edge)`);
  console.log(`   • Generate a release with all packages`);
  console.log(`   • Upload artifacts for download`);

  console.log(`\n📋 Next steps:`);
  console.log(
    `   • Check GitHub Actions: https://github.com/iyotee/HeadForge/actions`
  );
  console.log(
    `   • Wait for release: https://github.com/iyotee/HeadForge/releases`
  );
  console.log(`   • Download packages from the release page`);
} catch (error) {
  console.error("❌ Error creating release:", error.message);
  process.exit(1);
}
