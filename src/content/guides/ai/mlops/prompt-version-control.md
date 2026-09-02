Prompts are code, and they need version control for the same reasons code does: to track what changed, why, and who changed it; to roll back when a change breaks something; and to run A/B experiments with confidence about what's being compared.

Storing prompts as strings in application code conflates prompt engineering with deployment — every prompt change requires a code deploy, and comparing prompt versions requires reading git diffs in the middle of non-prompt code.

## The Minimal Viable Approach: Prompts as Config

The simplest upgrade: extract prompts from code into versioned config files.

```python
# prompts/v1.yaml
system: |
  You are a helpful customer support agent for Acme Corp.
  Always be polite and concise.
  If you don't know the answer, say so.

user_template: |
  Customer query: {query}
  Customer tier: {tier}
```

```python
# prompt_loader.py
import yaml, string

def load_prompt(version: str, **kwargs) -> dict:
    with open(f"prompts/{version}.yaml") as f:
        prompt = yaml.safe_load(f)
    return {
        "system": prompt["system"],
        "user": string.Template(prompt["user_template"]).safe_substitute(**kwargs)
    }

# Usage
prompt = load_prompt("v2", query=user_query, tier="premium")
```

Prompts in YAML files are tracked by git: `git diff v1.yaml v2.yaml` shows exactly what changed, and `git revert` rolls back a bad prompt within seconds.

## Dedicated Prompt Management Platforms

```python
import langsmith

client = langsmith.Client()

# Pull a specific prompt version — works in dev and prod
prompt = client.pull_prompt("customer-support:v3")

response = anthropic_client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=prompt.system,
    messages=[{"role": "user", "content": query}]
)
```

| Platform | Key features |
|----------|-------------|
| LangSmith Hub | Git-like versioning, team collaboration, LLM provider agnostic |
| Promptfoo | YAML-first, CI integration, regression testing built-in |
| Braintrust | Dataset versioning + prompt versioning, A/B testing framework |
| PromptLayer | Prompt registry + observability, per-version analytics |

## Semantic Versioning for Prompts

Borrow semantic versioning conventions:

```
MAJOR.MINOR.PATCH

MAJOR: behavior change that may break existing eval benchmarks
       (new persona, different task framing, changed refusal behavior)

MINOR: improved performance within same behavior contract
       (better examples, clearer phrasing, added edge case handling)

PATCH: typos, formatting, variable name changes
       (no expected impact on outputs)

Example:
  v2.0.0: changed from formal to conversational tone (MAJOR — A/B test required)
  v2.1.0: added 3 new few-shot examples (MINOR — expected improvement)
  v2.1.1: fixed typo in system prompt (PATCH — safe to deploy immediately)
```

## A/B Testing Prompts

```python
import random, time
from typing import Literal

VARIANTS: dict[str, str] = {
    "control": "You are a helpful assistant. Be concise.",
    "treatment": "You are an expert assistant. Think step by step, then give a clear, concise answer."
}

def get_variant(user_id: str) -> Literal["control", "treatment"]:
    """Deterministic assignment based on user_id — same user always gets same variant."""
    return "control" if int(user_id, 36) % 2 == 0 else "treatment"

def answer_with_tracking(query: str, user_id: str) -> str:
    variant = get_variant(user_id)
    system = VARIANTS[variant]

    start = time.time()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": query}]
    )
    latency = time.time() - start

    # Log to your analytics system
    analytics.track("llm_response", {
        "variant": variant,
        "latency": latency,
        "tokens": response.usage.output_tokens,
        "user_id": user_id
    })

    return response.content[0].text
```

Track downstream metrics (user satisfaction, thumbs up/down, task completion) by variant. Measure for statistical significance before promoting treatment to control.
