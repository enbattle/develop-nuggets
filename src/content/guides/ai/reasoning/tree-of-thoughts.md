## Tree of Thoughts & Search-Based Reasoning

[Chain-of-thought](/guides/chain-of-thought) generates a single linear reasoning path. But many problems benefit from exploring multiple approaches, evaluating them, and pursuing the most promising one. Tree of Thoughts (ToT) extends CoT by letting the model generate and evaluate a **tree** of reasoning paths.

## Beyond Linear Chains

In CoT, if the model makes an error early in its reasoning chain, it compounds all subsequent steps. A tree-based approach can detect when a branch is unpromising and backtrack:

```
Linear CoT:
  problem → step 1 → step 2 (error) → step 3 (wrong) → wrong answer

Tree of Thoughts:
  problem → approach A → [evaluate: promising] → step A2 → step A3 → answer
           ↘ approach B → [evaluate: dead end] → backtrack
           ↘ approach C → [evaluate: promising] → step C2 → answer (best)
```

## BFS vs. DFS Through Thought Trees

**BFS (Breadth-First Search)**: Expand all nodes at the current depth before going deeper. Good when you want to evaluate multiple complete solutions and pick the best.

**DFS (Depth-First Search)**: Follow a promising branch all the way down before backtracking. Good when partial solutions are meaningful and solutions are expensive to generate.

## Monte Carlo Tree Search for Language Models

MCTS applies a principled search algorithm to language generation:

1. **Selection**: Follow the highest-UCB (Upper Confidence Bound) nodes
2. **Expansion**: Generate new child thoughts at a selected node
3. **Simulation (Rollout)**: Complete a path to a terminal state (answer)
4. **Backpropagation**: Update node scores based on rollout outcome

This is computationally expensive but produces high-quality solutions on hard combinatorial problems.

## Practical Approximation

Full ToT with MCTS is expensive. A practical approximation: ask the model to generate N candidate approaches, evaluate each, then expand the best:

```python
import anthropic
import json

client = anthropic.Anthropic()

def tree_of_thoughts(problem: str, n_branches: int = 3) -> str:
    # Step 1: Generate candidate approaches
    brainstorm_response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        messages=[{
            "role": "user",
            "content": f"""Generate {n_branches} different approaches to solve this problem.
For each approach, briefly describe the strategy and rate its promise (1-10).

Problem: {problem}

Respond as JSON:
{{"approaches": [{{"id": 1, "strategy": "...", "promise": 8}}, ...]}}"""
        }]
    )

    approaches_text = brainstorm_response.content[0].text
    approaches_data = json.loads(approaches_text)

    # Step 2: Pick the most promising approach
    best = max(approaches_data["approaches"], key=lambda x: x["promise"])

    # Step 3: Expand and solve with the best approach
    solve_response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": f"""Solve this problem using the following approach:
Strategy: {best['strategy']}

Problem: {problem}

Work through it step by step."""
        }]
    )

    return solve_response.content[0].text

result = tree_of_thoughts(
    "Design a distributed rate limiter that works across 100 servers "
    "with <5ms latency overhead."
)
```

## When Search-Based Reasoning Is Worth the Cost

| Situation | Use ToT? |
|-----------|----------|
| Problem has multiple valid strategies | Yes |
| Early mistakes compound severely | Yes |
| Task requires planning across many steps | Yes |
| Simple single-step answer | No |
| Latency-sensitive | No |
| Creative generation | Usually no |

## Cost Reality Check

A ToT run with N=4 branches and depth 3 makes at minimum 12–20 LLM calls. At typical API rates, this can cost 10–50× more than a single CoT pass. Use ToT for high-value decisions where quality justifies the cost.

Where [extended thinking](/guides/extended-thinking) is available, Claude's internal reasoning already performs a form of implicit search — evaluating and discarding partial answers internally. That's usually more cost-effective than explicit ToT.
