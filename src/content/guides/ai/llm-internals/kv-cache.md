The KV (Key-Value) cache is the memory structure that makes LLM [inference](/guides/inference) practical. Without it, generating a 100-token response would require 100 separate full forward passes through the model, each recomputing attention over the entire sequence from scratch.

## How Attention Works

Each transformer layer computes self-attention using three projections of each token:
- **Q (Query)** — "what information am I looking for?"
- **K (Key)** — "what do I contain?"
- **V (Value)** — "what should I return when matched?"

For autoregressive generation, each new token only needs to compute its own Q. The K and V tensors for all **previous tokens are already computed and unchanged** — so they can be cached.

```
Token 1: compute Q₁, K₁, V₁  →  cache K₁, V₁
Token 2: compute Q₂, K₂, V₂  →  cache K₂, V₂ | reuse cached K₁, V₁
...
Token N: compute Q_N only     →  reuse all cached K₁...K_{N-1}, V₁...V_{N-1}
                                  cache K_N, V_N for next step
```

**Without KV cache:** O(n²) compute per generated token.
**With KV cache:** O(n) compute per generated token.

## Memory Cost

KV cache memory grows linearly with sequence length:

```python
# KV cache size formula:
# 2 (K and V) × layers × kv_heads × head_dim × seq_len × bytes_per_element

# Example: Llama 3.1 8B at FP16
# 2 × 32 layers × 8 KV heads × 128 head_dim × 4096 tokens × 2 bytes = 536 MB per request
# At 8192 tokens: ~1.07 GB per request
# 100 concurrent users: ~107 GB — exceeds all consumer and most enterprise GPUs

# This is why memory, not compute, is the primary bottleneck for LLM serving
```

## Optimizations

### Multi-Query Attention (MQA) and Grouped-Query Attention (GQA)

Share K and V heads across multiple Q heads. Used in Llama 3, Mistral, Qwen, and virtually all modern models.

```
MHA: 32 Q heads, 32 K heads, 32 V heads  →  full KV cache
GQA: 32 Q heads, 8 K heads, 8 V heads   →  4× smaller KV cache  (Llama 3 default)
MQA: 32 Q heads, 1 K head,  1 V head    →  32× smaller KV cache (some quality loss)
```

GQA is the standard choice in 2026. It gives near-MHA quality with a 4–8× reduction in KV cache memory.

### Prefix Caching

System prompts are identical across many requests. Pre-compute and cache their K/V tensors once:

```python
from vllm import LLM, SamplingParams

# Enable prefix caching at server startup
llm = LLM(model="meta-llama/Llama-3.1-8B-Instruct", enable_prefix_caching=True)

SYSTEM_PROMPT = "You are a helpful assistant for Acme Corp..."  # same for all requests

# First request: computes K/V for system prompt, stores in cache
# Subsequent requests with same system prompt: skip prefill for those tokens
# Result: TTFT drops from ~500ms to ~50ms for prompts with long shared prefixes
```

SGLang's **RadixAttention** extends this further — it treats the entire KV cache as a radix tree, enabling efficient sharing of any common prefix across concurrent requests. This is especially powerful for few-shot examples, tool definitions, and agentic loops where the same long context is reused repeatedly.

### PagedAttention (vLLM)

The standard OS virtual memory trick applied to KV cache. Stores KV tensors in non-contiguous memory **pages** (blocks) rather than requiring one large contiguous allocation per request.

Benefits:
- Eliminates memory fragmentation (which wastes 20–40% of GPU memory in naive implementations)
- Enables much larger effective batch sizes on the same hardware
- Supports memory sharing between requests with common prefixes (similar to copy-on-write pages)

### Flash Attention 2 / 3

Reorganizes the attention computation to maximize SRAM reuse and minimize round-trips to high-bandwidth memory (HBM). **Does not change the mathematical result** — pure implementation optimization.

Results:
- 2–4× faster attention computation
- O(n) memory instead of O(n²) for intermediate attention matrices
- Required for long-context inference (>32K tokens)
- Enabled by default in vLLM, SGLang, and modern HuggingFace Transformers

## Practical Implications

| Scenario | Problem | Solution |
|----------|---------|---------|
| Long system prompts | High TTFT, high memory per request | Enable prefix caching |
| Many concurrent users | GPU memory exhausted | PagedAttention, reduce `max_model_len` |
| >64K token contexts | Attention too slow | Flash Attention 2/3, GQA models |
| Edge / CPU deployment | Memory too large | Quantize KV cache to INT8, use MQA models |
| Agentic loops with shared context | Repeated prefill cost | SGLang RadixAttention |
