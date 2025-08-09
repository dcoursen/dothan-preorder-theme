#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const projectRoot = path.join(__dirname, '..');
const backupDir = path.join(projectRoot, 'theme-backups');
const templatesDir = path.join(projectRoot, 'templates');
const configDir = path.join(projectRoot, 'config');

// Files to backup
const filesToBackup = [
  {
    source: 'templates/product.json',
    backup: 'templates/product.backup.json',
    description: 'Product template'
  },
  {
    source: 'config/settings_data.json',
    backup: 'theme-backups/settings_data.backup.json',
    description: 'Theme settings'
  },
  {
    source: 'config/settings_schema.json',
    backup: 'theme-backups/settings_schema.backup.json',
    description: 'Theme settings schema'
  }
];

// Ensure backup directory exists
function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('📁 Created backup directory');
  }
}

// Create timestamped backup
function createTimestampedBackup(filePath, description) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${description} not found: ${filePath}`);
      return false;
    }

    const timestamp = new Date().toISOString().replace(/[:]/g, '-').split('.')[0];
    const fileName = path.basename(filePath);
    const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);
    
    fs.copyFileSync(filePath, backupPath);
    console.log(`📸 Created timestamped backup: ${path.basename(backupPath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error backing up ${description}:`, error.message);
    return false;
  }
}

// Update main backup files
function updateBackups() {
  console.log('🔄 Updating theme configuration backups...\n');
  
  ensureBackupDir();
  
  let allSuccess = true;
  
  filesToBackup.forEach(file => {
    const sourcePath = path.join(projectRoot, file.source);
    const backupPath = path.join(projectRoot, file.backup);
    
    try {
      if (!fs.existsSync(sourcePath)) {
        console.log(`⚠️  Source not found: ${file.source}`);
        allSuccess = false;
        return;
      }
      
      // Create timestamped backup first
      createTimestampedBackup(sourcePath, file.description);
      
      // Update main backup
      const backupDirPath = path.dirname(backupPath);
      if (!fs.existsSync(backupDirPath)) {
        fs.mkdirSync(backupDirPath, { recursive: true });
      }
      
      fs.copyFileSync(sourcePath, backupPath);
      console.log(`✅ Updated ${file.description} backup`);
      
    } catch (error) {
      console.error(`❌ Error updating ${file.description}:`, error.message);
      allSuccess = false;
    }
  });
  
  console.log('\n📋 Backup Summary:');
  console.log(`- Product template: templates/product.backup.json`);
  console.log(`- Theme settings: theme-backups/settings_data.backup.json`);
  console.log(`- Settings schema: theme-backups/settings_schema.backup.json`);
  console.log(`- Timestamped backups: theme-backups/`);
  
  if (allSuccess) {
    console.log('\n✨ All backups updated successfully!');
  } else {
    console.log('\n⚠️  Some backups failed - check errors above');
  }
  
  return allSuccess;
}

// Check if running as pre-push hook
function isPrePushHook() {
  return process.argv.includes('--pre-push');
}

// Main
if (require.main === module) {
  const success = updateBackups();
  
  if (isPrePushHook() && !success) {
    console.log('\n❌ Pre-push check failed - backups not updated');
    process.exit(1);
  }
  
  process.exit(0);
}

module.exports = { updateBackups };