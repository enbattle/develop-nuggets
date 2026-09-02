## Observability & Tracing

Agent runs are non-deterministic multi-step processes. Without observability, a failure is a black box: you know the output was wrong but not which step failed, what the LLM was seeing at that moment, or why it chose that tool call. Tracing makes every decision visible and reproducible.

## The Three Pillars for Agents

| Pillar | What to capture | Why it matters |
|--------|-----------------|----------------|
| **Traces** | Span tree: LLM calls, tool calls, latency, tokens | Understand the full execution path |
| **Logs** | Structured events at each step | Debug individual decisions |
| **Metrics** | Cost, latency, success rate, retry count | Detect regressions, set alerts |

## Span Structure

Model each agent run as a root span with child spans for every LLM call and tool call:

```
agent_run [run_id=abc, goal="...", duration=12.4s]
  ├── llm_call [model=claude-sonnet-4-6, tokens_in=1420, tokens_out=312, latency=1.2s]
  │     └── tool_call [name=search_web, query="...", latency=0.8s, status=ok]
  ├── llm_call [tokens_in=1890, tokens_out=520, latency=1.5s]
  │     └── tool_call [name=run_code, latency=2.1s, status=ok]
  └── llm_call [tokens_in=2310, tokens_out=890, latency=1.7s, stop=end_turn]
```

## Implementing with OpenTelemetry

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter

# Setup — once at app startup
provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer("agent.orchestration")

def run_agent_with_tracing(goal: str, run_id: str):
    with tracer.start_as_current_span("agent_run") as root:
        root.set_attribute("run_id", run_id)
        root.set_attribute("goal", goal)

        for step in agent_loop(goal):
            with tracer.start_as_current_span("llm_call") as llm_span:
                llm_span.set_attribute("model", "claude-sonnet-4-6")
                llm_span.set_attribute("tokens_in", step.input_tokens)

                response = call_llm(step.messages)
                llm_span.set_attribute("tokens_out", response.usage.output_tokens)

                if response.tool_calls:
                    for tc in response.tool_calls:
                        with tracer.start_as_current_span("tool_call") as tool_span:
                            tool_span.set_attribute("tool.name", tc.name)
                            result = dispatch_tool(tc)
                            tool_span.set_attribute("tool.status", result.status)
```

## Anthropic Native Tracing

Claude's API returns token usage per call. Capture it alongside your spans:

```python
import anthropic

client = anthropic.Anthropic()

def traced_llm_call(messages: list, run_id: str) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=messages,
    )
    # Structured log — goes to your log aggregator
    metrics_log({
        "event":       "llm_call",
        "run_id":      run_id,
        "model":       response.model,
        "tokens_in":   response.usage.input_tokens,
        "tokens_out":  response.usage.output_tokens,
        "stop_reason": response.stop_reason,
        "cost_usd":    estimate_cost(response.usage),
    })
    return response
```

## Cost Attribution

Track cost per run so you can set budgets and detect runaway loops:

```python
# claude-sonnet-4-6 pricing (check Anthropic pricing page for current rates)
COST_PER_1K_INPUT  = 0.003   # USD
COST_PER_1K_OUTPUT = 0.015   # USD

def estimate_cost(usage) -> float:
    return (
        usage.input_tokens  / 1000 * COST_PER_1K_INPUT +
        usage.output_tokens / 1000 * COST_PER_1K_OUTPUT
    )

MAX_RUN_COST_USD = 1.00   # Kill switch

def check_budget(state: AgentState):
    total_cost = sum(s["cost_usd"] for s in state.llm_calls)
    if total_cost > MAX_RUN_COST_USD:
        raise BudgetExceeded(f"Run {state.run_id} exceeded ${MAX_RUN_COST_USD:.2f} limit")
```

## Managed Observability Platforms

| Platform | Strengths | Setup |
|----------|-----------|-------|
| **LangSmith** | LangChain/LangGraph native, prompt debugging | `LANGCHAIN_TRACING_V2=true` env var |
| **Weights & Biases** | ML-native, rich experiment tracking | `wandb.init()` + callback |
| **Datadog** | Full-stack observability, alerting | OTLP exporter |
| **Helicone** | LLM-specific, cost analytics, prompt caching stats | Proxy URL swap |

For new projects, start with **LangSmith** (lowest setup for Python agents) and migrate to a full-stack solution when you have SLA requirements.
