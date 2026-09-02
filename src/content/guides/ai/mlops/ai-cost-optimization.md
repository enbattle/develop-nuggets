LLM API costs scale with two variables: tokens and price per token. Cost optimization means reducing one or both without compromising output quality.

For a typical AI product, the API bill dominates everything else, so that is where optimization starts:

```
API Calls (LLM)     60%  ████████████
Compute (GPU/CPU)   20%  ████
Storage             10%  ██
Data Transfer        5%  █
Monitoring           5%  █
```

## The Cost Formula

```
Cost per request = (input_tokens × input_price) + (output_tokens × output_price)

At claude-sonnet-4-6 pricing (approximate):
  Input: $3.00 / 1M tokens
  Output: $15.00 / 1M tokens

Example:
  500 input tokens + 200 output tokens
  = (500 × $0.000003) + (200 × $0.000015)
  = $0.0015 + $0.003 = $0.0045 per request
  = $4.50 per 1,000 requests
  = $4,500 per 1M requests (before caching)
```

## Optimization Hierarchy

**1. Right-size the model** (highest impact)

Not every task needs the most powerful model. Use capability tiers:

| Model | Use when | Relative cost |
|-------|----------|--------------|
| Claude Haiku 4.5 | Classification, extraction, formatting | 1× |
| Claude Sonnet 4.6 | Reasoning, generation, Q&A | 10× |
| Claude Opus 4.8 | Complex reasoning, hard problems | 50× |

Route requests to the cheapest model that meets quality requirements:

```python
def route_to_model(task_type: str, complexity: float) -> str:
    if task_type in ("classify", "extract", "format"):
        return "claude-haiku-4-5-20251001"
    elif complexity < 0.6:
        return "claude-sonnet-4-6"
    else:
        return "claude-opus-4-8"
```

**2. Prompt caching** (high impact for repeated content)

Cache stable system prompts, tool definitions, and retrieval context. Cached tokens cost 90% less than standard input tokens.

```python
# Before: $0.003 per request × 1M requests = $3,000
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=512,
    system=long_system_prompt,  # 2000 tokens, paid every request
    messages=[{"role": "user", "content": query}]
)

# After: pay once to write cache, 90% less on reads
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=512,
    system=[{"type": "text", "text": long_system_prompt,
             "cache_control": {"type": "ephemeral"}}],
    messages=[{"role": "user", "content": query}]
)
# Savings: 2000 tokens × $0.003/1K × 90% = $0.0054/request saved
# At 1M requests: $5,400/month saved from caching alone
```

**3. Output token control** (high impact)

Output tokens cost 5× more than input tokens. Constrain output length aggressively:

```python
# Bad: open-ended max_tokens
response = client.messages.create(model="claude-sonnet-4-6", max_tokens=4096, ...)

# Good: set max_tokens to match your actual need
response = client.messages.create(model="claude-sonnet-4-6", max_tokens=256, ...)

# Also: instruct the model to be brief in the prompt itself
system = "Respond in 2-3 sentences maximum. Be direct."
```

**4. Semantic caching** (high impact for repetitive queries)

Return cached answers for semantically similar queries without any LLM call:

```python
# If 30% of queries are repeats: 30% cost reduction with near-zero latency
cached = semantic_cache.get(query)
if cached:
    return cached  # $0 cost

response = generate_and_cache(query)
return response
```

**5. Batch API** (medium impact for non-interactive workloads)

The Batch API processes requests asynchronously for 50% cost reduction — suitable for evaluations, data processing, scheduled tasks:

```python
import anthropic

client = anthropic.Anthropic()

batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": f"item-{i}",
            "params": {
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 256,
                "messages": [{"role": "user", "content": item}]
            }
        }
        for i, item in enumerate(items_to_process)
    ]
)

# Poll for completion
import time
while (batch := client.messages.batches.retrieve(batch.id)).processing_status == "in_progress":
    time.sleep(60)
```

**6. Prompt compression** (lower impact, domain-specific)

Remove verbose phrasing without changing intent. "Please carefully analyze the following text and provide a comprehensive and detailed summary of all the key points" → "Summarize key points:". Saves 15–30% of prompt tokens.

## Monthly Cost Estimate Worksheet

```
Daily requests:          _________
Avg input tokens:        _________
Avg output tokens:       _________
Model:                   _________

Monthly cost (no optimization) =
  (daily_requests × 30) × (input_tokens × $input_price + output_tokens × $output_price)

Apply reductions:
  Model routing:         -40 to -80% if using Haiku for simple tasks
  Prompt caching:        -20 to -50% depending on cache hit rate
  Semantic caching:      -10 to -40% depending on query repetition
  max_tokens control:    -10 to -30% if currently open-ended
  Batch API:             -50% for async workloads

Conservative combined reduction: 60–80% from unoptimized baseline
```
