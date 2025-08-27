#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const STORE_URL = 'vzgxcj-h9.myshopify.com';
const STAGING_THEME_ID = '143188983970';

// Paths
const projectRoot = path.join(__dirname, '..');
const backupDir = path.join(projectRoot, 'theme-backups');

// Ensure backup directory exists
function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('📁 Created backup directory');
  }
}

// Create timestamped backup
function createTimestampedBackup(content, fileName, description) {
  try {
    const timestamp = new Date().toISOString().replace(/[:]/g, '-').split('.')[0];
    const backupPath = path.join(backupDir, `${fileName}.${timestamp}.bak`);
    
    fs.writeFileSync(backupPath, content);
    console.log(`📸 Created timestamped backup: ${path.basename(backupPath)}`);
    return backupPath;
  } catch (error) {
    console.error(`❌ Error creating backup for ${description}:`, error.message);
    return null;
  }
}

// Backup current theme settings from Shopify
async function backupRemoteSettings() {
  console.log('🌐 Downloading current theme settings from Shopify...');
  
  try {
    // Download settings_data.json from Shopify
    const settingsCommand = `shopify theme pull --store=${STORE_URL} --theme=${STAGING_THEME_ID} --only=config/settings_data.json --force`;
    execSync(settingsCommand, { stdio: 'pipe' });
    
    // Read the downloaded settings
    const settingsPath = path.join(projectRoot, 'config', 'settings_data.json');
    if (fs.existsSync(settingsPath)) {
      const settingsContent = fs.readFileSync(settingsPath, 'utf8');
      
      // Create backup
      const backupPath = createTimestampedBackup(settingsContent, 'settings_data.json', 'Remote theme settings');
      
      // Also update the main backup
      const mainBackupPath = path.join(backupDir, 'settings_data.backup.json');
      fs.writeFileSync(mainBackupPath, settingsContent);
      console.log('✅ Updated main settings backup');
      
      return true;
    } else {
      console.log('❌ Settings file not found after download');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error downloading settings:', error.message);
    return false;
  }
}

// Backup template files
function backupTemplates() {
  console.log('📄 Backing up template files...');
  
  const templateFiles = [
    'templates/product.json'
  ];
  
  templateFiles.forEach(templateFile => {
    const filePath = path.join(projectRoot, templateFile);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      createTimestampedBackup(content, path.basename(templateFile), `Template: ${templateFile}`);
      
      // Also update main backup
      const backupPath = path.join(projectRoot, templateFile.replace('.json', '.backup.json'));
      fs.writeFileSync(backupPath, content);
      console.log(`✅ Updated ${templateFile} backup`);
    } else {
      console.log(`⚠️  Template not found: ${templateFile}`);
    }
  });
}

// Main backup function
async function comprehensiveBackup() {
  console.log('🚀 Starting comprehensive theme backup...\n');
  
  ensureBackupDir();
  
  let success = true;
  
  // Backup remote settings first
  const remoteBackup = await backupRemoteSettings();
  if (!remoteBackup) {
    console.log('⚠️  Remote backup failed, continuing with local files...');
    success = false;
  }
  
  // Backup local templates
  backupTemplates();
  
  // Backup settings schema
  const schemaPath = path.join(projectRoot, 'config', 'settings_schema.json');
  if (fs.existsSync(schemaPath)) {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    createTimestampedBackup(schemaContent, 'settings_schema.json', 'Settings schema');
    
    const schemaBackupPath = path.join(backupDir, 'settings_schema.backup.json');
    fs.writeFileSync(schemaBackupPath, schemaContent);
    console.log('✅ Updated settings schema backup');
  }
  
  console.log('\n📋 Comprehensive Backup Summary:');
  console.log(`- Remote theme settings downloaded and backed up`);
  console.log(`- Local template files backed up`);
  console.log(`- Settings schema backed up`);
  console.log(`- All backups stored in: theme-backups/`);
  
  if (success) {
    console.log('\n✨ Comprehensive backup completed successfully!');
  } else {
    console.log('\n⚠️  Backup completed with some warnings');
  }
  
  return success;
}

// Run if called directly
if (require.main === module) {
  comprehensiveBackup()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Backup failed:', error);
      process.exit(1);
    });
}

module.exports = { comprehensiveBackup };