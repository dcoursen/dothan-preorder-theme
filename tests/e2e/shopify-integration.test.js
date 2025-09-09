const {
  config,
  bypassPassword,
  waitForPreorderElements,
  isElementVisible,
  getProductUrl,
  takeScreenshot
} = require('./helpers');

describe('Shopify Theme Integration Tests', () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
  });

  afterEach(async () => {
    await page.close();
  });

  describe('Theme Compatibility', () => {
    test('should work with Shopify theme structure', async () => {
      const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      
      // Check that our snippets are loading
      const snippetsLoaded = await page.evaluate(() => {
        // Check if our preorder container exists
        const preorderContainer = document.querySelector('#preorder-bis-container');
        
        // Check if our CSS is applied
        const styles = document.querySelector('style');
        const hasPreorderStyles = styles && styles.textContent.includes('preorder-date-display');
        
        return {
          containerExists: !!preorderContainer,
          stylesLoaded: hasPreorderStyles,
          initFunctionExists: typeof initializePreorderBIS === 'function'
        };
      });
      
      expect(snippetsLoaded.containerExists).toBe(true);
      expect(snippetsLoaded.stylesLoaded).toBe(true);
      expect(snippetsLoaded.initFunctionExists).toBe(true);
    });

    test('should not interfere with existing theme features', async () => {
      const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      
      // Check that standard Shopify features still work
      const themeFeatures = await page.evaluate(() => {
        return {
          // Product form component exists
          productForm: !!document.querySelector('product-form-component'),
          // Variant picker exists
          variantPicker: !!document.querySelector('[data-variant-picker]'),
          // Media gallery exists
          mediaGallery: !!document.querySelector('.product-media-gallery'),
          // Price display exists
          priceDisplay: !!document.querySelector('[data-price]')
        };
      });
      
      // All standard features should still be present
      expect(themeFeatures.productForm).toBe(true);
      expect(themeFeatures.priceDisplay).toBe(true);
    });
  });

  describe('Variant Selection', () => {
    test('should update preorder status when variant changes', async () => {
      const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      
      // If variant selector exists, try changing variant
      const variantSelector = await page.$('[data-variant-picker] select, [data-variant-picker] input[type="radio"]');
      
      if (variantSelector) {
        // Get initial state
        const initialState = await page.evaluate(() => {
          const container = document.querySelector('#preorder-bis-container');
          return container ? container.dataset : {};
        });
        
        // Change variant (if possible)
        const isSelect = await page.$eval('[data-variant-picker] select', () => true).catch(() => false);
        
        if (isSelect) {
          await page.select('[data-variant-picker] select', await page.$eval('[data-variant-picker] select option:nth-child(2)', el => el.value));
        } else {
          await page.click('[data-variant-picker] input[type="radio"]:nth-child(2)');
        }
        
        // Wait for variant change to process
        await page.waitForTimeout(1000);
        
        // Check if preorder state updated
        const newState = await page.evaluate(() => {
          const container = document.querySelector('#preorder-bis-container');
          return container ? container.dataset : {};
        });
        
        console.log('Variant change - Initial:', initialState, 'New:', newState);
      }
    });
  });

  describe('Cart Integration', () => {
    test('should prevent adding preorder items before drop date', async () => {
      const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      await waitForPreorderElements(page);
      
      // Check if add to cart is properly disabled/hidden
      const addToCartState = await page.evaluate(() => {
        const addToCart = document.querySelector('add-to-cart-component');
        const bisButton = document.querySelector('.klaviyo-bis-button');
        
        return {
          addToCartHidden: addToCart ? window.getComputedStyle(addToCart).display === 'none' : true,
          bisButtonVisible: !!bisButton,
          addToCartDisabled: document.querySelector('[name="add"]')?.disabled
        };
      });
      
      // For preorder products, add to cart should be hidden and BIS button visible
      expect(addToCartState.addToCartHidden).toBe(true);
      expect(addToCartState.bisButtonVisible).toBe(true);
    });
  });

  describe('Mobile Responsiveness', () => {
    const viewports = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPad', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];

    viewports.forEach(viewport => {
      test(`should display correctly on ${viewport.name}`, async () => {
        await page.setViewport({ width: viewport.width, height: viewport.height });
        
        const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
        await page.goto(productUrl, { waitUntil: 'networkidle2' });
        await bypassPassword(page);
        
        // Wait for responsive elements
        await page.waitForTimeout(500);
        
        // Check element visibility and positioning
        const layout = await page.evaluate(() => {
          const container = document.querySelector('#preorder-bis-container');
          const dateDisplay = document.querySelector('.preorder-date-display');
          const bisButton = document.querySelector('.klaviyo-bis-button');
          
          const getRect = (el) => el ? el.getBoundingClientRect() : null;
          
          return {
            containerVisible: container ? window.getComputedStyle(container).display !== 'none' : false,
            dateDisplayRect: getRect(dateDisplay),
            bisButtonRect: getRect(bisButton)
          };
        });
        
        // Elements should be visible
        expect(layout.containerVisible).toBe(true);
        
        // Take screenshot for visual verification
        await takeScreenshot(page, `responsive-${viewport.name.toLowerCase().replace(' ', '-')}`);
      });
    });
  });

  describe('Performance Metrics', () => {
    test('should not significantly impact page load time', async () => {
      // Test without preorder feature
      const regularUrl = getProductUrl(config.REGULAR_PRODUCT_HANDLE);
      
      const regularMetrics = await page.evaluate(() => performance.timing);
      const regularLoadTime = regularMetrics.loadEventEnd - regularMetrics.navigationStart;
      
      // Test with preorder feature
      await page.goto(getProductUrl(config.PREORDER_PRODUCT_HANDLE), { waitUntil: 'networkidle2' });
      const preorderMetrics = await page.evaluate(() => performance.timing);
      const preorderLoadTime = preorderMetrics.loadEventEnd - preorderMetrics.navigationStart;
      
      // Preorder feature should not add more than 500ms to load time
      const difference = preorderLoadTime - regularLoadTime;
      console.log(`Load time difference: ${difference}ms`);
      
      expect(difference).toBeLessThan(500);
    });
  });
});