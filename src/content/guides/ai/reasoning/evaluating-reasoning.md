Evaluating reasoning models requires going beyond standard benchmarks. A model can produce the right answer for the wrong reason — and on the next slightly different problem, it will fail. Genuine reasoning quality requires evaluating the **process**, not just the **outcome** — the same distinction that separates [process and outcome reward models](/guides/reward-models).

## Why Standard Benchmarks Are Insufficient

Popular benchmarks (MMLU, GSM8K, HumanEval) are:
- **Contaminated**: The training data for most frontier models includes these benchmarks
- **Static**: A model that has memorized answers scores well without reasoning
- **Outcome-only**: They measure final answers, not the quality of the reasoning chain

A model that scores 90% on GSM8K may be pattern-matching from its training data, not reasoning. For reasoning model evaluation, you need additional signals.

## Task Categories That Reveal Reasoning Ability

| Category | Benchmark | What It Tests |
|----------|-----------|---------------|
| Competition math | AIME, AMC, MATH-500 | Multi-step algebraic and geometric reasoning |
| Code generation | SWE-bench, LiveCodeBench | Software engineering across real repos |
| Multi-step logic | ARC-AGI, BIG-Bench Hard | Novel tasks requiring compositional logic |
| Formal reasoning | MiniF2F (Lean proofs) | Mechanically verifiable proof steps |

These benchmarks are harder to contaminate because they require genuine reasoning steps, not pattern matching.

## Building Reasoning Evals: Process vs. Outcome Grading

**Outcome-graded eval**: Is the final answer correct?

```python
def outcome_eval(model_answer: str, ground_truth: str) -> bool:
    return normalize(model_answer) == normalize(ground_truth)
```

**Process-graded eval**: Are the intermediate steps correct?

```python
def process_eval(reasoning_steps: list[str], rubric: list[str]) -> float:
    """
    rubric: list of required reasoning steps the model should include
    Returns fraction of rubric steps that appear in the model's reasoning
    """
    score = 0
    for required_step in rubric:
        for model_step in reasoning_steps:
            if semantic_match(model_step, required_step):
                score += 1
                break
    return score / len(rubric)
```

## LLM-as-Judge for Reasoning Quality

For open-ended reasoning where ground truth isn't binary, use an LLM evaluator:

```python
def judge_reasoning(problem: str, model_response: str) -> dict:
    judge_prompt = f"""
You are evaluating the quality of a model's reasoning process.

Problem: {problem}

Model Response (including reasoning):
{model_response}

Rate the following on a scale of 1-5:
1. Logical validity: Are the reasoning steps logically sound?
2. Completeness: Does the reasoning cover all necessary steps?
3. Accuracy: Is the final answer correct?
4. Efficiency: Does the model avoid unnecessary detours?

Provide scores and a brief justification for each.
Respond as JSON: {{"logical_validity": N, "completeness": N, "accuracy": N, "efficiency": N, "notes": "..."}}
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        messages=[{"role": "user", "content": judge_prompt}]
    )

    import json
    return json.loads(response.content[0].text)
```

## Distinguishing "Got It Right" from "Reasoned Correctly"

The critical test: **perturbation robustness**. If a model reasons correctly, small changes to a problem should produce small changes in the reasoning path. If it's pattern-matching, small changes can completely break it.

```python
def robustness_eval(base_problem: str, perturbations: list[str]) -> float:
    base_answer = get_model_answer(base_problem)

    consistent = 0
    for perturbed in perturbations:
        perturbed_answer = get_model_answer(perturbed)
        # If perturbation shouldn't change the answer, check consistency
        if answers_should_match(base_problem, perturbed):
            if normalize(perturbed_answer) == normalize(base_answer):
                consistent += 1

    return consistent / len(perturbations)
```

## Practical Evaluation for Production Systems

For your own production system, reasoning quality can be measured through:

1. **Task success rate** — Does the model solve the problem you built it for?
2. **Error type distribution** — Is it making logical errors or knowledge errors?
3. **Consistency under paraphrase** — Same problem, different wording: same answer?
4. **Step validity rate** — For problems with known solution paths, what fraction of steps are valid?

Folding these checks into a CI pipeline is a job for the evaluation guides — the same eval discipline, applied to reasoning traces rather than final answers.
