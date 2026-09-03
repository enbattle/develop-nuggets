import{j as t}from"./index-CRkz_wSb.js";import{P as p}from"./CodeTabs-BPou1eix.js";import{S as l}from"./StepThrough-DBWvaL01.js";import"./CodeBlock-858lyf59.js";const a={openai:{x:200,y:70},"gpt-4":{x:105,y:180},microsoft:{x:295,y:180},copilot:{x:200,y:290}},c={1:"var(--color-node-retrieval)",2:"var(--color-node-decision)"};function h({nodes:i,edges:n,caption:s}){return t.jsxs("figure",{className:"m-0 overflow-x-auto rounded-lg border border-border bg-bg-secondary p-3",children:[t.jsxs("svg",{viewBox:"0 0 400 340",role:"img","aria-label":s??"Knowledge graph",className:"h-auto w-full min-w-[300px]",children:[n.map(e=>{const r=a[e.source.toLowerCase()],o=a[e.target.toLowerCase()];return!r||!o?null:t.jsxs("g",{children:[t.jsx("line",{x1:r.x,y1:r.y,x2:o.x,y2:o.y,stroke:c[e.hop],strokeWidth:e.hop===1?2:1.5,strokeDasharray:e.hop===2?"4 3":void 0}),t.jsx("text",{x:(r.x+o.x)/2,y:(r.y+o.y)/2-3,textAnchor:"middle",fontSize:9,fill:"var(--color-text-tertiary)",children:e.label})]},`${e.source}-${e.target}-${e.label}`)}),i.map(e=>{const r=a[e.id.toLowerCase()];return r?t.jsxs("g",{children:[t.jsx("circle",{cx:r.x,cy:r.y,r:26,fill:"var(--color-bg-tertiary)",stroke:"var(--color-border)",strokeWidth:2}),t.jsx("text",{x:r.x,y:r.y+4,textAnchor:"middle",fontSize:11,fontWeight:600,fill:"var(--color-text-primary)",children:e.label})]},e.id):null})]}),t.jsxs("figcaption",{className:"mt-2 text-xs text-text-tertiary",children:["Solid = 1-hop, dashed = 2-hop",s?` — ${s}`:""]})]})}const d={nodes:[{id:"query",label:"User Query",kind:"input",x:20,y:90,w:116,h:60},{id:"extract",label:"Extract Entities",kind:"decision",x:151,y:90,w:116,h:60},{id:"graph",label:"Build Graph",kind:"retrieval",x:282,y:90,w:116,h:60},{id:"hop1",label:"Hop 1 Traverse",kind:"retrieval",x:413,y:90,w:116,h:60},{id:"hop2",label:"Hop 2 Traverse",kind:"retrieval",x:544,y:90,w:116,h:60},{id:"llm",label:"LLM Generate",kind:"llm",x:675,y:90,w:116,h:60},{id:"answer",label:"Answer",kind:"output",x:806,y:90,w:116,h:60}],edges:[{id:"e1",from:"query",to:"extract"},{id:"e2",from:"extract",to:"graph"},{id:"e3",from:"graph",to:"hop1"},{id:"e4",from:"hop1",to:"hop2"},{id:"e5",from:"hop2",to:"llm"},{id:"e6",from:"llm",to:"answer"}]},u=[{id:"OpenAI",label:"OpenAI",type:"organization"},{id:"GPT-4",label:"GPT-4",type:"model"},{id:"Microsoft",label:"Microsoft",type:"organization"},{id:"Copilot",label:"Copilot",type:"product"}],f=[{source:"OpenAI",target:"GPT-4",label:"developed",hop:1},{source:"GPT-4",target:"Copilot",label:"powers",hop:1},{source:"Microsoft",target:"Copilot",label:"owns",hop:1},{source:"Microsoft",target:"OpenAI",label:"invested_in",hop:2},{source:"OpenAI",target:"Microsoft",label:"licensed_to",hop:2}],g=[{caption:'Relational query: "What is the relationship between GPT-4 and Microsoft Copilot?"',activeNodeIds:["query"],activeEdgeIds:[]},{caption:"Entity extraction identifies: OpenAI, GPT-4, Microsoft, Copilot.",activeNodeIds:["extract"],activeEdgeIds:["e1"]},{caption:"Entry point nodes located in knowledge graph.",activeNodeIds:["graph"],activeEdgeIds:["e2"]},{caption:"Hop 1: Direct neighbors retrieved. GPT-4 powers Copilot, Microsoft owns Copilot.",activeNodeIds:["hop1"],activeEdgeIds:["e3"]},{caption:"Hop 2: Indirect relationships. Microsoft invested in OpenAI, OpenAI licensed to Microsoft.",activeNodeIds:["hop2"],activeEdgeIds:["e4"]},{caption:"Generation with full relational context from graph traversal.",activeNodeIds:["llm"],activeEdgeIds:["e5"]},{caption:"Answer describes investment, licensing, and product dependencies.",activeNodeIds:["answer"],activeEdgeIds:["e6"]}],x=[{label:"Full pipeline",lang:"python",source:`"""
GraphRAG: Knowledge graph traversal for multi-hop reasoning
"""
from typing import List, Set
from config import LLM_MODEL, TOP_K

class GraphRAG:
    """Multi-hop retrieval using knowledge graph structure"""

    def __init__(self, graph_store):
        self.graph = graph_store  # Neo4j, NetworkX, etc.
        self.llm = anthropic.Anthropic()

    def query(self, user_query: str) -> str:
        # 1. Extract entities from query
        entities = self.extract_entities(user_query)

        # 2. Multi-hop graph traversal
        subgraph = self.traverse_graph(entities, hops=2)

        # 3. Rank relevant paths
        paths = self.rank_paths(user_query, subgraph)

        # 4. Generate from graph context
        return self.generate(user_query, paths[:TOP_K])
`},{label:"Entities & graph",lang:"python",source:`"""
Entity extraction and graph construction
"""
from config import LLM_MODEL

def extract_entities(self, query: str) -> List[str]:
    """Extract named entities from user query"""
    prompt = f"""Extract all named entities (people, places, organizations, concepts) from this query.

Query: {query}

Entities (comma-separated):"""

    response = self.llm.messages.create(
        model=LLM_MODEL,
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}]
    )

    entities = response.content[0].text.strip().split(',')
    return [e.strip() for e in entities]

def build_graph(documents: List[str]):
    """Build knowledge graph from document corpus"""
    # Extract entities and relationships using NER + RE
    # Create nodes (entities) and edges (relationships)
    # Store in graph database (Neo4j, etc.)
    pass
`},{label:"Traversal",lang:"python",source:`"""
Multi-hop graph traversal and path ranking
"""
from typing import Set, List, Tuple

def traverse_graph(
    self,
    start_entities: List[str],
    hops: int = 2
) -> Set[Tuple]:
    """
    Perform breadth-first traversal up to N hops.
    Returns subgraph of relevant entities and relationships.
    """
    visited = set()
    paths = []

    for entity in start_entities:
        current_paths = self._bfs_traverse(entity, hops)
        paths.extend(current_paths)
        visited.update(entity for path in current_paths for entity in path)

    return paths

def rank_paths(self, query: str, paths: List) -> List:
    """Rank paths by semantic similarity. Each path is a reasoning chain."""
    path_texts = [self._path_to_text(p) for p in paths]

    scores = []
    for i, text in enumerate(path_texts):
        score = semantic_similarity(query, text)
        scores.append((score, paths[i]))

    scores.sort(reverse=True)
    return [path for score, path in scores]
`},{label:"Generation",lang:"python",source:`"""
Generate answer from graph reasoning paths
"""
def generate(self, query: str, paths: List) -> str:
    """Synthesize answer from multi-hop reasoning paths"""

    context = []
    for i, path in enumerate(paths):
        path_text = " -> ".join([f"{node}[{rel}]" for node, rel in path])
        context.append(f"Path {i+1}: {path_text}")

    context_str = "\\n".join(context)

    prompt = f"""Use the following knowledge graph paths to answer the question.

Reasoning Paths:
{context_str}

Question: {query}

Answer:"""

    response = self.llm.messages.create(
        model=LLM_MODEL,
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    return response.content[0].text
`}];function b(){return t.jsxs("div",{className:"flex flex-col gap-6",children:[t.jsx(l,{steps:g,diagram:t.jsx(p,{layout:d,title:"GraphRAG pipeline"}),code:x}),t.jsx(h,{nodes:u,edges:f,caption:"the demo corpus graph traversed above"})]})}export{b as default};
