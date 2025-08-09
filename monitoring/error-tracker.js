/**
 * Error tracking for preorder functionality
 * Integrates with your preferred error monitoring service
 */

class PreorderErrorTracker {
  constructor() {
    this.errors = [];
    this.maxErrors = 50; // Keep last 50 errors in memory
    this.setupErrorHandlers();
  }

  setupErrorHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.logError({
        type: 'javascript',
        message: event.message,
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    });

    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'promise',
        message: event.reason?.message || event.reason,
        stack: event.reason?.stack
      });
    });
  }

  logError(errorData) {
    const error = {
      ...errorData,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      feature: 'preorder'
    };

    // Add to local storage for debugging
    this.errors.unshift(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Send to monitoring service
    this.sendToMonitoringService(error);

    // Log to console in development
    if (this.isDevelopment()) {
      console.error('Preorder Error:', error);
    }
  }

  sendToMonitoringService(error) {
    // Example: Send to your analytics endpoint
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        error_type: error.type,
        feature: 'preorder'
      });
    }

    // Example: Send to custom endpoint
    if (window.MONITORING_ENDPOINT) {
      fetch(window.MONITORING_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(error)
      }).catch(() => {
        // Fail silently to avoid error loops
      });
    }
  }

  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname.includes('.myshopify.com');
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

// Initialize error tracker
window.preorderErrorTracker = new PreorderErrorTracker();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PreorderErrorTracker;
}