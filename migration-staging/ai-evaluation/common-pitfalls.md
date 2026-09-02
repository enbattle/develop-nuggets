## Common Evaluation Pitfalls

These mistakes are easy to make and expensive to discover later.

## 1. Too Few Examples

**Problem:** Running evals on only 10–20 examples.

**Why it hurts:** Small samples produce unreliable metrics — a 5% difference could be noise, not a real improvement. Edge cases aren't covered.

**Fix:** Minimum 50–100 for development. 500+ for production confidence. Continuously add real user queries that reveal failures.

## 2. Happy-Path Only

**Problem:** Eval set covers only straightforward questions.

**Why it hurts:** Your system will look great until a real user asks something unexpected.

**Fix — explicitly include:**
- Edge cases: ambiguous queries, typos, unusual phrasing
- Failure scenarios: questions with no answer in context
- Adversarial inputs: attempts to bypass instructions
- Multiple difficulty levels: easy, medium, hard

## 3. Overfitting to the Eval Set

**Problem:** Tweaking the system until eval scores are perfect.

**Why it hurts:** You're optimizing for the test, not for real users. The system won't generalize.

```python
# The fix: hold out 20% from the very beginning
import random
random.shuffle(all_examples)
split = int(0.8 * len(all_examples))
dev_set = all_examples[:split]     # Use freely during development
holdout = all_examples[split:]     # Check ONLY before major releases
```

## 4. Single Metric Obsession

**Problem:** Chasing one number while ignoring others.

**Why it hurts:** High accuracy + low faithfulness = hallucinations. High precision + low recall = missing information.

```python
# Define success as meeting ALL criteria
def meets_all_criteria(results: dict) -> bool:
    return (
        results["faithfulness"] >= 0.90 and    # non-negotiable
        results["answer_relevancy"] >= 0.80 and
        results["avg_latency"] <= 2.0
    )
```

## 5. No Baseline

**Problem:** No reference point for what "good" looks like.

**Why it hurts:** You can't tell if 75% is excellent or terrible without context. You can't measure if you're actually improving.

```python
# Always establish baseline first
baseline = evaluator.evaluate(simple_rag, eval_set)
print(f"Baseline faithfulness: {baseline['faithfulness']:.2%}")

improved = evaluator.evaluate(advanced_rag, eval_set)
delta = improved['faithfulness'] - baseline['faithfulness']
print(f"Improvement: {delta:+.1%}")
```

## 6. Not Versioning Eval Datasets

**Problem:** Modifying the dataset without tracking changes.

**Why it hurts:** You can't compare results across time. You lose the ability to detect regressions.

```
eval_datasets/
  ├── v1_baseline_2024_01.json       # 50 examples
  ├── v2_expanded_2024_03.json       # 150 examples (added edge cases)
  ├── v3_production_2024_06.json     # 500 examples (added real queries)
  ├── CHANGELOG.md
  └── holdout/
      └── holdout_v1.json            # Never modified
```

## 7. Ignoring Failure Analysis

**Problem:** Only looking at aggregate scores, never individual failures.

**Why it hurts:** Aggregates hide patterns. Your system might fail 100% on a specific category that represents 30% of real traffic.

```python
# Always look at failures by category
failures_by_category = group_by(failures, key="category")
# Output: {"billing": 12 failures, "technical": 3 failures, "general": 1 failure}
# Now you know where to focus improvement work
```

## Checklist Before Running Any Eval

- [ ] ≥50 diverse examples with edge cases
- [ ] 20% holdout separated and untouched
- [ ] 2–3 metrics covering different dimensions
- [ ] Success thresholds defined beforehand
- [ ] Baseline established for comparison
- [ ] Dataset versioned with CHANGELOG
- [ ] Plan to analyze failures, not just aggregate scores
