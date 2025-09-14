#!/usr/bin/env node

const { execSync } = require("child_process");

console.log("🚀 Pushing tag to trigger release workflow...\n");

// Get the latest tag
const latestTag = execSync("git describe --tags --abbrev=0", {
  encoding: "utf8",
}).trim();
console.log(`📦 Latest tag: ${latestTag}`);

try {
  console.log(`🏷️  Pushing tag ${latestTag}...`);
  execSync(`git push origin ${latestTag}`, { stdio: "inherit" });

  console.log(`\n✅ Tag ${latestTag} pushed successfully!`);
  console.log(`\n🎉 GitHub Actions Release workflow will now start:`);
  console.log(`   • Build the extension for all browsers`);
  console.log(`   • Create store packages (Chrome, Firefox, Edge)`);
  console.log(`   • Generate a release with all packages`);
  console.log(`   • Upload artifacts for download`);

  console.log(`\n📋 Check progress:`);
  console.log(
    `   • GitHub Actions: https://github.com/iyotee/HeadForge/actions`
  );
  console.log(`   • Releases: https://github.com/iyotee/HeadForge/releases`);
} catch (error) {
  console.error("❌ Error pushing tag:", error.message);
  process.exit(1);
}
