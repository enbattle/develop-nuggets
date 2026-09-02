Context collapse (also called the "lost in the middle" problem) is the tendency of LLMs to give **disproportionately less attention to information in the middle** of a long context, even when that information is clearly relevant to the query.

## The Finding

In Liu et al. (2023) and subsequent research, LLMs were tested on multi-document QA where the answer document was placed at different positions in a 20-document context. Accuracy followed a **U-shaped curve**:

```
Accuracy
  │  ╲                              ╱
  │    ╲                          ╱
  │      ╲                      ╱
  │        ╲____________________╱
  └──────────────────────────────── Document position
           Start    Middle     End
          (High)    (Low)    (High)
```

**Accuracy drops 30–40%** when the answer document is in the middle of the context, even though the tokens are present in the input. The model is not "forgetting" — the information is there, but attention is poorly distributed.

## Root Cause

The effect is architectural. Modern LLMs use **Rotary Position Encodings (RoPE)**. RoPE introduces a long-term decay: dot-product similarity between distant token pairs decreases with distance. Combined with softmax normalization (which amplifies the highest scores), this creates:

- **Primacy bias** — tokens near position 0 receive high attention
- **Recency bias** — tokens near the current generation position receive high attention
- **Middle neglect** — tokens in the middle receive the least attention

This is an emergent property of how transformers are pre-trained, not a fixable bug in the traditional sense. Larger context windows make it worse, not better.

## Impact on RAG

In a standard RAG pipeline with k=5 retrieved chunks, naive concatenation produces:

```
[System prompt] [Chunk 1] [Chunk 2] [Chunk 3] [Chunk 4] [Chunk 5] [User query]

←── strong attention ──────────────────── weak attention ────── strong attention ──→
```

If the most relevant chunk lands in positions 2, 3, or 4, its contribution to the answer is significantly weaker. Naive insertion order (e.g., by retrieval score, highest first) places the best chunk at position 1 — which is correct — but puts the second-best at position 2, not at position 5 where it would also receive strong attention.

## Mitigations

### 1. Rerank, then arrange: best chunk first, second-best chunk last

```python
import voyageai

def retrieve_position_aware(
    query: str,
    candidates: list[str],
    top_k: int = 5
) -> list[str]:
    """Rerank and arrange chunks to fight lost-in-the-middle."""
    client = voyageai.Client()
    result = client.rerank(query, candidates, model="rerank-2.5", top_k=top_k)
    ranked = [r.document for r in result.results]

    if len(ranked) < 3:
        return ranked

    # Most relevant at position 0, second-most relevant at position -1
    reordered = [ranked[0]]          # strongest attention position
    reordered += ranked[2:]          # middle: least important chunks
    reordered.append(ranked[1])      # second-best also gets strong attention
    return reordered
```

### 2. Reduce k

More chunks = more middle = more collapse. Start at k=3. A well-ordered k=3 routinely outperforms a poorly ordered k=10.

### 3. Use smaller chunk sizes

Smaller chunks mean relevant information is shorter and less likely to span the neglected middle. Precise retrieval of small chunks beats approximate retrieval of large ones.

### 4. Decompose complex queries

Instead of retrieving 10 documents for one complex query, break it into sub-questions each answered with a focused 3-chunk context:

```python
import anthropic

def decompose_and_answer(complex_query: str, retrieve_fn) -> str:
    client = anthropic.Anthropic()

    # Step 1: generate focused sub-questions
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{
            "role": "user",
            "content": f"Break this into 3 focused sub-questions: {complex_query}\nReturn as a numbered list."
        }]
    )
    sub_questions = parse_numbered_list(resp.content[0].text)

    # Step 2: answer each sub-question with a small focused context
    sub_answers = []
    for sub_q in sub_questions:
        chunks = retrieve_fn(sub_q, k=3)        # small, focused context per sub-question
        context = "\n\n".join(chunks)
        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=300,
            messages=[{"role": "user", "content": f"Context:\n{context}\n\nQuestion: {sub_q}"}]
        )
        sub_answers.append(resp.content[0].text)

    # Step 3: synthesize with a small final context
    synthesis_input = "\n\n".join(f"Q: {q}\nA: {a}" for q, a in zip(sub_questions, sub_answers))
    resp = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=800,
        messages=[{"role": "user", "content": f"Synthesize a final answer to: {complex_query}\n\n{synthesis_input}"}]
    )
    return resp.content[0].text
```

### 5. Choose models with better long-context handling

Claude and Gemini 2.5 Pro show less pronounced U-curves in benchmarks — their training explicitly addresses position bias. But no model fully eliminates it.

## Summary Rules

1. **Always rerank** before inserting retrieved chunks
2. **Most relevant chunk at position 0** (start of context)
3. **Second-most relevant at position -1** (end of context, before the query)
4. **Keep k small** — 3–5 chunks beats 15 unless the task requires broad coverage
5. **Don't assume more context = better** — it often makes results worse
