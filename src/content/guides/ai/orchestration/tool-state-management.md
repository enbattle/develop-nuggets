Tools and state are the two axes where agent systems break in production. Tool calls are I/O operations with real-world side effects; state is the memory that lets an agent survive failures and resume.

## Defining Tools Safely

Tools should be typed, validated at the boundary, and return structured errors — not exceptions.

```python
from pydantic import BaseModel, Field
from typing import Literal

class SearchInput(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    max_results: int = Field(default=5, ge=1, le=20)

class ToolResult(BaseModel):
    status: Literal["ok", "error"]
    data: str | None = None
    error: str | None = None

def search_tool(raw_input: dict) -> ToolResult:
    try:
        params = SearchInput(**raw_input)       # Validate
        results = web_search(params.query, params.max_results)
        return ToolResult(status="ok", data=format_results(results))
    except Exception as e:
        return ToolResult(status="error", error=str(e))
```

The LLM sees structured errors and can decide whether to retry with different params, skip the step, or ask for help — rather than crashing.

## Rate Limiting & Quotas

Wrap every external tool call with a rate limiter to prevent runaway agents from exhausting API quotas:

```python
import time
from collections import deque

class RateLimiter:
    def __init__(self, calls_per_minute: int):
        self.limit = calls_per_minute
        self.calls = deque()

    def acquire(self):
        now = time.time()
        # Drop calls older than 60s
        while self.calls and self.calls[0] < now - 60:
            self.calls.popleft()
        if len(self.calls) >= self.limit:
            sleep_for = 60 - (now - self.calls[0])
            time.sleep(max(0, sleep_for))
        self.calls.append(time.time())

search_limiter = RateLimiter(calls_per_minute=10)

def rate_limited_search(query: str) -> str:
    search_limiter.acquire()
    return search_tool({"query": query})
```

## State Checkpointing

Agent state should be persisted after every step so a crash or timeout doesn't mean starting over.

```python
import json
from pathlib import Path
from dataclasses import dataclass, asdict

@dataclass
class AgentState:
    run_id: str
    goal: str
    messages: list
    tool_results: list
    iteration: int
    status: str  # "running" | "paused" | "done" | "failed"

class StateStore:
    def __init__(self, path: str = "/tmp/agent_state"):
        self.path = Path(path)
        self.path.mkdir(exist_ok=True)

    def save(self, state: AgentState):
        file = self.path / f"{state.run_id}.json"
        file.write_text(json.dumps(asdict(state), indent=2))

    def load(self, run_id: str) -> AgentState | None:
        file = self.path / f"{run_id}.json"
        if not file.exists():
            return None
        return AgentState(**json.loads(file.read_text()))

store = StateStore()

def run_agent_step(state: AgentState) -> AgentState:
    response = call_llm(state.messages)
    state.messages.append(response)
    state.iteration += 1

    if response.tool_calls:
        for tc in response.tool_calls:
            result = dispatch_tool(tc)
            state.tool_results.append(result)
            state.messages.append(result)

    store.save(state)   # Checkpoint after every step
    return state
```

## Token Budget Management

Long-running agents exhaust the context window. Manage it explicitly:

```python
CONTEXT_LIMIT = 180_000   # claude-sonnet-5 context
RESERVE_TOKENS = 8_000    # Leave room for the response
MAX_CONTEXT    = CONTEXT_LIMIT - RESERVE_TOKENS

def trim_messages(messages: list, tokenizer) -> list:
    """Keep system prompt + most recent messages within budget."""
    system = [m for m in messages if m["role"] == "system"]
    rest   = [m for m in messages if m["role"] != "system"]

    total = sum(tokenizer.count(m["content"]) for m in system)
    kept  = []

    for msg in reversed(rest):
        tokens = tokenizer.count(msg["content"])
        if total + tokens > MAX_CONTEXT:
            break
        kept.insert(0, msg)
        total += tokens

    return system + kept
```

## Side-Effect Isolation

Destructive tool calls (file writes, emails, database mutations) should be gated behind a confirmation step in development and logged unconditionally in production:

```python
DESTRUCTIVE_TOOLS = {"send_email", "delete_file", "write_db", "deploy"}

def dispatch_tool(tool_call, dry_run: bool = False) -> ToolResult:
    name = tool_call.name
    if name in DESTRUCTIVE_TOOLS:
        audit_log(name, tool_call.input)     # Always log
        if dry_run:
            return ToolResult(status="ok", data=f"[DRY RUN] Would call {name}")
    return TOOL_REGISTRY[name](tool_call.input)
```
