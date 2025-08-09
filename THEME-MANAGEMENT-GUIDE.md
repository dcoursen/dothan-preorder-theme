# Complete Theme Management Guide

## Table of Contents
1. [Initial Setup Process](#initial-setup-process)
2. [Shopify Theme Update Process](#shopify-theme-update-process)
3. [Client Configuration Management](#client-configuration-management)
4. [Backup and Recovery](#backup-and-recovery)
5. [Migration Checklist](#migration-checklist)
6. [Automation Scripts](#automation-scripts)

---

## Initial Setup Process

### Prerequisites
- Git installed
- Shopify CLI installed
- GitHub account with repository access
- Shopify Partner account or store access

### Step 1: Clone and Setup Repository

```bash
# Clone the repository
git clone https://github.com/dcoursen/dothan-preorder-theme.git
cd dothan-preorder-theme

# Install dependencies
npm install

# Run setup script
./scripts/setup.sh
```

### Step 2: Create Branch Structure

```bash
# Start from main branch
git checkout main
git pull origin main

# Create base theme branch
git checkout -b feature/base-theme

# Create client-specific branch
git checkout -b feature/client-{clientname}

# Push branches to GitHub
git push -u origin feature/base-theme
git push -u origin feature/client-{clientname}
```

### Step 3: Setup Development Theme

```bash
# List existing themes
shopify theme list --store={store-url}

# Create or push to development theme
shopify theme push --development --store={store-url}

# Start development server
shopify theme dev --store={store-url}
```

---

## Shopify Theme Update Process

### CRITICAL: Preserving Client Customizations During Updates

When Shopify releases a new Horizon theme version, follow this process to update without losing customizations:

### 1. Backup Everything First

```bash
# Run the comprehensive backup script
node scripts/backup-all-clients.js

# This creates:
# - backups/YYYY-MM-DD/client-name/
#   ├── settings_data.json
#   ├── templates/
#   ├── sections/
#   ├── config/
#   └── custom-files.json
```

### 2. Download New Horizon Theme

```bash
# Create a temporary branch for the new theme
git checkout main
git checkout -b temp/horizon-update-{version}

# Download latest Horizon theme
shopify theme pull --theme={new-horizon-theme-id} --store={shopify-store}

# Commit the vanilla theme
git add .
git commit -m "chore: Horizon theme {version} - vanilla"
```

### 3. Identify Customizations

```bash
# Run diff analysis
node scripts/analyze-customizations.js

# This generates:
# - reports/customizations-report.json
# - reports/conflicts-analysis.json
# - reports/safe-to-merge.json
```

### 4. Create Update Branch

```bash
# Create update branch from main
git checkout main
git checkout -b feature/horizon-update-{version}

# Merge new theme preserving customizations
git merge temp/horizon-update-{version} --strategy=ours

# Selectively apply updates
node scripts/selective-merge.js
```

### 5. Apply Customizations to New Theme

```bash
# Run the migration script
node scripts/migrate-customizations.js \
  --source=feature/base-theme \
  --target=feature/horizon-update-{version} \
  --report=reports/customizations-report.json
```

### 6. Test Each Client

```bash
# For each client, create test branch
git checkout feature/horizon-update-{version}
git checkout -b test/client-{name}-update

# Apply client-specific customizations
node scripts/apply-client-config.js --client={name}

# Deploy to test theme
shopify theme push --theme={test-theme-id} --store={client-store}
```

---

## Client Configuration Management

### Configuration Structure

```
config/
├── clients/
│   ├── dothan.json           # Client-specific settings
│   ├── client2.json
│   └── client3.json
├── features.json              # Feature flags
└── theme-versions.json        # Track theme versions
```

### Client Configuration File Format

```json
{
  "client": "dothan",
  "store_url": "vzgxcj-h9.myshopify.com",
  "theme_version": "horizon-1.0.0",
  "customizations": {
    "preorder": true,
    "custom_footer": true,
    "klaviyo_integration": true
  },
  "preserved_files": [
    "sections/dothan-footer.liquid",
    "snippets/preorder-logic.liquid",
    "snippets/klaviyo-bis-integration.liquid"
  ],
  "settings_overrides": {
    "colors": {
      "primary": "#2E7D32"
    },
    "typography": {
      "heading_font": "assistant_n4"
    }
  },
  "template_customizations": {
    "product": {
      "blocks": {
        "pickup-date": {
          "type": "pickup-date",
          "settings": {}
        }
      }
    }
  }
}
```

### Tracking Customizations

```bash
# Before making changes, document them
node scripts/document-customization.js \
  --client=dothan \
  --type=feature \
  --description="Add preorder functionality" \
  --files="snippets/preorder-logic.liquid,assets/preorder.js"
```

---

## Backup and Recovery

### Automated Backup System

#### 1. Pre-Push Backups (Already Implemented)

```bash
# Automatically runs on git push
# See .husky/pre-push
node scripts/backup-theme-config.js --pre-push
```

#### 2. Scheduled Backups

```bash
# Add to cron or GitHub Actions
# Daily backups of all client themes
node scripts/backup-all-clients.js --schedule=daily
```

#### 3. Manual Backup

```bash
# Backup specific client
node scripts/backup-client.js --client=dothan

# Backup all clients
node scripts/backup-all-clients.js
```

### Recovery Process

```bash
# List available backups
node scripts/list-backups.js --client=dothan

# Restore from backup
node scripts/restore-backup.js \
  --client=dothan \
  --date=2024-01-15 \
  --type=full  # or 'settings' or 'templates'

# Verify restoration
node scripts/verify-theme.js --client=dothan
```

---

## Migration Checklist

### Before Updating Themes

- [ ] Run full backup of all clients
- [ ] Document all customizations
- [ ] Create test themes for each client
- [ ] Review Shopify's changelog
- [ ] Test in development environment

### During Update

- [ ] Create temporary branch for new theme
- [ ] Run customization analysis
- [ ] Apply base theme updates
- [ ] Test core functionality
- [ ] Apply client customizations
- [ ] Run automated tests

### After Update

- [ ] Verify all features work
- [ ] Check responsive design
- [ ] Test checkout process
- [ ] Validate customizations
- [ ] Update documentation
- [ ] Tag release version
- [ ] Deploy to staging first
- [ ] Get client approval
- [ ] Deploy to production
- [ ] Monitor for issues

---

## Automation Scripts

### 1. backup-all-clients.js

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Script to backup all client configurations
async function backupAllClients() {
  const clientsDir = path.join(__dirname, '../config/clients');
  const clients = fs.readdirSync(clientsDir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(clientsDir, f))));

  const timestamp = new Date().toISOString().split('T')[0];
  const backupDir = path.join(__dirname, '../backups', timestamp);

  for (const client of clients) {
    console.log(`Backing up ${client.client}...`);
    
    const clientBackupDir = path.join(backupDir, client.client);
    fs.mkdirSync(clientBackupDir, { recursive: true });

    // Pull theme files
    execSync(`shopify theme pull --store=${client.store_url} --path=${clientBackupDir}`);
    
    // Save client config
    fs.copyFileSync(
      path.join(clientsDir, `${client.client}.json`),
      path.join(clientBackupDir, 'client-config.json')
    );
  }
  
  console.log(`✅ All clients backed up to ${backupDir}`);
}

if (require.main === module) {
  backupAllClients().catch(console.error);
}

module.exports = { backupAllClients };
```

### 2. analyze-customizations.js

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function analyzeCustomizations() {
  console.log('Analyzing customizations...');
  
  // Get list of modified files
  const modifiedFiles = execSync('git diff --name-only main feature/base-theme')
    .toString()
    .trim()
    .split('\n');

  // Categorize changes
  const customizations = {
    sections: [],
    snippets: [],
    assets: [],
    templates: [],
    config: [],
    other: []
  };

  modifiedFiles.forEach(file => {
    if (file.startsWith('sections/')) customizations.sections.push(file);
    else if (file.startsWith('snippets/')) customizations.snippets.push(file);
    else if (file.startsWith('assets/')) customizations.assets.push(file);
    else if (file.startsWith('templates/')) customizations.templates.push(file);
    else if (file.startsWith('config/')) customizations.config.push(file);
    else customizations.other.push(file);
  });

  // Save report
  const reportDir = path.join(__dirname, '../reports');
  fs.mkdirSync(reportDir, { recursive: true });
  
  fs.writeFileSync(
    path.join(reportDir, 'customizations-report.json'),
    JSON.stringify(customizations, null, 2)
  );

  console.log('✅ Customization analysis complete');
  return customizations;
}

if (require.main === module) {
  analyzeCustomizations();
}

module.exports = { analyzeCustomizations };
```

### 3. migrate-customizations.js

```javascript
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function migrateCustomizations(source, target, reportPath) {
  console.log(`Migrating customizations from ${source} to ${target}...`);
  
  const report = JSON.parse(fs.readFileSync(reportPath));
  
  // Switch to target branch
  execSync(`git checkout ${target}`);
  
  // Apply each customization
  Object.entries(report).forEach(([category, files]) => {
    files.forEach(file => {
      try {
        // Check if file exists in source
        execSync(`git checkout ${source} -- ${file}`);
        console.log(`✅ Migrated: ${file}`);
      } catch (error) {
        console.log(`⚠️  Conflict or missing: ${file}`);
      }
    });
  });
  
  console.log('✅ Migration complete - review and test changes');
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const source = args.find(a => a.startsWith('--source=')).split('=')[1];
  const target = args.find(a => a.startsWith('--target=')).split('=')[1];
  const report = args.find(a => a.startsWith('--report=')).split('=')[1];
  
  migrateCustomizations(source, target, report);
}

module.exports = { migrateCustomizations };
```

---

## Important Notes

### Version Control Strategy

1. **Never commit directly to main** - Always use feature branches
2. **Tag releases** - Use semantic versioning (v1.0.0-clientname)
3. **Document breaking changes** - Keep CHANGELOG.md updated

### Testing Protocol

1. **Automated tests** - Run before every deployment
2. **Manual testing** - Use checklist for critical features
3. **Client approval** - Always get sign-off before production deployment

### Emergency Rollback

```bash
# Quick rollback to previous version
shopify theme push --theme={production-theme-id} --path=backups/{date}/{client}/

# Or use Git
git checkout {last-stable-tag}
shopify theme push --live
```

### Monitoring

- Set up error tracking (Sentry, Rollbar)
- Monitor theme performance
- Track conversion metrics
- Regular backup verification

---

## Support and Troubleshooting

### Common Issues

1. **Merge Conflicts**
   - Always resolve in favor of customizations
   - Test thoroughly after resolution
   - Document resolution in PR

2. **Missing Features After Update**
   - Check customizations-report.json
   - Verify file migrations
   - Review client-config.json

3. **Performance Issues**
   - Run theme inspector
   - Check asset sizes
   - Review liquid complexity

### Getting Help

- Internal documentation: `/docs`
- Shopify Partner Support
- GitHub Issues
- Team Slack channel

---

Last Updated: 2025-08-09
Version: 1.0.0