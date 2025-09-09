#!/bin/bash

echo "🚀 Setting up Horizon Preorder Development Environment"
echo "===================================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your Shopify store details"
    exit 1
fi

# Load environment variables
source .env

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install global tools
echo "🛠️  Installing global tools..."
npm install -g @shopify/cli @shopify/theme

# Setup git hooks
echo "🪝 Setting up git hooks..."
npx husky install

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p tests/screenshots
mkdir -p docs
mkdir -p logs

# Check Shopify CLI authentication
echo "🔐 Checking Shopify CLI authentication..."
if ! shopify whoami &>/dev/null; then
    echo "⚠️  Shopify CLI not authenticated. Running login..."
    shopify auth login --store=$SHOPIFY_STORE_URL
fi

# Pull latest theme
echo "🎨 Pulling latest theme..."
read -p "Do you want to pull the latest theme? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run pull
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Available commands:"
echo "  npm run dev        - Start development server"
echo "  npm test          - Run tests"
echo "  npm run push      - Push changes to Shopify"
echo "  ./test-preorder.sh - Run preorder tests"
echo ""
echo "📖 Documentation:"
echo "  WORKFLOW.md - Development workflow guide"
echo "  CLAUDE.md   - AI assistant documentation"
echo "  tests/README.md - Testing guide"