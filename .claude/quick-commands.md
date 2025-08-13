# Quick Commands Reference

## Overview
Simple commands to quickly route tasks to the right agent or coordinate multiple agents. Use these with Claude Code for efficient workflows.

## Basic Commands

### Product Management Commands

#### `plan feature: [description]`
Routes to Product Manager for feature specification
```bash
claude-code "plan feature: customer loyalty rewards program"
claude-code "plan feature: size chart recommendations"
```

#### `user story: [scenario]`
Creates user stories for a specific scenario
```bash
claude-code "user story: customer wants to preorder out-of-stock items"
claude-code "user story: merchant needs inventory forecasting"
```

#### `metrics for: [feature]`
Defines success metrics and KPIs
```bash
claude-code "metrics for: preorder conversion optimization"
claude-code "metrics for: cart abandonment reduction"
```

### Technical Commands

#### `review code: [file or code]`
Routes to Shopify Expert for code review
```bash
claude-code "review code: snippets/preorder-logic.liquid"
claude-code "review code: new checkout customization"
```

#### `debug: [issue]`
Technical troubleshooting assistance
```bash
claude-code "debug: cart attributes not saving"
claude-code "debug: metafield not displaying on product page"
```

#### `optimize: [component]`
Performance and code optimization
```bash
claude-code "optimize: product form JavaScript"
claude-code "optimize: collection page load time"
```

### Multi-Agent Commands

#### `new feature workflow: [idea]`
Coordinates all agents for complete feature development
```bash
claude-code "new feature workflow: gift message functionality"
# Results in:
# 1. PM: Feature spec and requirements
# 2. Expert: Technical feasibility and approach
# 3. Both: Implementation plan with timeline
```

#### `analyze impact: [change]`
Assesses both business and technical impact
```bash
claude-code "analyze impact: switching to headless architecture"
claude-code "analyze impact: adding subscription model"
```

#### `full review: [feature/file]`
Comprehensive review from all perspectives
```bash
claude-code "full review: current preorder implementation"
claude-code "full review: checkout customizations"
```

## Advanced Commands

### Contextual Commands

#### `improve ux: [current file/feature]`
Enhances user experience of current context
```bash
# When viewing product-form.js
claude-code "improve ux: current implementation"
```

#### `add to current: [functionality]`
Extends current file/feature with new capability
```bash
# When working on preorder logic
claude-code "add to current: inventory threshold warnings"
```

### Workflow Commands

#### `sprint plan: [goal]`
Creates actionable sprint plan
```bash
claude-code "sprint plan: launch preorder campaign features"
# Outputs:
# - Prioritized task list
# - Technical requirements
# - Time estimates
```

#### `test plan: [feature]`
Comprehensive testing strategy
```bash
claude-code "test plan: preorder checkout flow"
# Outputs:
# - Test scenarios
# - Edge cases
# - Browser matrix
```

### Klaviyo Marketing Commands

#### `email campaign: [campaign type]`
Routes to Klaviyo Expert for email campaign creation
```bash
claude-code "email campaign: spring bulb preorder launch"
claude-code "email campaign: abandoned cart for wholesale"
```

#### `segment: [customer group]`
Creates customer segmentation strategy
```bash
claude-code "segment: high-value preorder customers"
claude-code "segment: dormant fall shoppers"
```

#### `email flow: [trigger]`
Designs automated email flows
```bash
claude-code "email flow: back-in-stock for perennials"
claude-code "email flow: post-purchase care guides"
```

### Garden Center Commands

#### `seasonal plan: [season]`
Routes to Garden Center Specialist for seasonal strategy
```bash
claude-code "seasonal plan: spring 2024 bulb preorders"
claude-code "seasonal plan: fall mum varieties"
```

#### `plant info: [product/category]`
Get horticultural and merchandising guidance
```bash
claude-code "plant info: tulip bulb sizing standards"
claude-code "plant info: shade perennial bestsellers"
```

#### `b2b strategy: [topic]`
Wholesale and landscaper focused planning
```bash
claude-code "b2b strategy: contractor pricing tiers"
claude-code "b2b strategy: bulk order minimums"
```

### Analytics Commands

#### `analyze: [metric/area]`
Routes to Analytics Specialist for data analysis
```bash
claude-code "analyze: preorder conversion by category"
claude-code "analyze: customer lifetime value trends"
```

#### `dashboard: [type]`
Creates performance tracking dashboards
```bash
claude-code "dashboard: weekly preorder performance"
claude-code "dashboard: seasonal sales comparison"
```

#### `forecast: [what to predict]`
Predictive analytics and projections
```bash
claude-code "forecast: spring bulb demand by variety"
claude-code "forecast: revenue impact of early bird pricing"
```

## Command Shortcuts

### Quick Prefixes
- `pm:` → Routes to Product Manager
- `tech:` → Routes to Shopify Expert
- `klaviyo:` → Routes to Klaviyo Expert
- `garden:` → Routes to Garden Center Specialist
- `data:` → Routes to Analytics Specialist
- `all:` → Routes to all relevant agents

```bash
claude-code "pm: prioritize backlog items"
claude-code "tech: best way to handle variant metafields"
claude-code "klaviyo: optimize preorder announcement flow"
claude-code "garden: fall mum variety recommendations"
claude-code "data: conversion rate by traffic source"
claude-code "all: review new wishlist feature"
```

### Urgent Prefixes
- `urgent:` → High priority routing
- `bug:` → Immediate technical attention
- `blocked:` → Requires immediate unblocking

```bash
claude-code "urgent: checkout button not working"
claude-code "bug: preorder dates showing incorrectly"
claude-code "blocked: need Klaviyo API approach"
```

## Composite Commands

### Feature Development Flow
```bash
# Step 1: Initial planning
claude-code "plan feature: bundle builder"

# Step 2: Technical review
claude-code "tech feasibility: bundle builder with current theme"

# Step 3: Full implementation
claude-code "implement: bundle builder based on spec"

# Step 4: Review and optimize
claude-code "full review: bundle builder implementation"
```

### Garden Center Workflows
```bash
# Preorder Launch Workflow
claude-code "seasonal plan: spring bulb preorders"
claude-code "email campaign: early bird bulb announcement"
claude-code "analyze: last year's bulb preorder performance"

# B2B Portal Setup
claude-code "b2b strategy: wholesale customer portal"
claude-code "tech: implement customer tagging for wholesale"
claude-code "klaviyo: create B2B specific email flows"
```

### Data-Driven Optimization
```bash
# Conversion Optimization Sprint
claude-code "analyze: current preorder funnel drop-offs"
claude-code "pm: prioritize conversion improvements"
claude-code "tech: implement A/B test for checkout flow"
claude-code "dashboard: conversion tracking setup"
```

### Quick Fixes
```bash
# For styling issues
claude-code "fix style: preorder button mobile view"

# For functionality bugs
claude-code "fix bug: variant selection resets preorder date"

# For integration issues
claude-code "fix integration: Klaviyo not receiving preorder tags"
```

## Best Practices

### 1. Command Structure
- Keep commands concise but descriptive
- Include file paths when referring to specific code
- Mention constraints or requirements

### 2. Context Matters
```bash
# Good: Provides context
claude-code "review code: checkout modifications for B2B customers"

# Less helpful: Too vague
claude-code "review code: checkout"
```

### 3. Chaining Commands
Use commands in sequence for complex tasks:
```bash
claude-code "plan feature: quantity breaks"
claude-code "tech approach: implementing quantity breaks"
claude-code "implement: quantity breaks phase 1"
```

### 4. Including Examples
When helpful, include examples in your command:
```bash
claude-code "implement: shipping calculator like example.com/cart"
claude-code "style: match button style from main navigation"
```

## Custom Commands

You can create your own command patterns:
```bash
# Your common workflows
claude-code "my workflow: daily standup review"
claude-code "my check: pre-deployment validation"

# Project-specific commands
claude-code "horizon: update preorder messaging"
claude-code "horizon: test all integrations"
```

## Troubleshooting Commands

```bash
# When things aren't working
claude-code "diagnose: what's wrong with [feature]"
claude-code "explain: why is [behavior] happening"
claude-code "alternatives: other ways to implement [feature]"
```