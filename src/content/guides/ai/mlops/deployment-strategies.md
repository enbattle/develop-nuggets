How you deploy is as important as what you deploy. These strategies minimize risk during rollouts.

## 1. Blue-Green Deployment

Maintain two identical environments. Switch all traffic at once.

```
Blue (Current v1.0)  ← All traffic
Green (New v2.0)     ← Idle (ready)

Switch:
Blue (Current v1.0)  ← Idle (rollback target)
Green (New v2.0)     ← All traffic
```

```python
import anthropic

class BlueGreenDeployment:
    def __init__(self):
        self.blue_model = "claude-sonnet-4-6"    # Current stable
        self.green_model = "claude-opus-4-8"     # New version
        self.active = "blue"

    def query(self, prompt: str) -> str:
        model = self.blue_model if self.active == "blue" else self.green_model
        client = anthropic.Anthropic()
        response = client.messages.create(
            model=model, max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text

    def switch_to_green(self):
        self.active = "green"

    def rollback(self):
        self.active = "blue"
```

**Best for:** Simple deployments, when instant rollback is required.

## 2. Canary Deployment

Gradually increase traffic to the new version.

```python
import random

class CanaryDeployment:
    def __init__(self, canary_percentage: float = 0.05):
        self.stable_model = "claude-sonnet-4-6"
        self.canary_model = "claude-opus-4-8"
        self.canary_pct = canary_percentage

    def query(self, prompt: str, user_id: str) -> tuple[str, str]:
        # Deterministic routing per user (consistent experience)
        use_canary = hash(user_id) % 100 < (self.canary_pct * 100)
        model = self.canary_model if use_canary else self.stable_model

        # ... execute query ...
        return response, ("canary" if use_canary else "stable")

    def increase_canary(self, new_pct: float):
        """Gradually increase: 5% → 10% → 25% → 50% → 100%"""
        self.canary_pct = new_pct
```

**Rollout schedule:** 5% → 10% → 25% → 50% → 100%
**Gate at each stage:** Check error rate, latency, quality metrics before proceeding.

## 3. A/B Testing

Compare two variants with statistical rigor.

```python
class ABTest:
    def __init__(self, variant_a: str, variant_b: str, split: float = 0.5):
        self.variants = {"a": variant_a, "b": variant_b}
        self.split = split
        self.metrics = {"a": [], "b": []}

    def route(self, user_id: str) -> str:
        return "a" if hash(user_id) % 100 < (self.split * 100) else "b"

    def record(self, variant: str, metric: float):
        self.metrics[variant].append(metric)

    def is_significant(self, confidence: float = 0.95) -> dict:
        from scipy import stats
        t_stat, p_value = stats.ttest_ind(self.metrics["a"], self.metrics["b"])
        return {
            "significant": p_value < (1 - confidence),
            "p_value": p_value,
            "winner": "a" if sum(self.metrics["a"]) > sum(self.metrics["b"]) else "b"
        }
```

**Rule:** Run until statistical significance or minimum sample size (usually 1,000+ users per variant).

## 4. Shadow Mode

New model runs in parallel but results are not shown to users — only compared. See also [shadow evaluation](/guides/evals-advanced-topics) for the offline-comparison variant.

```python
async def shadow_deployment(prompt: str) -> str:
    # Run both simultaneously
    stable_result, shadow_result = await asyncio.gather(
        query_model(stable_model, prompt),
        query_model(shadow_model, prompt)
    )

    # Log comparison (shadow model output not shown to user)
    log_shadow_comparison({
        "prompt": prompt,
        "stable": stable_result,
        "shadow": shadow_result,
        "timestamp": datetime.now().isoformat()
    })

    return stable_result   # Always return stable to user
```

## Decision Framework

```
Is this a high-risk change?
    Yes → Shadow Mode first, then Canary
    No → Canary starting at 5%

Need to compare user behavior?
    Yes → A/B Test
    No → Canary

Need instant rollback?
    Yes → Blue-Green
    No → Canary (can also be rolled back)
```
