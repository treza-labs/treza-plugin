# Treza plugin

[Agent Plugins](https://agent-plugins.org) package for the Treza MCP server. Install it in Cursor, Codex, GitHub Copilot, VS Code, or any client that supports the standard, and your agent can build, run, schedule, and publish AI video pipelines to YouTube and TikTok.

- Server: `https://www.trezalabs.com/api/mcp` (Streamable HTTP, OAuth with dynamic client registration)
- Landing page and setup snippets: https://www.trezalabs.com/connect
- Docs: https://docs.trezalabs.com/api/mcp-server
- Privacy: https://docs.trezalabs.com/terms-and-privacy/privacy

## What is inside

| File | Purpose |
|---|---|
| `plugin.json` | Plugin manifest |
| `mcp.json` | Declares the remote Treza MCP server |
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
