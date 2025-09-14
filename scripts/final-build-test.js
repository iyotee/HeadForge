#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧪 Final Build Test for HeadForge v1.0.0\n');

// Test 1: Check if all store packages exist
console.log('📦 Checking store packages...');
const storeDir = path.join(__dirname, '..', 'store');
const requiredPackages = [
  'headforge-chrome.zip',
  'headforge-firefox.zip', 
  'headforge-edge.zip'
];

let allPackagesExist = true;
for (const package of requiredPackages) {
  const packagePath = path.join(storeDir, package);
  if (fs.existsSync(packagePath)) {
    const stats = fs.statSync(packagePath);
    console.log(`✅ ${package} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`❌ ${package} - MISSING`);
    allPackagesExist = false;
  }
}

// Test 2: Check if all store directories exist
console.log('\n📁 Checking store directories...');
const storeDirs = ['chrome', 'firefox', 'edge'];
for (const dir of storeDirs) {
  const dirPath = path.join(storeDir, dir);
  if (fs.existsSync(dirPath)) {
    const manifestPath = path.join(dirPath, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      console.log(`✅ ${dir}/ directory with manifest.json`);
    } else {
      console.log(`❌ ${dir}/ directory missing manifest.json`);
      allPackagesExist = false;
    }
  } else {
    console.log(`❌ ${dir}/ directory - MISSING`);
    allPackagesExist = false;
  }
}

// Test 3: Check GitHub Actions workflow
console.log('\n🔄 Checking GitHub Actions workflow...');
const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'release.yml');
if (fs.existsSync(workflowPath)) {
  console.log('✅ GitHub Actions workflow exists');
} else {
  console.log('❌ GitHub Actions workflow - MISSING');
  allPackagesExist = false;
}

// Test 4: Check update checker
console.log('\n🔄 Checking update checker...');
const updateCheckerPath = path.join(__dirname, '..', 'src', 'utils', 'update-checker.ts');
const updateCheckerUIPath = path.join(__dirname, '..', 'src', 'popup', 'components', 'update-checker.ts');
if (fs.existsSync(updateCheckerPath) && fs.existsSync(updateCheckerUIPath)) {
  console.log('✅ Update checker components exist');
} else {
  console.log('❌ Update checker components - MISSING');
  allPackagesExist = false;
}

// Test 5: Check git status
console.log('\n📋 Checking git status...');
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('⚠️  Uncommitted changes detected:');
    console.log(status);
  } else {
    console.log('✅ Working directory is clean');
  }
} catch (error) {
  console.log('❌ Could not check git status');
}

// Test 6: Check git tags
console.log('\n🏷️  Checking git tags...');
try {
  const tags = execSync('git tag', { encoding: 'utf8' });
  if (tags.trim()) {
    console.log('✅ Git tags found:');
    console.log(tags.trim().split('\n').map(tag => `  - ${tag}`).join('\n'));
  } else {
    console.log('⚠️  No git tags found');
  }
} catch (error) {
  console.log('❌ Could not check git tags');
}

// Test 7: Check remote
console.log('\n🌐 Checking git remote...');
try {
  const remotes = execSync('git remote -v', { encoding: 'utf8' });
  if (remotes.includes('origin')) {
    console.log('✅ Remote origin configured');
    console.log(remotes);
  } else {
    console.log('⚠️  No remote origin configured');
  }
} catch (error) {
  console.log('❌ Could not check git remotes');
}

// Summary
console.log('\n📊 Test Summary:');
if (allPackagesExist) {
  console.log('🎉 All tests passed! Ready for GitHub push.');
  console.log('\n🚀 Next steps:');
  console.log('1. Create repository on GitHub: https://github.com/new');
  console.log('2. Name it "headforge"');
  console.log('3. Make it public');
  console.log('4. Do NOT initialize with README, .gitignore, or license');
  console.log('5. Copy the repository URL');
  console.log('6. Update the remote URL if needed:');
  console.log('   git remote set-url origin https://github.com/YOUR_USERNAME/headforge.git');
  console.log('7. Push the code:');
  console.log('   git push -u origin master');
  console.log('8. Push the tags:');
  console.log('   git push origin --tags');
  console.log('9. Check GitHub Actions tab for automated build');
  console.log('10. The extension will automatically detect updates!');
} else {
  console.log('❌ Some tests failed. Please fix the issues before pushing to GitHub.');
}

console.log('\n💡 The update checker will:');
console.log('   - Check for updates every 24 hours automatically');
console.log('   - Show a discrete "Check for updates" button');
console.log('   - Display notifications when updates are available');
console.log('   - Open the GitHub release page when clicked');
