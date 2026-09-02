## Model Merging

Model merging combines the weights of two or more fine-tuned models without additional training. The goal: a merged model that's better at multiple tasks than any individual model, without the cost of re-training.

## Why Merge Models?

Training a model to be good at multiple tasks simultaneously (multitask fine-tuning) requires data and compute for all tasks at once. Merging lets you:
- Fine-tune specialist models independently
- Combine their weights to create a generalist
- Experiment with different capability combinations cheaply

## Linear Interpolation (Weight Averaging)

The simplest merge: take the weighted average of two models' parameters.

```python
import torch
from transformers import AutoModelForCausalLM

def merge_models_linear(
    model_a_path: str,
    model_b_path: str,
    weight_a: float = 0.5,
) -> AutoModelForCausalLM:
    model_a = AutoModelForCausalLM.from_pretrained(model_a_path)
    model_b = AutoModelForCausalLM.from_pretrained(model_b_path)

    weight_b = 1.0 - weight_a
    merged_state_dict = {}

    for key in model_a.state_dict():
        param_a = model_a.state_dict()[key].float()
        param_b = model_b.state_dict()[key].float()
        merged_state_dict[key] = weight_a * param_a + weight_b * param_b

    model_a.load_state_dict(merged_state_dict)
    return model_a
```

Linear interpolation works best when both models were fine-tuned from the **same base model**. It degrades significantly when merging models with different architectures or base models.

## Task Vectors

A task vector is the difference between a fine-tuned model's weights and the base model's weights. It encodes "what was learned during fine-tuning":

```python
def compute_task_vector(base_model, finetuned_model):
    """Task vector = fine-tuned weights - base weights"""
    task_vector = {}
    for key in base_model.state_dict():
        task_vector[key] = (
            finetuned_model.state_dict()[key].float() -
            base_model.state_dict()[key].float()
        )
    return task_vector

def apply_task_vectors(base_model, task_vectors: list[dict], scaling: float = 1.0):
    """Add multiple task vectors to a base model"""
    new_state = {}
    for key in base_model.state_dict():
        combined_vector = sum(tv[key] for tv in task_vectors)
        new_state[key] = base_model.state_dict()[key].float() + scaling * combined_vector
    base_model.load_state_dict(new_state)
    return base_model
```

Task vector arithmetic: you can add capabilities (positive scaling), subtract them (negative scaling), or blend multiple fine-tunes at different strengths.

## TIES-Merging: Resolving Sign Conflicts

When merging multiple task vectors, parameters often have opposing signs — one model wants to increase a weight while another wants to decrease it. TIES (Trim, Elect Sign, Disjoint Merge) resolves this:

1. **Trim**: Zero out small task vector values (likely noise)
2. **Elect Sign**: For each parameter, count how many models have positive vs. negative delta — use the majority sign
3. **Disjoint Merge**: Average only the models that agree on the elected sign

This produces significantly better merged models than naive weight averaging on multi-task scenarios.

## DARE: Pruning Before Merging

DARE (Drop And REscale) randomly zeroes out a large fraction of task vector parameters before merging, then rescales the remaining ones. The intuition: task vectors are redundant — most parameters don't need to be updated. Dropping them reduces interference between merged models.

## When Merging Is and Isn't Useful

**Merging works well when:**
- Both models were fine-tuned from the same base model
- The capabilities are somewhat related or complementary
- You can't afford to re-train a multitask model

**Merging produces worse results when:**
- Models were trained on conflicting objectives (the merge "averages out" what was learned)
- Models have different architectures or base weights
- One task requires very different weight patterns than the other

A merged model is almost always worse than the best individual model on any single task — the value is breadth, not depth. If you need peak performance on one task, use the specialist model.
