#!/usr/bin/env node
/**
 * Update theme name across all necessary files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const NEW_THEME_NAME = "Retail Savage Preorder Template";
const VERSION = "1.0.0";

console.log(`🎯 Updating theme name to: ${NEW_THEME_NAME} v${VERSION}\n`);

// Files to update
const filesToUpdate = [
  {
    path: 'config/settings_schema.json',
    updates: [
      {
        find: /"theme_name":\s*"[^"]+"/,
        replace: `"theme_name": "${NEW_THEME_NAME}"`
      },
      {
        find: /"theme_version":\s*"[^"]+"/,
        replace: `"theme_version": "${VERSION}"`
      }
    ]
  },
  {
    path: 'layout/theme.liquid',
    updates: [
      {
        find: /<!--\s*Theme:\s*[^-]+-->/,
        replace: `<!-- Theme: ${NEW_THEME_NAME} v${VERSION} -->`
      }
    ]
  },
  {
    path: 'package.json',
    updates: [
      {
        find: /"name":\s*"[^"]+"/,
        replace: `"name": "retail-savage-preorder-template"`
      },
      {
        find: /"version":\s*"[^"]+"/,
        replace: `"version": "${VERSION}"`
      },
      {
        find: /"description":\s*"[^"]+"/,
        replace: `"description": "${NEW_THEME_NAME} - Professional Shopify theme with preorder functionality"`
      }
    ]
  }
];

// Update files
filesToUpdate.forEach(({ path: filePath, updates }) => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`📝 Updating ${filePath}...`);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    updates.forEach(({ find, replace }) => {
      if (find.test(content)) {
        content = content.replace(find, replace);
        console.log(`   ✅ Updated: ${replace}`);
      }
    });
    
    fs.writeFileSync(fullPath, content);
  } else {
    console.log(`   ⚠️  File not found: ${filePath}`);
  }
});

// Add theme info to settings_schema.json if it doesn't exist
const settingsSchemaPath = path.join(__dirname, '../config/settings_schema.json');
if (fs.existsSync(settingsSchemaPath)) {
  const settingsSchema = JSON.parse(fs.readFileSync(settingsSchemaPath, 'utf8'));
  
  // Check if theme info section exists
  const themeInfoSection = settingsSchema.find(section => section.name === 'theme_info');
  
  if (!themeInfoSection) {
    console.log('\n📝 Adding theme info section to settings_schema.json...');
    
    settingsSchema.unshift({
      "name": "theme_info",
      "settings": [
        {
          "type": "paragraph",
          "content": "Theme: Retail Savage Preorder Template"
        },
        {
          "type": "paragraph",
          "content": "Version: 1.0.0"
        },
        {
          "type": "paragraph",
          "content": "Support: support@retailsavage.com"
        },
        {
          "type": "paragraph",
          "content": "Documentation: [View Documentation](https://docs.retailsavage.com/preorder-template)"
        }
      ]
    });
    
    fs.writeFileSync(settingsSchemaPath, JSON.stringify(settingsSchema, null, 2));
    console.log('   ✅ Theme info section added');
  }
}

// Create a version file in assets
const versionFilePath = path.join(__dirname, '../assets/theme-version.txt');
fs.writeFileSync(versionFilePath, `${NEW_THEME_NAME}\nVersion: ${VERSION}\nRelease Date: ${new Date().toISOString().split('T')[0]}`);
console.log('\n📝 Created theme version file in assets');

// Update theme in Shopify (if connected)
console.log('\n🔄 Updating theme name in Shopify...');
console.log('   Note: You\'ll need to update the theme name in Shopify admin manually');
console.log('   Go to: Online Store > Themes > Actions > Rename');
console.log(`   New name: ${NEW_THEME_NAME} v${VERSION}`);

console.log('\n✅ Theme name update complete!');
console.log('\n📋 Next steps:');
console.log('1. Commit these changes: git add . && git commit -m "chore: Rename theme to Retail Savage Preorder Template v1.0.0"');
console.log('2. Tag this version: git tag -a v1.0.0 -m "Release version 1.0.0"');
console.log('3. Push changes: git push && git push --tags');
console.log('4. Update theme name in Shopify admin for each client');