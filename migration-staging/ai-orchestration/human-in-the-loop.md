## Human-in-the-Loop

Human-in-the-loop (HitL) is the ability to **pause** an agent run mid-execution, surface a decision to a human, and **resume** from exactly where it left off once the human responds. Without it, agents that encounter ambiguous or high-stakes decisions either guess wrong or crash.

## When to Interrupt

Not every decision warrants a pause. Interrupt when:

- **Irreversibility** — the next action cannot be undone (send email, deploy, delete)
- **Ambiguity** — the agent's confidence is low and the cost of a wrong guess is high
- **Budget threshold** — the task has consumed more tokens/time than expected
- **Novel state** — the agent encounters a scenario outside its training distribution
- **Explicit policy** — certain action types always require sign-off (compliance, finance)

## Implementing Pause/Resume

The key is that state must be checkpointed *before* the interrupt so the human's context is complete and the agent can resume cleanly.

```python
from enum import Enum

class RunStatus(str, Enum):
    RUNNING   = "running"
    AWAITING  = "awaiting_human"
    RESUMED   = "resumed"
    DONE      = "done"
    FAILED    = "failed"

@dataclass
class HitLRequest:
    run_id: str
    question: str
    options: list[str] | None    # None = free text
    context_summary: str          # What has happened so far
    proposed_action: str          # What the agent wants to do next

def request_human_approval(state: AgentState, proposed: str) -> AgentState:
    """Pause the agent and store the interrupt request."""
    state.status = RunStatus.AWAITING
    state.hitl_request = HitLRequest(
        run_id=state.run_id,
        question="The agent wants to take the following action. Approve?",
        options=["Approve", "Reject", "Modify"],
        context_summary=summarize(state.messages),
        proposed_action=proposed,
    )
    store.save(state)
    notify_human(state.hitl_request)   # Slack, email, webhook, UI
    return state                        # Execution stops here

def resume_with_decision(run_id: str, decision: str) -> AgentState:
    """Human has responded — load state and continue."""
    state = store.load(run_id)
    state.status = RunStatus.RESUMED
    state.messages.append({
        "role": "user",
        "content": f"Human decision on proposed action: {decision}"
    })
    store.save(state)
    return run_agent_loop(state)        # Resume from checkpoint
```

## LangGraph Native HitL

LangGraph has first-class support through `interrupt_before`:

```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.sqlite import SqliteSaver

graph = StateGraph(AgentState)
graph.add_node("plan",    planning_node)
graph.add_node("execute", execution_node)
graph.add_node("review",  human_review_node)

graph.set_entry_point("plan")
graph.add_edge("plan", "review")
graph.add_conditional_edges("review", route_after_review)
graph.add_edge("execute", END)

# Compile with persistence + interrupt before the execute node
memory = SqliteSaver.from_conn_string(":memory:")
app = graph.compile(
    checkpointer=memory,
    interrupt_before=["execute"],    # Pause here, wait for human input
)

# Run until interrupt
config = {"configurable": {"thread_id": "run-42"}}
state = app.invoke({"goal": "Send Q3 report to all customers"}, config)

# Human reviews state["review_output"], then resumes:
app.invoke(None, config)   # None input = resume
```

## Approval UX Patterns

| Pattern | Latency | Best for |
|---------|---------|---------|
| **Synchronous block** | Seconds–minutes | Interactive apps, CLI tools |
| **Async webhook** | Minutes–hours | Background jobs, batch processing |
| **Approval queue** | Hours–days | Compliance workflows, finance |
| **Soft deadline** | Configurable | Auto-approve on timeout or escalate |

```python
def await_decision(hitl_request: HitLRequest, timeout_seconds: int = 3600) -> str:
    """Poll for human decision with timeout."""
    deadline = time.time() + timeout_seconds
    while time.time() < deadline:
        decision = decision_store.get(hitl_request.run_id)
        if decision:
            return decision
        time.sleep(10)
    # Timeout policy: reject and surface error
    return "rejected:timeout"
```

## Minimizing Interruptions

Too many interruptions negate the value of automation. Reduce them by:

1. **Risk-scoring** actions before deciding to interrupt — not every write needs approval
2. **Batching** — collect several decisions and show them in one review session
3. **Learning** — log human decisions and fine-tune to reduce future interrupts on similar patterns
4. **Simulation** — run in dry-run mode first and only flag genuinely novel decisions
