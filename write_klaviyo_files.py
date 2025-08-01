#!/usr/bin/env python3

# This script writes all the Klaviyo integration files

print('Writing Klaviyo Back in Stock files...')

# Read the current JS file and append the rest
with open('assets/klaviyo-back-in-stock.js', 'r') as f:
    current_content = f.read()

# The remaining JavaScript methods
remaining_js = '''
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
        const match = content.match(/klaviyo_public_api_key['\"']\s*:\s*['\"']([^'\"']+)['\"']/);
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
        const match = content.match(/klaviyo_sms_marketing_list_id['\"']\s*:\s*['\"']([^'\"']+)['\"']/);
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
        const match = content.match(new RegExp(`${settingKey}['\"']\\s*:\\s*['\"']([^'\"']+)['\"']`));
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
});'''

# Write the complete JavaScript file
with open('assets/klaviyo-back-in-stock.js', 'w') as f:
    f.write(current_content + remaining_js)

print('✅ JavaScript file completed!')
