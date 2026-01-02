# WorldAnvil MCP Server - Agent Guidelines

This document provides guidance for AI agents working with the WorldAnvil MCP server. Follow these patterns to ensure effective worldbuilding that aligns with WorldAnvil best practices.

## Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                     WORLDANVIL RESOURCES                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CONTENT CREATION                                               │
│    Articles   → Full content pages (28 templates available)     │
│    Variables  → Reusable values: [prefix:key]                   │
│    Blocks     → RPG statblocks (monsters, spells, items)        │
│                                                                 │
│  ORGANIZATION                                                   │
│    Categories → Hierarchical folders for articles               │
│    Tags       → Cross-cutting labels                            │
│    Maps       → Interactive geographic visualization            │
│    Timelines  → Historical event organization                   │
│                                                                 │
│  CAMPAIGN MANAGEMENT                                            │
│    Notebooks  → GM-only planning (sections + notes)             │
│    Secrets    → Hidden info attached to public articles         │
│    Session Reports → Chronicle of game sessions                 │
│                                                                 │
│  RELATIONSHIPS                                                  │
│    @-mentions → Link articles with @[Article Name]              │
│    Parent/Child → Hierarchical article relationships            │
│    Map Markers → Geographic article connections                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

GUIDE SECTIONS IN THIS DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Variables: Decision Framework    → When/how to use variables
  • Articles: Template Selection     → Choosing the right template
  • Organization Strategy            → Categories and hierarchies
  • Statblocks & Blocks              → RPG mechanical content
  • Content Relationships            → Linking content together
  • Campaign Management              → Running active campaigns
  • BBCode Quick Reference           → Formatting syntax guide
```

## Variables: Decision Framework

### When to Use Variables vs Articles

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT DECISION TREE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Does this content need its own page with full formatting?      │
│    YES → Create an ARTICLE                                      │
│    NO  ↓                                                        │
│                                                                 │
│  Will this exact text/value appear in multiple articles?        │
│    NO  → Just write it inline in the article                    │
│    YES ↓                                                        │
│                                                                 │
│  Might this value change in the future?                         │
│    NO  → Consider inline text (simpler)                         │
│    YES ↓                                                        │
│                                                                 │
│  → Create a VARIABLE                                            │
│                                                                 │
│  What behavior do you need?                                     │
│    • Hover tooltip with definition    → Term, Simple            │
│    • Hover tooltip with formatting    → Term, Advanced          │
│    • Replace with formatted content   → Rendered Fragment       │
│    • Clickable link                   → Link                    │
│    • Numeric value                    → Number                  │
│    • Structured data for API          → JSON Array              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Variable Types - Detailed Behavior

| Type | Display Behavior | BBCode Support | Best For |
|------|------------------|----------------|----------|
| **string** (Term, Simple) | Title shows; value = hover tooltip | No | Dictionary terms, abbreviations, quick definitions |
| **string** (Term, Advanced) | Title shows; value = styled hover tooltip | Yes, in tooltip | Expanded explanations, mini-statblocks on hover |
| **rendered** (Fragment) | Value replaces variable inline | Yes | Reusable banners, styled containers, announcements |
| **link** | Creates clickable hyperlink | No | External URLs, social media, VTT links |
| **number** | Numeric value | No | Years, quantities, stats |
| **json** | Structured data via API | N/A | Complex integrations |

### Collection Organization Strategy

**Principle: "Better to have too many collections than too few"**

Organize by theme/purpose, not by quantity:

```
GOOD (Granular):
├── Collection: "Calendar & Time"     prefix: "cal"
│   ├── current_year, current_era, founding_date
├── Collection: "Currency"            prefix: "coin"
│   ├── gold_name, silver_name, exchange_rate
├── Collection: "Titles & Ranks"      prefix: "title"
│   ├── king_title, duke_title, knight_title
└── Collection: "Common Terms"        prefix: "term"
    ├── magic_name, religion_name, continent_name

BAD (Catch-all):
└── Collection: "World Stuff"         prefix: "world"
    ├── year, gold, king, magic, religion... (messy)
```

### Variable Naming Conventions

```
Keys:    lowercase_snake_case
         SHORT but descriptive (typed in articles)

Prefixes: 3-6 characters, lowercase
          Memorable, thematic

Examples:
  [cal:current_year]     ✓ Clear, short
  [calendar:the_current_year_number]  ✗ Too long
  [c:y]                  ✗ Too cryptic
```

### Fragment Variables: Power Patterns

Fragments render BBCode inline. Use for reusable styled elements:

**Pattern 1: Styled Container**
```
Variable key: "warning_box"
Variable value: [container:warning][b]Warning:[/b] {CONTENT}[/container]

Usage in articles: Authors manually replace {CONTENT}
```

**Pattern 2: Consistent Announcements**
```
Variable key: "wip_banner"
Variable value: [container:wip][center][b]This article is a work in progress[/b][/center][/container]

Usage: [frag:wip_banner] at top of draft articles
```

**Pattern 3: Reusable Navigation**
```
Variable key: "region_nav"
Variable value: [container:nav][url=/w/world/a/north]North[/url] | [url=/w/world/a/south]South[/url][/container]
```

### Critical Warnings

```
⚠️  BREAKING CHANGES - These actions break all existing references:
    • Changing a variable's key
    • Changing a collection's prefix
    • Deleting a variable
    • Deleting a collection (deletes ALL its variables)

⚠️  LIMITATIONS:
    • Variables do NOT work inside statblocks (scope mismatch)
    • Only ONE level of variable nesting supported
    • Advanced Term nesting was removed (docs outdated)
    • Requires Master rank+ subscription
```

## Workflow: Creating Variables

### Step 1: Check Existing Collections
```
ALWAYS run worldanvil_list_variablecollections first
- Avoid duplicate collections
- Reuse existing prefixes where appropriate
```

### Step 2: Create Collection (if needed)
```
Choose prefix carefully - cannot change without breaking references
Add description explaining the collection's purpose
```

### Step 3: Check Existing Variables
```
Run worldanvil_list_variables for the target collection
- Avoid duplicate keys
- Maintain consistent naming patterns
```

### Step 4: Create Variable
```
- Use appropriate type for intended behavior
- Keep key short but descriptive
- Test the embed code: [prefix:key]
```

## Common Use Cases

### Glossary/Dictionary System
```
Collection: "Glossary" prefix: "def"
Type: string (Term, Simple)

Variables:
  key: "arcanum"     title: "Arcanum"    value: "The raw magical energy..."
  key: "leyline"     title: "Ley Line"   value: "Invisible channels of..."

Usage: "Wizards tap into the [def:arcanum] flowing through [def:leyline]s."
Result: Hover tooltips provide definitions without cluttering the text
```

### World Constants
```
Collection: "World Facts" prefix: "lore"
Type: string

Variables:
  key: "world_name"   value: "Eldoria"
  key: "currency"     value: "Gold Crowns"
  key: "capital"      value: "Thronehold"

Usage: "The kingdom of [lore:world_name] uses [lore:currency]..."
Benefit: Rename the world once, updates everywhere
```

### Year/Calendar Tracking
```
Collection: "Timeline" prefix: "cal"
Type: number

Variables:
  key: "current_year"   value: "1247"
  key: "founding_year"  value: "1"

Usage: "In [cal:current_year] AE, the kingdom celebrates..."
Benefit: Advance time in one place
```

### External Links
```
Collection: "Resources" prefix: "link"
Type: link

Variables:
  key: "discord"   title: "Join Discord"   value: "https://discord.gg/..."
  key: "vtt"       title: "Play Online"    value: "https://foundryvtt.com/..."

Usage: "Ready to play? [link:vtt]"
Result: Clickable link with custom text
```

## Anti-Patterns to Avoid

### Don't: Create variables for one-time content
```
BAD:  Variable for a specific character's biography
GOOD: Just write it in the character article
```

### Don't: Use overly generic collections
```
BAD:  Collection "stuff" with prefix "s"
GOOD: Collection "Noble Titles" with prefix "title"
```

### Don't: Change prefixes after embedding
```
BAD:  Rename prefix from "lore" to "world" (breaks all references)
GOOD: Plan prefixes carefully upfront
```

### Don't: Expect variables in statblocks
```
BAD:  Using [lore:stat_bonus] in a D&D statblock
GOOD: Variables are for articles only
```

## Integration with Other Features

### Variables + Articles
- Use Link variables to create consistent article references
- Use Term variables for article terminology tooltips

### Variables + Secrets
- Variables are NOT secret-aware
- For hidden content, use the Secrets feature instead

### Variables + Blocks
- Variables don't work in Block/Statblock content
- Use Block Template Parts for statblock fields instead

## API Notes

### Endpoint Quirks (Discovered Through Testing)
```
- Swagger shows /variable_collection but API uses /variablecollection
- Variable creation requires nested { id: ... } objects despite Swagger
- listVariables endpoint: /variablecollection/variables (no underscore)
```

### Rate Limiting
```
- WorldAnvil uses Cloudflare protection
- Space API calls ~750ms apart to avoid 429 errors
- Batch operations when possible
```

## Articles: Template Selection Guide

WorldAnvil provides 28 specialized article templates. Choosing the right template unlocks template-specific fields, relationships, and features that enhance your worldbuilding.

### Template Selection Decision Tree

```
┌─────────────────────────────────────────────────────────────────┐
│                 ARTICLE TEMPLATE DECISION TREE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Is this about a PERSON or CREATURE?                            │
│    Person (individual)     → Character                          │
│    Type of being/race      → Species                            │
│    Cultural group of people → Ethnicity                         │
│    Creature type/monster   → Species (with creature fields)     │
│                                                                 │
│  Is this about a PLACE?                                         │
│    Natural feature         → Geography                          │
│    Inhabited place         → Settlement                         │
│    Single structure        → Building / Landmark                │
│    Cosmic/planar location  → Geography                          │
│                                                                 │
│  Is this about a GROUP?                                         │
│    Political/religious/guild → Organization                     │
│    Military unit           → Military Formation                 │
│    Cultural group          → Ethnicity                          │
│    Noble house/family      → Organization (family fields)       │
│                                                                 │
│  Is this about a THING?                                         │
│    Specific object/artifact → Item                              │
│    Type of material        → Material                           │
│    Vehicle/ship            → Vehicle                            │
│    Technology/invention    → Technology                         │
│                                                                 │
│  Is this about IDEAS/SYSTEMS?                                   │
│    How magic/physics works → Natural Law                        │
│    Language/writing system → Language                           │
│    Religion/belief         → Organization (religious type)      │
│    Custom/ritual/practice  → Tradition / Ritual                 │
│    Job/role in society     → Profession / Rank                  │
│    Noble/official title    → Title / Rank                       │
│                                                                 │
│  Is this about STORY/EVENTS?                                    │
│    Historical event        → Document / Prose                   │
│    War/battle              → Conflict (Military)                │
│    Plot/quest/adventure    → Plot                               │
│    In-world document       → Document                           │
│    Myth/legend             → Myth / Legend                      │
│    Campaign session notes  → Session Report                     │
│                                                                 │
│  None of the above?        → Generic Article                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Template Categories Overview

| Category | Templates | Use For |
|----------|-----------|---------|
| **Characters** | Character | Individual NPCs, PCs, historical figures |
| **Places** | Settlement, Building/Landmark, Geography | Cities, structures, natural features |
| **Groups** | Organization, Ethnicity, Military Formation | Factions, cultures, armies |
| **Creatures** | Species, Condition | Races, monsters, diseases/curses |
| **Culture** | Tradition/Ritual, Language, Myth/Legend | Customs, scripts, folklore |
| **Objects** | Item, Material, Vehicle, Technology | Artifacts, substances, ships, inventions |
| **Systems** | Natural Law, Profession/Rank, Title/Rank | Magic systems, jobs, noble titles |
| **Story** | Plot, Document, Session Report, Conflict, Prose | Adventures, events, campaign logs |
| **Meta** | Generic Article | Primers, indexes, RPG rules, anything else |

### Common Template Confusion Points

```
┌─────────────────────────────────────────────────────────────────┐
│                    SETTLEMENT vs GEOGRAPHY                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SETTLEMENT - Use for:                                          │
│    • Cities, towns, villages, hamlets                           │
│    • Nomadic camps (even if they move)                          │
│    • Districts within cities                                    │
│    • Space stations, underwater domes (if inhabited)            │
│    Features: Demographics, government, maps, chronicles         │
│                                                                 │
│  GEOGRAPHY - Use for:                                           │
│    • Mountains, rivers, forests, deserts                        │
│    • Oceans, planets, planes of existence                       │
│    • Ruins (unless actively inhabited)                          │
│    • Uninhabited regions                                        │
│    Features: Climate, natural resources, hazards                │
│                                                                 │
│  Rule of Thumb: "Do people LIVE there?" → Settlement            │
│                 "Is it a natural feature?" → Geography          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  ORGANIZATION vs ETHNICITY                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ORGANIZATION - Use for:                                        │
│    • Guilds, companies, political parties                       │
│    • Religions (as institutions)                                │
│    • Noble houses, dynasties, family lines                      │
│    • Secret societies, military orders                          │
│    Features: Hierarchy trees, membership, founding date         │
│                                                                 │
│  ETHNICITY - Use for:                                           │
│    • Cultural/ethnic groups (Northlanders, Desert Nomads)       │
│    • Subcultures within a species                               │
│    • Regional identity groups                                   │
│    Features: Customs, naming conventions, ideals, taboos        │
│                                                                 │
│  Rule of Thumb: "Can you JOIN it?" → Organization               │
│                 "Are you BORN into it?" → Ethnicity             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SPECIES vs ETHNICITY                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SPECIES - Use for:                                             │
│    • Biological classification (Elves, Dragons, Humans)         │
│    • Monster/creature types                                     │
│    • Races with distinct biology                                │
│    Features: Anatomy, lifespan, biological traits               │
│                                                                 │
│  ETHNICITY - Use for:                                           │
│    • Cultural subgroups WITHIN a species                        │
│    • "High Elves vs Wood Elves" (if culturally distinct)        │
│    • Regional human cultures                                    │
│    Features: Customs, traditions, cultural values               │
│                                                                 │
│  Rule of Thumb: "Biologically different?" → Species             │
│                 "Culturally different?" → Ethnicity             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Template-Specific Features

Some templates unlock powerful features not available in Generic articles:

```
CHARACTER
  • Family trees with automatic relationship visualization
  • Portrait/token image slots for RPG integration
  • Relationship tracking (allies, enemies, affiliations)

SETTLEMENT
  • Map integration (link interactive maps)
  • Chronicle integration (timeline of events)
  • District hierarchy (parent/child settlements)
  • Demographics fields

ORGANIZATION
  • Automatic hierarchy trees
  • Membership and rank structure
  • Founding/dissolution date tracking
  • Related organizations

SPECIES
  • Anatomy and biology fields
  • Lifespan and lifecycle
  • Trait inheritance tracking
  • Related species/subspecies

PLOT
  • Act/scene structure
  • Stakes and hooks
  • Dramatic question framing
  • Quest/adventure organization
```

### Generic Article: When to Use It

The Generic template is NOT a fallback for laziness—it has specific legitimate uses:

```
GOOD Uses for Generic:
  • World primers/introductions for new readers
  • RPG mechanics explanations (house rules, systems)
  • Meta content (table of contents, navigation pages)
  • Content that genuinely doesn't fit other templates
  • Tutorials or how-to guides within your world

BAD Uses for Generic:
  • "I don't know which template to pick" → Use the decision tree
  • "I'll change it later" → Pick correctly now; changing loses data
  • Any content that fits another template's purpose
```

### Power User Patterns

Insights from award-winning WorldAnvil worlds:

```
ETHNIS (Ademal & Barron) - 865K+ words, 1173 articles
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Concise articles with evocative flavor text
  • Tracking sheets for campaign state
  • Collaborative worldbuilding between authors
  • "Don't dump everything—curate what matters"

CATHEDRIS (Stormbril) - CSS artistry, interactive elements
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • "Every article should be a cohesive work of art"
  • Consistent visual theme across all content
  • Interactive CSS elements (Grandmaster+)
  • Focus on presentation, not just information

ISTRALAR (Hanhula) - Hierarchical organization
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Deep folder hierarchy for navigation
  • Regular organization cleanup sessions
  • Tagging system for cross-references
  • "Break down folders when they get too full"
```

### Workflow: Creating Articles

```
Step 1: Determine Template Type
  - Use the decision tree above
  - When uncertain, check similar existing articles
  - Consider what template-specific fields you need

Step 2: Check Existing Content
  - Search for related articles to avoid duplication
  - Identify articles that should link to this one
  - Consider parent/child relationships (settlements, organizations)

Step 3: Create Article
  - Use worldanvil_create_article with appropriate template
  - Fill template-specific fields (not just content)
  - Add to appropriate category for organization

Step 4: Establish Relationships
  - Link to related articles using @[article-name]
  - Set up parent/child hierarchies where applicable
  - Add to relevant maps or timelines
```

### Article Anti-Patterns

```
DON'T: Use Generic for everything
  → You lose template-specific fields and features
  → Makes organization and navigation harder

DON'T: Create orphan articles
  → Every article should link TO and FROM other articles
  → Isolated content gets lost and forgotten

DON'T: Duplicate content across articles
  → Use Variables for repeated text
  → Use article links for shared concepts
  → Use parent articles for common traits

DON'T: Ignore template fields
  → Empty template fields = missed opportunities
  → Fields like "motto" or "founding date" add depth
```

## Organization Strategy Guide

Effective organization is what separates a usable world from an overwhelming dump of content. This section covers categories, hierarchies, and navigation patterns.

### Category Decision Framework

```
┌─────────────────────────────────────────────────────────────────┐
│                  CATEGORY ORGANIZATION STRATEGY                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Categories are FOLDERS for articles. Think like a file system:│
│                                                                 │
│  GOOD Structure (Thematic + Geographic):                        │
│  ├── The Kingdom of Valdor/                                     │
│  │   ├── Cities/                                                │
│  │   │   ├── Thronehold (Settlement)                            │
│  │   │   ├── Port Saline (Settlement)                           │
│  │   ├── Noble Houses/                                          │
│  │   │   ├── House Blackwood (Organization)                     │
│  │   │   ├── House Redmont (Organization)                       │
│  │   ├── Geography/                                             │
│  │   │   ├── The Iron Mountains (Geography)                     │
│  │                                                              │
│  BAD Structure (Too Flat):                                      │
│  ├── Places/                                                    │
│  │   ├── Thronehold, Port Saline, Iron Mountains, Valdor...     │
│  │   └── (50+ articles in one folder = unusable)                │
│                                                                 │
│  BAD Structure (Too Deep):                                      │
│  ├── Continents/Northern/Kingdoms/Valdor/Regions/East/Cities/   │
│  │   └── (7 levels deep = tedious navigation)                   │
│                                                                 │
│  IDEAL: 2-4 levels deep, 5-15 items per category                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Category Naming Conventions

```
Naming Principles:
  • Use PLURAL nouns for categories containing multiple items
    GOOD: "Characters", "Locations", "Organizations"
    BAD:  "Character", "Location", "Organization"

  • Use PROPER NOUNS for specific containers
    GOOD: "The Kingdom of Valdor", "Shadowfell Entities"
    BAD:  "Kingdom Stuff", "Dark Things"

  • Be SPECIFIC, not generic
    GOOD: "Northern Noble Houses", "Trade Guilds of Valdor"
    BAD:  "Groups", "Factions"
```

### Hierarchical Organization Patterns

Power users organize by combining geography with theme:

```
PATTERN 1: Geography-First (Best for large worlds)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── Continent: Aelora/
│   ├── Region: The Northern Reaches/
│   │   ├── Characters/
│   │   ├── Settlements/
│   │   ├── Organizations/
│   ├── Region: The Sunken Isles/
│       ├── Characters/
│       ├── Settlements/

Benefit: Find content by WHERE it exists
Use when: Your world has distinct geographical regions

PATTERN 2: Theme-First (Best for focused campaigns)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── The Main Quest/
│   ├── Act 1: The Awakening/
│   ├── Act 2: The Gathering Storm/
│   ├── Key NPCs/
├── Factions/
│   ├── The Silver Order/
│   ├── The Shadow Conclave/

Benefit: Find content by STORY relevance
Use when: Your world serves a specific campaign

PATTERN 3: Hybrid (Recommended for most)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├── World Lore/
│   ├── Cosmology/
│   ├── History/
│   ├── Magic System/
├── The Kingdom of Valdor/
│   ├── Locations/
│   ├── People/
├── Campaign: Dragon's Bane/
│   ├── Session Notes/
│   ├── Active Quests/

Benefit: Separates reference from active play
Use when: You have both lore and active campaigns
```

### The "Break Down" Rule

From Istralar's organization philosophy:

```
TRIGGER: A category has more than 15-20 articles
ACTION:  Break it into subcategories

Before (Cluttered):
├── Characters/
│   ├── (47 character articles)
│   └── Impossible to navigate!

After (Organized):
├── Characters/
│   ├── Major NPCs/
│   │   ├── (12 key characters)
│   ├── Historical Figures/
│   │   ├── (8 deceased notables)
│   ├── Minor NPCs/
│   │   ├── (15 supporting cast)
│   ├── Player Characters/
│   │   ├── (12 PCs current and past)
```

### Tagging Strategy

Tags complement categories by providing cross-cutting organization:

```
USE TAGS FOR:
  • Campaign relevance: "dragon-campaign", "heist-arc"
  • Status markers: "wip", "needs-review", "player-known"
  • Content warnings: "dark-themes", "violence"
  • Connection types: "magic-user", "noble-house-member"

DON'T USE TAGS FOR:
  • What categories already handle (location, type)
  • Overly specific one-off labels
  • Redundant information (tagging an Organization as "organization")

Tag Naming:
  • lowercase-kebab-case
  • Short but meaningful
  • Consistent across the world
```

### Navigation Elements

Beyond categories, WorldAnvil offers navigation aids:

```
TABLE OF CONTENTS ARTICLES
━━━━━━━━━━━━━━━━━━━━━━━━━
Create a Generic article that serves as a hub:
  • "Welcome to Valdor" - links to major categories
  • "Campaign Guide" - links to player-relevant content
  • "Quick Reference" - frequently-accessed articles

WORLD INTRODUCTION
━━━━━━━━━━━━━━━━━━
The world's introduction field (in world settings):
  • First thing visitors see
  • Link to key starter articles
  • Provide reading order suggestions

CHRONICLES
━━━━━━━━━━━━━━━━━━
For historical timelines:
  • Group events by era or reign
  • Link to detailed articles
  • Provide narrative through-line
```

### Workflow: Creating Categories

```
Step 1: Check Existing Categories
  - Run worldanvil_list_categories
  - Look for appropriate parent categories
  - Avoid duplicate or overlapping categories

Step 2: Determine Hierarchy Level
  - Is this a top-level grouping? (e.g., "The Northern Kingdoms")
  - Is this a subcategory? (e.g., "Noble Houses of Valdor")
  - Set parent_category if nested

Step 3: Create Category
  - Use clear, descriptive title
  - Consider future growth (will this need subcategories?)

Step 4: Populate and Link
  - Move relevant articles into the category
  - Update article links to reflect new organization
  - Add category to navigation hubs
```

### Organization Anti-Patterns

```
DON'T: Create empty categories
  → Categories should contain or expect content
  → Delete unused categories to reduce clutter

DON'T: Use categories as tags
  → Categories are hierarchical folders
  → Tags are flat labels for cross-referencing
  → Don't create a category for 2-3 articles

DON'T: Reorganize without updating links
  → Moving articles can break navigation
  → Update hub articles after reorganization
  → Check parent/child article relationships

DON'T: Mix organizational systems mid-project
  → Commit to geography-first OR theme-first
  → Switching later requires major reorganization
  → Plan your structure before building extensively
```

## Statblocks & Blocks Guide

Statblocks provide structured RPG game data (monster stats, spell descriptions, item properties) that can be reused across articles and campaigns. "Blocks" is the generic term; "Statblocks" specifically refers to RPG stat data.

### Statblock vs Article Decision

```
┌─────────────────────────────────────────────────────────────────┐
│              STATBLOCK vs ARTICLE DECISION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Is this game mechanical data?                                  │
│    YES → Statblock                                              │
│    NO  → Article                                                │
│                                                                 │
│  Will this be embedded in multiple articles?                    │
│    YES → Statblock (reusable)                                   │
│    NO  → Consider inline content in article                     │
│                                                                 │
│  Does this need an RPG system template?                         │
│    YES → Statblock (D&D, Pathfinder, etc.)                      │
│    NO  → Article or custom Block                                │
│                                                                 │
│  STATBLOCK Examples:                                            │
│    • Monster stat block (HP, AC, abilities)                     │
│    • Spell description (level, school, components)              │
│    • Magic item properties (rarity, attunement)                 │
│    • NPC combat stats                                           │
│                                                                 │
│  ARTICLE Examples:                                              │
│    • Character biography and personality                        │
│    • Location description and history                           │
│    • Lore about a magical artifact                              │
│    • Cultural context for a creature                            │
│                                                                 │
│  BEST PRACTICE: Create BOTH                                     │
│    • Article: Lore, story, world context                        │
│    • Statblock: Game mechanics, attached to article             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Prerequisites: RPG System Configuration

```
CRITICAL: Before creating statblocks, the world MUST have an RPG system set.

Workflow:
1. Go to World Settings → Game/RPG Information
2. Select your RPG system (D&D 5e, Pathfinder 2e, etc.)
3. This unlocks system-specific statblock templates

Available RPG Systems Include:
  • D&D 5th Edition
  • D&D 3.5 / Pathfinder 1e
  • Pathfinder 2e
  • Call of Cthulhu
  • Savage Worlds
  • FATE
  • Generic (custom fields)
  • Many more...

If no RPG system is set:
  → Statblock creation will fail or use generic templates
  → System-specific fields won't be available
```

### The Collections Feature

Collections allow you to organize statblocks for character sheet integration:

```
COLLECTIONS USE CASES
━━━━━━━━━━━━━━━━━━━━━

Character Sheets:
  → Collections let players/GMs embed statblocks by ID
  → "Spell Collection" for quick spell lookup
  → "Equipment Collection" for item management

Monster Compendiums:
  → Group monsters by CR, type, or location
  → Quick reference during sessions

Campaign Resources:
  → "Session 5 Encounters" collection
  → Pre-built combat encounters
```

### Workflow: Creating Statblocks

```
Step 1: Verify RPG System
  - Check world settings for RPG system
  - If missing, cannot create system-specific statblocks

Step 2: Choose Block Type
  - Monster/NPC combat stats
  - Spell
  - Magic item
  - Custom template

Step 3: Create the Block
  - Fill required fields (varies by system)
  - Add flavor text where appropriate
  - Set visibility (public, subscribers, GM only)

Step 4: Attach or Embed
  Option A: Attach to article
    - Link statblock to Character, Item, or Species article
    - Appears in article sidebar

  Option B: Embed inline
    - Use BBCode: [block:BLOCK_ID]
    - Renders statblock within article content

  Option C: Add to Collection
    - For character sheet integration
    - Organized access during play
```

### Statblock Best Practices

```
DO: Pair statblocks with articles
  → Article has lore and context
  → Statblock has game mechanics
  → Link them for complete reference

DO: Use Collections for session prep
  → Create encounter collections
  → Group by campaign session or location
  → Quick access during play

DO: Keep statblock data canonical
  → One statblock per creature/item
  → Update in one place, reflects everywhere
  → Avoid duplicate stat data

DON'T: Put statblock data in articles
  → Hard to maintain
  → Can't be embedded elsewhere
  → Variables don't work in statblocks anyway

DON'T: Create statblocks without RPG system
  → Generic blocks lack useful fields
  → Set RPG system first
```

### System-Specific Notes

```
D&D 5th Edition:
  → Monster blocks include CR calculator
  → Spell blocks have class lists
  → Action economy fields (Action, Bonus, Reaction)

Pathfinder 2e:
  → Three-action system fields
  → Trait tags
  → DC and modifier calculations

Generic System:
  → Fully customizable fields
  → Use for homebrew systems
  → No automatic calculations
```

### Statblock Limitations

```
⚠️ Variables do NOT work in statblocks
   → Statblocks have different rendering scope
   → Use template parts for reusable statblock components

⚠️ Statblocks are NOT articles
   → Cannot be categorized like articles
   → Use Collections for organization
   → Cannot have their own URL/page

⚠️ RPG system cannot be changed easily
   → Changing world RPG system may break existing statblocks
   → Plan RPG system choice before creating content
```

## Content Relationships Guide

WorldAnvil's power comes from connecting content. This section covers how to link articles, establish hierarchies, and create a navigable world.

### Relationship Types Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    RELATIONSHIP TYPES                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MENTIONS (@-links)                                             │
│    → Create clickable links between articles                    │
│    → Syntax: @[Article Title]                                   │
│    → Two-way: Creates backlinks automatically                   │
│                                                                 │
│  PARENT/CHILD                                                   │
│    → Hierarchical containment                                   │
│    → Settlement contains districts                              │
│    → Organization contains sub-organizations                    │
│                                                                 │
│  TEMPLATE RELATIONSHIPS                                         │
│    → Character → Species, Ethnicity, Organization               │
│    → Settlement → Geography (location within)                   │
│    → Item → Material, Technology                                │
│                                                                 │
│  TIMELINE CONNECTIONS                                           │
│    → Articles linked to historical events                       │
│    → Characters to birth/death dates                            │
│    → Settlements to founding events                             │
│                                                                 │
│  MAP MARKERS                                                    │
│    → Geographic articles linked to map locations                │
│    → Click marker → opens article                               │
│                                                                 │
│  SECRET ATTACHMENTS                                             │
│    → GM-only content attached to public articles                │
│    → Hidden until revealed to players                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Article Mentions (@-links)

The primary way to connect content:

```
SYNTAX EXAMPLES
━━━━━━━━━━━━━━━

Basic mention:
  "The city of @[Thronehold] is the capital."
  → Creates clickable link to "Thronehold" article

With custom display text:
  "The @[Thronehold](great capital) dominates the region."
  → Displays "great capital" but links to Thronehold

Disambiguating similar names:
  "@[Thronehold|Settlement]"
  → Links specifically to the Settlement article

BENEFITS
  • Automatic backlinks (article shows "mentioned in")
  • Readers can explore connected content
  • Broken links visible when articles deleted
```

### Parent/Child Hierarchies

Template-specific relationships that create navigable structures:

```
SETTLEMENTS
━━━━━━━━━━━
├── Kingdom of Valdor (Settlement, type: Kingdom)
│   ├── Duchy of Northmark (Settlement, type: Duchy)
│   │   ├── City of Frosthold (Settlement, type: City)
│   │   ├── Town of Riverbend (Settlement, type: Town)
│   ├── Duchy of Southreach (Settlement, type: Duchy)

Set via: "Located in" field on Settlement template

ORGANIZATIONS
━━━━━━━━━━━━━
├── The Silver Order (Organization)
│   ├── Valdor Chapter (Organization, parent: Silver Order)
│   ├── Northern Chapter (Organization, parent: Silver Order)
│   │   ├── Frosthold Lodge (Organization, parent: Northern Chapter)

Set via: "Parent Organization" field

SPECIES
━━━━━━━
├── Dragons (Species)
│   ├── Chromatic Dragons (Species, parent: Dragons)
│   │   ├── Red Dragons (Species, parent: Chromatic)
│   ├── Metallic Dragons (Species, parent: Dragons)

Set via: "Related Species" or subspecies fields
```

### Building Connected Content

```
GOOD Pattern: Web of References
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Character Article: "Lord Aldric Blackwood"
  Content mentions:
    → @[House Blackwood] (his family)
    → @[Thronehold] (where he lives)
    → @[The Silver Order] (organization he leads)
    → @[Queen Elara] (his liege)
  Template fields set:
    → Species: Human
    → Ethnicity: Valdorian Noble
    → Organization: House Blackwood

Result: Readers can explore in any direction

BAD Pattern: Orphan Articles
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Character Article: "Lord Aldric Blackwood"
  Content: "He is a noble who lives in a city."
  Template fields: (empty)

Result: Dead end. No connections. Lost content.
```

### Secrets: Hidden Relationships

Secrets allow GM-only information attached to public articles:

```
SECRET USE CASES
━━━━━━━━━━━━━━━━

Hidden NPC Motivations:
  Public Article: "Merchant Giles" - friendly shopkeeper
  Secret: "Actually a spy for the Shadow Conclave"

Location Secrets:
  Public Article: "The Old Mill" - abandoned building
  Secret: "Secret entrance to the thieves' guild"

Item True Nature:
  Public Article: "The Silver Amulet" - family heirloom
  Secret: "Phylactery of the Lich King"

WORKFLOW
  1. Create the public article
  2. Create a Secret with the hidden information
  3. Attach Secret to the article
  4. Secret visible only to GM and whitelisted players
  5. Can be "revealed" to make public
```

### Timeline Integration

Connect articles to historical events:

```
TIMELINE STRUCTURE
━━━━━━━━━━━━━━━━━━
Timeline: "History of Valdor"
├── Era: "The Founding Age"
│   ├── Event: "Kingdom Founded" (year 1)
│   │   → Linked articles: Kingdom of Valdor, First King
│   ├── Event: "Silver Order Established" (year 47)
│       → Linked articles: The Silver Order, Founder Knight
├── Era: "The Golden Age"
    ├── Event: "Dragon War Begins" (year 312)
        → Linked articles: Dragon War, Red Dragon Tyrant

BENEFITS
  • Visual timeline on world page
  • Articles show "appears in timeline"
  • Historical context for content
```

### Map Markers

Connect articles to geographic locations:

```
MAP INTEGRATION
━━━━━━━━━━━━━━━
1. Create Map in WorldAnvil
2. Add Markers at locations
3. Link each Marker to an article

Marker → Article connections:
  • City marker → Settlement article
  • Dungeon marker → Location article
  • Battle marker → Conflict article

POWER USER TIP (from Cathedris):
  → Use custom marker icons for different article types
  → Color-code by faction or importance
  → Layer markers for different map "modes"
```

### Relationship Best Practices

```
DO: Create bidirectional links
  → If A mentions B, B should probably mention A
  → Exception: Minor references to major articles

DO: Use template relationship fields
  → More semantic than just @-mentions
  → Enables automatic family trees, org charts
  → Better search and filtering

DO: Plan your connection strategy
  → What articles should link to every character?
  → What's the "home" article for each category?
  → How do readers navigate from entry points?

DON'T: Over-link
  → Not every common word needs a link
  → Link on first mention, not every mention
  → Quality over quantity

DON'T: Create circular-only references
  → A links to B links to A (and nothing else)
  → Need connections to broader content web

DON'T: Forget secrets when planning
  → Decide early what's public vs hidden
  → Easier to plan secrets than add later
```

### Relationship Workflows

```
When Creating a New Character:
  1. Check for existing Species, Ethnicity articles
  2. Check for relevant Organization articles
  3. Set template relationship fields
  4. Add @-mentions to key locations, events, people
  5. Update related articles to mention this character
  6. Add secrets for GM-only knowledge

When Creating a New Location:
  1. Determine parent location (settlement/geography)
  2. Set "Located in" relationship
  3. @-mention relevant characters, organizations
  4. Consider timeline events (founding, battles)
  5. Add to relevant maps
  6. Create secrets for hidden areas/contents

When Creating a New Organization:
  1. Set parent organization if applicable
  2. Link founding character, founding date
  3. @-mention headquarters location
  4. List member characters (or link to them)
  5. Consider rival/allied organizations
  6. Add secrets for hidden agendas
```

## Campaign Management Guide

WorldAnvil isn't just for worldbuilding—it's designed for running tabletop RPG campaigns. This section covers tools and patterns for active campaign management.

### Campaign Resource Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                  CAMPAIGN MANAGEMENT TOOLS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NOTEBOOKS                                                      │
│    → GM-only planning spaces                                    │
│    → Session prep, plot threads, encounter notes                │
│    → Not visible to players                                     │
│                                                                 │
│  SESSION REPORTS                                                │
│    → Chronicle what happened each session                       │
│    → Can be player-visible (shared memories)                    │
│    → Links to NPCs, locations encountered                       │
│                                                                 │
│  SECRETS                                                        │
│    → Hidden information on public articles                      │
│    → Revealed progressively as campaign unfolds                 │
│    → Track what players know vs don't know                      │
│                                                                 │
│  CHARACTER SHEETS                                               │
│    → Player character articles with statblocks                  │
│    → Inventory management via Collections                       │
│    → XP and progression tracking                                │
│                                                                 │
│  PLOT ARTICLES                                                  │
│    → Adventure/quest structure                                  │
│    → Acts, scenes, dramatic questions                           │
│    → Can mix public hooks with secret resolutions               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Notebooks: GM Planning Space

```
NOTEBOOK STRUCTURE
━━━━━━━━━━━━━━━━━━

Notebook: "Campaign: Dragon's Bane"
├── Section: "Session Prep"
│   ├── Note: "Session 5 - The Mountain Pass"
│   ├── Note: "Session 6 - Dragon's Lair"
├── Section: "Plot Threads"
│   ├── Note: "Main Quest: Stop the Dragon Cult"
│   ├── Note: "Side Quest: Merchant's Missing Son"
│   ├── Note: "Background: Political Intrigue"
├── Section: "NPCs Active"
│   ├── Note: "Allies this arc"
│   ├── Note: "Enemies revealed"
├── Section: "Player Notes"
│   ├── Note: "What they know"
│   ├── Note: "What they think they know"
│   ├── Note: "Hooks they've ignored"

NOTEBOOK BEST PRACTICES
  • One notebook per campaign
  • Sections by purpose, not chronology
  • Notes can be messy - they're for you
  • Update after each session
```

### Session Reports: Game Chronicle

```
SESSION REPORT TEMPLATE WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before Session:
  1. Create Session Report article (draft)
  2. Add expected NPCs, locations to mentions
  3. Note planned encounters

During Session:
  4. Quick notes on what actually happened
  5. Track decisions, revelations

After Session:
  6. Expand notes into narrative
  7. Add @-mentions for all NPCs, locations
  8. Set visibility (player-visible or GM-only)
  9. Update related articles if needed
  10. Mark secrets to reveal

SESSION REPORT CONTENT
  • Date and session number
  • Players present
  • Summary of events
  • Key NPC interactions
  • Loot/rewards obtained
  • Cliffhanger or next session hook
```

### Player Visibility Control

```
VISIBILITY LEVELS
━━━━━━━━━━━━━━━━━

PUBLIC
  → Visible to anyone viewing the world
  → Use for: General lore, public knowledge

FOLLOWERS
  → Visible to world followers
  → Use for: Player-group shared content

SUBSCRIBERS
  → Visible to paying subscribers
  → Use for: Premium content

GM ONLY
  → Only visible to world owner
  → Use for: Secrets, plot twists, hidden connections

WHITELISTED
  → Visible to specific users you choose
  → Use for: Character-specific knowledge

STRATEGY
━━━━━━━━━
1. Default articles to PUBLIC (world lore)
2. Campaign-specific content → FOLLOWERS or WHITELISTED
3. All future reveals → GM ONLY + Secrets
4. Revealed secrets → change to appropriate level
```

### Campaign Organization Pattern

From power user research (Ethnis, Istralar):

```
RECOMMENDED STRUCTURE
━━━━━━━━━━━━━━━━━━━━

Categories:
├── World Lore/                      (PUBLIC)
│   ├── Geography/
│   ├── History/
│   ├── Factions/
├── Campaign: Dragon's Bane/         (FOLLOWERS)
│   ├── Session Reports/
│   ├── Active Quests/
│   ├── Party NPCs/                  (Met NPCs only)
├── GM Resources/                    (GM ONLY)
│   ├── Future Encounters/
│   ├── Unmet NPCs/
│   ├── Plot Secrets/

Notebooks:
├── Dragon's Bane Planning          (inherently GM-only)
    ├── Session Prep/
    ├── Plot Threads/
    ├── Player Knowledge Tracker/
```

### Tracking Sheets Pattern

From Ethnis's collaborative approach:

```
TRACKING SHEET ARTICLES
━━━━━━━━━━━━━━━━━━━━━━━

Create Generic articles for campaign state:

"Party Status" (Generic, FOLLOWERS)
  • Current location
  • Active quests
  • Party resources (gold, supplies)
  • Relationship standings with factions

"Known NPCs" (Generic, FOLLOWERS)
  • Table of NPCs met
  • Disposition toward party
  • Last seen location
  • Outstanding debts/favors

"Timeline of Events" (Generic, FOLLOWERS)
  • What happened when
  • Links to Session Reports
  • Major plot milestones

BENEFITS
  • Players can reference between sessions
  • GM has canonical "current state"
  • Reduces "wait, who was that again?"
```

### Player Character Management

```
PC ARTICLE PATTERN
━━━━━━━━━━━━━━━━━━

For each Player Character:

1. Character Article (FOLLOWERS visibility)
   • Biography and background
   • Personality, ideals, flaws
   • Relationships to other PCs
   • @-mentions to relevant lore

2. Character Statblock (attached)
   • Current stats and abilities
   • Updated as character levels
   • RPG system specific

3. Inventory Collection
   • Items as statblocks in collection
   • Quick reference during play
   • Track attunement, charges

4. Character Secrets (GM ONLY)
   • Hidden backstory elements
   • Unresolved plot hooks
   • Notes for character arcs
```

### Campaign Lifecycle Workflows

```
STARTING A NEW CAMPAIGN
━━━━━━━━━━━━━━━━━━━━━━━
1. Create campaign category structure
2. Create campaign notebook
3. Set up "Session 0" article with ground rules
4. Create or import starting location articles
5. Create initial NPC articles (player-known only)
6. Create PC articles with players
7. Prepare Session 1 in notebook

DURING CAMPAIGN
━━━━━━━━━━━━━━━
After each session:
  1. Complete Session Report
  2. Update tracking sheets
  3. Move GM-only NPCs to followers if met
  4. Reveal appropriate secrets
  5. Update PC articles if leveled
  6. Prep next session in notebook

ENDING A CAMPAIGN
━━━━━━━━━━━━━━━━━
1. Write finale Session Report
2. Create "Epilogue" article
3. Reveal remaining secrets (optional)
4. Archive campaign materials
5. Update world lore based on campaign events
```

### Anti-Patterns for Campaigns

```
DON'T: Mix world lore with campaign specifics
  → "Thronehold" article shouldn't mention PC adventures
  → Keep lore evergreen, campaign ephemeral
  → Exception: Major world-changing events

DON'T: Rely on player memory
  → Document everything they learn
  → Update tracking sheets religiously
  → Make information findable

DON'T: Create content players won't see
  → Focus on what's immediately relevant
  → Expand lore as campaign explores
  → Prep one session ahead, not ten

DON'T: Forget to update after revelations
  → When players learn a secret, update visibility
  → When NPCs change, update their articles
  → Campaign state should always be current
```

## BBCode Quick Reference

WorldAnvil uses BBCode (not Markdown) for formatting content. The MCP server automatically converts Markdown to BBCode, but knowing BBCode allows for more precise control.

### Basic Text Formatting

```
FORMATTING TAGS
━━━━━━━━━━━━━━━
[b]Bold text[/b]                    → Bold text
[i]Italic text[/i]                  → Italic text
[u]Underlined text[/u]              → Underlined text
[s]Strikethrough[/s]                → Strikethrough
[small]Smaller text[/small]         → Smaller text
[sup]Superscript[/sup]              → Superscript
[sub]Subscript[/sub]                → Subscript
[dc]T[/dc]his is a drop cap         → Fancy first letter
[mark]Highlighted[/mark]            → Highlighted (Grandmaster+)

COLORED TEXT
[color:red]Red text[/color]
[color:red|yellow]Red on yellow background[/color]
[color:#FF5733]Hex color[/color]

SPECIAL
[redacted:4]                        → ████ (censored text)
[noparse][b]Show tags[/b][/noparse] → Display BBCode without rendering
/* Hidden comment */                → Not visible in output (Guild+)
```

### Headers

```
[h1]Level 1 Header[/h1]    → Largest header
[h2]Level 2 Header[/h2]    → Section header
[h3]Level 3 Header[/h3]    → Subsection header
[h4]Level 4 Header[/h4]    → Smallest header

With anchor (for jump links):
[h3|my-anchor]Header with Anchor[/h3]
[url:#my-anchor]Jump to header[/url]
```

### Layout Containers

```
QUOTE BLOCK
[quote]This is quoted text.
|Attribution[/quote]

READ-ALOUD BOX (for GMs)
[aloud]Text to read to players[/aloud]

CODE BLOCK
[code]Monospaced text for code[/code]

SPOILER/COLLAPSIBLE
[spoiler]Hidden content here.
|Click to reveal![/spoiler]

TOOLTIP (hover text)
[tooltip:This appears on hover]Hover over me![/tooltip]

CUSTOM SIDEBAR FIELD
--Field Name::Field Value--
```

### Article Mentions & Links

```
ARTICLE LINKING (The @ System)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Basic mention:
  @[Article Title]
  → Creates link, shows in "mentioned in" on target

With template disambiguation:
  @[Article Title](template:article-id)
  → Use when multiple articles have same name

With custom display text:
  @[Article Title](Display Text)
  → Shows "Display Text" but links to Article Title

EXTERNAL LINKS
[url:https://example.com]Link text[/url]
[url:https://example.com|blank]Opens in new tab[/url]

WORLD ANVIL CONTENT LINKS
[category:category-id]Category Name[/category]
[timeline:timeline-id]Timeline Name[/timeline]
[history:history-id]Event Name[/history]
[blocklink:block-id]                    → Link to statblock
[world:world-uuid]                      → Link to world
```

### Embedding Content

```
IMAGES
[img:image-id]                     → Basic embed
[img:image-id|center]              → Centered
[img:image-id|left]                → Float left
[img:image-id|right]               → Float right

ARTICLE BLOCK (preview card)
[articleblock:article-id]

MAPS (interactive)
[map:map-id]

STATBLOCKS
[block:block-id]

SECRETS (Guild+)
[secret:secret-id]

MANUSCRIPTS (Master+)
[manuscript:manuscript-id]

FAMILY TREES (Master+)
[familytree:character-id]

DIPLOMACY WEBS (Master+)
[diplomacy:organization-id]

BOOK-STYLE CATEGORY
[book:category-id]
```

### Paragraph & Layout

```
LINE BREAKS
[br]                               → Single line break
[hr]                               → Horizontal rule

PARAGRAPH FORMATTING
[p]Paragraph text[/p]              → Explicit paragraph
[in]Indented first line[/in]       → Indent paragraph

TEXT ALIGNMENT
[center]Centered text[/center]
[right]Right-aligned text[/right]
[justify]Justified text[/justify]
```

### Lists

```
UNORDERED LIST
[ul]
- First item
- Second item
- Third item
[/ul]

ORDERED LIST
[ol]
- First item
- Second item
- Third item
[/ol]

NESTED LISTS
[ul]
- Parent item
[ul]
- Child item
- Another child
[/ul]
- Back to parent
[/ul]
```

### Tables

```
BASIC TABLE
[table]
[tr]
[th]Header 1[/th]
[th]Header 2[/th]
[/tr]
[tr]
[td]Cell 1[/td]
[td]Cell 2[/td]
[/tr]
[/table]
```

### Columns

```
TWO COLUMNS
[row]
[col]Left column content[/col]
[col]Right column content[/col]
[/row]

THREE COLUMNS
[row]
[col3]First[/col3]
[col3]Second[/col3]
[col3]Third[/col3]
[/row]

ASYMMETRIC COLUMNS
[row]
[col8]Wide column (8/12)[/col8]
[col4]Narrow column (4/12)[/col4]
[/row]
```

### Subscription Tier Features

```
FREE (Freeman):
  • Basic formatting ([b], [i], [u], [s])
  • Headers, quotes, lists
  • Article mentions, links
  • Images, basic embeds

GUILD (All paid tiers):
  • Hidden comments /* */
  • Secret embeds
  • Interactive dice roller

MASTER:
  • Manuscript embeds
  • Family tree embeds
  • Diplomacy web embeds

GRANDMASTER:
  • [mark] highlighting
  • Custom CSS styling
  • Advanced interactive elements
```

### BBCode Best Practices

```
DO: Use semantic tags
  [quote] for quotations, not just indented boxes
  [aloud] for GM read-aloud text
  [code] for actual code/data

DO: Use @-mentions for cross-linking
  → Creates bidirectional references
  → Enables "mentioned in" tracking
  → Better than raw [url] links

DO: Keep BBCode readable
  → One tag per line for complex structures
  → Consistent indentation in lists
  → Comments for complex layouts

DON'T: Nest incompatible tags
  → [b][i]text[/b][/i] is WRONG
  → [b][i]text[/i][/b] is correct

DON'T: Over-format
  → Let the theme handle styling
  → Too much formatting looks cluttered
  → Focus on content organization
```

### Markdown to BBCode Conversion

The MCP server automatically converts Markdown in article content:

```
AUTOMATIC CONVERSIONS
━━━━━━━━━━━━━━━━━━━━━
**bold**           → [b]bold[/b]
*italic*           → [i]italic[/i]
~~strikethrough~~  → [s]strikethrough[/s]
# Header           → [h1]Header[/h1]
[link](url)        → [url:url]link[/url]
- list item        → [ul]- list item[/ul]
> blockquote       → [quote]blockquote[/quote]
`code`             → [code]code[/code]
---                → [hr]
| table |          → [table]...[/table]

NOT CONVERTED (WorldAnvil-specific):
  • @-mentions (use BBCode syntax)
  • Embeds ([img], [map], [block])
  • Advanced containers ([aloud], [spoiler])
  • Columns ([row], [col])
```
