#!/bin/bash

# Script to restore product template configuration
# Usage: ./scripts/restore-product-template.sh

echo "🔄 Restoring product template configuration..."

# Check if backup exists
if [ ! -f "templates/product.backup.json" ]; then
    echo "❌ Backup file not found at templates/product.backup.json"
    exit 1
fi

# Create a backup of current template
cp templates/product.json "templates/product.$(date +%Y%m%d_%H%M%S).json.bak"
echo "✅ Created backup of current template"

# Restore from backup
cp templates/product.backup.json templates/product.json
echo "✅ Restored product template from backup"

# Push to Shopify
echo "📤 Pushing to Shopify..."
npx shopify theme push templates/product.json

echo "✨ Product template restored successfully!"
echo ""
echo "Note: You may need to refresh your theme in the Shopify admin"