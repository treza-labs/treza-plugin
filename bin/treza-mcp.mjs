#!/usr/bin/env node
/**
 * Treza MCP server, stdio edition.
 *
 * Bridges a local stdio MCP client (Claude Desktop, Cursor, Codex, any agent
 * runtime that spawns servers) to the hosted Treza endpoint at
 * https://www.trezalabs.com/api/mcp. Every tool, prompt, and resource is
 * forwarded unchanged; nothing runs locally except this proxy.
 *
 * Auth: set TREZA_API_KEY to a scoped `treza_live_...` key. Mint one in the
 * Treza app under Settings > API keys, or ask an OAuth-connected client to
 * call the create_api_key tool. Clients that support OAuth can skip this
 * package entirely and connect to the URL directly.
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const REMOTE_URL = process.env.TREZA_MCP_URL || 'https://www.trezalabs.com/api/mcp';
const apiKey = process.env.TREZA_API_KEY;

if (!apiKey) {
  process.stderr.write(
    'treza-mcp: TREZA_API_KEY is not set. Mint a key at https://www.trezalabs.com/platform/settings ' +
      '(Settings > API keys) and export it, or connect your client to ' +
      REMOTE_URL +
      ' directly over OAuth.\n',
  );
  process.exit(1);
}

const remote = new Client({ name: 'treza-mcp-stdio', version: '1.0.1' });
const remoteTransport = new StreamableHTTPClientTransport(new URL(REMOTE_URL), {
  requestInit: { headers: { Authorization: `Bearer ${apiKey}` } },
});

try {
  await remote.connect(remoteTransport);
} catch (err) {
  process.stderr.write(`treza-mcp: could not reach ${REMOTE_URL}: ${err?.message || err}\n`);
  process.exit(1);
}

const remoteCaps = remote.getServerCapabilities() || {};
const remoteInfo = remote.getServerVersion() || { name: 'treza', version: '1.0.1' };

const local = new Server(
  { name: remoteInfo.name || 'treza', version: remoteInfo.version || '1.0.1' },
  {
    capabilities: {
      tools: remoteCaps.tools || {},
      ...(remoteCaps.prompts ? { prompts: remoteCaps.prompts } : {}),
      ...(remoteCaps.resources ? { resources: remoteCaps.resources } : {}),
    },
    instructions: remote.getInstructions(),
  },
);

local.setRequestHandler(ListToolsRequestSchema, (req) => remote.listTools(req.params));
local.setRequestHandler(CallToolRequestSchema, (req) => remote.callTool(req.params));

if (remoteCaps.prompts) {
  local.setRequestHandler(ListPromptsRequestSchema, (req) => remote.listPrompts(req.params));
  local.setRequestHandler(GetPromptRequestSchema, (req) => remote.getPrompt(req.params));
}
if (remoteCaps.resources) {
  local.setRequestHandler(ListResourcesRequestSchema, (req) => remote.listResources(req.params));
  local.setRequestHandler(ListResourceTemplatesRequestSchema, (req) =>
    remote.listResourceTemplates(req.params),
  );
  local.setRequestHandler(ReadResourceRequestSchema, (req) => remote.readResource(req.params));
}

const shutdown = async () => {
  try {
    await remote.close();
  } catch {}
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await local.connect(new StdioServerTransport());
