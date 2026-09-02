## Planning and Reasoning Patterns

How agents think through problems and sequence their actions.

## The ReAct Pattern

The most widely used agent reasoning pattern. Alternates between reasoning (Thought) and action.

```
Query: "What's the GDP of France in 2024?"

Thought: I need current GDP data. This isn't in my training, so I should search.
Action: search_web("France GDP 2024")
Observation: "France's GDP in 2024 is ~$3.05 trillion (IMF estimate)"

Thought: I now have the data I need to answer.
Answer: France's GDP in 2024 is approximately $3.05 trillion.
```

See the **Building Your First Agent** lesson for the full implementation — the loop pattern is identical.

## Plan-and-Execute

For long, complex tasks, plan all steps upfront before executing any:

```python
PLAN_PROMPT = """Break down this task into specific, ordered steps.
Each step should be completable with one tool call.

Task: {task}

Return a JSON array of steps:
[{{"step": 1, "description": "...", "tool": "tool_name", "rationale": "..."}}]"""

EXECUTE_PROMPT = """Execute step {step_num} of the plan.
Plan: {plan}
Completed so far: {completed}
Current step: {current_step}

Call the appropriate tool."""

def plan_and_execute(task: str) -> str:
    plan = create_plan(task)   # LLM generates all steps
    results = []

    for step in plan:
        result = execute_step(step, results)
        results.append({"step": step, "result": result})

    return synthesize_final_answer(task, results)
```

## Self-Reflection

The agent evaluates its own output and iterates if needed:

```python
REFLECT_PROMPT = """Review your answer:

Question: {question}
Answer: {answer}

Ask yourself:
- Does this fully answer the question?
- Are all claims supported by evidence?
- Are there any errors?

If satisfied, say "COMPLETE". If not, explain what to improve."""

def agent_with_reflection(query: str) -> str:
    answer = run_agent(query)

    reflection = llm.generate(REFLECT_PROMPT.format(question=query, answer=answer))
    if "COMPLETE" not in reflection:
        # Iterate with the reflection as context
        improved = run_agent(f"{query}\n\nPrevious answer had issues: {reflection}. Improve it.")
        return improved
    return answer
```

For the full multi-iteration Reflexion pattern (with memory and loop control), see the **Reasoning Engine** node.

## Choosing a Pattern

| Pattern | When to Use |
|---------|-------------|
| **ReAct** | Most tasks — balances flexibility and structure |
| **Plan-and-Execute** | Long tasks with many steps known upfront |
| **Self-Reflection** | High-stakes tasks requiring accuracy verification |

For model-level reasoning techniques — Chain-of-Thought, extended thinking, and process reward models — see the **Reasoning Engine** node.
