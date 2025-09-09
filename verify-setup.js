require('dotenv').config();

console.log('🔍 Verifying Test Setup...\n');

console.log('✅ Environment Variables Loaded:');
console.log(`   Store: ${process.env.SHOPIFY_STORE_URL}`);
console.log(`   Preorder Product: ${process.env.PREORDER_PRODUCT}`);
console.log(`   Regular Product: ${process.env.REGULAR_PRODUCT}`);
console.log(`   Klaviyo Form: ${process.env.KLAVIYO_FORM_ID}\n`);

console.log('📋 Test URLs:');
console.log(`   Preorder: ${process.env.SHOPIFY_STORE_URL}/products/${process.env.PREORDER_PRODUCT}`);
console.log(`   Regular: ${process.env.SHOPIFY_STORE_URL}/products/${process.env.REGULAR_PRODUCT}\n`);

console.log('🚀 Next Steps:');
console.log('1. Run a quick test: ./test-preorder.sh --headed');
console.log('2. Run all tests: npm test');
console.log('3. Check screenshots in tests/screenshots/ if tests fail\n');

console.log('⚠️  Important:');
console.log('- Ensure the preorder product (red spider lily) is sold out');
console.log('- Ensure it has a future drop date set in metafields');
console.log('- Ensure the regular product (yellow spider lily) is in stock\n');