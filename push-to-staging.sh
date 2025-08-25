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
echo "📤 Pushing to staging theme..."

# Push to staging theme
shopify theme push --store=vzgxcj-h9.myshopify.com --theme=143188983970

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to staging!"
    echo "🌐 Preview: https://vzgxcj-h9.myshopify.com/?preview_theme_id=143188983970"
    echo "📝 Git commit: $(git log -1 --oneline)"
else
    echo ""
    echo "❌ Push failed. Check the error above."
    exit 1
fi