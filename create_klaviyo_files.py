#!/usr/bin/env python3

import os

def create_js_file():
    js_content = '''/**
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
  }'''
    
    # Write the first part
    with open('assets/klaviyo-back-in-stock.js', 'w') as f:
        f.write(js_content)
    
    print('Created JavaScript file part 1/3...')

create_js_file()
