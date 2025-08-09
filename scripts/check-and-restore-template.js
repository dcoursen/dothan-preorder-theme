#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to remove JSON comments
function stripJsonComments(jsonString) {
  // Remove single line comments
  jsonString = jsonString.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments
  jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
  return jsonString;
}

// Function to check if pickup-date block exists in the template
function hasPickupDateBlock(templatePath) {
  try {
    const fileContent = fs.readFileSync(templatePath, 'utf8');
    const cleanJson = stripJsonComments(fileContent);
    const template = JSON.parse(cleanJson);
    const productDetails = template?.sections?.main?.blocks?.['product-details'];
    
    if (!productDetails) return false;
    
    // Check if pickup-date block exists in the header group
    const headerGroup = productDetails.blocks?.group_icgrde;
    if (!headerGroup) return false;
    
    // Check if pickup_date_block exists
    return headerGroup.blocks?.pickup_date_block?.type === 'pickup-date';
  } catch (error) {
    console.error('Error checking template:', error);
    return false;
  }
}

// Function to add pickup-date block to template
function addPickupDateBlock(templatePath) {
  try {
    const fileContent = fs.readFileSync(templatePath, 'utf8');
    const hasComments = fileContent.includes('/*');
    const cleanJson = stripJsonComments(fileContent);
    const template = JSON.parse(cleanJson);
    
    // Navigate to the header group
    const headerGroup = template.sections.main.blocks['product-details'].blocks.group_icgrde;
    
    // Add pickup-date block
    headerGroup.blocks.pickup_date_block = {
      "type": "pickup-date",
      "settings": {}
    };
    
    // Update block order - insert between title and price
    const blockOrder = headerGroup.block_order;
    const titleIndex = blockOrder.indexOf('text_xrnftG');
    const priceIndex = blockOrder.indexOf('price_tVjtKg');
    
    // Remove pickup_date_block if it exists elsewhere
    const existingIndex = blockOrder.indexOf('pickup_date_block');
    if (existingIndex > -1) {
      blockOrder.splice(existingIndex, 1);
    }
    
    // Insert between title and price
    if (titleIndex > -1 && priceIndex > titleIndex) {
      blockOrder.splice(titleIndex + 1, 0, 'pickup_date_block');
    } else {
      // Fallback: add after title
      blockOrder.splice(titleIndex + 1, 0, 'pickup_date_block');
    }
    
    // Write back to file
    let output = JSON.stringify(template, null, 2);
    
    // Add back the Shopify comment if original file had it
    if (hasComments) {
      const shopifyComment = `/*
 * ------------------------------------------------------------
 * IMPORTANT: The contents of this file are auto-generated.
 *
 * This file may be updated by the Shopify admin theme editor
 * or related systems. Please exercise caution as any changes
 * made to this file may be overwritten.
 * ------------------------------------------------------------
 */
`;
      output = shopifyComment + output;
    }
    
    fs.writeFileSync(templatePath, output);
    
    return true;
  } catch (error) {
    console.error('Error adding pickup-date block:', error);
    return false;
  }
}

// Function to restore settings from backup
function restoreSettings() {
  const settingsPath = path.join(__dirname, '..', 'config', 'settings_data.json');
  const backupPath = path.join(__dirname, '..', 'theme-backups', 'settings_data.backup.json');
  
  if (!fs.existsSync(backupPath)) {
    console.log('⚠️  Settings backup not found - run backup script first');
    return false;
  }
  
  try {
    fs.copyFileSync(backupPath, settingsPath);
    console.log('✅ Restored theme settings from backup');
    return true;
  } catch (error) {
    console.error('❌ Error restoring settings:', error);
    return false;
  }
}

// Main function
function checkAndRestore(options = {}) {
  const templatePath = path.join(__dirname, '..', 'templates', 'product.json');
  let restored = false;
  
  console.log('🔍 Checking theme configuration...');
  
  if (!fs.existsSync(templatePath)) {
    console.log('❌ Product template not found');
    return false;
  }
  
  // Check template
  if (hasPickupDateBlock(templatePath)) {
    console.log('✅ Pickup-date block already exists');
  } else {
    console.log('⚠️  Pickup-date block missing, restoring...');
    
    if (addPickupDateBlock(templatePath)) {
      console.log('✅ Successfully restored pickup-date block');
      restored = true;
    } else {
      console.log('❌ Failed to restore pickup-date block');
      return false;
    }
  }
  
  // Optionally restore settings
  if (options.includeSettings) {
    console.log('🔧 Restoring theme settings...');
    restoreSettings();
    restored = true;
  }
  
  if (restored) {
    console.log('✨ Theme restoration complete!');
  }
  
  return true;
}

// Run if called directly
if (require.main === module) {
  checkAndRestore();
}

module.exports = { checkAndRestore, hasPickupDateBlock };