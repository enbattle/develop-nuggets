## RAG Fusion

A single query is a single perspective. "What are the best practices for error handling in Python?" retrieves documents matching that exact phrasing — but misses material phrased as "Python exception management," "handling runtime errors," or "try/except patterns."

RAG Fusion addresses this with **query expansion + rank fusion**: generate multiple query variants, retrieve independently for each, then merge the result lists using Reciprocal Rank Fusion (RRF).

## Pipeline

```python
import anthropic
from anthropic import Anthropic

client = Anthropic()

def generate_query_variants(original_query: str, n: int = 4) -> list[str]:
    """Generate semantically diverse query reformulations."""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"""Generate {n} different search queries that would help answer this question.
Each query should approach the question from a different angle or use different terminology.
Return ONLY the queries, one per line.

Question: {original_query}"""
        }]
    )
    lines = response.content[0].text.strip().split("\n")
    return [original_query] + [l.strip() for l in lines if l.strip()][:n]


def reciprocal_rank_fusion(
    ranked_lists: list[list[str]],
    k: int = 60
) -> list[tuple[str, float]]:
    """
    RRF: score(doc) = Σ 1/(k + rank(doc, list))
    k=60 is the standard constant that dampens rank sensitivity
    """
    scores: dict[str, float] = {}
    for ranked_list in ranked_lists:
        for rank, doc_id in enumerate(ranked_list, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)

    return sorted(scores.items(), key=lambda x: x[1], reverse=True)


def rag_fusion_retrieve(query: str, retriever, top_k: int = 10) -> list[str]:
    variants = generate_query_variants(query, n=4)

    # Retrieve for each variant
    all_results = []
    for variant in variants:
        results = retriever.search(variant, top_k=top_k)
        all_results.append([r.id for r in results])

    # Fuse rankings
    fused = reciprocal_rank_fusion(all_results)
    top_doc_ids = [doc_id for doc_id, _ in fused[:top_k]]

    return top_doc_ids
```

## Why Reciprocal Rank Fusion Works

RRF rewards documents that appear **consistently across multiple query variants** even if they aren't ranked #1 in any single list. A document at rank 3 in all 4 lists scores higher than a document ranked #1 in one list and absent in the rest.

```
Document A: rank 1 in list 1 only       → RRF ≈ 1/(60+1) = 0.016
Document B: rank 3 in all 4 lists       → RRF ≈ 4×(1/(60+3)) = 0.063
RRF prefers B — it's consistently relevant, not a fluke retrieval
```

## Performance

On BEIR (Benchmarking Information Retrieval) suite:

| Method | NDCG@10 |
|--------|---------|
| Single vector retrieval | 0.431 |
| BM25 | 0.408 |
| RAG Fusion (4 queries + RRF) | 0.471 |
| HyDE + RAG Fusion | 0.489 |

~9% improvement over single-query retrieval at the cost of 4× the retrieval calls and 1 LLM expansion call.

## Cost / Latency Trade-off

| Queries | LLM calls | Retrieval calls | Typical latency | NDCG@10 |
|---------|----------|----------------|----------------|---------|
| 1 | 0 | 1 | 50ms | 0.431 |
| 2 | 1 | 2 | 150ms | 0.451 |
| 4 | 1 | 4 | 250ms | 0.471 |
| 8 | 1 | 8 | 450ms | 0.479 |

Diminishing returns beyond 4 queries; 4 is the recommended default.
