Content moderation for AI systems screens inputs and outputs to prevent harmful content from flowing through your application. Effective moderation requires balancing precision (avoiding false positives that block legitimate use) with recall (catching actual violations).

## Classifier-Based Moderation

The standard approach uses a specialized classifier model to evaluate content against a safety taxonomy. The classifier runs as a separate call, in parallel with or before the main LLM call.

```
User Input
    ├── [Classifier] ← fast, cheap
    │       │
    │    SAFE?  NO → reject / modify
    │       │ YES
    ▼
LLM Call
    ├── [Classifier]  ← check output too
    │       │
    │    SAFE?  NO → fallback / retry
    │       │ YES
    ▼
User Response
```

## Llama Guard as a Moderation Classifier

Meta's Llama Guard models are fine-tuned for content safety classification. They produce a `safe` / `unsafe` verdict with category labels:

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class LlamaGuardModerator:
    def __init__(self):
        model_id = "meta-llama/Llama-Guard-3-8B"
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype=torch.bfloat16,
            device_map="auto",
        )

    def check(self, messages: list[dict]) -> dict:
        formatted = self.tokenizer.apply_chat_template(
            messages, tokenize=False, add_generation_prompt=True
        )
        inputs = self.tokenizer(formatted, return_tensors="pt").to(self.model.device)

        with torch.no_grad():
            output = self.model.generate(**inputs, max_new_tokens=50, do_sample=False)

        result = self.tokenizer.decode(
            output[0][inputs["input_ids"].shape[-1]:],
            skip_special_tokens=True
        ).strip()

        is_safe = result.lower().startswith("safe")
        category = None if is_safe else result.split("\n")[-1] if "\n" in result else result

        return {"is_safe": is_safe, "category": category, "raw": result}

moderator = LlamaGuardModerator()

def moderated_response(user_message: str, llm_response: str) -> dict:
    # Check input
    input_check = moderator.check([{"role": "user", "content": user_message}])
    if not input_check["is_safe"]:
        return {
            "blocked": True,
            "reason": f"Input flagged: {input_check['category']}",
            "response": None,
        }

    # Check output
    output_check = moderator.check([
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": llm_response},
    ])
    if not output_check["is_safe"]:
        return {
            "blocked": True,
            "reason": f"Output flagged: {output_check['category']}",
            "response": None,
        }

    return {"blocked": False, "response": llm_response}
```

## Threshold Tuning: Precision vs. Recall

Most classifiers have a configurable confidence threshold. The right threshold depends on your use case:

| Use Case | Recommended Bias | Threshold |
|----------|-----------------|-----------|
| Children's platform | High recall (catch everything) | Low threshold |
| Enterprise productivity | High precision (minimize false blocks) | High threshold |
| Medical information | High recall for dangerous advice | Low for safety categories |
| Creative writing | High precision | High threshold |

Always tune thresholds on a labeled holdout set from your specific application — not just the classifier's default.

## Multi-Tier Moderation

A single expensive classifier on every message is slow and costly. Tier the approach:

```python
import anthropic

client = anthropic.Anthropic()

def tiered_moderation(user_message: str) -> dict:
    # Tier 1: Fast regex / keyword check (< 1ms)
    if contains_obvious_violation(user_message):
        return {"action": "block", "tier": 1, "reason": "keyword_match"}

    # Tier 2: Fast classifier model (e.g., Llama Guard, ~50ms)
    tier2_result = fast_classifier.check(user_message)
    if not tier2_result["is_safe"] and tier2_result["confidence"] > 0.9:
        return {"action": "block", "tier": 2, "reason": tier2_result["category"]}

    # Tier 3: LLM-as-judge for edge cases flagged by tier 2 with low confidence
    if not tier2_result["is_safe"] and tier2_result["confidence"] <= 0.9:
        judge_result = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=100,
            messages=[{
                "role": "user",
                "content": f"Is this message safe to process in an enterprise productivity tool? "
                           f"Reply with SAFE or UNSAFE and a one-sentence reason.\n\n{user_message}"
            }]
        )
        verdict = judge_result.content[0].text
        if "UNSAFE" in verdict:
            return {"action": "block", "tier": 3, "reason": verdict}

    return {"action": "allow"}
```

## Human Escalation

Some content requires human judgment — a classifier isn't sufficient. Build a human escalation path for:
- High-confidence violations that need documentation (potential legal exposure)
- Low-confidence flags where the stakes are high (medical, financial advice)
- Appeals from users who believe they were incorrectly blocked

```python
def escalate_to_human(user_message: str, flag_reason: str, user_id: str):
    escalation_ticket = {
        "message": user_message,
        "flag_reason": flag_reason,
        "user_id": user_id,
        "timestamp": datetime.utcnow().isoformat(),
        "priority": classify_escalation_priority(flag_reason),
    }
    # Send to moderation queue (Slack, ticketing system, etc.)
    moderation_queue.push(escalation_ticket)
    return {"queued_for_review": True, "estimated_review_time": "24 hours"}
```
