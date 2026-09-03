import{j as e}from"./index-CRkz_wSb.js";import{P as r}from"./CodeTabs-BPou1eix.js";import{S as t}from"./StepThrough-DBWvaL01.js";import"./CodeBlock-858lyf59.js";const a={nodes:[{id:"query",label:"User Query",kind:"input",x:20,y:90,w:116,h:60},{id:"retrieve",label:"Retrieve",kind:"retrieval",x:151,y:90,w:116,h:60},{id:"eval",label:"Evaluate",kind:"decision",x:282,y:90,w:116,h:60},{id:"route",label:"Route",kind:"decision",x:413,y:90,w:116,h:60},{id:"web",label:"Web Search",kind:"tool",x:544,y:90,w:116,h:60},{id:"llm",label:"LLM Generate",kind:"llm",x:675,y:90,w:116,h:60},{id:"answer",label:"Answer",kind:"output",x:806,y:90,w:116,h:60}],edges:[{id:"e1",from:"query",to:"retrieve"},{id:"e2",from:"retrieve",to:"eval"},{id:"e3",from:"eval",to:"route"},{id:"e4",from:"route",to:"web"},{id:"e5",from:"web",to:"llm"},{id:"e7",from:"llm",to:"answer"}]},s=[{caption:"Query arrives. CRAG will evaluate retrieval quality before using it.",activeNodeIds:["query"],activeEdgeIds:[]},{caption:"Initial vector retrieval executes. Results will be evaluated for quality.",detail:"ml-intro.pdf (0.41), neural-nets.md (0.38), preprocessing.md (0.31) — all broad, none on-topic.",activeNodeIds:["retrieve"],activeEdgeIds:["e1"]},{caption:"Evaluator scores each chunk against the query. Scores: 0.41, 0.38, 0.31 — all below the 0.75 threshold.",activeNodeIds:["eval"],activeEdgeIds:["e2"]},{caption:"Decision: INCORRECT. All chunks failed quality threshold. The fallback branch activates.",activeNodeIds:["route"],activeEdgeIds:["e3"]},{caption:"All 3 original chunks are rejected. Web search executes as fallback.",activeNodeIds:["web"],activeEdgeIds:["e4"]},{caption:"Web search returns fresh, high-quality results. LLM generates from these instead of the rejected chunks.",detail:"arxiv.org/crag-paper (0.89), research.ai/eval-rag (0.85), blog.ml/corrective-rag (0.82).",activeNodeIds:["llm"],activeEdgeIds:["e5"]},{caption:"Answer returned. Quality gate prevented a low-quality response that Standard RAG would have produced.",activeNodeIds:["answer"],activeEdgeIds:["e7"]}],i=[{label:"Full pipeline",lang:"python",source:`"""
Corrective RAG: Quality gate with web search fallback
"""
from typing import List, Literal
from dataclasses import dataclass
from config import RELEVANCE_THRESHOLD, LLM_MODEL

@dataclass
class EvalResult:
    score: float
    decision: Literal["CORRECT", "AMBIGUOUS", "INCORRECT"]

class CorrectiveRAG:
    """CRAG with quality evaluation and routing"""

    def query(self, user_query: str) -> str:
        # Initial retrieval
        chunks = self.retrieve(user_query)

        # Evaluate quality
        eval_results = [self.evaluate(user_query, c) for c in chunks]
        decision = self.route(eval_results)

        # Route based on quality
        if decision == "INCORRECT":
            # Discard all, use web search
            chunks = self.web_search(user_query)
        elif decision == "AMBIGUOUS":
            # Supplement with web search
            web_chunks = self.web_search(user_query)
            chunks.extend(web_chunks)
        # CORRECT: use as-is

        return self.generate(user_query, chunks)
`},{label:"Embeddings",lang:"text",source:"Same as Standard RAG."},{label:"Evaluate & route",lang:"python",source:`"""
Quality evaluation and routing logic
"""
from config import RELEVANCE_THRESHOLD

def evaluate(self, query: str, chunk: str) -> EvalResult:
    """Lightweight classifier scores chunk relevance"""
    score = self.classifier.score(query, chunk)

    if score >= RELEVANCE_THRESHOLD:
        decision = "CORRECT"
    elif score >= 0.5:
        decision = "AMBIGUOUS"
    else:
        decision = "INCORRECT"

    return EvalResult(score=score, decision=decision)

def route(self, eval_results: List[EvalResult]) -> str:
    """Aggregate chunk scores into routing decision"""
    if all(r.decision == "INCORRECT" for r in eval_results):
        return "INCORRECT"
    elif all(r.decision == "CORRECT" for r in eval_results):
        return "CORRECT"
    else:
        return "AMBIGUOUS"
`},{label:"Generation",lang:"python",source:`"""
Web search fallback for low-quality retrieval
"""
def web_search(self, query: str) -> List[str]:
    """Live search API for fresh information"""
    results = search_api.query(query, num_results=5)
    return [r.content for r in results]

def generate(self, query: str, chunks: List[str]) -> str:
    """Generate from quality-filtered context"""
    context = "\\n\\n".join(f"[{i+1}] {c}" for i, c in enumerate(chunks))
    return llm.generate(f"Context:\\n{context}\\n\\nQuestion: {query}")
`}];function u(){return e.jsx(t,{steps:s,diagram:e.jsx(r,{layout:a,title:"Corrective RAG pipeline"}),code:i})}export{u as default};
