Tools are what turn a chatbot into an agent, and their design tends to make or break how well the agent works.

## Defining Tools with Anthropic

```python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location. Use when asked about weather conditions.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name or 'City, Country' format"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit",
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "search_database",
        "description": "Query the product database. Use to look up product info, inventory, pricing.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "limit": {"type": "integer", "default": 10}
            },
            "required": ["query"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=1000,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}]
)

# Response will contain tool_use blocks when Claude wants to call a tool
for block in response.content:
    if block.type == "tool_use":
        print(f"Tool: {block.name}")
        print(f"Inputs: {block.input}")
```

## Executing Tool Calls

```python
def execute_tool(tool_name: str, tool_input: dict) -> str:
    """Route tool call to the right function."""
    tool_registry = {
        "get_weather": lambda i: fetch_weather(i["location"], i.get("unit", "celsius")),
        "search_database": lambda i: db.query(i["query"], limit=i.get("limit", 10)),
    }

    if tool_name not in tool_registry:
        return f"Error: unknown tool '{tool_name}'"

    try:
        return str(tool_registry[tool_name](tool_input))
    except Exception as e:
        return f"Tool error: {e}"

# Feed results back to Claude
def handle_tool_response(response, messages):
    tool_results = []
    for block in response.content:
        if block.type == "tool_use":
            result = execute_tool(block.name, block.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": result,
            })

    messages.append({"role": "assistant", "content": response.content})
    messages.append({"role": "user", "content": tool_results})
    return messages
```

## Tool Design Principles

### 1. Single Responsibility
Each tool does one thing:
```python
# Bad: one tool does too much
"search_and_summarize_and_send_email"

# Good: separate tools
"search_web", "summarize_text", "send_email"
```

### 2. Descriptive Names and Descriptions
The LLM decides which tool to call based on your descriptions:
```python
# Bad description
"description": "Does database stuff"

# Good description
"description": "Search the product catalog by name, SKU, or category. Returns price, stock, and specifications."
```

### 3. Safe by Default
Never give agents access to irreversible actions without safeguards:
```python
def delete_record(record_id: str, confirmed: bool = False) -> str:
    if not confirmed:
        return "Deletion requires confirmed=True. Are you sure?"
    # Proceed with deletion
```

## Tool Categories

| Category | Examples |
|----------|---------|
| **Information retrieval** | search_web, read_file, query_database |
| **Computation** | calculate, run_code, parse_date |
| **External APIs** | get_weather, fetch_stock_price, check_inventory |
| **State-changing** | send_email, create_ticket, update_record |
| **Coordination** | delegate_to_agent, schedule_task |

State-changing tools should always log their actions and ideally require confirmation.

## Handling Tool Errors

```python
def safe_tool_call(tool_fn, tool_input: dict, max_retries: int = 2) -> str:
    for attempt in range(max_retries + 1):
        try:
            result = tool_fn(tool_input)
            return result
        except Exception as e:
            if attempt == max_retries:
                return f"Tool failed after {max_retries} retries: {e}"
            time.sleep(1)
```
