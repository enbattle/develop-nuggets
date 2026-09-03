import { PipelineSummary, type TraceChunk } from '../PipelineSummary';
import type { CodeTab } from '../CodeTabs';
import type { PipelineLayout } from '../pipeline';

const LAYOUT: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'bm25', label: 'BM25 Search', kind: 'retrieval', x: 170, y: 20, w: 116, h: 60 },
    { id: 'dense', label: 'Dense Search', kind: 'retrieval', x: 170, y: 160, w: 116, h: 60 },
    { id: 'rrf', label: 'RRF Fusion', kind: 'retrieval', x: 320, y: 90, w: 116, h: 60 },
    { id: 'reranker', label: 'Reranker', kind: 'tool', x: 470, y: 90, w: 116, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 620, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 770, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'bm25' },
    { id: 'e2', from: 'query', to: 'dense' },
    { id: 'e3', from: 'bm25', to: 'rrf' },
    { id: 'e4', from: 'dense', to: 'rrf' },
    { id: 'e5', from: 'rrf', to: 'reranker' },
    { id: 'e6', from: 'reranker', to: 'llm' },
    { id: 'e7', from: 'llm', to: 'answer' },
  ],
};

const INSIGHT =
  'BM25 and dense retrieval fail in complementary ways. The reranker applies expensive joint scoring only to the merged candidate set, not the full corpus.';

const TRACE = [
  'Query arrives. Hybrid RAG searches using two strategies simultaneously.',
  'BM25 sparse retrieval and dense vector search execute in parallel.',
  'RRF fusion merges both ranked lists into a single unified ranking.',
  'Cross-encoder reranker re-scores the fused candidates — rank order changes.',
  'LLM called with reranked top-K chunks.',
  'Answer returned with higher precision than either retrieval method alone.',
];

const CHUNKS: TraceChunk[] = [
  { rank: 1, source: 'search-optimization.pdf', score: 0.96, content: 'Vector similarity at scale requires approximate nearest neighbor...' },
  { rank: 2, source: 'embeddings-guide.md', score: 0.91, content: 'Embedding models map text to high-dimensional vectors...' },
];

const CODE: CodeTab[] = [
  {
    label: 'Full pipeline',
    lang: 'python',
    source: `"""
Hybrid RAG: BM25 + Dense retrieval with reranking
"""
from typing import List
from config import EMBEDDING_MODEL, RERANKER_MODEL, LLM_MODEL, TOP_K

class HybridRAG:
    """Combines sparse and dense retrieval with cross-encoder reranking"""

    def query(self, user_query: str) -> str:
        # Parallel retrieval
        bm25_results = self.bm25_search(user_query)
        dense_results = self.dense_search(user_query)

        # Fusion
        fused = self.rrf_fusion(bm25_results, dense_results)

        # Reranking
        reranked = self.rerank(user_query, fused)

        # Generation
        return self.generate(user_query, reranked[:TOP_K])
`,
  },
  { label: 'Embeddings', lang: 'text', source: 'Same as Standard RAG.' },
  {
    label: 'RRF fusion',
    lang: 'python',
    source: `"""
RRF Fusion: Reciprocal Rank Fusion
"""
def rrf_fusion(results_a: List, results_b: List, k: int = 60) -> List:
    """Merge two ranked lists without score normalization"""
    scores = {}
    for rank, doc in enumerate(results_a):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)
    for rank, doc in enumerate(results_b):
        scores[doc.id] = scores.get(doc.id, 0) + 1 / (k + rank + 1)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
`,
  },
  {
    label: 'Reranking',
    lang: 'python',
    source: `"""
Cross-encoder reranking
"""
from config import RERANKER_MODEL

def rerank(query: str, chunks: List) -> List:
    """Re-score chunks using cross-encoder"""
    client = voyageai.Client()
    result = client.rerank(
        query=query,
        documents=[c.content for c in chunks],
        model=RERANKER_MODEL
    )
    return [chunks[r.index] for r in result.results]
`,
  },
];

export default function HybridInteractive() {
  return (
    <PipelineSummary
      diagramTitle="Hybrid RAG pipeline"
      layout={LAYOUT}
      insight={INSIGHT}
      code={CODE}
      trace={TRACE}
      chunks={CHUNKS}
    />
  );
}
