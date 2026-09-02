When training reasoning models, a central problem is how to provide a training signal. Standard RLHF scores the final output. But for complex reasoning tasks, scoring the answer alone misses whether the model reasoned correctly — it might get lucky, or reason correctly but produce a wrong answer.

Reward models are the core mechanism for providing that training signal.

## What is a Reward Model?

A reward model (RM) is a model trained to score outputs. During RL training, the policy model (the LLM) generates responses, and the reward model assigns scores. The policy is updated to produce responses the reward model rates highly.

```
Training loop:
  Policy LLM → generates response
  Reward Model → scores the response
  RL update → push policy toward higher-scoring responses
```

## Outcome Reward Models (ORMs)

ORMs score only the **final answer**. If the answer is correct, it gets a positive reward; if wrong, a negative reward.

**Strengths:**
- Easy to implement for tasks with verifiable answers (math, code)
- No need to label intermediate steps

**Weaknesses:**
- Rewards lucky guessing as much as correct reasoning
- Doesn't distinguish "right answer, wrong method" from "right answer, right method"
- Encourages shortcut-finding rather than genuine reasoning

## Process Reward Models (PRMs)

PRMs score **each intermediate reasoning step**, not just the final answer. A step that contains a logical error gets a negative score even if the final answer happens to be correct.

```
Problem: Solve 2x + 6 = 14

Step 1: Subtract 6 from both sides → 2x = 8   ← PRM: +1 (correct)
Step 2: Divide both sides by 3    → x = 8/3   ← PRM: -1 (wrong, should divide by 2)
Final answer: x = 8/3                           ← ORM: -1 (wrong), PRM already caught it
```

**Strengths:**
- Models learn to reason correctly, not just find correct answers
- Better generalization to new problems
- Provides denser feedback signal (one score per step vs. one per response)

**Weaknesses:**
- Requires labeled reasoning steps for training — expensive to create
- Step boundaries are not always clear

## Best-of-N Sampling

Both ORMs and PRMs enable **best-of-N sampling** at inference time: generate N independent solutions, score each with the reward model, return the highest-scoring one.

```python
def best_of_n(problem: str, reward_model, n: int = 8) -> str:
    responses = []
    for _ in range(n):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            messages=[{"role": "user", "content": problem}]
        )
        responses.append(response.content[0].text)

    # Score each response with the reward model
    scores = [reward_model.score(problem, r) for r in responses]
    best_idx = scores.index(max(scores))
    return responses[best_idx]
```

Best-of-N is a simple way to spend [test-time compute](/guides/reasoning-models): more compute → more samples → better chance of a high-quality response being among the N.

## How DeepSeek R1 and o1 Use PRMs

**DeepSeek R1** trains with Group Relative Policy Optimization (GRPO): generate multiple completions for each problem, rank them against each other, and use the relative rankings as the training signal. The reward comes from verifiable outcomes (math answer is right or wrong) plus a process correctness check.

**o1** (details not fully disclosed by OpenAI) uses RL with a verifier that can check intermediate steps, producing a model that has learned to reason systematically before answering.

## Practical Implication: Verifiers and Graders

For production systems, you can implement a lightweight version of this pattern: build a **verifier** that checks whether an LLM's answer and reasoning is correct, and use it to filter or rank responses.

```python
def verified_answer(question: str, expected_type: str) -> str:
    for attempt in range(3):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            thinking={"type": "enabled", "budget_tokens": 5000},
            messages=[{"role": "user", "content": question}]
        )
        answer = extract_answer(response)

        # Simple verifier: check answer matches expected type/format
        if validate_answer(answer, expected_type):
            return answer

    return "Unable to produce a verified answer."
```

The key takeaway: ORMs are simpler but encourage shortcuts; PRMs produce better reasoning but require step-level labels. At inference time, best-of-N sampling with either gives measurable quality improvement.
