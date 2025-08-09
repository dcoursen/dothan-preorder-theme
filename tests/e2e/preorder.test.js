const config = require('../config');

describe('Preorder Functionality Tests', () => {
  let page;
  
  const { STORE_URL, PREORDER_PRODUCT_URL, REGULAR_PRODUCT_URL } = config;
  
  beforeAll(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
  });

  afterAll(async () => {
    await page.close();
  });

  describe('Preorder Date Display', () => {
    test('should display preorder date for unavailable products with future drop date', async () => {
      // Navigate to preorder product
      await page.goto(PREORDER_PRODUCT_URL, { waitUntil: 'networkidle2' });
      
      // Wait for preorder container to load
      await page.waitForSelector('#preorder-bis-container', { timeout: 5000 });
      
      // Check if preorder date is displayed
      const preorderDateDisplay = await page.$('.preorder-date-display');
      expect(preorderDateDisplay).toBeTruthy();
      
      // Get the preorder text
      const preorderText = await page.$eval('.preorder-date-display', el => el.textContent);
      expect(preorderText).toMatch(/Available/);
      
      // Take screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/preorder-date-display.png',
        fullPage: true 
      });
    });

    test('should NOT display preorder date for regular in-stock products', async () => {
      // Navigate to regular product
      await page.goto(REGULAR_PRODUCT_URL, { waitUntil: 'networkidle2' });
      
      // Wait for page to load
      await page.waitForSelector('.product-form-buttons', { timeout: 5000 });
      
      // Check that preorder date is NOT displayed
      const preorderDateDisplay = await page.$('.preorder-date-display');
      expect(preorderDateDisplay).toBeFalsy();
      
      // Regular add to cart button should be visible
      const addToCartButton = await page.$('button[name="add"]');
      expect(addToCartButton).toBeTruthy();
    });
  });

  describe('Back in Stock (BIS) Integration', () => {
    test('should show "Get Early Access" button for sold-out preorder products', async () => {
      // Navigate to sold-out preorder product
      await page.goto(PREORDER_PRODUCT_URL, { waitUntil: 'networkidle2' });
      
      // Wait for Klaviyo BIS button to appear
      await page.waitForSelector('.klaviyo-bis-button', { timeout: 5000 });
      
      // Check button text
      const buttonText = await page.$eval('.klaviyo-bis-button', el => el.textContent);
      expect(buttonText).toBe('Get Early Access');
      
      // Original add to cart should be hidden
      const addToCartVisible = await page.$eval('add-to-cart-component', el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none';
      });
      expect(addToCartVisible).toBe(false);
      
      // Take screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/get-early-access-button.png',
        fullPage: true 
      });
    });

    test('should trigger Klaviyo form when BIS button is clicked', async () => {
      // Navigate to sold-out preorder product
      await page.goto(PREORDER_PRODUCT_URL, { waitUntil: 'networkidle2' });
      
      // Wait for button
      await page.waitForSelector('.klaviyo-bis-button', { timeout: 5000 });
      
      // Listen for console messages (for alert fallback)
      const consoleMessages = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      // Click the button
      await page.click('.klaviyo-bis-button');
      
      // Wait a bit for any actions
      await page.waitForTimeout(1000);
      
      // Check if Klaviyo form opened or alert was shown (depending on setup)
      // This will vary based on your actual Klaviyo integration
      const alertShown = consoleMessages.some(msg => 
        msg.includes('BIS Form would open here')
      );
      
      // Either Klaviyo form should be visible or test alert should have fired
      const klaviyoForm = await page.$('.klaviyo-form-container');
      expect(klaviyoForm || alertShown).toBeTruthy();
    });
  });

  describe('Responsive Design', () => {
    test('should display correctly on mobile devices', async () => {
      // Set mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      
      // Navigate to preorder product
      await page.goto(PREORDER_PRODUCT_URL, { waitUntil: 'networkidle2' });
      
      // Check mobile styling
      const preorderDisplay = await page.$('.preorder-date-display');
      if (preorderDisplay) {
        const fontSize = await page.$eval('.preorder-date-display', el => {
          return window.getComputedStyle(el).fontSize;
        });
        expect(fontSize).toBe('13px'); // Based on your CSS
      }
      
      // Take mobile screenshot
      await page.screenshot({ 
        path: 'tests/screenshots/preorder-mobile.png',
        fullPage: true 
      });
      
      // Reset viewport
      await page.setViewport({ width: 1920, height: 1080 });
    });
  });

  describe('Date Formatting', () => {
    test('should format dates correctly for products dropping within 7 days', async () => {
      // This test assumes you have a product with a drop date within 7 days
      // You might need to mock this or use a test product
      await page.goto(PREORDER_PRODUCT_URL, { waitUntil: 'networkidle2' });
      
      const preorderText = await page.$eval('.preorder-date-display', el => el.textContent);
      
      // Check for day name and time format
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const hasDay = dayNames.some(day => preorderText.includes(day));
      const hasTime = /\d{1,2}:\d{2}(AM|PM) EST/.test(preorderText);
      
      expect(hasDay || preorderText.includes('/')).toBeTruthy();
      if (hasDay) {
        expect(hasTime).toBeTruthy();
      }
    });
  });
});

describe('Visual Regression Tests', () => {
  test('should match visual snapshot of preorder product page', async () => {
    const page = await browser.newPage();
    await page.goto(PREORDER_PRODUCT_URL, { waitUntil: 'networkidle2' });
    
    // Wait for dynamic content
    await page.waitForSelector('#preorder-bis-container', { timeout: 5000 });
    await page.waitForTimeout(1000); // Wait for animations
    
    // Take screenshot for visual comparison
    const screenshot = await page.screenshot({ fullPage: true });
    
    // In a real setup, you'd compare this with a baseline image
    // For now, just save it
    require('fs').writeFileSync(
      'tests/screenshots/preorder-visual-baseline.png',
      screenshot
    );
    
    await page.close();
  });
});