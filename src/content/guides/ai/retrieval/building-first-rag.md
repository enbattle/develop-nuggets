## Building Your First RAG System

A minimal implementation that runs as-is. It follows the [standard RAG pipeline](/interactive/standard) — embed, retrieve, stuff into the prompt, generate — with nothing added for scale yet.

## Installation

```bash
pip install chromadb sentence-transformers anthropic
export ANTHROPIC_API_KEY="your-api-key"
```

## Complete Implementation

```python
import chromadb
from sentence_transformers import SentenceTransformer
import anthropic

class SimpleRAG:
    def __init__(self):
        self.embed_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.db = chromadb.Client()
        self.collection = self.db.create_collection("docs")
        self.llm = anthropic.Anthropic()

    def add_documents(self, documents: list[str]):
        """Index documents for retrieval."""
        embeddings = self.embed_model.encode(documents)
        self.collection.add(
            documents=documents,
            embeddings=embeddings.tolist(),
            ids=[f"doc_{i}" for i in range(len(documents))]
        )

    def query(self, question: str, top_k: int = 5) -> str:
        """Answer a question using RAG."""
        # Retrieve
        q_embedding = self.embed_model.encode(question)
        results = self.collection.query(
            query_embeddings=[q_embedding.tolist()],
            n_results=top_k
        )
        docs = results['documents'][0]

        # Generate
        context = "\n\n".join([f"[{i+1}] {d}" for i, d in enumerate(docs)])
        prompt = f"""Answer using only the provided context.
If the answer isn't in the context, say so.

Context:
{context}

Question: {question}

Answer:"""

        response = self.llm.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1000,
            temperature=0,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
```

## Usage & Testing

```python
rag = SimpleRAG()

rag.add_documents([
    "Paris is the capital of France, known for the Eiffel Tower.",
    "Tokyo is the capital of Japan, the largest city in the country.",
    "RAG reduces hallucinations by grounding LLM responses in retrieved context.",
])

# Should answer correctly
print(rag.query("What is the capital of France?"))

# Should admit it doesn't know (Germany not in docs)
print(rag.query("What is the capital of Germany?"))
```

## Why These Design Choices?

| Decision | Why |
|----------|-----|
| `temperature=0` | Deterministic — reduces hallucination for factual questions |
| `top_k=5` | Balances relevance coverage vs. noise |
| "Answer using only context" | Grounds the LLM — prevents falling back to training data |
| Numbered citations [1][2] | Forces the model to track which doc it's using |

## Next Steps

Once this works, add:

1. **[Chunking](/guides/chunking-strategies)** — break large documents into pieces before indexing
2. **Metadata** — track source, page, date per chunk
3. **Source attribution** — return which documents were used in the answer
4. **Error handling** — handle empty results, API failures

[Naive vs Production RAG](/guides/naive-vs-production) covers what else changes once real users are involved.
