# Release Management Guide - Retail Savage Preorder Template

## 🎯 Overview

This guide outlines the process for managing releases of the Retail Savage Preorder Template across multiple clients.

## 📋 Pre-Release Checklist

### 1. Code Preparation
- [ ] All features tested and working
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Tests passing (npm test)
- [ ] No console errors
- [ ] Performance benchmarks met

### 2. Version Updates
- [ ] Update version in `config/version.json`
- [ ] Update version in `package.json`
- [ ] Update version in `theme.info`
- [ ] Update CHANGELOG.md
- [ ] Run `node scripts/update-theme-name.js`

### 3. Testing
- [ ] Test on development theme
- [ ] Test on staging theme
- [ ] Test all client customizations
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing complete

## 🚀 Release Process

### Step 1: Create Release Branch
```bash
git checkout feature/base-theme
git pull origin feature/base-theme
git checkout -b release/v1.1.0
```

### Step 2: Update Version Files
```bash
# Update version numbers
node scripts/update-theme-name.js

# Update changelog
code CHANGELOG.md

# Update version.json
code config/version.json
```

### Step 3: Run Pre-Release Tests
```bash
# Run all tests
npm test

# Analyze customizations
node scripts/analyze-customizations.js

# Backup all clients
node scripts/backup-all-clients.js
```

### Step 4: Create Release Commit
```bash
git add .
git commit -m "chore: Release v1.1.0"
```

### Step 5: Merge to Main
```bash
git checkout main
git merge --no-ff release/v1.1.0
git tag -a v1.1.0 -m "Release version 1.1.0: [Brief description]"
git push origin main --tags
```

### Step 6: Merge to Base Theme
```bash
git checkout feature/base-theme
git merge main
git push origin feature/base-theme
```

## 📦 Client Update Process

### 1. Staged Rollout Schedule

**Week 1: Internal Testing**
- Deploy to internal test stores
- Run automated tests
- Performance benchmarking

**Week 2: Beta Clients**
- Deploy to 1-2 willing beta clients
- Monitor for issues
- Gather feedback

**Week 3: General Rollout**
- Deploy to all clients
- Staged by timezone/region

### 2. Update Individual Client

```bash
# Use theme manager
node scripts/theme-manager.js

# Or manually:
git checkout feature/client-{name}
git merge feature/base-theme
# Test thoroughly
git push origin feature/client-{name}

# Deploy to staging
shopify theme push --theme={staging-id} --store={client-store}

# After approval, deploy to production
shopify theme push --theme={production-id} --store={client-store}
```

### 3. Update Tracking

After each client update:
1. Update `config/client-versions.json`
2. Update client's staging theme
3. Schedule production deployment
4. Send update notification

## 📧 Client Communication

### Update Notification Template

```
Subject: Retail Savage Theme Update Available - v{VERSION}

Hi {CLIENT_NAME},

A new version of your Retail Savage theme is now available!

Version: {VERSION}
Release Date: {DATE}

What's New:
- {FEATURE_1}
- {FEATURE_2}
- {BUG_FIX_1}

Your theme will be automatically updated on {SCHEDULED_DATE} during your maintenance window.

If you'd like to preview the changes earlier, please let us know.

Best regards,
Retail Savage Support Team
```

## 🏷️ Version Naming Convention

### Semantic Versioning
- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes

### Codenames
- 1.x.x series: "Genesis"
- 2.x.x series: "Evolution"
- 3.x.x series: "Revolution"

### Git Tags
- Release: `v1.0.0`
- Pre-release: `v1.0.0-beta.1`
- Client-specific: `v1.0.0-dothan`

## 📊 Release Metrics

Track these metrics for each release:
- Deployment success rate
- Client satisfaction scores
- Support tickets generated
- Performance impact
- Adoption rate

## 🚨 Rollback Procedure

If issues arise:

### 1. Immediate Rollback
```bash
# Revert to previous version
shopify theme push --theme={production-id} --path=backups/{last-version}/

# Or use Git
git checkout v{previous-version}
shopify theme push --theme={production-id}
```

### 2. Notify Affected Clients
- Send immediate notification
- Provide ETA for fix
- Offer compensation if applicable

### 3. Post-Mortem
- Document what went wrong
- Update testing procedures
- Implement preventive measures

## 📅 Release Calendar

### Regular Schedule
- **Patch Releases**: As needed (critical fixes)
- **Minor Releases**: Monthly
- **Major Releases**: Quarterly

### Blackout Dates
Avoid releases during:
- Black Friday/Cyber Monday (November)
- Holiday shopping season (Dec 15-31)
- Client-specific busy periods

## 🔧 Automation Tools

### Release Scripts
```bash
# Prepare release
npm run release:prepare

# Create release
npm run release:create

# Deploy to all clients
npm run release:deploy
```

### GitHub Actions
- Automated testing on release branches
- Version validation
- Changelog generation
- Client notification

## 📝 Documentation Updates

For each release, update:
1. CHANGELOG.md
2. README.md (if needed)
3. Client documentation
4. Support documentation
5. API documentation (if applicable)

## 🎯 Success Criteria

A successful release has:
- ✅ 100% of tests passing
- ✅ Zero critical bugs in production
- ✅ All clients updated within schedule
- ✅ Documentation fully updated
- ✅ Client satisfaction maintained

---

Last Updated: 2025-08-09
Version: 1.0.0