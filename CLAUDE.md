# Claude AI Assistant Documentation

This document contains important information for Claude AI to understand and work with this project effectively.

## Project Overview

**Project**: Horizon Preorder Feature for Shopify Theme
**Repository**: https://github.com/dcoursen/dothan-preorder-theme
**Current Branch**: feature/preorder-functionality
**Store URL**: https://vzgxcj-h9.myshopify.com

### Key Features Implemented:
1. **Preorder Date Display**: Shows availability dates for sold-out products
2. **Klaviyo BIS Integration**: "Get Early Access" button for preorder items
3. **Smart Date Formatting**: Shows relative dates (e.g., "This Friday @ 2:00PM EST")
4. **Responsive Design**: Works on mobile, tablet, and desktop
5. **Analytics & Monitoring**: Error tracking and conversion analytics
6. **Feature Flags**: Configurable feature toggles
7. **Automated Deployment**: CI/CD pipeline with GitHub Actions

### Test Products:
- **Preorder Product**: spider-lily-suprise-resurrection-hurricane-red (should be sold out)
- **Regular Product**: spider-lily-surprise-resurrection-hurricane-yellow (should be in stock)
- **Klaviyo Form ID**: WQZSWn

## Testing Infrastructure

### E2E Testing with Puppeteer
We have a comprehensive Puppeteer testing setup for automated browser testing.

#### Test Commands:
```bash
# Run all tests (headless)
npm test

# Run tests with visible browser
npm run test:headed

# Debug tests with Chrome DevTools
npm run test:debug

# Run tests in CI mode
npm run test:ci

# Quick test script
./test-preorder.sh [--headed] [--debug] [--file filename]
```

#### Test Structure:
```
tests/
├── e2e/
│   ├── preorder.test.js           # Basic preorder tests
│   ├── preorder-improved.test.js  # Comprehensive tests
│   ├── shopify-integration.test.js # Theme compatibility tests
│   └── helpers.js                 # Test utilities
├── screenshots/                   # Test screenshots saved here
└── README.md                     # Testing documentation
```

#### Environment Configuration:
Current `.env` file is configured with:
```
SHOPIFY_STORE_URL=https://vzgxcj-h9.myshopify.com
SHOPIFY_STORE_PASSWORD=
PREORDER_PRODUCT=spider-lily-suprise-resurrection-hurricane-red
REGULAR_PRODUCT=spider-lily-surprise-resurrection-hurricane-yellow
KLAVIYO_FORM_ID=WQZSWn
```

## Git Workflow

### Hooks:
- **Pre-commit**: Reminds to test when JS/Liquid files change
- **Pre-push**: Runs full test suite automatically

### GitHub Actions:
- **test.yml**: Runs on push to main and feature/preorder-functionality
  - Tests on Ubuntu with Node.js 18.x and 20.x
  - Uploads screenshots on failure
- **deploy.yml**: Automated deployment to Shopify
  - Deploys only preorder-related files for safety
  - Supports staging and production environments

### Required GitHub Secrets:
- `SHOPIFY_STORE_URL` - Store URL
- `SHOPIFY_STORE_PASSWORD` - Store password (if protected)
- `PREORDER_PRODUCT` - Test preorder product handle
- `REGULAR_PRODUCT` - Test regular product handle
- `SHOPIFY_CLI_THEME_TOKEN` - Shopify CLI token for deployments
- `PRODUCTION_THEME_ID` - Live theme ID
- `STAGING_THEME_ID` - Development theme ID

## File Structure

### Key Files Modified:
- `snippets/preorder-logic.liquid` - Core preorder display logic
- `snippets/klaviyo-bis-integration.liquid` - BIS button integration
- `assets/product-form.js` - Fixed syntax error
- `blocks/buy-buttons.liquid` - Original theme buy buttons

### New Infrastructure Files:
- `config/features.json` - Feature flags and configuration
- `monitoring/error-tracker.js` - Error tracking and reporting
- `analytics/preorder-analytics.js` - Conversion tracking
- `scripts/setup.sh` - Development environment setup
- `.github/workflows/` - CI/CD automation
- `.theme-check.yml` - Shopify theme linting configuration

### CSS Classes:
- `.preorder-date-display` - Preorder date styling
- `.klaviyo-bis-button` - BIS button styling
- `#preorder-bis-container` - Main container

## Development Tips

### Running Tests Before Push:
```bash
# Always run tests before pushing
npm test

# If tests fail, check screenshots
ls tests/screenshots/
```

### Debugging Failed Tests:
1. Run with `--headed` to see browser: `./test-preorder.sh --headed`
2. Check screenshots in `tests/screenshots/`
3. Use `--debug` flag for Chrome DevTools

### Common Issues:
- **Tests timing out**: Increase timeout in jest.config.js
- **Elements not found**: Check selectors match your theme
- **Password protection**: Set SHOPIFY_STORE_PASSWORD in .env

## Important Commands

### Development Workflow:
```bash
# Setup new environment
./scripts/setup.sh

# Local development
npm run dev        # Start Shopify development server
npm run dev:hot    # With hot reload

# Theme management  
npm run pull       # Pull latest theme
npm run push       # Push changes
npm run preview    # Open theme preview

# Testing
npm test          # Run all tests
./test-preorder.sh --headed  # Visual testing
npm run test:ci   # CI mode testing

# Linting and Quality
npm run lint:theme  # Shopify theme check
npm run lint       # Run all linting

# Release management
npm run release:patch  # Bug fixes (1.0.0 → 1.0.1)
npm run release:minor  # New features (1.0.0 → 1.1.0)
npm run release:major  # Breaking changes (1.0.0 → 2.0.0)
```

## Metafields Used

The preorder functionality uses these Shopify metafields:
- `product.metafields.custom.preorder_drop_date` - Drop date/time
- `product.metafields.custom.preorder_pickup_start` - Pickup start date
- `product.metafields.custom.pickup_duration_days` - Pickup duration

## Testing Checklist

When making changes, test:
- [ ] Preorder date displays correctly
- [ ] BIS button replaces sold-out button
- [ ] Mobile responsiveness
- [ ] Variant switching
- [ ] No JavaScript errors
- [ ] Page load performance

## Feature Management

### Feature Flags (config/features.json):
```json
{
  "preorder": {
    "enabled": true,
    "showDebugInfo": false,
    "variants": {
      "dateFormat": "smart",
      "bisButtonStyle": "gradient"
    }
  }
}
```

### Analytics Tracking:
- **Error Monitoring**: monitoring/error-tracker.js
- **Conversion Analytics**: analytics/preorder-analytics.js
- **Performance Metrics**: Built into the system

## Scalability Features

### 1. Automated Deployment
- GitHub Actions deploy on push to main
- Staging and production environments
- Test-first deployment (tests must pass)

### 2. Monitoring & Analytics
- Real-time error tracking
- Conversion funnel analysis
- Performance monitoring
- Business metrics dashboard

### 3. Team Collaboration
- Feature flags for controlled rollouts  
- Comprehensive documentation
- Automated testing pipeline
- Release management with semantic versioning

### 4. Quality Assurance
- Pre-push testing hooks
- Theme Check linting
- Visual regression testing
- Multi-environment testing

## Workflow Documents

- **WORKFLOW.md** - Complete development workflow guide
- **CLAUDE.md** - This file (AI assistant documentation) 
- **tests/README.md** - Testing setup and usage
- **.env.example** - Environment configuration template

## Recent Changes

### Latest Updates (2025-08-08):
- ✅ Added complete scalable workflow infrastructure
- ✅ Implemented feature flags and configuration management
- ✅ Created error tracking and analytics systems
- ✅ Added automated deployment with GitHub Actions
- ✅ Set up Shopify CLI integration for local development
- ✅ Created team collaboration tools and documentation
- ✅ Added release management and semantic versioning
- ✅ Implemented quality assurance pipeline

### Previous Updates:
- Fixed JavaScript syntax error in product-form.js (duplicate code block)
- Set up comprehensive Puppeteer E2E testing
- Added Git hooks for automated testing
- Created initial GitHub Actions workflow

## Next Steps

1. **Configure GitHub Secrets** for automated deployment
2. **Install Shopify CLI** for local development
3. **Run setup script**: `./scripts/setup.sh`
4. **Start development server**: `npm run dev`
5. **Deploy to staging** for testing
6. **Monitor analytics** for business insights

## Theme Configuration Management

### Advanced Backup & Restore System

**Comprehensive Push-to-Staging Workflow**:
The `./push-to-staging.sh` script now includes full backup and restore functionality:

1. **Pre-Push Comprehensive Backup**:
   ```bash
   node scripts/comprehensive-backup.js
   ```
   - Downloads current remote theme settings from Shopify
   - Backs up all local template files
   - Creates timestamped backups of everything
   - Stores in `theme-backups/` directory

2. **Push to Staging**:
   - Commits any uncommitted changes (with user confirmation)
   - Pushes all files to Shopify staging theme

3. **Post-Push Restoration**:
   ```bash
   node scripts/comprehensive-restore.js --include-settings --sync
   ```
   - Restores theme settings from backup
   - Verifies template integrity (bulk pricing, preorder blocks)
   - Syncs restored settings back to Shopify

### Manual Backup/Restore Commands:

**Comprehensive Backup (includes remote settings)**:
```bash
node scripts/comprehensive-backup.js
```

**Comprehensive Restore**:
```bash
# Restore templates and settings, sync to Shopify
node scripts/comprehensive-restore.js --include-settings --sync

# Restore templates only
node scripts/comprehensive-restore.js

# Basic restore (legacy)
node scripts/check-and-restore-template.js --include-settings
```

**Basic Backup (local files only)**:
```bash
node scripts/backup-theme-config.js
```

### Backup Files Created:
- **Remote Settings**: Downloaded from live Shopify theme before each push
- **Product Template**: `templates/product.backup.json` - With all custom blocks
- **Theme Settings**: `theme-backups/settings_data.backup.json` - All customizer settings
- **Settings Schema**: `theme-backups/settings_schema.backup.json` - Settings structure
- **Timestamped Archives**: `theme-backups/*.bak` - Historical backups with timestamps

### Key Features:
- **Automatic**: Runs on every staging push
- **Comprehensive**: Backs up remote settings, not just local files
- **Resilient**: Multiple fallback systems for restoration
- **Verifying**: Checks for missing blocks (bulk pricing, preorder display)
- **Syncing**: Automatically syncs restored settings back to Shopify

**Note to Claude**: 
1. Use `./push-to-staging.sh` for all staging deployments (includes full backup/restore)
2. Run `node scripts/comprehensive-restore.js --include-settings --sync` if user mentions theme reset
3. Check `theme-backups/` directory for timestamped backups if restoration fails

Last updated: 2025-08-27