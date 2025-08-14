#!/bin/bash

# Push to Staging Script with Git Integration
# Theme: [STAGING] Retail Savage x Dothan Nurseries v1.1.0
# Theme ID: 143188983970

echo "🚀 Push to Staging - Complete Workflow"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Found uncommitted changes. Committing to Git..."
    echo ""
    
    # Show what's changed
    git status --short
    echo ""
    
    # Ask for commit message
    read -p "Enter commit message (or press Enter for default): " commit_msg
    
    if [ -z "$commit_msg" ]; then
        commit_msg="chore: Update theme files"
    fi
    
    # Add all changes and commit
    git add -A
    git commit -m "$commit_msg"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# Step 2: Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
if git push origin $(git branch --show-current); then
    echo "✅ Pushed to GitHub"
else
    echo "⚠️  Failed to push to GitHub. Continue anyway? (y/n)"
    read -p "> " continue_deploy
    if [ "$continue_deploy" != "y" ]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Step 3: Deploy to Shopify Staging
echo ""
echo "🚀 Deploying to STAGING theme..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run the backup and push script with staging theme ID
./backup-and-push.sh 143188983970

echo "
✅ Complete deployment to STAGING!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 Preview: https://vzgxcj-h9.myshopify.com?preview_theme_id=143188983970
⚙️  Customize: https://vzgxcj-h9.myshopify.com/admin/themes/143188983970/editor
🐙 GitHub: $(git remote get-url origin | sed 's/\.git$//')
"