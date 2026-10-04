# Installing the Treza MCP server

Treza is a hosted MCP server. There is nothing to clone, build, or run locally, and no API key to set: the client connects to the URL below and the person signs in once in their browser.

- URL: `https://www.trezalabs.com/api/mcp`
- Transport: Streamable HTTP
- Auth: OAuth with dynamic client registration and PKCE. The client registers itself; the person signs in with Google on Treza's page and approves access.

## Cline

Add the server to `cline_mcp_settings.json`:

```json
{
  "mcpServers": {
    "treza": {
      "type": "streamableHttp",
      "url": "https://www.trezalabs.com/api/mcp",
      "disabled": false
    }
  }
}
```

Or, in the MCP Servers view, open Remote Servers, enter the name `treza` and the URL above, choose Streamable HTTP, and add it.

Cline then shows that the server needs authentication. Ask the person to click Authenticate: their browser opens Treza's sign-in page, they sign in with Google and approve, and the browser returns to Cline. The first sign-in creates their Treza account.

## Checking it worked

Call `get_credit_balance`. It returns the account's prepaid balance and the link where the person adds credits. Runs spend those credits, so call `estimate_run_cost` and tell the person the price before `run_pipeline`.

## Other clients

Any client that supports remote MCP servers with OAuth uses the same URL. For clients that only start local servers, see the `treza-mcp` stdio bridge in the README, which needs a `TREZA_API_KEY`.
