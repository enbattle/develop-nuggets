Chain-of-Thought (CoT) prompting is the observation that asking a language model to explain its reasoning before giving an answer improves accuracy on multi-step problems, often by a wide margin. It remains one of the highest-leverage prompt engineering techniques.

## The Original Insight

The 2022 "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" paper showed that simply appending "Let's think step by step" to a prompt could make a model solve problems it previously failed at. The model produces intermediate reasoning steps as part of its output, which act as a working scratchpad.

```
Without CoT:
  Q: Roger has 5 tennis balls. He buys 2 more cans of 3 balls each. How many does he have?
  A: 11  ← model sometimes gets this wrong

With CoT:
  Q: Roger has 5 tennis balls. He buys 2 more cans of 3 balls each. How many does he have?
     Let's think step by step.
  A: Roger starts with 5 balls. He buys 2 cans × 3 balls = 6 more. 5 + 6 = 11. The answer is 11.
```

## Zero-Shot vs. Few-Shot CoT

**Zero-shot CoT**: Simply instruct the model to think step by step. No examples needed.

```python
response = client.messages.create(
    model="claude-sonnet-5",
    messages=[{
        "role": "user",
        "content": "Solve this problem step by step: " + problem
    }]
)
```

**Few-shot CoT**: Provide worked examples showing the thinking pattern you want.

```python
few_shot_prompt = """
Problem: If a store sells apples for $0.50 each and oranges for $0.75,
what's the cost of 4 apples and 3 oranges?
Reasoning: 4 apples × $0.50 = $2.00. 3 oranges × $0.75 = $2.25. Total = $4.25.
Answer: $4.25

Problem: {new_problem}
Reasoning:"""
```

## Structured CoT with XML Tags

For Claude specifically, wrapping the thinking process in XML tags makes it easier to parse the final answer and keeps the reasoning separate from the response:

```python
system_prompt = """
When solving problems, structure your response as follows:
<thinking>
Your step-by-step reasoning here
</thinking>
<answer>
Your final answer here
</answer>
"""

response = client.messages.create(
    model="claude-sonnet-5",
    system=system_prompt,
    messages=[{"role": "user", "content": problem}]
)

# Extract the answer
text = response.content[0].text
import re
answer = re.search(r'<answer>(.*?)</answer>', text, re.DOTALL)
```

## Self-Consistency: Majority Voting

A single CoT chain can still be wrong. Self-consistency improves reliability by sampling multiple independent reasoning paths and taking a majority vote:

```python
def solve_with_self_consistency(problem: str, n_samples: int = 5) -> str:
    answers = []
    for _ in range(n_samples):
        response = client.messages.create(
            model="claude-sonnet-5",
            max_tokens=1000,
            messages=[{
                "role": "user",
                "content": f"Solve step by step, then give your final answer: {problem}"
            }]
        )
        # Extract final answer (simplified)
        text = response.content[0].text
        answers.append(text.split("\n")[-1])

    from collections import Counter
    most_common = Counter(answers).most_common(1)[0][0]
    return most_common
```

Self-consistency helps when answers are enumerable (math, code correctness, classification). It doesn't help for open-ended generation.

## When CoT Helps vs. Hurts

| Task Type | CoT Effect |
|-----------|-----------|
| Multi-step math | Large positive gain |
| Logical reasoning | Large positive gain |
| Code debugging | Positive gain |
| Simple factual recall | Neutral or slightly negative |
| Commonsense QA | Small positive gain |
| Very short prompts | Can add noise |

CoT works by giving the model space to work through its logic. For tasks that don't require reasoning (simple lookups, single-step extraction), it adds tokens without adding value — and can occasionally confuse the model into second-guessing a correct instinct.

For reasoning that's built into the model rather than the prompt, see [extended thinking](/guides/extended-thinking) and [process vs. outcome reward models](/guides/reward-models).
