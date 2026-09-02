An **agent harness** is the runtime infrastructure that wraps an LLM agent loop — handling tool dispatch, state persistence, error recovery, and lifecycle events so application code stays focused on *what* the agent should do rather than *how* to run it safely in production.

Think of it as the difference between writing a raw HTTP fetch and using a typed API client with retries, auth, and logging. The logic is the same; the harness makes it robust.

## The Raw Agent Loop

Without a harness, an agent loop looks like:

```python
while True:
    response = llm.complete(messages)
    if response.stop_reason == "end_turn":
        break
    tool_call = response.tool_calls[0]
    result = dispatch_tool(tool_call)
    messages.append(tool_call)
    messages.append(result)
```

This works in a demo. In production it has no timeout handling, no retry logic, no token budget enforcement, no audit trail, and no way to pause for human review.

## What a Harness Adds

| Concern | Raw Loop | Harness |
|---------|----------|---------|
| **Retries** | Manual | Automatic with backoff |
| **Timeouts** | None | Per-step + total budget |
| **State** | In-memory only | Checkpointed, resumable |
| **Tracing** | None | Span tree per run |
| **HitL** | Not possible | Interrupt + resume |
| **Parallelism** | Sequential | Fan-out subagents |
| **Error handling** | Crash | Fallback + rollback |

## Anatomy of a Harness

```
┌─────────────────────────────────────────┐
│               Harness Runtime            │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │  Planner │→ │ Executor │→ │ State │ │
│  └──────────┘  └──────────┘  └───────┘ │
│        ↑           ↓                    │
│  ┌──────────┐  ┌──────────┐            │
│  │  Memory  │  │  Tools   │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

**Planner** — decides next action given goal + memory
**Executor** — dispatches tool calls, handles concurrency
**State** — checkpoints progress; enables pause/resume
**Memory** — short-term (context window) + long-term (vector store)
**Tools** — validated, rate-limited, sandboxed function calls

## When You Need a Harness

- Task requires **more than 3–4 tool calls** in sequence
- Agent must **resume** after failure or human review
- Multiple agents need to **coordinate** on shared state
- You need an **audit log** for compliance or debugging
- Response latency matters and steps can run **in parallel**

Single-turn tool use or simple chatbots don't need a harness. The overhead isn't worth it until the agent loop becomes stateful or long-running. Once it does, the [framework landscape](/guides/framework-landscape) covers the main options for not building one from scratch.
