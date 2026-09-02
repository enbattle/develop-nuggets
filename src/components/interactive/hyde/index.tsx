import { PipelineSummary } from '../PipelineSummary';
import {
  EmbeddingSpace,
  type EmbeddingPoint,
} from '../figures/EmbeddingSpace';
import type { CodeTab } from '../CodeTabs';
import type { PipelineLayout } from '../pipeline';

const LAYOUT: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 130, h: 60 },
    { id: 'gen-hyp', label: 'Generate Hypothesis', kind: 'llm', x: 176, y: 90, w: 130, h: 60 },
    { id: 'embed-hyp', label: 'Embed Hypothesis', kind: 'retrieval', x: 332, y: 90, w: 130, h: 60 },
    { id: 'search', label: 'Vector Search', kind: 'retrieval', x: 488, y: 90, w: 130, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 644, y: 90, w: 130, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 800, y: 90, w: 130, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'gen-hyp' },
    { id: 'e2', from: 'gen-hyp', to: 'embed-hyp' },
    { id: 'e3', from: 'embed-hyp', to: 'search' },
    { id: 'e4', from: 'search', to: 'llm' },
    { id: 'e5', from: 'llm', to: 'answer' },
  ],
};

const EMBEDDING_POINTS: EmbeddingPoint[] = [
  { id: 'q1', x: 80, y: 60, label: '', type: 'document' },
  { id: 'q2', x: 95, y: 75, label: '', type: 'document' },
  { id: 'q3', x: 70, y: 85, label: '', type: 'document' },
  { id: 'query', x: 85, y: 70, label: 'Query', type: 'query' },
  { id: 'd1', x: 280, y: 200, label: '', type: 'document' },
  { id: 'd2', x: 295, y: 215, label: '', type: 'document' },
  { id: 'd3', x: 270, y: 225, label: '', type: 'document' },
  { id: 'd4', x: 305, y: 205, label: '', type: 'document' },
  { id: 'd5', x: 285, y: 235, label: '', type: 'document' },
  { id: 'hypothesis', x: 290, y: 215, label: 'Hypothesis', type: 'hypothesis' },
];

const INSIGHT =
  "Questions and answers occupy different regions of embedding space. A question vector searches from the wrong neighborhood. HyDE bridges the gap by using the LLM's knowledge to produce a vector that searches from where the answers actually live.";

const TRACE = [
  'Query arrives. Instead of embedding it directly, we generate a hypothesis first.',
  'LLM generates a hypothetical answer using parametric knowledge. This is never shown to the user.',
  'Hypothesis embedded. The vector lands in answer-space, not question-space.',
  'Search from answer-space retrieves more targeted documents than the query embedding would.',
  'Final generation with high-quality real documents (not the hypothesis).',
  'Answer returned. The hypothesis served its purpose and is discarded.',
];

const CODE: CodeTab[] = [
  {
    label: 'Full pipeline',
    lang: 'python',
    source: `"""
HyDE: Hypothetical Document Embeddings
"""
from typing import List
from config import EMBEDDING_MODEL, LLM_MODEL, TOP_K

class HyDERAG:
    """Generate hypothetical answer, embed it, then retrieve"""

    def query(self, user_query: str) -> str:
        # 1. Generate hypothetical answer (without retrieval)
        hypothetical_doc = self.generate_hypothetical(user_query)

        # 2. Embed the hypothetical document
        hyp_embedding = self.embed(hypothetical_doc)

        # 3. Retrieve using hypothetical embedding
        chunks = self.retrieve(hyp_embedding, k=TOP_K)

        # 4. Generate final answer with retrieved context
        return self.generate(user_query, chunks)
`,
  },
  {
    label: 'Hypothesis',
    lang: 'python',
    source: `"""
HyDE: Zero-shot hypothetical document generation
"""
from config import LLM_MODEL

def generate_hypothetical(self, query: str) -> str:
    """
    Generate a hypothetical answer without any retrieval.
    This creates a document that's semantically similar to expected results.
    """
    prompt = f"""Write a detailed, factual passage that would perfectly answer this question.
Do not say "I don't know" - write as if you have the answer.

Question: {query}

Passage:"""

    client = anthropic.Anthropic()
    message = client.messages.create(
        model=LLM_MODEL,
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}]
    )

    return message.content[0].text
`,
  },
  {
    label: 'Retrieve',
    lang: 'python',
    source: `"""
Embed hypothetical document and retrieve similar real documents
"""
import voyageai
from config import EMBEDDING_MODEL

def embed(self, text: str) -> List[float]:
    """Embed the hypothetical document"""
    client = voyageai.Client()
    result = client.embed(
        texts=[text],
        model=EMBEDDING_MODEL,
        input_type="query"
    )
    return result.embeddings[0]

def retrieve(self, hyp_embedding: List[float], k: int) -> List:
    """
    Retrieve real documents similar to the hypothetical document.
    Documents answering the question are semantically similar to our
    hypothetical answer, not just to the query keywords.
    """
    return self.vector_index.search(hyp_embedding, top_k=k)
`,
  },
  {
    label: 'Generation',
    lang: 'python',
    source: `"""
Generate final answer grounded in retrieved real documents
"""
def generate(self, original_query: str, chunks: List) -> str:
    """
    Use retrieved REAL documents to answer the ORIGINAL query.
    The hypothetical document was only used for retrieval.
    """
    context = "\\n\\n".join([
        f"[{chunk.rank}] {chunk.content}"
        for chunk in chunks
    ])

    prompt = f"""Use only the provided context to answer the question.

Context:
{context}

Question: {original_query}

Answer:"""

    return llm.generate(prompt)
`,
  },
];

export default function HydeInteractive() {
  return (
    <PipelineSummary
      diagramTitle="HyDE pipeline"
      layout={LAYOUT}
      insight={INSIGHT}
      code={CODE}
      trace={TRACE}
      figure={
        <>
          <h2 className="text-sm font-semibold text-text-primary">
            Question-space vs. answer-space
          </h2>
          <EmbeddingSpace
            points={EMBEDDING_POINTS}
            caption="The query sits in the question cluster; the hypothesis lands among the answer documents, so search starts from the right neighborhood."
          />
        </>
      }
    />
  );
}
