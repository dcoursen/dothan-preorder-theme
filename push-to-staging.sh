#!/bin/bash

# Push to Staging Theme Script
# SAFELY commits changes first, then pushes to staging theme

echo "🚀 Pushing to Staging Theme..."
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
        git commit -m "staging: $commit_msg"
        echo "✅ Changes committed"
    else
        echo "❌ Cannot push without committing changes first"
        echo "💡 Use 'git stash' to temporarily save changes, or commit them"
        exit 1
    fi
fi

echo ""
echo "💾 Creating comprehensive backup..."

# Comprehensive backup including remote settings
if [ -f "scripts/comprehensive-backup.js" ]; then
    node scripts/comprehensive-backup.js
    if [ $? -eq 0 ]; then
        echo "✅ Comprehensive backup completed"
    else
        echo "⚠️  Warning: Comprehensive backup had issues, but continuing..."
    fi
else
    # Fallback to basic backup
    echo "⚠️  Comprehensive backup script not found, using basic backup..."
    if [ -f "scripts/backup-theme-config.js" ]; then
        node scripts/backup-theme-config.js
        echo "✅ Basic theme settings backed up"
    else
        echo "⚠️  Warning: No backup script found, continuing without backup"
    fi
fi

echo ""
echo "📤 Pushing to staging theme..."

# Push to staging theme with error handling and retry
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    echo "📤 Push attempt $(($RETRY_COUNT + 1))..."
    shopify theme push --store=vzgxcj-h9.myshopify.com --theme=143188983970
    
    if [ $? -eq 0 ]; then
        echo "✅ Push successful!"
        break
    else
        RETRY_COUNT=$(($RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo "❌ Push failed, fixing errors and retrying in 5 seconds..."
            sleep 5
            
            # Check for common Liquid syntax errors and fix them
            echo "🔧 Checking for common syntax errors..."
            find blocks/ -name "*.liquid" -exec grep -l " or " {} \; | while read file; do
                echo "⚠️  Found 'or' operator in $file, fixing..."
                sed -i.bak 's/ or / %} {% elsif /g' "$file"
                rm "${file}.bak" 2>/dev/null
            done
            
            # Re-commit fixes if any were made
            if ! git diff --quiet; then
                git add .
                git commit -m "Auto-fix: Liquid syntax errors"
            fi
        else
            echo "❌ All retries failed. Manual intervention required."
            exit 1
        fi
    fi
done

echo ""
echo "✅ Successfully pushed to staging!"
echo "📝 Git commit: $(git log -1 --oneline)"
    
    # Skip restoration to preserve block orders and settings during development
    echo "⚠️  Skipping restoration to preserve current block order and settings"
    echo "💡 Block order and theme settings are maintained as-is"
    
    echo ""
    echo "🌐 Preview: https://vzgxcj-h9.myshopify.com/?preview_theme_id=143188983970"
else
    echo ""
    echo "❌ Push failed. Check the error above."
    exit 1
fi