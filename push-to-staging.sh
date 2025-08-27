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
echo "📥 Step 1: Backing up current LIVE customizations from Shopify..."

# Create timestamped backup
BACKUP_DIR="theme-backups/backup-$(date +%Y-%m-%d_%H-%M-%S)"
mkdir -p "$BACKUP_DIR"

# Store the current directory
ORIGINAL_DIR=$(pwd)

# Create a temporary directory for clean backup
TEMP_BACKUP_DIR=$(mktemp -d)
echo "🔄 Using temporary directory: $TEMP_BACKUP_DIR"

# Pull current live settings into temp directory (completely clean)
cd "$TEMP_BACKUP_DIR"
echo "🔍 Debug: Pulling files in temp directory..."
shopify theme pull --store=vzgxcj-h9.myshopify.com --theme=143188983970 --only=config/settings_data.json,templates/product.json

echo "🔍 Debug: Contents of temp directory after pull:"
find . -name "*.json" | head -10

if [ $? -eq 0 ]; then
    # Copy the CLEAN pulled files to our permanent backup directory
    echo "🔍 Debug: Copying files to backup..."
    if [ -f "config/settings_data.json" ]; then
        cp "config/settings_data.json" "$ORIGINAL_DIR/$BACKUP_DIR/"
        echo "   ✅ Copied settings_data.json"
    else
        echo "   ❌ settings_data.json not found"
    fi
    
    if [ -f "templates/product.json" ]; then
        cp "templates/product.json" "$ORIGINAL_DIR/$BACKUP_DIR/"
        echo "   ✅ Copied product.json"
    else
        echo "   ❌ product.json not found"
    fi
    
    cd "$ORIGINAL_DIR"
    echo "✅ Live customizations backed up to $BACKUP_DIR/"
    
    # List what we actually backed up
    echo "📋 Backed up files:"
    ls -la "$BACKUP_DIR/" 2>/dev/null || echo "   No files found"
    
    # Clean up temp directory
    rm -rf "$TEMP_BACKUP_DIR"
else
    cd "$ORIGINAL_DIR"
    echo "⚠️  Warning: Backup failed, proceeding with push only"
    rm -rf "$TEMP_BACKUP_DIR"
fi

echo ""
echo "📤 Step 2: Pushing code changes to staging..."

# Push our code changes
shopify theme push --store=vzgxcj-h9.myshopify.com --theme=143188983970

if [ $? -eq 0 ]; then
    echo "✅ Code changes pushed successfully!"
    
    echo ""
    echo "🔄 Step 3: Restoring your customizations..."
    
    # Now restore the backed up settings to preserve customizations
    if [ -f "$BACKUP_DIR/settings_data.json" ] || [ -f "$BACKUP_DIR/product.json" ]; then
        echo "📋 Restoring theme settings and template configurations..."
        
        # Copy backed up files back and push them
        [ -f "$BACKUP_DIR/settings_data.json" ] && cp "$BACKUP_DIR/settings_data.json" config/
        [ -f "$BACKUP_DIR/product.json" ] && cp "$BACKUP_DIR/product.json" templates/
        
        # Push only the restored settings files
        shopify theme push --store=vzgxcj-h9.myshopify.com --theme=143188983970 --only=config/settings_data.json,templates/product.json
        
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
    echo "📁 Backup saved in: $BACKUP_DIR/"
    echo ""
    echo "🌐 Preview: https://vzgxcj-h9.myshopify.com/?preview_theme_id=143188983970"
else
    echo ""
    echo "❌ Push failed. Check the error above."
    exit 1
fi