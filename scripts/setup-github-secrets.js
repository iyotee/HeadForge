#!/usr/bin/env node

const { execSync } = require("child_process");

console.log("🔑 Setting up GitHub Secrets for HeadForge...\n");

// Edge Extension Information
const edgeSecrets = {
  EDGE_PRODUCT_ID: "87f97987-2b9a-4472-965c-de487524a27d",
  EDGE_STORE_ID: "0RDCKGPPMFFD", 
  EDGE_CRX_ID: "hhokheegikjbhfjianlhcakjeegadage"
};

// Instructions for manual setup
console.log("📋 GitHub Secrets Setup Instructions:");
console.log("=".repeat(50));

console.log("\n🏪 Microsoft Edge Add-ons:");
Object.entries(edgeSecrets).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`);
});

console.log("\n🔧 Manual Setup Steps:");
console.log("1. Go to: https://github.com/iyotee/HeadForge/settings/secrets/actions");
console.log("2. Click 'New repository secret'");
console.log("3. Add each secret with the values above");

console.log("\n⚠️  Still needed (you need to get these from Partner Center):");
console.log("   EDGE_CLIENT_ID: App registration client ID");
console.log("   EDGE_CLIENT_SECRET: App registration client secret");
console.log("   EDGE_ACCESS_TOKEN_URL: OAuth token URL");

console.log("\n🌐 Chrome Web Store (still needed):");
console.log("   CHROME_EXTENSION_ID: Your extension ID from Chrome Web Store");
console.log("   CHROME_CLIENT_ID: OAuth client ID");
console.log("   CHROME_CLIENT_SECRET: OAuth client secret");
console.log("   CHROME_REFRESH_TOKEN: OAuth refresh token");

console.log("\n🦊 Firefox Add-ons (still needed):");
console.log("   FIREFOX_API_KEY: Your API key");
console.log("   FIREFOX_API_SECRET: Your API secret");

console.log("\n📋 Next Steps:");
console.log("1. Set up the remaining secrets in GitHub");
console.log("2. Create a new release: npm run create-release");
console.log("3. GitHub Actions will automatically submit to stores");
console.log("4. Users can install directly from browser stores");

console.log("\n🎯 Current Status:");
console.log("✅ Edge extension configured in Partner Center");
console.log("✅ Edge Product ID, Store ID, and CRX ID available");
console.log("⏳ Waiting for OAuth credentials from Partner Center");
console.log("⏳ Chrome and Firefox stores still need setup");

console.log("\n🔗 Useful Links:");
console.log("• GitHub Secrets: https://github.com/iyotee/HeadForge/settings/secrets/actions");
console.log("• Partner Center: https://partner.microsoft.com/dashboard");
console.log("• Chrome Web Store: https://chrome.google.com/webstore/developer/dashboard");
console.log("• Firefox Add-ons: https://addons.mozilla.org/developers/");
