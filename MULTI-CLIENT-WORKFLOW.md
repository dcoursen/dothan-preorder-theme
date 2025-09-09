# Multi-Client Theme Development Workflow

## Overview
This guide outlines the workflow for managing the Horizons preorder theme across multiple clients while preserving each client's unique settings and scaling efficiently.

## Core Philosophy
- **Single Development Environment**: Dothan Nurseries staging theme serves as primary development environment
- **Code-Only Deployments**: Push only theme code to preserve client-specific settings
- **Never Touch Live Themes**: Always deploy to staging, clients manually publish when ready
- **Settings Preservation**: Each client maintains their own colors, content, and configurations

## Branch Strategy

### Simplified Branching
- `main` - Stable production code
- `feature/preorder-functionality` - Primary development branch (current)
- `production-v1.x` - Tagged releases for deployment
- `hotfix/*` - Emergency fixes only

**No client-specific branches needed** - all clients use the same codebase with their own settings.

## Development Workflow

### 1. Primary Development (Dothan Staging)

```bash
# Continue normal development on Dothan
cd horizon-preorder-feature
git checkout feature/preorder-functionality

# Make changes locally
# Test changes
git add .
git commit -m "feat: Add new preorder feature"

# Deploy to Dothan staging for testing
shopify theme push --store=dothan-nurseries --development

# Test with real products and settings
# Iterate until feature is complete
```

### 2. Preparing for Client Rollout

```bash
# When feature is ready, merge to main
git checkout main
git merge feature/preorder-functionality
git tag v1.1.0
git push origin main --tags

# Or create production branch
git checkout -b production-v1.1
git push origin production-v1.1
```

### 3. Deploying to Client Staging (Code-Only)

```bash
# Deploy ONLY code files to preserve client settings
shopify theme push --store=client-name --development \
  --only=templates,snippets,assets,sections,blocks,locales

# This preserves:
# - Client's color schemes
# - Their product collections
# - Their custom content
# - Their theme settings
```

### 4. Client Review & Go-Live Process

1. **Client reviews staging theme** with their content/settings intact
2. **Client approves changes** 
3. **Client manually publishes staging → live** in their Shopify admin
4. **Never push directly to live themes**

## File Structure for Multi-Client

### Code Files (Deployed to All Clients)
```
templates/          # Theme structure
snippets/          # Including preorder-logic.liquid
assets/            # CSS, JS, images
sections/          # Reusable sections
blocks/            # Content blocks
locales/           # Language files
```

### Client-Specific (Preserved Locally in Each Store)
```
config/settings_data.json    # Colors, fonts, layout settings
config/settings_schema.json  # Theme customization options
Content collections          # Products, pages, blog posts
Metafield configurations     # Preorder drop dates, custom fields
```

## Development Commands

### Daily Development
```bash
# Work on Dothan staging
cd horizon-preorder-feature
shopify theme dev --store=dothan-nurseries

# Make changes, test, commit
git add .
git commit -m "feat: Update preorder display logic"
shopify theme push --store=dothan-nurseries --development
```

### Client Deployments
```bash
# Deploy code updates to client staging
shopify theme push --store=client-abc --development \
  --only=templates,snippets,assets,sections,blocks,locales

# Check deployment
shopify theme list --store=client-abc
```

### Emergency Hotfixes
```bash
# Quick fix for all clients
git checkout -b hotfix/urgent-preorder-fix
# Make fix
git checkout main
git merge hotfix/urgent-preorder-fix
git tag v1.1.1

# Deploy to all client staging themes
./deploy-to-all-clients.sh
```

## Client Management

### Adding New Client
1. **Set up client's Shopify store access**
2. **Deploy current production version to their staging**
3. **Client customizes their settings** (colors, content, etc.)
4. **Client publishes when ready**

### Ongoing Client Updates
1. **Develop new features on Dothan staging**
2. **Deploy code-only to client staging themes**
3. **Clients test with their settings intact**
4. **Clients publish individually when ready**

## Settings Preservation Strategy

### What Gets Deployed (Code)
- ✅ Liquid templates and logic
- ✅ CSS and JavaScript
- ✅ Theme functionality
- ✅ Preorder features

### What Stays Client-Specific (Settings)
- ❌ Color schemes and branding
- ❌ Product collections and content
- ❌ Custom text and images
- ❌ Layout preferences
- ❌ Metafield data

## Best Practices

### 1. Feature Development
- Always test on Dothan staging first
- Use real products for preorder testing
- Ensure features work with different settings

### 2. Client Communication
- Notify clients before staging deployments
- Provide feature summaries
- Set expectations for testing timeline

### 3. Version Control
- Tag all releases (v1.0, v1.1, etc.)
- Document breaking changes
- Maintain changelog

### 4. Quality Assurance
- Test preorder functionality on each client staging
- Verify no settings are overwritten
- Check mobile responsiveness

## Scaling Considerations

### For 5-10 Clients
- Current workflow scales perfectly
- Consider deployment scripts for efficiency
- Monitor staging theme limits per store

### For 10+ Clients
- Create automated deployment scripts
- Implement client notification system
- Consider Shopify Plus features

## Emergency Procedures

### If Client Settings Get Overwritten
1. **Don't panic** - Shopify keeps theme backups
2. **Restore from backup** in client's admin
3. **Re-deploy code-only** with correct flags
4. **Document incident** for prevention

### If Live Theme Breaks
1. **Client can revert** to previous theme
2. **Fix on staging** theme
3. **Test thoroughly** before re-publishing
4. **Never push directly to live**

## Deployment Scripts

### deploy-to-client.sh
```bash
#!/bin/bash
CLIENT_STORE=$1
echo "Deploying code-only to $CLIENT_STORE staging..."
shopify theme push --store=$CLIENT_STORE --development \
  --only=templates,snippets,assets,sections,blocks,locales
echo "Deployment complete. Client can review staging theme."
```

### deploy-to-all-clients.sh
```bash
#!/bin/bash
# Add all client stores to this list
CLIENTS=("client-a" "client-b" "client-c" "dothan-nurseries")

for client in "${CLIENTS[@]}"; do
  echo "Deploying to $client..."
  ./deploy-to-client.sh $client
  sleep 2
done
```

## Troubleshooting

### Common Issues
1. **Settings overwritten**: Use `--only` flag correctly
2. **Staging theme not found**: Check theme ID with `shopify theme list`
3. **Access denied**: Verify store permissions and CLI tokens

### Recovery Procedures
- Always test deployment on one client first
- Keep local backups of working code
- Document all client-specific customizations

## Success Metrics
- ✅ Zero client settings overwritten
- ✅ All clients maintain their branding
- ✅ Preorder functionality works across all stores
- ✅ Fast deployment to multiple clients
- ✅ Clean rollback capabilities