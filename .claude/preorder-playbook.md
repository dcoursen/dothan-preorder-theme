# Garden Center Preorder Playbook
*Based on the Retail Savage Framework for Identity-Driven Commerce*

## SECTION 1: BUSINESS MODEL

### Core Philosophy: Identity-Driven Preorders
We don't sell plants because we have inventory. We create preorder campaigns that allow customers to express their gardening identity and aspirations. Each drop is a chance to belong to an exclusive community of garden enthusiasts.

### Key Business Metrics
- **Primary Goal**: Drive identity and belonging through exclusive preorder access
- **Attach Rate Target**: 25-40% at pickup (industry-leading is 40%+)
- **Average Attach Value**: $85 per pickup transaction
- **Pickup Conversion**: Transform logistics into a second sales opportunity
- **Customer Lifetime Value**: 3+ years through seasonal habit creation

### Weekly Drop Strategy
```
Monday: Tease upcoming drop (email/SMS to VIPs)
Wednesday: Early access launch (top 20% customers)
Thursday: General launch with urgency messaging
Friday-Saturday: Peak engagement window
Sunday: Last chance messaging
Monday: Waitlist opens for sold-out items
```

### Seasonal Excitement Calendar
- **January**: Spring bulb preorders launch ("New Year, New Garden")
- **March**: Early perennial availability ("First Signs of Spring")
- **May**: Summer plant collections ("Garden Party Season")
- **July**: Fall preorder launch ("Autumn Color Preview")
- **September**: Mum madness ("Fall Festival")
- **November**: Holiday plants ("Seasonal Centerpieces")

## SECTION 2: CUSTOMER JOURNEY FRAMEWORK

### 1. Back Pressure: Build Emotional Demand
**Goal**: Create anticipation and FOMO before launch

**Tactics**:
- Sneak peeks of growers selecting varieties
- "Behind the scenes" content showing plant preparation
- Customer photos from previous years
- Countdown timers to drop date
- VIP early access promises

**Messaging Examples**:
- "Our buyer just secured only 500 of these rare tulips..."
- "Last year's Café au Lait dahlias sold out in 3 hours"
- "Your exclusive preview as a Garden VIP member"

### 2. The Open: Launch with Urgency & Exclusivity
**Goal**: Create immediate action through scarcity and belonging

**Launch Sequence**:
1. VIP SMS: "Your early access is LIVE - shop 2 hours before everyone"
2. VIP Email: Subject: "🌷 Your Garden VIP Access Opens Now"
3. Social proof: "137 Garden VIPs shopping now"
4. Inventory meters: "Only 67 left of 200"

**Technical Elements**:
- Countdown timer to general launch
- Live inventory updates
- "Others viewing" indicators
- VIP badge display

### 3. The Campaign: Sustain Interest
**Goal**: Keep momentum through the sales window

**Daily Touchpoints**:
- Day 1: Launch excitement + early bird success
- Day 2: Social proof + customer stories
- Day 3: Feature specific varieties
- Day 4: Planting guides + expert tips
- Day 5: Inventory warnings
- Day 6: Last chance + waitlist opens

**Content Mix**:
- 40% Product highlights
- 30% Educational content
- 20% Social proof
- 10% Urgency messaging

### 4. The Close: Urgent Call-to-Action
**Goal**: Convert fence-sitters with authentic urgency

**Final 48 Hours**:
- Segmented messaging based on engagement
- Abandoned cart recovery with inventory warnings
- "Your garden designer picks" personalized recommendations
- Waitlist positioning for sold-out items

**Copy Examples**:
- "24 hours left: Your spring garden awaits"
- "Almost gone: Only 12 Coral Charm peonies remain"
- "Join 1,847 gardeners who ordered this week"

### 5. Pickup Moment: Deliver Joy & Upsell
**Goal**: Transform logistics into a branded experience with 40% attach rate

**Pickup Experience Design**:
- Staged pickup area with complementary products
- "Pickup specials" exclusive to in-person customers
- Staff trained as "garden consultants" not just order fulfillers
- Surprise & delight elements (free plant markers, care guides)

**Attach Product Strategy**:
- Soil amendments next to bulbs
- Planters beside perennials  
- Tools near vegetable starts
- "Complete your garden" bundles

**Staff Scripts**:
- "I see you got our David Austin roses! Our rose food is 20% off today for pickup customers"
- "These tulips will look amazing with our new copper plant markers"
- "Many customers pair these hostas with our shade garden soil blend"

### 6. After Order Glow: Amplify Delight
**Goal**: Extend joy and create sharing moments

**Immediate Post-Pickup**:
- SMS: "Enjoy your garden treasures! Tag us @gardencenter for a chance to be featured"
- Email: Detailed care guides + companion planting suggestions
- Review request with photo upload option

**Week 1-2 Follow-up**:
- "How's your planting going?" check-in
- User-generated content showcase
- Early preview of next drop

### 7. Next Drop Loop: Habit Creation
**Goal**: Build anticipation for the next preorder cycle

**Retention Tactics**:
- "You're on the list" confirmation for next season
- Savings tracker: "You've saved $127 with early bird pricing"
- Loyalty points toward VIP status
- Exclusive previews based on purchase history

## SECTION 3: TECHNICAL IMPLEMENTATION

### Current Preorder Logic (preorder-logic.liquid)
```liquid
{%- liquid
  # Check for preorder date in metafields
  assign drop_date_field = product.metafields.custom.preorder_drop_date
  
  # Smart date display logic
  if days_until_drop <= 7
    # Show "This Friday @ 2:00PM EST" format
    assign preorder_text = 'Available this ' | append: day_name | append: ' @ ' | append: time_with_tz
  else
    # Show standard date format
    assign preorder_text = 'Available ' | append: formatted_date
  endif
-%}
```

### Metafield Configuration
```
Namespace: custom
Key: preorder_drop_date
Type: date_time
Description: The date/time when preorder items become available for pickup

Additional Metafields:
- preorder_inventory_limit (integer): Max units for preorder
- preorder_per_customer_limit (integer): Purchase limit
- early_bird_discount_percentage (integer): VIP discount
- pickup_location (single_line_text_field): Specific pickup area
```

### Klaviyo Integration Points
1. **Preorder Placed Event**
   - Trigger welcome series
   - Add to segment
   - Start countdown flow

2. **Pickup Ready Event**
   - Send notification
   - Include attach suggestions
   - Provide pickup instructions

3. **Post-Pickup Event**
   - Request feedback
   - Share care content
   - Preview next drop

### Display Logic Rules
- **Within 7 Days**: Friendly day name + time (builds urgency)
- **Beyond 7 Days**: Date format (builds anticipation)
- **Sold Out + Future Date**: "Get Early Access" CTA
- **Sold Out + No Date**: "Notify When Back in Stock" CTA

## SECTION 4: MESSAGING AND COPY

### Email Templates

#### Preorder Launch Email
**Subject Lines**:
- "🌷 Your Garden VIP Access: Spring Bulbs Now Open"
- "Early Bird Special: 48 hours only for loyal gardeners"
- "[Name], your exclusive garden preview starts now"

**Body Copy Framework**:
```
HEADLINE: Identity Statement
"For Gardeners Who Plan Ahead"

SUBHEAD: Exclusive Access
"Your VIP status unlocks 200+ varieties before anyone else"

BODY: Value + Urgency
- Highlight 3-5 must-have varieties
- Include "last year sold out" social proof
- Show early bird savings

CTA: Clear Next Step
"SHOP MY VIP SELECTION"
```

#### Pickup Ready Email
**Subject**: "🌱 Your garden order is ready! Plus, see what pairs perfectly..."

**Structure**:
1. Celebration: "Your carefully selected plants are here!"
2. Logistics: Pickup hours, location, what to bring
3. Upsell: "Complete your garden with these pickup-only specials"
4. Anticipation: "While you're here, preview our next exclusive drop"

### SMS Examples
- **Launch**: "🌷 VIP ACCESS LIVE! Your spring bulbs link: [link] Shop 2 hrs before public. -Garden Center"
- **Urgency**: "Only 24 tulips left! Your cart expires in 20 min: [link] -GC"
- **Pickup**: "Your plants are ready! Pickup today 9-6. Show this for 20% off soil. Reply STOP to opt out -GC"
- **Post**: "How's planting going? Share pics! Next drop 3/15 - you're on the VIP list 🌱 -GC"

### Product Page Copy Strategies

#### Above the Fold
- **Identity Badge**: "Chosen by Master Gardeners"
- **Scarcity Indicator**: "Only 47 remaining for this season"
- **Social Proof**: "Join 1,232 gardeners who preordered"

#### Product Description Framework
1. **Emotional Hook**: Paint the vision
2. **Practical Details**: Size, care, zones
3. **Exclusivity Note**: Why this variety is special
4. **Urgency Element**: Limited quantity or time

**Example**:
```
"Transform your spring garden into a Dutch masterpiece with 
these award-winning Angelique tulips. Their delicate pink 
petals open like peonies, creating stunning displays that 
last up to 3 weeks.

- Blooms: Late spring (May)
- Height: 18-20 inches  
- Zones: 3-8
- Exclusive: Only 200 bulbs secured from Holland

Limited quantity - when they're gone, they're gone until 2025."
```

### Urgency and Exclusivity Messaging

#### Time-Based Urgency
- "Early bird pricing ends in 24 hours"
- "VIP access closes at midnight"
- "Last day for April pickup dates"

#### Inventory-Based Urgency
- "73% sold in first 48 hours"
- "Only 2 cases left for contractors"
- "Waitlist forming for sold-out varieties"

#### Exclusivity Markers
- "Garden VIP Members Only"
- "Exclusive variety - not available in stores"
- "Limited import from specialist growers"
- "First access for loyalty members"

## SECTION 5: OPERATIONAL WORKFLOWS

### Pickup Staging Strategy

#### Zone Design
```
ENTRANCE
    ↓
GREETING STATION (Check-in, friendly face)
    ↓
ORDER STAGING (Organized by pickup time)
    ↓
ATTACH ZONE (Impulse items, tools, soil)
    ↓
EDUCATION CORNER (Care guides, expert tips)
    ↓
NEXT DROP PREVIEW (Generate excitement)
    ↓
CHECKOUT (For attach purchases)
```

#### Attach Product Placement
- **By Bulbs**: Bone meal, bulb planters, markers
- **By Perennials**: Compost, mulch, plant food
- **By Vegetables**: Tomato cages, organic fertilizer
- **Universal**: Gloves, tools, decorative planters

### Staff Scripts and Training

#### Greeting Script
"Welcome! Are you picking up a preorder? I'm excited to see what you selected! Let me grab that for you, and while I do, feel free to browse our pickup-only specials."

#### Upsell Conversations
**Soft Approach**: "I notice you got our heirloom tomatoes. Many customers find our tomato cages helpful - they're 30% off for pickup customers today."

**Educational Angle**: "These dahlias are stunning! Just so you know, they perform best with our dahlia food - would you like me to show you?"

**Bundle Suggestion**: "Since you're getting multiple perennials, our shade garden soil bundle would save you about $15 versus buying separately."

#### Closing Script
"Your garden is going to be beautiful! Don't forget, our next exclusive drop is [date] - you'll get VIP early access again. Any questions about planting these?"

### Post-Pickup Follow-up Sequences

#### Day 1: Immediate Confirmation
- SMS: Quick thank you + care tip link
- Email: Detailed care guides + UGC request

#### Day 3-5: Engagement Check
- Email: "How's your planting going?"
- Include troubleshooting tips
- Share community photos

#### Day 7: Review Request
- Email: Request review with photo upload
- Offer loyalty points for completion
- Preview next drop

#### Day 14: Next Drop Teaser
- Email: "You're going to love what's coming..."
- Show relevant products based on purchase
- Confirm VIP status

### Loop Into Next Preorder Campaign

#### Segmentation for Next Campaign
1. **Super VIPs**: 3+ preorders, highest priority
2. **Active Preorderers**: 1-2 preorders, engaged
3. **Pickup Purchasers**: Bought during pickup
4. **Waitlist Members**: High intent, no purchase yet
5. **Browse Abandoners**: Showed interest

#### Progressive Messaging
- **Super VIPs**: 72-hour exclusive preview
- **Active Preorderers**: 48-hour early access
- **Others**: 24-hour preview before public

#### Loyalty Building
- Track cumulative savings
- Showcase purchase history
- Celebrate milestones ("Your 5th preorder!")
- Exclusive grower meet-and-greets

### Success Metrics Tracking
- Preorder conversion rate by segment
- Attach rate at pickup
- Average attach value
- Email/SMS engagement rates
- Customer lifetime value progression
- Repeat preorder rate
- Social sharing and UGC creation

---

*This playbook is a living document. Update based on seasonal learnings and customer feedback to continuously improve the preorder experience.*