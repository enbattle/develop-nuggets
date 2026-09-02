## Orchestration Patterns

Multi-agent systems compose the same way distributed services do — a small set of patterns covers most production architectures. The key insight is that **routing**, **parallelism**, and **aggregation** are separate concerns.

## Pattern 1: Orchestrator → Subagents

One coordinator decomposes a goal and delegates subtasks to specialized subagents in parallel.

```python
import asyncio
import anthropic

client = anthropic.Anthropic()

async def run_subagent(role: str, task: str) -> str:
    """Each subagent is an independent LLM call with a specialized prompt."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=f"You are a {role}. Be concise and precise.",
        messages=[{"role": "user", "content": task}]
    )
    return response.content[0].text

async def orchestrate(goal: str) -> str:
    # Step 1: Orchestrator decomposes the goal
    plan_response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system="Decompose the user's goal into 3 parallel research tasks. Return JSON.",
        messages=[{"role": "user", "content": goal}]
    )
    tasks = parse_tasks(plan_response.content[0].text)

    # Step 2: Subagents run in parallel
    results = await asyncio.gather(*[
        run_subagent(task["role"], task["description"])
        for task in tasks
    ])

    # Step 3: Orchestrator synthesizes
    synthesis = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system="Synthesize these research findings into a coherent report.",
        messages=[{"role": "user", "content": "\n\n".join(results)}]
    )
    return synthesis.content[0].text
```

**Use when**: Tasks are independent, latency matters, specialization helps

## Pattern 2: Pipeline (Sequential Chain)

Each agent's output becomes the next agent's input. Deterministic ordering, easy to debug.

```python
from dataclasses import dataclass

@dataclass
class PipelineContext:
    raw_input: str
    extracted_data: dict | None = None
    validated_data: dict | None = None
    enriched_data: dict | None = None
    final_output: str | None = None

def run_pipeline(user_input: str) -> str:
    ctx = PipelineContext(raw_input=user_input)

    # Each stage transforms the context
    ctx = extract_agent(ctx)      # Parse → structured data
    ctx = validate_agent(ctx)     # Check completeness
    ctx = enrich_agent(ctx)       # Lookup external context
    ctx = generate_agent(ctx)     # Produce final response

    return ctx.final_output
```

**Use when**: Stages have clear dependencies, you need a paper trail, data transforms are complex

## Pattern 3: Router

A classifier routes each query to the right specialist agent.

```python
AGENT_REGISTRY = {
    "code":    CodeAgent(),
    "data":    DataAnalysisAgent(),
    "search":  ResearchAgent(),
    "general": GeneralAgent(),
}

def route(query: str) -> str:
    # Fast classification call (small model, low latency)
    classification = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=20,
        system="Classify the query as: code, data, search, or general. Reply with one word.",
        messages=[{"role": "user", "content": query}]
    )
    agent_key = classification.content[0].text.strip().lower()
    agent = AGENT_REGISTRY.get(agent_key, AGENT_REGISTRY["general"])
    return agent.run(query)
```

**Use when**: Workloads are heterogeneous, specialists outperform generalists, cost optimization matters

## Pattern 4: Evaluator-Optimizer Loop

An evaluator agent scores output and the generator iterates until quality meets threshold.

```python
def generate_with_eval(task: str, max_iterations: int = 3) -> str:
    draft = generator_agent.run(task)

    for i in range(max_iterations):
        score, feedback = evaluator_agent.score(task, draft)
        if score >= 0.85:
            return draft
        draft = generator_agent.run(
            task,
            context=f"Previous draft scored {score:.0%}. Feedback: {feedback}\n\nImprove it."
        )

    return draft  # Return best effort after max iterations
```

**Use when**: Output quality is critical, human review is expensive, you can define clear eval criteria

## Choosing a Pattern

```
Is the task decomposable into independent subtasks?
  Yes → Orchestrator/Subagents (parallel)
  No  → Is there a fixed sequence of transformations?
          Yes → Pipeline
          No  → Does query type vary significantly?
                  Yes → Router
                  No  → Single agent with tools
```
