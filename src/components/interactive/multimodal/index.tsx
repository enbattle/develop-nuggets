import { PipelineSummary, type TraceChunk } from '../PipelineSummary';
import type { CodeTab } from '../CodeTabs';
import type { PipelineLayout } from '../pipeline';

const LAYOUT: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'text', label: 'Text Retrieval', kind: 'retrieval', x: 190, y: 14, w: 116, h: 60 },
    { id: 'image', label: 'Image Retrieval', kind: 'retrieval', x: 190, y: 90, w: 116, h: 60 },
    { id: 'table', label: 'Table Retrieval', kind: 'retrieval', x: 190, y: 166, w: 116, h: 60 },
    { id: 'fuse', label: 'Fuse Modalities', kind: 'tool', x: 400, y: 90, w: 116, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 580, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 760, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'text' },
    { id: 'e2', from: 'query', to: 'image' },
    { id: 'e3', from: 'query', to: 'table' },
    { id: 'e4', from: 'text', to: 'fuse' },
    { id: 'e5', from: 'image', to: 'fuse' },
    { id: 'e6', from: 'table', to: 'fuse' },
    { id: 'e7', from: 'fuse', to: 'llm' },
    { id: 'e8', from: 'llm', to: 'answer' },
  ],
};

const INSIGHT =
  'Enterprise documents are not flat text. Financial reports contain charts, technical papers contain figures, contracts contain tables. Text-only retrieval misses critical information encoded in non-text formats.';

const TRACE = [
  'Query: "What does the performance comparison chart show for model accuracy?" — has visual and data components.',
  'Cross-modal retrieval searches the text, image, and table indexes simultaneously.',
  'Results from all modalities are assembled into a unified context.',
  'A multi-modal LLM reasons across text, chart, and table simultaneously.',
  'Complete answer using all modalities.',
];

const CHUNKS: TraceChunk[] = [
  { rank: 1, source: 'benchmark-paper.pdf', modality: 'image', score: 0.88, content: 'Figure 4 — Bar chart, MMLU benchmark comparison' },
  { rank: 2, source: 'benchmark-paper.pdf', modality: 'table', score: 0.85, content: 'Model | MMLU | HumanEval — GPT-4 86.4% / 67.0%, Claude 85.2% / 71.2%' },
  { rank: 3, source: 'benchmark-paper.pdf', modality: 'text', score: 0.81, content: 'Table 3 shows benchmark results across five models...' },
];

const CODE: CodeTab[] = [
  {
    label: 'Full pipeline',
    lang: 'python',
    source: `"""
Multi-modal RAG: Retrieval across text, images, and tables
"""
from typing import List, Dict, Any
from config import LLM_MODEL, TOP_K

class MultimodalRAG:
    """Cross-modal retrieval and generation"""

    def __init__(self):
        self.text_encoder = voyageai.Client()
        self.vision_encoder = self._init_vision_encoder()
        self.multimodal_index = self._load_multimodal_index()

    def query(self, user_query: str, query_image: bytes = None) -> str:
        # 1. Encode query (text and/or image)
        query_embedding = self.encode_query(user_query, query_image)

        # 2. Retrieve across modalities
        results = self.multimodal_retrieve(query_embedding, k=TOP_K)

        # 3. Generate with multimodal context
        return self.generate_multimodal(user_query, results)
`,
  },
  {
    label: 'Encoding',
    lang: 'python',
    source: `"""
Multimodal encoding: text, images, tables
"""
import voyageai
from config import EMBEDDING_MODEL

def encode_text(self, text: str) -> List[float]:
    """Encode text using voyage-4-large"""
    result = self.text_encoder.embed(
        texts=[text],
        model=EMBEDDING_MODEL,
        input_type="query"
    )
    return result.embeddings[0]

def encode_image(self, image: bytes) -> List[float]:
    """Encode image using a CLIP / SigLIP vision encoder"""
    return self.vision_encoder.encode_image(image)

def encode_table(self, table_html: str) -> List[float]:
    """Linearize the table to markdown text, then embed"""
    linearized = self._table_to_markdown(table_html)
    return self.encode_text(linearized)
`,
  },
  {
    label: 'Cross-modal retrieval',
    lang: 'python',
    source: `"""
Cross-modal retrieval with unified embedding space
"""
from typing import List
from dataclasses import dataclass

@dataclass
class MultimodalChunk:
    content: Any        # text, image bytes, or table
    modality: str       # 'text', 'image', 'table'
    embedding: List[float]
    source: str
    score: float

def multimodal_retrieve(
    self,
    query_embedding: List[float],
    k: int = 5
) -> List[MultimodalChunk]:
    """Retrieve across all modalities, then re-rank the merged set."""
    all_results = []
    for modality in ['text', 'image', 'table']:
        results = self.multimodal_index[modality].search(query_embedding, top_k=k)
        all_results.extend(results)

    all_results.sort(key=lambda x: x.score, reverse=True)
    return all_results[:k]
`,
  },
  {
    label: 'Generation',
    lang: 'python',
    source: `"""
Vision-language model generation with multimodal context
"""
from anthropic import Anthropic

def generate_multimodal(self, query: str, chunks: List[MultimodalChunk]) -> str:
    """Generate an answer with Claude's vision capabilities."""
    client = Anthropic()

    content = [{"type": "text", "text": f"Question: {query}"}]
    for chunk in chunks:
        if chunk.modality == 'text':
            content.append({"type": "text", "text": chunk.content})
        elif chunk.modality == 'image':
            content.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": chunk.content,
                },
            })
        elif chunk.modality == 'table':
            content.append({"type": "text", "text": f"Table:\\n{chunk.content}"})

    content.append({"type": "text", "text": "Answer:"})

    response = client.messages.create(
        model=LLM_MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": content}]
    )
    return response.content[0].text
`,
  },
];

export default function MultimodalInteractive() {
  return (
    <PipelineSummary
      diagramTitle="Multi-modal RAG pipeline"
      layout={LAYOUT}
      insight={INSIGHT}
      code={CODE}
      trace={TRACE}
      chunks={CHUNKS}
    />
  );
}
