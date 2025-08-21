#!/bin/bash

# Push to Production Theme Script
# Shows WARNING and requires confirmation before pushing to live theme

echo "⚠️  WARNING: PUSHING TO PRODUCTION THEME ⚠️"
echo "Store: vzgxcj-h9.myshopify.com"
echo "Theme ID: 142915502242 (LIVE THEME)"
echo ""
echo "This will update the LIVE website that customers see!"
echo ""
read -p "Type 'yes' to confirm push to production: " confirmation

if [ "$confirmation" != "yes" ]; then
    echo "❌ Push cancelled. Only 'yes' will proceed."
    exit 1
fi

echo ""
echo "📦 Creating production backup..."
shopify theme pull --store=vzgxcj-h9.myshopify.com --theme=142915502242 --only=config/settings_data.json --path=./backups/production-backup-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || echo "⚠️  Backup skipped (not critical)"

echo ""
echo "📤 Pushing to PRODUCTION theme..."

# Push to production theme
shopify theme push --store=vzgxcj-h9.myshopify.com --theme=142915502242

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to PRODUCTION!"
    echo "🌐 Live site: https://vzgxcj-h9.myshopify.com"
else
    echo ""
    echo "❌ Production push failed. Check the error above."
    exit 1
fi