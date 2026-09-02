## Reflexion & Meta-Prompting

Beyond single-pass reasoning, a class of techniques teaches models to improve their own outputs through self-critique, self-instruction, and automated prompt optimization. These are particularly powerful when tasks have verifiable quality signals.

## Reflexion: Generate, Critique, Retry

The Reflexion pattern (from the 2023 paper "Reflexion: Language Agents with Verbal Reinforcement Learning") works in three stages:

1. **Generate**: Produce an initial response
2. **Critique**: Evaluate what's wrong with the response — either via a separate model, an external verifier, or the same model self-reflecting
3. **Retry**: Generate a new response conditioned on the critique

```python
import anthropic

client = anthropic.Anthropic()

def reflexion(task: str, max_iterations: int = 3) -> str:
    response = ""
    critique = ""

    for i in range(max_iterations):
        # Generate (or re-generate with prior critique)
        messages = [{"role": "user", "content": task}]
        if critique:
            messages.append({"role": "assistant", "content": response})
            messages.append({
                "role": "user",
                "content": f"Your previous response had these issues:\n{critique}\n\nPlease try again."
            })

        gen = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1500,
            messages=messages
        )
        response = gen.content[0].text

        # Critique — ask the model to evaluate its own output
        critique_response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=500,
            messages=[{
                "role": "user",
                "content": f"""Task: {task}

Response: {response}

Identify specific errors, omissions, or improvements. If the response is correct and complete, say "DONE".
Critique:"""
            }]
        )
        critique = critique_response.content[0].text

        if "DONE" in critique:
            break

    return response
```

Reflexion works best on tasks with **verifiable correctness** — code that can be executed, math answers that can be checked, or structured outputs that can be validated against a schema.

## Meta-Prompting: Write Your Own Instructions

Meta-prompting asks the model to generate a structured plan or set of sub-instructions for itself before attempting the main task. It's "thinking about how to think":

```python
def meta_prompt(task: str) -> str:
    # Step 1: Ask the model to design its own approach
    plan_response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        messages=[{
            "role": "user",
            "content": f"""Before attempting this task, design a step-by-step plan for how you will approach it.
Be specific about what information you'll need, what order you'll work through it, and what could go wrong.

Task: {task}

Plan:"""
        }]
    )
    plan = plan_response.content[0].text

    # Step 2: Execute the task following the plan
    execute_response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": f"""Follow this plan to complete the task:

Plan:
{plan}

Task: {task}

Execute:"""
        }]
    )
    return execute_response.content[0].text
```

## APE: Automatic Prompt Engineer

APE (Zhou et al., 2022) uses an LLM to generate and evaluate candidate prompts for a task, then selects the best-performing one. The key loop:

```python
def automatic_prompt_engineer(task_description: str, eval_examples: list[dict]) -> str:
    # Step 1: Generate candidate prompts
    candidate_response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{
            "role": "user",
            "content": f"""Generate 5 different instruction prompts for this task.
Each prompt should instruct an AI to perform the task well.
Task description: {task_description}

Return as a numbered list."""
        }]
    )
    candidates = parse_numbered_list(candidate_response.content[0].text)

    # Step 2: Evaluate each candidate on examples
    scores = []
    for prompt in candidates:
        score = evaluate_prompt(prompt, eval_examples)
        scores.append(score)

    # Step 3: Return the best prompt
    best_idx = scores.index(max(scores))
    return candidates[best_idx]


def evaluate_prompt(prompt: str, examples: list[dict]) -> float:
    correct = 0
    for ex in examples:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            messages=[
                {"role": "user", "content": prompt + "\n\n" + ex["input"]}
            ]
        )
        if response.content[0].text.strip() == ex["expected"]:
            correct += 1
    return correct / len(examples)
```

## Choosing the Right Pattern

| Pattern | Best For | Key Requirement |
|---------|----------|-----------------|
| Reflexion | Tasks with verifiable outputs (code, math) | Automated verifier or self-critique |
| Meta-Prompting | Complex multi-part tasks | Task is decomposable into a clear plan |
| APE | Optimizing prompts for recurring tasks | Labeled eval set |

## Composing Reflexion with Orchestration

Reflexion is most powerful in an agentic loop where external execution provides real feedback:

```python
def agentic_reflexion(coding_task: str) -> str:
    code = generate_code(coding_task)

    for _ in range(3):
        result = execute_code(code)  # real execution, not self-evaluation
        if result.success:
            return code

        # Use real error output as critique
        fix_response = client.messages.create(
            model="claude-sonnet-4-6",
            messages=[{
                "role": "user",
                "content": f"Fix this code. Error: {result.error}\n\nCode:\n{code}"
            }]
        )
        code = extract_code(fix_response.content[0].text)

    return code
```

Reflexion earns its keep inside an agent's execution loop, where a real test run or tool call supplies the critique instead of the model grading itself — the orchestration and agent-evaluation guides pick up that thread.
