## Evaluating Agentic AI Systems

Agents are harder to evaluate than static models because success depends on multi-step behavior.

## Key Dimensions to Evaluate

### 1. Goal Completion Rate
Did the agent achieve the stated objective?

```python
def evaluate_goal_completion(task: str, agent_result: str, judge_model: str = "claude-sonnet-4-6") -> float:
    prompt = f"""Did the agent successfully complete this task?

Task: {task}
Agent's result: {agent_result}

Score 0–1: 0 = complete failure, 0.5 = partial, 1 = fully achieved.
Return only a number."""

    response = client.messages.create(
        model=judge_model,
        max_tokens=10,
        messages=[{"role": "user", "content": prompt}]
    )
    return float(response.content[0].text.strip())
```

### 2. Tool Correctness
Did the agent call the right tools in the right order?

```python
def evaluate_tool_sequence(expected_tools: list[str], actual_tools: list[str]) -> dict:
    """Compare expected vs actual tool usage."""
    # Exact match
    exact = expected_tools == actual_tools

    # Overlap — did it use the right tools regardless of order?
    expected_set = set(expected_tools)
    actual_set = set(actual_tools)
    precision = len(expected_set & actual_set) / len(actual_set) if actual_set else 0
    recall = len(expected_set & actual_set) / len(expected_set) if expected_set else 0

    return {"exact_match": exact, "precision": precision, "recall": recall}
```

### 3. Step Efficiency
How many steps did it take? Fewer is better.

```python
def efficiency_score(steps_taken: int, min_steps: int) -> float:
    """Score decreases as steps exceed the minimum needed."""
    if steps_taken <= min_steps:
        return 1.0
    penalty = (steps_taken - min_steps) * 0.1
    return max(0.0, 1.0 - penalty)
```

### 4. Reasoning Quality
Is the agent's chain of thought logical and coherent?

```python
def evaluate_reasoning(task: str, thoughts: list[str]) -> float:
    reasoning_log = "\n".join([f"Step {i+1}: {t}" for i, t in enumerate(thoughts)])
    prompt = f"""Evaluate the quality of this agent's reasoning:

Task: {task}
Reasoning steps:
{reasoning_log}

Score 0–1 for: logical coherence, relevance to task, no circular reasoning.
Return only a number."""
    # Parse and return float
```

### 5. Multi-Turn Coherence
Does the agent maintain consistent context across steps?

```python
def evaluate_coherence(task: str, conversation: list[dict]) -> float:
    prompt = f"""Does this agent conversation maintain coherent context throughout?

Task: {task}
Conversation: {json.dumps(conversation, indent=2)}

Score 0–1: 1 = fully coherent, 0 = contradictory or context-losing.
Return only a number."""
```

## Building an Agent Eval Dataset

```python
agent_eval_set = [
    {
        "task": "Find the current price of AAPL stock and calculate 10% of it.",
        "expected_tools": ["search_web", "calculate"],
        "min_steps": 2,
        "success_criteria": "contains a dollar amount"
    },
    {
        "task": "Summarize the top 3 news headlines about AI today.",
        "expected_tools": ["search_web"],
        "min_steps": 1,
        "success_criteria": "contains 3 headlines"
    },
    {
        "task": "What is the answer to this question that has no answer?",
        "expected_behavior": "admits_ignorance",
        "max_steps": 3,
    },
]
```

Wiring these scorers into a full pipeline — dataset management, scoring runners, regression detection, CI integration — is the same work as any other LLM eval harness; the agent-specific part is the dimensions above.

## Target Thresholds

| Metric | Good | Warning |
|--------|------|---------|
| Goal completion | >80% | <60% |
| Tool precision | >75% | <50% |
| Step efficiency | >0.7 | <0.5 |
| Reasoning quality | >7/10 | <5/10 |
