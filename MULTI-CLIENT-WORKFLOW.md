# Multi-Client Theme Development Workflow

## Overview
This guide outlines the workflow for managing a Shopify theme across multiple clients while maintaining a clean, scalable codebase.

## Branch Strategy

### Core Branches
- `main` - Production-ready code
- `feature/base-theme` - Shared features all clients can use
- `develop` - Integration branch for testing

### Client Branches
- `feature/client-{name}` - Client-specific customizations
- Branch from `feature/base-theme`
- Merge back beneficial features

## Development Workflow

### 1. Initial Setup for New Client

```bash
# Start from base theme
git checkout feature/base-theme
git pull origin feature/base-theme

# Create client branch
git checkout -b feature/client-newclient

# Create development theme
shopify theme push --development --store=client-store.myshopify.com
```

### 2. Daily Development

```bash
# Always pull latest base theme changes
git checkout feature/client-name
git merge feature/base-theme

# Work on features
# Test on development theme
shopify theme dev --store=client-store.myshopify.com

# Commit changes
git add .
git commit -m "feat(client-name): Add custom footer"
git push origin feature/client-name
```

### 3. Deploying to Client

```bash
# Deploy to staging/preview theme first
shopify theme push --theme=123456789 --store=client-store.myshopify.com

# After client approval, deploy to live
shopify theme push --live --store=client-store.myshopify.com
```

### 4. Sharing Features Back to Base

```bash
# If a feature would benefit all clients
git checkout feature/base-theme
git cherry-pick <commit-hash>
# OR
git merge feature/client-name --no-ff
```

## File Organization

### Client-Specific Files
```
sections/
├── {client-name}-footer.liquid
├── {client-name}-header.liquid
└── ...

config/
├── settings_data.{client-name}.json
└── ...
```

### Shared Files
- Keep in base theme
- Use settings/blocks for customization
- Avoid hardcoding client data

## Configuration Management

### 1. Environment Variables (.env)
```bash
# .env.client-name
SHOPIFY_STORE_URL=client-store.myshopify.com
SHOPIFY_CLI_THEME_TOKEN=shptka_xxx
THEME_ID=123456789
```

### 2. Client Config Files
```json
// config/clients/dothan.json
{
  "store_name": "Dothan Nurseries",
  "features": {
    "preorder": true,
    "custom_footer": true
  },
  "theme_settings": {
    "colors": {
      "primary": "#2E7D32"
    }
  }
}
```

## Best Practices

### 1. Feature Flags
Use feature flags for client-specific features:
```liquid
{% if settings.enable_custom_footer %}
  {% section 'custom-footer' %}
{% else %}
  {% section 'footer' %}
{% endif %}
```

### 2. Naming Conventions
- Client files: `{client-name}-{feature}.liquid`
- Branches: `feature/client-{name}`
- Commits: `feat(client-name): Description`

### 3. Testing Protocol
1. Test on development theme
2. Deploy to preview/staging
3. Client approval
4. Deploy to production

### 4. Documentation
- Keep client-specific README in their branch
- Document custom features
- Track deployment history

## Common Commands

```bash
# Switch between clients
git checkout feature/client-dothan
shopify theme dev --store=dothan.myshopify.com

# Update base theme
git checkout feature/base-theme
git merge main

# Deploy to specific theme
shopify theme push --theme=123456789

# Pull theme changes
shopify theme pull --theme=123456789

# List themes
shopify theme list --store=client-store.myshopify.com
```

## Maintenance Schedule

### Weekly
- Merge `main` → `base-theme`
- Update client branches with base changes

### Monthly
- Review shared features
- Clean up old development themes
- Update documentation

### Per Release
- Tag versions: `v1.0.0-client-name`
- Update change logs
- Backup theme settings

## Troubleshooting

### Merge Conflicts
1. Always resolve in favor of client customizations
2. Test thoroughly after resolution
3. Document conflict resolutions

### Theme Drift
- Use `shopify theme pull` to sync
- Compare with git version
- Reconcile differences

### Performance
- Monitor theme size
- Remove unused code per client
- Optimize assets per store

## Security

### Access Control
- Use Shopify Partner account
- Separate CLI tokens per client
- Never commit tokens

### Code Reviews
- PR required for base theme
- Client approval for their branch
- Security scan before deploy