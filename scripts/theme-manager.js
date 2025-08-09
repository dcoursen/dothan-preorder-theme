#!/usr/bin/env node
/**
 * Retail Savage Theme Manager
 * Central management system for all client themes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Load configurations
const VERSION_CONFIG = require('../config/version.json');
const CLIENT_VERSIONS = require('../config/client-versions.json');

// CLI interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Display theme information
function displayThemeInfo() {
  console.clear();
  console.log('🎯 Retail Savage Theme Manager\n');
  console.log('═'.repeat(50));
  console.log(`Theme: ${VERSION_CONFIG.theme.name}`);
  console.log(`Version: ${VERSION_CONFIG.theme.version} "${VERSION_CONFIG.theme.codename}"`);
  console.log(`Base: Shopify ${VERSION_CONFIG.theme.shopify_base} v${VERSION_CONFIG.theme.shopify_base_version}`);
  console.log('═'.repeat(50));
}

// List all clients and their versions
function listClients() {
  console.log('\n📋 Client Themes:\n');
  const clients = CLIENT_VERSIONS.clients;
  
  Object.entries(clients).forEach(([clientId, client]) => {
    const status = client.update_status === 'current' ? '✅' : '🔄';
    console.log(`${status} ${client.theme_name}`);
    console.log(`   Version: ${client.current_version}`);
    console.log(`   Store: ${client.store_url}`);
    console.log(`   Updated: ${client.last_updated}`);
    console.log('');
  });
}

// Create a new client theme
async function createNewClient() {
  console.log('\n🆕 Create New Client Theme\n');
  
  const clientId = await prompt('Client ID (lowercase, no spaces): ');
  const clientName = await prompt('Client Display Name: ');
  const storeUrl = await prompt('Store URL (e.g., store.myshopify.com): ');
  
  // Create client configuration
  const clientConfig = {
    theme_name: `Retail Savage x ${clientName}`,
    current_version: VERSION_CONFIG.theme.version,
    base_version: VERSION_CONFIG.theme.version,
    last_updated: new Date().toISOString().split('T')[0],
    store_url: storeUrl,
    production_theme_id: null,
    staging_theme_id: null,
    custom_features: [],
    update_status: 'current',
    notes: 'Initial setup'
  };
  
  // Update client versions file
  CLIENT_VERSIONS.clients[clientId] = clientConfig;
  fs.writeFileSync(
    path.join(__dirname, '../config/client-versions.json'),
    JSON.stringify(CLIENT_VERSIONS, null, 2)
  );
  
  // Create client config file
  const clientConfigFile = {
    client: clientId,
    store_url: storeUrl,
    theme_version: VERSION_CONFIG.theme.version,
    customizations: {
      preorder: true,
      custom_footer: false,
      klaviyo_integration: true
    },
    preserved_files: []
  };
  
  fs.writeFileSync(
    path.join(__dirname, `../config/clients/${clientId}.json`),
    JSON.stringify(clientConfigFile, null, 2)
  );
  
  // Create git branch
  console.log('\n🌿 Creating Git branch...');
  try {
    execSync(`git checkout feature/base-theme`);
    execSync(`git checkout -b feature/client-${clientId}`);
    execSync(`git push -u origin feature/client-${clientId}`);
    console.log('✅ Branch created successfully');
  } catch (error) {
    console.error('❌ Error creating branch:', error.message);
  }
  
  console.log(`\n✅ Client theme created: ${clientConfig.theme_name}`);
}

// Update client to new version
async function updateClient() {
  console.log('\n🔄 Update Client Theme\n');
  
  // List clients
  const clientIds = Object.keys(CLIENT_VERSIONS.clients);
  clientIds.forEach((id, index) => {
    console.log(`${index + 1}. ${CLIENT_VERSIONS.clients[id].theme_name}`);
  });
  
  const choice = await prompt('\nSelect client number: ');
  const clientId = clientIds[parseInt(choice) - 1];
  
  if (!clientId) {
    console.log('❌ Invalid selection');
    return;
  }
  
  const client = CLIENT_VERSIONS.clients[clientId];
  console.log(`\nUpdating ${client.theme_name}`);
  console.log(`Current version: ${client.current_version}`);
  console.log(`Latest version: ${VERSION_CONFIG.theme.version}`);
  
  if (client.current_version === VERSION_CONFIG.theme.version) {
    console.log('✅ Client is already on the latest version');
    return;
  }
  
  const confirm = await prompt('\nProceed with update? (y/n): ');
  if (confirm.toLowerCase() !== 'y') return;
  
  // Run migration
  console.log('\n🚀 Starting migration...');
  try {
    execSync(`node scripts/migrate-customizations.js --source=feature/base-theme --target=feature/client-${clientId}`, {
      stdio: 'inherit'
    });
    
    // Update version tracking
    client.current_version = VERSION_CONFIG.theme.version;
    client.last_updated = new Date().toISOString().split('T')[0];
    client.update_status = 'current';
    
    fs.writeFileSync(
      path.join(__dirname, '../config/client-versions.json'),
      JSON.stringify(CLIENT_VERSIONS, null, 2)
    );
    
    console.log('✅ Update completed successfully');
  } catch (error) {
    console.error('❌ Update failed:', error.message);
  }
}

// Generate release notes
function generateReleaseNotes() {
  console.log('\n📝 Release Notes for v' + VERSION_CONFIG.theme.version);
  console.log('═'.repeat(50));
  
  const changelog = fs.readFileSync(
    path.join(__dirname, '../CHANGELOG.md'),
    'utf8'
  );
  
  // Extract latest version section
  const versionRegex = new RegExp(`## \\[${VERSION_CONFIG.theme.version}\\].*?(?=##|$)`, 's');
  const match = changelog.match(versionRegex);
  
  if (match) {
    console.log(match[0]);
  } else {
    console.log('No release notes found for this version');
  }
}

// Check for updates
function checkForUpdates() {
  console.log('\n🔍 Checking client update status...\n');
  
  let needsUpdate = 0;
  let current = 0;
  
  Object.entries(CLIENT_VERSIONS.clients).forEach(([clientId, client]) => {
    if (client.current_version !== VERSION_CONFIG.theme.version) {
      console.log(`⚠️  ${client.theme_name} needs update`);
      console.log(`   Current: ${client.current_version} → Latest: ${VERSION_CONFIG.theme.version}`);
      needsUpdate++;
    } else {
      current++;
    }
  });
  
  console.log(`\n✅ ${current} clients are current`);
  if (needsUpdate > 0) {
    console.log(`🔄 ${needsUpdate} clients need updates`);
  }
}

// Main menu
async function mainMenu() {
  displayThemeInfo();
  
  console.log('\n📌 Main Menu:\n');
  console.log('1. List all client themes');
  console.log('2. Create new client theme');
  console.log('3. Update client theme');
  console.log('4. Check for updates');
  console.log('5. Generate release notes');
  console.log('6. Backup all clients');
  console.log('7. Exit');
  
  const choice = await prompt('\nSelect option (1-7): ');
  
  switch (choice) {
    case '1':
      listClients();
      break;
    case '2':
      await createNewClient();
      break;
    case '3':
      await updateClient();
      break;
    case '4':
      checkForUpdates();
      break;
    case '5':
      generateReleaseNotes();
      break;
    case '6':
      console.log('\n🔄 Running backup script...');
      execSync('node scripts/backup-all-clients.js', { stdio: 'inherit' });
      break;
    case '7':
      rl.close();
      process.exit(0);
    default:
      console.log('❌ Invalid option');
  }
  
  await prompt('\nPress Enter to continue...');
  mainMenu();
}

// Start the application
if (require.main === module) {
  mainMenu().catch(console.error);
}

module.exports = {
  displayThemeInfo,
  listClients,
  checkForUpdates
};