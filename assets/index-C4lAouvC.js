import{j as e}from"./index-CRkz_wSb.js";import{P as r}from"./PipelineSummary-CsREO7hE.js";import"./CodeTabs-BPou1eix.js";import"./CodeBlock-858lyf59.js";const t={nodes:[{id:"query",label:"User Query",kind:"input",x:20,y:90,w:105,h:60},{id:"expand",label:"Expand Queries",kind:"llm",x:143,y:90,w:105,h:60},{id:"retrieve-1",label:"Retrieve v1",kind:"retrieval",x:266,y:11,w:95,h:44},{id:"retrieve-2",label:"Retrieve v2",kind:"retrieval",x:266,y:69,w:95,h:44},{id:"retrieve-3",label:"Retrieve v3",kind:"retrieval",x:266,y:127,w:95,h:44},{id:"retrieve-4",label:"Retrieve v4",kind:"retrieval",x:266,y:185,w:95,h:44},{id:"rrf",label:"RRF Fusion",kind:"retrieval",x:379,y:90,w:105,h:60},{id:"top-k",label:"Top-K Select",kind:"retrieval",x:502,y:90,w:105,h:60},{id:"llm",label:"LLM Generate",kind:"llm",x:625,y:90,w:105,h:60},{id:"answer",label:"Answer",kind:"output",x:748,y:90,w:105,h:60}],edges:[{id:"e1",from:"query",to:"expand"},{id:"e2",from:"expand",to:"retrieve-1"},{id:"e3-2",from:"expand",to:"retrieve-2",activeWhen:["e3"]},{id:"e3-3",from:"expand",to:"retrieve-3",activeWhen:["e3"]},{id:"e3-4",from:"expand",to:"retrieve-4",activeWhen:["e3"]},{id:"e4-1",from:"retrieve-1",to:"rrf",activeWhen:["e4"]},{id:"e4-2",from:"retrieve-2",to:"rrf",activeWhen:["e4"]},{id:"e4-3",from:"retrieve-3",to:"rrf",activeWhen:["e4"]},{id:"e4-4",from:"retrieve-4",to:"rrf",activeWhen:["e4"]},{id:"e5",from:"rrf",to:"top-k"},{id:"e6",from:"top-k",to:"llm"},{id:"e7",from:"llm",to:"answer"}]},n="Single-query retrieval is biased toward the exact phrasing used. RAG Fusion treats retrieval as a sampling problem: generate N queries, retrieve N result sets, then let Reciprocal Rank Fusion reward documents that rank well across multiple phrasings. Genuinely relevant documents appear consistently; lucky retrievals from a single phrasing are diluted.",i=['Query arrives: "How do transformer attention mechanisms work?" It will not be embedded once.',"An LLM generates 3 query variants, each targeting a different slice of the document space (self-attention, QKV matrices, multi-head attention).","Retrieval 1 of 4 — the original query. Top-5 by vector similarity; strong signal on the core attention mechanism.",'Retrievals 2-4 run with the variants. Variant 2 surfaces a new "QKV matrix" document; Variant 3 surfaces a new "attention heads" document — both missed by the original query.',"Reciprocal Rank Fusion scores each document: RRF(d) = Σ 1 / (k + rank), with k = 60.","Top-5 by RRF score. The QKV and attention-heads documents now rank 3rd and 4th; noise from a single retrieval is suppressed.","The LLM generates from the RRF-fused top-5 — broader and more complete than the original query alone.","Answer returned. ~3x the cost of single-query RAG, but recall improved from ~65% to ~79% on this class of query."],s=[{rank:1,source:"attention-paper.pdf",score:.066,content:"Transformer architecture uses self-attention... (RRF 0.066 — ranked 1st in 3 of 4 queries)"},{rank:2,source:"transformers.pdf",score:.061,content:"Multi-head attention projects queries, keys, and values into subspaces... (top-3 in all 4 queries)"},{rank:3,source:"qkv-matrices.md",score:.049,content:"The query matrix Q, key matrix K, and value matrix V are learned linear projections... (only surfaced by variants)"},{rank:4,source:"attention-heads.md",score:.044,content:"Each attention head learns to focus on different syntactic and semantic relationships... (consistent across variant retrievals)"},{rank:5,source:"attention-math.md",score:.041,content:"Scaled dot-product attention: softmax(QKᵀ / √dₖ)V... (mid-rank in 3 of 4 retrievals)"}],a=[{label:"Full pipeline",lang:"python",source:`"""
RAG Fusion: Multi-Query Retrieval with Reciprocal Rank Fusion
"""
from config import EMBEDDING_MODEL, LLM_MODEL, TOP_K

class RAGFusion:
    """Generate query variants, retrieve for each, fuse with RRF."""

    def query(self, user_query: str, n_variants: int = 3) -> str:
        # 1. Generate query variants
        queries = self.expand_query(user_query, n=n_variants)
        all_queries = [user_query] + queries

        # 2. Retrieve independently for each query
        result_lists = [self.retrieve(q, k=TOP_K) for q in all_queries]

        # 3. Fuse rankings with Reciprocal Rank Fusion
        fused = self.reciprocal_rank_fusion(result_lists)

        # 4. Generate from top-K fused results
        top_chunks = [doc for doc, _ in fused[:TOP_K]]
        return self.generate(user_query, top_chunks)
`},{label:"Query expansion",lang:"python",source:`"""
RAG Fusion: Query expansion via LLM
"""
from config import LLM_MODEL

def expand_query(self, query: str, n: int = 3) -> list[str]:
    """Generate semantically diverse query reformulations."""
    import anthropic
    client = anthropic.Anthropic()

    response = client.messages.create(
        model=LLM_MODEL,
        max_tokens=256,
        messages=[{
            "role": "user",
            "content": f"""Generate {n} search query variants for this question.
Each should use different vocabulary or angle to find relevant documents.
Return only the queries, one per line — no numbering or explanation.

Question: {query}"""
        }]
    )

    lines = response.content[0].text.strip().split("\\n")
    return [line.strip() for line in lines if line.strip()][:n]
`},{label:"RRF",lang:"python",source:`"""
RAG Fusion: Per-query retrieval + Reciprocal Rank Fusion
"""
import voyageai
from config import EMBEDDING_MODEL

def retrieve(self, query: str, k: int) -> list:
    """Standard single-query vector retrieval."""
    client = voyageai.Client()
    result = client.embed(texts=[query], model=EMBEDDING_MODEL, input_type="query")
    return self.vector_index.search(result.embeddings[0], top_k=k)

def reciprocal_rank_fusion(self, ranked_lists: list[list], k: int = 60) -> list[tuple]:
    """
    RRF: score(doc) = sum(1 / (k + rank(doc, list))) across all lists.
    k=60 dampens sensitivity to exact rank while rewarding top placements.
    """
    scores: dict[str, float] = {}
    doc_map: dict[str, object] = {}

    for ranked_list in ranked_lists:
        for rank, doc in enumerate(ranked_list, start=1):
            scores[doc.id] = scores.get(doc.id, 0.0) + 1.0 / (k + rank)
            doc_map[doc.id] = doc

    sorted_ids = sorted(scores, key=scores.__getitem__, reverse=True)
    return [(doc_map[doc_id], scores[doc_id]) for doc_id in sorted_ids]
`},{label:"Generation",lang:"python",source:`"""
RAG Fusion: Final generation from fused context
"""
def generate(self, original_query: str, chunks: list) -> str:
    """Generate from the RRF-ranked top-K chunks. Always answer the ORIGINAL query."""
    import anthropic
    client = anthropic.Anthropic()

    context = "\\n\\n".join([f"[{i+1}] {chunk.content}" for i, chunk in enumerate(chunks)])

    response = client.messages.create(
        model=LLM_MODEL,
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""Use the provided context to answer the question.
Synthesize across multiple passages where relevant.

Context:
{context}

Question: {original_query}

Answer:"""
        }]
    )
    return response.content[0].text
`}];function d(){return e.jsx(r,{diagramTitle:"RAG Fusion pipeline",layout:t,insight:n,code:a,trace:i,chunks:s})}export{d as default};
