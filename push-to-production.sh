#!/bin/bash

# Push to Production Script
# Theme: Retail Savage x Dothan Nurseries v1.0.0 [LIVE]
# Theme ID: 142915502242

echo "⚠️  WARNING: You are about to deploy to the LIVE PRODUCTION theme!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Theme: Retail Savage x Dothan Nurseries v1.0.0"
echo "Store: https://vzgxcj-h9.myshopify.com"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

echo ""
echo "🚀 Pushing to PRODUCTION theme..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run the backup and push script with production theme ID and allow-live flag
shopify theme push --theme=142915502242 --allow-live

echo "
✅ Deployment to PRODUCTION complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Live Store: https://vzgxcj-h9.myshopify.com
⚙️  Customize: https://vzgxcj-h9.myshopify.com/admin/themes/142915502242/editor
"