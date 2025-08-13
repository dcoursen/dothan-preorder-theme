# Agent Controller System

## Overview
This controller routes questions and tasks to the appropriate specialist agents based on the request type and complexity. It can coordinate multiple agents for comprehensive solutions.

## How It Works

### 1. Request Analysis
When you submit a request, the controller:
- Identifies key terms and context
- Determines the primary domain (product, technical, or both)
- Selects appropriate agent(s)
- Coordinates multi-agent responses if needed

### 2. Agent Selection Logic

```
Request Type → Agent(s) Selected
─────────────────────────────────
Feature Planning → Product Manager
User Stories → Product Manager
Success Metrics → Product Manager + Analytics Specialist

Liquid Code → Shopify Expert
Theme Issues → Shopify Expert  
Integration Help → Shopify Expert

Email/SMS Campaigns → Klaviyo Expert
Marketing Automation → Klaviyo Expert
Customer Segmentation → Klaviyo Expert + Analytics Specialist

Garden/Plant Questions → Garden Center Specialist
Seasonal Planning → Garden Center Specialist + Product Manager
B2B/Wholesale → Garden Center Specialist

Data Analysis → Analytics Specialist
Conversion Optimization → Analytics Specialist + Product Manager
Performance Metrics → Analytics Specialist

Full Feature → Product Manager + Shopify Expert + Relevant Specialists
Code Review → Shopify Expert (+ Product Manager for UX)
Architecture → Shopify Expert + Product Manager
```

### 3. Routing Rules

#### Single Agent Routes
**To Product Manager:**
- Keywords: plan, feature, user story, requirements, metrics, KPI, prioritize
- Questions about: user experience, business value, success criteria
- Tasks: creating specifications, defining acceptance criteria

**To Shopify Expert:**
- Keywords: liquid, theme, code, integration, API, metafield, JavaScript
- Questions about: implementation, debugging, performance, Shopify limits
- Tasks: code review, technical solutions, troubleshooting

**To Klaviyo Expert:**
- Keywords: email, SMS, campaign, flow, automation, segmentation, klaviyo
- Questions about: email marketing, back-in-stock notifications, customer engagement
- Tasks: flow optimization, campaign planning, list growth strategies

**To Garden Center Specialist:**
- Keywords: plant, garden, seasonal, preorder, wholesale, B2B, nursery, bulb
- Questions about: inventory planning, seasonal trends, plant care, pricing strategies
- Tasks: seasonal planning, product categorization, B2B workflows

**To Analytics Specialist:**
- Keywords: data, analytics, conversion, metrics, ROI, performance, tracking
- Questions about: customer behavior, sales patterns, forecasting, optimization
- Tasks: dashboard creation, performance analysis, A/B testing

#### Multi-Agent Coordination
**Common Combinations:**
- Preorder Feature: Product Manager + Garden Center Specialist + Shopify Expert
- Email Strategy: Klaviyo Expert + Analytics Specialist + Garden Center Specialist
- Seasonal Planning: Garden Center Specialist + Analytics Specialist + Product Manager
- Full Stack Implementation: All agents collaborate based on feature complexity

## Usage Examples

### Example 1: Simple Technical Question
```
User: "How do I add a custom metafield to track preorder dates?"

Controller: → Routes to Shopify Expert
Response: Technical implementation with Liquid code examples
```

### Example 2: Feature Planning
```
User: "Plan a feature for limiting preorder quantities per customer"

Controller: → Routes to Product Manager
Response: User stories, requirements, success metrics
```

### Example 3: Complex Feature Request
```
User: "I need to implement a waitlist feature that integrates with Klaviyo"

Controller: → Routes to Both Agents
PM Response: Feature spec, user flows, success criteria
Expert Response: Technical implementation, Klaviyo integration details
```

### Example 4: Email Campaign Planning
```
User: "Create a spring bulb preorder email campaign"

Controller: → Routes to Klaviyo Expert + Garden Center Specialist
Klaviyo Expert: Campaign structure, segmentation, automation flows
Garden Center: Seasonal timing, product highlights, customer education
```

### Example 5: Analytics Request
```
User: "Analyze our preorder conversion rates by product category"

Controller: → Routes to Analytics Specialist
Response: Conversion funnel analysis, category performance, optimization recommendations
```

### Example 6: Multi-Agent Coordination
```
User: "Plan and implement a B2B wholesale portal with tiered pricing"

Controller: → Routes to All Relevant Agents
Garden Center: B2B requirements, pricing tiers, industry standards
PM: User stories, portal features, success metrics
Shopify Expert: Technical implementation, customer tagging, price lists
Analytics: B2B metrics tracking, ROI measurement
```

## Integration with Claude Code

### Using with Commands
```bash
# Direct routing
claude-code "Ask product manager: How should we prioritize these features?"
claude-code "Ask shopify expert: Review this checkout customization"

# Using quick commands (see quick-commands.md)
claude-code "plan feature: customer wishlist"
claude-code "review code: snippets/preorder-logic.liquid"
```

### Context Awareness
The controller considers:
- Current file context (viewing .liquid files → technical focus)
- Recent conversation history
- Project state (git status, recent changes)
- Explicit routing requests

### Best Practices

1. **Be Specific**: Include context about what you're trying to achieve
2. **Use Commands**: Leverage quick commands for common tasks
3. **Provide Examples**: Include code snippets or mockups when relevant
4. **State Constraints**: Mention any limitations or requirements upfront

## Advanced Usage

### Chained Requests
```
1. "Plan feature: advanced inventory management"
   → PM creates specification
   
2. "Now implement the inventory tracking part"
   → Expert implements based on PM spec
   
3. "Review and optimize the implementation"
   → Both review for UX and technical quality
```

### Context Switching
```
# Switch from technical to product focus
"From a product perspective, how does this impact conversion?"

# Switch from product to technical
"What's the technical feasibility of this requirement?"
```

### Emergency Routing
For urgent issues, prefix with priority:
- "URGENT: Production bug with preorder button"
- "HIGH PRIORITY: Customer can't complete checkout"

## Troubleshooting

**Controller not routing correctly?**
- Use explicit routing: "Ask [agent]: [question]"
- Provide more context about the domain
- Check if question spans multiple domains

**Need different perspective?**
- Request specific agent: "Get shopify expert's opinion on this"
- Ask for multi-agent review: "I need both technical and product input"

**Complex coordination needed?**
- Break down into steps
- Use the feature workflow command
- Explicitly state which aspects need which expertise