Once a [basic pipeline](/guides/rag-pipeline) works, these are the techniques that move retrieval quality from "usually right" to "reliably right."

## 1. Hybrid Search

Combine dense vector search with sparse BM25 keyword search. Each catches what the other misses.

```python
from rank_bm25 import BM25Okapi
import numpy as np

class HybridRetriever:
    def __init__(self, documents: list[str], embed_model, collection, alpha: float = 0.7):
        self.alpha = alpha   # weight for semantic search (1-alpha for BM25)
        self.bm25 = BM25Okapi([doc.lower().split() for doc in documents])
        self.documents = documents
        self.embed_model = embed_model
        self.collection = collection

    def retrieve(self, query: str, top_k: int = 5) -> list[str]:
        # Semantic scores
        q_emb = self.embed_model.encode(query).tolist()
        sem_results = self.collection.query(query_embeddings=[q_emb], n_results=20)
        sem_scores = {doc: 1 - dist
                     for doc, dist in zip(sem_results['documents'][0],
                                          sem_results['distances'][0])}

        # BM25 scores
        bm25_scores = dict(zip(self.documents,
                               self.bm25.get_scores(query.lower().split())))

        # Combine
        all_docs = set(sem_scores) | set(bm25_scores)
        combined = {
            doc: self.alpha * sem_scores.get(doc, 0) +
                 (1 - self.alpha) * bm25_scores.get(doc, 0)
            for doc in all_docs
        }
        return sorted(combined, key=combined.get, reverse=True)[:top_k]
```

## 2. Re-ranking

Retrieve a large candidate set, then re-rank with a more accurate cross-encoder.

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def retrieve_and_rerank(query: str, candidates: int = 20, top_k: int = 5):
    # Get broad candidate set
    results = collection.query(
        query_embeddings=[embed_model.encode(query).tolist()],
        n_results=candidates
    )
    docs = results['documents'][0]

    # Re-rank with cross-encoder (slower but more accurate)
    scores = reranker.predict([[query, doc] for doc in docs])
    ranked = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
    return [doc for doc, _ in ranked[:top_k]]
```

## 3. HyDE (Hypothetical Document Embeddings)

Generate a hypothetical answer, then retrieve documents similar to that answer. Better for knowledge-gap queries.

```python
def hyde_retrieve(query: str, top_k: int = 5) -> list[str]:
    # Step 1: Generate a hypothetical answer
    hypothetical = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=200,
        messages=[{
            "role": "user",
            "content": f"Write a short paragraph answering: {query}"
        }]
    ).content[0].text

    # Step 2: Embed the hypothetical answer (not the query)
    hyp_embedding = embed_model.encode(hypothetical)

    # Step 3: Retrieve docs similar to the hypothetical answer
    return collection.query(
        query_embeddings=[hyp_embedding.tolist()],
        n_results=top_k
    )['documents'][0]
```

## 4. Document Preprocessing

Quality in, quality out. Preprocessing before indexing is often the highest-ROI improvement.

```python
import re

def preprocess_document(text: str) -> str:
    # Remove noise
    text = re.sub(r'\s+', ' ', text)           # normalize whitespace
    text = re.sub(r'[\x00-\x1f\x7f]', '', text)  # remove control chars
    text = re.sub(r'(.{3,})\1+', r'\1', text)   # remove repetitive patterns

    # Normalize
    text = text.replace('\u2019', "'").replace('\u2014', '--')
    return text.strip()
```

## 5. Query Expansion

```python
def expand_query(query: str) -> list[str]:
    """Generate multiple phrasings to improve recall."""
    prompt = f"""Generate 3 alternative phrasings of this search query.
Keep the same intent but vary vocabulary and structure.

Query: {query}

Return as JSON: ["phrase1", "phrase2", "phrase3"]"""

    # Search with all 4 queries (original + 3 expanded), merge results
```

## 6. Multi-Modal RAG

Extend RAG to images, tables, and structured data:

```python
# Images: extract captions or use vision models to generate descriptions
def process_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()

    response = client.messages.create(
        model="claude-sonnet-5",
        messages=[{
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": b64}},
                {"type": "text", "text": "Describe this image in detail for search indexing."}
            ]
        }]
    )
    return response.content[0].text   # Store this as a searchable chunk

# Tables: convert to natural language
def table_to_text(df) -> str:
    return df.to_string()  # Or use LLM to summarize key facts
```

## When to Apply Each Technique

| If you're seeing... | Try... |
|---------------------|--------|
| Missing relevant docs | Hybrid search, query expansion, increase top_k |
| Retrieved docs not ranked well | Re-ranking |
| Queries too abstract for direct retrieval | HyDE |
| Noisy or poorly formatted docs | Preprocessing |
| Images or tables not found | Multi-modal RAG |
| High precision but low recall | Hierarchical chunking |
