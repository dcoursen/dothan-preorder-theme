# Modern Garden Center Preorder Display - Integration Guide

## Overview

This modern preorder display component creates a premium, garden center-themed user experience for preorder products. It features:

- 🌱 Garden center aesthetic with natural colors and modern typography
- ⏰ Smart countdown timer for upcoming releases
- 📅 Intelligent date formatting (e.g., "Available this Friday @ 2:00PM EST")
- 📱 Fully responsive design with mobile optimization
- ♿ Accessibility compliant (WCAG 2.1 AA)
- 🎨 Supports dark mode and high contrast modes

## Integration Methods

### Method 1: Block-Based Integration (Recommended)

Add the preorder display as a block in your product template:

1. **Add to Product Template** (`templates/product.json`):
```json
{
  "type": "preorder-display",
  "settings": {
    "enable_preorder_display": true,
    "show_when_available": false,
    "margin-block-start": 16,
    "margin-block-end": 16
  }
}
```

2. **Position in Product Layout**:
   - Best placement: After product title, before price
   - Alternative: Before buy buttons
   - Mobile: Stacks nicely in single column layout

### Method 2: Direct Snippet Integration

Include the snippet directly in your product template or section:

```liquid
<!-- Add after product title -->
<div class="product__title">
  <h1>{{ product.title }}</h1>
</div>

<!-- Preorder Display Component -->
{% render 'preorder-display' %}

<!-- Continue with price, description, etc. -->
<div class="product__price">
  <!-- Price content -->
</div>
```

### Method 3: Enhanced Buy Buttons Integration

The component automatically integrates with your existing buy-buttons logic. When a preorder drop date is in the future, it will:

1. Show the preorder display component
2. Modify buy button text to indicate availability date
3. Disable add to cart until drop date passes

## Required Metafields

Set up these metafields in your Shopify admin:

### 1. Preorder Drop Date
- **Namespace**: `custom`
- **Key**: `preorder_drop_date`
- **Type**: Date and time
- **Description**: When the product becomes available for purchase

### 2. Preorder Pickup Start (Optional)
- **Namespace**: `custom`
- **Key**: `preorder_pickup_start`
- **Type**: Date and time
- **Description**: When customers can start picking up their orders

### 3. Pickup Duration Days (Optional)
- **Namespace**: `custom`
- **Key**: `pickup_duration_days`
- **Type**: Number (integer)
- **Description**: How many days the pickup window lasts (default: 14 days)

## Customization Options

### Visual Customization

The component uses CSS custom properties for easy theming:

```css
.preorder-display {
  /* Colors - customize for your brand */
  --preorder-primary-color: rgb(76, 124, 76);
  --preorder-secondary-color: rgb(186, 220, 186);
  --preorder-background: rgb(248, 253, 248);
  --preorder-accent: rgb(220, 101, 101);
  
  /* Typography */
  --preorder-title-size: clamp(1.125rem, 2.5vw, 1.375rem);
  --preorder-body-size: clamp(0.95rem, 2vw, 1.05rem);
  
  /* Spacing */
  --preorder-padding: clamp(1.25rem, 4vw, 2rem);
  --preorder-border-radius: clamp(12px, 2vw, 16px);
}
```

### Content Customization

Modify the text in the snippet (`snippets/preorder-display.liquid`):

```liquid
<!-- Line 94: Customize the main title -->
<h3 class="preorder-display__title">Early Access Coming Soon</h3>

<!-- Line 99: Customize the badge text -->
<span class="preorder-display__badge-text">New Arrival</span>

<!-- Line 109: Customize pickup title -->
<h3 class="preorder-display__title">Ready for Pickup</h3>
```

## Smart Date Formatting Examples

The component intelligently formats dates based on proximity:

- **Same day**: "Available in 3 hours" or "Available today at 2:00PM EST"
- **Next day**: "Available tomorrow at 9:00AM EST"
- **This week**: "Available this Friday at 2:00PM EST"
- **Future dates**: "Available March 15 at 10:00AM EST"

## Countdown Timer

The countdown timer automatically:
- Updates every minute
- Shows days, hours, and minutes until drop
- Refreshes the page when countdown reaches zero
- Gracefully handles timezone differences

## Responsive Design Features

- **Desktop**: Two-column layout with icon and content
- **Mobile**: Single-column centered layout
- **Touch-friendly**: Adequate touch targets for mobile users
- **Performance**: Minimal JavaScript, CSS-only animations

## Accessibility Features

- **Screen readers**: Proper ARIA labels and semantic HTML
- **High contrast**: Automatically adapts to high contrast mode
- **Reduced motion**: Respects user's motion preferences
- **Color contrast**: WCAG 2.1 AA compliant color ratios
- **Keyboard navigation**: Fully accessible via keyboard

## Theme Integration Notes

This component is designed to work seamlessly with the Clean Horizon theme:

- Uses existing CSS custom properties for consistency
- Follows the theme's spacing and typography patterns
- Integrates with the product form component
- Maintains theme's responsive breakpoints

## Testing Checklist

Before going live, test:

- [ ] Countdown timer accuracy across timezones
- [ ] Mobile responsiveness on various screen sizes
- [ ] Dark mode appearance (if your theme supports it)
- [ ] Screen reader compatibility
- [ ] Performance impact (should be minimal)
- [ ] Integration with existing buy button logic

## Troubleshooting

### Common Issues

1. **Component not showing**: Check that metafields are properly set up and contain valid dates
2. **Styling conflicts**: Ensure CSS custom properties don't conflict with theme styles
3. **Mobile layout issues**: Test responsive design and adjust spacing if needed
4. **Countdown not updating**: Check JavaScript console for errors

### Debug Mode

Add this to enable debug information:

```liquid
<!-- Add at the top of preorder-display.liquid -->
{%- assign debug_mode = true -%}

{%- if debug_mode -%}
  <div style="background: yellow; padding: 10px; margin: 10px 0; font-size: 12px;">
    DEBUG: Drop Date: {{ preorder_drop_date }}<br>
    Current Time: {{ 'now' | date: '%Y-%m-%d %H:%M:%S' }}<br>
    Is Coming Soon: {{ is_coming_soon }}<br>
    Show Pickup: {{ show_pickup_info }}
  </div>
{%- endif -%}
```

## Performance Considerations

- **CSS**: Minimal impact, uses efficient selectors
- **JavaScript**: Lightweight, only runs when component is present
- **Images**: No external images, uses inline SVG icons
- **Network**: No external dependencies

## Future Enhancements

Consider these enhancements for v2:

- Email notification signup integration
- Social sharing for preorder announcements
- Advanced animation options
- Integration with inventory tracking
- Multi-language support for date formatting