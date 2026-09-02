Four main approaches, each suited to different phases of development.

## 1. Offline Evaluation

Test on a static dataset with known expected outputs. Your baseline evaluation method.

```python
eval_set = [
    {"query": "What is the capital of France?", "expected": "Paris"},
    {"query": "What does RAG stand for?", "expected": "Retrieval-Augmented Generation"},
]

correct = sum(
    1 for ex in eval_set
    if my_model(ex["query"]).lower().strip() == ex["expected"].lower().strip()
)
print(f"Accuracy: {correct / len(eval_set):.2%}")
```

**When to use:** Development, regression testing before deployment, comparing prompts or models.

**Advantage:** Fast, cheap, reproducible.

## 2. LLM-as-a-Judge

Use a capable AI model to evaluate outputs on criteria like helpfulness, accuracy, and coherence.

```python
import anthropic

def evaluate_response(query: str, response: str) -> dict:
    client = anthropic.Anthropic()
    prompt = f"""Rate this AI response 1–10 for accuracy and helpfulness.

Query: {query}
Response: {response}

Return JSON: {{"score": <number>, "reasoning": "<explanation>"}}"""

    result = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    return result.content[0].text
```

**When to use:** Open-ended responses without a single correct answer, tone/clarity assessment, rapid iteration.

**Caution:** LLM judges have biases (prefer longer answers, favor their own style). Validate against human ratings.

## 3. Online Evaluation (A/B Testing)

Expose real users to variant A vs. variant B and measure outcomes.

```python
import random

def route_user(user_id: str) -> str:
    return "variant_a" if hash(user_id) % 2 == 0 else "variant_b"

# Track: satisfaction, success rate, completion time
# Run until statistically significant (usually 1–2 weeks, 1000+ users)
```

**When to use:** After offline eval shows improvement, validating that lab metrics translate to real user value.

**Caution:** Slow, requires significant traffic. Don't skip offline eval first.

## 4. Human Evaluation

Human raters score outputs against a rubric.

```python
rubric = """
Rate each response 1–5:
1 = Wrong or harmful
2 = Partially correct, significant issues
3 = Mostly correct, minor issues
4 = Correct and helpful
5 = Excellent, concise, well-sourced
"""
```

**When to use:** Establishing quality baselines, validating LLM-judge reliability, high-stakes applications (medical, legal, financial).

**Best practices:** 2+ raters per example, clear rubric, start with 25–50 examples to refine the rubric before scaling.

## Comparison

| Type | Speed | Cost | Primary Use |
|------|-------|------|-------------|
| **Offline** | Very fast | Very low | Development, regression |
| **LLM-as-Judge** | Fast | Low–medium | Open-ended quality |
| **Online A/B** | Slow | Medium | Production validation |
| **Human** | Very slow | High | Baseline, high-stakes |

**Start with offline + LLM-as-Judge. Add human eval for critical applications. Deploy A/B after you have confidence.**
