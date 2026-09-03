The smallest useful eval system has five parts: a dataset, success criteria fixed up front, a runner, saved results, and failure analysis by category. Here is each one.

## Step 1: Create an Eval Dataset

Start with 50–100 examples covering your real use cases.

```python
import json

eval_examples = [
    {
        "query": "What is the capital of France?",
        "expected": "Paris",
        "context": "Paris is the capital city of France...",  # For RAG
        "metadata": {"category": "geography", "difficulty": "easy"}
    },
    {
        "query": "Explain RAG in one sentence.",
        "expected": None,   # Open-ended — use LLM-as-Judge
        "metadata": {"category": "explanation", "difficulty": "medium"}
    },
    # Include: edge cases, failure scenarios, multiple difficulty levels
]

# Save
with open("eval_dataset.json", "w") as f:
    json.dump(eval_examples, f, indent=2)
```

**Dataset best practices:**
- Cover diverse question types (factual, reasoning, edge cases)
- Include questions with no answer in context (test "I don't know" behavior)
- Hold out 20% as a never-touched test set
- Grow with real user queries over time

## Step 2: Define Success Criteria

Before running evals, decide what "good" means. This prevents goalpost shifting.

```python
# RAG system criteria
success_criteria = {
    "faithfulness": 0.90,       # Critical — deploy blocker if below
    "answer_relevancy": 0.80,
    "precision_at_5": 0.70,
    "avg_latency_sec": 2.0,
}

def meets_criteria(results: dict) -> bool:
    return all(results.get(metric, 0) >= threshold
               for metric, threshold in success_criteria.items())
```

## Step 3: Run the Evaluation

```python
from datetime import datetime

class Evaluator:
    def evaluate(self, model_fn, eval_set: list) -> dict:
        results = []

        for example in eval_set:
            output = model_fn(example["query"], example.get("context"))
            exact = exact_match(output, example["expected"]) if example["expected"] else None
            faithful = check_faithfulness(example.get("context", ""), output) if example.get("context") else None

            results.append({
                "query": example["query"],
                "output": output,
                "expected": example.get("expected"),
                "metrics": {"exact_match": exact, "faithfulness": faithful},
                "metadata": example.get("metadata", {})
            })

        # Aggregate
        exact_scores = [r["metrics"]["exact_match"] for r in results if r["metrics"]["exact_match"] is not None]
        faith_scores = [r["metrics"]["faithfulness"] for r in results if r["metrics"]["faithfulness"] is not None]

        return {
            "timestamp": datetime.now().isoformat(),
            "num_examples": len(results),
            "metrics": {
                "exact_match": sum(exact_scores) / len(exact_scores) if exact_scores else None,
                "faithfulness": sum(faith_scores) / len(faith_scores) if faith_scores else None,
            },
            "results": results
        }
```

## Step 4: Save and Track Over Time

```python
import os

def save_results(results: dict, out_dir: str = "eval_results"):
    os.makedirs(out_dir, exist_ok=True)
    date = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = os.path.join(out_dir, f"eval_{date}.json")
    with open(path, "w") as f:
        json.dump(results, f, indent=2)
    return path

# Track metrics across runs
def load_history(results_dir: str) -> list[dict]:
    history = []
    for file in sorted(os.listdir(results_dir)):
        if file.endswith(".json"):
            with open(os.path.join(results_dir, file)) as f:
                data = json.load(f)
                history.append({
                    "date": data["timestamp"],
                    **data["metrics"]
                })
    return history
```

## Step 5: Analyze Failures

```python
def find_failures(results: dict, threshold: float = 0.5) -> dict:
    """Group failures by category to find systematic problems."""
    by_category = {}
    for r in results["results"]:
        score = r["metrics"].get("exact_match") or r["metrics"].get("faithfulness") or 0
        if score < threshold:
            cat = r["metadata"].get("category", "unknown")
            by_category.setdefault(cat, []).append(r)

    # Sort by count
    return dict(sorted(by_category.items(), key=lambda x: len(x[1]), reverse=True))

failures = find_failures(results)
for category, examples in failures.items():
    print(f"{category}: {len(examples)} failures")
    print(f"  Example: {examples[0]['query']}")
```

## Quick Start Checklist

- [ ] 50+ examples with diverse coverage
- [ ] 20% held out as test set (never touch during development)
- [ ] Success criteria defined before running
- [ ] Results saved with timestamp
- [ ] Failure analysis by category
