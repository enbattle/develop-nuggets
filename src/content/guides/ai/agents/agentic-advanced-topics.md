Patterns that show up once a single agent loop isn't enough: multiple agents, recursive planning, parallel execution, explicit state machines, and the instrumentation to debug all of it. The [agentic RAG walkthrough](/interactive/agentic) is a compact reference for the single-agent loop these build on.

## 1. Multi-Agent Systems

Multiple specialized agents collaborating on complex tasks.

```
Orchestrator Agent
    ├── Research Agent (search, retrieve)
    ├── Analysis Agent (process, compute)
    ├── Writing Agent (synthesize, format)
    └── Review Agent (check, validate)
```

```python
class OrchestratorAgent:
    def __init__(self):
        self.agents = {
            "research": ResearchAgent(),
            "analysis": AnalysisAgent(),
            "writing": WritingAgent(),
        }

    def run(self, task: str) -> str:
        # Plan which agents to use
        plan = self.plan(task)

        results = {}
        for step in plan:
            agent = self.agents[step["agent"]]
            context = {k: results[k] for k in step.get("depends_on", [])}
            results[step["name"]] = agent.run(step["task"], context=context)

        return self.synthesize(task, results)

    def plan(self, task: str) -> list[dict]:
        """LLM decides which agents to use and in what order."""
        prompt = f"""Break this task into subtasks for specialized agents.
Available agents: research, analysis, writing

Task: {task}

Return JSON: [{{"name": "step1", "agent": "research", "task": "...", "depends_on": []}}]"""
        return json.loads(llm.generate(prompt))
```

## 2. Hierarchical Planning

Break complex tasks into subtasks with recursive decomposition:

```python
def hierarchical_plan(goal: str, depth: int = 0, max_depth: int = 3) -> dict:
    if depth >= max_depth:
        return {"goal": goal, "type": "atomic", "action": "execute_directly"}

    prompt = f"""Is this goal achievable in one step, or must it be broken down?

Goal: {goal}

If one step: {{"type": "atomic", "action": "..."}}
If decomposable: {{"type": "composite", "subtasks": ["subtask1", "subtask2", ...]}}"""

    plan = json.loads(llm.generate(prompt))

    if plan["type"] == "composite":
        plan["subtasks"] = [
            hierarchical_plan(subtask, depth + 1, max_depth)
            for subtask in plan["subtasks"]
        ]

    return plan
```

## 3. Parallel Tool Execution

Execute independent tool calls concurrently for speed:

```python
import asyncio

async def parallel_tools(tool_calls: list[dict]) -> list[str]:
    """Execute independent tools in parallel."""
    async def execute_one(call: dict) -> str:
        tool_fn = ASYNC_TOOLS[call["name"]]
        return await tool_fn(**call["input"])

    return await asyncio.gather(*[execute_one(call) for call in tool_calls])

# Usage in agent loop
independent_calls = [
    {"name": "search_web", "input": {"query": "France GDP"}},
    {"name": "search_web", "input": {"query": "Germany GDP"}},
    {"name": "get_exchange_rate", "input": {"from": "EUR", "to": "USD"}},
]
results = asyncio.run(parallel_tools(independent_calls))
# All 3 execute simultaneously instead of sequentially
```

## 4. Agent State Machines

For complex agents, model the workflow as an explicit state machine:

```python
from enum import Enum

class AgentState(Enum):
    UNDERSTANDING = "understanding"
    PLANNING = "planning"
    EXECUTING = "executing"
    REVIEWING = "reviewing"
    RESPONDING = "responding"
    ERROR = "error"

class StateMachineAgent:
    def __init__(self):
        self.state = AgentState.UNDERSTANDING

    def transition(self, event: str) -> AgentState:
        transitions = {
            (AgentState.UNDERSTANDING, "goal_clear"): AgentState.PLANNING,
            (AgentState.UNDERSTANDING, "need_clarification"): AgentState.RESPONDING,
            (AgentState.PLANNING, "plan_ready"): AgentState.EXECUTING,
            (AgentState.EXECUTING, "tools_done"): AgentState.REVIEWING,
            (AgentState.EXECUTING, "tool_error"): AgentState.ERROR,
            (AgentState.REVIEWING, "satisfied"): AgentState.RESPONDING,
            (AgentState.REVIEWING, "needs_more"): AgentState.EXECUTING,
            (AgentState.ERROR, "recovered"): AgentState.PLANNING,
        }
        return transitions.get((self.state, event), self.state)

    def run(self, task: str) -> str:
        context = {"task": task, "plan": None, "results": []}

        while self.state != AgentState.RESPONDING:
            event = self.execute_state(context)
            self.state = self.transition(event)

        return self.generate_response(context)
```

## 5. Human-in-the-Loop

Add human checkpoints for high-stakes or uncertain decisions:

```python
CONFIDENCE_THRESHOLD = 0.8

def agent_with_human_review(task: str) -> str:
    plan = create_plan(task)

    for step in plan:
        confidence = assess_confidence(step)

        if confidence < CONFIDENCE_THRESHOLD:
            # Pause and ask human
            print(f"\n⚠️  Low confidence ({confidence:.0%}) on: {step['description']}")
            print(f"Proposed action: {step['action']}({step['params']})")
            approval = input("Approve? (y/n/modify): ")

            if approval == 'n':
                continue
            elif approval == 'modify':
                step = get_human_modification(step)

        result = execute_step(step)

    return synthesize_results()
```

## 6. Agent Observability

Instrument your agents for debugging and improvement:

```python
import logging, time
from dataclasses import dataclass

@dataclass
class AgentTrace:
    task: str
    steps: list[dict]
    total_time: float
    tool_calls: int
    tokens_used: int
    outcome: str

class ObservableAgent:
    def run(self, task: str) -> tuple[str, AgentTrace]:
        start = time.time()
        steps, tool_calls, tokens = [], 0, 0

        # ... agent execution with logging ...
        for step in agent_steps:
            steps.append({
                "type": step.type,
                "content": step.content,
                "duration_ms": step.duration,
                "timestamp": datetime.now().isoformat()
            })
            if step.type == "tool_call":
                tool_calls += 1
            tokens += step.tokens

        trace = AgentTrace(
            task=task, steps=steps,
            total_time=time.time() - start,
            tool_calls=tool_calls,
            tokens_used=tokens,
            outcome="success"
        )
        return result, trace
```
