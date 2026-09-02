A benchmark becomes contaminated when its test examples appear in a model's training data. The model "memorizes" the answers rather than learning to reason — and appears dramatically more capable than it actually is on novel inputs.

With internet-scale training corpora, contamination is nearly unavoidable for any benchmark that has existed for more than a year. HumanEval, MMLU, GSM8K, and ARC are all considered likely contaminated in frontier models.

## Why Contamination Is Hard to Avoid

Most LLM training data comes from internet crawls (Common Crawl, GitHub, papers, forums). Any popular benchmark will eventually be discussed, reproduced, and annotated online:

```
Timeline of contamination vectors:
  T=0: MMLU benchmark published
  T+1 month: Solutions and discussions posted to Reddit, StackExchange
  T+3 months: GitHub repos with MMLU examples and answers
  T+6 months: Tutorial websites, YouTube transcripts
  T+1 year: All of the above indexed in Common Crawl
  T+2 years: Model trained on data that includes all of the above
```

## Detecting Contamination

**String matching**: check if test examples appear in training data verbatim. Only catches exact copies.

**N-gram overlap**: compare n-gram distributions between test sets and training data. Catches near-duplicates.

**Membership inference**: if the model assigns higher probability to benchmark examples than to similar unseen examples, that's evidence of memorization.

```python
import anthropic
import numpy as np

client = anthropic.Anthropic()

def estimate_contamination(benchmark_examples: list[str], control_examples: list[str]) -> float:
    """
    Heuristic: compare log-probability proxy between benchmark and control.
    If benchmark examples have significantly shorter completions (model is "confident"),
    that may indicate memorization.
    """
    def measure_confidence(examples: list[str]) -> list[float]:
        scores = []
        for example in examples:
            # Ask model to complete the example; measure token count needed
            response = client.messages.create(
                model="claude-sonnet-5",
                max_tokens=50,
                messages=[{"role": "user", "content": f"Complete this: {example[:100]}..."}]
            )
            scores.append(len(response.content[0].text.split()))
        return scores

    bench_scores = measure_confidence(benchmark_examples)
    control_scores = measure_confidence(control_examples)

    # Lower token count may indicate higher confidence (memorized answer)
    bench_mean = np.mean(bench_scores)
    control_mean = np.mean(control_scores)
    return (control_mean - bench_mean) / control_mean   # Contamination signal
```

## The Dynamic Benchmark Problem

Static benchmarks degrade as evaluation tools once models have trained on them. Solutions:

**Held-out contamination sets**: maintain a private version of the benchmark that has never been published online. Release only subsets.

**Dynamic / generative benchmarks**: generate new examples at evaluation time. Scale and LiveBench do this — examples are constructed from recent events that post-date training.

**Human-preference evaluation**: Chatbot Arena uses pairwise human ratings on novel user queries. No memorizable answer set. This is currently the most trusted capability signal.

**Private test sets**: EpochAI, METR, and other third-party evaluators maintain private held-out benchmarks with strict access controls.

## Interpreting Benchmark Numbers Skeptically

| Claim | Skeptic's question |
|-------|-------------------|
| "96% on MMLU" | When was the model trained? MMLU is from 2020. |
| "87% on HumanEval" | HumanEval has been on GitHub since 2021. |
| "+15% vs last model" | Same benchmark, same potential contamination. |
| "New SOTA on X" | Is this a private test set, or was it published before training? |

For internal evals that matter, construct your own domain-specific test sets from internal documents and queries that have never appeared online. These are contamination-proof by construction.
