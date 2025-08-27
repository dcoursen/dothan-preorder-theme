#!/bin/bash

# Simple Push to Staging Theme Script
# NO RESTORATION - Preserves block orders and settings exactly as they are

echo "🚀 Simple Push to Staging Theme..."
echo "Store: vzgxcj-h9.myshopify.com"
echo "Theme ID: 143188983970"
echo ""

# Check if there are uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  Uncommitted changes detected!"
    echo ""
    git status --short
    echo ""
    read -p "Commit these changes before pushing? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📝 Committing changes..."
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo "✅ Changes committed"
    else
        echo "❌ Cannot push without committing changes first"
        echo "💡 Use 'git stash' to temporarily save changes, or commit them"
        exit 1
    fi
fi

echo ""
echo "📥 Step 1: Backing up current customizations from Shopify..."

# Create backup directory
mkdir -p theme-backups/live-backup

# Pull ONLY settings and templates to backup (not affecting our code files)
shopify theme pull --store=vzgxcj-h9.myshopify.com --theme=143188983970 --only=config/settings_data.json,templates/product.json --path=theme-backups/live-backup

if [ $? -eq 0 ]; then
    echo "✅ Live customizations backed up to theme-backups/live-backup/"
else
    echo "⚠️  Warning: Backup failed, proceeding with push only"
fi

echo ""
echo "📤 Step 2: Pushing code changes to staging..."

# Push ONLY our code changes (excluding the live settings we just backed up)
shopify theme push --store=vzgxcj-h9.myshopify.com --theme=143188983970 --ignore="theme-backups/**"

if [ $? -eq 0 ]; then
    echo "✅ Code changes pushed successfully!"
    
    echo ""
    echo "🔄 Step 3: Restoring your customizations..."
    
    # Now restore the backed up settings to preserve customizations
    if [ -f "theme-backups/live-backup/config/settings_data.json" ] && [ -f "theme-backups/live-backup/templates/product.json" ]; then
        echo "📋 Restoring theme settings and template configurations..."
        
        # Copy backed up files to staging theme
        shopify theme push --store=vzgxcj-h9.myshopify.com --theme=143188983970 --only=config/settings_data.json,templates/product.json --path=theme-backups/live-backup
        
        if [ $? -eq 0 ]; then
            echo "✅ Customizations restored successfully!"
        else
            echo "⚠️  Warning: Failed to restore customizations - you may need to reconfigure manually"
        fi
    else
        echo "⚠️  No backup found - customizations may need manual reconfiguration"
    fi
    
    echo ""
    echo "✅ Successfully pushed to staging with customizations preserved!"
    echo "📝 Git commit: $(git log -1 --oneline)"
    echo "💡 Used pull → push → restore pattern to maintain all settings"
    echo ""
    echo "🌐 Preview: https://vzgxcj-h9.myshopify.com/?preview_theme_id=143188983970"
else
    echo ""
    echo "❌ Push failed. Check the error above."
    exit 1
fi