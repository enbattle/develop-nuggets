## Common RAG Issues and Solutions

The five most frequent failure modes and how to fix them.

## 1. Hallucinations Despite Context

**Symptoms:** LLM adds information not in the retrieved documents.

**Causes:** LLM prioritizes training data, ambiguous prompt, temperature > 0.

**Fixes:**

```python
# Use temperature=0 for factual responses
response = client.messages.create(
    model="claude-sonnet-4-6",
    temperature=0,   # critical
    ...
)
```

```python
# Explicit grounding instruction
prompt = f"""Answer ONLY using the context below. Do not use external knowledge.
If the answer is not in the context, say "I don't have enough information."

Context:
{context}

Question: {query}
Answer:"""
```

## 2. Missing Relevant Information

**Symptoms:** RAG gives incomplete answers; right docs aren't being retrieved.

**Causes:** top_k too small, poor chunking, terminology mismatch.

**Fixes:**

```python
# Increase top_k
results = collection.query(query_embeddings=[embedding], n_results=10)
```

```python
# Add re-ranking to boost recall precision
from sentence_transformers import CrossEncoder

reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')

def retrieve_and_rerank(query: str, top_k: int = 5):
    # Retrieve wider candidate set
    results = collection.query(
        query_embeddings=[embed_model.encode(query).tolist()],
        n_results=20
    )
    docs = results['documents'][0]

    # Re-rank to top-k
    scores = reranker.predict([[query, doc] for doc in docs])
    ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
    return [docs[i] for i in ranked[:top_k]]
```

## 3. Too Much Irrelevant Content

**Symptoms:** Retrieved docs confuse the LLM; answers are unfocused.

**Causes:** top_k too high, no similarity threshold, poor chunking.

**Fixes:**

```python
# Filter by similarity score
def retrieve_with_threshold(query: str, threshold: float = 0.7):
    results = collection.query(
        query_embeddings=[embed_model.encode(query).tolist()],
        n_results=10
    )
    return [
        doc for doc, dist in zip(results['documents'][0], results['distances'][0])
        if dist < threshold
    ]
```

Decrease top_k from 10 to 3–5, or improve chunking to keep related content together.

## 4. Slow Response Times

**Symptoms:** Pipeline takes >3 seconds end-to-end.

**Causes:** Large embedding model, too many retrieved docs, no streaming.

**Fixes:**

```python
# Use fast embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')   # 384 dims, very fast

# Stream LLM response for perceived speed
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1000,
    temperature=0,
    messages=[{"role": "user", "content": prompt}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

## 5. Outdated Information

**Symptoms:** Answers reflect old state of knowledge base.

**Causes:** No re-indexing strategy, stale vector database.

**Fixes:**

```python
import schedule

def reindex_documents():
    client.delete_collection("docs")
    collection = client.create_collection("docs")
    documents = load_documents_from_source()
    embeddings = embed_model.encode(documents)
    collection.add(documents=documents, embeddings=embeddings.tolist(),
                   ids=[f"doc_{i}" for i in range(len(documents))])

# Daily at 2 AM
schedule.every().day.at("02:00").do(reindex_documents)
```

Add timestamps to metadata and filter by recency:
```python
collection.add(metadatas=[{"timestamp": datetime.now().isoformat()}] * len(docs))

# Query with time filter
results = collection.query(where={"timestamp": {"$gt": "2024-01-01"}})
```

## Debugging Checklist

1. Test retrieval independently before blaming generation
2. Log queries, retrieved docs, and answers for every request
3. Manually review 10–20 bad examples to find patterns
4. Track metrics — you can't improve what you don't measure
