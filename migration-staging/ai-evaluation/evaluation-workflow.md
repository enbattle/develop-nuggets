## Production Evaluation Workflow

A systematic process from development through production.

## The Full Workflow

```
Development Phase
─────────────────
Build prototype
    ↓
Run offline eval (dev set)
    ↓
Analyze failures → Fix → Repeat
    ↓
Manual spot-check (20–50 examples)
    ↓
Run holdout eval (one-time gate)
    ↓
Deploy Phase
─────────────
Canary release (5–10% traffic)
    ↓
Monitor live metrics
    ↓
A/B test (50/50 traffic)
    ↓
Full rollout
    ↓
Ongoing Monitoring
──────────────────
Weekly offline eval on growing dataset
Log production failures → add to eval set
Retrain / tune when metrics decline
```

## Development Evaluation Loop

```python
def development_loop(system, eval_set: list, success_criteria: dict):
    iteration = 0
    while True:
        iteration += 1
        print(f"\n--- Iteration {iteration} ---")

        results = evaluator.evaluate(system, eval_set)
        print_metrics(results)

        if meets_criteria(results, success_criteria):
            print("✓ All criteria met. Ready for holdout evaluation.")
            break

        failures = find_failures(results)
        print_top_failures(failures, n=5)

        # Manual: inspect failures, tune system, repeat
        input("Press Enter after making improvements...")
```

## Pre-Deployment Gate

```python
def deployment_gate(system, holdout_set: list, criteria: dict) -> bool:
    """Run once before each major release."""
    results = evaluator.evaluate(system, holdout_set)

    gate_passed = meets_criteria(results, criteria)
    report = {
        "passed": gate_passed,
        "timestamp": datetime.now().isoformat(),
        "metrics": results["metrics"],
        "criteria": criteria,
    }

    save_results(report, "deployment_gates/")

    if not gate_passed:
        failing = [m for m, t in criteria.items()
                   if results["metrics"].get(m, 0) < t]
        print(f"❌ Deployment blocked. Failing: {failing}")
    else:
        print("✓ Deployment approved.")

    return gate_passed
```

## Production Monitoring

```python
import json, time
from datetime import datetime

class ProductionMonitor:
    def __init__(self, log_path: str):
        self.log_path = log_path

    def log_request(self, query: str, answer: str, latency_ms: float):
        entry = {
            "timestamp": datetime.now().isoformat(),
            "query": query,
            "answer": answer,
            "latency_ms": latency_ms,
        }
        with open(self.log_path, "a") as f:
            f.write(json.dumps(entry) + "\n")

    def log_feedback(self, query_id: str, rating: int):
        """Collect thumbs-up/down from UI."""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "query_id": query_id,
            "rating": rating,
        }
        with open(self.log_path.replace(".jsonl", "_feedback.jsonl"), "a") as f:
            f.write(json.dumps(entry) + "\n")
```

## Continuous Improvement Cycle

```python
def weekly_eval_cycle():
    """Run every week as a scheduled job."""
    # 1. Load current eval set (growing over time)
    eval_set = load_dataset("eval_datasets/v_latest.json")

    # 2. Run full evaluation
    results = evaluator.evaluate(current_system, eval_set)
    save_results(results, f"eval_results/weekly_{date.today()}.json")

    # 3. Compare to previous week
    prev = load_latest_results("eval_results/")
    delta = compare_metrics(results, prev)
    alert_if_regression(delta, threshold=0.05)   # Alert if >5% drop

    # 4. Sample production logs for new failure cases
    new_failures = sample_production_failures(n=20)
    add_to_eval_set(new_failures, "eval_datasets/v_latest.json")
```

## When to Trigger a Full Evaluation

- Before any prompt change
- Before any model version upgrade
- After reindexing the knowledge base (RAG)
- After any system configuration change
- Weekly in production (scheduled)
- When user satisfaction metrics drop

## Key Principle

**Evaluation is not a one-time event.** It's a continuous process that runs in parallel with development and production. The teams that ship reliable AI systems are those that close the feedback loop fastest.
