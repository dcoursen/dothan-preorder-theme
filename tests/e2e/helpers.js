// Load environment variables
require('dotenv').config();

// Test configuration
const config = {
  // Update these with your actual Shopify store details
  STORE_URL: process.env.SHOPIFY_STORE_URL || 'https://your-store.myshopify.com',
  STORE_PASSWORD: process.env.SHOPIFY_STORE_PASSWORD || '', // For password-protected stores
  
  // Test product handles
  PREORDER_PRODUCT_HANDLE: process.env.PREORDER_PRODUCT || 'test-preorder-product',
  REGULAR_PRODUCT_HANDLE: process.env.REGULAR_PRODUCT || 'test-regular-product',
  
  // Timeouts
  DEFAULT_TIMEOUT: 30000,
  ANIMATION_WAIT: 500
};

// Helper to handle password-protected stores
async function bypassPassword(page) {
  if (!config.STORE_PASSWORD) return;
  
  // Check if we're on password page
  const passwordInput = await page.$('input[type="password"]');
  if (passwordInput) {
    await page.type('input[type="password"]', config.STORE_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  }
}

// Helper to wait for preorder elements
async function waitForPreorderElements(page) {
  try {
    await page.waitForSelector('#preorder-bis-container', { 
      timeout: config.DEFAULT_TIMEOUT 
    });
    // Wait a bit for JavaScript to initialize
    await page.waitForTimeout(config.ANIMATION_WAIT);
  } catch (error) {
    console.error('Preorder elements not found:', error);
    throw error;
  }
}

// Helper to check if element is visible
async function isElementVisible(page, selector) {
  const element = await page.$(selector);
  if (!element) return false;
  
  const isVisible = await page.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  }, element);
  
  return isVisible;
}

// Helper to get product URLs
function getProductUrl(handle) {
  return `${config.STORE_URL}/products/${handle}`;
}

// Helper to take labeled screenshots
async function takeScreenshot(page, label) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `tests/screenshots/${label}-${timestamp}.png`;
  
  await page.screenshot({
    path: filename,
    fullPage: true
  });
  
  console.log(`Screenshot saved: ${filename}`);
  return filename;
}

// Helper to mock product data for testing
async function mockPreorderProduct(page, daysUntilDrop = 5) {
  // Calculate drop date
  const dropDate = new Date();
  dropDate.setDate(dropDate.getDate() + daysUntilDrop);
  
  // Inject mock data into page
  await page.evaluate((dropDateStr) => {
    // Mock the preorder container data attributes
    const container = document.querySelector('#preorder-bis-container');
    if (container) {
      container.dataset.hasPreorder = 'true';
      container.dataset.preorderText = `Available ${dropDateStr}`;
      container.dataset.inventory = '0';
      container.dataset.available = 'false';
      
      // Trigger initialization
      if (typeof initializePreorderBIS === 'function') {
        initializePreorderBIS();
      }
    }
  }, dropDate.toLocaleDateString());
}

module.exports = {
  config,
  bypassPassword,
  waitForPreorderElements,
  isElementVisible,
  getProductUrl,
  takeScreenshot,
  mockPreorderProduct
};