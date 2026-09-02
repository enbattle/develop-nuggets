RAG runs in two phases: **indexing** (one-time setup) and **querying** (real-time, once per request). You can [step through the standard pipeline interactively](/interactive/standard) alongside the code below.

## Phase 1: Indexing

### Step 1 — Load Documents
```python
from pypdf import PdfReader

documents = []
reader = PdfReader("product_manual.pdf")
for page in reader.pages:
    documents.append(page.extract_text())
```

### Step 2 — Chunk Documents

Break documents into smaller pieces so retrieval is precise.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
chunks = splitter.split_text(full_text)
```

**Key parameters:** Chunk size 512–1024 tokens, overlap 50–100 tokens.

### Step 3 — Generate Embeddings
```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(chunks)   # shape: (n_chunks, 384)
```

### Step 4 — Store in Vector Database
```python
import chromadb

client = chromadb.Client()
collection = client.create_collection("knowledge_base")

collection.add(
    documents=chunks,
    embeddings=embeddings.tolist(),
    ids=[f"chunk_{i}" for i in range(len(chunks))],
    metadatas=[{"source": "manual.pdf"}] * len(chunks)
)
```

## Phase 2: Querying

### Step 1 — Embed the Query
```python
query_embedding = model.encode(user_query)   # Same model as indexing!
```

### Step 2 — Vector Search
```python
results = collection.query(
    query_embeddings=[query_embedding.tolist()],
    n_results=5   # top-k
)
retrieved_docs = results['documents'][0]
```

### Step 3 — Build Prompt with Context
```python
context = "\n\n".join([f"[{i+1}] {doc}" for i, doc in enumerate(retrieved_docs)])

prompt = f"""Answer using only the provided context.
If the context doesn't contain the answer, say so.

Context:
{context}

Question: {user_query}

Answer:"""
```

### Step 4 — Generate Answer
```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1000,
    temperature=0,   # deterministic for factual questions
    messages=[{"role": "user", "content": prompt}]
)
```

## The Five Core Components

| Component | What It Does | Key Decision |
|-----------|-------------|--------------|
| **[Chunking](/guides/chunking-strategies)** | Splits documents for precise retrieval | Size (512 tokens), overlap (50), strategy |
| **Embeddings** | Converts text to searchable vectors | Model choice (accuracy vs. speed) |
| **[Vector search](/guides/vector-search)** | Stores and searches embeddings | Scale: Chroma (local) → Qdrant/Pinecone (prod) |
| **Retrieval** | Finds relevant chunks | top_k (start at 5), similarity threshold |
| **Generation** | Produces grounded answers | temperature=0, explicit citation instruction |

## Embedding Model Options

| Model | Dimensions | Speed | Best For |
|-------|-----------|-------|----------|
| `all-MiniLM-L6-v2` | 384 | Fast | General purpose, good default |
| `all-mpnet-base-v2` | 768 | Medium | Higher quality |
| `voyage-4-large` | 1024 | API | Production accuracy |
| `text-embedding-3-large` | 3072 | API | OpenAI ecosystem |

**Start with `all-MiniLM-L6-v2` — fast and capable for most use cases.**

## Critical Rule

**Always use the same embedding model for indexing and querying.** Mixing models produces meaningless similarity scores.

## Retrieval Settings

- **top_k=5** is a solid starting point
- k=1–2 may miss relevant info; k=20+ adds noise and cost
- **Metadata filtering** narrows search to relevant subsets:

```python
results = collection.query(
    query_embeddings=[query_embedding],
    n_results=5,
    where={"source": "manual_v2.pdf"}
)
```

## Generation Settings

```python
def generate_answer(query: str, documents: list) -> str:
    client = anthropic.Anthropic()
    context = "\n\n".join([f"[{i+1}] {doc}" for i, doc in enumerate(documents)])

    prompt = f"""You are a helpful assistant. Answer using ONLY the context below.
If the answer isn't in the context, say "I don't have that information."
Cite document numbers like [1], [2] when used.

Context:
{context}

Question: {query}

Answer:"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        temperature=0,   # 0 = deterministic, factual
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text
```

**Key settings:** `temperature=0` for factual answers, explicit citation instruction reduces hallucinations, `max_tokens=500–1500` limits response length.
