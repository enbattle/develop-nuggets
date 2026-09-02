import { PipelineFigure } from '../PipelineFigure';
import { StepThrough, type Step } from '../StepThrough';
import type { CodeTab } from '../CodeTabs';
import type { PipelineLayout } from '../pipeline';

const LAYOUT: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'retrieve', label: 'Retrieve', kind: 'retrieval', x: 151, y: 90, w: 116, h: 60 },
    { id: 'generate', label: 'Generate', kind: 'llm', x: 282, y: 90, w: 116, h: 60 },
    { id: 'reflect-rel', label: 'Reflect: Relevant?', kind: 'decision', x: 413, y: 90, w: 116, h: 60 },
    { id: 'reflect-support', label: 'Reflect: Supported?', kind: 'decision', x: 544, y: 90, w: 116, h: 60 },
    { id: 'decide', label: 'Decide', kind: 'decision', x: 675, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 806, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'retrieve' },
    { id: 'e2', from: 'retrieve', to: 'generate' },
    { id: 'e3', from: 'generate', to: 'reflect-rel' },
    { id: 'e4', from: 'reflect-rel', to: 'reflect-support' },
    { id: 'e5', from: 'reflect-support', to: 'decide' },
    { id: 'e6', from: 'decide', to: 'retrieve', fromSide: 'bottom', toSide: 'bottom', curve: 'loop-back', bend: 70 },
    { id: 'e7', from: 'decide', to: 'answer' },
  ],
};

const STEPS: Step[] = [
  {
    caption: 'Query arrives. Self-RAG will generate with built-in self-reflection.',
    activeNodeIds: ['query'],
    activeEdgeIds: [],
  },
  {
    caption: 'Initial retrieval executes. Standard vector search returns top-K chunks.',
    detail:
      'Top chunk: self-rag-paper.pdf (0.88) — "Self-RAG trains language models to reflect on their own generation."',
    activeNodeIds: ['retrieve'],
    activeEdgeIds: ['e1'],
  },
  {
    caption:
      'Generator produces output AND emits special reflection tokens that critique its own work.',
    activeNodeIds: ['generate'],
    activeEdgeIds: ['e2'],
  },
  {
    caption:
      'Reflection token 1: [IsRelevant] → "RELEVANT". The model confirms retrieved chunks address the query.',
    activeNodeIds: ['reflect-rel'],
    activeEdgeIds: ['e3'],
  },
  {
    caption:
      'Reflection token 2: [IsSupported] → "FULLY_SUPPORTED". The generated output is grounded in retrieved context.',
    activeNodeIds: ['reflect-support'],
    activeEdgeIds: ['e4'],
  },
  {
    caption:
      'Reflection token 3: [Confidence] → "HIGH". Both relevance and support passed. No re-retrieval needed.',
    detail:
      'Edge e6 back to Retrieve is the path taken instead when confidence is LOW.',
    activeNodeIds: ['decide'],
    activeEdgeIds: ['e5', 'e6'],
  },
  {
    caption:
      'Answer returned with reflection metadata. Self-evaluation provides explainability and prevents hallucination.',
    activeNodeIds: ['answer'],
    activeEdgeIds: ['e7'],
  },
];

const CODE: CodeTab[] = [
  {
    label: 'Full pipeline',
    lang: 'python',
    source: `# Self-RAG Pipeline with Reflection Tokens

from anthropic import Anthropic
from typing import List, Dict, Tuple
import voyageai

class SelfRAG:
    """
    Self-RAG trains the generator to emit reflection tokens that enable
    self-evaluation of retrieval relevance, output support, and confidence.

    The model decides when to retrieve again based on its own critique.
    """

    def __init__(self):
        self.anthropic = Anthropic()
        self.voyage = voyageai.Client()
        self.model = "claude-sonnet-4-6"
        self.embed_model = "voyage-4-large"

    def query(self, question: str, index: VectorIndex) -> Dict:
        """Self-reflective RAG with dynamic re-retrieval."""

        # Step 1: Initial retrieval
        chunks = self._retrieve(question, index, k=5)

        # Step 2: Generate with reflection tokens
        response, reflections = self._generate_with_reflection(
            question, chunks
        )

        # Step 3: Self-evaluate
        if reflections['confidence'] == 'LOW':
            # Model requested more context
            chunks = self._retrieve(question, index, k=10)
            response, reflections = self._generate_with_reflection(
                question, chunks
            )

        return {
            'answer': response,
            'reflections': reflections,
            'retrieval_triggered': reflections['confidence'] == 'LOW'
        }`,
  },
  {
    label: 'Embeddings',
    lang: 'python',
    source: `# Embedding with voyage-4-large (Jan 2026 release)

import voyageai

client = voyageai.Client()

# Embed query for semantic search
query = "What is self-reflective RAG?"
query_embedding = client.embed(
    [query],
    model="voyage-4-large",  # 1024 dimensions
    input_type="query"
).embeddings[0]

# Embed documents for indexing
documents = [
    "Self-RAG trains generators to emit reflection tokens...",
    "Reflection enables self-evaluation of relevance and support..."
]

doc_embeddings = client.embed(
    documents,
    model="voyage-4-large",
    input_type="document"
).embeddings`,
  },
  {
    label: 'Vector search',
    lang: 'python',
    source: `# Vector Search with Reflection-Aware Ranking

import numpy as np
from typing import List, Tuple

def search_with_metadata(
    query_embedding: List[float],
    index: VectorIndex,
    k: int = 5
) -> List[Tuple[str, float, Dict]]:
    """
    Search and return results with metadata for reflection.

    Self-RAG benefits from retrieving metadata like:
    - Source document quality scores
    - Content freshness timestamps
    - Domain tags
    """

    results = index.search(
        query_embedding,
        k=k,
        return_metadata=True  # Include source, score, timestamp
    )

    ranked_results = []
    for result in results:
        confidence_signal = {
            'score': result.score,
            'recency': result.metadata.get('days_old', 999),
            'source_quality': result.metadata.get('quality', 0.5)
        }
        ranked_results.append((result.text, result.score, confidence_signal))

    return ranked_results`,
  },
  {
    label: 'Generation',
    lang: 'python',
    source: `# Self-Reflective Generation with Claude Sonnet 4

from anthropic import Anthropic

client = Anthropic()

def generate_with_reflection(
    query: str,
    chunks: List[str],
    previous_reflections: Optional[Dict] = None
) -> Tuple[str, Dict]:
    """
    Generate answer with built-in reflection tokens.

    Reflection tokens:
    - [IsRelevant]: RELEVANT | PARTIALLY_RELEVANT | IRRELEVANT
    - [IsSupported]: FULLY_SUPPORTED | PARTIALLY_SUPPORTED | UNSUPPORTED
    - [Confidence]: HIGH | MEDIUM | LOW
    """

    system_prompt = """You are a self-reflective QA system.

After answering, critique your own work using reflection tokens:
- [IsRelevant]: Evaluate retrieval quality
- [IsSupported]: Check if claims are grounded
- [Confidence]: Assess overall certainty

If confidence is LOW, you'll trigger re-retrieval."""

    context = "\\n\\n".join(f"Chunk {i+1}: {c}" for i, c in enumerate(chunks))

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {query}"}]
    )

    text = response.content[0].text
    reflections = parse_reflection_tokens(text)
    return text, reflections

# Example reflection output:
# [IsRelevant]: RELEVANT
# [IsSupported]: FULLY_SUPPORTED
# [Confidence]: HIGH`,
  },
];

export default function SelfRagInteractive() {
  return (
    <StepThrough
      steps={STEPS}
      diagram={<PipelineFigure layout={LAYOUT} title="Self-RAG pipeline" />}
      code={CODE}
    />
  );
}
