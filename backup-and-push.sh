#!/bin/bash

# Backup and Push Script for Dothan Nurseries Theme
# Usage: ./backup-and-push.sh [theme-id]

THEME_ID=${1:-143102967970}  # Default to staging theme
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "🔄 Starting backup and push process..."
echo "Theme ID: $THEME_ID"

# Step 1: Create timestamped backup of current settings
echo "📦 Backing up current settings..."
if shopify theme pull --theme=$THEME_ID --only=config/settings_data.json; then
    # Create backup with timestamp
    cp config/settings_data.json "backups/settings_data_${TIMESTAMP}.json"
    echo "✅ Settings backed up to: backups/settings_data_${TIMESTAMP}.json"
else
    echo "❌ Failed to backup settings"
    exit 1
fi

# Step 2: Push theme changes
echo "🚀 Pushing theme changes..."
if shopify theme push --theme=$THEME_ID; then
    echo "✅ Theme pushed successfully"
    echo "🔗 Preview: https://vzgxcj-h9.myshopify.com?preview_theme_id=$THEME_ID"
    echo "⚙️  Customize: https://vzgxcj-h9.myshopify.com/admin/themes/$THEME_ID/editor"
else
    echo "❌ Failed to push theme"
    exit 1
fi

echo "🎉 Backup and push completed!"
echo "💡 Your settings are backed up in: backups/settings_data_${TIMESTAMP}.json"