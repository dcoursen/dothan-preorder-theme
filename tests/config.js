require('dotenv').config();

const config = {
  STORE_URL: process.env.SHOPIFY_STORE_URL || 'https://your-store.myshopify.com',
  STORE_PASSWORD: process.env.SHOPIFY_STORE_PASSWORD || '',
  PREORDER_PRODUCT_HANDLE: process.env.PREORDER_PRODUCT || 'spider-lily-suprise-resurrection-hurricane-red',
  REGULAR_PRODUCT_HANDLE: process.env.REGULAR_PRODUCT || 'spider-lily-surprise-resurrection-hurricane-yellow',
  KLAVIYO_FORM_ID: process.env.KLAVIYO_FORM_ID || 'WQZSWn',
  
  // Derived URLs
  get PREORDER_PRODUCT_URL() {
    return `${this.STORE_URL}/products/${this.PREORDER_PRODUCT_HANDLE}`;
  },
  get REGULAR_PRODUCT_URL() {
    return `${this.STORE_URL}/products/${this.REGULAR_PRODUCT_HANDLE}`;
  },
  
  // Test settings
  HEADLESS: process.env.HEADLESS !== 'false',
  TIMEOUT: 30000,
  ANIMATION_WAIT: 1000
};

module.exports = config;