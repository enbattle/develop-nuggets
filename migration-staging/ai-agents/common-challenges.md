## Common Agent Challenges

Agents fail in characteristic ways. Know the patterns to build more reliable systems.

## 1. Infinite Loops

**Problem:** Agent keeps calling tools without making progress toward the goal.

**Causes:** Unclear stopping conditions, tool results not informative enough, reasoning stuck.

```python
def agent_with_loop_detection(goal: str, max_steps: int = 10) -> str:
    messages = [{"role": "user", "content": goal}]
    action_history = []

    for step in range(max_steps):
        response = run_step(messages)
        action = extract_action(response)

        # Detect repeated actions
        if action in action_history[-3:]:
            messages.append({
                "role": "user",
                "content": "You've taken this action recently without progress. Try a different approach or admit you can't complete the task."
            })

        action_history.append(action)

    return "Could not complete task within step limit."
```

## 2. Wrong Tool Selection

**Problem:** Agent calls the wrong tool or uses the right tool with wrong parameters.

**Causes:** Ambiguous tool descriptions, missing parameter validation, insufficient context.

```python
# Prevention: Validate tool inputs before execution
def validated_tool_call(tool_schema: dict, tool_input: dict) -> dict:
    required = tool_schema.get("input_schema", {}).get("required", [])
    missing = [p for p in required if p not in tool_input]
    if missing:
        raise ValueError(f"Missing required parameters: {missing}")
    return tool_input

# Prevention: Add examples to tool descriptions
{
    "name": "search_database",
    "description": "Query product database. Use for product lookups, NOT for customer data. Example: search_database(query='red shoes', limit=5)",
    ...
}
```

## 3. Hallucinated Tool Calls

**Problem:** Agent fabricates tool results or calls tools that don't exist.

```python
# Use structured tool calling APIs (Anthropic tool_use) instead of parsing LLM text
# Never rely on the LLM to generate tool results — always execute them for real

def validate_tool_call(tool_name: str, available_tools: list[str]) -> bool:
    if tool_name not in available_tools:
        return False   # Don't execute hallucinated tools
    return True
```

## 4. Reasoning Errors

**Problem:** Agent reasons incorrectly, leading to wrong decisions.

```python
# Add explicit reasoning verification for high-stakes decisions
VERIFY_PROMPT = """The agent reached this conclusion:
Decision: {decision}
Reasoning: {reasoning}

Verify: Is the reasoning logically valid? Are there any errors?
If correct, say "VALID". If not, explain the error."""

def verified_decision(decision: str, reasoning: str) -> bool:
    verdict = llm.generate(VERIFY_PROMPT.format(decision=decision, reasoning=reasoning))
    return "VALID" in verdict
```

## Defense-in-Depth Strategy

1. **Max steps** — always set; never allow unlimited loops
2. **Tool validation** — validate inputs before execution
3. **Logging** — log every action for debugging and audit
4. **Graceful degradation** — return partial results if agent can't fully complete

For cost controls and budget enforcement, see the MLOps & Infra node. For handling unsafe or irreversible actions, see the Safety & Guardrails node.
