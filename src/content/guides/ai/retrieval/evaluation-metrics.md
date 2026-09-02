Without measurement you can't identify failures, compare approaches, or track improvements.

## Retrieval Metrics

### Context Precision
Are retrieved documents actually relevant?

```
Context Precision = Relevant Retrieved / Total Retrieved
```
*Target: >0.8. If 4 of 5 retrieved docs are relevant → 80%.*

### Context Recall
Did we retrieve all relevant documents from the knowledge base?

```
Context Recall = Relevant Retrieved / Total Relevant in DB
```
*Target: >0.7.*

## Generation Metrics

### Faithfulness
Is every claim in the answer supported by the retrieved context? This is usually scored with an LLM judge: pass it the answer and the retrieved chunks, and ask whether each sentence is grounded.

## System Metrics

### Latency — Track per request
| Stage | Typical | Target |
|-------|---------|--------|
| Embedding query | 10–100ms | <50ms |
| Vector search | 10–200ms | <100ms |
| LLM generation | 1–5s | <3s |
| **Total** | **1.5–6s** | **<2s** |

```python
import time

def query_with_timing(question: str):
    t0 = time.time()
    q_embedding = embed_model.encode(question)
    t1 = time.time()
    results = collection.query(query_embeddings=[q_embedding.tolist()], n_results=5)
    t2 = time.time()
    answer = generate_answer(question, results['documents'][0])
    t3 = time.time()

    return answer, {"embed": t1-t0, "search": t2-t1, "gen": t3-t2, "total": t3-t0}
```

## Building an Eval Dataset

```python
eval_data = [
    {
        "question": "What is the capital of France?",
        "expected": "Paris",
        "relevant_doc_ids": ["doc_1"],
        "should_contain": ["Paris"]
    },
    # Add 50–100 examples covering your real use cases
]
```

## Target Thresholds

| Metric | Good | Warning |
|--------|------|---------|
| Context Precision | >80% | <50% |
| Context Recall | >70% | <40% |
| Faithfulness | >95% | <70% |
| Answer Relevancy | >85% | <60% |
| Latency (total) | <2s | >5s |

## Quick Start Checklist

- [ ] Track latency on every query
- [ ] Add thumbs up/down user feedback
- [ ] Sample 50 queries weekly for faithfulness check
- [ ] Sample 50 queries weekly for context precision
