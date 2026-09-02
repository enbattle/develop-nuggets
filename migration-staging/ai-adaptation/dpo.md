## DPO: Direct Preference Optimization

After instruction fine-tuning, a model can follow instructions — but it may not produce the *kind* of responses users prefer. Preference optimization trains the model to favor responses that humans rate as better, without the complexity of full RLHF with PPO.

## What RLHF Is and Why PPO Is Hard

Standard RLHF (Reinforcement Learning from Human Feedback) has three stages:
1. Supervised fine-tuning (SFT) — the model learns to follow instructions
2. Train a reward model (RM) on human preference pairs
3. RL training with PPO — optimize the policy to maximize the reward model's score

PPO is notoriously difficult to implement: it requires maintaining 4 models simultaneously (policy, reference policy, reward model, value model), is sensitive to hyperparameters, and can collapse unpredictably.

## DPO: A Simpler Alternative

DPO (Rafailov et al., 2023) reformulates the preference learning objective so that you can directly optimize the language model on preference data without training a separate reward model.

The key insight: there's a closed-form mapping between the reward function that PPO optimizes and the optimal policy. DPO derives a classification loss directly on the policy, making training much simpler.

**DPO data format:**

```python
# Each training example is a triplet: prompt, chosen response, rejected response
training_example = {
    "prompt": "Explain quantum entanglement to a 10-year-old.",
    "chosen": "Imagine two magic coins that are connected...",   # preferred response
    "rejected": "Quantum entanglement is a phenomenon where quantum states...",  # less preferred
}
```

## Collecting Preference Data

**Human labelers:** Most expensive but most accurate. Show labelers pairs of responses and ask which is better on multiple dimensions (helpfulness, accuracy, safety).

**LLM-as-judge:** Use a frontier model to rank response pairs. Fast and cheap, but inherits the judge model's biases.

```python
import anthropic

client = anthropic.Anthropic()

def judge_preference(prompt: str, response_a: str, response_b: str) -> str:
    judge_response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{
            "role": "user",
            "content": f"""Compare these two responses to the prompt and choose the better one.

Prompt: {prompt}

Response A: {response_a}

Response B: {response_b}

Which is better overall? Consider accuracy, helpfulness, and clarity.
Answer with just 'A' or 'B' followed by a one-sentence reason."""
        }]
    )
    verdict = judge_response.content[0].text.strip()
    return "chosen" if verdict.startswith("A") else "rejected"


def build_preference_pair(prompt: str, response_a: str, response_b: str) -> dict:
    preference = judge_preference(prompt, response_a, response_b)
    if preference == "chosen":
        return {"prompt": prompt, "chosen": response_a, "rejected": response_b}
    else:
        return {"prompt": prompt, "chosen": response_b, "rejected": response_a}
```

**Self-play:** Generate multiple responses from the current model, score them, and use highest vs. lowest scoring as chosen/rejected pairs. Effective for continued refinement.

## DPO Training with TRL

```python
from trl import DPOConfig, DPOTrainer
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig, get_peft_model, TaskType
from datasets import Dataset

# Load SFT model (starting point for preference optimization)
model = AutoModelForCausalLM.from_pretrained("./sft-model")
model_ref = AutoModelForCausalLM.from_pretrained("./sft-model")  # frozen reference
tokenizer = AutoTokenizer.from_pretrained("./sft-model")

# Apply LoRA for efficient DPO
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
)
model = get_peft_model(model, lora_config)

# DPO training config
dpo_config = DPOConfig(
    beta=0.1,                    # KL divergence penalty — higher = stay closer to reference
    max_length=1024,
    max_prompt_length=512,
    per_device_train_batch_size=4,
    num_train_epochs=1,
    learning_rate=5e-7,          # DPO is sensitive to LR — start very small
    output_dir="./dpo-output",
)

# Dataset expects columns: prompt, chosen, rejected
dataset = Dataset.from_list(preference_pairs)

trainer = DPOTrainer(
    model=model,
    ref_model=model_ref,
    args=dpo_config,
    train_dataset=dataset,
    tokenizer=tokenizer,
)
trainer.train()
```

## DPO vs. PPO Trade-offs

| | DPO | PPO |
|---|-----|-----|
| **Complexity** | Simple — one training loop | High — 4 models, reward RL loop |
| **Stability** | Generally stable | Can collapse without careful tuning |
| **Quality ceiling** | Slightly lower in theory | Higher ceiling with enough tuning |
| **Data requirement** | Preference pairs only | Same + reward model training data |
| **Compute** | ~2× SFT cost | ~4–6× SFT cost |

For most teams, DPO delivers 80–90% of the quality benefit at 20% of the engineering complexity.

## GRPO: Group Relative Policy Optimization

DeepSeek R1's approach: instead of comparing chosen vs. rejected pairs, generate a **group** of responses to each prompt, compute their rewards (from a verifiable criterion like math correctness), and use their relative rankings within the group as the optimization signal.

GRPO doesn't require a separate reward model — it uses the group's outcomes to derive the training signal, making it especially suitable for tasks with verifiable correct answers.
