# Changelog

All notable changes to this theme will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-08-09

### Added
- New flexible `custom-footer` section replacing hardcoded footer
- Column-based layout system (1-4 columns) with responsive design
- Multiple footer block types:
  - Business Info (with logo, contact details)
  - Store Hours (with weekday combining option)
  - Reviews (Google, Yelp, Facebook with partial star ratings)
  - Google Map (embed or links)
  - Social Media links
  - Custom Text/HTML
  - Newsletter signup
- Column assignment for precise block placement
- Backup and deployment script (`backup-and-push.sh`)
- Theme versioning system

### Changed
- Footer is now fully customizable through Theme Customizer
- Improved review display with clickable cards and partial star fills
- Better mobile responsiveness for footer blocks

### Fixed
- Settings persistence issues with proper backup workflow
- Review star ratings now show decimal values (e.g., 4.9 stars)

### Removed
- Old hardcoded `dothan-footer` implementation (kept as backup)

## [1.0.0] - 2025-08-08

### Added
- Initial theme setup with preorder functionality
- Klaviyo BIS integration for sold-out products
- Base theme structure