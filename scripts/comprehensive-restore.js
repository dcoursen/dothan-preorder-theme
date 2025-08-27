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

// Function to remove JSON comments
function stripJsonComments(jsonString) {
  // Remove single line comments
  jsonString = jsonString.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments
  jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
  return jsonString;
}

// Restore settings from backup
function restoreSettings() {
  console.log('🔧 Restoring theme settings...');
  
  const settingsPath = path.join(projectRoot, 'config', 'settings_data.json');
  const backupPath = path.join(backupDir, 'settings_data.backup.json');
  
  if (!fs.existsSync(backupPath)) {
    console.log('❌ Settings backup not found');
    return false;
  }
  
  try {
    // Read backup settings
    const backupContent = fs.readFileSync(backupPath, 'utf8');
    
    // Write to current settings file
    fs.writeFileSync(settingsPath, backupContent);
    console.log('✅ Theme settings restored from backup');
    
    return true;
  } catch (error) {
    console.error('❌ Error restoring settings:', error.message);
    return false;
  }
}

// Restore template files
function restoreTemplates() {
  console.log('📄 Restoring template files...');
  
  const templateFiles = [
    {
      current: 'templates/product.json',
      backup: 'templates/product.backup.json'
    }
  ];
  
  let success = true;
  
  templateFiles.forEach(template => {
    const currentPath = path.join(projectRoot, template.current);
    const backupPath = path.join(projectRoot, template.backup);
    
    if (fs.existsSync(backupPath)) {
      try {
        // Check if template needs restoration
        let needsRestore = false;
        
        if (!fs.existsSync(currentPath)) {
          needsRestore = true;
          console.log(`⚠️  Template missing: ${template.current}`);
        } else {
          // Check if the template has the required blocks
          const currentContent = fs.readFileSync(currentPath, 'utf8');
          const cleanJson = stripJsonComments(currentContent);
          const currentTemplate = JSON.parse(cleanJson);
          
          // Check for specific blocks that might be lost
          const productDetails = currentTemplate?.sections?.main?.blocks?.['product-details'];
          const headerGroup = productDetails?.blocks?.group_icgrde;
          const hasBulkPricing = Object.keys(productDetails?.blocks || {}).some(key => 
            productDetails.blocks[key].type === 'bulk-pricing'
          );
          const hasPreorderDisplay = Object.keys(productDetails?.blocks || {}).some(key => 
            productDetails.blocks[key].type === 'preorder-display'
          );
          
          if (!hasBulkPricing || !hasPreorderDisplay) {
            needsRestore = true;
            console.log(`⚠️  Template missing required blocks: ${template.current}`);
          }
        }
        
        if (needsRestore) {
          fs.copyFileSync(backupPath, currentPath);
          console.log(`✅ Restored ${template.current}`);
        } else {
          console.log(`✅ ${template.current} is intact`);
        }
        
      } catch (error) {
        console.error(`❌ Error restoring ${template.current}:`, error.message);
        success = false;
      }
    } else {
      console.log(`⚠️  Backup not found for ${template.current}`);
      success = false;
    }
  });
  
  return success;
}

// Main restore function
function comprehensiveRestore(options = {}) {
  console.log('🔄 Starting comprehensive theme restoration...\n');
  
  let success = true;
  
  // Restore settings if requested
  if (options.includeSettings) {
    const settingsSuccess = restoreSettings();
    if (!settingsSuccess) {
      success = false;
    }
  }
  
  // Always restore templates
  const templateSuccess = restoreTemplates();
  if (!templateSuccess) {
    success = false;
  }
  
  if (success) {
    console.log('\n✨ Comprehensive restoration completed successfully!');
  } else {
    console.log('\n⚠️  Restoration completed with some issues');
  }
  
  return success;
}

// Sync restored settings back to Shopify
async function syncToShopify() {
  console.log('📤 Syncing restored settings to Shopify...');
  
  try {
    // Push only the settings file
    const pushCommand = `shopify theme push --store=${STORE_URL} --theme=${STAGING_THEME_ID} --only=config/settings_data.json`;
    execSync(pushCommand, { stdio: 'pipe' });
    
    console.log('✅ Settings synchronized to Shopify');
    return true;
  } catch (error) {
    console.error('❌ Error syncing to Shopify:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  const includeSettings = process.argv.includes('--include-settings');
  const syncAfter = process.argv.includes('--sync');
  
  comprehensiveRestore({ includeSettings })
    .then(success => {
      if (success && syncAfter) {
        return syncToShopify();
      }
      return success;
    })
    .then(finalSuccess => {
      process.exit(finalSuccess ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Restoration failed:', error);
      process.exit(1);
    });
}

module.exports = { comprehensiveRestore, syncToShopify };