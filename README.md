# WorldAnvil MCP

MCP server for [WorldAnvil](https://www.worldanvil.com/) - the worldbuilding platform for writers, game masters, and creators.

Works with **Claude Code**, **Cursor**, **Windsurf**, **Cline**, and any MCP-compatible AI tool.

## Installation

### Claude Code

```bash
/install wlcarden/worldanvil-mcp
```

Then set your auth token:
```bash
export WA_AUTH_TOKEN="your-auth-token"
```

### Cursor / Windsurf / Other MCP Clients

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "worldanvil": {
      "command": "npx",
      "args": ["worldanvil-mcp"],
      "env": {
        "WA_AUTH_TOKEN": "your-auth-token"
      }
    }
  }
}
```

### npm (Direct)

```bash
npx worldanvil-mcp
```

Or install globally:
```bash
npm install -g worldanvil-mcp
```

## Setup

1. Get your **Auth Token** from https://www.worldanvil.com/api/auth/key
2. Configure your AI tool with the token (see installation above)

That's it! The MCP uses a public proxy so you don't need an Application Key.

## Features

Full WorldAnvil API integration with 90+ tools:

- **Articles** - Create, edit, and manage world articles (characters, locations, items, etc.)
- **Categories** - Organize content with hierarchical categories
- **Maps & Markers** - Manage interactive maps and location markers
- **Timelines & Events** - Track historical events and eras
- **Variables** - Reusable content snippets with BBCode support
- **Secrets** - GM-only information hidden from players
- **Notebooks & Notes** - Personal organization tools
- **Manuscripts** - Long-form writing projects
- **And more** - Blocks, canvases, subscriber groups, RPG systems

## Documentation

Once installed, Claude has access to comprehensive worldbuilding guidance:
- Article templates and best practices
- BBCode formatting reference
- Content relationship patterns (@-mentions, hierarchies)
- Campaign management workflows

## Self-Hosting the Proxy

If you prefer to use your own App Key, see `plugins/worldbuilding/worldanvil-mcp/cloudflare-worker/` for Cloudflare Worker deployment instructions.

## Contributing

Issues and PRs welcome! This plugin is maintained by the WorldAnvil community.

## License

MIT
