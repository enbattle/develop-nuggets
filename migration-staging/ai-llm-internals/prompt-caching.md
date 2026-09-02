## Prompt Caching

Anthropic's prompt caching is a server-side feature that stores the computed KV state of a prompt prefix and reuses it across requests. When the same prefix arrives again within the TTL, the model skips recomputation entirely — reducing cost and TTFT for prompts with stable content.

This is distinct from vLLM prefix caching or SGLang's RadixAttention, which cache at the self-hosted serving layer. Anthropic's prompt caching works through the managed API.

## The cache_control Parameter

Mark stable content with `cache_control: { type: "ephemeral" }`. The API caches the KV tensors for everything up to and including that breakpoint.

```python
import anthropic

client = anthropic.Anthropic()

SYSTEM_PROMPT = """You are an expert assistant for Acme Corp.
[... 2000 tokens of company context, product docs, FAQs ...]"""

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"}   # Cache this prefix
        }
    ],
    messages=[{"role": "user", "content": user_query}]
)

# Inspect cache usage
print(response.usage.cache_creation_input_tokens)  # Written to cache (first call)
print(response.usage.cache_read_input_tokens)       # Served from cache (subsequent calls)
```

## Pricing

| Token type | Cost vs standard input |
|-----------|----------------------|
| Cache write | 25% more (one-time cost to populate cache) |
| Cache read | 90% less (cost on cache hit) |
| Standard input | 1× baseline |

A 2,000-token system prompt repeated 10,000 times/day: cache reads save ~$54/day at Sonnet pricing vs. a one-time write cost of ~$0.008 per 5-minute window.

## TTL and Cache Behavior

- **TTL**: 5 minutes. Resets on every cache hit — steady traffic keeps the cache warm indefinitely.
- **Minimum cacheable prefix**: 1,024 tokens (Sonnet/Opus), 2,048 tokens (Haiku). Shorter content is not cached.
- **Up to 4 cache breakpoints** per request, in system prompt and/or user messages.

## Optimal Content Structure

Put stable, large content first — dynamic content last:

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": system_instructions,              # Stable
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": tool_definitions,         # Stable
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": few_shot_examples,        # Stable
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": user_query                # Dynamic — no cache
                }
            ]
        }
    ]
)
```

**Rule**: stable content first, dynamic content last. The cache breakpoint must precede the first dynamic token. Content after the final breakpoint is always recomputed.

Good candidates to cache: large system prompts, tool definitions, few-shot examples, retrieved documents for RAG.

## When NOT to Cache

- **Short prefixes** (< 1,024 tokens) — below the minimum, `cache_control` is silently ignored
- **Frequently changing "stable" content** — low hit rate means write costs with no benefit
- **One-off requests** — a single call never hits its own cache; benefit only comes from the second call onward
