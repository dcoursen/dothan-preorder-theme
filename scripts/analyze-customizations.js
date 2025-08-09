#!/usr/bin/env node
/**
 * Analyze theme customizations and generate reports
 * Usage: node scripts/analyze-customizations.js [--base=branch] [--target=branch]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  reportsDir: path.join(__dirname, '../reports'),
  ignorePaths: [
    'node_modules',
    '.git',
    'package-lock.json',
    '.env',
    'backups/',
    'reports/'
  ]
};

/**
 * Get current git branch
 */
function getCurrentBranch() {
  return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
}

/**
 * Get modified files between branches
 */
function getModifiedFiles(baseBranch, targetBranch) {
  try {
    const command = `git diff --name-only ${baseBranch}...${targetBranch}`;
    return execSync(command)
      .toString()
      .trim()
      .split('\n')
      .filter(file => file && !CONFIG.ignorePaths.some(ignore => file.includes(ignore)));
  } catch (error) {
    console.error(`Error comparing branches: ${error.message}`);
    return [];
  }
}

/**
 * Analyze file changes and categorize them
 */
function categorizeChanges(files) {
  const categories = {
    sections: [],
    snippets: [],
    assets: [],
    templates: [],
    config: [],
    locales: [],
    layout: [],
    blocks: [],
    custom: [],
    other: []
  };

  files.forEach(file => {
    if (file.startsWith('sections/')) categories.sections.push(file);
    else if (file.startsWith('snippets/')) categories.snippets.push(file);
    else if (file.startsWith('assets/')) categories.assets.push(file);
    else if (file.startsWith('templates/')) categories.templates.push(file);
    else if (file.startsWith('config/')) categories.config.push(file);
    else if (file.startsWith('locales/')) categories.locales.push(file);
    else if (file.startsWith('layout/')) categories.layout.push(file);
    else if (file.startsWith('blocks/')) categories.blocks.push(file);
    else if (file.includes('preorder') || file.includes('klaviyo') || file.includes('custom')) {
      categories.custom.push(file);
    }
    else categories.other.push(file);
  });

  return categories;
}

/**
 * Analyze potential conflicts
 */
function analyzeConflicts(baseBranch, targetBranch, files) {
  const conflicts = {
    high_risk: [],    // Core theme files modified
    medium_risk: [],  // Shared components modified
    low_risk: [],     // Isolated customizations
    safe: []          // New files only
  };

  files.forEach(file => {
    try {
      // Check if file exists in base branch
      execSync(`git cat-file -e ${baseBranch}:${file}`, { stdio: 'ignore' });
      
      // File exists in base, check if it's a core file
      if (file.startsWith('layout/') || file === 'config/settings_schema.json') {
        conflicts.high_risk.push({
          file,
          reason: 'Core theme file modified',
          action: 'Manual review required'
        });
      } else if (file.startsWith('sections/') || file.startsWith('blocks/')) {
        conflicts.medium_risk.push({
          file,
          reason: 'Shared component modified',
          action: 'Test thoroughly after merge'
        });
      } else {
        conflicts.low_risk.push({
          file,
          reason: 'Isolated customization',
          action: 'Should merge cleanly'
        });
      }
    } catch (error) {
      // File doesn't exist in base branch, it's new
      conflicts.safe.push({
        file,
        reason: 'New file',
        action: 'Safe to add'
      });
    }
  });

  return conflicts;
}

/**
 * Generate customization documentation
 */
function generateDocumentation(categories, conflicts) {
  const documentation = {
    generated_at: new Date().toISOString(),
    summary: {
      total_customizations: Object.values(categories).flat().length,
      by_category: Object.entries(categories).map(([cat, files]) => ({
        category: cat,
        count: files.length
      })).filter(c => c.count > 0)
    },
    customizations: categories,
    risk_analysis: {
      high_risk_count: conflicts.high_risk.length,
      medium_risk_count: conflicts.medium_risk.length,
      low_risk_count: conflicts.low_risk.length,
      safe_count: conflicts.safe.length
    },
    recommendations: []
  };

  // Add recommendations based on analysis
  if (conflicts.high_risk.length > 0) {
    documentation.recommendations.push({
      priority: 'HIGH',
      message: 'Review core theme file modifications carefully',
      files: conflicts.high_risk.map(c => c.file)
    });
  }

  if (categories.custom.length > 0) {
    documentation.recommendations.push({
      priority: 'MEDIUM',
      message: 'Document custom features for future updates',
      files: categories.custom
    });
  }

  return documentation;
}

/**
 * Main analysis function
 */
async function analyzeCustomizations(options = {}) {
  console.log('🔍 Analyzing theme customizations...\n');

  const baseBranch = options.base || 'main';
  const targetBranch = options.target || getCurrentBranch();

  console.log(`Base branch: ${baseBranch}`);
  console.log(`Target branch: ${targetBranch}\n`);

  // Get modified files
  const modifiedFiles = getModifiedFiles(baseBranch, targetBranch);
  
  if (modifiedFiles.length === 0) {
    console.log('✅ No customizations found');
    return;
  }

  console.log(`Found ${modifiedFiles.length} modified files\n`);

  // Categorize changes
  const categories = categorizeChanges(modifiedFiles);
  
  // Analyze conflicts
  const conflicts = analyzeConflicts(baseBranch, targetBranch, modifiedFiles);
  
  // Generate documentation
  const documentation = generateDocumentation(categories, conflicts);
  
  // Create reports directory
  fs.mkdirSync(CONFIG.reportsDir, { recursive: true });
  
  // Save detailed reports
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Customizations report
  fs.writeFileSync(
    path.join(CONFIG.reportsDir, 'customizations-report.json'),
    JSON.stringify(categories, null, 2)
  );
  
  // Conflicts analysis
  fs.writeFileSync(
    path.join(CONFIG.reportsDir, 'conflicts-analysis.json'),
    JSON.stringify(conflicts, null, 2)
  );
  
  // Safe to merge files
  fs.writeFileSync(
    path.join(CONFIG.reportsDir, 'safe-to-merge.json'),
    JSON.stringify(conflicts.safe.map(c => c.file), null, 2)
  );
  
  // Complete documentation
  fs.writeFileSync(
    path.join(CONFIG.reportsDir, `analysis-${timestamp}.json`),
    JSON.stringify(documentation, null, 2)
  );

  // Print summary
  console.log('📊 Analysis Summary:');
  console.log('─'.repeat(40));
  Object.entries(categories).forEach(([category, files]) => {
    if (files.length > 0) {
      console.log(`${category}: ${files.length} files`);
    }
  });
  
  console.log('\n⚠️  Risk Analysis:');
  console.log('─'.repeat(40));
  console.log(`High Risk: ${conflicts.high_risk.length} files`);
  console.log(`Medium Risk: ${conflicts.medium_risk.length} files`);
  console.log(`Low Risk: ${conflicts.low_risk.length} files`);
  console.log(`Safe: ${conflicts.safe.length} files`);
  
  if (documentation.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    console.log('─'.repeat(40));
    documentation.recommendations.forEach(rec => {
      console.log(`[${rec.priority}] ${rec.message}`);
    });
  }
  
  console.log('\n✅ Analysis complete!');
  console.log(`📁 Reports saved to: ${CONFIG.reportsDir}`);
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const baseArg = args.find(a => a.startsWith('--base='));
  const targetArg = args.find(a => a.startsWith('--target='));
  
  const options = {
    base: baseArg ? baseArg.split('=')[1] : undefined,
    target: targetArg ? targetArg.split('=')[1] : undefined
  };
  
  analyzeCustomizations(options).catch(error => {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  });
}

module.exports = { analyzeCustomizations, categorizeChanges, analyzeConflicts };