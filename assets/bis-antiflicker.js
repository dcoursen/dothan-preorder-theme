/**
 * BIS Anti-Flicker Script
 * Prevents sold-out button flash before BIS button appears
 * 
 * This script addresses the UX issue where customers see a brief
 * "SOLD OUT" flash before the "Get Early Access" / "Notify me" button appears
 */

(function() {
  'use strict';
  
  // Configuration
  const config = {
    // Selectors for elements to check
    addToCartSelector: 'add-to-cart-component button[name="add"], .product-form__cart button[type="submit"]',
    addToCartComponentSelector: 'add-to-cart-component, .product-form__cart',
    bisSelectors: [
      '#klaviyo-bis-button-container',
      '.klaviyo-bis-button',
      '[data-testid*="bis"]', 
      '[class*="notify"]',
      '[class*="back-in-stock"]',
      '.bis-button',
      // Add broader selectors to catch any BIS implementation
      '[id*="klaviyo"]',
      '[class*="klaviyo"]',
      'button[type="button"]:not([name="add"])', // Any button that's not add-to-cart
      'form button:not([name="add"])', // Any form button that's not add-to-cart
      '*[class*="email"], *[id*="email"]' // Email signup elements
    ],
    
    // Text indicators for sold out state
    soldOutTexts: ['sold out', 'unavailable', 'out of stock'],
    
    // Timing
    checkInterval: 50, // How often to check for BIS (ms)
    fallbackTimeout: 3000, // When to give up and show sold-out (ms)
    transitionDuration: 200 // CSS transition duration (ms)
  };
  
  // Prevent flicker by hiding sold-out button immediately  
  function preventBISFlicker() {
    const addToCartButton = document.querySelector(config.addToCartSelector);
    
    if (!addToCartButton) return;
    
    // Check if product is sold out
    const isSoldOut = isButtonSoldOut(addToCartButton);
    
    if (isSoldOut) {
      const addToCartComponent = addToCartButton.closest(config.addToCartComponentSelector) || 
                                 addToCartButton.parentElement;
      
      if (addToCartComponent) {
        hideWithTransition(addToCartComponent);
        waitForBIS(addToCartComponent);
      }
    }
  }
  
  // Check if button indicates sold out state
  function isButtonSoldOut(button) {
    if (button.disabled) return true;
    
    const text = button.textContent.toLowerCase().trim();
    return config.soldOutTexts.some(soldOutText => text.includes(soldOutText));
  }
  
  // Hide element with smooth transition
  function hideWithTransition(element) {
    element.style.visibility = 'hidden';
    element.style.opacity = '0';
    element.style.transition = `opacity ${config.transitionDuration}ms ease`;
    element.dataset.bisHidden = 'true';
  }
  
  // Show element with smooth transition  
  function showWithTransition(element) {
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    delete element.dataset.bisHidden;
  }
  
  // Wait for BIS button to appear
  function waitForBIS(addToCartComponent) {
    const startTime = Date.now();
    
    const checkForBIS = () => {
      // Look for any BIS button (exists in DOM, doesn't need to be visible yet)
      const bisButton = config.bisSelectors
        .map(selector => document.querySelector(selector))
        .find(button => button && (button.offsetHeight > 0 || button.textContent.trim().length > 0));
      
      // Debug: Log what BIS elements we found
      const foundElements = config.bisSelectors
        .map(selector => ({selector, element: document.querySelector(selector)}))
        .filter(item => item.element);
      
      if (foundElements.length > 0) {
        console.log('[BIS Anti-Flicker] 🔍 Found BIS elements:', foundElements);
      }
      
      if (bisButton) {
        // BIS found - hide sold-out permanently and ensure BIS is visible
        addToCartComponent.style.display = 'none';
        
        // Make sure BIS button is visible
        if (bisButton.offsetHeight === 0) {
          bisButton.style.display = 'block';
          bisButton.style.visibility = 'visible';
          bisButton.style.opacity = '1';
        }
        
        logSuccess(`BIS button found: ${bisButton.tagName}${bisButton.id ? '#'+bisButton.id : ''}${bisButton.className ? '.'+bisButton.className.split(' ').join('.') : ''}`);
        return;
      }
      
      // Check timeout
      if (Date.now() - startTime > config.fallbackTimeout) {
        // Timeout - show sold-out button
        showWithTransition(addToCartComponent);
        logWarning('BIS timeout, showing sold-out button');
        return;
      }
      
      // Continue checking
      setTimeout(checkForBIS, config.checkInterval);
    };
    
    // Start checking
    setTimeout(checkForBIS, config.checkInterval);
  }
  
  // Logging helpers
  function logSuccess(message) {
    console.log(`[BIS Anti-Flicker] ✅ ${message}`);
  }
  
  function logWarning(message) {
    console.warn(`[BIS Anti-Flicker] ⚠️ ${message}`);
  }
  
  function logError(message) {
    console.error(`[BIS Anti-Flicker] ❌ ${message}`);
  }
  
  // Ultra-minimal anti-flicker - just 100ms opacity reduction
  function init() {
    try {
      const addToCartButton = document.querySelector(config.addToCartSelector);
      
      if (addToCartButton && isButtonSoldOut(addToCartButton)) {
        const addToCartComponent = addToCartButton.closest(config.addToCartComponentSelector) || 
                                   addToCartButton.parentElement;
        
        if (addToCartComponent) {
          // Reduce opacity briefly to soften the transition
          addToCartComponent.style.opacity = '0.3';
          addToCartComponent.style.transition = 'opacity 0.15s ease';
          
          setTimeout(() => {
            // Restore full visibility - BIS will take over naturally
            addToCartComponent.style.opacity = '1';
          }, 100);
          
          logSuccess('Ultra-minimal anti-flicker applied (100ms opacity reduction)');
        }
      }
    } catch (error) {
      logError(`Initialization failed: ${error.message}`);
    }
  }
  
  // Run immediately if DOM ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();