## LoRA and QLoRA

Full fine-tuning updates all model parameters — for a 70B model, that's 70 billion floats to store, compute gradients for, and update. Most teams don't have that hardware. LoRA (Low-Rank Adaptation) makes fine-tuning tractable by updating only a tiny fraction of the parameters.

## Why Full Fine-Tuning Is Impractical

A 7B parameter model in 16-bit precision requires ~14GB just to store the weights. Fine-tuning also needs optimizer states (Adam stores 2 copies of every gradient), which multiplies memory requirements by 3–4×. Fine-tuning a 7B model requires 40–80GB of GPU memory. A 70B model requires 400–800GB — that's a cluster, not a workstation.

## LoRA: Low-Rank Matrix Decomposition

LoRA observes that during fine-tuning, weight updates tend to be **low-rank** — most of the information is in a small subspace. Instead of updating the full weight matrix W, LoRA adds two small matrices A and B:

```
Original: W (d × k matrix) — frozen during training
LoRA adds: W + ΔW, where ΔW = B × A
  A is (r × k), B is (d × r), where r << d, k

Memory saved: instead of d×k parameters, train only r×(d+k) parameters
For r=8, d=4096, k=4096: 8×8192 = 65536 vs 16,777,216 — 256× fewer parameters
```

## Key LoRA Hyperparameters

| Parameter | Effect | Typical Value |
|-----------|--------|---------------|
| **rank (r)** | Size of the low-rank approximation. Higher = more expressiveness, more memory | 8–64 |
| **alpha** | Scaling factor for the LoRA update (often set to 2× rank) | 16–128 |
| **target_modules** | Which weight matrices to apply LoRA to | q_proj, v_proj (attention) |
| **dropout** | Regularization to prevent overfitting | 0.05–0.1 |

## QLoRA: LoRA on a Quantized Model

QLoRA (Dettmers et al., 2023) combines LoRA with 4-bit quantization. The base model is loaded in 4-bit NF4 format (cutting memory by 4×), and LoRA adapters are trained in 16-bit precision on top of the frozen quantized base.

This means you can fine-tune a 70B parameter model on a single 48GB GPU — something that was impossible before QLoRA.

```python
# QLoRA setup: bitsandbytes + PEFT + transformers
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, TaskType
import torch

# 4-bit quantization config
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",       # NormalFloat4 — better for LLMs
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,  # nested quantization for extra memory savings
)

# Load quantized base model
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3-8b-hf",
    quantization_config=bnb_config,
    device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3-8b-hf")

# LoRA config — target attention projection matrices
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,               # rank
    lora_alpha=32,      # scaling: alpha/r = 2 is a common heuristic
    lora_dropout=0.05,
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",  # attention
        "gate_proj", "up_proj", "down_proj",       # MLP
    ],
    bias="none",
)

# Wrap model with LoRA
peft_model = get_peft_model(model, lora_config)
peft_model.print_trainable_parameters()
# Output: trainable params: 83,886,080 || all params: 8,111,570,944 || trainable%: 1.03%
```

## NF4 Quantization

NF4 (NormalFloat 4-bit) is QLoRA's key insight: LLM weights follow a roughly normal distribution. Mapping that distribution to 4 bits using a quantization scheme designed for normal distributions (rather than uniform quantization) preserves more information per bit.

## DoRA: Weight Decomposition

DoRA (Liu et al., 2024) extends LoRA by decomposing the weight matrix into magnitude and direction components, then applying LoRA only to the direction. This improves training stability and often produces slightly better fine-tuning results than LoRA alone, especially for instruction following.

## Full Training Loop

```python
from transformers import TrainingArguments, Trainer
from datasets import Dataset

# Prepare dataset
def format_example(example):
    return {
        "text": f"### Instruction:\n{example['instruction']}\n\n### Response:\n{example['output']}"
    }

dataset = Dataset.from_list(training_examples).map(format_example)

# Training arguments
training_args = TrainingArguments(
    output_dir="./qlora-output",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,       # effective batch = 16
    warmup_ratio=0.03,
    learning_rate=2e-4,
    fp16=False,
    bf16=True,
    logging_steps=10,
    save_strategy="epoch",
    optim="paged_adamw_32bit",           # memory-efficient optimizer for QLoRA
    report_to="none",
)

trainer = Trainer(
    model=peft_model,
    args=training_args,
    train_dataset=dataset,
    tokenizer=tokenizer,
)
trainer.train()

# Save only the LoRA adapters (much smaller than full weights)
peft_model.save_pretrained("./lora-adapters")
```

After training, the adapter weights (typically 10–100MB) can be merged back into the base model or kept separate and loaded on demand.
