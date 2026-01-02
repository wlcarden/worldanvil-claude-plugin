# WorldAnvil API Proxy Worker

A Cloudflare Worker that proxies requests to the WorldAnvil API, injecting your Application Key. This allows MCP users to access WorldAnvil without needing their own App Key.

## Why Use This?

- **App Keys are hard to get** - WorldAnvil requires approval for Application Keys
- **Share access safely** - Your App Key stays secret in Cloudflare, never exposed
- **Users only need Auth Tokens** - Easy to get from worldanvil.com/api/auth/key

## How It Works

```
User's MCP                    Your Worker              WorldAnvil API
    │                             │                         │
    │ x-auth-token: user123       │                         │
    ├────────────────────────────►│                         │
    │                             │ x-auth-token: user123   │
    │                             │ x-application-key: YOUR │
    │                             ├────────────────────────►│
    │                             │                         │
    │                             │◄────────────────────────┤
    │◄────────────────────────────┤                         │
```

## Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Customize Worker Name (Optional)

Edit `wrangler.toml` and change `name = "worldanvil-proxy"` to your preferred name.

### 4. Deploy

```bash
cd cloudflare-worker
wrangler deploy
```

### 5. Add Your App Key Secret

```bash
wrangler secret put WA_APP_KEY
# Paste your WorldAnvil Application Key when prompted
```

### 6. Share the Worker URL

Your worker is now live at:
```
https://worldanvil-proxy.<your-subdomain>.workers.dev
```

Share this URL with users. They configure their MCP with:
```
WA_PROXY_URL=https://worldanvil-proxy.<your-subdomain>.workers.dev
WA_AUTH_TOKEN=their-personal-auth-token
```

## User Setup

Users who don't have an App Key can use your proxy:

1. Get their Auth Token from https://www.worldanvil.com/api/auth/key
2. Set environment variables:
   ```
   WA_AUTH_TOKEN=their-token
   WA_PROXY_URL=https://your-worker.workers.dev
   ```
3. Leave `WA_APP_KEY` unset

The MCP will automatically route through your proxy.

## Security Considerations

- **App Key is secret** - Stored in Cloudflare secrets, never in code or logs
- **Auth Tokens identify users** - Each user accesses only their own content
- **Consider rate limiting** - Add rate limiting for high-traffic deployments
- **Monitor usage** - Check Cloudflare dashboard for unusual patterns

## Rate Limiting (Optional)

For production use, consider adding rate limiting. Add to `wrangler.toml`:

```toml
# Uncomment to enable rate limiting (requires Cloudflare paid plan)
# [[rate_limits]]
# binding = "RATE_LIMITER"
# namespace_id = "your-namespace-id"
```

## Troubleshooting

### "Proxy misconfigured: WA_APP_KEY secret not set"

Run `wrangler secret put WA_APP_KEY` and enter your App Key.

### "Missing x-auth-token header"

The user hasn't set their `WA_AUTH_TOKEN` environment variable.

### 502 Bad Gateway

WorldAnvil API is down or unreachable. Check https://status.worldanvil.com/

## License

MIT
