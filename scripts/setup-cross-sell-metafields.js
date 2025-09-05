#!/usr/bin/env node

/**
 * Script to set up cross-sell metafields for testing
 * Run this script to create the necessary metafield definitions in Shopify
 * 
 * Usage:
 * 1. Install Shopify CLI if not already installed
 * 2. Run: node scripts/setup-cross-sell-metafields.js
 */

console.log(`
================================================================================
CROSS-SELL METAFIELD SETUP INSTRUCTIONS
================================================================================

To enable the cross-sell functionality, you need to create the following 
metafield definitions in your Shopify admin:

1. Go to your Shopify Admin > Settings > Custom data > Products

2. Add these metafield definitions:

   A. CROSS-SELL PRODUCTS
      - Name: Cross-sell Products
      - Namespace and key: custom.cross_sell_products
      - Type: Product > List of products
      - Description: Products to display in the "Buy it with" section

   B. CROSS-SELL TITLE
      - Name: Cross-sell Title
      - Namespace and key: custom.cross_sell_title
      - Type: Single line text
      - Description: Title for the cross-sell section (default: "Buy it with")

   C. CROSS-SELL DESCRIPTION
      - Name: Cross-sell Description
      - Namespace and key: custom.cross_sell_description
      - Type: Multi-line text
      - Description: Description text to show below the cross-sell title

3. After creating the metafield definitions:
   - Go to a product in your admin
   - Scroll down to the Metafields section
   - Fill in the Cross-sell Products field with related products
   - Optionally set a custom title and description
   - Save the product

4. The cross-sell block will automatically appear on the product page
   when cross-sell products are selected.

================================================================================
TESTING THE FEATURE
================================================================================

1. Select a product to test with
2. Add 2-3 related products to the Cross-sell Products metafield
3. Optionally add a custom title like "Complete the Look" or "Frequently Bought Together"
4. Optionally add a description like "These items pair perfectly with your selection"
5. Visit the product page on your store
6. The cross-sell section should appear between the buy buttons and policies

================================================================================
CUSTOMIZATION OPTIONS
================================================================================

In the theme customizer, you can configure:
- Color scheme for the cross-sell block
- Number of columns (2, 3, or 4 on desktop)
- Mobile layout (1 or 2 columns)
- Padding/spacing

The block position can be adjusted by dragging it in the theme customizer.

================================================================================
`);

// If running with --create flag, attempt to create via API
if (process.argv.includes('--create')) {
  console.log('Note: Automatic metafield creation requires Shopify CLI or Admin API access.');
  console.log('Please follow the manual steps above to create the metafields in your Shopify admin.');
}