#!/usr/bin/env node
/**
 * Migrate customizations between theme versions
 * Usage: node scripts/migrate-customizations.js --source=branch --target=branch [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  reportsDir: path.join(__dirname, '../reports'),
  migrationsDir: path.join(__dirname, '../migrations'),
  preserveFiles: [
    'config/features.json',
    'config/clients/',
    'CLAUDE.md',
    'WORKFLOW.md',
    'MULTI-CLIENT-WORKFLOW.md',
    'THEME-MANAGEMENT-GUIDE.md'
  ]
};

/**
 * Check if file should be preserved
 */
function shouldPreserveFile(file) {
  return CONFIG.preserveFiles.some(preserve => 
    file.startsWith(preserve) || file === preserve
  );
}

/**
 * Get current branch
 */
function getCurrentBranch() {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
}

/**
 * Safe git checkout with stash
 */
function safeCheckout(branch) {
  const currentBranch = getCurrentBranch();
  
  // Check for uncommitted changes
  const status = execSync('git status --porcelain').toString().trim();
  if (status) {
    console.log('📦 Stashing uncommitted changes...');
    execSync('git stash');
  }
  
  // Checkout branch
  execSync(`git checkout ${branch}`);
  
  return currentBranch;
}

/**
 * Apply customization file
 */
function applyFile(file, sourceBranch, options = {}) {
  const result = {
    file,
    status: 'pending',
    message: '',
    conflicts: false
  };

  try {
    if (options.dryRun) {
      // Just check if file exists in source
      execSync(`git cat-file -e ${sourceBranch}:${file}`, { stdio: 'ignore' });
      result.status = 'would-apply';
      result.message = 'File exists in source branch';
    } else {
      // Actually apply the file
      execSync(`git checkout ${sourceBranch} -- ${file}`);
      result.status = 'applied';
      result.message = 'Successfully migrated';
    }
  } catch (error) {
    if (error.message.includes('pathspec')) {
      result.status = 'not-found';
      result.message = 'File not found in source branch';
    } else {
      result.status = 'error';
      result.message = error.message;
      result.conflicts = true;
    }
  }

  return result;
}

/**
 * Migrate settings and config files
 */
function migrateSettings(sourceBranch, targetBranch, options = {}) {
  console.log('\n📋 Migrating settings and configurations...');
  
  const settingsFiles = [
    'config/settings_data.json',
    'config/settings_schema.json'
  ];
  
  const results = [];
  
  settingsFiles.forEach(file => {
    try {
      // Get source content
      const sourceContent = execSync(`git show ${sourceBranch}:${file}`).toString();
      const targetExists = fs.existsSync(file);
      
      if (targetExists && !options.dryRun) {
        // Merge settings intelligently
        const targetContent = fs.readFileSync(file, 'utf8');
        const merged = mergeSettings(
          JSON.parse(targetContent),
          JSON.parse(sourceContent)
        );
        
        fs.writeFileSync(file, JSON.stringify(merged, null, 2));
        results.push({
          file,
          status: 'merged',
          message: 'Settings merged successfully'
        });
      } else {
        results.push({
          file,
          status: options.dryRun ? 'would-merge' : 'skipped',
          message: 'Target file does not exist'
        });
      }
    } catch (error) {
      results.push({
        file,
        status: 'error',
        message: error.message
      });
    }
  });
  
  return results;
}

/**
 * Merge settings objects intelligently
 */
function mergeSettings(target, source) {
  // This is a simple merge - you might want to make this more sophisticated
  const merged = { ...target };
  
  // Preserve certain keys from source
  const preserveKeys = ['preorder', 'custom_features', 'client_settings'];
  
  preserveKeys.forEach(key => {
    if (source[key]) {
      merged[key] = source[key];
    }
  });
  
  return merged;
}

/**
 * Generate migration report
 */
function generateReport(results, options) {
  const report = {
    timestamp: new Date().toISOString(),
    source: options.source,
    target: options.target,
    dry_run: options.dryRun || false,
    summary: {
      total: results.length,
      successful: results.filter(r => r.status === 'applied' || r.status === 'merged').length,
      failed: results.filter(r => r.status === 'error').length,
      skipped: results.filter(r => r.status === 'skipped' || r.status === 'not-found').length,
      would_apply: results.filter(r => r.status === 'would-apply' || r.status === 'would-merge').length
    },
    details: results
  };
  
  // Save report
  fs.mkdirSync(CONFIG.migrationsDir, { recursive: true });
  const reportPath = path.join(
    CONFIG.migrationsDir,
    `migration-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  return report;
}

/**
 * Main migration function
 */
async function migrateCustomizations(options) {
  console.log('🚀 Starting customization migration...\n');
  
  if (!options.source || !options.target) {
    throw new Error('Both --source and --target branches are required');
  }
  
  console.log(`Source: ${options.source}`);
  console.log(`Target: ${options.target}`);
  console.log(`Mode: ${options.dryRun ? 'DRY RUN' : 'LIVE'}\n`);
  
  // Load customizations report if it exists
  const reportPath = path.join(CONFIG.reportsDir, 'customizations-report.json');
  if (!fs.existsSync(reportPath)) {
    console.log('⚠️  No customizations report found. Run analyze-customizations.js first.');
    return;
  }
  
  const customizations = JSON.parse(fs.readFileSync(reportPath));
  const allFiles = Object.values(customizations).flat();
  
  // Save current branch
  const originalBranch = getCurrentBranch();
  
  try {
    // Switch to target branch
    if (getCurrentBranch() !== options.target) {
      safeCheckout(options.target);
    }
    
    const results = [];
    
    // Process each file
    console.log(`Processing ${allFiles.length} files...\n`);
    
    allFiles.forEach(file => {
      const result = applyFile(file, options.source, options);
      results.push(result);
      
      const icon = result.status === 'applied' ? '✅' : 
                  result.status === 'would-apply' ? '🔄' :
                  result.status === 'error' ? '❌' : '⏭️';
      
      console.log(`${icon} ${file}: ${result.message}`);
    });
    
    // Migrate settings
    const settingsResults = migrateSettings(options.source, options.target, options);
    results.push(...settingsResults);
    
    // Preserve special files
    console.log('\n📁 Preserving special files...');
    CONFIG.preserveFiles.forEach(file => {
      if (shouldPreserveFile(file)) {
        const result = applyFile(file, options.source, options);
        if (result.status === 'applied' || result.status === 'would-apply') {
          results.push(result);
          console.log(`✅ Preserved: ${file}`);
        }
      }
    });
    
    // Generate report
    const report = generateReport(results, options);
    
    // Print summary
    console.log('\n📊 Migration Summary:');
    console.log('─'.repeat(40));
    console.log(`Total files: ${report.summary.total}`);
    console.log(`Successful: ${report.summary.successful}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Skipped: ${report.summary.skipped}`);
    if (options.dryRun) {
      console.log(`Would apply: ${report.summary.would_apply}`);
    }
    
    if (!options.dryRun && report.summary.successful > 0) {
      console.log('\n⚠️  Remember to:');
      console.log('1. Review all changes with: git diff');
      console.log('2. Test the theme thoroughly');
      console.log('3. Commit the changes');
    }
    
    console.log('\n✅ Migration complete!');
    console.log(`📁 Report saved to: ${CONFIG.migrationsDir}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    // Return to original branch if different
    if (getCurrentBranch() !== originalBranch && originalBranch !== options.target) {
      console.log(`\nReturning to branch: ${originalBranch}`);
      execSync(`git checkout ${originalBranch}`);
    }
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const sourceArg = args.find(a => a.startsWith('--source='));
  const targetArg = args.find(a => a.startsWith('--target='));
  const dryRun = args.includes('--dry-run');
  
  if (!sourceArg || !targetArg) {
    console.error('Usage: node migrate-customizations.js --source=branch --target=branch [--dry-run]');
    process.exit(1);
  }
  
  const options = {
    source: sourceArg.split('=')[1],
    target: targetArg.split('=')[1],
    dryRun
  };
  
  migrateCustomizations(options).catch(error => {
    console.error('Migration failed:', error.message);
    process.exit(1);
  });
}

module.exports = { migrateCustomizations, applyFile, migrateSettings };