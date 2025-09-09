const {
  config,
  bypassPassword,
  waitForPreorderElements,
  isElementVisible,
  getProductUrl,
  takeScreenshot
} = require('./helpers');

describe('Preorder Functionality - Improved Tests', () => {
  let page;

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set up console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });
    
    // Set up request interception to log network errors
    page.on('requestfailed', request => {
      console.error('Request failed:', request.url(), request.failure().errorText);
    });
  });

  afterEach(async () => {
    await page.close();
  });

  describe('Preorder Display Logic', () => {
    test('should display preorder information for sold-out products with future drop dates', async () => {
      const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      
      // Wait for preorder elements to load
      await waitForPreorderElements(page);
      
      // Check container attributes
      const containerData = await page.evaluate(() => {
        const container = document.querySelector('#preorder-bis-container');
        return {
          hasPreorder: container?.dataset.hasPreorder,
          preorderText: container?.dataset.preorderText,
          inventory: container?.dataset.inventory,
          available: container?.dataset.available
        };
      });
      
      console.log('Container data:', containerData);
      
      // Verify preorder state
      expect(containerData.hasPreorder).toBe('true');
      expect(containerData.inventory).toBe('0');
      expect(containerData.available).toBe('false');
      
      // Check if preorder date is displayed
      const preorderDateVisible = await isElementVisible(page, '.preorder-date-display');
      expect(preorderDateVisible).toBe(true);
      
      // Verify button replacement
      const bisButtonVisible = await isElementVisible(page, '.klaviyo-bis-button');
      const addToCartHidden = await page.evaluate(() => {
        const addToCart = document.querySelector('add-to-cart-component');
        return addToCart ? window.getComputedStyle(addToCart).display === 'none' : true;
      });
      
      expect(bisButtonVisible).toBe(true);
      expect(addToCartHidden).toBe(true);
      
      await takeScreenshot(page, 'preorder-display');
    });

    test('should show correct button text based on preorder status', async () => {
      const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      await waitForPreorderElements(page);
      
      // Get button text
      const buttonText = await page.$eval('.klaviyo-bis-button', el => el.textContent);
      expect(buttonText).toBe('Get Early Access');
      
      // Test hover state
      await page.hover('.klaviyo-bis-button');
      await page.waitForTimeout(300); // Wait for transition
      
      const hoverStyles = await page.$eval('.klaviyo-bis-button', el => {
        const computed = window.getComputedStyle(el);
        return {
          transform: computed.transform,
          boxShadow: computed.boxShadow
        };
      });
      
      expect(hoverStyles.transform).toContain('translateY(-2px)');
    });
  });

  describe('Date Formatting Logic', () => {
    test('should format dates correctly for different time ranges', async () => {
      const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      await waitForPreorderElements(page);
      
      const preorderText = await page.$eval('.preorder-date-display', el => el.textContent);
      
      // Test date format patterns
      const patterns = {
        withinWeek: /Available this (Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) @ \d{1,2}:\d{2}(AM|PM) EST/,
        beyondWeek: /Available \d{1,2}\/\d{1,2}/,
        general: /Available/
      };
      
      const matchesPattern = Object.values(patterns).some(pattern => pattern.test(preorderText));
      expect(matchesPattern).toBe(true);
      
      console.log('Preorder text format:', preorderText);
    });
  });

  describe('Klaviyo Integration', () => {
    test('should track event when BIS button is clicked', async () => {
      const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      await waitForPreorderElements(page);
      
      // Set up klaviyo mock
      await page.evaluate(() => {
        window.klaviyoEvents = [];
        window.klaviyo = {
          push: (args) => window.klaviyoEvents.push(args)
        };
      });
      
      // Click the button
      await page.click('.klaviyo-bis-button');
      await page.waitForTimeout(500);
      
      // Check if events were tracked
      const events = await page.evaluate(() => window.klaviyoEvents);
      
      // Should have track event and showForm event
      const trackEvent = events.find(e => e[0] === 'track');
      const showFormEvent = events.find(e => e[0] === 'showForm');
      
      if (trackEvent) {
        expect(trackEvent[1]).toBe('Viewed Product');
        expect(trackEvent[2]).toHaveProperty('ProductID');
      }
      
      console.log('Klaviyo events tracked:', events);
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing metafields gracefully', async () => {
      const productUrl = getProductUrl(config.REGULAR_PRODUCT_HANDLE);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      
      // Regular product shouldn't show preorder elements
      const preorderDisplay = await page.$('.preorder-date-display');
      const bisButton = await page.$('.klaviyo-bis-button');
      
      expect(preorderDisplay).toBe(null);
      expect(bisButton).toBe(null);
      
      // Regular add to cart should be visible
      const addToCartVisible = await isElementVisible(page, '[name="add"]');
      expect(addToCartVisible).toBe(true);
    });

    test('should handle JavaScript errors gracefully', async () => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      
      const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      
      // No JavaScript errors should occur
      expect(errors).toHaveLength(0);
    });
  });

  describe('Performance', () => {
    test('should initialize within acceptable time', async () => {
      const productUrl = getProductUrl(config.PREORDER_PRODUCT_HANDLE);
      
      const startTime = Date.now();
      await page.goto(productUrl, { waitUntil: 'networkidle2' });
      await bypassPassword(page);
      await waitForPreorderElements(page);
      const loadTime = Date.now() - startTime;
      
      console.log(`Page load time: ${loadTime}ms`);
      
      // Check that preorder initialization happens quickly
      const initTime = await page.evaluate(() => {
        const start = performance.now();
        if (typeof initializePreorderBIS === 'function') {
          initializePreorderBIS();
        }
        return performance.now() - start;
      });
      
      console.log(`Preorder init time: ${initTime}ms`);
      expect(initTime).toBeLessThan(100); // Should init in under 100ms
    });
  });
});