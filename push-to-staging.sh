#!/bin/bash

# Simple Push to Staging Theme Script
# Uses --ignore flag to preserve user customizations

echo "🚀 Push to Staging (with Customization Protection)..."
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
echo "📤 Pushing code to staging (preserving your customizations)..."
echo "   → Pushing: All code files (blocks, snippets, assets, etc.)"
echo "   → Ignoring: config/settings_data.json, templates/*.json"
echo ""

# Push code changes while preserving user customizations
# The --ignore flag prevents overwriting of theme settings and template configurations
shopify theme push --store=vzgxcj-h9.myshopify.com --theme=143188983970 --ignore="config/settings_data.json" --ignore="templates/*.json"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to staging!"
    echo "✨ Your theme customizations have been preserved"
    echo "📝 Git commit: $(git log -1 --oneline)"
    echo ""
    echo "🌐 Preview: https://vzgxcj-h9.myshopify.com/?preview_theme_id=143188983970"
    echo "🎨 Customize: https://vzgxcj-h9.myshopify.com/admin/themes/143188983970/editor"
else
    echo ""
    echo "❌ Push failed. Check the error above."
    exit 1
fi