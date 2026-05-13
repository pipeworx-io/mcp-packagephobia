interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Packagephobia MCP — install-size analysis for npm packages
 *
 * Auth: none.
 */


const BASE = 'https://packagephobia.com/v2/api.json';

const tools: McpToolExport['tools'] = [
  {
    name: 'size',
    description: 'Install + publish size for an npm package.',
    inputSchema: {
      type: 'object',
      properties: {
        package: { type: 'string', description: 'npm package name (scoped allowed)' },
        version: { type: 'string', description: 'Specific version (default latest)' },
      },
      required: ['package'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  if (name !== 'size') throw new Error(`Unknown tool: ${name}`);
  const pkg = reqStr(args, 'package', '"react"');
  const version = (args.version as string | undefined)?.trim();
  const p = version ? `${pkg}@${version}` : pkg;
  const url = `${BASE}?p=${encodeURIComponent(p)}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'pipeworx-mcp-packagephobia/1.0 (+https://pipeworx.io)',
    },
  });
  if (res.status === 404) throw new Error('Packagephobia: not found');
  if (res.status === 429) throw new Error('Packagephobia: rate-limit (HTTP 429)');
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Packagephobia error: ${res.status} ${t.slice(0, 200)}`);
  }
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
