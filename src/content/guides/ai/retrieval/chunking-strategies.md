How you chunk your documents is one of the most impactful decisions in a RAG system. Chunking determines what the model can retrieve — too small and you lose context, too large and you dilute relevance.

## The Five Strategies

### 1. Fixed-Size Chunking

Split by character or word count with a sliding window overlap.

```python
def fixed_size_chunk(text: str, chunk_size: int = 512, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks
```

**Pros:** Simple, predictable, fast.
**Cons:** Splits sentences in half; breaks semantic context at boundaries.
**Use when:** Homogeneous documents (logs, forms) where sentence integrity doesn't matter.

### 2. Recursive Character Splitting

Tries larger separators first (paragraphs → sentences → words → characters). Falls back to smaller splits only when needed.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=50,
    separators=["\n\n", "\n", ". ", " ", ""]
)
chunks = splitter.split_text(text)
```

**Pros:** Respects document structure; rarely breaks mid-sentence. Works on most document types.
**Cons:** Chunk sizes can vary significantly.
**Use when:** General-purpose RAG. This is the recommended default.

### 3. Sentence-Aware Chunking

Group complete sentences until the chunk size limit is reached, then start a new chunk with N sentence overlap.

```python
import re

def sentence_chunk(text: str, chunk_size: int = 512, overlap_sentences: int = 2) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks, current, length = [], [], 0

    for sentence in sentences:
        word_count = len(sentence.split())
        if length + word_count > chunk_size and current:
            chunks.append(' '.join(current))
            current = current[-overlap_sentences:]
            length = sum(len(s.split()) for s in current)
        current.append(sentence)
        length += word_count

    if current:
        chunks.append(' '.join(current))
    return chunks
```

**Pros:** Chunks always end at sentence boundaries; preserves readability.
**Cons:** Requires reliable sentence detection; chunk sizes vary.
**Use when:** Narrative text, articles, documentation.

### 4. Semantic Chunking

Embed each sentence and find boundaries where semantic similarity drops. Group semantically related sentences together.

```python
from sentence_transformers import SentenceTransformer
import numpy as np

def semantic_chunk(sentences: list[str], threshold: float = 0.8) -> list[str]:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(sentences)

    chunks, current = [], [sentences[0]]

    for i in range(1, len(sentences)):
        # Cosine similarity between adjacent sentences
        sim = np.dot(embeddings[i-1], embeddings[i]) / (
            np.linalg.norm(embeddings[i-1]) * np.linalg.norm(embeddings[i])
        )
        if sim < threshold:    # topic shift detected
            chunks.append(' '.join(current))
            current = []
        current.append(sentences[i])

    if current:
        chunks.append(' '.join(current))
    return chunks
```

**Pros:** Produces chunks with high internal coherence; minimizes topic mixing.
**Cons:** Slower (requires embedding every sentence); non-deterministic chunk sizes.
**Use when:** High-stakes offline indexing where retrieval quality is critical.

### 5. Parent-Child Chunking (Hierarchical)

Index small child chunks for precise retrieval, but return the larger parent chunk for generation context.

```python
class ParentChildChunker:
    def __init__(self):
        self.parents = {}     # id → full parent chunk
        self.children = {}    # id → small child chunk

    def chunk(self, text: str, parent_size: int = 1024, child_size: int = 128):
        parent_words = text.split()
        for p_id, i in enumerate(range(0, len(parent_words), parent_size)):
            parent = ' '.join(parent_words[i:i + parent_size])
            self.parents[p_id] = parent
            child_words = parent.split()
            for j in range(0, len(child_words), child_size):
                child = ' '.join(child_words[j:j + child_size])
                c_id = f"{p_id}_{j}"
                self.children[c_id] = {"text": child, "parent_id": p_id}

    def retrieve(self, query_embedding, top_k: int = 5) -> list[str]:
        # Search the child index for precision
        child_hits = vector_search(self.children, query_embedding, k=top_k)
        # Return parent chunks for full context in generation
        parent_ids = {c["parent_id"] for c in child_hits}
        return [self.parents[pid] for pid in parent_ids]
```

**Pros:** Best of both worlds — precise retrieval, full context for generation.
**Cons:** Double the index size; more complex infrastructure.
**Use when:** Long documents where precise retrieval matters but context for generation should be broader.

## Strategy Comparison

| Strategy | Complexity | Chunk Consistency | Quality | Use Case |
|----------|-----------|-------------------|---------|----------|
| Fixed-size | Simple | High | Low | Homogeneous data |
| Recursive | Low effort | Medium | Good | General default |
| Sentence-aware | Moderate | Medium | Good | Narrative text |
| Semantic | High effort | Low | Best | High-stakes indexing |
| Parent-child | High effort | Medium | Best | Long docs, precision-critical |

## Chunk Size Guidelines

| Size | Use When |
|------|---------|
| **128–256 tokens** | Precise Q&A, dense factual content |
| **512 tokens** | Balanced default — retrieval precision + context |
| **1024+ tokens** | Complex reasoning, code snippets, technical docs |

## The Default Recommendation

For most RAG systems: **recursive character splitting at 512 tokens with 50-token overlap.** It's fast, works on all document types, and rarely breaks semantic context. Switch to semantic chunking only when you need maximum retrieval quality and can afford the offline indexing cost.
