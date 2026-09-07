# Treza plugin

[Agent Plugins](https://agent-plugins.org) package for the Treza MCP server. Install it in Cursor, Codex, GitHub Copilot, VS Code, or any client that supports the standard, and your agent can build, run, schedule, and publish AI video pipelines to YouTube and TikTok.

- Server: `https://www.trezalabs.com/api/mcp` (Streamable HTTP, OAuth with dynamic client registration)
- Landing page and setup snippets: https://www.trezalabs.com/connect
- Docs: https://docs.trezalabs.com/api/mcp-server
- Privacy: https://docs.trezalabs.com/terms-and-privacy/privacy

## Two ways to connect

**Remote (recommended).** Point any client that supports OAuth at `https://www.trezalabs.com/api/mcp`. The first connection signs you in with Google and creates the Treza account. Nothing to install.

**stdio bridge.** For clients and agent runtimes that only spawn local servers, this repo ships `treza-mcp`, a small Node bridge that forwards every tool, prompt, and resource to the hosted endpoint. It needs a scoped API key in `TREZA_API_KEY` (mint one in the Treza app under Settings, API keys, or have an OAuth-connected client call `create_api_key`).

```json
{
  "mcpServers": {
    "treza": {
      "command": "npx",
      "args": ["-y", "github:treza-labs/treza-plugin"],
      "env": { "TREZA_API_KEY": "treza_live_..." }
    }
  }
}
```

`TREZA_MCP_URL` overrides the endpoint (staging, self-hosted). The bridge runs nothing locally; it is a proxy.

## What is inside

| File | Purpose |
|---|---|
| `bin/treza-mcp.mjs` | The stdio bridge (source of the `treza-mcp` command) |
| `plugin.json` | Agent Plugins manifest |
| `mcp.json` | Declares the remote Treza MCP server for plugin-aware clients |
| `skills/treza-video-pipelines/` | A skill that teaches the agent the credits-first, estimate-before-run workflow |

## Tools

Sixteen tools: `list_pipeline_templates`, `list_node_types`, `get_node_type`, `create_pipeline`, `update_pipeline`, `publish_pipeline`, `list_pipelines`, `get_pipeline`, `run_pipeline`, `get_run`, `list_runs`, `set_schedule_paused`, `estimate_run_cost`, `get_credit_balance`, `list_connected_channels`, `create_api_key`. Read-only tools carry `readOnlyHint`; `run_pipeline` and `publish_pipeline` spend prepaid credits and can post to a connected channel.

## Cursor without the plugin

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "treza": { "url": "https://www.trezalabs.com/api/mcp" }
  }
}
```

Runs spend prepaid credits on your Treza account. Agents with a wallet can top up over [x402](https://www.trezalabs.com/x402) with no human in the loop.

MIT licensed. Support: hello@trezalabs.com
