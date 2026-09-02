Agent-orchestration frameworks fall into three groups: **graph-based**, **code-first**, and **cloud-managed**. Which one fits depends on whether you need fine-grained control, rapid iteration, or managed infrastructure.

## Graph-Based: LangGraph

LangGraph models agent logic as a directed graph of nodes (LLM calls or tools) and edges (routing conditions). State flows through the graph and is persisted at each node.

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    messages: list
    tool_results: list
    iteration: int

def should_continue(state: AgentState) -> str:
    if state["iteration"] >= 10:
        return END
    last_msg = state["messages"][-1]
    return "tools" if last_msg.tool_calls else END

graph = StateGraph(AgentState)
graph.add_node("agent", call_llm)
graph.add_node("tools", run_tools)
graph.add_conditional_edges("agent", should_continue)
graph.add_edge("tools", "agent")
graph.set_entry_point("agent")

app = graph.compile(checkpointer=SqliteSaver())
```

**Strengths**: Explicit control flow, built-in checkpointing, human-in-the-loop support, streaming
**Best for**: Complex multi-step workflows where you need to see and control exactly what happens at each step

## Code-First: Claude Agent SDK / Agents SDK

Anthropic's Agent SDK wraps the API with a clean async runner:

```python
import anthropic
from anthropic.agents import Agent, tool

@tool
def search_web(query: str) -> str:
    """Search the web and return relevant results."""
    return web_search(query)

@tool
def run_code(code: str, language: str = "python") -> str:
    """Execute code in a sandboxed environment."""
    return sandbox.run(code, language)

agent = Agent(
    model="claude-sonnet-4-6",
    tools=[search_web, run_code],
    system="You are a research assistant. Use tools to answer questions accurately.",
    max_iterations=15,
)

result = await agent.run("Compare transformer vs Mamba architectures")
```

**Strengths**: Minimal boilerplate, native Claude tool use, async-first
**Best for**: Straightforward agent tasks, rapid prototyping, Claude-native apps

## Cloud-Managed: Amazon Bedrock Agents / Vertex AI

Managed services abstract the loop entirely — you define tools and the platform handles orchestration, retries, and state:

```python
# Bedrock Agents — define action groups, not loops
import boto3

bedrock = boto3.client("bedrock-agent-runtime")

response = bedrock.invoke_agent(
    agentId="ABCDEF",
    agentAliasId="TSTALIASID",
    sessionId="my-session-123",
    inputText="Analyze Q3 revenue and flag anomalies",
)
```

**Strengths**: No infrastructure, built-in scaling, IAM auth, CloudWatch integration
**Best for**: Enterprise deployments where ops burden matters more than control

## Comparison Matrix

| Framework | Control | Setup | Parallelism | HitL | Cost |
|-----------|---------|-------|-------------|------|------|
| LangGraph | High | Medium | Fan-out nodes | Native | Self-hosted |
| Agent SDK | Medium | Low | Async tasks | Manual | API only |
| Bedrock | Low | Low | Managed | Approval nodes | Per-call |
| CrewAI | Medium | Low | Role-based | Limited | Self-hosted |

## Decision Guide

- **Need full control + complex routing** → LangGraph
- **Clean Claude integration + rapid iteration** → Agent SDK
- **Enterprise ops + AWS/GCP ecosystem** → Bedrock / Vertex
- **Role-based multi-agent teams** → CrewAI
- **Research / custom requirements** → Build on raw API
