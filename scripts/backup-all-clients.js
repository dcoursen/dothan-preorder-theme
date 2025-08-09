#!/usr/bin/env node
/**
 * Backup all client themes and configurations
 * Usage: node scripts/backup-all-clients.js [--schedule=daily|weekly|manual]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  clientsDir: path.join(__dirname, '../config/clients'),
  backupsDir: path.join(__dirname, '../backups'),
  maxBackups: 30, // Keep last 30 backups
};

/**
 * Get all client configurations
 */
function getClients() {
  if (!fs.existsSync(CONFIG.clientsDir)) {
    console.log('Creating clients directory...');
    fs.mkdirSync(CONFIG.clientsDir, { recursive: true });
    
    // Create example client config
    const exampleClient = {
      client: 'dothan',
      store_url: 'vzgxcj-h9.myshopify.com',
      theme_version: 'horizon-1.0.0',
      customizations: {
        preorder: true,
        custom_footer: true,
        klaviyo_integration: true
      },
      preserved_files: [
        'sections/dothan-footer.liquid',
        'snippets/preorder-logic.liquid',
        'snippets/klaviyo-bis-integration.liquid'
      ]
    };
    
    fs.writeFileSync(
      path.join(CONFIG.clientsDir, 'dothan.json'),
      JSON.stringify(exampleClient, null, 2)
    );
  }

  return fs.readdirSync(CONFIG.clientsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(CONFIG.clientsDir, f))));
}

/**
 * Backup a single client
 */
async function backupClient(client, backupRoot) {
  console.log(`\n📦 Backing up ${client.client}...`);
  
  const clientBackupDir = path.join(backupRoot, client.client);
  fs.mkdirSync(clientBackupDir, { recursive: true });

  try {
    // Check if Shopify CLI is available
    execSync('shopify version', { stdio: 'ignore' });
    
    // Pull theme files
    console.log('  → Pulling theme files...');
    execSync(
      `shopify theme pull --store=${client.store_url} --path=${clientBackupDir}`,
      { stdio: 'inherit' }
    );
  } catch (error) {
    console.log('  ⚠️  Shopify CLI not available, backing up local files only');
    
    // Backup local files for specified preserved files
    if (client.preserved_files) {
      client.preserved_files.forEach(file => {
        const srcPath = path.join(__dirname, '..', file);
        if (fs.existsSync(srcPath)) {
          const destPath = path.join(clientBackupDir, file);
          const destDir = path.dirname(destPath);
          fs.mkdirSync(destDir, { recursive: true });
          fs.copyFileSync(srcPath, destPath);
          console.log(`  → Backed up ${file}`);
        }
      });
    }
  }
  
  // Save client config
  fs.copyFileSync(
    path.join(CONFIG.clientsDir, `${client.client}.json`),
    path.join(clientBackupDir, 'client-config.json')
  );
  
  // Create backup metadata
  const metadata = {
    client: client.client,
    timestamp: new Date().toISOString(),
    theme_version: client.theme_version,
    files_count: fs.readdirSync(clientBackupDir).length
  };
  
  fs.writeFileSync(
    path.join(clientBackupDir, 'backup-metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log(`  ✅ Backup complete for ${client.client}`);
}

/**
 * Clean up old backups
 */
function cleanupOldBackups() {
  console.log('\n🧹 Cleaning up old backups...');
  
  if (!fs.existsSync(CONFIG.backupsDir)) return;
  
  const backups = fs.readdirSync(CONFIG.backupsDir)
    .filter(d => /^\d{4}-\d{2}-\d{2}/.test(d))
    .sort()
    .reverse();
  
  if (backups.length > CONFIG.maxBackups) {
    const toDelete = backups.slice(CONFIG.maxBackups);
    toDelete.forEach(backup => {
      const backupPath = path.join(CONFIG.backupsDir, backup);
      fs.rmSync(backupPath, { recursive: true, force: true });
      console.log(`  → Deleted old backup: ${backup}`);
    });
  }
}

/**
 * Main backup function
 */
async function backupAllClients(options = {}) {
  console.log('🚀 Starting backup process...');
  
  const clients = getClients();
  if (clients.length === 0) {
    console.log('❌ No client configurations found');
    return;
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const backupRoot = path.join(CONFIG.backupsDir, timestamp);
  
  console.log(`📁 Backup directory: ${backupRoot}`);
  fs.mkdirSync(backupRoot, { recursive: true });
  
  // Backup each client
  for (const client of clients) {
    await backupClient(client, backupRoot);
  }
  
  // Create summary
  const summary = {
    timestamp: new Date().toISOString(),
    schedule: options.schedule || 'manual',
    clients_backed_up: clients.length,
    backup_location: backupRoot,
    clients: clients.map(c => c.client)
  };
  
  fs.writeFileSync(
    path.join(backupRoot, 'backup-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  // Cleanup old backups
  cleanupOldBackups();
  
  console.log('\n✅ All backups completed successfully!');
  console.log(`📍 Location: ${backupRoot}`);
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const scheduleArg = args.find(a => a.startsWith('--schedule='));
  const schedule = scheduleArg ? scheduleArg.split('=')[1] : 'manual';
  
  backupAllClients({ schedule }).catch(error => {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  });
}

module.exports = { backupAllClients, backupClient, getClients };