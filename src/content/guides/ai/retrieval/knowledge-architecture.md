No single retrieval mechanism is optimal for every query type. Production AI
systems layer multiple mechanisms — the skill is knowing which to engage when.

## The Four Mechanisms

| Mechanism | What it stores | Best for |
|-----------|---------------|----------|
| **[Semantic Cache](/guides/semantic-caching)** | Past (query, answer) pairs | Repeated or paraphrased questions |
| **[OKF Bundle](/guides/open-knowledge-format)** | Curated, cross-linked concepts | Stable, structured, authoritative knowledge |
| **Vector RAG** | Chunked document embeddings | Large unstructured corpora, long-tail queries |
| **Knowledge Graph** | Entity–relation triples | Multi-hop reasoning across connected data |

## Layered Architecture

Route each query through tiers, cheapest first:

```
Query
  │
  ▼
Tier 1: Semantic Cache ────── hit? → return cached answer (< 50ms)
  │ miss
  ▼
Tier 2: OKF Bundle ────────── relevant concepts? → inject into context
  │ (always runs if bundle covers the domain)
  ▼
Tier 3: Vector RAG ─────────── retrieve top-K chunks → add to context
  │ (skip for narrow-domain queries fully covered by OKF)
  ▼
Tier 4: Knowledge Graph ────── multi-hop? → graph traversal
  │ (only for confirmed relational queries)
  ▼
LLM generation with assembled context
```

## Decision Matrix

| Scenario | Recommended stack |
|----------|-------------------|
| Support bot, FAQ, docs Q&A | Semantic cache + vector RAG |
| Internal knowledge base (runbooks, APIs, metrics) | OKF bundle + vector RAG for overflow |
| Research assistant over large document corpus | Vector RAG + optional graph for entity queries |
| Product catalog with relationships | Knowledge graph + vector RAG for descriptions |
| All of the above in one system | Full four-tier stack |

## Routing Layer

```python
import anthropic
import voyageai
from dataclasses import dataclass

@dataclass
class RetrievalResult:
    source: str
    content: str

class KnowledgeRouter:
    def __init__(self, cache, okf_bundle, vector_store, graph_store):
        self.cache = cache
        self.okf = okf_bundle
        self.vectors = vector_store
        self.graph = graph_store
        self.voy = voyageai.Client()
        self.claude = anthropic.Anthropic()

    def retrieve(self, query: str) -> list[RetrievalResult]:
        results: list[RetrievalResult] = []

        # Tier 1: semantic cache
        cached = self.cache.lookup(query)
        if cached:
            return [RetrievalResult('cache', cached)]

        # Tier 2: OKF bundle — always check if the domain is covered
        concepts = self.okf.lookup(query)
        if concepts:
            results.extend(RetrievalResult('okf', c) for c in concepts)

        # Tier 3: vector retrieval for long-tail coverage
        [q_vec] = self.voy.embed([query], model='voyage-4-large').embeddings
        chunks = self.vectors.search(q_vec, k=5)
        results.extend(RetrievalResult('vector', c.text) for c in chunks)

        # Tier 4: graph traversal only for multi-hop relational queries
        if self._is_relational(query):
            triples = self.graph.traverse(query, hops=2)
            results.extend(RetrievalResult('graph', t) for t in triples)

        return results

    def _is_relational(self, query: str) -> bool:
        """Classify whether a query needs multi-hop relational reasoning."""
        resp = self.claude.messages.create(
            model='claude-haiku-4-5-20251001',  # cheap classifier
            max_tokens=5,
            messages=[{'role': 'user', 'content':
                f'Does this query require tracing relationships between entities? '
                f'Answer yes or no only.\n\nQuery: {query}'}]
        )
        return resp.content[0].text.strip().lower().startswith('yes')
```

## Cost Profile

| Tier | Latency | Cost per query | When it fires |
|------|---------|----------------|---------------|
| Semantic cache | < 50ms | ~$0.00001 | Cache hit (~30% on support bots) |
| OKF bundle | < 5ms | ~$0 (file read) | Domain-covered queries |
| Vector RAG | 100–300ms | ~$0.001 | Most queries |
| Knowledge graph | 500–2000ms | ~$0.01 | Multi-hop only (<5% of queries) |

Start with vector RAG. Add semantic caching once you have query volume data.
Add OKF when you identify stable, structured knowledge that agents misuse or
hallucinate. Add a knowledge graph only when multi-hop relational reasoning
is a validated use case — it is expensive to build and maintain.
