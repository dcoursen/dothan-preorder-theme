# Horizon Theme - Multi-Client Management System

A Shopify Horizon theme with preorder functionality and multi-client management capabilities.

## 📚 Documentation

- **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - Quick commands and daily workflow
- **[THEME-MANAGEMENT-GUIDE.md](THEME-MANAGEMENT-GUIDE.md)** - Complete theme management documentation
- **[MULTI-CLIENT-WORKFLOW.md](MULTI-CLIENT-WORKFLOW.md)** - Multi-client development workflow
- **[WORKFLOW.md](WORKFLOW.md)** - Development workflow and best practices
- **[CLAUDE.md](CLAUDE.md)** - AI assistant documentation

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/dcoursen/dothan-preorder-theme.git
cd dothan-preorder-theme

# Install dependencies
npm install

# Setup development environment
./scripts/setup.sh

# Start development
shopify theme dev --store=your-store.myshopify.com
```

## 🌟 Features

- **Preorder Functionality** - Smart availability dates for out-of-stock products
- **Klaviyo Integration** - Back in Stock notifications
- **Multi-Client Support** - Manage multiple client themes from one codebase
- **Automated Backups** - Daily backup system with restoration
- **Theme Update Tools** - Migrate customizations when Shopify updates themes
- **E2E Testing** - Puppeteer test suite
- **CI/CD Pipeline** - GitHub Actions for automated deployment

## 🏗️ Architecture

```
main (production-ready)
├── feature/base-theme (shared features)
│   ├── feature/client-dothan
│   ├── feature/client-xyz
│   └── feature/client-abc
└── feature/preorder-functionality
```

## 🛠️ Key Scripts

### Backup & Recovery
```bash
# Backup all clients
node scripts/backup-all-clients.js

# Analyze customizations
node scripts/analyze-customizations.js

# Migrate to new theme version
node scripts/migrate-customizations.js --source=base --target=new-theme
```

### Development
```bash
# Run tests
npm test

# Start dev server
npm run dev

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## 📦 Client Management

Each client has:
- Dedicated branch (`feature/client-{name}`)
- Configuration file (`config/clients/{name}.json`)
- Custom sections/snippets
- Automated backups
- Independent deployment

## 🔄 Theme Updates

When Shopify releases a new Horizon version:

1. **Backup** - `node scripts/backup-all-clients.js`
2. **Analyze** - `node scripts/analyze-customizations.js`
3. **Migrate** - `node scripts/migrate-customizations.js`
4. **Test** - Deploy to staging and verify
5. **Deploy** - Push to production themes

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with browser visible
npm run test:headed

# Debug tests
npm run test:debug
```

## 📝 Configuration

### Environment Variables
```bash
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_CLI_THEME_TOKEN=shptka_xxxxx
PREORDER_PRODUCT=product-handle
KLAVIYO_FORM_ID=form-id
```

### Client Configuration
```json
{
  "client": "dothan",
  "store_url": "store.myshopify.com",
  "customizations": {
    "preorder": true,
    "custom_footer": true
  }
}
```

## 🤝 Contributing

1. Create feature branch from `feature/base-theme`
2. Make changes and test
3. Submit PR with description
4. Ensure tests pass
5. Get review and merge

## 📄 License

Private repository - see LICENSE file

## 🆘 Support

- GitHub Issues: [Create Issue](https://github.com/dcoursen/dothan-preorder-theme/issues)
- Documentation: See `/docs` folder
- Shopify Partner Support

---

Last Updated: 2025-08-09