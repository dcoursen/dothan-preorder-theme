/**
 * Analytics tracking for preorder feature
 * Tracks user interactions and conversion metrics
 */

class PreorderAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.events = [];
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Track an event
   * @param {string} eventName - Name of the event
   * @param {Object} eventData - Additional event data
   */
  track(eventName, eventData = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      ...eventData
    };

    // Store locally
    this.events.push(event);

    // Send to analytics services
    this.sendToGA(event);
    this.sendToShopifyAnalytics(event);
    this.sendToKlaviyo(event);
  }

  /**
   * Track preorder view
   */
  trackPreorderView(productData) {
    this.track('preorder_viewed', {
      product_id: productData.productId,
      product_title: productData.productTitle,
      variant_id: productData.variantId,
      drop_date: productData.dropDate,
      days_until_drop: productData.daysUntilDrop
    });
  }

  /**
   * Track BIS button click
   */
  trackBISClick(productData) {
    this.track('bis_button_clicked', {
      product_id: productData.productId,
      button_text: productData.buttonText,
      is_preorder: productData.isPreorder
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmission(formData) {
    this.track('bis_form_submitted', {
      product_id: formData.productId,
      email: formData.email ? 'provided' : 'not_provided',
      form_id: formData.formId
    });
  }

  /**
   * Send to Google Analytics
   */
  sendToGA(event) {
    if (typeof gtag !== 'undefined') {
      gtag('event', event.name, {
        event_category: 'Preorder',
        event_label: event.product_id,
        value: event.value || 0,
        custom_dimensions: {
          session_id: event.sessionId,
          is_preorder: event.is_preorder
        }
      });
    }
  }

  /**
   * Send to Shopify Analytics
   */
  sendToShopifyAnalytics(event) {
    if (window.ShopifyAnalytics && window.ShopifyAnalytics.lib) {
      window.ShopifyAnalytics.lib.track(event.name, event);
    }
  }

  /**
   * Send to Klaviyo
   */
  sendToKlaviyo(event) {
    if (typeof klaviyo !== 'undefined') {
      klaviyo.push(['track', event.name, event]);
    }
  }

  /**
   * Get conversion funnel data
   */
  getFunnelData() {
    const views = this.events.filter(e => e.name === 'preorder_viewed').length;
    const clicks = this.events.filter(e => e.name === 'bis_button_clicked').length;
    const submissions = this.events.filter(e => e.name === 'bis_form_submitted').length;

    return {
      views,
      clicks,
      submissions,
      viewToClickRate: views > 0 ? (clicks / views * 100).toFixed(2) + '%' : '0%',
      clickToSubmitRate: clicks > 0 ? (submissions / clicks * 100).toFixed(2) + '%' : '0%',
      overallConversion: views > 0 ? (submissions / views * 100).toFixed(2) + '%' : '0%'
    };
  }
}

// Initialize analytics
window.preorderAnalytics = new PreorderAnalytics();

// Auto-track page views with preorder products
document.addEventListener('DOMContentLoaded', function() {
  const preorderContainer = document.querySelector('#preorder-bis-container');
  if (preorderContainer && preorderContainer.dataset.hasPreorder === 'true') {
    window.preorderAnalytics.trackPreorderView({
      productId: preorderContainer.dataset.productId,
      productTitle: document.querySelector('h1')?.textContent || 'Unknown',
      dropDate: preorderContainer.dataset.preorderText,
      isPreorder: true
    });
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PreorderAnalytics;
}