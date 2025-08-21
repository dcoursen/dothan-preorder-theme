#!/bin/bash

# Push to Staging Theme Script
# Backs up current settings and pushes to staging theme

echo "🚀 Pushing to Staging Theme..."
echo "Store: vzgxcj-h9.myshopify.com"
echo "Theme ID: 143188983970"
echo ""

# Skip backup for now to avoid hanging
echo "📦 Skipping backup..."

echo ""
echo "📤 Pushing to staging theme..."

# Push to staging theme
shopify theme push --store=vzgxcj-h9.myshopify.com --theme=143188983970

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to staging!"
    echo "🌐 Preview: https://vzgxcj-h9.myshopify.com/?preview_theme_id=143188983970"
else
    echo ""
    echo "❌ Push failed. Check the error above."
    exit 1
fi