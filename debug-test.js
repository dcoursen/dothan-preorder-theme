const puppeteer = require('puppeteer');
const config = require('./tests/config');

async function debugPage() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Navigating to:', config.PREORDER_PRODUCT_URL);
  
  // Capture console logs and alerts
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`${msg.type()}: ${msg.text()}`);
  });
  
  page.on('dialog', async dialog => {
    console.log(`Alert: ${dialog.message()}`);
    await dialog.accept();
  });
  
  try {
    await page.goto(config.PREORDER_PRODUCT_URL, { waitUntil: 'networkidle2' });
    
    // Check if our BIS button is working
    const bisButton = await page.$('#klaviyo-bis-button-container .bis-button');
    console.log('BIS button found:', !!bisButton);
    
    if (bisButton) {
      const buttonText = await bisButton.evaluate(el => el.textContent);
      console.log('BIS button text:', buttonText);
      
      // Check Klaviyo state before clicking
      const preClickInfo = await page.evaluate(() => {
        return {
          klaviyoExists: typeof window.klaviyo !== 'undefined',
          klaviyoReady: window.klaviyo && window.klaviyo.push,
          hasKlaviyoScript: !!document.querySelector('script[src*="klaviyo"]'),
          buttonOnClick: document.querySelector('.bis-button')?.getAttribute('onclick') || 'no onclick',
          allKlaviyoScripts: Array.from(document.querySelectorAll('script')).filter(s => s.src && s.src.includes('klaviyo')).map(s => s.src)
        };
      });
      console.log('Pre-click Klaviyo state:', preClickInfo);
      
      // Test clicking the button
      try {
        console.log('Clicking BIS button...');
        await bisButton.click();
        
        // Wait and check what happened
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check for Klaviyo form, alerts, or errors
        const postClickInfo = await page.evaluate(() => {
          return {
            klaviyoFormVisible: !!document.querySelector('.klaviyo-form:not([style*="display: none"]), iframe[src*="klaviyo"], [class*="klaviyo"][class*="modal"], [class*="klaviyo"][class*="popup"]'),
            alertShown: window.lastAlert || 'none',
            consoleErrors: window.errors || [],
            klaviyoQueueLength: window.klaviyo && window.klaviyo.push && window.klaviyo._q ? window.klaviyo._q.length : 'no queue'
          };
        });
        console.log('Post-click results:', postClickInfo);
        
        // Show any console logs from the page
        if (consoleLogs.length > 0) {
          console.log('Console logs during test:', consoleLogs);
        }
        
      } catch (error) {
        console.log('Error clicking BIS button:', error.message);
      }
    }
    
    // Check for any preorder-related elements
    const preorderElements = await page.$$eval('[id*="preorder"], [class*="preorder"], [id*="bis"], [class*="bis"], [id*="klaviyo"], [class*="klaviyo"]', elements => 
      elements.map(el => ({ 
        tag: el.tagName, 
        id: el.id, 
        className: el.className, 
        text: el.textContent?.trim(),
        visible: el.offsetHeight > 0,
        display: window.getComputedStyle(el).display
      }))
    );
    console.log('Preorder elements found:', preorderElements);
    
    // Check what our anti-flicker script would find
    const bisSelectors = [
      '#klaviyo-bis-button-container',
      '.klaviyo-bis-button',
      '[data-testid*="bis"]', 
      '[class*="notify"]',
      '[class*="back-in-stock"]',
      '.bis-button',
      '[id*="klaviyo"]',
      '[class*="klaviyo"]',
      'button[type="button"]:not([name="add"])',
      'form button:not([name="add"])',
      '*[class*="email"], *[id*="email"]'
    ];
    
    const bisElementsFound = [];
    for (const selector of bisSelectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          for (const element of elements) {
            const info = await element.evaluate(el => ({
              selector,
              tag: el.tagName,
              id: el.id,
              className: el.className,
              text: el.textContent?.trim(),
              visible: el.offsetHeight > 0,
              display: window.getComputedStyle(el).display
            }));
            bisElementsFound.push(info);
          }
        }
      } catch (e) {
        // Selector might be invalid, skip
      }
    }
    
    console.log('BIS elements our script should find:', bisElementsFound);
    
    // Check if buy buttons exist
    const buyButtons = await page.$$eval('.product-form-buttons, add-to-cart-component, [class*="buy"]', elements => 
      elements.map(el => ({ tag: el.tagName, id: el.id, className: el.className }))
    );
    console.log('Buy button elements found:', buyButtons);
    
    // Get page content around where our snippet should be
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    const hasKlaviyoScript = bodyHTML.includes('klaviyo-bis-integration') || bodyHTML.includes('preorder-bis-container');
    const hasDebugComment = bodyHTML.includes('Debug: Product ID');
    const hasAntiflicker = bodyHTML.includes('preventBISFlicker') || bodyHTML.includes('bis-antiflicker.js');
    console.log('Contains our script:', hasKlaviyoScript);
    console.log('Contains debug comment:', hasDebugComment);
    console.log('Contains antiflicker script:', hasAntiflicker);
    
    // Find the debug comment specifically
    if (hasDebugComment) {
      const debugMatch = bodyHTML.match(/<!-- Debug: Product ID = ([^,]+), Inventory = ([^,]+), Available = ([^>]+) -->/);
      if (debugMatch) {
        console.log('Debug values found:', {
          productId: debugMatch[1],
          inventory: debugMatch[2], 
          available: debugMatch[3]
        });
      }
    }
    
    // Wait for a bit to inspect manually
    console.log('Waiting 10 seconds for manual inspection...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugPage();