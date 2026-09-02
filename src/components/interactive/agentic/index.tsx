import { PipelineFigure } from '../PipelineFigure';
import { StepThrough, type Step } from '../StepThrough';
import { ReActTrace, type ReActEntry } from '../figures/ReActTrace';
import type { CodeTab } from '../CodeTabs';
import type { PipelineLayout } from '../pipeline';

const LAYOUT: PipelineLayout = {
  nodes: [
    { id: 'query', label: 'User Query', kind: 'input', x: 20, y: 90, w: 116, h: 60 },
    { id: 'agent', label: 'Agent Reason', kind: 'agent', x: 151, y: 90, w: 116, h: 60 },
    { id: 'vector', label: 'Vector Search', kind: 'tool', x: 282, y: 90, w: 116, h: 60 },
    { id: 'observe', label: 'Observe', kind: 'decision', x: 413, y: 90, w: 116, h: 60 },
    { id: 'web', label: 'Web Search', kind: 'tool', x: 544, y: 90, w: 116, h: 60 },
    { id: 'llm', label: 'LLM Generate', kind: 'llm', x: 675, y: 90, w: 116, h: 60 },
    { id: 'answer', label: 'Answer', kind: 'output', x: 806, y: 90, w: 116, h: 60 },
  ],
  edges: [
    { id: 'e1', from: 'query', to: 'agent' },
    { id: 'e2', from: 'agent', to: 'vector' },
    { id: 'e3', from: 'vector', to: 'observe' },
    { id: 'e4', from: 'observe', to: 'agent', fromSide: 'bottom', toSide: 'bottom', curve: 'loop-back', bend: 55 },
    { id: 'e5', from: 'agent', to: 'web', fromSide: 'top', toSide: 'top', curve: 'loop-back', bend: 95 },
    { id: 'e6', from: 'web', to: 'observe', fromSide: 'bottom', toSide: 'bottom', curve: 'loop-back', bend: 55 },
    { id: 'e7', from: 'observe', to: 'llm', fromSide: 'top', toSide: 'top', curve: 'loop-back', bend: 50 },
    { id: 'e8', from: 'llm', to: 'answer' },
  ],
};

const STEPS: Step[] = [
  { caption: 'Complex query arrives. Agent reasons about retrieval strategy.', activeNodeIds: ['query'], activeEdgeIds: [] },
  { caption: 'Agent decides to start with vector search.', activeNodeIds: ['agent'], activeEdgeIds: ['e1'] },
  { caption: 'Vector search executes. Results scored.', activeNodeIds: ['vector'], activeEdgeIds: ['e2'] },
  { caption: 'Agent evaluates results as stale and insufficient.', activeNodeIds: ['observe'], activeEdgeIds: ['e3'] },
  { caption: 'Agent switches to web search for current information.', activeNodeIds: ['agent'], activeEdgeIds: ['e4'] },
  { caption: 'Web search returns recent, high-quality results.', activeNodeIds: ['web'], activeEdgeIds: ['e5'] },
  { caption: 'Agent determines context is now sufficient.', activeNodeIds: ['observe'], activeEdgeIds: ['e6'] },
  { caption: 'LLM generates from multi-iteration context.', activeNodeIds: ['llm'], activeEdgeIds: ['e7'] },
  { caption: 'Answer from agent-driven retrieval loop.', activeNodeIds: ['answer'], activeEdgeIds: ['e8'] },
];

const REACT_TRACE: ReActEntry[] = [
  { iteration: 1, type: 'thought', content: 'The question asks about recent model performance benchmarks. I will start with the vector store.' },
  { iteration: 1, type: 'action', content: 'vector_search("transformer benchmark performance 2024")' },
  { iteration: 1, type: 'observation', content: '3 results. Scores: 0.71, 0.68, 0.61. Coverage seems incomplete — these chunks are from 2023 papers.' },
  { iteration: 2, type: 'thought', content: 'Results are stale. The corpus does not have 2024 benchmarks. I will try web search.' },
  { iteration: 2, type: 'action', content: 'web_search("transformer architecture benchmark 2024 paper")' },
  { iteration: 2, type: 'observation', content: '4 results. Higher relevance scores. Recent papers found. Context now sufficient.' },
  { iteration: 3, type: 'thought', content: 'I have sufficient context from both sources. Synthesizing final answer.' },
  { iteration: 3, type: 'action', content: 'synthesize(vector_results + web_results)' },
];

const CODE: CodeTab[] = [
  {
    label: 'Full pipeline',
    lang: 'python',
    source: `"""
Agentic RAG: ReAct loop with multi-tool access
"""
from typing import List, Dict, Any
from config import LLM_MODEL

class AgenticRAG:
    """Autonomous agent with dynamic retrieval"""

    def __init__(self):
        self.tools = {
            "vector_search": self.vector_search,
            "web_search": self.web_search,
        }
        self.max_iterations = 5

    def query(self, user_query: str) -> str:
        context = []
        for iteration in range(self.max_iterations):
            # Agent reasons and acts
            thought, action = self.reason(user_query, context)
            observation = self.act(action)

            # Check sufficiency
            is_sufficient = self.evaluate_sufficiency(observation, context)
            context.append(observation)

            if is_sufficient:
                break

        return self.generate(user_query, context)
`,
  },
  { label: 'Embeddings', lang: 'text', source: 'Same as Standard RAG.' },
  {
    label: 'ReAct loop',
    lang: 'python',
    source: `"""
ReAct: Reason + Act loop
"""
def reason(self, query: str, context: List[str]) -> tuple[str, Dict]:
    """Agent reasons about next action"""
    prompt = f"""Question: {query}

Context so far: {context}

What should I do next? Respond with:
Thought: [your reasoning]
Action: [tool_name](args)"""

    response = llm.generate(prompt)
    # Parse thought and action from response
    return parse_react_response(response)

def act(self, action: Dict) -> str:
    """Execute tool and return observation"""
    tool_name = action["tool"]
    args = action["args"]
    result = self.tools[tool_name](**args)
    return f"Observation: {result}"

def evaluate_sufficiency(self, obs: str, context: List) -> bool:
    """Agent decides if context is sufficient"""
    prompt = f"Given context: {context}\\nIs this sufficient? Yes/No"
    return "yes" in llm.generate(prompt).lower()
`,
  },
  {
    label: 'Generation',
    lang: 'python',
    source: `"""
Final generation with multi-iteration context
"""
def generate(self, query: str, context: List[str]) -> str:
    """Synthesize answer from agent observations"""
    all_context = "\\n\\n".join(context)
    prompt = f"""Use all gathered information to answer.

Observations:
{all_context}

Question: {query}

Answer:"""

    return llm.generate(prompt)
`,
  },
];

export default function AgenticInteractive() {
  return (
    <div className="flex flex-col gap-6">
      <StepThrough
        steps={STEPS}
        diagram={<PipelineFigure layout={LAYOUT} title="Agentic RAG pipeline" />}
        code={CODE}
      />
      <ReActTrace entries={REACT_TRACE} />
    </div>
  );
}
