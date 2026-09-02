## Data Flywheels

A data flywheel is a self-reinforcing improvement loop: the product generates data, the data improves the model, the better model improves the product, which generates more and better data. Each turn of the flywheel increases the competitive advantage of having more users.

In AI products, the flywheel typically runs through human feedback on model outputs, implicit behavioral signals, or both.

## Feedback Collection Patterns

**Explicit binary**: thumbs up / thumbs down. Simple, but captures only the extremes of quality distribution.

```python
import anthropic, time

client = anthropic.Anthropic()

def answer_with_feedback_loop(query: str, session_id: str) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": query}]
    )

    output = response.content[0].text
    interaction_id = f"{session_id}_{int(time.time())}"

    # Store for feedback collection — feedback arrives asynchronously
    db.store_interaction({
        "id": interaction_id,
        "query": query,
        "output": output,
        "model": "claude-sonnet-4-6",
        "tokens": response.usage.output_tokens,
        "feedback": None   # Populated later via feedback endpoint
    })

    return {"output": output, "interaction_id": interaction_id}

def record_feedback(interaction_id: str, rating: int, correction: str | None = None):
    db.update_interaction(interaction_id, {
        "feedback": {"rating": rating, "correction": correction}
    })
    # Enqueue for weekly fine-tuning run if correction provided
    if correction:
        training_queue.add(interaction_id)
```

**Implicit signals**: does the user copy the output? Edit it? Regenerate? Ask a follow-up clarifying question? These behavioral signals are often more honest than explicit ratings (users rarely thumbs-down a mediocre answer if it's "good enough").

```python
# Track implicit quality signals
def track_copy_event(interaction_id: str, copied_text: str):
    analytics.track("output_copied", {
        "interaction_id": interaction_id,
        "copy_fraction": len(copied_text) / get_interaction(interaction_id)["output_length"]
    })

def track_regeneration(interaction_id: str):
    analytics.track("regenerated", {"interaction_id": interaction_id})
    db.update_interaction(interaction_id, {"signal": "regenerate_requested"})
```

## The Preference Dataset Pipeline

```
User query
    ↓
Model output (or multiple candidate outputs for A/B)
    ↓
Implicit + explicit feedback collection
    ↓
Filter: keep high-confidence signal pairs
         (rated 5/5 AND high copy rate, or explicit correction)
    ↓
Preference dataset: (query, chosen output, rejected output)
    ↓
Fine-tuning via DPO or RLHF
    ↓
Improved model → better outputs → more positive feedback → ...
```

## Building a Preference Dataset for Fine-Tuning

```python
def build_preference_dataset(min_confidence: float = 0.8) -> list[dict]:
    """Compile high-confidence preference pairs for DPO fine-tuning."""
    pairs = []

    for interaction in db.get_interactions_with_feedback():
        if interaction["feedback"] is None:
            continue

        rating = interaction["feedback"]["rating"]
        correction = interaction["feedback"].get("correction")
        copy_fraction = interaction.get("copy_fraction", 0)

        # High-quality positive example
        if rating >= 4 and copy_fraction > 0.5:
            pairs.append({
                "prompt": interaction["query"],
                "chosen": interaction["output"],
                "rejected": None   # No rejected sample — use for SFT
            })

        # Preference pair with explicit correction
        if correction and rating <= 2:
            pairs.append({
                "prompt": interaction["query"],
                "chosen": correction,
                "rejected": interaction["output"]
            })

    return pairs
```

## Flywheel Stages

| Stage | Users | Data volume | Strategy |
|-------|-------|-------------|----------|
| Pre-launch | 0 | 0 | Start with base model + strong prompt |
| Early | < 1K | Thin | Collect everything; LLM-assisted labeling |
| Growth | 1K–100K | Growing | Implicit signals dominate; selective human review |
| Mature | 100K+ | Rich | Automated preference curation; continuous fine-tuning |

The flywheel only works if the product is good enough to generate positive signal. A product that generates mostly negative feedback spins the wheel backward — each fine-tuning run reinforces failures.
