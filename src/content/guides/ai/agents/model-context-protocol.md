## Model Context Protocol (MCP)

MCP is an open standard (Anthropic, 2024) that defines how AI models connect to external tools and data sources. The problem it solves: every AI application was reinventing tool integration — custom APIs, bespoke auth, one-off function wrappers. MCP provides a universal protocol so tools built once work with any compliant model host.

## Architecture

```
Host (Claude Desktop, IDE, app)
  └── MCP Client
        ├── MCP Server A (filesystem tools)
        ├── MCP Server B (database tools)
        └── MCP Server C (web search tools)
```

An **MCP server** exposes three primitives:
- **Tools**: functions the model can invoke (e.g., `read_file`, `execute_query`) — the same [tool-use](/guides/tool-use) contract, just discovered over a protocol instead of hard-coded
- **Resources**: data the model can read (e.g., file contents, database rows)
- **Prompts**: reusable prompt templates with parameters

An **MCP client** (built into Claude Desktop, VS Code extensions, etc.) discovers and calls these servers over stdio or HTTP/SSE.

## Building an MCP Server

```python
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
import json, sqlite3

app = Server("database-server")

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="query_database",
            description="Run a read-only SQL query against the analytics database",
            inputSchema={
                "type": "object",
                "properties": {
                    "sql": {"type": "string", "description": "SQL SELECT statement"}
                },
                "required": ["sql"]
            }
        )
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "query_database":
        sql = arguments["sql"]
        if not sql.strip().upper().startswith("SELECT"):
            raise ValueError("Only SELECT statements allowed")

        conn = sqlite3.connect("analytics.db")
        cursor = conn.execute(sql)
        rows = cursor.fetchall()
        columns = [d[0] for d in cursor.description]
        result = {"columns": columns, "rows": rows[:100]}  # Limit rows
        return [TextContent(type="text", text=json.dumps(result, indent=2))]

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

Register this server in `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "database": {
      "command": "python",
      "args": ["/path/to/database_server.py"]
    }
  }
}
```

## Using MCP with the Python SDK

```python
import anthropic
from anthropic import Anthropic

# The Python SDK supports MCP tool integration
client = Anthropic()

# Tools discovered from MCP servers can be passed directly
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    tools=mcp_tools,      # Tool definitions from MCP server discovery
    messages=[{"role": "user", "content": "Show me total sales by region for Q3"}]
)
```

## The Ecosystem

By mid-2026, thousands of MCP servers are publicly available:
- **Official Anthropic servers**: filesystem, GitHub, Google Drive, Slack, Postgres, web fetch
- **Community servers**: Jira, Notion, Salesforce, AWS, Docker, Kubernetes, browser automation
- **Private enterprise servers**: internal APIs, data warehouses, proprietary tools

The value of MCP grows with adoption — a tool built once for Claude Desktop also works with any other MCP-compatible host (Cursor, Zed, custom apps).

## Design Principles for MCP Servers

- **Least privilege**: expose only what the model needs. Read-only by default; mutation tools require explicit justification.
- **Idempotent tools**: tool calls may be retried. Design accordingly.
- **Structured output**: return machine-readable data (JSON) rather than prose — the model formats it; your tool shouldn't.
- **Descriptive schemas**: the tool description and parameter descriptions are the model's interface. Write them for the model, not for humans.
