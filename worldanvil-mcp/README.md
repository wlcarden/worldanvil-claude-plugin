# World Anvil MCP Server

MCP (Model Context Protocol) server for integrating World Anvil API with Claude Code. Provides 105 tools for complete worldbuilding automation.

## Features

### Content Management
- **Articles** - Full CRUD with 50+ template types (character, location, species, law, etc.)
- **Categories** - Organize your world content
- **Variables** - Reusable values (terms, numbers, links) referenced in articles
- **Blocks** - Reusable content blocks for templates
- **Block Folders** - Organize blocks into folders

### Campaign Tools
- **Notebooks** - Session journals and campaign logs
- **Note Sections** - Organize notes within notebooks
- **Notes** - Individual session entries
- **Secrets** - GM-only information

### World Structure
- **Worlds** - Create and manage multiple worlds
- **Maps** - Interactive world maps
- **Map Markers** - Points of interest on maps
- **Timelines** - Historical event tracking
- **History Events** - Timeline entries
- **Manuscripts** - Long-form writing projects
- **Canvas** - Visual boards for worldbuilding

### Access Control
- **Subscriber Groups** - Control who can see your content

### Utilities
- **Markdown to BBCode** - Automatic conversion for all content
- **Images** - Browse uploaded images
- **RPG Systems** - List available game systems

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get API Credentials

You need two authentication tokens from World Anvil:

- **Application Key** (`WA_APP_KEY`): Request from World Anvil dev team
- **User Auth Token** (`WA_AUTH_TOKEN`): Get from https://www.worldanvil.com/api/auth/key

### 3. Configure in Claude Code

Add to your MCP configuration (`~/.claude/settings.json` or equivalent):

```json
{
  "mcpServers": {
    "worldanvil": {
      "command": "node",
      "args": ["/path/to/worldanvil-mcp/index.js"],
      "env": {
        "WA_APP_KEY": "your-application-key",
        "WA_AUTH_TOKEN": "your-auth-token"
      }
    }
  }
}
```

### 4. Restart Claude Code

The World Anvil tools will now be available!

## Available Tools

### Identity & Worlds

| Tool | Description |
|------|-------------|
| `worldanvil_get_identity` | Get current user info |
| `worldanvil_list_worlds` | List all your worlds |
| `worldanvil_get_world` | Get world details |
| `worldanvil_create_world` | Create a new world |
| `worldanvil_update_world` | Update world settings |
| `worldanvil_delete_world` | Delete a world |

### Articles

| Tool | Description |
|------|-------------|
| `worldanvil_list_articles` | List articles in a world |
| `worldanvil_get_article` | Get article with full content |
| `worldanvil_create_article` | Create new article (markdown supported!) |
| `worldanvil_update_article` | Update existing article |
| `worldanvil_delete_article` | Delete an article |

**Create Article Example:**
```
Create an article with:
- title: "The Great Library"
- world_id: "abc123"
- template: "location"
- content: "# Overview\n\nA vast repository of **ancient knowledge**..."
- fields: { "geography": "Central district", "population": "500 scholars" }
```

### Categories

| Tool | Description |
|------|-------------|
| `worldanvil_list_categories` | List categories in a world |
| `worldanvil_get_category` | Get category details |
| `worldanvil_create_category` | Create new category |
| `worldanvil_update_category` | Update category |
| `worldanvil_delete_category` | Delete category |

### Blocks & Block Folders

| Tool | Description |
|------|-------------|
| `worldanvil_list_blocks` | List all blocks in a world |
| `worldanvil_list_blocks_in_folder` | List blocks in a specific folder |
| `worldanvil_get_block` | Get block content |
| `worldanvil_create_block` | Create reusable block |
| `worldanvil_update_block` | Update block |
| `worldanvil_delete_block` | Delete block |
| `worldanvil_list_blockfolders` | List block folders |
| `worldanvil_get_blockfolder` | Get folder details |
| `worldanvil_create_blockfolder` | Create folder |
| `worldanvil_update_blockfolder` | Update folder |
| `worldanvil_delete_blockfolder` | Delete folder |

### Block Templates & Parts

| Tool | Description |
|------|-------------|
| `worldanvil_list_blocktemplates` | List user's block templates |
| `worldanvil_get_blocktemplate` | Get template with parts (granularity=2) |
| `worldanvil_create_blocktemplate` | Create template (requires undocumented fields) |
| `worldanvil_update_blocktemplate` | Update template |
| `worldanvil_delete_blocktemplate` | Delete template and all parts |
| `worldanvil_list_blocktemplateparts` | List template parts (API bug - use get instead) |
| `worldanvil_get_blocktemplatepart` | Get part details |
| `worldanvil_create_blocktemplatepart` | Create part/field in template |
| `worldanvil_update_blocktemplatepart` | Update part |
| `worldanvil_delete_blocktemplatepart` | Delete part |

### Notebooks, Sections & Notes

| Tool | Description |
|------|-------------|
| `worldanvil_list_notebooks` | List notebooks in a world |
| `worldanvil_get_notebook` | Get notebook |
| `worldanvil_create_notebook` | Create notebook |
| `worldanvil_update_notebook` | Update notebook |
| `worldanvil_delete_notebook` | Delete notebook |
| `worldanvil_list_notesections` | List sections in a notebook |
| `worldanvil_get_notesection` | Get section |
| `worldanvil_create_notesection` | Create section |
| `worldanvil_update_notesection` | Update section |
| `worldanvil_delete_notesection` | Delete section |
| `worldanvil_list_notes` | List notes in a section |
| `worldanvil_get_note` | Get note |
| `worldanvil_create_note` | Create note |
| `worldanvil_update_note` | Update note |
| `worldanvil_delete_note` | Delete note |

### Secrets

| Tool | Description |
|------|-------------|
| `worldanvil_list_secrets` | List secrets in a world |
| `worldanvil_get_secret` | Get secret content |
| `worldanvil_create_secret` | Create secret |
| `worldanvil_update_secret` | Update secret |
| `worldanvil_delete_secret` | Delete secret |

### Maps & Markers

| Tool | Description |
|------|-------------|
| `worldanvil_list_maps` | List maps in a world |
| `worldanvil_get_map` | Get map details |
| `worldanvil_create_map` | Create map |
| `worldanvil_update_map` | Update map |
| `worldanvil_delete_map` | Delete map |
| `worldanvil_list_markers` | List markers on a map |
| `worldanvil_get_marker` | Get marker |
| `worldanvil_create_marker` | Create marker |
| `worldanvil_update_marker` | Update marker |
| `worldanvil_delete_marker` | Delete marker |

### Timelines & History

| Tool | Description |
|------|-------------|
| `worldanvil_list_timelines` | List timelines |
| `worldanvil_get_timeline` | Get timeline |
| `worldanvil_create_timeline` | Create timeline |
| `worldanvil_update_timeline` | Update timeline |
| `worldanvil_delete_timeline` | Delete timeline |
| `worldanvil_list_histories` | List history events |
| `worldanvil_get_history` | Get history event |
| `worldanvil_create_history` | Create event |
| `worldanvil_update_history` | Update event |
| `worldanvil_delete_history` | Delete event |

### Manuscripts

| Tool | Description |
|------|-------------|
| `worldanvil_list_manuscripts` | List manuscripts in a world |
| `worldanvil_get_manuscript` | Get manuscript |
| `worldanvil_create_manuscript` | Create manuscript |
| `worldanvil_update_manuscript` | Update manuscript |
| `worldanvil_delete_manuscript` | Delete manuscript |

### Canvas (Visual Boards)

| Tool | Description |
|------|-------------|
| `worldanvil_list_canvases` | List visual boards in a world |
| `worldanvil_get_canvas` | Get canvas details |
| `worldanvil_create_canvas` | Create visual board |
| `worldanvil_update_canvas` | Update visual board |
| `worldanvil_delete_canvas` | Delete visual board |

### Subscriber Groups

| Tool | Description |
|------|-------------|
| `worldanvil_list_subscribergroups` | List access control groups |
| `worldanvil_get_subscribergroup` | Get subscriber group |
| `worldanvil_create_subscribergroup` | Create access group |
| `worldanvil_update_subscribergroup` | Update access group |
| `worldanvil_delete_subscribergroup` | Delete access group |

### Variable Collections & Variables

| Tool | Description |
|------|-------------|
| `worldanvil_list_variablecollections` | List variable collections in a world |
| `worldanvil_get_variablecollection` | Get collection details |
| `worldanvil_create_variablecollection` | Create collection with prefix |
| `worldanvil_update_variablecollection` | Update collection |
| `worldanvil_delete_variablecollection` | Delete collection (deletes all variables!) |
| `worldanvil_list_variables` | List variables in a collection |
| `worldanvil_get_variable` | Get variable details |
| `worldanvil_create_variable` | Create variable (key-value pair) |
| `worldanvil_update_variable` | Update variable |
| `worldanvil_delete_variable` | Delete variable |

### Other

| Tool | Description |
|------|-------------|
| `worldanvil_list_images` | List images in a world |
| `worldanvil_list_rpgsystems` | List available RPG systems |
| `worldanvil_get_rpgsystem` | Get RPG system details |

## Variables Best Practices

Variables are reusable values referenced throughout your world using `[prefix:key]` syntax. They're ideal for content that appears in multiple articles but doesn't warrant its own article page.

> **Community Principle:** "Better to have too many collections than too few"

### When to Use Variables vs Articles

| Use Variables For | Use Articles For |
|-------------------|------------------|
| Quick term definitions | Full character biographies |
| Abbreviations & titles | Detailed location descriptions |
| Consistent naming (kingdom, currency) | Anything needing its own page |
| Values that might change globally | Static, standalone content |
| Glossary/dictionary terms | Content with relationships |

### Variable Types - Display Behavior

Understanding how each type *displays* is critical:

| Type | Display Behavior | Best For |
|------|------------------|----------|
| `string` | Title shows; value = **hover tooltip** | Glossary terms, abbreviations, quick definitions |
| `rendered` | Value **replaces variable inline** (supports BBCode) | Reusable banners, styled containers, announcements |
| `link` | Creates clickable hyperlink | External URLs, social media, VTT links |
| `number` | Numeric value | Years, quantities, stats |
| `json` | Structured data via API | Advanced integrations |

**Example - String (Tooltip):**
```
Key: "arcanum"  Title: "Arcanum"  Value: "The raw magical energy..."
Usage: "Wizards tap into the [def:arcanum]..."
Result: Hover over "Arcanum" shows tooltip with definition
```

**Example - Rendered (Inline):**
```
Key: "wip_banner"  Value: "[container:wip][b]Work in Progress[/b][/container]"
Usage: "[frag:wip_banner]" at top of draft articles
Result: Styled banner appears inline in the article
```

### Collection Organization

Organize by theme, not by size:

```
GOOD (Granular by theme):
├── "Calendar & Time"      prefix: "cal"   → [cal:current_year], [cal:era]
├── "Currency"             prefix: "coin"  → [coin:gold], [coin:silver]
├── "Noble Titles"         prefix: "title" → [title:king], [title:duke]
└── "Common Terms"         prefix: "term"  → [term:magic], [term:religion]

BAD (Catch-all):
└── "World Stuff"          prefix: "world" → Everything mixed together
```

### Naming Conventions

```
Prefixes:  3-6 characters, lowercase, memorable
           "lore", "cal", "npc", "def", "ui"

Keys:      lowercase_snake_case, SHORT
           "current_year" ✓    "the_current_year_of_the_realm" ✗
           "gold_value" ✓      "gv" ✗ (too cryptic)
```

### Workflow for Agents

1. **ALWAYS check first:**
   ```
   worldanvil_list_variablecollections  → Avoid duplicate collections
   worldanvil_list_variables            → Avoid duplicate keys
   ```

2. **When creating collections:**
   - Prefix is PERMANENT - cannot change without breaking references
   - Add description explaining the collection's purpose
   - Plan for growth - themed collections scale better

3. **When creating variables:**
   - Choose type based on desired display behavior
   - Use `string` for most cases (tooltip behavior)
   - Use `rendered` only for BBCode/styled content

4. **Avoid destructive changes:**
   - Changing key → breaks all `[prefix:oldkey]` references
   - Changing prefix → breaks ALL variables in collection
   - Deleting collection → deletes ALL its variables
   - **PREFER updating value over deleting**

### Power Patterns

**Glossary System:**
```
Collection: "Definitions"  Prefix: "def"  Type: string
Variables: arcanum, leyline, mana, spell...
Usage: Natural reading with hover definitions
```

**Styled Containers:**
```
Collection: "UI Elements"  Prefix: "ui"  Type: rendered
Variables: warning_box, info_panel, quote_block...
Usage: Consistent styling across all articles
```

**World Constants:**
```
Collection: "World Facts"  Prefix: "lore"  Type: string/number
Variables: world_name, capital, current_year, founding_date...
Usage: Change once, updates everywhere
```

### Limitations

- Variables do NOT work inside statblocks (different scope)
- Only ONE level of variable nesting supported
- Requires Master rank+ WorldAnvil subscription

### Agent Guidelines

For comprehensive agent guidance, see [CLAUDE.md](./CLAUDE.md), which includes:

- **Variables Decision Framework** - When to use variables vs articles, type selection
- **Article Template Selection** - Decision tree for 28 templates, disambiguation guides
- **Organization Strategy** - Category hierarchies, tagging, navigation patterns
- **Statblocks & Blocks** - RPG data management, Collections, system configuration
- **Content Relationships** - @-mentions, parent/child, maps, timelines, secrets
- **Campaign Management** - Notebooks, session reports, player visibility, PC tracking

Each section includes decision trees, power user patterns (from award-winning worlds like Ethnis, Cathedris, Istralar), workflows, and anti-patterns to avoid.

## Markdown Support

All content fields automatically convert Markdown to World Anvil BBCode:

| Markdown | BBCode |
|----------|--------|
| `# Header` | `[h1]Header[/h1]` |
| `**bold**` | `[b]bold[/b]` |
| `*italic*` | `[i]italic[/i]` |
| `` `code` `` | `[code]code[/code]` |
| `[link](url)` | `[url=url]link[/url]` |
| `- item` | `[ul][li]item[/li][/ul]` |
| `1. item` | `[ol][li]item[/li][/ol]` |
| `> quote` | `[quote]quote[/quote]` |
| Tables | Full table support |

## Development

### Project Structure

```
worldanvil-mcp/
├── index.js              # Entry point
├── src/
│   ├── utils.js          # Markdown conversion
│   ├── api-client.js     # WorldAnvil API client
│   ├── tools.js          # Tool definitions
│   ├── handlers.js       # Tool handlers
│   └── server.js         # MCP server factory
├── test/
│   ├── utils.test.js     # Markdown conversion unit tests
│   ├── integration.test.js # MCP protocol tests
│   └── api.test.js       # Real API integration tests
└── vitest.config.js      # Test config
```

### Running Tests

```bash
npm test              # Run all tests (API tests skipped without credentials)
npm run test:watch    # Watch mode
npm run test:coverage # With coverage

# Run with real API integration tests:
WA_APP_KEY=xxx WA_AUTH_TOKEN=xxx npm test

# Use a specific test world (optional):
WA_TEST_WORLD_ID=xxx WA_APP_KEY=xxx WA_AUTH_TOKEN=xxx npm test
```

**Test World Strategy:**
- Tests look for an existing world with `[TEST]` prefix and reuse it
- If none exists, creates `[TEST] MCP Integration`
- The test world is preserved between runs (API doesn't allow world deletion)
- Set `WA_TEST_WORLD_ID` to use a specific world instead

**Warning:** Worlds with `[TEST]` prefix may be modified during tests - don't store important content in them!

### Local Development

```bash
npm run dev           # Run with file watching
```

## API Reference

- [World Anvil Boromir API](https://www.worldanvil.com/api/external/boromir/documentation)
- [MCP Protocol](https://modelcontextprotocol.io/)

## Changelog

### v1.8.0
- Added BBCode Quick Reference to CLAUDE.md
- Comprehensive formatting syntax guide for all BBCode tags
- @-mention syntax documentation for article linking
- Subscription tier feature breakdown (Freeman → Grandmaster)
- Markdown-to-BBCode conversion reference
- Added History Events, RPG Systems, and Images tests (+8 tests, 113 total)

### v1.7.0
- **Major Documentation Expansion** - CLAUDE.md now 1500+ lines of comprehensive guidance
- Article Template Selection Guide with decision tree for 28 templates
- Template disambiguation guides (Settlement vs Geography, Organization vs Ethnicity, etc.)
- Organization Strategy Guide with category patterns from power users
- Statblocks & Blocks Guide with RPG system integration
- Content Relationships Guide covering @-mentions, hierarchies, secrets
- Campaign Management Guide with notebooks, session reports, visibility control
- Power user patterns from award-winning worlds (Ethnis, Cathedris, Istralar)
- Anti-patterns and common mistakes documented for each resource type
- Workflow guidance for creating interconnected content

### v1.6.0
- Added Variable Collections CRUD (5 new tools)
- Added Variables CRUD (5 new tools)
- Added CLAUDE.md with comprehensive agent guidelines and decision trees
- Enhanced tool descriptions with type-specific behavior guidance
- Research-backed best practices from WorldAnvil community
- Variable type display behaviors documented (tooltip vs inline)
- Collection organization principles ("too many > too few")
- Power patterns: Glossary systems, styled containers, world constants
- Note: Swagger shows `/variable_collection` but API uses `/variablecollection`
- Note: Variable creation requires nested `{ id: ... }` objects despite Swagger docs

### v1.5.0
- Added Block Templates CRUD (10 new tools)
- Added Block Template Parts CRUD for defining statblock fields
- Note: `create_blocktemplate` requires undocumented `formSchemaParser` field
- Note: `list_blocktemplateparts` has server-side API bug - use `get_blocktemplate` instead

### v1.4.1
- Fixed Block creation - now requires `template_id` parameter (BlockTemplate ID from web UI)
- Fixed Note creation - added undocumented `type: 'default'` field
- Documented broken `list_notebooks` endpoint (WorldAnvil API limitation)
- Reusable `[TEST]` world strategy - no more orphaned test worlds
- Support for `WA_TEST_WORLD_ID` and `TEST_BLOCK_TEMPLATE_ID` environment variables
- Removed non-existent Chronicles and Eras endpoints

### v1.4.0
- Added Canvas (visual boards) CRUD
- Added Subscriber Groups (access control) CRUD
- Real API integration tests with test world creation/cleanup
- Replaced presence tests with functional API tests
- Tests skip gracefully when credentials not provided
- Rate limiting protection for API tests

### v1.3.0
- Modular code refactor for testability
- Added Blocks and Block Folders support
- Added Manuscripts support
- Added Vitest test suite (43 tests)
- InMemoryTransport integration testing

### v1.2.0
- Improved template documentation
- Better error messages
- Ordered list support in Markdown converter

### v1.1.0
- Automatic Markdown to BBCode conversion
- Template-specific fields support
- Fixed PATCH endpoint parameters

### v1.0.0
- Initial release with basic CRUD operations

## License

MIT
