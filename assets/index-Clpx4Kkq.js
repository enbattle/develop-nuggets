import{j as e}from"./index-CRkz_wSb.js";import{P as t}from"./PipelineSummary-CsREO7hE.js";import"./CodeTabs-BPou1eix.js";import"./CodeBlock-858lyf59.js";const i={nodes:[{id:"query",label:"User Query",kind:"input",x:20,y:90,w:150,h:60},{id:"classifier",label:"Complexity Classifier",kind:"decision",x:202,y:90,w:150,h:60},{id:"single-step",label:"Single-Step Retrieve",kind:"retrieval",x:384,y:90,w:150,h:60},{id:"llm-single",label:"LLM Generate",kind:"llm",x:566,y:90,w:150,h:60},{id:"answer",label:"Answer",kind:"output",x:748,y:90,w:150,h:60}],edges:[{id:"e1",from:"query",to:"classifier"},{id:"e3",from:"classifier",to:"single-step"},{id:"e6",from:"single-step",to:"llm-single"},{id:"e7",from:"llm-single",to:"answer"}]},r="Adaptive-RAG optimizes cost and latency by matching retrieval complexity to query complexity. Simple questions skip retrieval entirely using parametric knowledge; only complex ones pay for multi-step iterative retrieval.",s=["Query arrives. Adaptive-RAG classifies complexity before deciding a retrieval strategy.","A lightweight classifier analyzes the query: length, question words, named entities, ambiguity signals.","Classification result: MODERATE complexity. The query needs retrieval, but single-step is sufficient.","A single retrieval executes — standard top-K vector search with reranking.","The LLM generates from the single retrieval; context is sufficient for this complexity.","Answer returned. Adaptive routing saved cost by avoiding unnecessary multi-step retrieval."],n=[{rank:1,source:"adaptive-rag.pdf",score:.89,content:"Adaptive-RAG routes queries to no-retrieval, single-step, or multi-step..."},{rank:2,source:"query-routing.md",score:.84,content:"Query complexity classification uses features like length and ambiguity..."},{rank:3,source:"rag-efficiency.pdf",score:.78,content:"Cost optimization through dynamic retrieval strategy selection..."}],o=[{label:"Full pipeline",lang:"python",source:`# Adaptive-RAG Pipeline with Query Complexity Classification

from anthropic import Anthropic
from typing import Dict, Literal
import voyageai

QueryComplexity = Literal['simple', 'moderate', 'complex']

class AdaptiveRAG:
    """
    Routes queries among three strategies:
    - simple:   no retrieval (parametric knowledge only)
    - moderate: single-step retrieval
    - complex:  multi-step iterative retrieval
    """

    def __init__(self):
        self.anthropic = Anthropic()
        self.voyage = voyageai.Client()
        self.model = "claude-sonnet-4-6"
        self.embed_model = "voyage-4-large"
        self.complexity_classifier = self._load_classifier()

    def query(self, question: str, index: VectorIndex) -> Dict:
        complexity = self._classify_complexity(question)

        if complexity == 'simple':
            answer = self._parametric_generation(question)
            return {'answer': answer, 'strategy': 'parametric', 'retrieval_count': 0}

        elif complexity == 'moderate':
            chunks = self._retrieve(question, index, k=5)
            answer = self._generate(question, chunks)
            return {'answer': answer, 'strategy': 'single-step', 'retrieval_count': 1}

        else:  # complex
            answer, iterations = self._multi_step_retrieval(question, index)
            return {'answer': answer, 'strategy': 'multi-step', 'retrieval_count': iterations}
`},{label:"Classifier",lang:"python",source:`def _classify_complexity(self, query: str) -> QueryComplexity:
    """
    Classify query complexity using a lightweight model (~1ms inference).

    Features:
    - query length (tokens)
    - question word type (what / how / why / explain)
    - named entity count
    - syntactic complexity (clause count)
    - ambiguity signals (multiple interpretations)
    """
    features = self._extract_features(query)
    complexity_score = self.complexity_classifier.predict_proba([features])[0]

    if complexity_score[0] > 0.7:      # Simple
        return 'simple'
    elif complexity_score[1] > 0.5:    # Moderate
        return 'moderate'
    else:                              # Complex
        return 'complex'
`},{label:"Adaptive search",lang:"python",source:`# Adaptive Vector Search Strategy

from typing import List, Literal

def adaptive_search(
    query_embedding: List[float],
    index: VectorIndex,
    complexity: Literal['simple', 'moderate', 'complex']
) -> List[str]:
    if complexity == 'simple':
        return []                                  # no retrieval
    elif complexity == 'moderate':
        results = index.search(query_embedding, k=5)
        return [r.text for r in results]
    else:  # complex
        results = index.search(query_embedding, k=3)  # start small, then iterate
        return [r.text for r in results]

# Cost comparison (example per-query costs):
#   simple (parametric):     $0.0001
#   moderate (single-step):  $0.0015
#   complex  (multi-step):   $0.0045
# Routing ~40% simple / ~45% single-step / ~15% multi-step
# drops the average from $0.0045 to ~$0.0012.
`},{label:"Generation",lang:"python",source:`# Adaptive Generation with Claude Sonnet 4

from anthropic import Anthropic
from typing import List, Optional

client = Anthropic()

def adaptive_generation(query: str, chunks: Optional[List[str]], strategy: str) -> str:
    if strategy == 'parametric':
        prompt = f"Answer concisely: {query}"
        max_tokens = 512
    elif strategy == 'single-step':
        context = "\\n\\n".join(f"[{i+1}] {c}" for i, c in enumerate(chunks))
        prompt = f"Context:\\n{context}\\n\\nQuestion: {query}\\n\\nAnswer:"
        max_tokens = 1024
    else:  # multi-step
        context = "\\n\\n".join(f"[{i+1}] {c}" for i, c in enumerate(chunks))
        prompt = f"""Synthesize a comprehensive answer addressing all aspects of the question.

Context (from {len(chunks)} chunks across multiple retrievals):
{context}

Question: {query}

Comprehensive answer:"""
        max_tokens = 2048

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}]
    )
    return response.content[0].text
`}];function m(){return e.jsx(t,{diagramTitle:"Adaptive-RAG pipeline (moderate-complexity route)",layout:i,insight:r,code:o,trace:s,chunks:n})}export{m as default};
