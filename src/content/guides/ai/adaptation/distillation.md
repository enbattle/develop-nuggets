## Knowledge Distillation

Distillation trains a small "student" model to mimic a large "teacher" model. The goal: a 7B student that matches a 70B teacher on a specific task, running at 10× lower cost and latency.

## Teacher-Student Training

Standard supervised fine-tuning trains on hard labels: the correct answer gets reward 1, everything else gets reward 0. Distillation instead trains on **soft targets** — the full probability distribution that the teacher model produces over all tokens.

```
Hard labels (standard SFT):
  Token "Paris"  → reward 1.0
  Token "London" → reward 0.0
  Token "Berlin" → reward 0.0

Soft labels (distillation):
  Token "Paris"  → 0.87  (teacher is very confident)
  Token "France" → 0.06  (teacher considers this plausible)
  Token "London" → 0.04
  ...
```

Soft targets carry more information: they encode the teacher's uncertainty and what alternatives it considered reasonable. The student learns not just the right answer, but the teacher's reasoning distribution.

## KL Divergence Loss

The distillation objective is KL divergence between teacher and student output distributions:

```
L_distil = KL(p_teacher || p_student) = Σ p_teacher(t) × log(p_teacher(t) / p_student(t))
```

In practice, most implementations blend the distillation loss with the standard cross-entropy loss on ground truth labels:

```python
import torch
import torch.nn.functional as F

def distillation_loss(
    student_logits: torch.Tensor,
    teacher_logits: torch.Tensor,
    true_labels: torch.Tensor,
    temperature: float = 2.0,
    alpha: float = 0.7,  # weight for distillation vs. ground truth
) -> torch.Tensor:
    # Soft targets with temperature scaling (higher T = softer distribution)
    soft_targets = F.softmax(teacher_logits / temperature, dim=-1)
    soft_probs   = F.log_softmax(student_logits / temperature, dim=-1)

    distil_loss = F.kl_div(soft_probs, soft_targets, reduction="batchmean")
    distil_loss = distil_loss * (temperature ** 2)  # scale by T^2

    # Hard label loss
    ce_loss = F.cross_entropy(student_logits, true_labels)

    return alpha * distil_loss + (1 - alpha) * ce_loss
```

## Practical Distillation: Use the Teacher to Generate Data

When you can't access the teacher's logits directly (e.g., distilling from Claude via API), use **data synthesis distillation**: have the teacher generate training examples, fine-tune the student on those examples.

```python
import anthropic

client = anthropic.Anthropic()

def generate_distillation_dataset(
    task_description: str,
    input_examples: list[str],
    n_per_example: int = 3,
) -> list[dict]:
    """Use Claude as teacher to generate training data for a smaller student model."""
    training_data = []

    for input_text in input_examples:
        for _ in range(n_per_example):
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1000,
                system=f"You are an expert at: {task_description}. Provide thorough, accurate responses.",
                messages=[{"role": "user", "content": input_text}],
            )
            training_data.append({
                "input": input_text,
                "output": response.content[0].text,
            })

    return training_data

# Generate 5,000 teacher-authored examples
dataset = generate_distillation_dataset(
    task_description="extracting key information from legal contracts",
    input_examples=load_contract_snippets(),
)
# Then fine-tune a small open-source model on this dataset
```

## Speculative Decoding as Runtime Distillation

[Speculative decoding](/guides/speculative-decoding) uses a small draft model to propose tokens that a large model verifies. It rhymes with distillation at inference time — the draft model's predictions steer generation, giving you the throughput of the small model with the quality of the large one.

## When to Distill vs. Fine-Tune vs. Quantize

| Approach | Best For | Quality Trade-off |
|----------|----------|-------------------|
| **Distillation** | Shrinking teacher capability into smaller model | Minimal on target task |
| **Fine-tuning** | Teaching new behaviors to existing model | None (adds capability) |
| **Quantization** | Reducing memory footprint of existing model | Small degradation |
| **All three** | Production deployment | Combined benefits |

A common production pattern: distill a frontier model's task performance into a 7B model, then [quantize](/guides/quantization) that model to 4-bit for fast, cheap serving.
