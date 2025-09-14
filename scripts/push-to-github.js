#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Pushing HeadForge to GitHub...\n');

// Check if we're in a git repository
try {
  execSync('git status', { stdio: 'pipe' });
  console.log('✅ Git repository detected');
} catch (error) {
  console.log('❌ Not a git repository. Please run "git init" first.');
  process.exit(1);
}

// Check for uncommitted changes
try {
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    console.log('⚠️  You have uncommitted changes:');
    console.log(status);
    console.log('\nPlease commit your changes before pushing to GitHub.\n');
    process.exit(1);
  } else {
    console.log('✅ Working directory is clean');
  }
} catch (error) {
  console.log('⚠️  Could not check git status');
}

// Check if remote exists
try {
  const remotes = execSync('git remote -v', { encoding: 'utf8' });
  if (remotes.includes('origin')) {
    console.log('✅ Remote origin configured');
    console.log(remotes);
  } else {
    console.log('❌ No remote origin configured. Please add it first:');
    console.log('git remote add origin https://github.com/YOUR_USERNAME/headforge.git');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Could not check git remotes');
  process.exit(1);
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

// Check if store packages exist
console.log('\n📦 Checking store packages...');
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

if (!allPackagesExist) {
  console.log('\n❌ Some store packages are missing. Please run the build first:');
  console.log('npm run build');
  process.exit(1);
}

// Check GitHub Actions workflow
console.log('\n🔄 Checking GitHub Actions workflow...');
const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'release.yml');
if (fs.existsSync(workflowPath)) {
  console.log('✅ GitHub Actions workflow exists');
} else {
  console.log('❌ GitHub Actions workflow - MISSING');
  process.exit(1);
}

// Check update checker
console.log('\n🔄 Checking update checker...');
const updateCheckerPath = path.join(__dirname, '..', 'src', 'utils', 'update-checker.ts');
const updateCheckerUIPath = path.join(__dirname, '..', 'src', 'popup', 'components', 'update-checker.ts');
if (fs.existsSync(updateCheckerPath) && fs.existsSync(updateCheckerUIPath)) {
  console.log('✅ Update checker components exist');
} else {
  console.log('❌ Update checker components - MISSING');
  process.exit(1);
}

console.log('\n🎉 All checks passed! Ready to push to GitHub.\n');

// Ask for confirmation
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Do you want to push to GitHub now? (y/N): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🚀 Pushing to GitHub...\n');
    
    try {
      // Push the code
      console.log('📤 Pushing code to master branch...');
      execSync('git push -u origin master', { stdio: 'inherit' });
      console.log('✅ Code pushed successfully!');
      
      // Push the tags
      console.log('\n🏷️  Pushing tags...');
      execSync('git push origin --tags', { stdio: 'inherit' });
      console.log('✅ Tags pushed successfully!');
      
      console.log('\n🎉 Push completed successfully!');
      console.log('\n📋 Next steps:');
      console.log('1. Go to your repository on GitHub');
      console.log('2. Check the "Actions" tab to see the GitHub Actions workflow');
      console.log('3. The workflow will automatically build and create a release');
      console.log('4. Your extension will be able to check for updates automatically!');
      console.log('\n💡 The update checker will:');
      console.log('   - Check for updates every 24 hours automatically');
      console.log('   - Show a discrete "Check for updates" button');
      console.log('   - Display notifications when updates are available');
      console.log('   - Open the GitHub release page when clicked');
      
    } catch (error) {
      console.log('\n❌ Push failed:', error.message);
      console.log('\nPlease check:');
      console.log('1. Your GitHub repository exists');
      console.log('2. You have push permissions');
      console.log('3. Your internet connection is working');
      console.log('4. The repository URL is correct');
    }
  } else {
    console.log('\n⏸️  Push cancelled. You can run this script again when ready.');
  }
  
  rl.close();
});
