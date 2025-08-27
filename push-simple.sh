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
echo "📥 Pulling latest customizations from Shopify..."
# Pull settings and templates to preserve your customizations
shopify theme pull --store=vzgxcj-h9.myshopify.com --theme=143188983970 --only=config/settings_data.json,templates/product.json

if [ $? -eq 0 ]; then
    echo "✅ Latest customizations pulled and preserved"
    
    # Commit the pulled customizations to avoid conflicts
    if ! git diff --quiet config/settings_data.json templates/product.json; then
        echo "💾 Saving pulled customizations..."
        git add config/settings_data.json templates/product.json
        git commit -m "preserve: Save latest theme customizations from Shopify"
    fi
else
    echo "⚠️  Warning: Pull failed, using existing local files"
fi

echo ""
echo "📤 Now pushing code changes to staging (PRESERVING CUSTOMIZATIONS)..."

# Push all files - settings and templates are now current from Shopify
shopify theme push --store=vzgxcj-h9.myshopify.com --theme=143188983970

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to staging!"
    echo "📝 Git commit: $(git log -1 --oneline)"
    echo "💡 No restoration performed - block orders and settings preserved"
    echo ""
    echo "🌐 Preview: https://vzgxcj-h9.myshopify.com/?preview_theme_id=143188983970"
else
    echo ""
    echo "❌ Push failed. Check the error above."
    exit 1
fi