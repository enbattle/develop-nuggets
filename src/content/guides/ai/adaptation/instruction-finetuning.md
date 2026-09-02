Instruction fine-tuning teaches a model to follow instructions reliably — in a specific format, tone, or task domain. The quality of your training data is the single most important variable. A model fine-tuned on 500 excellent examples consistently outperforms one trained on 50,000 mediocre ones.

## What Instruction Fine-Tuning Is

Pre-trained language models generate plausible next tokens — they don't inherently follow instructions. Instruction fine-tuning (also called supervised fine-tuning, or SFT) trains the model on (instruction, ideal response) pairs to teach it to behave as an assistant rather than a text predictor.

The result is the behavioral shift you see between a raw base model and a chat model like Claude or GPT-4.

## Chat Templates

Models expect multi-turn training data in a specific chat template format. Using the wrong format produces a fine-tuned model that doesn't actually follow instructions because it wasn't trained with the right delimiters.

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3-8b-instruct")

# Llama 3 chat template
messages = [
    {"role": "system", "content": "You are a legal document analyst. Respond in precise, formal language."},
    {"role": "user", "content": "Summarize this contract clause: [clause text]"},
    {"role": "assistant", "content": "The clause establishes..."},
]

formatted = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=False,
)
# Produces: <|begin_of_text|><|start_header_id|>system<|end_header_id|>...
```

Always use the tokenizer's `apply_chat_template` method — never format manually.

## Data Collection Strategies

**Manual curation (highest quality)**
Human experts write ideal examples. Expensive, slow, but produces the best signal. Use for high-stakes domains (medical, legal, financial).

**LLM-assisted generation (scalable)**
Use a stronger model (Claude, GPT-4) to generate training examples from a seed set of instructions:

```python
import anthropic

client = anthropic.Anthropic()

def generate_training_example(instruction_seed: str) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        system="""You are generating training examples for a fine-tuned model.
For each instruction, produce an ideal, detailed response that demonstrates
expert-level performance on the task.""",
        messages=[{
            "role": "user",
            "content": f"Generate an ideal response for this instruction:\n{instruction_seed}"
        }]
    )
    return {
        "instruction": instruction_seed,
        "output": response.content[0].text
    }

# Generate examples from seed instructions
seeds = load_seed_instructions()
examples = [generate_training_example(seed) for seed in seeds]
```

**[Distillation](/guides/distillation) from a stronger model**
Fine-tune a smaller model to match the outputs of a larger one on your task distribution. Effective when you have a large model that does the task well but is too expensive to run in production.

## Data Quality Principles

**Quality over quantity.** 1,000 excellent examples routinely produce better results than 100,000 noisy ones. The model can't learn from ambiguous or incorrect demonstrations.

**Task diversity matters.** If all examples look the same, the model will overfit to that pattern. Vary the instruction phrasing, context length, and output style.

**Format consistency is critical.** The model learns to produce outputs that look like the training data. If your training outputs are inconsistent (sometimes JSON, sometimes prose), the model will be inconsistent too.

## Deduplication and Filtering

Near-duplicate examples waste compute and can cause the model to over-weight certain patterns:

```python
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def deduplicate_examples(examples: list[dict], threshold: float = 0.95) -> list[dict]:
    model = SentenceTransformer("all-MiniLM-L6-v2")
    texts = [ex["instruction"] for ex in examples]
    embeddings = model.encode(texts, show_progress_bar=True)

    keep = [True] * len(examples)
    sim_matrix = cosine_similarity(embeddings)

    for i in range(len(examples)):
        if not keep[i]:
            continue
        for j in range(i + 1, len(examples)):
            if sim_matrix[i][j] > threshold:
                keep[j] = False  # remove the later near-duplicate

    return [ex for ex, k in zip(examples, keep) if k]
```

## Building Your Eval Set

Before you start fine-tuning, set aside 10–20% of your curated examples as a held-out evaluation set. Never train on these. This is the only honest measure of whether fine-tuning actually improved performance.

```python
from sklearn.model_selection import train_test_split

train_examples, eval_examples = train_test_split(
    examples,
    test_size=0.15,
    random_state=42,
)

# Store eval set separately — treat it as ground truth
# Never look at it during data collection or training
```

## Final Data Format Example

```python
import json

def build_training_record(instruction: str, response: str) -> dict:
    return {
        "messages": [
            {
                "role": "system",
                "content": "You are a contract analysis assistant. Be precise and cite specific clauses."
            },
            {
                "role": "user",
                "content": instruction
            },
            {
                "role": "assistant",
                "content": response
            }
        ]
    }

# Save as JSONL — one record per line
with open("training_data.jsonl", "w") as f:
    for ex in train_examples:
        record = build_training_record(ex["instruction"], ex["output"])
        f.write(json.dumps(record) + "\n")
```
