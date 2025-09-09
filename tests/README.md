# Preorder Feature - E2E Testing with Puppeteer

This directory contains end-to-end tests for the preorder functionality using Puppeteer and Jest.

## Setup

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure your test environment**:
   Create a `.env` file in the project root:
   ```bash
   SHOPIFY_STORE_URL=https://your-store.myshopify.com
   SHOPIFY_STORE_PASSWORD=yourpassword  # Only if store is password-protected
   PREORDER_PRODUCT=your-preorder-product-handle
   REGULAR_PRODUCT=your-regular-product-handle
   ```

3. **Update test configuration**:
   Edit `tests/e2e/helpers.js` to set your store URL and product handles.

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with visible browser (non-headless):
```bash
npm run test:headed
```

### Debug tests:
```bash
npm run test:debug
```

### Run tests in CI mode:
```bash
npm run test:ci
```

## Test Structure

- `e2e/preorder.test.js` - Basic preorder functionality tests
- `e2e/preorder-improved.test.js` - Comprehensive tests with better error handling
- `e2e/helpers.js` - Common utilities and configuration
- `screenshots/` - Test screenshots are saved here

## What's Being Tested

1. **Preorder Date Display**
   - Shows preorder date for sold-out products with future drop dates
   - Doesn't show for regular in-stock products
   - Correct date formatting (within 7 days vs beyond)

2. **Back in Stock (BIS) Integration**
   - "Get Early Access" button appears for preorder products
   - Original add-to-cart button is hidden
   - Klaviyo integration triggers correctly

3. **Responsive Design**
   - Mobile viewport testing
   - Proper styling at different screen sizes

4. **Edge Cases**
   - Missing metafields handling
   - JavaScript error handling
   - Performance benchmarks

## Debugging Failed Tests

1. **Check screenshots**: Look in `tests/screenshots/` for visual debugging
2. **Console errors**: Tests log browser console errors automatically
3. **Network failures**: Failed requests are logged to console
4. **Run headed mode**: Use `npm run test:headed` to watch tests execute

## Writing New Tests

Example test structure:
```javascript
test('should do something', async () => {
  // Navigate to page
  await page.goto(getProductUrl('product-handle'));
  
  // Wait for elements
  await waitForPreorderElements(page);
  
  // Make assertions
  const element = await page.$('.selector');
  expect(element).toBeTruthy();
  
  // Take screenshot for debugging
  await takeScreenshot(page, 'test-name');
});
```

## CI/CD Integration

For GitHub Actions, add to `.github/workflows/test.yml`:
```yaml
- name: Run E2E tests
  env:
    SHOPIFY_STORE_URL: ${{ secrets.SHOPIFY_STORE_URL }}
    SHOPIFY_STORE_PASSWORD: ${{ secrets.SHOPIFY_STORE_PASSWORD }}
  run: npm run test:ci
```