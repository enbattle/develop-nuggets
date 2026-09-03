A complete ReAct (Reason + Act) agent from scratch. To watch the loop run step by step, see the [agentic RAG walkthrough](/interactive/agentic); [Planning & Reasoning](/guides/planning-reasoning) covers the pattern variants.

## Installation

```bash
pip install anthropic
export ANTHROPIC_API_KEY="your-key"
```

## The ReAct Pattern

ReAct alternates between reasoning about what to do and taking an action:
```
Thought → Action → Observation → Thought → Action → ... → Answer
```

## Complete Implementation

```python
import anthropic
import json

client = anthropic.Anthropic()

# Define tools
def search_web(query: str) -> str:
    """Simulated web search — replace with real API."""
    results = {
        "France GDP 2024": "France's GDP in 2024 is approximately $3.1 trillion.",
        "Python creator": "Python was created by Guido van Rossum in 1991.",
    }
    return results.get(query, f"No results found for: {query}")

def calculate(expression: str) -> str:
    try:
        result = eval(expression, {"__builtins__": {}})
        return str(result)
    except Exception as e:
        return f"Error: {e}"

TOOLS = {
    "search_web": search_web,
    "calculate": calculate,
}

TOOL_DESCRIPTIONS = [
    {
        "name": "search_web",
        "description": "Search the web for current facts and information.",
        "input_schema": {
            "type": "object",
            "properties": {"query": {"type": "string", "description": "Search query"}},
            "required": ["query"]
        }
    },
    {
        "name": "calculate",
        "description": "Evaluate a mathematical expression.",
        "input_schema": {
            "type": "object",
            "properties": {"expression": {"type": "string", "description": "Math expression, e.g. '2 + 2'"}},
            "required": ["expression"]
        }
    },
]

def run_agent(goal: str, max_steps: int = 5) -> str:
    messages = [{"role": "user", "content": goal}]

    for step in range(max_steps):
        response = client.messages.create(
            model="claude-sonnet-5",
            max_tokens=1000,
            tools=TOOL_DESCRIPTIONS,
            messages=messages,
        )

        # Add assistant response to history
        messages.append({"role": "assistant", "content": response.content})

        # Check if done
        if response.stop_reason == "end_turn":
            for block in response.content:
                if hasattr(block, "text"):
                    return block.text
            return "No answer provided."

        # Execute tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                tool_fn = TOOLS.get(block.name)
                result = tool_fn(**block.input) if tool_fn else f"Unknown tool: {block.name}"
                print(f"  Tool: {block.name}({block.input}) → {result}")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                })

        messages.append({"role": "user", "content": tool_results})

    return "Max steps reached."

# Test it
answer = run_agent("What is 15% of France's GDP in 2024?")
print(f"Answer: {answer}")
```

## What the Agent Does

1. Receives goal: *"What is 15% of France's GDP in 2024?"*
2. **Thinks:** "I need France's GDP first"
3. **Acts:** Calls `search_web("France GDP 2024")`
4. **Observes:** "France's GDP is ~$3.1 trillion"
5. **Thinks:** "Now calculate 15% of 3.1 trillion"
6. **Acts:** Calls `calculate("0.15 * 3.1e12")`
7. **Observes:** "465000000000.0"
8. **Answers:** "15% of France's GDP in 2024 is approximately $465 billion."

## Key Design Decisions

| Decision | Why |
|----------|-----|
| Anthropic tool_use API | Structured tool calls — no prompt parsing needed |
| `max_steps=5` | Prevents infinite loops |
| Tool results as user messages | Claude's message format requires tool results this way |
| Descriptive tool descriptions | The LLM reads these to decide which tool to use |
