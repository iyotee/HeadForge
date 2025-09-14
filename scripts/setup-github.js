#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up HeadForge for GitHub...\n');

// Check if we're in a git repository
try {
  execSync('git status', { stdio: 'pipe' });
  console.log('✅ Git repository detected');
} catch (error) {
  console.log('❌ Not a git repository. Please run "git init" first.');
  process.exit(1);
}

// Check if remote exists
try {
  const remotes = execSync('git remote -v', { encoding: 'utf8' });
  if (remotes.includes('origin')) {
    console.log('✅ Remote origin already exists');
  } else {
    console.log('⚠️  No remote origin found');
  }
} catch (error) {
  console.log('⚠️  No remote origin found');
}

// Check current branch
try {
  const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  console.log(`✅ Current branch: ${branch}`);
} catch (error) {
  console.log('⚠️  Could not determine current branch');
}

// Check for uncommitted changes
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('⚠️  You have uncommitted changes:');
    console.log(status);
    console.log('\nPlease commit your changes before pushing to GitHub.\n');
  } else {
    console.log('✅ Working directory is clean');
  }
} catch (error) {
  console.log('⚠️  Could not check git status');
}

// Check if we have tags
try {
  const tags = execSync('git tag', { encoding: 'utf8' });
  if (tags.trim()) {
    console.log('✅ Git tags found:');
    console.log(tags.trim().split('\n').map(tag => `  - ${tag}`).join('\n'));
  } else {
    console.log('⚠️  No git tags found');
  }
} catch (error) {
  console.log('⚠️  No git tags found');
}

console.log('\n📋 Next steps:');
console.log('1. Create a new repository on GitHub: https://github.com/new');
console.log('2. Name it "headforge" (or your preferred name)');
console.log('3. Make it public');
console.log('4. Do NOT initialize with README, .gitignore, or license (we already have them)');
console.log('5. Copy the repository URL');
console.log('6. Run the following commands:');
console.log('');
console.log('   # Add the remote (replace with your actual URL):');
console.log('   git remote add origin https://github.com/YOUR_USERNAME/headforge.git');
console.log('');
console.log('   # Push the code:');
console.log('   git push -u origin master');
console.log('');
console.log('   # Push the tags:');
console.log('   git push origin --tags');
console.log('');
console.log('7. Go to your repository on GitHub');
console.log('8. Check the "Actions" tab to see the GitHub Actions workflow');
console.log('9. The workflow will automatically build and create a release when you push tags');
console.log('');
console.log('🎉 Once pushed, your extension will be able to check for updates automatically!');
console.log('');
console.log('💡 The update checker will:');
console.log('   - Check for updates every 24 hours automatically');
console.log('   - Show a discrete button in the bottom-right corner');
console.log('   - Display notifications when updates are available');
console.log('   - Open the GitHub release page when clicked');
