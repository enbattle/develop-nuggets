## Evaluating Fine-Tuned Models

A fine-tuning run that improves your target metric might silently degrade performance on adjacent tasks. Rigorous evaluation catches these regressions before deployment.

## The Only Honest Measure: Held-Out Test Set

Any evaluation on training data or its near-neighbors is optimistic. The only reliable quality signal is performance on examples the model has never seen — your held-out test set, collected before fine-tuning began.

```python
def evaluate_on_test_set(model, tokenizer, test_examples: list[dict]) -> dict:
    results = {"correct": 0, "total": len(test_examples), "errors": []}

    for example in test_examples:
        response = generate(model, tokenizer, example["instruction"])
        expected = example["expected_output"]

        if evaluate_match(response, expected):
            results["correct"] += 1
        else:
            results["errors"].append({
                "instruction": example["instruction"],
                "expected": expected,
                "got": response,
            })

    results["accuracy"] = results["correct"] / results["total"]
    return results
```

## Catastrophic Forgetting

Fine-tuning for one task can degrade performance on other tasks the model previously handled well. This is catastrophic forgetting — the model "overwrites" general capabilities with task-specific ones.

Test your fine-tuned model on general benchmarks alongside your task-specific eval:

```python
def regression_eval(finetuned_model, base_model, general_benchmarks: list[dict]) -> dict:
    results = {}
    for benchmark in general_benchmarks:
        base_score = run_benchmark(base_model, benchmark)
        ft_score = run_benchmark(finetuned_model, benchmark)

        degradation = (base_score - ft_score) / base_score
        results[benchmark["name"]] = {
            "base": base_score,
            "finetuned": ft_score,
            "degradation_pct": degradation * 100,
        }

    # Flag any benchmark with >5% degradation
    regressions = {k: v for k, v in results.items() if v["degradation_pct"] > 5}
    return {"results": results, "regressions": regressions}
```

## Standard Benchmarks for Common Tasks

| Task | Benchmark | What It Measures |
|------|-----------|-----------------|
| Instruction following | IFEval | Precise instruction adherence |
| Code generation | HumanEval, MBPP | Function-level code correctness |
| Chat quality | MT-Bench | Multi-turn conversation quality |
| Reasoning | HellaSwag, ARC | Commonsense and reasoning |
| Domain knowledge | MMLU subsets | Knowledge retention |

Run these on your fine-tuned model and compare against the base model scores. Any significant regression is a signal that your fine-tuning corrupted general capabilities.

## Comparing Against the Base Model

Always frame your evaluation as a comparison:

```python
def run_comparison(base_model, finetuned_model, eval_set: list[dict]) -> dict:
    base_scores = evaluate_on_test_set(base_model, eval_set)
    ft_scores = evaluate_on_test_set(finetuned_model, eval_set)

    return {
        "base_accuracy": base_scores["accuracy"],
        "finetuned_accuracy": ft_scores["accuracy"],
        "delta": ft_scores["accuracy"] - base_scores["accuracy"],
        "worth_deploying": ft_scores["accuracy"] > base_scores["accuracy"] * 1.05,
        # Only deploy if >5% improvement — otherwise overhead not justified
    }
```

## The Contamination Risk

If you used a large model to generate your training data, check whether your test set was likely in that model's training data. A model that "knows" the answers from pre-training will produce inflated eval scores.

For tasks with widely available answers (common coding problems, popular textbook problems), prefer custom eval sets based on internal data that couldn't be in any public training corpus.

## Cost-Benefit Analysis

Before deploying a fine-tuned model, run the numbers:

```
Scenario: Fine-tuned 7B model vs. Claude API

Fine-tuned model:
  Hosting: $0.50/hr for a GPU instance
  Monthly cost: $360
  Latency: 50ms average
  Quality: 94% accuracy on task

Claude API:
  Cost: ~$0.003 per query
  At 10,000 queries/day: $30/day = $900/month
  Latency: 800ms average
  Quality: 96% accuracy on task

Conclusion: Fine-tune if you're doing >24,000 queries/day AND can accept 2% quality loss.
```

The fine-tuned model is only justified when volume is high enough that hosting costs beat API costs, AND the quality delta is acceptable for your use case.
