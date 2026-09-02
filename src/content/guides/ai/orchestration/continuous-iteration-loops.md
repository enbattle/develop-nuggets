Traditional agentic workflows run one pass and stop — the LLM calls tools, produces output, and exits. The **Ralph Pattern** (named after the endlessly persistent Ralph Wiggum from The Simpsons) flips this: the agent loops continuously, restarting with a fresh context each cycle, until the task is genuinely complete.

The bet is that **iteration beats perfection on the first try**: rather than engineering one flawless prompt, you let the agent try, observe what broke, and try again — with the file system or a task list as persistent memory between cycles.

## The Core Loop

```
┌─────────────────────────────────────────┐
│              Ralph Loop                  │
│                                         │
│  ┌─────────┐    read    ┌──────────┐   │
│  │  PRD /  │ ─────────▶ │  Agent   │   │
│  │ task    │            │  (LLM)   │   │
│  │  file   │ ◀───────── │          │   │
│  └─────────┘   update   └────┬─────┘   │
│       ▲                      │         │
│       │        write         ▼         │
│       │               ┌──────────┐     │
│       └─────────────── │  Files / │    │
│         read changes   │ Codebase │    │
│                        └──────────┘    │
│  Repeats until all PRD items = ✓       │
└─────────────────────────────────────────┘
```

The file system replaces the conversation history as memory. Each new cycle starts from a clean context window — so the agent never gets confused by a 50-turn conversation that's drifted off track.

## Minimal Implementation (Community Ralph)

```python
import subprocess
import time
from pathlib import Path

PRD_FILE   = Path("tasks.md")
MAX_CYCLES = 50

def all_done(prd: str) -> bool:
    """Returns True when every task line is checked off."""
    lines = [l for l in prd.splitlines() if l.strip().startswith("- [")]
    return all(l.strip().startswith("- [x]") for l in lines)

def run_ralph(tool: str = "claude"):
    for cycle in range(MAX_CYCLES):
        prd = PRD_FILE.read_text()
        if all_done(prd):
            print(f"Done in {cycle} cycles.")
            return

        print(f"Cycle {cycle + 1} — tasks remaining…")

        # Each cycle: pass the PRD as the entire prompt, fresh context
        subprocess.run([
            tool, "--print",
            f"You are an autonomous coding agent.\n\n"
            f"Task list:\n{prd}\n\n"
            f"Complete the next unchecked task. "
            f"Mark it [x] in tasks.md when done. "
            f"Do not stop until you mark a task complete."
        ])

        time.sleep(2)   # Brief pause so writes flush to disk

    print(f"Stopped after {MAX_CYCLES} cycles — review tasks.md.")

run_ralph()
```

## The Key Differences from a Standard Agent Loop

| | Standard Agentic Loop | Ralph Pattern |
|---|---|---|
| **Memory** | Conversation history (in-context) | File system (persistent) |
| **Context per cycle** | Grows with each turn | Resets each cycle |
| **Stopping condition** | LLM decides stop_reason | External check on task file |
| **Failure recovery** | Continues same context | Next cycle sees failure on disk |
| **Overnight use** | Risky — context drifts | Designed for it |

## Productized Ralph

The raw community loop has no guardrails. The **productized version** adds the structure needed for reliable production use:

```python
from dataclasses import dataclass
from enum import Enum
import anthropic

class CycleStatus(str, Enum):
    COMPLETED  = "completed"
    PARTIAL    = "partial"
    FAILED     = "failed"

@dataclass
class CycleResult:
    cycle: int
    status: CycleStatus
    tasks_completed: int
    tasks_remaining: int
    tokens_used: int
    cost_usd: float

MAX_TOKENS_PER_CYCLE = 8_000
MAX_TOTAL_COST_USD   = 5.00
TOKEN_COST_PER_1K    = 0.003

class ProductizedRalph:
    def __init__(self, prd_path: str, max_cycles: int = 30):
        self.prd_path   = Path(prd_path)
        self.max_cycles = max_cycles
        self.total_cost = 0.0
        self.client     = anthropic.Anthropic()
        self.history: list[CycleResult] = []

    def _count_tasks(self) -> tuple[int, int]:
        lines = [l for l in self.prd_path.read_text().splitlines()
                 if l.strip().startswith("- [")]
        done = sum(1 for l in lines if l.strip().startswith("- [x]"))
        return done, len(lines) - done

    def _run_cycle(self, cycle: int) -> CycleResult:
        prd = self.prd_path.read_text()
        done_before, remaining_before = self._count_tasks()

        response = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=MAX_TOKENS_PER_CYCLE,
            system=(
                "You are an autonomous coding agent working through a task list. "
                "Complete exactly one unchecked task per response. "
                "After completing it, mark it [x] in the task file and stop. "
                "Be precise. Do not hallucinate tool calls."
            ),
            messages=[{"role": "user", "content": prd}],
        )

        tokens = response.usage.input_tokens + response.usage.output_tokens
        cost   = tokens / 1000 * TOKEN_COST_PER_1K
        self.total_cost += cost

        done_after, remaining_after = self._count_tasks()
        progress = done_after - done_before

        return CycleResult(
            cycle=cycle,
            status=CycleStatus.COMPLETED if progress > 0 else CycleStatus.FAILED,
            tasks_completed=done_after,
            tasks_remaining=remaining_after,
            tokens_used=tokens,
            cost_usd=cost,
        )

    def run(self) -> list[CycleResult]:
        for cycle in range(1, self.max_cycles + 1):
            _, remaining = self._count_tasks()
            if remaining == 0:
                break
            if self.total_cost >= MAX_TOTAL_COST_USD:
                raise RuntimeError(
                    f"Budget exceeded: ${self.total_cost:.2f} >= ${MAX_TOTAL_COST_USD:.2f}"
                )

            result = self._run_cycle(cycle)
            self.history.append(result)

            if result.status == CycleStatus.FAILED:
                # Two consecutive failures → halt and surface for human review
                if len(self.history) >= 2 and self.history[-2].status == CycleStatus.FAILED:
                    raise RuntimeError(f"Stuck at cycle {cycle} — human review needed")

        return self.history
```

## When to Use the Ralph Pattern

**Good fit:**
- Large, well-specified coding tasks (the PRD must be clear — vague tasks produce wandering loops)
- Overnight runs where human monitoring isn't practical
- Tasks that are naturally sequential and checkable (implement feature A, then B, then C)

**Poor fit:**
- Tasks requiring continuous human input or design decisions
- Exploratory work without a clear definition of done
- Anything where a wrong early decision cascades (architecture changes, DB migrations)

The Ralph Pattern is a force-multiplier for execution, not for discovery. Define the work precisely first; then let Ralph finish it.
