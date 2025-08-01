#!/usr/bin/env python3

css_content = '''/* Klaviyo Back in Stock Component Styles */

.klaviyo-back-in-stock {
  width: 100%;
}

/* Form content styling */
.klaviyo-bis-form-content {
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(var(--color-foreground), 0.15);
}

.klaviyo-bis-form-header {
  margin-bottom: 1.5rem;
}

.klaviyo-bis-form-heading {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: rgb(var(--color-foreground));
}

.klaviyo-bis-form-description {
  font-size: 0.9rem;
  margin: 0;
  color: rgba(var(--color-foreground), 0.75);
  line-height: 1.4;
}

/* Form fields */
.klaviyo-bis-subscription-form .field {
  margin-bottom: 1rem;
}

.klaviyo-bis-subscription-form .field:last-of-type {
  margin-bottom: 1.5rem;
}

.klaviyo-bis-subscription-form .field__label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: rgb(var(--color-foreground));
}

.klaviyo-bis-subscription-form .field__input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(var(--color-foreground), 0.2);
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.klaviyo-bis-subscription-form .field__input:focus {
  outline: none;
  border-color: rgb(var(--color-foreground));
  box-shadow: 0 0 0 2px rgba(var(--color-foreground), 0.1);
}

.klaviyo-bis-subscription-form .field__input--error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
}

.klaviyo-bis-subscription-form .field__error {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #e74c3c;
}

/* Checkbox field styling */
.field--checkbox {
  margin-bottom: 1.5rem;
}

.field__checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.field__checkbox-input {
  margin: 0;
  position: relative;
  opacity: 0;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.field__checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.85rem;
  line-height: 1.4;
  color: rgba(var(--color-foreground), 0.8);
}

.field__checkbox-indicator {
  position: relative;
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(var(--color-foreground), 0.3);
  border-radius: 3px;
  background: rgb(var(--color-background));
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.field__checkbox-input:checked + .field__checkbox-label .field__checkbox-indicator {
  background: rgb(var(--color-foreground));
  border-color: rgb(var(--color-foreground));
}

.field__checkbox-input:checked + .field__checkbox-label .field__checkbox-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 4px;
  height: 8px;
  border: 2px solid rgb(var(--color-background));
  border-top: none;
  border-left: none;
}

.field__checkbox-input:focus + .field__checkbox-label .field__checkbox-indicator {
  box-shadow: 0 0 0 2px rgba(var(--color-foreground), 0.2);
}

/* Form actions */
.klaviyo-bis-form-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.klaviyo-bis-submit {
  position: relative;
  flex: 1;
}

.klaviyo-bis-submit .btn__text {
  transition: opacity 0.2s ease;
}

.klaviyo-bis-submit .loading-overlay__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1.5rem;
  height: 1.5rem;
}

.klaviyo-bis-submit .loading-overlay__spinner.hidden {
  display: none;
}

.klaviyo-bis-cancel {
  flex-shrink: 0;
}

/* Success state */
.klaviyo-bis-success-content {
  padding: 1rem 0;
  text-align: center;
}

.klaviyo-bis-success-message {
  font-size: 0.95rem;
  font-weight: 500;
  color: #27ae60;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

/* Error state */
.klaviyo-bis-error-state {
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(231, 76, 60, 0.3);
  background: rgba(231, 76, 60, 0.05);
}

.klaviyo-bis-error-content {
  text-align: center;
}

.klaviyo-bis-error-message {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #e74c3c;
}

.klaviyo-bis-retry {
  font-size: 0.85rem;
}

/* Spinner animation */
.spinner {
  animation: rotator 1.4s linear infinite;
}

@keyframes rotator {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }
}

.spinner .path {
  stroke-dasharray: 187;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash 1.4s ease-in-out infinite, colors 5.6s ease-in-out infinite;
}

@keyframes colors {
  0% { stroke: #4285F4; }
  25% { stroke: #DE3E35; }
  50% { stroke: #F7C223; }
  75% { stroke: #1B9A59; }
  100% { stroke: #4285F4; }
}

@keyframes dash {
  0% { stroke-dashoffset: 187; }
  50% {
    stroke-dashoffset: 46.75;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 187;
    transform: rotate(450deg);
  }
}

/* Color scheme variants */
.color-accent-1 .klaviyo-bis-form-content {
  background: rgba(var(--color-base-accent-1), 0.05);
  border-color: rgba(var(--color-base-accent-1), 0.2);
}

.color-accent-1 .field__input:focus {
  border-color: rgb(var(--color-base-accent-1));
  box-shadow: 0 0 0 2px rgba(var(--color-base-accent-1), 0.1);
}

.color-accent-1 .field__checkbox-input:checked + .field__checkbox-label .field__checkbox-indicator {
  background: rgb(var(--color-base-accent-1));
  border-color: rgb(var(--color-base-accent-1));
}

.color-accent-2 .klaviyo-bis-form-content {
  background: rgba(var(--color-base-accent-2), 0.05);
  border-color: rgba(var(--color-base-accent-2), 0.2);
}

.color-accent-2 .field__input:focus {
  border-color: rgb(var(--color-base-accent-2));
  box-shadow: 0 0 0 2px rgba(var(--color-base-accent-2), 0.1);
}

.color-accent-2 .field__checkbox-input:checked + .field__checkbox-label .field__checkbox-indicator {
  background: rgb(var(--color-base-accent-2));
  border-color: rgb(var(--color-base-accent-2));
}

/* Mobile responsiveness */
@media screen and (max-width: 749px) {
  .klaviyo-bis-form-content {
    padding: 1rem;
    margin-top: 0.75rem;
  }

  .klaviyo-bis-form-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .klaviyo-bis-form-actions .btn {
    width: 100%;
  }

  .klaviyo-bis-cancel {
    order: 2;
  }
}

/* Focus management */
.klaviyo-bis-subscription-form .field__input:focus,
.klaviyo-bis-subscription-form .field__checkbox-input:focus + .field__checkbox-label .field__checkbox-indicator {
  outline: 2px solid rgb(var(--color-foreground));
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .spinner,
  .spinner .path {
    animation: none;
  }
  
  .field__input,
  .field__checkbox-indicator,
  .btn__text {
    transition: none;
  }
}'''

with open('assets/klaviyo-back-in-stock.css', 'w') as f:
    f.write(css_content)

print('✅ CSS file created!')
