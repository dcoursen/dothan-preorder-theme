/**
 * Klaviyo Back in Stock Component
 * Handles form interactions and API communication for back in stock notifications
 */

class KlaviyoBackInStock {
  constructor() {
    this.publicApiKey = window.klaviyoPublicApiKey || this.getPublicApiKey();
    this.smsMarketingListId = window.klaviyoSmsMarketingListId || this.getSmsMarketingListId();
    this.errorMessages = this.getErrorMessages();
    this.submissionCache = this.getSubmissionCache();
    
    this.init();
  }

  init() {
    // Initialize all back in stock components on the page
    document.querySelectorAll('.klaviyo-back-in-stock').forEach(component => {
      this.initializeComponent(component);
    });
  }

  initializeComponent(component) {
    const componentId = component.dataset.klaviyoComponent;
    
    // Get elements
    const trigger = component.querySelector('.klaviyo-bis-trigger');
    const cancelBtn = component.querySelector('.klaviyo-bis-cancel');
    const retryBtn = component.querySelector('.klaviyo-bis-retry');
    const form = component.querySelector('.klaviyo-bis-subscription-form');
    const phoneInput = component.querySelector('input[name="phone"]');
    
    // Set up event listeners
    if (trigger) {
      trigger.addEventListener('click', () => this.showForm(component));
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.hideForm(component));
    }
    
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.hideError(component));
    }
    
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e, component));
    }
    
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
      phoneInput.addEventListener('blur', (e) => this.validatePhoneNumber(e));
    }
  }

  showForm(component) {
    const initialState = component.querySelector('.klaviyo-bis-initial-state');
    const formState = component.querySelector('.klaviyo-bis-form-state');
    const phoneInput = component.querySelector('input[name="phone"]');
    
    if (initialState) initialState.hidden = true;
    if (formState) formState.hidden = false;
    if (phoneInput) phoneInput.focus();
    
    // Track form open event
    this.trackEvent('Back in Stock Form Opened', {
      'Product ID': component.dataset.productId,
      'Product Name': component.dataset.productTitle,
      'Variant ID': component.dataset.variantId,
      'Context': component.dataset.context
    });
  }

  hideForm(component) {
    const initialState = component.querySelector('.klaviyo-bis-initial-state');
    const formState = component.querySelector('.klaviyo-bis-form-state');
    const form = component.querySelector('.klaviyo-bis-subscription-form');
    
    if (formState) formState.hidden = true;
    if (initialState) initialState.hidden = false;
    if (form) form.reset();
    
    this.clearValidationErrors(component);
  }

  hideError(component) {
    const formState = component.querySelector('.klaviyo-bis-form-state');
    const errorState = component.querySelector('.klaviyo-bis-error-state');
    
    if (errorState) errorState.hidden = true;
    if (formState) formState.hidden = false;
  }
  formatPhoneNumber(event) {
    const input = event.target;
    const cleaned = input.value.replace(/\D/g, '');
    
    if (cleaned.length >= 6) {
      const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      input.value = formatted.substring(0, 14); // Limit to proper length
    }
  }

  validatePhoneNumber(event) {
    const input = event.target;
    const component = input.closest('.klaviyo-back-in-stock');
    
    if (input.value && !this.isValidPhoneNumber(input.value)) {
      this.showFieldError(component, 'phone', this.errorMessages.invalidPhone);
    } else {
      this.clearFieldError(component, 'phone');
    }
  }

  isValidPhoneNumber(phone) {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  toE164(formattedPhone) {
    const cleaned = formattedPhone.replace(/\D/g, '');
    return `+1${cleaned}`;
  }

  canSubmit(productId, phoneNumber) {
    const key = `${productId}-${phoneNumber.replace(/\D/g, '')}`;
    const submissions = this.submissionCache;
    const lastSubmission = submissions[key];
    const dayInMs = 24 * 60 * 60 * 1000;
    
    return !lastSubmission || (Date.now() - lastSubmission > dayInMs);
  }

  markSubmitted(productId, phoneNumber) {
    const key = `${productId}-${phoneNumber.replace(/\D/g, '')}`;
    this.submissionCache[key] = Date.now();
    
    try {
      localStorage.setItem('klaviyo_bis_submissions', JSON.stringify(this.submissionCache));
    } catch (e) {
      console.warn('Could not save submission cache:', e);
    }
  }

  showSuccess(component) {
    const formState = component.querySelector('.klaviyo-bis-form-state');
    const successState = component.querySelector('.klaviyo-bis-success-state');
    
    if (formState) formState.hidden = true;
    if (successState) successState.hidden = false;
  }

  showError(component, message) {
    const formState = component.querySelector('.klaviyo-bis-form-state');
    const errorState = component.querySelector('.klaviyo-bis-error-state');
    const errorMessage = component.querySelector('.klaviyo-bis-error-message');
    
    if (errorMessage) errorMessage.textContent = message;
    if (formState) formState.hidden = true;
    if (errorState) errorState.hidden = false;
  }

  showFieldError(component, fieldName, message) {
    const field = component.querySelector(`input[name="${fieldName}"]`);
    const errorElement = field?.parentElement.querySelector('.field__error');
    
    if (field) field.classList.add('field__input--error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.hidden = false;
    }
  }

  clearFieldError(component, fieldName) {
    const field = component.querySelector(`input[name="${fieldName}"]`);
    const errorElement = field?.parentElement.querySelector('.field__error');
    
    if (field) field.classList.remove('field__input--error');
    if (errorElement) errorElement.hidden = true;
  }

  clearValidationErrors(component) {
    const errorFields = component.querySelectorAll('.field__input--error');
    const errorElements = component.querySelectorAll('.field__error');
    
    errorFields.forEach(field => field.classList.remove('field__input--error'));
    errorElements.forEach(error => error.hidden = true);
  }

  setLoadingState(form, loading) {
    const submitBtn = form.querySelector('.klaviyo-bis-submit');
    const btnText = submitBtn?.querySelector('.btn__text');
    const spinner = submitBtn?.querySelector('.loading-overlay__spinner');
    
    if (loading) {
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.hidden = true;
      if (spinner) spinner.classList.remove('hidden');
    } else {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.hidden = false;
      if (spinner) spinner.classList.add('hidden');
    }
  }

  trackEvent(eventName, properties) {
    // Track to Klaviyo if available
    if (window._learnq && typeof window._learnq.push === 'function') {
      window._learnq.push(['track', eventName, properties]);
    }
    
    // Also track to other analytics if available
    if (window.gtag) {
      window.gtag('event', eventName.toLowerCase().replace(/\s+/g, '_'), properties);
    }
  }

  // Utility methods to get configuration from theme settings
  getPublicApiKey() {
    const scripts = document.querySelectorAll('script');
    for (let script of scripts) {
      const content = script.textContent;
      if (content.includes('klaviyo_public_api_key')) {
        const match = content.match(/klaviyo_public_api_key['"']\s*:\s*['"']([^'"']+)['"']/);
        if (match) return match[1];
      }
    }
    return null;
  }

  getSmsMarketingListId() {
    const scripts = document.querySelectorAll('script');
    for (let script of scripts) {
      const content = script.textContent;
      if (content.includes('klaviyo_sms_marketing_list_id')) {
        const match = content.match(/klaviyo_sms_marketing_list_id['"']\s*:\s*['"']([^'"']+)['"']/);
        if (match) return match[1];
      }
    }
    return null;
  }

  getErrorMessages() {
    // Try to get from theme settings, fallback to defaults
    return {
      invalidPhone: this.getSettingValue('klaviyo_error_invalid_phone') || 'Please enter a valid mobile number',
      apiFailure: this.getSettingValue('klaviyo_error_api_failure') || 'Unable to sign you up right now. Please try again.',
      alreadySubscribed: this.getSettingValue('klaviyo_error_already_subscribed') || "You're already signed up to be notified about this item."
    };
  }

  getSettingValue(settingKey) {
    const scripts = document.querySelectorAll('script');
    for (let script of scripts) {
      const content = script.textContent;
      if (content.includes(settingKey)) {
        const match = content.match(new RegExp(`${settingKey}['"']\s*:\s*['"']([^'"']+)['"']`));
        if (match) return match[1];
      }
    }
    return null;
  }

  getSubmissionCache() {
    try {
      return JSON.parse(localStorage.getItem('klaviyo_bis_submissions') || '{}');
    } catch (e) {
      return {};
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new KlaviyoBackInStock());
} else {
  new KlaviyoBackInStock();
}

// Re-initialize for dynamic content (like variant changes)
document.addEventListener('variant:change', () => {
  // Small delay to ensure DOM updates are complete
  setTimeout(() => new KlaviyoBackInStock(), 100);
});