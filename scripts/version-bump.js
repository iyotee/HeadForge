const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VersionBumper {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.packageJsonPath = path.join(this.rootDir, 'package.json');
    this.manifestPath = path.join(this.rootDir, 'src/manifest.json');
  }

  bumpVersion(type = 'patch') {
    console.log(`🚀 Bumping version (${type})...`);
    
    try {
      // Read current version
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
      const currentVersion = packageJson.version;
      
      // Calculate new version
      const newVersion = this.calculateNewVersion(currentVersion, type);
      
      console.log(`📦 Current version: ${currentVersion}`);
      console.log(`📦 New version: ${newVersion}`);
      
      // Update package.json
      packageJson.version = newVersion;
      fs.writeFileSync(this.packageJsonPath, JSON.stringify(packageJson, null, 2));
      
      // Update manifest.json
      if (fs.existsSync(this.manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(this.manifestPath, 'utf8'));
        manifest.version = newVersion;
        fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2));
      }
      
      // Update README.md if it contains version info
      this.updateReadmeVersion(newVersion);
      
      // Update documentation
      this.updateDocumentationVersion(newVersion);
      
      // Create git tag
      this.createGitTag(newVersion);
      
      console.log(`✅ Version bumped to ${newVersion}`);
      
      return newVersion;
      
    } catch (error) {
      console.error('❌ Version bump failed:', error.message);
      process.exit(1);
    }
  }

  calculateNewVersion(currentVersion, type) {
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    switch (type) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
        return `${major}.${minor}.${patch + 1}`;
      default:
        throw new Error(`Invalid version type: ${type}`);
    }
  }

  updateReadmeVersion(newVersion) {
    const readmePath = path.join(this.rootDir, 'README.md');
    
    if (fs.existsSync(readmePath)) {
      let readme = fs.readFileSync(readmePath, 'utf8');
      
      // Update version in README
      readme = readme.replace(
        /version:\s*['"][^'"]*['"]/g,
        `version: '${newVersion}'`
      );
      
      readme = readme.replace(
        /HeadForge v\d+\.\d+\.\d+/g,
        `HeadForge v${newVersion}`
      );
      
      fs.writeFileSync(readmePath, readme);
      console.log('📝 Updated README.md version');
    }
  }

  updateDocumentationVersion(newVersion) {
    const docsDir = path.join(this.rootDir, 'docs');
    
    if (fs.existsSync(docsDir)) {
      const files = fs.readdirSync(docsDir);
      
      files.forEach(file => {
        if (file.endsWith('.md')) {
          const filePath = path.join(docsDir, file);
          let content = fs.readFileSync(filePath, 'utf8');
          
          // Update version references
          content = content.replace(
            /version:\s*['"][^'"]*['"]/g,
            `version: '${newVersion}'`
          );
          
          content = content.replace(
            /HeadForge v\d+\.\d+\.\d+/g,
            `HeadForge v${newVersion}`
          );
          
          fs.writeFileSync(filePath, content);
        }
      });
      
      console.log('📚 Updated documentation versions');
    }
  }

  createGitTag(newVersion) {
    try {
      // Check if we're in a git repository
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      
      // Create and push tag
      execSync(`git tag -a v${newVersion} -m "Release version ${newVersion}"`, { stdio: 'inherit' });
      console.log(`🏷️  Created git tag v${newVersion}`);
      
    } catch (error) {
      console.warn('⚠️  Could not create git tag:', error.message);
    }
  }

  generateChangelog(newVersion) {
    console.log('📝 Generating changelog...');
    
    try {
      // Get git log since last tag
      const lastTag = this.getLastTag();
      const commits = this.getCommitsSince(lastTag);
      
      // Generate changelog entry
      const changelogEntry = this.formatChangelogEntry(newVersion, commits);
      
      // Update CHANGELOG.md
      this.updateChangelog(changelogEntry);
      
      console.log('📝 Changelog generated');
      
    } catch (error) {
      console.warn('⚠️  Could not generate changelog:', error.message);
    }
  }

  getLastTag() {
    try {
      const output = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' });
      return output.trim();
    } catch (error) {
      return null;
    }
  }

  getCommitsSince(tag) {
    try {
      const range = tag ? `${tag}..HEAD` : 'HEAD';
      const output = execSync(`git log --oneline ${range}`, { encoding: 'utf8' });
      return output.trim().split('\n').filter(line => line.trim());
    } catch (error) {
      return [];
    }
  }

  formatChangelogEntry(version, commits) {
    const date = new Date().toISOString().split('T')[0];
    
    let changelog = `## [${version}] - ${date}\n\n`;
    
    // Categorize commits
    const features = commits.filter(commit => commit.includes('feat:'));
    const fixes = commits.filter(commit => commit.includes('fix:'));
    const docs = commits.filter(commit => commit.includes('docs:'));
    const other = commits.filter(commit => 
      !commit.includes('feat:') && 
      !commit.includes('fix:') && 
      !commit.includes('docs:')
    );
    
    if (features.length > 0) {
      changelog += '### Added\n';
      features.forEach(commit => {
        changelog += `- ${commit.replace(/^[a-f0-9]+ /, '').replace(/^feat\([^)]+\): /, '')}\n`;
      });
      changelog += '\n';
    }
    
    if (fixes.length > 0) {
      changelog += '### Fixed\n';
      fixes.forEach(commit => {
        changelog += `- ${commit.replace(/^[a-f0-9]+ /, '').replace(/^fix\([^)]+\): /, '')}\n`;
      });
      changelog += '\n';
    }
    
    if (docs.length > 0) {
      changelog += '### Documentation\n';
      docs.forEach(commit => {
        changelog += `- ${commit.replace(/^[a-f0-9]+ /, '').replace(/^docs\([^)]+\): /, '')}\n`;
      });
      changelog += '\n';
    }
    
    if (other.length > 0) {
      changelog += '### Other\n';
      other.forEach(commit => {
        changelog += `- ${commit.replace(/^[a-f0-9]+ /, '')}\n`;
      });
      changelog += '\n';
    }
    
    return changelog;
  }

  updateChangelog(entry) {
    const changelogPath = path.join(this.rootDir, 'CHANGELOG.md');
    
    let changelog = '';
    if (fs.existsSync(changelogPath)) {
      changelog = fs.readFileSync(changelogPath, 'utf8');
    } else {
      changelog = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
    }
    
    // Insert new entry after the header
    const lines = changelog.split('\n');
    const headerEndIndex = lines.findIndex(line => line.startsWith('## ['));
    
    if (headerEndIndex === -1) {
      changelog += entry;
    } else {
      lines.splice(headerEndIndex, 0, entry);
      changelog = lines.join('\n');
    }
    
    fs.writeFileSync(changelogPath, changelog);
  }
}

// CLI usage
if (require.main === module) {
  const bumper = new VersionBumper();
  const type = process.argv[2] || 'patch';
  
  if (!['major', 'minor', 'patch'].includes(type)) {
    console.error('❌ Invalid version type. Use: major, minor, or patch');
    process.exit(1);
  }
  
  const newVersion = bumper.bumpVersion(type);
  bumper.generateChangelog(newVersion);
  
  console.log(`\n🎉 Version bump completed!`);
  console.log(`📦 New version: ${newVersion}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review the changes`);
  console.log(`2. Commit the changes: git add . && git commit -m "chore: bump version to ${newVersion}"`);
  console.log(`3. Push the changes: git push && git push --tags`);
  console.log(`4. Create a release on GitHub`);
}

module.exports = VersionBumper;
