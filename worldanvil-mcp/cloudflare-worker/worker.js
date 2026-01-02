/**
 * WorldAnvil API Proxy Worker
 *
 * A Cloudflare Worker that proxies requests to the WorldAnvil API,
 * injecting the Application Key from Worker secrets.
 *
 * This allows users to use the WorldAnvil MCP without needing their own App Key.
 * Each user still needs their own Auth Token (for their WorldAnvil account).
 *
 * Setup:
 *   1. Deploy this worker to Cloudflare
 *   2. Add your WA_APP_KEY as a secret: wrangler secret put WA_APP_KEY
 *   3. Configure MCP with WA_PROXY_URL=https://your-worker.workers.dev
 *
 * Environment Variables (secrets):
 *   - WA_APP_KEY: Your WorldAnvil Application Key (required)
 *
 * Security:
 *   - App Key is stored in Cloudflare secrets, never exposed to clients
 *   - Auth Token is passed through from client (identifies the user)
 *   - Consider adding rate limiting for production use
 */

const WORLDANVIL_API = 'https://www.worldanvil.com/api/external/boromir';

export default {
  async fetch(request, env, ctx) {
    // Only allow expected methods
    const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    if (!allowedMethods.includes(request.method)) {
      return new Response('Method not allowed', { status: 405 });
    }

    // Get the path from the request (e.g., /identity, /world, /article)
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    // Build the WorldAnvil API URL
    const waUrl = `${WORLDANVIL_API}${path}`;

    // Clone headers and inject the App Key
    const headers = new Headers(request.headers);

    // Validate that we have the App Key configured
    if (!env.WA_APP_KEY) {
      return new Response(JSON.stringify({
        error: 'Proxy misconfigured: WA_APP_KEY secret not set'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Inject the App Key (this is the whole point of the proxy)
    headers.set('x-application-key', env.WA_APP_KEY);

    // Ensure Auth Token is present (user must provide this)
    if (!headers.get('x-auth-token')) {
      return new Response(JSON.stringify({
        error: 'Missing x-auth-token header. You must provide your WorldAnvil Auth Token.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Set a custom User-Agent to identify proxy requests
    headers.set('User-Agent', 'WorldAnvil-MCP-Proxy/1.0');

    // Forward the request to WorldAnvil
    try {
      const response = await fetch(waUrl, {
        method: request.method,
        headers: headers,
        body: request.body,
      });

      // Return the response with CORS headers (in case of browser usage)
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, x-auth-token');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: `Proxy error: ${error.message}`
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
};
