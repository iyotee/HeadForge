#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Creating GitHub repository for HeadForge...\n");

// Check if gh CLI is installed
try {
  execSync("gh --version", { stdio: "pipe" });
  console.log("✅ GitHub CLI (gh) is installed");
} catch (error) {
  console.log("❌ GitHub CLI (gh) is not installed");
  console.log("Please install it from: https://cli.github.com/");
  console.log("Or create the repository manually at: https://github.com/new");
  process.exit(1);
}

// Check if user is authenticated
try {
  execSync("gh auth status", { stdio: "pipe" });
  console.log("✅ GitHub CLI is authenticated");
} catch (error) {
  console.log("❌ GitHub CLI is not authenticated");
  console.log("Please run: gh auth login");
  process.exit(1);
}

// Create the repository
try {
  console.log("📝 Creating repository...");
  execSync(
    'gh repo create headforge --public --description "Professional code header generator browser extension" --clone=false',
    { stdio: "inherit" }
  );
  console.log("✅ Repository created successfully!");

  console.log(
    "\n🎉 Repository created at: https://github.com/satoshiba/headforge"
  );
  console.log("\n📋 Next steps:");
  console.log("1. Push the code: git push -u origin master");
  console.log("2. Push the tags: git push origin --tags");
  console.log(
    "3. Check GitHub Actions: https://github.com/satoshiba/headforge/actions"
  );
  console.log("4. Monitor the automated release creation");
} catch (error) {
  console.log("❌ Failed to create repository:", error.message);
  console.log("\n📋 Manual steps:");
  console.log("1. Go to: https://github.com/new");
  console.log("2. Repository name: headforge");
  console.log(
    "3. Description: Professional code header generator browser extension"
  );
  console.log("4. Make it Public");
  console.log("5. Do NOT initialize with README, .gitignore, or license");
  console.log('6. Click "Create repository"');
  console.log("7. Then run: git push -u origin master");
}
