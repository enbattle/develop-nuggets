## Naive RAG vs Production RAG

A naive pipeline that demos well tends to break on the first ambiguous query or messy document. Most of that gap is a handful of additions, covered in depth in [Advanced RAG Techniques](/guides/improvements-and-advanced).

## What Changes at Scale

| Aspect | Naive RAG | Production RAG |
|--------|-----------|----------------|
| **Chunking** | Fixed-size word split | Structure-aware, overlap-optimized |
| **Query** | Raw user input | Optimized, expanded, or rewritten |
| **Search** | Cosine similarity only | Hybrid (semantic + keyword) |
| **Results** | Top-k straight to LLM | Re-ranked, filtered by threshold |
| **Monitoring** | None | Latency, faithfulness, user feedback |
| **Error handling** | None | Retries, fallbacks, graceful degradation |

## Naive RAG Pipeline

```
Query → Embed → Top-K → LLM → Answer
```

Simple, fast to build, works for demos and small controlled datasets. Breaks under:
- Ambiguous queries
- Large or diverse knowledge bases
- Mixed document types
- High precision requirements

## Production RAG Pipeline

```
Query
  → Query Optimization (rewrite / expand)
  → Hybrid Search (semantic + BM25)
  → Re-ranking (cross-encoder)
  → Threshold filtering
  → Context assembly
  → LLM (with citations)
  → Post-processing
  → Answer + Sources
```

## Key Production Additions

### Query Optimization
```python
def optimize_query(query: str) -> list[str]:
    """Generate multiple query variants to improve recall."""
    prompt = f"""Generate 3 different phrasings of this question for search:

Original: {query}

Return as a JSON list of 3 strings."""

    # Returns ["original", "variant 1", "variant 2"]
    # Search with all, merge results
```

### Hybrid Search
```python
from rank_bm25 import BM25Okapi

# Combine semantic and keyword scores
semantic_score = cosine_similarity(q_embedding, doc_embedding)
keyword_score = bm25.get_scores(query_tokens)

combined = 0.7 * semantic_score + 0.3 * keyword_score
```

### Re-ranking
```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
scores = reranker.predict([[query, doc] for doc in candidates])
```

### Monitoring
```python
# Log every request
log_entry = {
    "query": query,
    "retrieved_docs": docs,
    "answer": answer,
    "latency_ms": latency,
    "timestamp": datetime.now().isoformat()
}
```

## Migration Checklist: Naive → Production

- [ ] Add sentence-aware chunking with proper overlap
- [ ] Implement hybrid search (semantic + BM25)
- [ ] Add re-ranking with a cross-encoder
- [ ] Add similarity threshold filtering
- [ ] Set up latency and error monitoring
- [ ] Build eval dataset and run weekly
- [ ] Add source attribution to answers
- [ ] Implement retry logic for API failures
