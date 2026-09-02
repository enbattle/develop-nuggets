## Semantic Caching

Exact-match caching (Redis, Memcached) returns a cached result when the query string matches exactly. In practice, users ask the same question in slightly different ways: "What's your refund policy?" vs "How do I get a refund?" vs "Can I return this item?" All three questions have the same answer — but only one can match a cached key.

Semantic caching maps queries to their embeddings and returns cached answers for any new query whose embedding is within a cosine similarity threshold of an existing cached query.

## Implementation

```python
import anthropic
import voyageai
import numpy as np
import time
from dataclasses import dataclass

voy = voyageai.Client()
client = anthropic.Anthropic()

@dataclass
class CacheEntry:
    query: str
    embedding: np.ndarray
    response: str
    timestamp: float

class SemanticCache:
    def __init__(self, threshold: float = 0.95, ttl_seconds: int = 3600):
        self.threshold = threshold
        self.ttl_seconds = ttl_seconds
        self.entries: list[CacheEntry] = []

    def _embed(self, text: str) -> np.ndarray:
        result = voy.embed([text], model="voyage-4-large")
        return np.array(result.embeddings[0])

    def get(self, query: str) -> str | None:
        q_emb = self._embed(query)
        now = time.time()

        best_sim, best_entry = -1.0, None
        for entry in self.entries:
            if now - entry.timestamp > self.ttl_seconds:
                continue
            sim = float(np.dot(q_emb, entry.embedding) /
                       (np.linalg.norm(q_emb) * np.linalg.norm(entry.embedding)))
            if sim > best_sim:
                best_sim, best_entry = sim, entry

        if best_sim >= self.threshold:
            return best_entry.response
        return None

    def set(self, query: str, response: str) -> None:
        emb = self._embed(query)
        self.entries.append(CacheEntry(query, emb, response, time.time()))


cache = SemanticCache(threshold=0.95)

def answer_query(query: str) -> str:
    if cached := cache.get(query):
        return cached

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": query}]
    )
    answer = response.content[0].text
    cache.set(query, answer)
    return answer
```

## Threshold Calibration

The similarity threshold controls the precision/recall trade-off of the cache:

| Threshold | Behavior |
|-----------|----------|
| 0.98+ | Near-identical queries only. High precision, low hit rate. |
| 0.95 (default) | Paraphrases of the same intent. Good balance for Q&A. |
| 0.90 | Related but distinct questions may hit. Risk of wrong answers. |
| 0.85 | Semantically related topics. Only for very stable knowledge bases. |

Test with your specific domain's query distribution. Some domains (legal, medical) need tighter thresholds; high-volume support bots can tolerate looser thresholds.

## Production-Scale: GPTCache + Vector Store

For > 10K queries/day, replace the in-memory list with a dedicated vector store:

```python
from gptcache import cache as gptcache
from gptcache.manager import CacheBase, VectorBase, get_data_manager
from gptcache.similarity_evaluation.distance import SearchDistanceEvaluation

gptcache.init(
    embedding_func=voy_embed_func,          # your embedding function
    data_manager=get_data_manager(
        CacheBase("sqlite"),                # metadata store
        VectorBase("faiss", dimension=1024) # vector search
    ),
    similarity_evaluation=SearchDistanceEvaluation(),
)

# Now use gptcache-wrapped LLM calls — caching is transparent
```

## Impact

On a production customer-support bot with 50K queries/day:

| Metric | Before semantic cache | After |
|--------|----------------------|-------|
| Cache hit rate | 0% (exact match) | 34% |
| LLM calls/day | 50K | 33K |
| Avg latency | 1.2s | 0.8s |
| Monthly LLM cost | $4,200 | $2,770 |

The hit rate depends heavily on query diversity. Support bots and FAQ systems see the highest benefit; research assistants with highly varied queries see lower gains.
