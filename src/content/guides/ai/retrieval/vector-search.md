Traditional databases index exact values for precise lookups. Vector databases
solve a different problem: given a query embedding, find the K stored vectors
closest by semantic distance — approximate nearest neighbor (ANN) search, not
exact match.

## Why Approximate, Not Exact

Exact nearest neighbor search requires comparing every stored vector to the
query — O(n) operations per query. At 1M documents with 1024-dimensional
embeddings (voyage-4-large), that's 1 billion multiply-accumulates per query.
ANN trades a small recall loss for orders-of-magnitude speed: a well-tuned
index returns the correct top-5 with >95% recall in single-digit milliseconds.

## HNSW: The Dominant Algorithm

Most production vector databases (Qdrant, Weaviate, pgvector) use
**Hierarchical Navigable Small World (HNSW)** graphs.

```
Layer 2 (sparse):   A ──────────────── E
Layer 1 (medium):   A ──── C ─────── E ──── G
Layer 0 (dense):    A ─ B ─ C ─ D ─ E ─ F ─ G ─ H
```

**Index build:** Each vector is placed in the graph at probabilistically
assigned layers (most at layer 0, few at higher layers). Connections are wired
to the M nearest neighbors at each layer.

**Query:** Enter at the top (sparse) layer, greedily navigate toward the query
vector, drop to the next layer when stuck, beam-search with width `ef_search`
at layer 0.

### Key HNSW Parameters

| Parameter | Default | Effect |
|-----------|---------|--------|
| `M` | 16 | Edges per node. Higher = better recall, more RAM |
| `ef_construction` | 200 | Build-time beam width. Higher = better graph quality, slower indexing |
| `ef_search` | 128 | Query-time beam width. Higher = better recall, slower queries |

**Memory estimate for HNSW:**

```
RAM ≈ (n_vectors × dim × 4 bytes) + (n_vectors × M × 2 × 4 bytes)
    = (1M × 1024 × 4) + (1M × 16 × 2 × 4)
    ≈ 4 GB + 128 MB ≈ 4.1 GB for 1M voyage-4-large embeddings
```

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, HnswConfigDiff

client = QdrantClient('localhost', port=6333)

client.create_collection(
    collection_name='docs',
    vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
    hnsw_config=HnswConfigDiff(
        m=16,              # good default for most datasets
        ef_construct=200,  # raise to 400 for highest-recall requirements
    ),
)
```

## Metadata Filtering

Real queries combine vector similarity with structured filters: "most relevant
documents *from department=engineering* and *created after 2025-01-01*."

| Strategy | How | Best for |
|----------|-----|----------|
| **Pre-filter** | Filter rows first, ANN over subset | Highly selective filters (<5% of corpus) |
| **Post-filter** | ANN over everything, discard mismatches | Mild filters; risks fewer than K results |
| **Filtered HNSW** | Apply filter during graph traversal | Production default — Qdrant and Weaviate support this |

```python
from qdrant_client.models import Filter, FieldCondition, MatchValue, Range
import voyageai

voy = voyageai.Client()

def filtered_search(query: str, department: str, after: str, k: int = 5):
    [q_vec] = voy.embed([query], model='voyage-4-large').embeddings

    return client.search(
        collection_name='docs',
        query_vector=q_vec,
        query_filter=Filter(
            must=[
                FieldCondition(key='department', match=MatchValue(value=department)),
                FieldCondition(key='created_at', range=Range(gte=after)),
            ]
        ),
        limit=k,
    )
```

## Index Updates and Staleness

HNSW is not designed for frequent individual mutations. Inserts are `O(M log n)`, so batch ingestion is fine. Deletes are soft — the vector is only physically removed on segment compaction. An update is just a delete followed by a re-insert.

Strategies for keeping the index fresh:

- **Nightly full rebuild** — simplest, guarantees consistency, acceptable for most workloads.
- **Incremental upsert** — Qdrant supports vector upserts; run compaction weekly.
- **Dual-index** — write to a small hot index in real-time; periodically merge into the main cold index.

## Managed vs. Self-Hosted

| | Qdrant | Weaviate | Pinecone |
|---|---|---|---|
| **Hosting** | Self / managed | Self / managed | Managed only |
| **Filtered HNSW** | ✓ | ✓ | ✓ |
| **Hybrid search** | ✓ | ✓ | ✓ |
| **Best for** | Self-hosted production | Schema-rich workloads | Zero-ops teams |

For a Postgres-native stack, **pgvector** is the pragmatic choice — it lives in
the same database as your application data, though its HNSW implementation is
less tunable than dedicated stores.
