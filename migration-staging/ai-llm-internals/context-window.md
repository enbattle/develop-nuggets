## Context Window

The context window is the maximum number of tokens an LLM can process in a single call — everything the model can "see" at once. It is a shared budget between input (system prompt, history, documents) and output (the generated response).

```
Total tokens = system_prompt + chat_history + retrieved_docs + user_query + output
             must be ≤ context window limit
```

Exceeding the limit causes the API to return an error or silently truncate. Silent truncation is dangerous in RAG — you may cut off the most relevant retrieved document without knowing.

## Current Context Sizes (2026)

| Model | Context | Notes |
|-------|---------|-------|
| Gemini 2.5 Pro | 2M tokens | Largest available |
| Claude Opus 4.x / Sonnet 4.6 | 1M tokens | High quality at 1M |
| GPT-4.1 | 1M tokens | OpenAI ecosystem |
| GPT-4o | 128K tokens | Stable feature set |
| Llama 3.1 70B (open-source) | 128K tokens | Self-hosted |
| DeepSeek V3 | 128K tokens | Cost-optimized |

**128K is the current baseline.** Any model with less than 128K context is considered limited for production use. 1M+ context is now available in top-tier models.

## Cost Implications

Every token in the context is charged on every API call. Constant tokens (system prompt, few-shot examples) are especially costly because they repeat across all requests:

```python
# Example: RAG query with Claude Sonnet 4.6
system_prompt_tokens   = 500
retrieved_docs_tokens  = 5000    # 5 chunks × ~1000 tokens each
user_query_tokens      = 50
output_tokens          = 400

total_input  = 5550   # tokens
total_output = 400

# Sonnet 4.6: $3.00/1M input, $15.00/1M output
input_cost  = (5550  / 1_000_000) * 3.00   # $0.0167
output_cost = (400   / 1_000_000) * 15.00  # $0.006
cost_per_query = 0.0227  # ~$0.023

# 10,000 queries/day → ~$227/day
# Cutting system prompt from 2000 → 500 tokens saves $45/day
```

**Minimize constant tokens.** Every token in the system prompt multiplies across every query. Trim ruthlessly.

## Strategies for Managing Context

### 1. RAG (most effective for knowledge)
Don't embed all documents — retrieve only the relevant chunks. Reduces context 10–100× compared to full-document stuffing.

### 2. Summarization Chains
For very long documents, summarize in passes before the final generation:

```python
import anthropic

def summarize_in_chunks(text: str, chunk_tokens: int = 4000) -> str:
    client = anthropic.Anthropic()
    words = text.split()
    chunk_size = chunk_tokens  # rough approximation: 1 token ≈ 0.75 words
    chunks = [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

    summaries = []
    for chunk in chunks:
        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=500,
            messages=[{"role": "user", "content": f"Summarize concisely:\n\n{chunk}"}]
        )
        summaries.append(resp.content[0].text)

    if len(summaries) == 1:
        return summaries[0]

    combined = "\n\n".join(summaries)
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{"role": "user", "content": f"Synthesize into a single summary:\n\n{combined}"}]
    )
    return resp.content[0].text
```

### 3. Conversation Trimming
Truncate or summarize old turns when a chat session grows long:

```python
def trim_history(messages: list, keep_last_n_turns: int = 10) -> list:
    system = [m for m in messages if m["role"] == "system"]
    turns  = [m for m in messages if m["role"] != "system"]
    return system + turns[-(keep_last_n_turns * 2):]  # keep N full exchanges
```

## Long Context vs RAG

| Approach | Pros | Cons | Use When |
|----------|------|------|---------|
| **Long context** | Simple, no retrieval infra | Expensive, context collapse risk | <20 documents, complex cross-doc reasoning |
| **RAG** | Scalable, cost-efficient | Retrieval quality ceiling | Large knowledge bases, >100 documents |
| **Hybrid** | Best of both | Most complex | Production at scale |

**Rule of thumb:** Fewer than 20 documents → long context is fine. More than 100 → use RAG. In between → benchmark both.
