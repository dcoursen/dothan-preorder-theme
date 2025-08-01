#!/usr/bin/env python3

import json

print('Adding Klaviyo settings to theme settings...')

# Klaviyo settings to add
klaviyo_settings = {
  "name": "Klaviyo Back in Stock",
  "settings": [
    {
      "type": "header",
      "content": "Back in Stock Configuration"
    },
    {
      "type": "paragraph",
      "content": "Enable SMS notifications when sold-out products are back in stock. Requires a Klaviyo account and public API key."
    },
    {
      "type": "checkbox",
      "id": "klaviyo_back_in_stock_enabled",
      "label": "Enable Back in Stock notifications",
      "default": False
    },
    {
      "type": "text",
      "id": "klaviyo_public_api_key",
      "label": "Klaviyo Public API Key",
      "info": "Find this in your Klaviyo account under Settings > API Keys"
    },
    {
      "type": "header",
      "content": "Button & Form Settings"
    },
    {
      "type": "text",
      "id": "klaviyo_back_in_stock_button_text",
      "label": "Back in Stock Button Text",
      "default": "Notify When Available",
      "info": "Text displayed on the back in stock button"
    },
    {
      "type": "text",
      "id": "klaviyo_preorder_back_in_stock_override",
      "label": "Preorder Back in Stock Text (Optional)",
      "placeholder": "Leave blank to use default preorder text",
      "info": "Custom text for preorder products that are also sold out. If blank, uses regular preorder copy."
    },
    {
      "type": "text",
      "id": "klaviyo_back_in_stock_form_heading",
      "label": "Form Heading",
      "default": "Get notified when available",
      "info": "Heading text shown above the form"
    },
    {
      "type": "textarea",
      "id": "klaviyo_back_in_stock_form_description",
      "label": "Form Description",
      "default": "Enter your mobile number and we'll text you when this item is back in stock.",
      "info": "Description text shown in the form"
    },
    {
      "type": "text",
      "id": "klaviyo_back_in_stock_success_message",
      "label": "Success Message",
      "default": "✓ You'll be notified when available",
      "info": "Message shown after successful subscription"
    },
    {
      "type": "header",
      "content": "SMS Marketing Lists"
    },
    {
      "type": "text",
      "id": "klaviyo_back_in_stock_list_id",
      "label": "Back in Stock List ID (Optional)",
      "info": "Klaviyo list ID specifically for back in stock notifications. Leave blank to only use back in stock subscriptions."
    },
    {
      "type": "text",
      "id": "klaviyo_sms_marketing_list_id",
      "label": "SMS Marketing List ID",
      "info": "Klaviyo list ID for general SMS marketing (for the consent checkbox)"
    },
    {
      "type": "textarea",
      "id": "klaviyo_sms_consent_text",
      "label": "SMS Marketing Consent Text",
      "default": "Also send me promotional texts (optional). Msg & data rates may apply.",
      "info": "Text for the optional SMS marketing consent checkbox"
    },
    {
      "type": "header",
      "content": "Styling"
    },
    {
      "type": "select",
      "id": "klaviyo_back_in_stock_color_scheme",
      "label": "Color Scheme",
      "options": [
        { "value": "accent-1", "label": "Accent 1" },
        { "value": "accent-2", "label": "Accent 2" },
        { "value": "background-1", "label": "Background 1" },
        { "value": "background-2", "label": "Background 2" },
        { "value": "inverse", "label": "Inverse" }
      ],
      "default": "accent-1",
      "info": "Color scheme for button and form styling"
    },
    {
      "type": "header",
      "content": "Error Messages"
    },
    {
      "type": "text",
      "id": "klaviyo_error_invalid_phone",
      "label": "Invalid Phone Error",
      "default": "Please enter a valid mobile number",
      "info": "Error message for invalid phone numbers"
    },
    {
      "type": "text",
      "id": "klaviyo_error_api_failure",
      "label": "API Failure Error",
      "default": "Unable to sign you up right now. Please try again.",
      "info": "Error message when Klaviyo API fails"
    },
    {
      "type": "text",
      "id": "klaviyo_error_already_subscribed",
      "label": "Already Subscribed Error",
      "default": "You're already signed up to be notified about this item.",
      "info": "Error message when user tries to subscribe twice"
    }
  ]
}

# Read existing settings
try:
    with open('config/settings_schema.json', 'r') as f:
        settings = json.load(f)
    
    # Add Klaviyo settings
    settings.append(klaviyo_settings)
    
    # Write back to file
    with open('config/settings_schema.json', 'w') as f:
        json.dump(settings, f, indent=2)
    
    print('✅ Klaviyo settings added to settings_schema.json!')
    
except Exception as e:
    print(f'❌ Error: {e}')
    print('Please add the settings manually.')
