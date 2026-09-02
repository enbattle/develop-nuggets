import { PipelineSummary, type TraceChunk } from '../PipelineSummary';
import type { CodeTab } from '../CodeTabs';
import type { PipelineLayout } from '../pipeline';

const LAYOUT: PipelineLayout = {
  nodes: [
    { id: 'query-input', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'embed-query', label: 'Embed Query', kind: 'retrieval', x: 151, y: 90, w: 116, h: 60 },
    { id: 'vector-store', label: 'Vector Search', kind: 'retrieval', x: 282, y: 90, w: 116, h: 60 },
    { id: 'top-k', label: 'Top-K Select', kind: 'retrieval', x: 413, y: 90, w: 116, h: 60 },
    { id: 'build-prompt', label: 'Build Prompt', kind: 'retrieval', x: 544, y: 90, w: 116, h: 60 },
    { id: 'llm-call', label: 'LLM Generate', kind: 'llm', x: 675, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 806, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query-input', to: 'embed-query' },
    { id: 'e2', from: 'embed-query', to: 'vector-store' },
    { id: 'e3', from: 'vector-store', to: 'top-k' },
    { id: 'e4', from: 'top-k', to: 'build-prompt' },
    { id: 'e5', from: 'build-prompt', to: 'llm-call' },
    { id: 'e6', from: 'llm-call', to: 'answer' },
  ],
};

const INSIGHT =
  'Top-K selection has no quality gate. Chunks 4 and 5 are borderline or irrelevant, but Standard RAG passes them to the LLM regardless. This is the core failure mode that Hybrid RAG, CRAG, and HyDE each address from different angles.';

const TRACE = [
  'A user query arrives. It will be embedded and used to search the document store for relevant context.',
  'The query is converted into a dense vector using an embedding model. This vector captures the semantic meaning of the question.',
  'The query vector is compared against all stored document vectors using cosine similarity.',
  'The top 5 chunks by similarity score are selected. Chunks 4 and 5 have low scores.',
  'Retrieved chunks are assembled into a prompt alongside the original query.',
  'The LLM generates a response using only the retrieved context. Low-quality chunks can cause hallucination.',
  'Answer returned. The pipeline is complete.',
];

const CHUNKS: TraceChunk[] = [
  { rank: 1, source: 'attention-paper.pdf', score: 0.91, content: 'Transformer architecture uses self-attention mechanisms...' },
  { rank: 2, source: 'transformers.pdf', score: 0.84, content: 'Multi-head attention allows the model to attend to different...' },
  { rank: 3, source: 'arch-guide.md', score: 0.76, content: 'Positional encodings are added to embeddings...' },
  { rank: 4, source: 'components.md', score: 0.61, content: 'The feed-forward layers in each block process... (borderline relevance)' },
  { rank: 5, source: 'training.md', score: 0.43, content: 'Training data preprocessing involves tokenization... (likely noise)' },
];

const CODE: CodeTab[] = [
  {
    label: 'Full pipeline',
    lang: 'python',
    source: `"""
Standard RAG: Single-pass retrieval and generation
"""
from typing import List, Dict
import voyageai
import anthropic
from config import EMBEDDING_MODEL, LLM_MODEL, TOP_K

class StandardRAG:
    """Production RAG pipeline with voyage-4-large embeddings and Claude generation"""

    def __init__(self, vector_store_path: str):
        self.voyage_client = voyageai.Client()
        self.anthropic_client = anthropic.Anthropic()
        self.vector_store_path = vector_store_path
        self.index = self._load_index()

    def query(self, user_query: str) -> str:
        """Execute full RAG pipeline"""
        # 1. Embed query
        query_embedding = self._embed_query(user_query)

        # 2. Retrieve top-K chunks
        chunks = self._retrieve(query_embedding, k=TOP_K)

        # 3. Build prompt with context
        prompt = self._build_prompt(user_query, chunks)

        # 4. Generate answer
        answer = self._generate(prompt)

        return answer
`,
  },
  {
    label: 'Embeddings',
    lang: 'python',
    source: `"""
Embedding module: Convert text to dense vectors
"""
from typing import List
import voyageai
from config import EMBEDDING_MODEL, CHUNK_SIZE, CHUNK_OVERLAP

def chunk_document(text: str) -> List[str]:
    """Split document into fixed-size overlapping chunks"""
    chunks = []
    start = 0

    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end]
        chunks.append(chunk)
        start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks

def embed_chunks(chunks: List[str]) -> List[List[float]]:
    """Generate embeddings for all chunks"""
    client = voyageai.Client()

    result = client.embed(
        texts=chunks,
        model=EMBEDDING_MODEL,
        input_type="document"
    )

    return result.embeddings
`,
  },
  {
    label: 'Vector search',
    lang: 'python',
    source: `"""
Vector similarity search with approximate nearest neighbors
"""
from typing import List, Tuple
import numpy as np
from dataclasses import dataclass

@dataclass
class RetrievedChunk:
    content: str
    source: str
    score: float
    rank: int

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Compute cosine similarity between two vectors"""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def retrieve_top_k(
    query_embedding: List[float],
    index: VectorIndex,
    k: int = 5
) -> List[RetrievedChunk]:
    """
    Retrieve top-K most similar chunks.
    Note: No quality threshold - all K chunks are used regardless of score.
    """
    scores = []
    for idx, doc_embedding in enumerate(index.embeddings):
        score = cosine_similarity(
            np.array(query_embedding),
            np.array(doc_embedding)
        )
        scores.append((score, idx))

    scores.sort(reverse=True)
    top_k = scores[:k]

    return [
        RetrievedChunk(
            content=index.chunks[idx],
            source=index.sources[idx],
            score=score,
            rank=rank + 1
        )
        for rank, (score, idx) in enumerate(top_k)
    ]
`,
  },
  {
    label: 'Generation',
    lang: 'python',
    source: `"""
LLM generation with retrieved context
"""
import anthropic
from typing import List
from config import LLM_MODEL

def build_prompt(query: str, chunks: List[RetrievedChunk]) -> str:
    """Assemble context window from retrieved chunks"""
    context = "\\n\\n".join([
        f"[{chunk.rank}] {chunk.content}"
        for chunk in chunks
    ])

    return f"""Use the following context to answer the question.

Context:
{context}

Question: {query}

Answer:"""

def generate_answer(prompt: str) -> str:
    """Call Claude to generate final answer"""
    client = anthropic.Anthropic()

    message = client.messages.create(
        model=LLM_MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    return message.content[0].text
`,
  },
];

export default function StandardInteractive() {
  return (
    <PipelineSummary
      diagramTitle="Standard RAG pipeline"
      layout={LAYOUT}
      insight={INSIGHT}
      code={CODE}
      trace={TRACE}
      chunks={CHUNKS}
    />
  );
}
