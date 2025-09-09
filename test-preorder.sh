#!/bin/bash

# Quick test runner for preorder functionality
# Usage: ./test-preorder.sh [options]

echo "🧪 Running Preorder Feature Tests..."
echo "=================================="

# Check if store URL is configured
if [ -z "$SHOPIFY_STORE_URL" ]; then
    echo "⚠️  Warning: SHOPIFY_STORE_URL not set"
    echo "   Using default: https://your-store.myshopify.com"
    echo "   Set it with: export SHOPIFY_STORE_URL=https://your-actual-store.myshopify.com"
    echo ""
fi

# Parse command line arguments
HEADLESS=true
TEST_FILE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --headed)
            HEADLESS=false
            shift
            ;;
        --debug)
            DEBUG=true
            shift
            ;;
        --file)
            TEST_FILE="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run tests
if [ "$DEBUG" = true ]; then
    echo "🐛 Running in debug mode..."
    node --inspect-brk ./node_modules/.bin/jest --runInBand $TEST_FILE
elif [ "$HEADLESS" = false ]; then
    echo "👀 Running with visible browser..."
    HEADLESS=false npm test $TEST_FILE
else
    echo "🤖 Running headless tests..."
    npm test $TEST_FILE
fi

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ All tests passed!"
else
    echo ""
    echo "❌ Some tests failed. Check the output above."
    echo ""
    echo "💡 Tips:"
    echo "   - Run with --headed to see the browser"
    echo "   - Run with --debug to use Chrome DevTools"
    echo "   - Check screenshots in tests/screenshots/"
fi