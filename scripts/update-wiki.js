#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("📚 Updating HeadForge GitHub Wiki...\n");

// Check if we're in the right directory
const currentDir = process.cwd();
if (!currentDir.includes("HeadForge")) {
  console.log("❌ Please run this script from the HeadForge project directory");
  process.exit(1);
}

// Check if docs-wiki directory exists
const wikiDir = path.join(currentDir, "docs-wiki");
if (!fs.existsSync(wikiDir)) {
  console.log("❌ docs-wiki directory not found");
  console.log("Please clone the wiki first:");
  console.log(
    "git clone https://github.com/iyotee/HeadForge.wiki.git docs-wiki"
  );
  process.exit(1);
}

try {
  // Navigate to wiki directory
  process.chdir(wikiDir);
  console.log("📁 Changed to wiki directory");

  // Check git status
  const status = execSync("git status --porcelain", { encoding: "utf8" });
  if (status.trim()) {
    console.log("📝 Changes detected in wiki:");
    console.log(status);

    // Add all changes
    execSync("git add .", { stdio: "inherit" });
    console.log("✅ Added all changes to git");

    // Commit changes
    const commitMessage = process.argv[2] || "docs: Update wiki documentation";
    execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });
    console.log("✅ Committed changes");

    // Push to GitHub
    execSync("git push origin master", { stdio: "inherit" });
    console.log("✅ Pushed to GitHub wiki");

    console.log("\n🎉 Wiki updated successfully!");
    console.log(
      "📖 View your wiki at: https://github.com/iyotee/HeadForge/wiki"
    );
  } else {
    console.log("✅ No changes detected in wiki");
    console.log("📖 Wiki is up to date");
  }
} catch (error) {
  console.log("❌ Error updating wiki:", error.message);
  process.exit(1);
} finally {
  // Return to original directory
  process.chdir(currentDir);
}

console.log("\n📋 Wiki Management Commands:");
console.log("• Update wiki: node scripts/update-wiki.js");
console.log(
  '• Update with custom message: node scripts/update-wiki.js "Your message"'
);
console.log(
  "• Clone wiki: git clone https://github.com/iyotee/HeadForge.wiki.git docs-wiki"
);
console.log("• View wiki: https://github.com/iyotee/HeadForge/wiki");
