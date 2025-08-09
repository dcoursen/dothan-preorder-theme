# Quick Reference Guide

## 🚀 Daily Development

### Start Development
```bash
# Switch to client branch
git checkout feature/client-dothan

# Start dev server
shopify theme dev --store=vzgxcj-h9.myshopify.com
```

### Make Changes
```bash
# Always pull latest base theme
git merge feature/base-theme

# Make your changes
# Test locally

# Commit
git add .
git commit -m "feat(dothan): Add holiday banner"
git push
```

## 📦 Backup Commands

### Quick Backup Current Client
```bash
node scripts/backup-client.js --client=dothan
```

### Backup All Clients
```bash
node scripts/backup-all-clients.js
```

### Restore from Backup
```bash
node scripts/restore-backup.js --client=dothan --date=2024-01-15
```

## 🔄 Shopify Theme Updates

### When Shopify Releases New Theme
```bash
# 1. Backup everything first!
node scripts/backup-all-clients.js

# 2. Analyze current customizations
node scripts/analyze-customizations.js

# 3. Create update branch
git checkout -b feature/horizon-update-v2

# 4. Pull new theme
shopify theme pull --theme={new-theme-id}

# 5. Migrate customizations
node scripts/migrate-customizations.js \
  --source=feature/base-theme \
  --target=feature/horizon-update-v2

# 6. Test thoroughly
shopify theme dev

# 7. Deploy to staging
shopify theme push --theme={staging-theme-id}
```

## 🌿 Branch Management

### Current Structure
```
main
├── feature/base-theme (shared features)
│   ├── feature/client-dothan
│   ├── feature/client-xyz
│   └── feature/client-abc
└── feature/preorder-functionality
```

### Create New Client
```bash
git checkout feature/base-theme
git checkout -b feature/client-newclient
git push -u origin feature/client-newclient
```

## 🛠️ Common Tasks

### Deploy to Production
```bash
# Always test on staging first!
shopify theme push --theme={staging-theme-id}

# After approval
shopify theme push --live
```

### Check Theme Status
```bash
shopify theme list --store={store-url}
```

### Pull Latest Theme Changes
```bash
shopify theme pull
```

### Run Tests
```bash
npm test
```

## ⚠️ Important Files to Preserve

Always backup these during updates:
- `config/settings_data.json` - Theme settings
- `templates/*.json` - Template configurations
- `sections/*-footer.liquid` - Custom sections
- `snippets/preorder-*.liquid` - Preorder features
- `config/clients/*.json` - Client configurations

## 🆘 Emergency Procedures

### Quick Rollback
```bash
# List backups
ls backups/

# Restore from backup
shopify theme push --live --path=backups/2024-01-15/dothan/
```

### Fix Broken Theme
```bash
# Restore template configuration
node scripts/check-and-restore-template.js --include-settings

# Verify theme
node scripts/verify-theme.js --client=dothan
```

## 📞 Support Contacts

- GitHub Issues: https://github.com/dcoursen/dothan-preorder-theme/issues
- Documentation: See THEME-MANAGEMENT-GUIDE.md
- Shopify Partner Support: partners.shopify.com

---

Last Updated: 2025-08-09