## Agent Architecture

The parts every reliable agent has in common, and how they fit together. The [agentic RAG walkthrough](/interactive/agentic) shows these pieces running on one task.

## High-Level Architecture

```
┌─────────────────────────────────────────┐
│         Orchestrator / Control Loop     │
├──────────────────────────────────────────┤
│   Reasoning Engine    │   Planning       │
│      (LLM)            │   (Decompose)    │
├──────────────────────────────────────────┤
│             Memory System               │
│  Working   │  Episodic  │  Semantic      │
├──────────────────────────────────────────┤
│              Tool Registry              │
│  [search, calc, read_file, APIs, ...]   │
└──────────────────────────────────────────┘
```

## 1. Reasoning Engine

The LLM at the center of the agent. Responsible for:
- Understanding the user's goal
- Analyzing current state and available information
- Deciding the next action (which tool, what parameters)
- Generating the final response

```python
def reason(query: str, context: str, available_tools: list) -> dict:
    prompt = f"""You are an AI agent. Given the goal and context, decide the next action.

Goal: {query}
Context: {context}
Available tools: {[t['name'] for t in available_tools]}

Respond with:
{{"thought": "reasoning about what to do", "action": "tool_name", "params": {{...}}}}
Or if done:
{{"thought": "reasoning", "action": "finish", "answer": "final answer"}}"""

    response = llm.messages.create(model="claude-sonnet-4-6", ...)
    return json.loads(response.content[0].text)
```

## 2. Tool Registry

Tools are functions the agent can call ([Tool Use & Function Calling](/guides/tool-use) goes deeper on designing them). Each tool needs:
- **Name** — how the agent references it
- **Description** — what it does (the LLM reads this)
- **Parameters** — what it accepts
- **Implementation** — the actual code

```python
TOOLS = [
    {
        "name": "search_web",
        "description": "Search the web for current information. Use for recent events or facts.",
        "parameters": {"query": {"type": "string", "description": "Search query"}},
        "fn": lambda params: web_search(params["query"])
    },
    {
        "name": "calculate",
        "description": "Perform mathematical calculations.",
        "parameters": {"expression": {"type": "string", "description": "Math expression"}},
        "fn": lambda params: eval(params["expression"])   # safe eval in practice
    },
    {
        "name": "read_file",
        "description": "Read contents of a file.",
        "parameters": {"path": {"type": "string"}},
        "fn": lambda params: open(params["path"]).read()
    },
]
```

## 3. Memory System

The three tiers below are the working set; [Memory Systems](/guides/memory-systems) covers persistence and retrieval in full.

| Memory Type | What It Stores | Duration |
|-------------|----------------|----------|
| **Working memory** | Current task state, recent observations | Current session |
| **Episodic memory** | Past tasks and outcomes | Across sessions |
| **Semantic memory** | Domain facts, learned knowledge | Long-term |

```python
class AgentMemory:
    def __init__(self):
        self.working = []         # Current session
        self.history = []         # All steps taken

    def add(self, step: dict):
        self.working.append(step)
        self.history.append(step)

    def get_context(self, max_steps: int = 10) -> str:
        recent = self.working[-max_steps:]
        return "\n".join([f"{s['type']}: {s['content']}" for s in recent])
```

## 4. Orchestrator

Manages the control loop:

```python
def agent_loop(goal: str, tools: list, max_steps: int = 10) -> str:
    memory = AgentMemory()
    memory.add({"type": "goal", "content": goal})

    for step in range(max_steps):
        context = memory.get_context()
        decision = reason(goal, context, tools)

        if decision["action"] == "finish":
            return decision["answer"]

        # Execute tool
        tool = next(t for t in tools if t["name"] == decision["action"])
        result = tool["fn"](decision["params"])

        memory.add({"type": "thought", "content": decision["thought"]})
        memory.add({"type": "action", "content": f"{decision['action']}({decision['params']})"})
        memory.add({"type": "observation", "content": str(result)})

    return "Max steps reached without completing goal."
```

## Design Principles

- **Single responsibility per tool** — tools should do one thing well
- **Idempotent where possible** — re-running a tool shouldn't cause side effects
- **Always validate** — never let an agent run untrusted code or make irreversible actions without confirmation
- **Limit step count** — always set a maximum to prevent infinite loops
