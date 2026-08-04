# @pipeworx/packagephobia

Packagephobia MCP — measures the size an npm package takes up on disk after install (publish-size + install-size including all transitive deps). Complements bundlephobia, which measures runtime bundle size. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `size(package, version?)` — install + publish size for an npm package

## Why bother?

Bundle size ≠ install size. A package can be tiny at runtime but pull in heavy dev/transitive deps that slow CI cache hydration. packagephobia measures the full `node_modules` footprint.

## Data source

`https://packagephobia.com/v2/api.json?p=<pkg>[@version]`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "packagephobia": {
      "url": "https://gateway.pipeworx.io/packagephobia/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Packagephobia data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
