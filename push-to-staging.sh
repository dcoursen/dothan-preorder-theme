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

# Backup current local files first (in case pull overwrites them)
echo "💾 Backing up current local files..."
[ -f "config/settings_data.json" ] && cp "config/settings_data.json" "config/settings_data.local.backup"
[ -f "templates/product.json" ] && cp "templates/product.json" "templates/product.local.backup"

# Add delay to ensure Shopify has processed any recent changes
echo "⏳ Waiting 5 seconds to ensure Shopify has processed recent changes..."
sleep 5

# Attempt to pull current live settings with multiple retries
echo "🔄 Pulling current live settings from Shopify (with retries)..."

# Function to attempt pull with retries
attempt_pull() {
    local attempt=1
    local max_attempts=3
    
    while [ $attempt -le $max_attempts ]; do
        echo "   Attempt $attempt/$max_attempts..."
        
        # Remove local files to force fresh download
        rm -f config/settings_data.json templates/product.json
        
        # Try the pull
        if shopify theme pull --store=vzgxcj-h9.myshopify.com --theme=143188983970 --only=config/settings_data.json,templates/product.json --force; then
            # Check if files were actually created
            if [ -f "config/settings_data.json" ] && [ -f "templates/product.json" ]; then
                echo "   ✅ Pull successful on attempt $attempt"
                return 0
            else
                echo "   ❌ Pull reported success but files not found"
            fi
        else
            echo "   ❌ Pull failed on attempt $attempt"
        fi
        
        if [ $attempt -lt $max_attempts ]; then
            echo "   ⏳ Waiting 3 seconds before retry..."
            sleep 3
        fi
        
        attempt=$((attempt + 1))
    done
    
    echo "   ❌ All pull attempts failed"
    return 1
}

# Attempt the pull
if attempt_pull; then
    # Verify we got fresh data by checking file timestamps
    echo "🔍 Verifying pulled files are fresh:"
    echo "   settings_data.json: $(stat -f '%Sm' config/settings_data.json 2>/dev/null || echo 'NOT FOUND')"
    echo "   product.json: $(stat -f '%Sm' templates/product.json 2>/dev/null || echo 'NOT FOUND')"
    PULL_SUCCESS=true
else
    echo "⚠️  CRITICAL: Unable to backup live settings after multiple attempts!"
    echo "   This deployment will NOT preserve your recent changes."
    echo "   Your settings changes may be lost."
    echo ""
    read -p "   Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled to protect your settings."
        exit 1
    fi
    PULL_SUCCESS=false
fi

if [ $? -eq 0 ]; then
    # Copy the pulled files to our backup directory
    echo "🔍 Copying pulled files to permanent backup..."
    if [ -f "config/settings_data.json" ]; then
        cp "config/settings_data.json" "$BACKUP_DIR/"
        echo "   ✅ Backed up settings_data.json"
    else
        echo "   ❌ settings_data.json not found after pull"
    fi
    
    if [ -f "templates/product.json" ]; then
        cp "templates/product.json" "$BACKUP_DIR/"
        echo "   ✅ Backed up product.json"
    else
        echo "   ❌ product.json not found after pull"
    fi
    
    # Restore local files for the code push
    echo "🔄 Restoring local files for code push..."
    [ -f "config/settings_data.local.backup" ] && mv "config/settings_data.local.backup" "config/settings_data.json"
    [ -f "templates/product.local.backup" ] && mv "templates/product.local.backup" "templates/product.json"
    
    echo "✅ Live customizations backed up to $BACKUP_DIR/"
    
    # List what we actually backed up
    echo "📋 Backed up files:"
    ls -la "$BACKUP_DIR/" 2>/dev/null || echo "   No files found"
else
    echo "⚠️  Warning: Backup failed, proceeding with push only"
    # Restore local backups if pull failed
    [ -f "config/settings_data.local.backup" ] && mv "config/settings_data.local.backup" "config/settings_data.json"
    [ -f "templates/product.local.backup" ] && mv "templates/product.local.backup" "templates/product.json"
fi

echo ""
echo "📤 Step 2: Pushing code changes (excluding config files that might overwrite customizations)..."

# Push our code changes but exclude the configuration files that contain customizations
# This way we don't overwrite the user's live theme customizations
shopify theme push --store=vzgxcj-h9.myshopify.com --theme=143188983970 --ignore=config/settings_data.json,templates/product.json

if [ $? -eq 0 ]; then
    echo "✅ Code changes pushed successfully (without overriding customizations)!"
    
    echo ""
    echo "✅ Successfully pushed to staging with ALL customizations preserved!"
    echo "📝 Git commit: $(git log -1 --oneline)"
    echo "💡 Used selective push strategy - only code files pushed, customizations left intact"
    echo "📁 Live settings backup saved in: $BACKUP_DIR/ (for emergencies)"
    echo ""
    echo "🌐 Preview: https://vzgxcj-h9.myshopify.com/?preview_theme_id=143188983970"
else
    echo ""
    echo "❌ Push failed. Check the error above."
    exit 1
fi