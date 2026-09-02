## Tokenization

Before an LLM processes text, a tokenizer converts the raw string into integer token IDs. The model sees only these IDs — never individual characters or words. Token boundaries affect what the model can "see" and directly determine cost.

## Byte-Pair Encoding (BPE)

The dominant tokenization algorithm. BPE builds a vocabulary by merging the most frequent adjacent byte pairs iteratively:

```
Start: every byte is its own token (256 tokens)

Round 1: "th" appears 50,000 times — merge into single token "th"
Round 2: "he" appears 45,000 times — merge into single token "he"
Round 3: "the" appears 40,000 times — merge "th"+"e" → "the"
...continue until vocabulary reaches target size (e.g., 100K tokens)
```

Result: common English words get single tokens ("the", "ing", "tion"), rare words split into subword tokens, and unknown characters fall back to individual bytes.

## Why Token Boundaries Matter

The classic example: counting letters in "strawberry" often fails because the model sees tokens like `["straw", "berry"]`, not individual characters. It has no direct access to the internal structure of each token.

```python
import anthropic

client = anthropic.Anthropic()

# Count tokens to understand how a string is tokenized
response = client.messages.count_tokens(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "strawberry"}]
)
print(response.input_tokens)  # 2 tokens: ["straw", "berry"]
# The model sees 2 opaque token IDs — it cannot directly see 'r' appears 3 times
```

Other token boundary effects:
- **Large numbers**: "1234567" → ["123", "456", "7"] — arithmetic requires multi-token reasoning
- **Code vs. prose**: Python keywords, operators, and common identifiers have dedicated tokens; code is often more efficient per semantic unit than English
- **Whitespace**: indentation in Python (4 spaces) may tokenize differently from a tab, with downstream effects on code generation

## Token Count Estimation

```python
import anthropic

client = anthropic.Anthropic()

def count_tokens(messages: list, model: str = "claude-sonnet-4-6") -> int:
    """Exact token count from the API — use this for billing estimates."""
    response = client.messages.count_tokens(model=model, messages=messages)
    return response.input_tokens

# Rough heuristics (use count_tokens for precision):
# English prose:         ~1.3 tokens/word  (~0.75 words/token)
# Python code:           ~1.5–2 tokens/word
# JSON/structured data:  ~2 tokens/word (punctuation adds tokens)
# Chinese/Japanese:      1.5–3× English for equivalent meaning
# Arabic/Hebrew:         1.5–2× English
```

## Cross-Model Tokenizer Differences

Every model family uses a different tokenizer with a different vocabulary. The same string can have different token counts in different models:

| Text | Claude Sonnet | GPT-4o | Llama 3.1 |
|------|--------------|--------|-----------|
| "tokenization" | 3 tokens | 3 tokens | 4 tokens |
| "2024-01-15" | 4 tokens | 6 tokens | 5 tokens |
| "\n\n\n" (3 newlines) | 1 token | 3 tokens | 3 tokens |

This matters when migrating between models (a prompt that "fits in 8K context" for one model may not for another), and when reproducing exact [context window](/guides/context-window) calculations from another model's documentation.

## Practical Implications

**Cost estimation**: always use `count_tokens()` before estimating per-request cost for prompts with variable-length dynamic content. The heuristics above can be off by 20–40% on code-heavy or non-English content.

**Non-English text is more expensive**: languages with less representation in the training corpus have lower vocabulary coverage. A customer support system handling Japanese queries may use 2–3× the tokens of an English equivalent — a significant cost multiplier.

**Prompt compression**: replacing verbose English phrasing with structured, keyword-dense text reduces token count with no quality loss. "Please carefully analyze the following passage and provide a comprehensive summary:" (16 tokens) → "Summarize:" (2 tokens).
